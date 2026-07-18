const KEY = 'aquavision.aviVisible';

/** Avi (the pond buddy) is shown by default until the user hides them. */
export function readAviVisible() {
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === null) return true;
    return stored === 'true';
  } catch {
    return true;
  }
}

export function writeAviVisible(visible) {
  try {
    localStorage.setItem(KEY, visible ? 'true' : 'false');
  } catch {
    /* session-only */
  }
}
