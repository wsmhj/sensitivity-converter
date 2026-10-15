'use client';
import { useEffect, useRef, useState } from 'react';
import { game, GAMES } from '@/lib/conversion';
export default function GamePicker({
  side,
  value,
  onSelect,
  favorites,
  onFavorite,
}: {
  side: 'Source' | 'Target';
  value: string;
  onSelect: (id: string) => void;
  favorites: string[];
  onFavorite: (id: string) => void;
}) {
  const [open, setOpen] = useState(false),
    [query, setQuery] = useState(''),
    [index, setIndex] = useState(0);
  const items = GAMES.filter((g) =>
    (g.name + ' ' + g.short + ' ' + g.aliases).toLowerCase().includes(query.toLowerCase()),
  ).sort((a, b) => Number(favorites.includes(b.id)) - Number(favorites.includes(a.id)));
  const input = useRef<HTMLInputElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const options = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (open) input.current?.focus();
  }, [open]);
  useEffect(() => {
    if (open) options.current?.querySelector('.highlight')?.scrollIntoView({ block: 'nearest' });
  }, [index, open, query]);
  function select(id: string) {
    onSelect(id);
    setOpen(false);
    setQuery('');
    setIndex(0);
    trigger.current?.focus();
  }
  return (
    <div
      className="game-picker"
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) setOpen(false);
      }}
    >
      <span className="field-label">{side} game</span>
      <button
        data-analytics-id={`${side.toLowerCase()}_game_picker`}
        ref={trigger}
        className="game-trigger"
        aria-expanded={open}
        aria-controls={`${side}-games`}
        onClick={() => {
          setOpen(!open);
          setQuery('');
          setIndex(0);
        }}
        aria-label={`Choose ${side.toLowerCase()} game: ${game(value)?.name}`}
      >
        <span className={`game-badge badge-${value}`}>{game(value)?.short.slice(0, 3)}</span>
        <span>{game(value)?.name}</span>
        <span aria-hidden="true">⌄</span>
      </button>
      {open && (
        <div className="game-menu" id={`${side}-games`}>
          <input
            ref={input}
            type="search"
            aria-label={`Search ${side.toLowerCase()} games`}
            placeholder="Search a game or abbreviation…"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setIndex(0);
            }}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                setOpen(false);
                trigger.current?.focus();
                e.preventDefault();
              }
              if (e.key === 'ArrowDown') {
                setIndex(Math.min(items.length - 1, index + 1));
                e.preventDefault();
              }
              if (e.key === 'ArrowUp') {
                setIndex(Math.max(0, index - 1));
                e.preventDefault();
              }
              if (e.key === 'Enter' && items[index]) {
                select(items[index].id);
                e.preventDefault();
              }
            }}
          />
          <div
            ref={options}
            className="game-options"
            role="list"
            aria-label={`${side} game options`}
          >
            {!items.length && (
              <p role="status">No matching game. Choose Custom game to enter a measured yaw.</p>
            )}
            {items.map((g, i) => (
              <div
                key={g.id}
                className={`game-option ${i === index ? 'highlight' : ''}`}
                role="listitem"
              >
                <button
                  data-analytics-id={`${side.toLowerCase()}_game_select`}
                  aria-pressed={value === g.id}
                  onClick={() => select(g.id)}
                >
                  {g.name}
                </button>
                <button
                  aria-label={`${favorites.includes(g.id) ? 'Unfavorite' : 'Favorite'} ${g.name}`}
                  aria-pressed={favorites.includes(g.id)}
                  onClick={() => onFavorite(g.id)}
                >
                  {favorites.includes(g.id) ? '★' : '☆'}
                </button>
              </div>
            ))}
          </div>
          <small>↑ ↓ to move · Enter to select · Escape to close</small>
        </div>
      )}
    </div>
  );
}
