const enabledInput = document.getElementById('enabled');
const account = document.getElementById('account');
const dictInfo = document.getElementById('dict-info');

function link(href, text) {
  const a = document.createElement('a');
  a.href = href;
  a.target = '_blank';
  a.rel = 'noopener';
  a.textContent = text;
  return a;
}

function p(...children) {
  const node = document.createElement('p');
  node.append(...children);
  return node;
}

function render(state) {
  if (!state || state.error) {
    account.replaceChildren(p('Не удалось загрузить состояние расширения'));
    return;
  }
  enabledInput.checked = state.enabled;

  if (state.user) {
    account.replaceChildren(
      p('Вы вошли как ', Object.assign(document.createElement('b'), { textContent: state.user.name })),
      p(link(`${state.site}/me/words/`, `Мои слова (${state.words.length})`)),
    );
  } else {
    account.replaceChildren(
      p(link(`${state.site}/login/`, 'Войдите на chineseplus.club'), ', чтобы сохранять слова в личный словарь'),
    );
  }

  dictInfo.textContent = state.dictSize
    ? `Офлайн-словарь: ${state.dictSize.toLocaleString('ru-RU')} слов`
    : 'Словарь не загружен';
}

enabledInput.addEventListener('change', () => {
  chrome.storage.local.set({ enabled: enabledInput.checked });
});

chrome.runtime.sendMessage({ type: 'refreshUser' }).then(render, () => render(null));
