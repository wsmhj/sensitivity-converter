'use client';
import { useRef, useState } from 'react';
import Converter from '@/components/converter';
export default function ClipboardFixture() {
  const [mode, setMode] = useState('fail');
  const pending = useRef<(() => void) | null>(null);
  return (
    <div className="page-width">
      <h1>Local clipboard test fixture</h1>
      <button onClick={() => setMode('fail')}>Fail clipboard</button>
      <button onClick={() => setMode('delay')}>Delay clipboard</button>
      <button onClick={() => pending.current?.()}>Resolve pending copy</button>
      <Converter
        clipboardWriter={() =>
          mode === 'fail'
            ? Promise.reject(Error('Controlled failure'))
            : new Promise<void>((resolve) => {
                pending.current = resolve;
              })
        }
      />
    </div>
  );
}
