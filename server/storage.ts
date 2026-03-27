import type { Dataset } from "@shared/schema";

export interface IStorage {
  getDatasets(): Promise<(Dataset & { file: string })[]>;
}

export class MemStorage implements IStorage {
  private datasets: (Dataset & { file: string })[];

  constructor() {
    this.datasets = [
      {
        id: 1,
        name: "Heart Disease Dataset",
        description: "Clinical data for predicting heart disease presence.",
        samples: 5000,
        file: "heart_disease.csv"
      },
      {
        id: 2,
        name: "Diabetes Dataset",
        description: "Patient records for early-stage diabetes risk prediction.",
        samples: 5000,
        file: "diabetes.csv"
      },
      {
        id: 3,
        name: "Breast Cancer Dataset",
        description: "Features computed from a digitized image of a fine needle aspirate (FNA) of a breast mass.",
        samples: 5000,
        file: "breast_cancer.csv"
      },
      {
        id: 4,
        name: "Stroke Dataset",
        description: "Predict whether a patient is likely to get stroke based on various parameters.",
        samples: 5000,
        file: "stroke.csv"
      }
    ];
  }

  async getDatasets(): Promise<(Dataset & { file: string })[]> {
    return this.datasets;
  }
}

export const storage = new MemStorage();
