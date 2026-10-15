'use client';
import Converter from '@/components/converter';
import ExportForm from '@/components/export-form';

export default function ReliabilityFixture() {
  return (
    <div className="page-width">
      <h1>Local reliability checks</h1>
      <p>
        Profile writes deliberately fail on this development-only page. Export uses a real rejected
        request.
      </p>
      <ExportForm kind="report" payload="invalid" disabled={false}>
        Try rejected download
      </ExportForm>
      <Converter
        profileStorage={() => ({
          setItem: () => {
            throw new Error('Controlled storage failure');
          },
        })}
      />
    </div>
  );
}
