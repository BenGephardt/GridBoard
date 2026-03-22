// --- STATE & ELEMENTS ---
const textarea = document.getElementById("virtual-textarea");
const keyboard = document.querySelector(".keyboard");

let isCapsLock = false;

// Ensure textarea receives focus on load
window.addEventListener("DOMContentLoaded", () => {
  if (textarea) {
    textarea.focus();
  }
});

// --- NEW: AUTO-RESIZING TEXTAREA (Fallback for 'resize') ---
if (textarea) {
  textarea.addEventListener("input", function () {
    // Reset height to calculate shrinkage, then set to scrollHeight
    this.style.height = "auto";
    this.style.height = this.scrollHeight + "px";
  });
}

// Insert text at current caret position
function insertAtCaret(textareaEl, text) {
  const start = textareaEl.selectionStart;
  const end = textareaEl.selectionEnd;
  const value = textareaEl.value;
  textareaEl.value = value.slice(0, start) + text + value.slice(end);
  const newPos = start + text.length;
  textareaEl.setSelectionRange(newPos, newPos);

  // Trigger input event manually so the auto-resize logic fires
  textareaEl.dispatchEvent(new Event("input"));
}

// Delete character before caret
function deleteBeforeCaret(textareaEl) {
  const start = textareaEl.selectionStart;
  const end = textareaEl.selectionEnd;
  const value = textareaEl.value;

  if (start === 0 && end === 0) return;

  if (start !== end) {
    textareaEl.value = value.slice(0, start) + value.slice(end);
    textareaEl.setSelectionRange(start, start);
  } else {
    const newStart = start - 1;
    textareaEl.value = value.slice(0, newStart) + value.slice(end);
    textareaEl.setSelectionRange(newStart, newStart);
  }

  // Trigger input event manually so the auto-resize logic fires
  textareaEl.dispatchEvent(new Event("input"));
}

// Handle key action
function handleVirtualKey(keyEl) {
  if (!textarea || !keyEl) return;

  const keyType = keyEl.getAttribute("data-key");
  textarea.focus();

  switch (keyType) {
    case "backspace":
      deleteBeforeCaret(textarea);
      break;
    case "enter":
      insertAtCaret(textarea, "\n");
      break;
    case "space":
      insertAtCaret(textarea, " ");
      break;
    case "caps":
      isCapsLock = !isCapsLock;
      keyEl.setAttribute("aria-pressed", String(isCapsLock));
      break;
    case "tab":
      insertAtCaret(textarea, "\t");
      break;
    case "esc":
    case "ctrl":
    case "alt":
    case "altgr":
    case "cmd":
    case "shift-left":
    case "shift-right":
      break;
    default: {
      let char = keyType;
      if (char && char.length === 1 && /[a-z]/i.test(char)) {
        char = isCapsLock ? char.toUpperCase() : char.toLowerCase();
      }
      if (typeof char === "string") {
        insertAtCaret(textarea, char);
      }
    }
  }
}

// --- EVENT DELEGATION FOR VIRTUAL KEYS ---
if (keyboard) {
  keyboard.addEventListener("click", (event) => {
    const target = event.target;
    const keyEl = target.closest(".key");
    if (!keyEl || !keyboard.contains(keyEl)) return;

    handleVirtualKey(keyEl);
  });

  // --- NEW: PREVENT TEXT SELECTION (Fallback for 'user-select: none') ---
  // Mousedown prevents the text highlighting when clicking rapidly
  keyboard.addEventListener("mousedown", (event) => {
    if (event.target.closest(".key")) {
      event.preventDefault();
    }
  });

  // Selectstart catches legacy IE selection behavior
  keyboard.addEventListener("selectstart", (event) => {
    if (event.target.closest(".key")) {
      event.preventDefault();
    }
  });
}

// --- OPTIONAL PHYSICAL KEYBOARD SYNC ---
function findVirtualKeyElement(eventKey) {
  if (!keyboard) return null;

  const key = eventKey.toLowerCase();

  switch (key) {
    case " ":
      return keyboard.querySelector(".key[data-key='space']");
    case "backspace":
      return keyboard.querySelector(".key[data-key='backspace']");
    case "enter":
      return keyboard.querySelector(".key[data-key='enter']");
    case "tab":
      return keyboard.querySelector(".key[data-key='tab']");
    case "capslock":
      return keyboard.querySelector(".key[data-key='caps']");
    case "shift":
      return keyboard.querySelector(".key[data-key='shift-left']");
    case "control":
      return keyboard.querySelector(".key[data-key='ctrl']");
    case "alt":
      return keyboard.querySelector(".key[data-key='alt']");
    case "meta":
      return keyboard.querySelector(".key[data-key='cmd']");
    default: {
      if (key.length === 1) {
        const selector = `.key[data-key='${CSS.escape(key)}']`;
        return keyboard.querySelector(selector);
      }
      return null;
    }
  }
}

function flashVirtualKey(keyEl) {
  if (!keyEl) return;
  keyEl.classList.add("is-active");
  window.setTimeout(() => {
    keyEl.classList.remove("is-active");
  }, 120);
}

window.addEventListener("keydown", (event) => {
  const { key } = event;

  if (key === "Tab") return;

  const virtualKey = findVirtualKeyElement(key);
  if (!virtualKey) return;

  if (
    key === "Backspace" ||
    key === "Enter" ||
    key === " " ||
    key.length === 1 ||
    key === "CapsLock"
  ) {
    event.preventDefault();
  }

  if (key === "CapsLock") {
    isCapsLock = !isCapsLock;
    virtualKey.setAttribute("aria-pressed", String(isCapsLock));
  }

  handleVirtualKey(virtualKey);
  flashVirtualKey(virtualKey);
});
