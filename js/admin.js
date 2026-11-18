/**
 * WELLSURE - Admin Control Center Controller (js/admin.js)
 * Manages CRM, Customer Records, Insurance Plan CMS, Claims Advocacy, Advisor Allocation & Audit Trail
 */
(function() {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initAdminNavigation();
    initAdminSearch();
    initStatusFilters();
    initMobileAdminSidebar();
  });

  // 1. Tab Navigation & Dynamic Breadcrumbs
  function initAdminNavigation() {
    const navBtns = document.querySelectorAll('.sidebar-nav-btn[data-target-tab], [data-target-tab]');
    const tabPanes = document.querySelectorAll('.dash-tab-pane');
    const breadcrumbCurrent = document.getElementById('adminBreadcrumbCurrent');

    navBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = btn.getAttribute('data-target-tab');
        const tabTitle = btn.getAttribute('data-tab-title') || btn.querySelector('span')?.textContent || 'Dashboard';

        // Update active sidebar button
        document.querySelectorAll('.sidebar-nav-btn').forEach(b => b.classList.remove('active'));
        const activeBtn = document.querySelector(`.sidebar-nav-btn[data-target-tab="${targetId}"]`);
        if (activeBtn) activeBtn.classList.add('active');

        // Switch active tab pane
        tabPanes.forEach(pane => {
          if (pane.id === targetId) {
            pane.classList.add('active');
          } else {
            pane.classList.remove('active');
          }
        });

        // Update topbar breadcrumb
        if (breadcrumbCurrent) {
          breadcrumbCurrent.textContent = tabTitle;
        }

        // Close mobile drawer if open
        const sidebar = document.getElementById('adminSidebar');
        if (sidebar && sidebar.classList.contains('show-drawer')) {
          sidebar.classList.remove('show-drawer');
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  // 2. Real-Time Table Search Filter
  function initAdminSearch() {
    const searchInputs = document.querySelectorAll('.admin-table-search, #topbarAdminSearch');
    searchInputs.forEach(input => {
      input.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        const targetTable = input.getAttribute('data-table-target');
        const rows = targetTable ? document.querySelectorAll(`#${targetTable} tbody tr`) : document.querySelectorAll('.admin-searchable-row');

        rows.forEach(row => {
          const text = row.textContent.toLowerCase();
          row.style.display = (query === '' || text.includes(query)) ? '' : 'none';
        });
      });
    });
  }

  // 3. Status Filter Dropdowns
  function initStatusFilters() {
    const filterSelects = document.querySelectorAll('.admin-status-filter');
    filterSelects.forEach(select => {
      select.addEventListener('change', (e) => {
        const selectedStatus = e.target.value.toLowerCase();
        const targetTable = select.getAttribute('data-table-target');
        const rows = document.querySelectorAll(`#${targetTable} tbody tr`);

        rows.forEach(row => {
          const statusCell = row.querySelector('.status-tag-cell');
          if (!statusCell) return;
          const statusText = statusCell.textContent.toLowerCase();

          if (selectedStatus === 'all' || statusText.includes(selectedStatus)) {
            row.style.display = '';
          } else {
            row.style.display = 'none';
          }
        });
      });
    });
  }

  // 4. Mobile Drawer Controls
  function initMobileAdminSidebar() {
    const toggleBtn = document.getElementById('adminSidebarToggle');
    const closeBtn = document.getElementById('adminSidebarClose');
    const sidebar = document.getElementById('adminSidebar');

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

    document.addEventListener('click', (e) => {
      if (window.innerWidth < 992 && sidebar && sidebar.classList.contains('show-drawer')) {
        if (!sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
          sidebar.classList.remove('show-drawer');
        }
      }
    });
  }

  // 5. Global Action Helpers & Modal Triggers
  window.handleApproveApplication = function(appId) {
    if (confirm(`Approve application ${appId}? This will notify the carrier underwriter and advance the policy status to Issued.`)) {
      alert(`Application ${appId} approved successfully! Notification sent to policyholder.`);
      const row = document.getElementById(`row-${appId}`);
      if (row) {
        const badge = row.querySelector('.status-tag-cell span');
        if (badge) {
          badge.className = 'badge-status-issued';
          badge.textContent = 'Issued';
        }
      }
    }
  };

  window.handleRejectApplication = function(appId) {
    const reason = prompt(`Enter reason for declining application ${appId}:`, "Medical underwriting requirements not met");
    if (reason) {
      alert(`Application ${appId} status set to Rejected. Audit log updated.`);
      const row = document.getElementById(`row-${appId}`);
      if (row) {
        const badge = row.querySelector('.status-tag-cell span');
        if (badge) {
          badge.className = 'badge-status-rejected';
          badge.textContent = 'Rejected';
        }
      }
    }
  };

  window.handleTogglePlanStatus = function(planId, btn) {
    const isPublished = btn.classList.contains('btn-success');
    if (isPublished) {
      btn.className = 'btn btn-sm btn-outline-secondary';
      btn.textContent = 'Draft (Unpublished)';
      alert(`Plan ${planId} unpublished from client view.`);
    } else {
      btn.className = 'btn btn-sm btn-success';
      btn.textContent = 'Published (Active)';
      alert(`Plan ${planId} published to live client comparison portal.`);
    }
  };

  window.handleAdminLogout = function(e) {
    e.preventDefault();
    if (confirm("Log out of the WellSure Admin Operations Portal?")) {
      window.location.href = 'login.html';
    }
  };

  window.handleAddCustomerSubmit = function(e) {
    e.preventDefault();
    alert("New client record created and welcome onboarding email dispatched!");
    const modal = bootstrap.Modal.getInstance(document.getElementById('addCustomerModal'));
    if (modal) modal.hide();
  };

  window.handleAddPlanSubmit = function(e) {
    e.preventDefault();
    alert("New insurance plan saved into master brokerage repository!");
    const modal = bootstrap.Modal.getInstance(document.getElementById('addPlanModal'));
    if (modal) modal.hide();
  };

  window.handleAddPostSubmit = function(e) {
    e.preventDefault();
    alert("New editorial publication saved to WellSure Journal draft queue!");
    const modal = bootstrap.Modal.getInstance(document.getElementById('addPostModal'));
    if (modal) modal.hide();
  };

})();
