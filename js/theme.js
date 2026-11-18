/**
 * WELLSURE - Theme Controller (Dark / Light Mode)
 * Persists user preference via localStorage
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'wellsure_theme';
  const THEME_ATTR = 'data-theme';

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    // Default to light
    return 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute(THEME_ATTR, theme);
    document.documentElement.setAttribute('data-bs-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);
    updateThemeIcon(theme);
  }

  function updateThemeIcon(theme) {
    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      const icon = btn.querySelector('i');
      if (icon) {
        if (theme === 'dark') {
          icon.className = 'bi bi-sun-fill text-peach';
          btn.setAttribute('aria-label', 'Switch to light mode');
          btn.setAttribute('title', 'Switch to light mode');
        } else {
          icon.className = 'bi bi-moon-stars-fill';
          btn.setAttribute('aria-label', 'Switch to dark mode');
          btn.setAttribute('title', 'Switch to dark mode');
        }
      }
    });
  }

  // Initialize early
  const initialTheme = getPreferredTheme();
  applyTheme(initialTheme);

  document.addEventListener('DOMContentLoaded', () => {
    updateThemeIcon(initialTheme);

    const toggleBtns = document.querySelectorAll('.theme-toggle-btn');
    toggleBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const currentTheme = document.documentElement.getAttribute(THEME_ATTR) || 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme);
      });
    });
  });

  window.WellSureTheme = {
    get: getPreferredTheme,
    set: applyTheme
  };
})();
