'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
export function Mark() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M4 10h23m-6-6 6 6-6 6M28 22H5m6-6-6 6 6 6" stroke="currentColor" strokeWidth="2.4" />
    </svg>
  );
}
export default function Shell() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    try {
      const value = localStorage.getItem('turnmatch-theme') === 'dark';
      setDark(value);
      document.documentElement.dataset.theme = value ? 'dark' : 'light';
    } catch {
      /* Theme storage is optional. */
    }
  }, []);
  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.dataset.theme = next ? 'dark' : 'light';
    try {
      localStorage.setItem('turnmatch-theme', next ? 'dark' : 'light');
    } catch {
      /* Optional. */
    }
  }
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link href="/" className="brand" aria-label="Turnmatch home">
          <Mark />
          <span>
            turnmatch<span className="brand-dot">.</span>
          </span>
        </Link>
        <nav aria-label="Main navigation">
          <Link href="/#converter">Converter</Link>
          <Link href="/#how-it-works">How it works</Link>
          <Link href="/#faq">FAQ</Link>
        </nav>
        <button
          className="theme-button"
          onClick={toggle}
          aria-label={dark ? 'Use light theme' : 'Use dark theme'}
          aria-pressed={dark}
        >
          {dark ? '☀' : '◐'}
        </button>
      </div>
    </header>
  );
}
export function Footer() {
  return (
    <footer className="site-footer">
      <div>
        <Link href="/" className="brand">
          <Mark />
          <span>turnmatch.</span>
        </Link>
        <p>Different game. Same starting point. Make the switch with confidence.</p>
      </div>
      <nav aria-label="Footer navigation">
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/privacy">Privacy</Link>
        <Link href="/terms">Terms</Link>
      </nav>
      <small>Independent reference tool. Game names belong to their respective owners.</small>
    </footer>
  );
}
