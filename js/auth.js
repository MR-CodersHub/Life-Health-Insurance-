/**
 * WELLSURE - Authentication System JavaScript (js/auth.js)
 * Manages Login, Registration, OTP Verification, Password Reset & Session Management
 */
(function() {
  'use strict';

  // Toggle Password Visibility
  window.togglePasswordVisibility = function(inputId, btn) {
    const input = document.getElementById(inputId);
    if (!input) return;
    const icon = btn.querySelector('i');
    
    if (input.type === 'password') {
      input.type = 'text';
      if (icon) {
        icon.classList.remove('bi-eye');
        icon.classList.add('bi-eye-slash');
      }
      btn.setAttribute('aria-label', 'Hide password');
    } else {
      input.type = 'password';
      if (icon) {
        icon.classList.remove('bi-eye-slash');
        icon.classList.add('bi-eye');
      }
      btn.setAttribute('aria-label', 'Show password');
    }
  };

  // Demo Credentials Quick Fill
  window.fillDemoCredentials = function() {
    const emailInput = document.getElementById('loginEmail');
    const passInput = document.getElementById('loginPassword');
    if (emailInput && passInput) {
      emailInput.value = 'client@wellsure.demo';
      passInput.value = 'WellSure2026!';
      
      // Pulse animation
      emailInput.classList.add('border-terracotta');
      passInput.classList.add('border-terracotta');
      setTimeout(() => {
        emailInput.classList.remove('border-terracotta');
        passInput.classList.remove('border-terracotta');
      }, 800);
    }
  };

  // Dynamic Password Strength Meter for Registration
  window.checkPasswordStrength = function(input) {
    const fill = document.getElementById('passwordStrengthFill');
    const text = document.getElementById('passwordStrengthText');
    if (!fill || !text) return;

    const val = input.value;
    if (val.length === 0) {
      fill.className = 'password-strength-fill';
      text.textContent = 'Use 8+ characters with letters & numbers';
      text.className = 'text-muted small mt-1 d-block';
      return;
    }

    let strength = 0;
    if (val.length >= 8) strength++;
    if (/[A-Z]/.test(val) && /[a-z]/.test(val)) strength++;
    if (/[0-9]/.test(val) || /[^A-Za-z0-9]/.test(val)) strength++;

    if (strength === 1) {
      fill.className = 'password-strength-fill weak';
      text.textContent = 'Weak password';
      text.className = 'text-danger small mt-1 d-block fw-bold';
    } else if (strength === 2) {
      fill.className = 'password-strength-fill medium';
      text.textContent = 'Moderate security';
      text.className = 'text-warning small mt-1 d-block fw-bold';
    } else {
      fill.className = 'password-strength-fill strong';
      text.textContent = 'Strong & secure password';
      text.className = 'text-success small mt-1 d-block fw-bold';
    }
  };

  // Handle Login Form Submit
  window.handleLoginSubmit = function(e) {
    e.preventDefault();
    const form = document.getElementById('loginForm');
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const email = document.getElementById('loginEmail').value.trim();
    const rememberMe = document.getElementById('rememberMe')?.checked ?? false;
    const submitBtn = document.getElementById('btnLoginSubmit');

    // UI Loading state
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Authenticating...';
    }

    setTimeout(() => {
      // Save authenticated session
      const userData = {
        name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, l => l.toUpperCase()),
        email: email,
        loginTime: new Date().toISOString(),
        role: 'Client Policyholder',
        policyCount: 3,
        activeClaims: 1
      };

      if (rememberMe) {
        localStorage.setItem('wellsure_session', JSON.stringify(userData));
      } else {
        sessionStorage.setItem('wellsure_session', JSON.stringify(userData));
      }

      // Show instant success message
      const alertBox = document.getElementById('loginAlertBox');
      if (alertBox) {
        alertBox.classList.remove('d-none');
        alertBox.className = 'alert alert-success d-flex align-items-center gap-2 mb-3';
        alertBox.innerHTML = '<i class="bi bi-check-circle-fill text-success fs-5"></i><div><strong>Sign in successful!</strong> Redirecting to your policy dashboard...</div>';
      }

      // Redirect to Client Dashboard
      setTimeout(() => {
        window.location.href = 'client-dashboard.html';
      }, 900);
    }, 700);
  };

  // Handle Register Form Submit
  window.handleRegisterSubmit = function(e) {
    e.preventDefault();
    const form = document.getElementById('registerForm');
    const pass = document.getElementById('regPassword');
    const confirmPass = document.getElementById('regConfirmPassword');
    const termsCheck = document.getElementById('agreeTerms');

    if (pass.value !== confirmPass.value) {
      confirmPass.setCustomValidity("Passwords do not match");
    } else {
      confirmPass.setCustomValidity("");
    }

    if (!form.checkValidity() || !termsCheck.checked) {
      form.classList.add('was-validated');
      return;
    }

    const fullName = document.getElementById('regFullName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const submitBtn = document.getElementById('btnRegisterSubmit');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Creating Account...';
    }

    setTimeout(() => {
      // Save pending verification or registered account
      sessionStorage.setItem('wellsure_pending_reg', JSON.stringify({
        name: fullName,
        email: email,
        phone: phone
      }));

      // Redirect to Email OTP Verification
      window.location.href = 'verify-otp.html?email=' + encodeURIComponent(email);
    }, 800);
  };

  // Simulated Google Sign-In
  window.handleGoogleSignIn = function(e) {
    e.preventDefault();
    const confirmed = confirm("Sign in with Google OAuth?\n\nThis will authenticate using your verified Google credentials and link your WellSure insurance dashboard.");
    if (confirmed) {
      const mockGoogleUser = {
        name: "Dr. Rachel Green",
        email: "rachel.green@gmail.com",
        loginTime: new Date().toISOString(),
        role: "Client Policyholder",
        authProvider: "Google OAuth 2.0",
        policyCount: 2,
        activeClaims: 0
      };
      localStorage.setItem('wellsure_session', JSON.stringify(mockGoogleUser));
      window.location.href = 'client-dashboard.html';
    }
  };

  // Handle Forgot Password Form Submit
  window.handleForgotPasswordSubmit = function(e) {
    e.preventDefault();
    const form = document.getElementById('forgotForm');
    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const email = document.getElementById('resetEmail').value.trim();
    const submitBtn = document.getElementById('btnForgotSubmit');

    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Sending Code...';
    }

    setTimeout(() => {
      window.location.href = 'verify-otp.html?mode=reset&email=' + encodeURIComponent(email);
    }, 700);
  };

  // Setup OTP Digit Boxes Auto-Advance
  document.addEventListener('DOMContentLoaded', () => {
    const otpInputs = document.querySelectorAll('.otp-digit-input');
    if (otpInputs.length > 0) {
      otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
          const val = e.target.value;
          if (val.length >= 1) {
            e.target.value = val[0]; // ensure single char
            if (index < otpInputs.length - 1) {
              otpInputs[index + 1].focus();
            }
          }
        });

        input.addEventListener('keydown', (e) => {
          if (e.key === 'Backspace' && !e.target.value && index > 0) {
            otpInputs[index - 1].focus();
          }
        });

        // Paste support
        input.addEventListener('paste', (e) => {
          e.preventDefault();
          const pastedData = (e.clipboardData || window.clipboardData).getData('text').trim();
          if (/^\d+$/.test(pastedData)) {
            const digits = pastedData.split('');
            otpInputs.forEach((inp, idx) => {
              if (digits[idx]) {
                inp.value = digits[idx];
              }
            });
            const nextIdx = Math.min(digits.length, otpInputs.length - 1);
            otpInputs[nextIdx].focus();
          }
        });
      });

      // Focus first input
      otpInputs[0].focus();

      // Start Resend Countdown
      initResendCountdown();
    }
  });

  // Resend Countdown Timer
  function initResendCountdown() {
    let timeLeft = 45;
    const countdownEl = document.getElementById('resendCountdown');
    const resendBtn = document.getElementById('btnResendCode');
    if (!countdownEl || !resendBtn) return;

    resendBtn.disabled = true;
    resendBtn.classList.add('opacity-50');

    const interval = setInterval(() => {
      timeLeft--;
      countdownEl.textContent = timeLeft + 's';
      if (timeLeft <= 0) {
        clearInterval(interval);
        countdownEl.textContent = '';
        resendBtn.disabled = false;
        resendBtn.classList.remove('opacity-50');
      }
    }, 1000);

    resendBtn.addEventListener('click', (e) => {
      e.preventDefault();
      alert("A fresh 6-digit verification code has been dispatched to your email inbox.");
      initResendCountdown();
    });
  }

  // Handle OTP Submit
  window.handleOtpSubmit = function(e) {
    e.preventDefault();
    const otpInputs = document.querySelectorAll('.otp-digit-input');
    let code = '';
    otpInputs.forEach(i => code += i.value);

    if (code.length < 6) {
      alert("Please enter all 6 digits of your verification code.");
      return;
    }

    const submitBtn = document.getElementById('btnVerifyOtp');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Verifying...';
    }

    setTimeout(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const mode = urlParams.get('mode');

      if (mode === 'reset') {
        window.location.href = 'reset-password.html';
      } else {
        window.location.href = 'register-success.html';
      }
    }, 700);
  };

  // Handle Reset Password Submit
  window.handleResetPasswordSubmit = function(e) {
    e.preventDefault();
    const form = document.getElementById('resetPasswordForm');
    const pass = document.getElementById('newPassword');
    const confirmPass = document.getElementById('confirmNewPassword');

    if (pass.value !== confirmPass.value) {
      confirmPass.setCustomValidity("Passwords do not match");
    } else {
      confirmPass.setCustomValidity("");
    }

    if (!form.checkValidity()) {
      form.classList.add('was-validated');
      return;
    }

    const submitBtn = document.getElementById('btnSaveNewPass');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Updating Password...';
    }

    setTimeout(() => {
      alert("Your password has been reset successfully! Please sign in with your new credentials.");
      window.location.href = 'login.html';
    }, 800);
  };

})();
