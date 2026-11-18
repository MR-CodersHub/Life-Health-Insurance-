/**
 * WELLSURE - Global Navigation Controller
 */
document.addEventListener('DOMContentLoaded', () => {
  const navbar = document.querySelector('.ws-navbar');

  // Sticky Navbar Scroll State
  function handleScroll() {
    if (!navbar) return;
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // Active Link Highlighter
  const currentPath = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.ws-navbar .nav-link');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPath || (currentPath === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // Mobile menu close on link click
  const navCollapse = document.getElementById('navbarContent');
  if (navCollapse) {
    const collapseInstance = bootstrap.Collapse.getOrCreateInstance(navCollapse, { toggle: false });
    const collapseLinks = navCollapse.querySelectorAll('.nav-link, .btn-ws-primary');
    collapseLinks.forEach(l => {
      l.addEventListener('click', () => {
        if (window.innerWidth < 992 && navCollapse.classList.contains('show')) {
          collapseInstance.hide();
        }
      });
    });
  }
});
