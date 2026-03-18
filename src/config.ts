export const ENV_CONFIG = {
  test: {
    url: "https://fmcfsrjmzxszvljrotcq.supabase.co/functions/v1/admin-review-organizer",
    label: "Test",
    icon: "⚠",
  },
  prod: {
    url: "https://amagauaqdzxogrgmzogq.supabase.co/functions/v1/admin-review-organizer",
    label: "Production",
    icon: "●",
  },
} as const;

export type EnvKey = keyof typeof ENV_CONFIG;

export const TEST_ADMIN_SECRET = "test";
