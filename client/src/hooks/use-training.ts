import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { z } from "zod";

const statusSchema = api.training.status.responses[200];

export function useTrainingStatus() {
  return useQuery({
    queryKey: [api.training.status.path],
    queryFn: async () => {
      const res = await fetch(api.training.status.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch training status");
      return res.json();
    },
    refetchInterval: (query) => {
      const data = query.state.data;
      if (!data || data.status === "Idle" || data.status === "Completed") return false;
      return 800;
    },
  });
}

export function useStartTraining() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: z.infer<typeof api.training.start.input>) => {
      const res = await fetch(api.training.start.path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to start training");
      return res.json();
    },
    onSuccess: () => {
      // Immediately start polling
      queryClient.invalidateQueries({ queryKey: [api.training.status.path] });
    },
  });
}

export function useResetTraining() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.training.reset.path, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to reset");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.training.status.path] });
    },
  });
}
