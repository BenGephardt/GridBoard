![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)


# GridBoard ◆ A High-Contrast Accessible Virtual Keyboard

🚀 [View the Live Application](https://BenGephardt.github.io/GridBoard/)
*A high-performance, precision-engineered virtual typing interface built with modern CSS Geometry and Vanilla JavaScript.*

---

## 📜 Project Description

**GridBoard** is a sophisticated, browser-based virtual QWERTY keyboard designed for maximum accessibility and visual clarity. Unlike standard input overlays, GridBoard leverages a "Ocean Slate" design system—combining deep slate tones with vibrant sky-blue accents to provide a high-contrast environment that reduces eye strain and improves key recognition.

Built for users who require on-screen typing assistance or developers looking for a WCAG-compliant keyboard implementation, GridBoard features a realistic mechanical layout. It supports full physical keyboard synchronization, haptic-style visual feedback, and a dynamic "infinite-growth" output display that ensures your text never hits a boundary.

---

## ⚙️ Key Features & Architecture

### ⚡ Performance & Input Logic

* **Caret-Aware Insertion:** Implements a custom `insertAtCaret` algorithm that handles text injection at any point in a string, allowing users to move the cursor and edit middle-sentence without losing position.
* **Event Delegation Strategy:** Rather than attaching hundreds of listeners to individual keys, the app uses a single optimized listener on the keyboard container to manage all input, significantly reducing memory overhead.
* **Physical-to-Virtual Sync:** Features a bi-directional state bridge. When you type on a physical keyboard, the corresponding virtual keys "flash" using CSS hardware-accelerated transforms to maintain a unified mental model.
* **Zero-Jitter Auto-Resize:** Utilizes a `scrollHeight` calculation strategy for the output area, allowing the textarea to expand vertically as you type while maintaining a perfect 0ms Total Blocking Time (TBT).

### 🎨 Design System ("Ocean Slate")

* **WCAG 2.1 AA Compliance:** High-contrast ratios (Slate-900 on Off-White), full keyboard tab-navigation support, and ARIA-pressed states for toggles like Caps Lock.
* **Mathematical Grid Geometry:** The keyboard layout utilizes complex `grid-template-columns` with fractional units (`fr`) to replicate the staggered, proportional look of a physical keyboard (e.g., a 2.4fr Backspace vs a 1fr alphanumeric key).
* **Adaptive Iconography:** Implements a CSS-driven "Icon Fallback" system. On mobile devices, long text labels like "Backspace" and "Enter" are automatically swapped for clean geometric symbols (`⌫`, `↵`) using `font-size: 0` and pseudo-element injection to prevent layout blowout.
* **Design Token Architecture:** Built on a centralized CSS Variable system (`--color-accent`, `--space-4`, etc.), making the entire interface instantly themeable and scalable.

---

## 👁️ The Developer's Perspective

### 🔮 Deep Dive: Solving Architectural Challenges

#### 1. The Conflict of Manual vs. Auto Resizing
A common issue with textareas is the browser's native `resize` handle, which often conflicts with programmatic height adjustments. To solve this, I implemented an **Auto-Grow Engine** in JavaScript and utilized `resize: none` with an `eslint-disable` override for the `css/use-baseline` rule. This ensures the UI remains consistent across browsers while providing an "infinite" canvas for the user.

#### 2. Preventing Accidental Selection
During rapid typing, browsers often trigger a "text selection" highlight on buttons, which breaks the immersion of a virtual keyboard. I bypassed the limitations of non-standard CSS by hijacking the `mousedown` and `selectstart` events via JavaScript delegation, effectively preventing visual "ghosting" while maintaining full click functionality.

#### 3. Proportional Mobile Scaling
Keyboards are notoriously difficult to make responsive. GridBoard solves this by switching the `grid-template-columns` from specific proportional fractions to an `auto-fit` model on mobile. This, combined with a 0.65rem font-scaling strategy for special keys, ensures the keyboard remains usable even on narrow devices like an iPhone SE.

---

## 📦 Tech Stack

* **Vanilla JavaScript (ES6+):** Clean, dependency-free logic utilizing DOM API and Event Delegation.
* **CSS3 Advanced Features:** Custom Properties (Tokens), CSS Grid, Flexbox, and `calc()` for geometric precision.
* **HTML5 Semantic Markup:** Leveraging `<main>`, `<header>`, and `<button>` for a screen-reader friendly experience.
* **Google Fonts:** Utilizing *Space Grotesk* for its modern, highly-legible geometric apertures.

---

## 🗝️ Installation & Setup

### Local Setup

1.  **Clone the Repository:**
    ```bash
    git clone https://github.com/YourUsername/gridboard.git
    cd gridboard
    ```

2.  **Run with Live Server:**
    Since this is a Vanilla JS project, you can simply open `index.html` in your browser or use the "Live Server" extension in VS Code.

3.  **Code Quality:**
    This project uses Prettier for formatting. To format the code, run:
    ```bash
    npx prettier . --write
    ```

---

## 📄 License

This project is distributed under the **GNU General Public License v3.0 (GPLv3)**. See `LICENSE` for more information.

📬 **Contact:** BenGephardt - [https://github.com/BenGephardt](https://github.com/BenGephardt)