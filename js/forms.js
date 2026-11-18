/**
 * WELLSURE - Form Validation & Interactive Feedback (forms.js)
 */
document.addEventListener('DOMContentLoaded', () => {
  // Generic validation helper
  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        event.preventDefault();
        handleFormSuccess(form);
      }
      form.classList.add('was-validated');
    }, false);
  });

  function handleFormSuccess(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Submit';

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status"></span>Processing...';
    }

    setTimeout(() => {
      // Check form type
      if (form.id === 'loginForm') {
        window.location.href = 'client-dashboard.html';
      } else if (form.id === 'registerForm') {
        alert('Registration successful! Redirecting to your client dashboard...');
        window.location.href = 'client-dashboard.html';
      } else if (form.id === 'contactForm') {
        const alertBox = document.getElementById('contactSuccessAlert');
        if (alertBox) {
          alertBox.classList.remove('d-none');
          alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          alert('Thank you! Your enquiry has been received. A licensed WellSure advisor will contact you within 24 hours.');
        }
        form.reset();
        form.classList.remove('was-validated');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      } else if (form.id === 'newsletterForm') {
        alert('Thank you for subscribing to WellSure Insurance Insights!');
        form.reset();
        form.classList.remove('was-validated');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      } else {
        alert('Form submitted successfully!');
        form.reset();
        form.classList.remove('was-validated');
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
        }
      }
    }, 1000);
  }
});
