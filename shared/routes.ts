import { z } from 'zod';

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  internal: z.object({ message: z.string() }),
};

const hospitalWeightSchema = z.object({
  hospital: z.string(),
  values: z.array(z.number()),
  accuracy: z.number().optional(),
  loss: z.number().optional(),
});

export const api = {
  datasets: {
    list: {
      method: 'GET' as const,
      path: '/api/datasets' as const,
      responses: {
        200: z.array(z.object({
          id: z.number(), name: z.string(), description: z.string(),
          samples: z.number(), file: z.string()
        })),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/datasets/:name' as const,
      responses: {
        200: z.object({ columns: z.array(z.string()), rows: z.array(z.any()), stats: z.any() }),
        404: errorSchemas.notFound,
      }
    },
    download: {
      method: 'GET' as const,
      path: '/api/datasets/:name/download' as const,
      responses: { 200: z.any() }
    }
  },
  training: {
    start: {
      method: 'POST' as const,
      path: '/api/start-training' as const,
      input: z.object({ dataset: z.string() }),
      responses: { 200: z.object({ message: z.string() }) },
    },
    status: {
      method: 'GET' as const,
      path: '/api/model-status' as const,
      responses: {
        200: z.object({
          round: z.number(),
          accuracy: z.number(),
          loss: z.number().optional(),
          status: z.string(),
          hospitalsCount: z.number(),
          dataset: z.string().optional(),
          weights: z.array(hospitalWeightSchema).optional(),
          hospitalAccuracies: z.array(z.number()).optional(),
          history: z.array(z.object({
            round: z.number(),
            accuracy: z.number(),
            loss: z.number().optional(),
          })).optional(),
        }),
      },
    },
    reset: {
      method: 'POST' as const,
      path: '/api/reset-training' as const,
      responses: { 200: z.object({ message: z.string() }) },
    },
    downloadModel: {
      method: 'GET' as const,
      path: '/api/download-model' as const,
      responses: { 200: z.any() }
    }
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) url = url.replace(`:${key}`, String(value));
    });
  }
  return url;
}
