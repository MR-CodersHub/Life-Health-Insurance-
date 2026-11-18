/**
 * WELLSURE - Main Application Script (main.js)
 */
document.addEventListener('DOMContentLoaded', () => {
  // Update footer year dynamically
  const yearSpans = document.querySelectorAll('.current-year');
  const currentYear = new Date().getFullYear();
  yearSpans.forEach(span => {
    span.textContent = currentYear;
  });

  // Back to Top button
  const backToTopBtn = document.getElementById('backToTopBtn');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.style.opacity = '1';
        backToTopBtn.style.visibility = 'visible';
      } else {
        backToTopBtn.style.opacity = '0';
        backToTopBtn.style.visibility = 'hidden';
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});
