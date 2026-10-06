# QRify — Modern Client-Side QR Code Generator

> **“Generate. Customize. Share.”**  
> Create beautiful QR codes instantly — no account required.

QRify is a lightweight, frontend-only web application engineered to generate customizable, high-resolution QR codes directly inside the web browser. Built entirely with vanilla HTML5, CSS3, and JavaScript, QRify processes all payloads locally with zero server transmissions, ensuring total confidentiality and lightning-fast rendering.

---

## 🌟 Key Features

- **⚡ Instant Local Generation**: Generates standard-compliant QR codes in real time without network roundtrips.
- **🔒 Privacy First**: 100% client-side execution. Zero payloads or credentials are ever sent to an external server.
- **🎨 Deep Customization**:
  - Custom foreground and background colors with interactive hex inputs and preset palettes.
  - Automated WCAG contrast ratio warning when colors are too close for reliable scanning.
  - Granular sizing presets (Small, Medium, Large) and margin / quiet-zone sliders.
  - Error correction level control (Low 7%, Medium 15%, Quartile 25%, High 30%).
  - Configurable module dot patterns (Square, Smooth Rounded, Dots, Classy) and corner eye shapes.
- **🖼️ Logo & Brand Overlay**:
  - Drag-and-drop or file upload for custom brand logos (PNG, JPG, JPEG, WEBP up to 2MB).
  - Quick-preset testing icons (Globe, Wi-Fi, Star, Heart).
  - Automatic error correction level boosting (`H` - 30%) for guaranteed scan fidelity.
- **📱 5 Supported Input Formats**:
  1. **URL**: Web links with automatic HTTPS normalization and domain validation.
  2. **Plain Text**: Arbitrary notes, addresses, or keys with live character counter.
  3. **Email**: Structured `mailto:` payloads with optional recipient, subject, and message body.
  4. **Phone**: Dial-ready `tel:` format with international number validation.
  5. **Wi-Fi**: Standard ZXing Wi-Fi credentials (`WIFI:T:...;S:...;P:...;H:...;;`) supporting WPA/WPA2/WPA3, WEP, Open networks, and hidden SSIDs.
- **💾 Export & Sharing**:
  - High-res **PNG raster export** with semantic filenames (e.g. `qrify-url.png`, `qrify-wifi.png`).
  - Infinite-resolution **Vector SVG export** ready for large-format print and typography.
  - One-click clipboard copy of raw payload and direct QR image copying.
- **📜 Local History (localStorage)**:
  - Stores up to 30 recent creations with mini QR thumbnails, timestamps, and formatting badges.
  - One-click reload of past codes with complete styling restoration.
  - Individual item deletion and bulk clear modal.
- **🌓 Adaptive Theme**:
  - Seamless Light mode and Dark mode with fluid CSS transitions.
  - Persistent preference storage with system OS fallback (`prefers-color-scheme`).
- **♿ Accessible & Mobile-First**:
  - Fully responsive across desktop, tablet, and mobile displays.
  - Semantic HTML5 structure, ARIA roles, visible focus rings, and full keyboard navigation.

---

## 🛠️ Technologies Used

- **HTML5**: Semantic tags (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<dialog>`, `<footer>`).
- **CSS3**: Custom properties (CSS variables), Grid, Flexbox, media queries, micro-animations, glassmorphism blur.
- **Vanilla JavaScript (ES6+)**: Modular application architecture, DOM event delegation, FileReader API, Clipboard API, Web Storage API (`localStorage`).
- **qr-code-styling**: Lightweight, standalone client-side vector and canvas rendering engine (no server runtime or node dependency).

---

## 🚀 How It Works

```
┌─────────────────────────────────┐
│       01. Enter Content         │
│ (URL, Text, Email, Phone, Wi-Fi)│
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│     02. Customize QR Code       │
│  (Colors, Shapes, ECC, Logo)    │
└────────────────┬────────────────┘
                 │
                 ▼
┌─────────────────────────────────┐
│      03. Download & Share       │
│   (PNG, SVG, Copy to Clipboard) │
└─────────────────────────────────┘
```

1. **Step 01 — Enter Content**: Select your format tab and fill out the fields. Input validation prevents blank or corrupted payloads.
2. **Step 02 — Customize**: Adjust foreground/background hues, module patterns, quiet zone margins, or embed a brand logo in the center.
3. **Step 03 — Download and Share**: Export your asset in crisp PNG or scalable SVG, or copy the content to clipboard.

---

## 📁 Project Structure

```
qrify/
│
├── index.html                   # Main application document with semantic layout
│
├── css/
│   └── style.css                # Design system tokens, light/dark themes, responsive layout
│
├── js/
│   ├── script.js                # Core application logic, validation, history, and handlers
│   └── vendor/
│       └── qr-code-styling.js   # Standalone offline-ready client-side QR generation engine
│
├── assets/
│   └── logo/
│       ├── qrify-logo.svg       # Brand vector icon
│       ├── sample-globe.svg     # Preset sample icon
│       ├── sample-wifi.svg      # Preset sample icon
│       ├── sample-star.svg      # Preset sample icon
│       └── sample-heart.svg     # Preset sample icon
│
└── README.md                    # Project documentation
```

---

## 💻 How to Run Locally

Because QRify is built 100% on standard web technologies with no backend, database, or build steps, running it locally is effortless:

### Option 1: Direct Browser Launch
1. Clone or download this repository.
2. Double-click `index.html` or drag it into any web browser (Chrome, Firefox, Safari, Edge, Brave, Opera).

### Option 2: Local HTTP Server (Optional)
If you prefer testing over `localhost`:

```bash
# Using Python 3
python -m http.server 8080

# Using Node.js npx serve
npx serve .

# Using PHP built-in server (optional runner)
php -S localhost:8080
```
Then navigate to `http://localhost:8080` in your browser.

---

## 🌐 Browser Compatibility

Tested and compatible across all modern desktop and mobile browsers:

| Browser | Version | Compatibility |
| :--- | :--- | :--- |
| **Google Chrome** | 80+ | Full support (PNG, SVG, Clipboard, History) |
| **Mozilla Firefox** | 80+ | Full support |
| **Apple Safari** | 14+ | Full support (iOS & macOS) |
| **Microsoft Edge** | 80+ | Full support |
| **Opera / Brave** | Recent | Full support |

---

## 🛡️ Privacy & Security Architecture

1. **Zero Data Upload**: All QR calculations occur purely within your computer's local JavaScript execution context.
2. **No Analytics or Telemetry**: No tracking pixels, Google Analytics, or third-party ad networks are loaded.
3. **Local Storage Isolation**: Saved codes reside strictly within your browser's private `localStorage`.
4. **Offline Capable**: The application carries its local vendor engine in `js/vendor/qr-code-styling.js`, making it functional even without an internet connection.

---

## 🔮 Future Improvements

- [ ] Batch QR generation via CSV file upload
- [ ] VCard / MeCard business card contact format support
- [ ] Cryptocurrency wallet address generator (BTC, ETH, SOL)
- [ ] Geolocation (GPS coordinate) QR formatting
- [ ] Gradient foreground color generator with angle controls

---

## 👤 Author

Developed as a showcase frontend engineering project.  
**QRify — Generate. Customize. Share.**
"# QRify_QRcode_Generator" 
