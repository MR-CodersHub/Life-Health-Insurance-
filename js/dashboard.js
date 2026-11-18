/**
 * WELLSURE - User Dashboard (Client Portal) Controller (js/dashboard.js)
 * Powers Tab Navigation, Search Filtering, Policy Modals, Claims, Advisor Chat & Session
 */
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initTabNavigation();
    initMobileSidebar();
    initSessionProfile();
    initGlobalSearch();
    initDocumentFilters();
    initAdvisorChat();
  });

  // 1. Tab Navigation & Dynamic Breadcrumbs
  function initTabNavigation() {
    const navBtns = document.querySelectorAll('.sidebar-nav-btn[data-target-tab], [data-target-tab]');
    const tabPanes = document.querySelectorAll('.dash-tab-pane');
    const breadcrumbCurrent = document.getElementById('dashBreadcrumbCurrent');

    navBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target-tab');
        const tabTitle = btn.getAttribute('data-tab-title') || btn.querySelector('span')?.textContent || 'Overview';

        // Update active sidebar button
        document.querySelectorAll('.sidebar-nav-btn').forEach(b => b.classList.remove('active'));
        const correspondingSidebarBtn = document.querySelector(`.sidebar-nav-btn[data-target-tab="${targetId}"]`);
        if (correspondingSidebarBtn) correspondingSidebarBtn.classList.add('active');

        // Switch tab panes
        tabPanes.forEach(pane => {
          if (pane.id === targetId) {
            pane.classList.add('active');
          } else {
            pane.classList.remove('active');
          }
        });

        // Update breadcrumb
        if (breadcrumbCurrent) {
          breadcrumbCurrent.textContent = tabTitle;
        }

        // Close mobile drawer if open
        const sidebar = document.getElementById('dashboardSidebar');
        if (sidebar && sidebar.classList.contains('show-drawer')) {
          sidebar.classList.remove('show-drawer');
        }

        // Scroll to top of content
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  // 2. Mobile Sidebar Drawer Controls
  function initMobileSidebar() {
    const toggleBtn = document.getElementById('sidebarToggleBtn');
    const closeBtn = document.getElementById('sidebarCloseBtn');
    const sidebar = document.getElementById('dashboardSidebar');

    if (toggleBtn && sidebar) {
      toggleBtn.addEventListener('click', () => {
        sidebar.classList.toggle('show-drawer');
      });
    }

    if (closeBtn && sidebar) {
      closeBtn.addEventListener('click', () => {
        sidebar.classList.remove('show-drawer');
      });
    }

    // Close when clicking outside on mobile
    document.addEventListener('click', (e) => {
      if (window.innerWidth < 992 && sidebar && sidebar.classList.contains('show-drawer')) {
        if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
          sidebar.classList.remove('show-drawer');
        }
      }
    });
  }

  // 3. User Session Profile Hydration
  function initSessionProfile() {
    try {
      const session = JSON.parse(localStorage.getItem('wellsure_session') || sessionStorage.getItem('wellsure_session'));
      if (session && session.name) {
        const firstName = session.name.split(' ')[0];
        
        // Update welcome hero greeting
        const greetingEl = document.getElementById('heroUserGreeting');
        if (greetingEl) {
          greetingEl.textContent = `Good morning, ${firstName}!`;
        }

        // Update sidebar and topbar names
        document.querySelectorAll('.user-display-name').forEach(el => {
          el.textContent = session.name;
        });

        // Update profile inputs
        const profileNameInput = document.getElementById('profileFullName');
        if (profileNameInput) profileNameInput.value = session.name;

        const profileEmailInput = document.getElementById('profileEmail');
        if (profileEmailInput && session.email) profileEmailInput.value = session.email;

        const profilePhoneInput = document.getElementById('profilePhone');
        if (profilePhoneInput && session.phone) profilePhoneInput.value = session.phone;
      }
    } catch (err) {
      // Fallback default mock user "Alex Morgan"
    }
  }

  // 4. Global Topbar Search
  function initGlobalSearch() {
    const searchInput = document.getElementById('topbarSearchInput');
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      const query = e.target.value.toLowerCase().trim();
      const searchableItems = document.querySelectorAll('.searchable-entry');

      searchableItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (query === '' || text.includes(query)) {
          item.style.display = '';
        } else {
          item.style.display = 'none';
        }
      });
    });
  }

  // 5. Document Management Filters
  function initDocumentFilters() {
    const filterBtns = document.querySelectorAll('.doc-filter-btn');
    const docRows = document.querySelectorAll('.doc-entry-row');

    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const cat = btn.getAttribute('data-doc-filter');
        docRows.forEach(row => {
          const rowCat = row.getAttribute('data-doc-category');
          if (cat === 'all' || rowCat === cat) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    });
  }

  // 6. Interactive Advisor Chat Thread (Priya Sharma)
  function initAdvisorChat() {
    const chatForm = document.getElementById('advisorChatForm');
    const chatInput = document.getElementById('advisorChatInput');
    const chatMessagesContainer = document.getElementById('advisorChatMessages');

    if (chatForm && chatInput && chatMessagesContainer) {
      chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = chatInput.value.trim();
        if (!msg) return;

        // Append User Message
        const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        const userMsgHtml = `
          <div class="d-flex justify-content-end mb-3">
            <div class="p-3 rounded-3 text-white" style="background: var(--color-terracotta); max-width: 75%; border-radius: 16px 16px 2px 16px !important;">
              <p class="mb-1 small">${escapeHtml(msg)}</p>
              <div class="text-end" style="font-size: 0.7rem; opacity: 0.85;">${timeNow} &bull; Delivered</div>
            </div>
          </div>
        `;
        chatMessagesContainer.insertAdjacentHTML('beforeend', userMsgHtml);
        chatInput.value = '';
        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;

        // Auto-reply simulation from Priya Sharma after 1 second
        setTimeout(() => {
          const advisorReplyHtml = `
            <div class="d-flex align-items-start gap-2 mb-3">
              <img src="assets/images/advisor-3.jpg" class="rounded-circle border" style="width: 34px; height: 34px; object-fit: cover;" alt="Priya Sharma">
              <div class="p-3 rounded-3" style="background: rgba(64, 103, 27, 0.08); border: 1px solid var(--color-dash-border); max-width: 75%; border-radius: 2px 16px 16px 16px !important;">
                <div class="d-flex justify-content-between align-items-center mb-1">
                  <strong class="small text-olive">Priya Sharma (Advisor)</strong>
                  <span class="text-muted" style="font-size: 0.7rem;">Just now</span>
                </div>
                <p class="mb-0 small">Thank you for your message! I am reviewing your policy details now and will provide a personalized response or call you shortly.</p>
              </div>
            </div>
          `;
          chatMessagesContainer.insertAdjacentHTML('beforeend', advisorReplyHtml);
          chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
        }, 1100);
      });
    }
  }

  // Helper function to escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  // Global Dialog Helpers
  window.openPolicyModal = function(policyType) {
    const modalEl = document.getElementById('policyDetailModal');
    if (!modalEl) return;

    if (policyType === 'health') {
      document.getElementById('modalPolicyTitle').textContent = 'Family Health Cover — Comprehensive Floater';
      document.getElementById('modalPolicyNumber').textContent = 'CARE-FLTR-2026-2481';
      document.getElementById('modalInsurer').textContent = 'Care Health Insurance Co.';
      document.getElementById('modalSumInsured').textContent = '₹10,00,000';
      document.getElementById('modalDeductible').textContent = 'Zero Co-Pay • 100% Cashless';
      document.getElementById('modalMembers').textContent = '4 Members (Self, Spouse, 2 Children)';
    } else {
      document.getElementById('modalPolicyTitle').textContent = 'Horizon Pure Risk Shield — Term Life Protection';
      document.getElementById('modalPolicyNumber').textContent = 'HDFC-LIFE-2026-7315';
      document.getElementById('modalInsurer').textContent = 'HDFC Life Insurance Co.';
      document.getElementById('modalSumInsured').textContent = '₹50,00,000';
      document.getElementById('modalDeductible').textContent = 'Guaranteed Level Payout';
      document.getElementById('modalMembers').textContent = 'Primary Insured (Nominee: Sarah Morgan)';
    }

    const modal = new bootstrap.Modal(modalEl);
    modal.show();
  };

  // Logout Handler
  window.handleDashboardLogout = function(e) {
    e.preventDefault();
    if (confirm("Are you sure you want to log out of your WellSure client portal?")) {
      localStorage.removeItem('wellsure_session');
      sessionStorage.removeItem('wellsure_session');
      window.location.href = 'login.html';
    }
  };

  // Schedule Appointment Handler
  window.handleBookAppointment = function(e) {
    e.preventDefault();
    alert("Your 1-on-1 discovery consultation with Priya Sharma has been confirmed! An invitation with Google Meet details has been sent to your email.");
    const modal = bootstrap.Modal.getInstance(document.getElementById('appointmentModal'));
    if (modal) modal.hide();
  };

  // Submit Claim Handler
  window.handleSubmitClaim = function(e) {
    e.preventDefault();
    alert("New insurance claim ticket registered! Reference ID: #CLM-92841. Our emergency cashless advocacy desk has been notified and will assist within 30 minutes.");
    const modal = bootstrap.Modal.getInstance(document.getElementById('newClaimModal'));
    if (modal) modal.hide();
  };

})();
