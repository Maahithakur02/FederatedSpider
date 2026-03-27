import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useDatasets as useDatasetsOriginal } from "@/hooks/use-datasets";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Database, Table, Download, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function Datasets() {
  const { data: datasets, isLoading, isError } = useDatasetsOriginal();
  const [selectedDataset, setSelectedDataset] = useState<string | null>(null);

  const { data: details, isLoading: loadingDetails } = useQuery({
    queryKey: ['/api/datasets', selectedDataset],
    enabled: !!selectedDataset,
    queryFn: async () => {
      const res = await fetch(`/api/datasets/${selectedDataset}`);
      if (!res.ok) throw new Error("Failed to fetch");
      return res.json();
    }
  });

  return (
    <section id="datasets" className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-primary/20 mb-6">
            <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
            <span className="text-xs font-mono text-primary tracking-widest uppercase">Synthetic Medical Data</span>
          </div>
          <h2 className="text-3xl md:text-5xl font-display font-bold text-foreground mb-4">
            Participating Datasets
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            5,000-sample synthetic medical datasets. Each simulates data from a separate hospital node. Click to explore, preview statistics, and download.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 rounded-2xl bg-card/50 animate-pulse border border-white/5"></div>
            ))}
          </div>
        ) : isError ? (
          <div className="p-8 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-center">
            Failed to load datasets.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {datasets?.map((dataset, i) => (
              <div
                key={dataset.id}
                className="glass-panel p-6 rounded-2xl group hover:-translate-y-1 hover:border-primary/30 transition-all duration-300 flex flex-col cursor-pointer"
                onClick={() => setSelectedDataset(dataset.file.replace('.csv', ''))}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Database className="w-6 h-6" />
                  </div>
                  <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold border border-primary/20">
                    CSV Ready
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-foreground mb-2">{dataset.name}</h3>
                <p className="text-sm text-muted-foreground mb-6 flex-grow">{dataset.description}</p>
                
                <div className="pt-4 border-t border-white/10 flex items-center justify-between text-sm">
                  <span className="font-mono font-bold text-foreground">
                    {dataset.samples.toLocaleString()} Samples
                  </span>
                  <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">Explore →</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={!!selectedDataset} onOpenChange={() => setSelectedDataset(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col bg-card border-border">
          <DialogHeader className="flex flex-row items-center justify-between gap-4">
            <DialogTitle className="flex items-center gap-2 truncate">
              <Table className="w-5 h-5 text-primary shrink-0" />
              Dataset: {selectedDataset?.replace('_', ' ').toUpperCase()}
            </DialogTitle>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                window.location.href = `/api/datasets/${selectedDataset}/download`;
              }}
              className="flex items-center gap-2 px-3 py-1.5 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90 shrink-0 mr-6"
            >
              <Download className="w-4 h-4" /> Download
            </button>
          </DialogHeader>
          
          <div className="flex-1 overflow-auto mt-4 border border-white/10 rounded-lg">
            {loadingDetails ? (
              <div className="p-8 text-center text-muted-foreground animate-pulse">Loading data...</div>
            ) : details?.rows ? (
              <table className="w-full text-xs text-left">
                <thead className="sticky top-0 bg-secondary text-foreground font-bold border-b border-white/10">
                  <tr>
                    {details.columns.map((col: string) => (
                      <th key={col} className="px-3 py-2 whitespace-nowrap">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {details.rows.map((row: any[], i: number) => (
                    <tr key={i} className="hover:bg-white/5">
                      {row.map((val: any, j: number) => (
                        <td key={j} className="px-3 py-2 font-mono">{typeof val === 'number' ? val.toFixed(2) : val}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="p-8 text-center text-red-400">Error loading data.</div>
            )}
          </div>

          <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
            <h4 className="text-sm font-bold mb-2">Dataset Statistics</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[10px] font-mono">
              {details?.stats && Object.keys(details.stats).slice(0, 4).map(key => (
                <div key={key} className="bg-background/40 p-2 rounded border border-white/5 overflow-hidden">
                  <div className="text-primary mb-1 uppercase truncate">{key}</div>
                  {Object.entries(details.stats[key]).slice(0, 4).map(([stat, val]: [string, any]) => (
                    <div key={stat} className="flex justify-between">
                      <span className="text-muted-foreground">{stat}:</span>
                      <span>{typeof val === 'number' ? val.toFixed(1) : val}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
