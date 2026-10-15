export type ExportKind = 'report' | 'csv' | 'profiles';
const formats = {
  report: { name: 'sensitivity-converter-report.txt', type: 'text/plain' },
  csv: { name: 'sensitivity-converter-comparison.csv', type: 'text/csv' },
  profiles: { name: 'sensitivity-converter-profiles.json', type: 'application/json' },
};

export async function requestExport(
  kind: ExportKind,
  payload: string,
  signal: AbortSignal,
  request: typeof fetch = fetch,
) {
  const response = await request('/api/export', {
    method: 'POST',
    body: new URLSearchParams({ kind, payload }),
    signal,
  });
  if (!response.ok) {
    throw new Error(
      response.status === 400
        ? 'These values could not be exported. Check your inputs and try again.'
        : 'Download could not be prepared. Please try again.',
    );
  }
  const format = formats[kind];
  if (response.headers.get('content-type')?.split(';')[0].trim() !== format.type) {
    throw new Error('The server returned an unexpected file. Please try again.');
  }
  const blob = await response.blob();
  if (!blob.size) throw new Error('The download was empty. Please try again.');
  return { blob, name: format.name };
}
