export type ErrorMode = '400' | '401' | '403' | '404' | '409' | '500' | 'timeout' | null;
export type PaymentMode = 'confirmed' | 'declined' | 'timeout';

export interface ScenarioConfig {
  latencyMs: number;
  errorMode: ErrorMode;
  paymentMode: PaymentMode;
  simulateOutOfOrder: boolean;
}

const DEFAULT_SCENARIO: ScenarioConfig = {
  latencyMs: 150,
  errorMode: null,
  paymentMode: 'confirmed',
  simulateOutOfOrder: false,
};

const STORAGE_KEY = '__kurio_scenario_config__';

export function getScenarioConfig(): ScenarioConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_SCENARIO };
    return { ...DEFAULT_SCENARIO, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULT_SCENARIO };
  }
}

export function setScenarioConfig(config: Partial<ScenarioConfig>): ScenarioConfig {
  const current = getScenarioConfig();
  const updated = { ...current, ...config };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  } catch {
    // Silently continue if storage fails
  }
  return updated;
}

export function resetScenarioConfig(): ScenarioConfig {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Silently continue
  }
  return { ...DEFAULT_SCENARIO };
}
