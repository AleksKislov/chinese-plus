const api = globalThis.browser ?? globalThis.chrome;

// on / off settings: checkbox id = storage key, and its value when nothing is stored yet
const SWITCHES = { enabled: true, showParts: true, toneColors: false, requireShift: false };

const themeInputs = [...document.querySelectorAll('input[name="theme"]')];

// 'auto' follows the system; the tooltips on pages use the same setting (content.js)
const applyTheme = (theme) => {
  const value = ['light', 'dark'].includes(theme) ? theme : 'auto';
  document.documentElement.dataset.theme = value;
  themeInputs.forEach((input) => (input.checked = input.value === value));
};

api.storage.local.get(['theme', ...Object.keys(SWITCHES)]).then((stored) => {
  for (const [key, byDefault] of Object.entries(SWITCHES)) {
    document.getElementById(key).checked = typeof stored[key] === 'boolean' ? stored[key] : byDefault;
  }
  applyTheme(stored.theme);
});

for (const key of Object.keys(SWITCHES)) {
  const input = document.getElementById(key);
  input.addEventListener('change', () => api.storage.local.set({ [key]: input.checked }));
}

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
