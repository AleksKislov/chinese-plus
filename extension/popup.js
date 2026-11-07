const api = globalThis.browser ?? globalThis.chrome;

const checkbox = document.getElementById('enabled');
const showPartsCheckbox = document.getElementById('showParts');

const themeInputs = [...document.querySelectorAll('input[name="theme"]')];

// 'auto' follows the system; the tooltips on pages use the same setting (content.js)
const applyTheme = (theme) => {
  const value = ['light', 'dark'].includes(theme) ? theme : 'auto';
  document.documentElement.dataset.theme = value;
  themeInputs.forEach((input) => (input.checked = input.value === value));
};

api.storage.local.get(['enabled', 'theme', 'showParts']).then(({ enabled, theme, showParts }) => {
  checkbox.checked = enabled !== false;
  showPartsCheckbox.checked = showParts !== false;
  applyTheme(theme);
});

checkbox.addEventListener('change', () => {
  api.storage.local.set({ enabled: checkbox.checked });
});

showPartsCheckbox.addEventListener('change', () => {
  api.storage.local.set({ showParts: showPartsCheckbox.checked });
});

themeInputs.forEach((input) =>
  input.addEventListener('change', () => {
    applyTheme(input.value);
    api.storage.local.set({ theme: input.value });
  }),
);

// keyboard shortcuts exist only in desktop browsers: show the one actually assigned, if any
async function showShortcut() {
  const commands = await api.commands?.getAll?.();
  const shortcut = commands?.find((c) => c.name === 'toggle-enabled')?.shortcut;
  if (!shortcut) return;
  const hint = document.getElementById('shortcut-hint');
  hint.textContent = `Включить / выключить: ${shortcut}`;
  hint.hidden = false;
}
showShortcut().catch(() => {});
