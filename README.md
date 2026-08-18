![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Lighthouse Accessibility 100](https://img.shields.io/badge/lighthouse_a11y-100-brightgreen?style=for-the-badge&logo=lighthouse&logoColor=white)

# GridBoard ◆ An Accessible On-Screen Keyboard

🚀 [View the Live Application](https://BenGephardt.github.io/GridBoard/)

_A dependency-free virtual QWERTY keyboard built for users with limited motor input._

---

## 📜 Project Description

**GridBoard** is a browser-based on-screen keyboard built with vanilla JavaScript and CSS: no frameworks, no build step, no dependencies. It's designed for people who type using a pointer, switch, or touch rather than a physical keyboard.

The interface uses an "Ocean Slate" design system: deep slate keys against an off-white surface for high contrast and clear key recognition. It supports physical keyboard synchronization, visual press feedback, and an output area that grows as you type.

---

## ⚙️ Key Features & Architecture

### ⚡ Input Logic

- **Caret-Aware Insertion:** A custom `insertAtCaret` function handles text injection at any cursor position, so users can move the caret and edit mid-sentence without losing their place.
- **Event Delegation:** A single listener on the keyboard container handles all key input rather than attaching listeners to every button, keeping the DOM footprint light.
- **Physical-to-Virtual Sync:** Typing on a physical keyboard flashes the corresponding virtual key. Uses `event.location` to distinguish left from right modifiers, since `event.key` reports both Shift keys identically.
- **Auto-Growing Output:** The textarea expands vertically as you type, using a `scrollHeight` recalculation on each input event.

### ♿ Accessibility

- **Touch Targets (WCAG 2.5.8):** Keys hold a 44px minimum height on mobile. Rows wrap rather than compress when space runs out, favoring tappability over authentic keyboard proportions.
- **Screen Reader Support:** Semantic `<button>` elements throughout, `aria-pressed` on Caps Lock, and `aria-label` on keys whose visible text is hidden at mobile widths. Character keys deliberately have **no** `aria-label`, so the accessible name follows the visible text.
- **Keyboard Navigation:** Full Tab and Shift+Tab traversal with visible focus indicators. Modifier keypresses don't steal focus, so backward navigation works.
- **Verified:** 100/100 Lighthouse accessibility; axe DevTools reports zero issues with Best Practices enabled.

> **Note:** automated scores aren't the whole picture. See [Known Limitations](#-known-limitations) for what's still incomplete, including the fact that Shift isn't implemented yet.

### 🎨 Design System ("Ocean Slate")

- **Proportional Desktop Layout:** `grid-template-columns` with fractional units replicates the staggered proportions of a physical keyboard (a 2.4fr Backspace against 1fr alphanumeric keys).
- **Flex-Wrap Mobile Layout:** Below 768px, rows switch to `flex-wrap` so keys hold their minimum touch target and spill to the next line instead of squeezing.
- **Adaptive Iconography:** On mobile, long labels like "Backspace" and "Enter" swap for geometric symbols (`⌫`, `↵`) via `font-size: 0` and pseudo-element injection. Accessible names are preserved through `aria-label`.
- **Design Token Architecture:** Centralized CSS custom properties (`--color-accent`, `--space-4`) make the interface themeable and scalable.

---

## 👁️ The Developer's Perspective

### 🔮 Deep Dive: What the Audit Found

#### 1. Automated tooling scored clean while the keyboard was broken

axe DevTools reported zero issues and Lighthouse's accessibility score was 100, while four real accessibility failures existed:

- **Shift was entirely unimplemented.** A user who couldn't reach a physical keyboard couldn't type a question mark, an apostrophe, or any shifted character.
- **Modifier keys (Esc, Ctrl, Alt, Cmd) rendered but did nothing.**
- **Only left Shift responded** to physical input, because `event.key` returns `"Shift"` for both.
- **Shift+Tab navigation was broken** by an unconditional `textarea.focus()` that stole focus on every keypress.

None of these are catchable by a scanner. All of them stop a real user cold. Scanners check compliance; only using the thing checks whether it works.

#### 2. Touch targets: the one thing automation did catch

Lighthouse flagged keys compressing below the WCAG 2.5.8 minimum of 24×24px on mobile. That's the criterion that matters most for this project's users.

My first fix was wrong. I tried `grid-template-columns: repeat(auto-fit, minmax(32px, 1fr))`, assuming rows would wrap at the floor. They don't: `auto-fit` fits as many tracks as it can and then places the overflow items **in the same row**, compressing them. Rows were running off the right edge rather than wrapping.

The working fix was `display: flex; flex-wrap: wrap` with `min-width: 32px; min-height: 44px` on the keys. Flex genuinely wraps, and `min-width` holds the floor against flex-shrink.

#### 3. The ARIA labels I removed

I initially added `aria-label` to every key, including `aria-label="Minus"` on `-` and `aria-label="1"` on `1`. Then I took them off.

`aria-label` overrides the visible text. Hardcoding "Minus" strips the user's own screen-reader punctuation verbosity settings, and it breaks voice control. Someone saying "click minus" no longer matches the accessible name. That's WCAG 2.5.3 Label in Name.

Labels now exist only where the visible text is genuinely hidden (special keys under `font-size: 0`) or ambiguous (Left vs. Right Shift, Alt vs. Alt Graph).

#### 4. Why Shift+Tab wasn't remapped

Shift+Tab is a two-key chord, which is exactly what's hard for this project's users, so a single-key alternative was tempting. I left it alone. Shift+Tab is platform-defined behavior every assistive-technology user relies on, and inventing a shortcut would make this page work differently from every other page they use. The right accommodation is OS-level Sticky Keys, which only keeps working if the standard isn't broken.

---

## 🚧 Known Limitations

Documented honestly rather than quietly:

- **Shift is not yet implemented.** Shifted characters (`! @ # $ % ^ & * ( ) _ + { } | : " < > ?`) can't be typed from the virtual keyboard. Planned as a **sticky** modifier (tap Shift, next key is shifted, auto-release) because holding two keys at once defeats the purpose for this project's users.
- **Modifier keys are non-functional.** Esc, Ctrl, Alt, and Cmd render but take no action. Under review: implement what makes sense in a textarea context, or remove them, since a decorative key is worse than no key.
- **Caps Lock doesn't update the visible labels.** State toggles correctly and letters insert uppercase, but the keys always display uppercase. Only the indicator dot reflects state.
- **Not yet tested with a real screen reader.** Automated tooling only covers a subset. NVDA and VoiceOver testing is next.

See [`TODO.md`](./TODO.md) for the full backlog.

---

## 📦 Tech Stack

- **Vanilla JavaScript (ES6+):** Dependency-free logic using the DOM API and event delegation.
- **CSS3:** Custom properties, Grid (desktop), Flexbox (mobile), and media queries.
- **HTML5 Semantic Markup:** `<main>`, `<header>`, `<section>`, and native `<button>` elements for screen-reader support.
- **Google Fonts:** *Space Grotesk*, chosen for its open apertures and legibility at small sizes.

---

## 🗝️ Installation & Setup

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/BenGephardt/GridBoard.git
   cd GridBoard
   ```

2. **Run it:**
   No build step. Open `index.html` directly, or use the Live Server extension in VS Code for auto-reload.

3. **Code Quality:**
   This project uses Prettier for formatting:
   ```bash
   npx prettier . --write
   ```

---

## 📄 License

This project is distributed under the **GNU General Public License v3.0 (GPLv3)**. See `LICENSE` for more information.

📬 **Contact:** BenGephardt, [https://github.com/BenGephardt](https://github.com/BenGephardt)