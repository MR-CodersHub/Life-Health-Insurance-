/**
 * WELLSURE - Home Page Interactivity (home.js)
 */
document.addEventListener('DOMContentLoaded', () => {
  // Plan Comparison Category Filter
  const compareTabs = document.querySelectorAll('.compare-tab-btn');
  const compareCards = document.querySelectorAll('.compare-col');

  if (compareTabs.length > 0 && compareCards.length > 0) {
    compareTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        compareTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const category = btn.getAttribute('data-category');

        compareCards.forEach(col => {
          const cardCat = col.getAttribute('data-category');
          if (category === 'all' || cardCat === category) {
            col.style.display = 'block';
            setTimeout(() => {
              col.style.opacity = '1';
              col.style.transform = 'translateY(0)';
            }, 50);
          } else {
            col.style.opacity = '0';
            col.style.transform = 'translateY(10px)';
            setTimeout(() => {
              col.style.display = 'none';
            }, 250);
          }
        });
      });
    });
  }

  // Play Video Button Trigger (Opens Video Modal)
  const playBtn = document.getElementById('heroPlayBtn');
  const videoModalEl = document.getElementById('wellsureVideoModal');
  if (playBtn && videoModalEl) {
    const videoModal = new bootstrap.Modal(videoModalEl);
    playBtn.addEventListener('click', (e) => {
      e.preventDefault();
      videoModal.show();
    });
  }

  // Interactive Number Counter Animation for Hero & Stats
  const statNumbers = document.querySelectorAll('.counter-val');
  let hasAnimated = false;

  function animateCounters() {
    if (hasAnimated) return;
    
    statNumbers.forEach(stat => {
      const target = parseFloat(stat.getAttribute('data-target') || '0');
      const suffix = stat.getAttribute('data-suffix') || '';
      const prefix = stat.getAttribute('data-prefix') || '';
      const isDecimal = target % 1 !== 0;
      let start = 0;
      const duration = 1600;
      const stepTime = 20;
      const steps = duration / stepTime;
      const increment = target / steps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          stat.textContent = prefix + (isDecimal ? target.toFixed(1) : Math.round(target).toLocaleString()) + suffix;
          clearInterval(timer);
        } else {
          stat.textContent = prefix + (isDecimal ? start.toFixed(1) : Math.round(start).toLocaleString()) + suffix;
        }
      }, stepTime);
    });
    hasAnimated = true;
  }

  // Run counter on scroll or after short delay
  setTimeout(animateCounters, 300);
});
