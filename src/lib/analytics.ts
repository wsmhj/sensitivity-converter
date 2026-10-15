export type AnalyticsStatus = {
  enabled: boolean;
  configured: boolean;
  site_id: string | null;
  configuration: { environment: string; website_id: string; [key: string]: unknown } | null;
  queued: number;
  dropped: number;
};
declare global {
  interface Window {
    WebAnalytics?: {
      track: (name: string, properties?: Record<string, string | number | boolean>) => void;
      setConsent: (value: boolean) => void;
      status: () => AnalyticsStatus;
      flush: () => Promise<void>;
    };
  }
}
export type Feature =
  | 'aim_test'
  | 'conversion'
  | 'copy_result'
  | 'share_settings'
  | 'profile_save'
  | 'profile_import'
  | 'reverse_conversion';
export function aimEvent(
  action: 'started' | 'resumed' | 'paused' | 'abandoned' | 'closed' | 'reset' | 'trial_applied',
  mode: 'quick' | 'precision' | 'tracking' | 'switching' | 'turns',
) {
  try {
    if (typeof window !== 'undefined')
      window.WebAnalytics?.track(`aim_${action}`, { feature_id: `aim_${mode}` });
  } catch {
    /* Tracking must never interrupt practice. */
  }
}
export function featureEvent(
  feature: Feature,
  result: 'success' | 'error',
  details: { error_code?: string; result_count?: number } = {},
) {
  // Deliberate allowlist: no input values, names, search terms, links or exception messages.
  const properties: Record<string, string | number> = { feature_id: feature };
  if (details.error_code) properties.error_code = details.error_code;
  if (details.result_count !== undefined) properties.result_count = details.result_count;
  try {
    if (typeof window !== 'undefined') window.WebAnalytics?.track(`feature_${result}`, properties);
  } catch {
    /* Analytics must never affect the tool. */
  }
}
