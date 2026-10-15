import { calculate, decodeSettings, encodeSettings, type Settings } from './conversion';
export type Profile = { id: string; name: string; settings: Settings };
export function readProfiles(value: unknown): Profile[] | null {
  if (!Array.isArray(value) || value.length > 20) return null;
  const items: Profile[] = [];
  for (const p of value) {
    if (
      !p ||
      typeof p !== 'object' ||
      typeof p.id !== 'string' ||
      p.id.length > 80 ||
      typeof p.name !== 'string' ||
      !p.name.trim() ||
      p.name.length > 60
    )
      return null;
    const settings = decodeSettings(encodeSettings(p.settings));
    if (!settings || !calculate(settings).ok) return null;
    if (items.some((x) => x.id === p.id)) return null;
    items.push({ id: p.id, name: p.name.trim(), settings });
  }
  return items;
}
export function parseBackup(text: string): Profile[] | null {
  try {
    if (text.length > 50000) return null;
    const x = JSON.parse(text);
    return x?.version === 1 ? readProfiles(x.profiles) : null;
  } catch {
    return null;
  }
}
