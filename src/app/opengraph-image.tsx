import { ImageResponse } from 'next/og';
export const alt = 'Turnmatch sensitivity converter — same physical turn distance, another game';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export default function Image() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        background: '#f7f8fa',
        padding: '64px',
        fontFamily: 'sans-serif',
        color: '#202724',
      }}
    >
      <div style={{ display: 'flex', fontSize: 30, fontWeight: 700, color: '#306b53' }}>
        turnmatch.
      </div>
      <div
        style={{ display: 'flex', fontSize: 62, fontWeight: 700, letterSpacing: -3, marginTop: 65 }}
      >
        Sensitivity Converter
      </div>
      <div style={{ display: 'flex', fontSize: 25, color: '#606b65', marginTop: 20 }}>
        Match your turn distance across games.
      </div>
      <div
        style={{
          display: 'flex',
          marginTop: 48,
          background: '#eef5f1',
          color: '#306b53',
          padding: '26px 32px',
          borderRadius: 4,
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <span style={{ fontSize: 24 }}>CS2 1.0 → VALORANT</span>
        <span style={{ fontSize: 43 }}>0.31429</span>
        <span style={{ fontSize: 20 }}>800 DPI · 51.95 cm/360</span>
      </div>
    </div>,
    size,
  );
}
