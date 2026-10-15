'use client';
import { useEffect, useRef, useState } from 'react';
import { requestExport, type ExportKind } from '@/lib/download';

export default function ExportForm({
  kind,
  payload,
  disabled,
  children,
}: {
  kind: ExportKind;
  payload: string;
  disabled: boolean;
  children: React.ReactNode;
}) {
  const [pending, setPending] = useState(false);
  const [status, setStatus] = useState('');
  const active = useRef<AbortController | null>(null);
  useEffect(() => {
    setStatus('');
    setPending(false);
    return () => {
      active.current?.abort();
      active.current = null;
    };
  }, [kind, payload]);

  async function download(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (active.current || disabled) return;
    const controller = new AbortController();
    active.current = controller;
    const timeout = setTimeout(() => controller.abort(), 15000);
    setPending(true);
    setStatus('Preparing download…');
    try {
      const { blob, name } = await requestExport(kind, payload, controller.signal);
      if (active.current !== controller || controller.signal.aborted) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = name;
      document.body.appendChild(link);
      link.click();
      link.remove();
      // Allow the browser to consume the URL before releasing it.
      setTimeout(() => URL.revokeObjectURL(url), 60000);
      setStatus('Download requested. Check your browser downloads.');
    } catch (error) {
      if (active.current === controller)
        setStatus(
          controller.signal.aborted
            ? 'The download timed out. Please try again.'
            : error instanceof Error
              ? error.message
              : 'Download failed. Please try again.',
        );
    } finally {
      clearTimeout(timeout);
      if (active.current === controller) {
        active.current = null;
        setPending(false);
      }
    }
  }
  return (
    <form onSubmit={download} className="export-form" aria-busy={pending}>
      <button data-analytics-id={`export_${kind}`} type="submit" disabled={disabled || pending}>
        {pending ? 'Preparing…' : children}
      </button>
      {status && (
        <small className="export-status" role="status">
          {status}
        </small>
      )}
    </form>
  );
}
