## Packages
framer-motion | Page transitions and scroll-triggered animations
recharts | Dashboard analytics charts for live model accuracy history
lucide-react | Icons for architecture and feature steps

## Notes
Tailwind Config - extend fontFamily:
fontFamily: {
  sans: ["var(--font-sans)"],
  display: ["var(--font-display)"],
}

The frontend expects backend to handle /api/start-training, /api/model-status, and /api/reset-training for the simulation lifecycle.
Status polling is implemented using TanStack Query, polling every 1s while status is not 'Idle' or 'Completed'.
