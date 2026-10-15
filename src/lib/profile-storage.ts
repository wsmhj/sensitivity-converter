import type { Profile } from './profiles';

export const PROFILE_STORAGE_KEY = 'turnmatch-profiles-v1';
export type ProfileStorage = Pick<Storage, 'setItem'>;

// A blocked storage getter and quota errors both leave the current visit usable.
export function storeProfiles(profiles: Profile[], getStorage: () => ProfileStorage): boolean {
  try {
    getStorage().setItem(PROFILE_STORAGE_KEY, JSON.stringify(profiles));
    return true;
  } catch {
    return false;
  }
}

export function profilePersistenceMessage(saved: boolean, success: string): string {
  return saved
    ? success
    : 'Changes apply only to this visit. Browser storage is unavailable; download a backup before leaving.';
}
