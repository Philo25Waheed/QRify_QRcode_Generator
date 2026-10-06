/**
 * QRify — Modern Client-Side QR Code Generator
 * Script: js/script.js
 * 
 * Architecture:
 * - Pure Vanilla JavaScript (ES6+)
 * - 100% Client-Side Execution
 * - Zero Tracking / Zero Backend
 */

'use strict';

// ==========================================================================
// Application State & Configuration
// ==========================================================================
const AppState = {
  currentTab: 'url',
  currentData: '',
  currentTitle: 'https://example.com',
  isGenerated: false,
  autoUpdate: true,

  // Customization Options
  options: {
    width: 320,
    height: 320,
    margin: 10,
    fgColor: '#0f172a',
    bgColor: '#ffffff',
    ecc: 'Q', // L, M, Q, H
    dotType: 'rounded', // square, rounded, dots, classy
    cornerSquareType: 'extra-rounded', // square, extra-rounded, dot
    cornerDotType: 'dot',
    logo: null, // DataURL or null
    logoName: '',
    logoSize: ''
  },

  // QR Code Instance from qr-code-styling
  qrInstance: null,

  // History Collection
  history: []
};

const STORAGE_KEYS = {
  THEME: 'qrify_theme',
  HISTORY: 'qrify_history'
};

// ==========================================================================
// DOM Elements Cache
// ==========================================================================
const DOM = {};

function initDOMCache() {
  DOM.html = document.documentElement;
  DOM.toastContainer = document.getElementById('toastContainer');
  DOM.themeToggleBtn = document.getElementById('themeToggleBtn');
  DOM.mobileMenuBtn = document.getElementById('mobileMenuBtn');
  DOM.mobileDrawer = document.getElementById('mobileDrawer');
  DOM.navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
  DOM.historyNavBadge = document.getElementById('historyNavBadge');
  DOM.mobileHistoryBadge = document.getElementById('mobileHistoryBadge');
  DOM.historyCounterBadge = document.getElementById('historyCounterBadge');

  // Format Tabs & Panes
  DOM.formatTabs = document.querySelectorAll('.format-tab');
  DOM.tabPanes = document.querySelectorAll('.tab-pane');

  // Inputs
  DOM.urlInput = document.getElementById('urlInput');
  DOM.urlFeedback = document.getElementById('urlFeedback');
  DOM.textInput = document.getElementById('textInput');
  DOM.textCharCounter = document.getElementById('textCharCounter');
  DOM.textFeedback = document.getElementById('textFeedback');
  DOM.emailAddressInput = document.getElementById('emailAddressInput');
  DOM.emailAddressFeedback = document.getElementById('emailAddressFeedback');
  DOM.emailSubjectInput = document.getElementById('emailSubjectInput');
  DOM.emailBodyInput = document.getElementById('emailBodyInput');
  DOM.phoneInput = document.getElementById('phoneInput');
  DOM.phoneFeedback = document.getElementById('phoneFeedback');
  DOM.wifiSsidInput = document.getElementById('wifiSsidInput');
  DOM.wifiSsidFeedback = document.getElementById('wifiSsidFeedback');
  DOM.wifiSecuritySelect = document.getElementById('wifiSecuritySelect');
  DOM.wifiPasswordGroup = document.getElementById('wifiPasswordGroup');
  DOM.wifiPasswordInput = document.getElementById('wifiPasswordInput');
  DOM.wifiTogglePasswordBtn = document.getElementById('wifiTogglePasswordBtn');
  DOM.wifiHiddenCheckbox = document.getElementById('wifiHiddenCheckbox');
  DOM.inputClearBtns = document.querySelectorAll('.input-clear-btn');

  // Customization Elements
  DOM.fgColorPicker = document.getElementById('fgColorPicker');
  DOM.fgColorHex = document.getElementById('fgColorHex');
  DOM.fgColorPreview = document.getElementById('fgColorPreview');
  DOM.bgColorPicker = document.getElementById('bgColorPicker');
  DOM.bgColorHex = document.getElementById('bgColorHex');
  DOM.bgColorPreview = document.getElementById('bgColorPreview');
  DOM.fgSwatches = document.getElementById('fgSwatches');
  DOM.bgSwatches = document.getElementById('bgSwatches');
  DOM.resetColorsBtn = document.getElementById('resetColorsBtn');
  DOM.resetCustomizationBtn = document.getElementById('resetCustomizationBtn');
  DOM.contrastWarning = document.getElementById('contrastWarning');

  DOM.sizeButtons = document.querySelectorAll('.seg-btn[data-size]');
  DOM.marginRange = document.getElementById('marginRange');
  DOM.marginValueDisplay = document.getElementById('marginValueDisplay');
  DOM.eccSelect = document.getElementById('eccSelect');
  DOM.dotStyleSelect = document.getElementById('dotStyleSelect');
  DOM.cornerSquareSelect = document.getElementById('cornerSquareSelect');

  // Logo Elements
  DOM.logoDropzone = document.getElementById('logoDropzone');
  DOM.logoFileInput = document.getElementById('logoFileInput');
  DOM.logoIdleState = document.getElementById('logoIdleState');
  DOM.logoActiveState = document.getElementById('logoActiveState');
  DOM.logoPreviewImg = document.getElementById('logoPreviewImg');
  DOM.logoFileName = document.getElementById('logoFileName');
  DOM.logoFileSize = document.getElementById('logoFileSize');
  DOM.removeLogoBtn = document.getElementById('removeLogoBtn');
  DOM.sampleLogoChips = document.querySelectorAll('.sample-logo-chip');

  // Actions & Buttons
  DOM.generateQrBtn = document.getElementById('generateQrBtn');
  DOM.generateBtnText = document.getElementById('generateBtnText');
  DOM.generateSpinner = document.getElementById('generateSpinner');
  DOM.autoUpdateToggle = document.getElementById('autoUpdateToggle');

  // Preview Card Elements
  DOM.previewCard = document.getElementById('previewCard');
  DOM.qrStage = document.getElementById('qrStage');
  DOM.qrEmptyState = document.getElementById('qrEmptyState');
  DOM.qrCanvasWrapper = document.getElementById('qrCanvasWrapper');
  DOM.qrCodeContainer = document.getElementById('qrCodeContainer');
  DOM.qrLoadingOverlay = document.getElementById('qrLoadingOverlay');
  DOM.previewStatusText = document.getElementById('previewStatusText');
  DOM.previewTypeBadge = document.getElementById('previewTypeBadge');
  DOM.previewEccBadge = document.getElementById('previewEccBadge');
  DOM.metaContentText = document.getElementById('metaContentText');
  DOM.metaDimensions = document.getElementById('metaDimensions');

  DOM.downloadPngBtn = document.getElementById('downloadPngBtn');
  DOM.downloadSvgBtn = document.getElementById('downloadSvgBtn');
  DOM.copyContentBtn = document.getElementById('copyContentBtn');
  DOM.copyImageBtn = document.getElementById('copyImageBtn');

  // History
  DOM.historyGrid = document.getElementById('historyGrid');
  DOM.historyEmptyState = document.getElementById('historyEmptyState');
  DOM.clearAllHistoryBtn = document.getElementById('clearAllHistoryBtn');

  // Modals
  DOM.clearHistoryModal = document.getElementById('clearHistoryModal');
  DOM.cancelClearHistoryBtn = document.getElementById('cancelClearHistoryBtn');
  DOM.confirmClearHistoryBtn = document.getElementById('confirmClearHistoryBtn');
  DOM.privacyModal = document.getElementById('privacyModal');
  DOM.footerPrivacyLink = document.getElementById('footerPrivacyLink');
  DOM.closePrivacyModalBtn = document.getElementById('closePrivacyModalBtn');
}

// ==========================================================================
// Initialization
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  initDOMCache();
  initTheme();
  initQRCodeInstance();
  bindEventListeners();
  loadHistory();

  // Generate initial showcase QR code with default URL
  generateQRCode({ saveHistory: false, isInitial: true });
});

/**
 * Initialize QRCodeStyling library instance
 */
function initQRCodeInstance() {
  if (typeof QRCodeStyling === 'undefined') {
    console.error('QRCodeStyling library is not loaded.');
    showToast('QR Code engine could not be loaded.', 'error');
    return;
  }

  AppState.qrInstance = new QRCodeStyling({
    width: AppState.options.width,
    height: AppState.options.height,
    type: 'canvas',
    data: 'https://example.com',
    margin: AppState.options.margin,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: AppState.options.ecc
    },
    imageOptions: {
      hideBackgroundDots: true,
      imageSize: 0.35,
      margin: 3,
      crossOrigin: 'anonymous'
    },
    dotsOptions: {
      color: AppState.options.fgColor,
      type: AppState.options.dotType
    },
    backgroundOptions: {
      color: AppState.options.bgColor
    },
    cornersSquareOptions: {
      color: AppState.options.fgColor,
      type: AppState.options.cornerSquareType
    },
    cornersDotOptions: {
      color: AppState.options.fgColor,
      type: AppState.options.cornerDotType
    }
  });

  DOM.qrCodeContainer.innerHTML = '';
  AppState.qrInstance.append(DOM.qrCodeContainer);
}

// ==========================================================================
// Event Listeners Binding
// ==========================================================================
function bindEventListeners() {
  // Theme Toggle
  DOM.themeToggleBtn.addEventListener('click', () => toggleTheme());

  // Mobile Menu Toggle
  DOM.mobileMenuBtn.addEventListener('click', toggleMobileMenu);

  // Close Mobile Menu on link click
  DOM.navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMobileMenu();
      updateActiveNavLink(link.getAttribute('href'));
    });
  });

  // Tab Selection
  DOM.formatTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab.getAttribute('data-tab'));
    });
  });

  // Wi-Fi Security Change
  DOM.wifiSecuritySelect.addEventListener('change', () => {
    const isNoPass = DOM.wifiSecuritySelect.value === 'nopass';
    DOM.wifiPasswordGroup.style.display = isNoPass ? 'none' : 'block';
    if (AppState.autoUpdate && AppState.isGenerated) {
      updatePreview();
    }
  });

  // Wi-Fi Password Visibility Toggle
  DOM.wifiTogglePasswordBtn.addEventListener('click', toggleWifiPasswordVisibility);

  // Textarea Character Counter
  DOM.textInput.addEventListener('input', () => {
    const len = DOM.textInput.value.length;
    DOM.textCharCounter.textContent = `${len} / 1000`;
    clearInputValidation(DOM.textInput, DOM.textFeedback);
    if (AppState.autoUpdate && AppState.isGenerated) {
      updatePreview();
    }
  });

  // Input Clear Buttons
  DOM.inputClearBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const input = e.target.closest('.input-with-icon').querySelector('input');
      if (input) {
        input.value = '';
        input.focus();
        clearInputValidation(input, DOM.urlFeedback);
        if (AppState.autoUpdate && AppState.isGenerated) {
          updatePreview();
        }
      }
    });
  });

  // Auto-Update on Input Change
  const watchedInputs = [
    DOM.urlInput,
    DOM.emailAddressInput,
    DOM.emailSubjectInput,
    DOM.emailBodyInput,
    DOM.phoneInput,
    DOM.wifiSsidInput,
    DOM.wifiPasswordInput,
    DOM.wifiHiddenCheckbox
  ];

  watchedInputs.forEach(input => {
    if (!input) return;
    input.addEventListener('input', () => {
      clearAllValidationErrors();
      if (AppState.autoUpdate && AppState.isGenerated) {
        updatePreview();
      }
    });
  });

  // Color Pickers & Inputs
  DOM.fgColorPicker.addEventListener('input', (e) => {
    setFgColor(e.target.value);
  });
  DOM.fgColorHex.addEventListener('change', (e) => {
    const validHex = normalizeHexColor(e.target.value);
    setFgColor(validHex);
  });

  DOM.bgColorPicker.addEventListener('input', (e) => {
    setBgColor(e.target.value);
  });
  DOM.bgColorHex.addEventListener('change', (e) => {
    const validHex = normalizeHexColor(e.target.value);
    setBgColor(validHex);
  });

  // Color Swatches
  DOM.fgSwatches.addEventListener('click', (e) => {
    const swatch = e.target.closest('.swatch-btn');
    if (swatch) {
      setFgColor(swatch.dataset.color);
    }
  });

  DOM.bgSwatches.addEventListener('click', (e) => {
    const swatch = e.target.closest('.swatch-btn');
    if (swatch) {
      setBgColor(swatch.dataset.color);
    }
  });

  // Reset Colors
  DOM.resetColorsBtn.addEventListener('click', () => {
    setFgColor('#0f172a');
    setBgColor('#ffffff');
    showToast('Colors reset to default.', 'info');
  });

  // Reset All Customization Options
  DOM.resetCustomizationBtn.addEventListener('click', resetAllCustomizations);

  // Size Buttons
  DOM.sizeButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      DOM.sizeButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const size = parseInt(btn.dataset.size, 10);
      AppState.options.width = size;
      AppState.options.height = size;
      DOM.metaDimensions.textContent = `${size} × ${size} px`;
      if (AppState.autoUpdate && AppState.isGenerated) {
        updatePreview();
      }
    });
  });

  // Margin Range
  DOM.marginRange.addEventListener('input', (e) => {
    const val = parseInt(e.target.value, 10);
    AppState.options.margin = val;
    DOM.marginValueDisplay.textContent = `${val}px`;
    if (AppState.autoUpdate && AppState.isGenerated) {
      updatePreview();
    }
  });

  // Error Correction Level
  DOM.eccSelect.addEventListener('change', (e) => {
    AppState.options.ecc = e.target.value;
    DOM.previewEccBadge.textContent = `ECC: ${e.target.value}`;
    if (AppState.autoUpdate && AppState.isGenerated) {
      updatePreview();
    }
  });

  // Dot & Corner Shapes
  DOM.dotStyleSelect.addEventListener('change', (e) => {
    AppState.options.dotType = e.target.value;
    if (AppState.autoUpdate && AppState.isGenerated) {
      updatePreview();
    }
  });

  DOM.cornerSquareSelect.addEventListener('change', (e) => {
    AppState.options.cornerSquareType = e.target.value;
    if (AppState.autoUpdate && AppState.isGenerated) {
      updatePreview();
    }
  });

  // Logo File Upload (Picker & Drag/Drop)
  DOM.logoFileInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleLogoUpload(e.target.files[0]);
    }
  });

  // Drag and drop events for dropzone
  ['dragenter', 'dragover'].forEach(eventName => {
    DOM.logoDropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      DOM.logoDropzone.classList.add('dragover');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    DOM.logoDropzone.addEventListener(eventName, (e) => {
      e.preventDefault();
      e.stopPropagation();
      DOM.logoDropzone.classList.remove('dragover');
    });
  });

  DOM.logoDropzone.addEventListener('drop', (e) => {
    if (e.dataTransfer && e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleLogoUpload(e.dataTransfer.files[0]);
    }
  });

  // Remove Logo Button
  DOM.removeLogoBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    removeLogo();
  });

  // Sample Logo Chips
  DOM.sampleLogoChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const samplePath = chip.getAttribute('data-sample');
      loadSampleLogo(samplePath, chip);
    });
  });

  // Main Generate Button
  DOM.generateQrBtn.addEventListener('click', () => {
    generateQRCode({ saveHistory: true, showToastNotice: true });
  });

  // Auto-Update Toggle
  DOM.autoUpdateToggle.addEventListener('change', (e) => {
    AppState.autoUpdate = e.target.checked;
    if (AppState.autoUpdate && AppState.isGenerated) {
      updatePreview();
    }
  });

  // Download & Copy Buttons
  DOM.downloadPngBtn.addEventListener('click', downloadPNG);
  DOM.downloadSvgBtn.addEventListener('click', downloadSVG);
  DOM.copyContentBtn.addEventListener('click', copyContent);
  DOM.copyImageBtn.addEventListener('click', copyImage);

  // History Clear All Modal
  DOM.clearAllHistoryBtn.addEventListener('click', () => {
    if (AppState.history.length === 0) {
      showToast('No history items to clear.', 'info');
      return;
    }
    DOM.clearHistoryModal.showModal();
  });

  DOM.cancelClearHistoryBtn.addEventListener('click', () => {
    DOM.clearHistoryModal.close();
  });

  DOM.confirmClearHistoryBtn.addEventListener('click', () => {
    clearHistory();
    DOM.clearHistoryModal.close();
  });

  // Privacy Policy Modal
  if (DOM.footerPrivacyLink) {
    DOM.footerPrivacyLink.addEventListener('click', (e) => {
      e.preventDefault();
      DOM.privacyModal.showModal();
    });
  }

  if (DOM.closePrivacyModalBtn) {
    DOM.closePrivacyModalBtn.addEventListener('click', () => {
      DOM.privacyModal.close();
    });
  }

  // Keyboard navigation: Escape key closes open modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (DOM.clearHistoryModal.open) DOM.clearHistoryModal.close();
      if (DOM.privacyModal.open) DOM.privacyModal.close();
      closeMobileMenu();
    }
  });

  // Global helper for footer jump buttons
  window.switchTabTo = (tabName) => {
    switchTab(tabName);
    const generatorEl = document.getElementById('generator');
    if (generatorEl) generatorEl.scrollIntoView({ behavior: 'smooth' });
  };
}

// ==========================================================================
// Tabs & Input Validation
// ==========================================================================
function switchTab(tabName) {
  AppState.currentTab = tabName;

  // Update tabs UI
  DOM.formatTabs.forEach(tab => {
    const isSelected = tab.getAttribute('data-tab') === tabName;
    tab.classList.toggle('active', isSelected);
    tab.setAttribute('aria-selected', isSelected ? 'true' : 'false');
  });

  // Update panes UI
  DOM.tabPanes.forEach(pane => {
    pane.classList.toggle('active', pane.id === `${tabName}TabPane`);
  });

  // Update preview badge
  const typeLabels = {
    url: 'URL',
    text: 'Text',
    email: 'Email',
    phone: 'Phone',
    wifi: 'Wi-Fi'
  };
  DOM.previewTypeBadge.textContent = typeLabels[tabName] || 'QR';

  // Set active badge colors
  DOM.previewTypeBadge.className = `badge-tag badge-${tabName === 'url' ? 'indigo' : 'neutral'}`;

  clearAllValidationErrors();

  if (AppState.autoUpdate && AppState.isGenerated) {
    updatePreview();
  }
}

/**
 * Validates the inputs for the active tab
 * @returns {{ valid: boolean, error?: string, payload?: string, title?: string }}
 */
function validateInput() {
  clearAllValidationErrors();

  switch (AppState.currentTab) {
    case 'url': {
      let val = DOM.urlInput.value.trim();
      if (!val) {
        setFieldError(DOM.urlInput, DOM.urlFeedback, 'Please enter a URL to generate a QR code.');
        return { valid: false, error: 'Please enter something to generate a QR code.' };
      }

      // Auto-prefix protocol if missing
      if (!/^https?:\/\//i.test(val)) {
        val = `https://${val}`;
      }

      // Validate URL structure
      try {
        const parsed = new URL(val);
        if (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost') {
          throw new Error('Invalid host');
        }
      } catch (err) {
        setFieldError(DOM.urlInput, DOM.urlFeedback, 'Please enter a valid URL (e.g. https://example.com).');
        return { valid: false, error: 'Please enter a valid URL.' };
      }

      return {
        valid: true,
        payload: val,
        title: val
      };
    }

    case 'text': {
      const val = DOM.textInput.value.trim();
      if (!val) {
        setFieldError(DOM.textInput, DOM.textFeedback, 'Please enter some text to generate a QR code.');
        return { valid: false, error: 'Please enter something to generate a QR code.' };
      }
      return {
        valid: true,
        payload: val,
        title: val.length > 40 ? `${val.substring(0, 40)}...` : val
      };
    }

    case 'email': {
      const email = DOM.emailAddressInput.value.trim();
      const subject = DOM.emailSubjectInput.value.trim();
      const body = DOM.emailBodyInput.value.trim();

      if (!email) {
        setFieldError(DOM.emailAddressInput, DOM.emailAddressFeedback, 'Please enter an email address.');
        return { valid: false, error: 'Please enter a valid email address.' };
      }

      // RFC-compliant email pattern
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setFieldError(DOM.emailAddressInput, DOM.emailAddressFeedback, 'Please enter a valid email address (e.g. name@domain.com).');
        return { valid: false, error: 'Please enter a valid email address.' };
      }

      let payload = `mailto:${email}`;
      const params = [];
      if (subject) params.push(`subject=${encodeURIComponent(subject)}`);
      if (body) params.push(`body=${encodeURIComponent(body)}`);
      if (params.length > 0) payload += `?${params.join('&')}`;

      return {
        valid: true,
        payload: payload,
        title: `Email to ${email}`
      };
    }

    case 'phone': {
      const val = DOM.phoneInput.value.trim();
      if (!val) {
        setFieldError(DOM.phoneInput, DOM.phoneFeedback, 'Please enter a phone number.');
        return { valid: false, error: 'Please enter a valid phone number.' };
      }

      // Clean check: at least 3 digits, valid chars +, spaces, -, (, )
      const digitCount = (val.match(/\d/g) || []).length;
      if (digitCount < 3 || !/^[\d\s+\-()]+$/.test(val)) {
        setFieldError(DOM.phoneInput, DOM.phoneFeedback, 'Please enter a valid phone number.');
        return { valid: false, error: 'Please enter a valid phone number.' };
      }

      const cleanNumber = val.replace(/[\s\-()]/g, '');
      return {
        valid: true,
        payload: `tel:${cleanNumber}`,
        title: `Call ${val}`
      };
    }

    case 'wifi': {
      const ssid = DOM.wifiSsidInput.value.trim();
      const security = DOM.wifiSecuritySelect.value;
      const password = DOM.wifiPasswordInput.value;
      const isHidden = DOM.wifiHiddenCheckbox.checked;

      if (!ssid) {
        setFieldError(DOM.wifiSsidInput, DOM.wifiSsidFeedback, 'Please enter the Wi-Fi network name (SSID).');
        return { valid: false, error: 'Please enter a Wi-Fi network name.' };
      }

      // Escape special characters per ZXing standard
      const escapeWifi = (str) => {
        return str
          .replace(/\\/g, '\\\\')
          .replace(/;/g, '\\;')
          .replace(/,/g, '\\,')
          .replace(/:/g, '\\:')
          .replace(/"/g, '\\"');
      };

      const escapedSsid = escapeWifi(ssid);
      const escapedPassword = escapeWifi(password);

      let payload = `WIFI:T:${security};S:${escapedSsid};`;
      if (security !== 'nopass') {
        payload += `P:${escapedPassword};`;
      }
      payload += `H:${isHidden ? 'true' : 'false'};;`;

      return {
        valid: true,
        payload: payload,
        title: `Wi-Fi: ${ssid} (${security})`
      };
    }

    default:
      return { valid: false, error: 'Unknown tab' };
  }
}

function setFieldError(inputEl, feedbackEl, message) {
  if (inputEl) inputEl.classList.add('is-invalid');
  if (feedbackEl) {
    feedbackEl.textContent = message;
    feedbackEl.style.opacity = '1';
  }
}

function clearInputValidation(inputEl, feedbackEl) {
  if (inputEl) inputEl.classList.remove('is-invalid');
  if (feedbackEl) {
    feedbackEl.textContent = '';
    feedbackEl.style.opacity = '0';
  }
}

function clearAllValidationErrors() {
  const inputs = [
    DOM.urlInput,
    DOM.textInput,
    DOM.emailAddressInput,
    DOM.phoneInput,
    DOM.wifiSsidInput
  ];
  const feedbacks = [
    DOM.urlFeedback,
    DOM.textFeedback,
    DOM.emailAddressFeedback,
    DOM.phoneFeedback,
    DOM.wifiSsidFeedback
  ];

  inputs.forEach(inp => inp && inp.classList.remove('is-invalid'));
  feedbacks.forEach(f => {
    if (f) {
      f.textContent = '';
      f.style.opacity = '0';
    }
  });
}

function toggleWifiPasswordVisibility() {
  const isPassword = DOM.wifiPasswordInput.type === 'password';
  DOM.wifiPasswordInput.type = isPassword ? 'text' : 'password';
  DOM.wifiTogglePasswordBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
  DOM.wifiTogglePasswordBtn.innerHTML = isPassword
    ? `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>`
    : `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>`;
}

// ==========================================================================
// QR Code Generation & Live Updates
// ==========================================================================
/**
 * Main generateQRCode function
 * @param {Object} [options]
 * @param {boolean} [options.saveHistory=true]
 * @param {boolean} [options.showToastNotice=false]
 * @param {boolean} [options.isInitial=false]
 */
function generateQRCode(options = {}) {
  const { saveHistory = true, showToastNotice = false, isInitial = false } = options;

  const validation = validateInput();
  if (!validation.valid) {
    if (showToastNotice) {
      showToast(validation.error || 'Please enter valid information.', 'error');
    }
    return;
  }

  AppState.currentData = validation.payload;
  AppState.currentTitle = validation.title;
  AppState.isGenerated = true;

  // Show quick generation state
  if (DOM.generateSpinner) DOM.generateSpinner.classList.remove('hidden');
  if (DOM.generateBtnText) DOM.generateBtnText.textContent = 'Generating...';

  // Apply styling options to QRCodeStyling instance
  applyQRStylingOptions(AppState.currentData);

  // Update Preview UI state
  DOM.qrEmptyState.classList.add('hidden');
  DOM.qrCanvasWrapper.classList.remove('hidden');
  DOM.metaContentText.textContent = AppState.currentData;
  DOM.previewStatusText.textContent = 'Ready & Active';

  setTimeout(() => {
    if (DOM.generateSpinner) DOM.generateSpinner.classList.add('hidden');
    if (DOM.generateBtnText) DOM.generateBtnText.textContent = 'Generate QR Code';

    // Capture thumbnail for history
    if (saveHistory && !isInitial) {
      captureAndSaveHistory(AppState.currentTab, AppState.currentTitle, AppState.currentData);
    }

    if (showToastNotice) {
      showToast('QR code generated successfully.', 'success');
    }
  }, 120);
}

/**
 * Updates the QR preview in real time when customization changes
 */
function updatePreview() {
  const validation = validateInput();
  if (!validation.valid) return;

  AppState.currentData = validation.payload;
  AppState.currentTitle = validation.title;
  DOM.metaContentText.textContent = AppState.currentData;

  applyQRStylingOptions(AppState.currentData);
}

/**
 * Configure and update QRCodeStyling options
 * @param {string} data
 */
function applyQRStylingOptions(data) {
  if (!AppState.qrInstance) return;

  const config = {
    data: data,
    width: AppState.options.width,
    height: AppState.options.height,
    margin: AppState.options.margin,
    qrOptions: {
      typeNumber: 0,
      mode: 'Byte',
      errorCorrectionLevel: AppState.options.ecc
    },
    dotsOptions: {
      color: AppState.options.fgColor,
      type: AppState.options.dotType
    },
    backgroundOptions: {
      color: AppState.options.bgColor
    },
    cornersSquareOptions: {
      color: AppState.options.fgColor,
      type: AppState.options.cornerSquareType
    },
    cornersDotOptions: {
      color: AppState.options.fgColor,
      type: AppState.options.cornerDotType
    }
  };

  if (AppState.options.logo) {
    config.image = AppState.options.logo;
    config.imageOptions = {
      hideBackgroundDots: true,
      imageSize: 0.35,
      margin: 3,
      crossOrigin: 'anonymous'
    };
  } else {
    config.image = '';
  }

  AppState.qrInstance.update(config);
}

// ==========================================================================
// Customization Helpers (Colors, Sizes, Logo)
// ==========================================================================
function setFgColor(hex) {
  AppState.options.fgColor = hex;
  DOM.fgColorPicker.value = hex;
  DOM.fgColorHex.value = hex;
  DOM.fgColorPreview.style.backgroundColor = hex;

  // Active state on swatches
  document.querySelectorAll('#fgSwatches .swatch-btn').forEach(sw => {
    sw.classList.toggle('active', sw.dataset.color.toLowerCase() === hex.toLowerCase());
  });

  checkColorContrast();

  if (AppState.autoUpdate && AppState.isGenerated) {
    updatePreview();
  }
}

function setBgColor(hex) {
  AppState.options.bgColor = hex;
  DOM.bgColorPicker.value = hex;
  DOM.bgColorHex.value = hex;
  DOM.bgColorPreview.style.backgroundColor = hex;

  document.querySelectorAll('#bgSwatches .swatch-btn').forEach(sw => {
    sw.classList.toggle('active', sw.dataset.color.toLowerCase() === hex.toLowerCase());
  });

  checkColorContrast();

  if (AppState.autoUpdate && AppState.isGenerated) {
    updatePreview();
  }
}

function normalizeHexColor(val) {
  val = val.trim();
  if (!val.startsWith('#')) val = `#${val}`;
  if (/^#[0-9A-Fa-f]{6}$/.test(val) || /^#[0-9A-Fa-f]{3}$/.test(val)) {
    return val;
  }
  return '#000000';
}

/**
 * Checks contrast ratio between foreground and background colors
 */
function checkColorContrast() {
  const getLuminance = (hex) => {
    const c = hex.replace('#', '');
    const num = parseInt(c.length === 3 ? c.split('').map(x => x + x).join('') : c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    const a = [r, g, b].map(v => {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
  };

  try {
    const l1 = getLuminance(AppState.options.fgColor);
    const l2 = getLuminance(AppState.options.bgColor);
    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);

    if (ratio < 2.5) {
      DOM.contrastWarning.classList.remove('hidden');
    } else {
      DOM.contrastWarning.classList.add('hidden');
    }
  } catch (e) {
    DOM.contrastWarning.classList.add('hidden');
  }
}

function resetAllCustomizations() {
  setFgColor('#0f172a');
  setBgColor('#ffffff');

  // Reset Size to Medium
  AppState.options.width = 320;
  AppState.options.height = 320;
  DOM.sizeButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.size === '320');
  });
  DOM.metaDimensions.textContent = '320 × 320 px';

  // Reset Margin to 10
  AppState.options.margin = 10;
  DOM.marginRange.value = '10';
  DOM.marginValueDisplay.textContent = '10px';

  // Reset ECC to Q
  AppState.options.ecc = 'Q';
  DOM.eccSelect.value = 'Q';
  DOM.previewEccBadge.textContent = 'ECC: Q';

  // Reset Shapes
  AppState.options.dotType = 'rounded';
  DOM.dotStyleSelect.value = 'rounded';
  AppState.options.cornerSquareType = 'extra-rounded';
  DOM.cornerSquareSelect.value = 'extra-rounded';

  // Clear logo
  removeLogo(false);

  showToast('Customization settings reset to defaults.', 'info');

  if (AppState.autoUpdate && AppState.isGenerated) {
    updatePreview();
  }
}

/**
 * Handle Logo File Upload
 * @param {File} file
 */
function handleLogoUpload(file) {
  const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  if (!validTypes.includes(file.type)) {
    showToast('Invalid format. Please upload PNG, JPG, or WEBP.', 'error');
    return;
  }

  // 2MB size limit
  if (file.size > 2 * 1024 * 1024) {
    showToast('File too large. Maximum logo size is 2MB.', 'error');
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    setLogoState(dataUrl, file.name, `${Math.round(file.size / 1024)} KB`);
    showToast('Logo uploaded successfully.', 'success');
  };
  reader.onerror = () => {
    showToast('Failed to read logo image.', 'error');
  };
  reader.readAsDataURL(file);
}

/**
 * Load a sample preset logo
 * @param {string} path
 * @param {HTMLElement} chipEl
 */
function loadSampleLogo(path, chipEl) {
  // Toggle off if already active
  if (chipEl.classList.contains('active')) {
    removeLogo();
    return;
  }

  DOM.sampleLogoChips.forEach(c => c.classList.remove('active'));
  chipEl.classList.add('active');

  const img = new Image();
  img.crossOrigin = 'anonymous';
  img.onload = () => {
    const canvas = document.createElement('canvas');
    canvas.width = img.width || 100;
    canvas.height = img.height || 100;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
    const dataUrl = canvas.toDataURL('image/png');
    const name = path.split('/').pop().replace('.svg', '');
    setLogoState(dataUrl, `${name}.png`, 'Sample Icon');
    showToast(`Applied ${chipEl.querySelector('span').textContent} icon.`, 'info');
  };
  img.onerror = () => {
    // Direct path fallback
    setLogoState(path, 'sample-icon.svg', 'Preset Icon');
  };
  img.src = path;
}

function setLogoState(dataUrl, name, sizeStr) {
  AppState.options.logo = dataUrl;
  AppState.options.logoName = name;
  AppState.options.logoSize = sizeStr;

  DOM.logoPreviewImg.src = dataUrl;
  DOM.logoFileName.textContent = name;
  DOM.logoFileSize.textContent = sizeStr;

  DOM.logoIdleState.classList.add('hidden');
  DOM.logoActiveState.classList.remove('hidden');

  // When a logo is active, boost ECC to High (H) automatically for reliable scanning
  AppState.options.ecc = 'H';
  DOM.eccSelect.value = 'H';
  DOM.previewEccBadge.textContent = 'ECC: H';

  if (AppState.autoUpdate && AppState.isGenerated) {
    updatePreview();
  }
}

function removeLogo(showNotice = true) {
  AppState.options.logo = null;
  AppState.options.logoName = '';
  AppState.options.logoSize = '';
  DOM.logoFileInput.value = '';

  DOM.logoIdleState.classList.remove('hidden');
  DOM.logoActiveState.classList.add('hidden');
  DOM.sampleLogoChips.forEach(c => c.classList.remove('active'));

  if (showNotice) {
    showToast('Logo removed.', 'info');
  }

  if (AppState.autoUpdate && AppState.isGenerated) {
    updatePreview();
  }
}

// ==========================================================================
// Export / Download Options & Clipboard Functions
// ==========================================================================
function getSemanticFileName(extension) {
  const type = AppState.currentTab || 'qr';
  return `qrify-${type}`;
}

async function downloadPNG() {
  if (!AppState.qrInstance || !AppState.isGenerated) {
    showToast('Please generate a QR code first.', 'error');
    return;
  }

  try {
    const filename = getSemanticFileName('png');
    await AppState.qrInstance.download({
      name: filename,
      extension: 'png'
    });
    showToast('QR code downloaded as PNG!', 'success');
  } catch (err) {
    console.error('PNG download error:', err);
    showToast('Failed to download PNG.', 'error');
  }
}

async function downloadSVG() {
  if (!AppState.qrInstance || !AppState.isGenerated) {
    showToast('Please generate a QR code first.', 'error');
    return;
  }

  try {
    const filename = getSemanticFileName('svg');
    await AppState.qrInstance.download({
      name: filename,
      extension: 'svg'
    });
    showToast('QR code downloaded as SVG vector!', 'success');
  } catch (err) {
    console.error('SVG download error:', err);
    showToast('Failed to download SVG.', 'error');
  }
}

async function copyContent() {
  if (!AppState.currentData) {
    showToast('No content to copy.', 'error');
    return;
  }

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(AppState.currentData);
    } else {
      // Fallback
      const tempInput = document.createElement('textarea');
      tempInput.value = AppState.currentData;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
    }
    showToast('Copied to clipboard!', 'success');
  } catch (err) {
    console.error('Copy content error:', err);
    showToast('Failed to copy content.', 'error');
  }
}

async function copyImage() {
  if (!AppState.qrInstance || !AppState.isGenerated) {
    showToast('Please generate a QR code first.', 'error');
    return;
  }

  try {
    const blob = await AppState.qrInstance.getRawData('png');
    if (blob && navigator.clipboard && window.ClipboardItem) {
      await navigator.clipboard.write([
        new ClipboardItem({ 'image/png': blob })
      ]);
      showToast('QR code image copied to clipboard!', 'success');
    } else {
      showToast('Clipboard image copying not supported in this browser.', 'info');
    }
  } catch (err) {
    console.error('Copy image error:', err);
    showToast('Could not copy image directly to clipboard.', 'error');
  }
}

// ==========================================================================
// LocalStorage History System
// ==========================================================================
/**
 * Capture canvas and store QR item into local storage history
 */
async function captureAndSaveHistory(type, title, data) {
  try {
    // Get thumbnail from the canvas
    const canvas = DOM.qrCodeContainer.querySelector('canvas');
    let thumbData = '';

    if (canvas) {
      // Create smaller thumbnail to save storage space
      const thumbCanvas = document.createElement('canvas');
      thumbCanvas.width = 80;
      thumbCanvas.height = 80;
      const ctx = thumbCanvas.getContext('2d');
      ctx.drawImage(canvas, 0, 0, 80, 80);
      thumbData = thumbCanvas.toDataURL('image/png', 0.85);
    }

    const historyItem = {
      id: `qr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      type: type,
      title: title,
      data: data,
      timestamp: Date.now(),
      thumbnail: thumbData,
      options: {
        fgColor: AppState.options.fgColor,
        bgColor: AppState.options.bgColor,
        ecc: AppState.options.ecc,
        dotType: AppState.options.dotType,
        cornerSquareType: AppState.options.cornerSquareType,
        size: AppState.options.width,
        margin: AppState.options.margin
      },
      inputValues: getCurrentInputValues()
    };

    // Avoid consecutive exact duplicate
    if (AppState.history.length > 0 && AppState.history[0].data === data) {
      return;
    }

    // Keep up to 30 items
    AppState.history.unshift(historyItem);
    if (AppState.history.length > 30) {
      AppState.history.pop();
    }

    saveHistoryToStorage();
    renderHistoryList();
  } catch (err) {
    console.warn('Could not save history item:', err);
  }
}

function getCurrentInputValues() {
  return {
    url: DOM.urlInput.value,
    text: DOM.textInput.value,
    email: DOM.emailAddressInput.value,
    emailSubject: DOM.emailSubjectInput.value,
    emailBody: DOM.emailBodyInput.value,
    phone: DOM.phoneInput.value,
    wifiSsid: DOM.wifiSsidInput.value,
    wifiSecurity: DOM.wifiSecuritySelect.value,
    wifiPassword: DOM.wifiPasswordInput.value,
    wifiHidden: DOM.wifiHiddenCheckbox.checked
  };
}

function saveHistoryToStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(AppState.history));
    updateHistoryCounters();
  } catch (err) {
    console.error('LocalStorage write failed:', err);
  }
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (raw) {
      AppState.history = JSON.parse(raw);
    } else {
      AppState.history = [];
    }
  } catch (err) {
    console.error('Failed to parse history from storage:', err);
    AppState.history = [];
  }
  renderHistoryList();
}

function renderHistoryList() {
  updateHistoryCounters();

  if (!DOM.historyGrid || !DOM.historyEmptyState) return;

  if (AppState.history.length === 0) {
    DOM.historyGrid.innerHTML = '';
    DOM.historyEmptyState.classList.remove('hidden');
    return;
  }

  DOM.historyEmptyState.classList.add('hidden');
  DOM.historyGrid.innerHTML = '';

  AppState.history.forEach(item => {
    const card = document.createElement('article');
    card.className = 'history-card';
    card.id = `hist-${item.id}`;

    const dateFormatted = formatRelativeDate(item.timestamp);
    const thumbSrc = item.thumbnail || 'assets/logo/qrify-logo.svg';

    card.innerHTML = `
      <div class="history-thumb-box" title="Click to load in generator">
        <img src="${thumbSrc}" alt="QR Thumbnail" class="history-thumb-img">
      </div>
      <div class="history-details">
        <div class="history-meta-top">
          <span class="history-type-tag type-${item.type}">${item.type}</span>
          <span class="history-timestamp">${dateFormatted}</span>
        </div>
        <h4 class="history-title" title="${escapeHtml(item.title)}">${escapeHtml(item.title)}</h4>
        <p class="history-data-snippet font-mono">${escapeHtml(item.data)}</p>
      </div>
      <div class="history-actions">
        <button type="button" class="btn btn-secondary btn-sm action-load-btn" title="Load into generator">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          <span>Load</span>
        </button>
        <button type="button" class="btn btn-outline btn-sm action-copy-btn" title="Copy content">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>
        </button>
        <button type="button" class="btn btn-danger-outline btn-sm action-delete-btn" title="Delete from history">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>
    `;

    // Bind item actions
    const loadBtn = card.querySelector('.action-load-btn');
    const thumbBox = card.querySelector('.history-thumb-box');
    const copyBtn = card.querySelector('.action-copy-btn');
    const deleteBtn = card.querySelector('.action-delete-btn');

    const handleLoad = () => loadHistoryItem(item);
    loadBtn.addEventListener('click', handleLoad);
    thumbBox.addEventListener('click', handleLoad);

    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(item.data);
        showToast('Copied to clipboard!', 'success');
      } catch (e) {
        showToast('Could not copy content.', 'error');
      }
    });

    deleteBtn.addEventListener('click', () => {
      deleteHistoryItem(item.id);
    });

    DOM.historyGrid.appendChild(card);
  });
}

function updateHistoryCounters() {
  const count = AppState.history.length;
  if (DOM.historyCounterBadge) {
    DOM.historyCounterBadge.textContent = `${count} ${count === 1 ? 'item' : 'items'} saved`;
  }
  if (DOM.historyNavBadge) {
    DOM.historyNavBadge.textContent = count;
    DOM.historyNavBadge.classList.toggle('hidden', count === 0);
  }
  if (DOM.mobileHistoryBadge) {
    DOM.mobileHistoryBadge.textContent = count;
    DOM.mobileHistoryBadge.classList.toggle('hidden', count === 0);
  }
}

/**
 * Loads a history item back into the generator and scrolls up
 */
function loadHistoryItem(item) {
  switchTab(item.type);

  // Restore input values
  if (item.inputValues) {
    if (item.inputValues.url !== undefined) DOM.urlInput.value = item.inputValues.url;
    if (item.inputValues.text !== undefined) {
      DOM.textInput.value = item.inputValues.text;
      DOM.textCharCounter.textContent = `${DOM.textInput.value.length} / 1000`;
    }
    if (item.inputValues.email !== undefined) DOM.emailAddressInput.value = item.inputValues.email;
    if (item.inputValues.emailSubject !== undefined) DOM.emailSubjectInput.value = item.inputValues.emailSubject;
    if (item.inputValues.emailBody !== undefined) DOM.emailBodyInput.value = item.inputValues.emailBody;
    if (item.inputValues.phone !== undefined) DOM.phoneInput.value = item.inputValues.phone;
    if (item.inputValues.wifiSsid !== undefined) DOM.wifiSsidInput.value = item.inputValues.wifiSsid;
    if (item.inputValues.wifiSecurity !== undefined) {
      DOM.wifiSecuritySelect.value = item.inputValues.wifiSecurity;
      DOM.wifiPasswordGroup.style.display = item.inputValues.wifiSecurity === 'nopass' ? 'none' : 'block';
    }
    if (item.inputValues.wifiPassword !== undefined) DOM.wifiPasswordInput.value = item.inputValues.wifiPassword;
    if (item.inputValues.wifiHidden !== undefined) DOM.wifiHiddenCheckbox.checked = item.inputValues.wifiHidden;
  }

  // Restore customization options if available
  if (item.options) {
    if (item.options.fgColor) setFgColor(item.options.fgColor);
    if (item.options.bgColor) setBgColor(item.options.bgColor);
    if (item.options.ecc) {
      AppState.options.ecc = item.options.ecc;
      DOM.eccSelect.value = item.options.ecc;
      DOM.previewEccBadge.textContent = `ECC: ${item.options.ecc}`;
    }
    if (item.options.dotType) {
      AppState.options.dotType = item.options.dotType;
      DOM.dotStyleSelect.value = item.options.dotType;
    }
    if (item.options.cornerSquareType) {
      AppState.options.cornerSquareType = item.options.cornerSquareType;
      DOM.cornerSquareSelect.value = item.options.cornerSquareType;
    }
  }

  // Generate QR code without duplicating in history
  generateQRCode({ saveHistory: false, showToastNotice: false });

  // Smooth scroll to generator
  const generatorEl = document.getElementById('generator');
  if (generatorEl) {
    generatorEl.scrollIntoView({ behavior: 'smooth' });
  }

  showToast('Loaded QR code into generator!', 'info');
}

/**
 * Delete individual history item
 * @param {string} id
 */
function deleteHistoryItem(id) {
  const card = document.getElementById(`hist-${id}`);
  if (card) {
    card.style.transition = 'all 200ms ease';
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95)';
  }

  setTimeout(() => {
    AppState.history = AppState.history.filter(item => item.id !== id);
    saveHistoryToStorage();
    renderHistoryList();
    showToast('History item deleted.', 'info');
  }, 200);
}

/**
 * Clear all history items
 */
function clearHistory() {
  AppState.history = [];
  saveHistoryToStorage();
  renderHistoryList();
  showToast('History cleared.', 'info');
}

// ==========================================================================
// Theme Management (Light & Dark)
// ==========================================================================
function initTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
  if (savedTheme) {
    setTheme(savedTheme);
  } else {
    // Respect OS preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    setTheme(prefersDark ? 'dark' : 'light');
  }

  // Listen for system theme changes if user hasn't explicitly set
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem(STORAGE_KEYS.THEME)) {
      setTheme(e.matches ? 'dark' : 'light');
    }
  });
}

function setTheme(theme) {
  DOM.html.setAttribute('data-theme', theme);
  const isDark = theme === 'dark';
  DOM.themeToggleBtn.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
  DOM.themeToggleBtn.setAttribute('title', isDark ? 'Light mode' : 'Dark mode');
}

function toggleTheme() {
  const current = DOM.html.getAttribute('data-theme') || 'light';
  const target = current === 'dark' ? 'light' : 'dark';
  setTheme(target);
  localStorage.setItem(STORAGE_KEYS.THEME, target);
  showToast(`Switched to ${target} mode.`, 'info');
}

// ==========================================================================
// Navigation & Mobile Menu
// ==========================================================================
function toggleMobileMenu() {
  const isOpen = DOM.mobileDrawer.classList.contains('open');
  if (isOpen) {
    closeMobileMenu();
  } else {
    DOM.mobileDrawer.classList.add('open');
    DOM.mobileMenuBtn.classList.add('active');
    DOM.mobileMenuBtn.setAttribute('aria-expanded', 'true');
    DOM.mobileDrawer.setAttribute('aria-hidden', 'false');
  }
}

function closeMobileMenu() {
  DOM.mobileDrawer.classList.remove('open');
  DOM.mobileMenuBtn.classList.remove('active');
  DOM.mobileMenuBtn.setAttribute('aria-expanded', 'false');
  DOM.mobileDrawer.setAttribute('aria-hidden', 'true');
}

function updateActiveNavLink(hash) {
  DOM.navLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === hash);
  });
}

// ==========================================================================
// Reusable Toast Notifications
// ==========================================================================
/**
 * Display a reusable toast notification
 * @param {string} message
 * @param {'success'|'error'|'info'} [type='info']
 * @param {number} [duration=3500]
 */
function showToast(message, type = 'info', duration = 3500) {
  if (!DOM.toastContainer) return;

  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.setAttribute('role', 'status');

  const icons = {
    success: `<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>`,
    error: `<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
    info: `<svg class="toast-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`
  };

  toast.innerHTML = `
    ${icons[type] || icons.info}
    <span class="toast-message">${escapeHtml(message)}</span>
    <button type="button" class="toast-close-btn" aria-label="Dismiss notification">✕</button>
  `;

  // Dismiss button
  const closeBtn = toast.querySelector('.toast-close-btn');
  closeBtn.addEventListener('click', () => dismissToast(toast));

  DOM.toastContainer.appendChild(toast);

  // Auto dismiss timer
  const timer = setTimeout(() => {
    dismissToast(toast);
  }, duration);

  toast._timer = timer;
}

function dismissToast(toast) {
  if (!toast || toast._isDismissing) return;
  toast._isDismissing = true;
  clearTimeout(toast._timer);
  toast.classList.add('toast-exit');
  toast.addEventListener('animationend', () => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  });
}

// ==========================================================================
// Utility Functions
// ==========================================================================
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function formatRelativeDate(timestamp) {
  if (!timestamp) return '';
  const now = Date.now();
  const diffSec = Math.floor((now - timestamp) / 1000);

  if (diffSec < 60) return 'Just now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;

  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric'
  });
}
