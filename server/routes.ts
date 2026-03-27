import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { spawn } from "child_process";
import path from "path";
import fs from "fs";

interface SimulationState {
  round: number;
  accuracy: number;
  loss: number;
  status: string;
  hospitalsCount: number;
  isTraining: boolean;
  weights: any[];
  dataset: string;
  hospitalAccuracies: number[];
  history: { round: number; accuracy: number; loss: number }[];
}

let simulationState: SimulationState = {
  round: 0, accuracy: 0.0, loss: 0.0, status: "Idle",
  hospitalsCount: 3, isTraining: false, weights: [],
  dataset: "", hospitalAccuracies: [], history: [],
};

export async function registerRoutes(httpServer: Server, app: Express): Promise<Server> {

  app.get(api.datasets.list.path, async (req, res) => {
    res.json(await storage.getDatasets());
  });

  app.get("/api/datasets/:name", (req, res) => {
    const name = req.params.name;
    const proc = spawn('python3', ['-c', `
import pandas as pd, json, sys
try:
    df = pd.read_csv('datasets/${name}.csv')
    print(json.dumps({"columns": df.columns.tolist(), "rows": df.head(100).values.tolist(), "stats": df.describe().to_dict()}))
except Exception as e:
    print(json.dumps({"error": str(e)}))
`]);
    let data = '';
    proc.stdout.on('data', (c) => data += c);
    proc.on('close', () => {
      try {
        const r = JSON.parse(data);
        if (r.error) return res.status(404).json({ message: r.error });
        res.json(r);
      } catch { res.status(500).json({ message: "Error" }); }
    });
  });

  app.get("/api/datasets/:name/download", (req, res) => {
    const fp = path.join(process.cwd(), 'datasets', `${req.params.name}.csv`);
    fs.existsSync(fp) ? res.download(fp) : res.status(404).json({ message: "Not found" });
  });

  app.post(api.training.start.path, (req, res) => {
    if (simulationState.isTraining) return res.json({ message: "Already training." });

    const { dataset } = req.body;
    simulationState = {
      round: 0, accuracy: 0, loss: 0, status: "Initializing...",
      hospitalsCount: 3, isTraining: true, weights: [],
      dataset, hospitalAccuracies: [], history: [],
    };

    const pythonCommand = process.env.PYTHON || process.env.PYTHON3 || 'python3';
    const proc = spawn(pythonCommand, ['federated_learning.py', dataset]);
    let buffer = '';

    proc.on('error', (err) => {
      console.error('Training process failed to start:', err);
      // Fallback on Windows where python3 might not exist
      if (pythonCommand !== 'python') {
        const fallback = 'python';
        console.warn(`Falling back to ${fallback}`);
        const fallbackProc = spawn(fallback, ['federated_learning.py', dataset]);
        if (!fallbackProc) {
          simulationState.isTraining = false;
          simulationState.status = 'Failed to start training process';
          return;
        }

        fallbackProc.stdout.on('data', (chunk) => handleProcessOutput(chunk));
        fallbackProc.stderr.on('data', (chunk) => console.error('Training stderr:', chunk.toString()));
        fallbackProc.on('close', (code) => {
          simulationState.isTraining = false;
          simulationState.status = code === 0 ? 'Completed' : `Failed (exit ${code})`;
        });
      } else {
        simulationState.isTraining = false;
        simulationState.status = 'Failed to start training process';
      }
    });

    function handleProcessOutput(chunk: any) {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) {
        if (!line.trim()) continue;
        try {
          const update = JSON.parse(line);
          simulationState = { ...simulationState, ...update };
          // Build history when we get a real accuracy update
          if (update.accuracy && update.round && update.status === 'Global model updated') {
            const existing = simulationState.history.findIndex(h => h.round === update.round);
            const entry = { round: update.round, accuracy: update.accuracy, loss: update.loss || 0 };
            if (existing >= 0) {
              simulationState.history[existing] = entry;
            } else {
              simulationState.history = [...simulationState.history, entry];
            }
          }
        } catch (e) {
          console.warn('Skipping non-json training output:', line);
        }
      }
    }

    proc.stdout.on('data', handleProcessOutput);
    proc.stderr.on('data', (chunk) => console.error('Training stderr:', chunk.toString()));

    proc.on('close', (code) => {
      simulationState.isTraining = false;
      simulationState.status = code === 0 ? 'Completed' : `Failed (exit ${code})`;
    });

    res.json({ message: "Simulation started." });
  });

  app.get(api.training.status.path, (_req, res) => res.json(simulationState));

  app.post(api.training.reset.path, (_req, res) => {
    simulationState = {
      round: 0, accuracy: 0, loss: 0, status: "Idle",
      hospitalsCount: 3, isTraining: false, weights: [],
      dataset: "", hospitalAccuracies: [], history: [],
    };
    res.json({ message: "Reset." });
  });

  app.get("/api/download-model", (_req, res) => {
    const fp = path.join(process.cwd(), 'models', 'global_model.pkl');
    fs.existsSync(fp) ? res.download(fp) : res.status(404).json({ message: "Model not ready yet." });
  });

  return httpServer;
}
