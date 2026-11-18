/**
 * WELLSURE - Direction Controller (LTR / RTL Switcher)
 * Persists user preference via localStorage
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'wellsure_direction';
  const DIR_ATTR = 'dir';

  function getSavedDirection() {
    return localStorage.getItem(STORAGE_KEY) || 'ltr';
  }

  function applyDirection(dir) {
    document.documentElement.setAttribute(DIR_ATTR, dir);
    localStorage.setItem(STORAGE_KEY, dir);
    updateDirectionButtons(dir);
  }

  function updateDirectionButtons(dir) {
    const dirBtns = document.querySelectorAll('.direction-toggle-btn');
    dirBtns.forEach(btn => {
      // If currently LTR, button shows RTL (next action)
      btn.textContent = dir === 'rtl' ? 'LTR' : 'RTL';
      btn.setAttribute('title', dir === 'rtl' ? 'Switch to Left-to-Right' : 'Switch to Right-to-Left');
      btn.setAttribute('aria-label', dir === 'rtl' ? 'Switch to Left-to-Right' : 'Switch to Right-to-Left');
    });
  }

  // Set direction early to avoid flashing
  const initialDir = getSavedDirection();
  applyDirection(initialDir);

  document.addEventListener('DOMContentLoaded', () => {
    updateDirectionButtons(initialDir);

    const dirBtns = document.querySelectorAll('.direction-toggle-btn');
    dirBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentDir = document.documentElement.getAttribute(DIR_ATTR) || 'ltr';
        const nextDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
        applyDirection(nextDir);
      });
    });
  });

  window.WellSureDirection = {
    get: getSavedDirection,
    set: applyDirection
  };
})();
