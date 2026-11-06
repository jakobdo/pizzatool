const storageKey = 'pizzatool.preferences';

export function readPreferences() {
  try {
    return JSON.parse(window.localStorage.getItem(storageKey)) ?? {};
  } catch {
    return {};
  }
}

export function savePreferences(preferences) {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(preferences));
  } catch {
    // Beregneren virker også, når browseren blokerer lokal lagring.
  }
}
