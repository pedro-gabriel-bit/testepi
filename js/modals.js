// modals.js - script seguro para abrir/fechar o modal
document.addEventListener('DOMContentLoaded', function () {
  const overlay = document.getElementById('login-overlay');
  if (!overlay) {
    console.warn('modals.js: #login-overlay não encontrado.');
    return;
  }

  const closeBtn = document.getElementById('login-close');
  const openTriggers = document.querySelectorAll('[data-open-login]');
  const firstFocusableSelector = 'input, button, a, textarea, select';
  let lastFocusedElement = null;
  let isOpen = false;

  function safeLog(...args) { if (window && window.console) console.log('[modal]', ...args); }

  function setInert(el, inert) {
    try {
      el.inert = inert;
      el.setAttribute('aria-hidden', inert ? 'true' : 'false');
    } catch (err) {
      if (inert) {
        el.setAttribute('aria-hidden', 'true');
        Array.from(el.querySelectorAll(firstFocusableSelector)).forEach(i => {
          i.dataset.prevTab = i.hasAttribute('tabindex') ? i.getAttribute('tabindex') : 'none';
          i.setAttribute('tabindex', '-1');
        });
      } else {
        el.setAttribute('aria-hidden', 'false');
        Array.from(el.querySelectorAll('[data-prev-tab]')).forEach(i => {
          const prev = i.dataset.prevTab;
          if (prev === 'none') i.removeAttribute('tabindex');
          else i.setAttribute('tabindex', prev);
          delete i.dataset.prevTab;
        });
      }
    }
  }

  function openLogin() {
    if (isOpen) return;
    lastFocusedElement = document.activeElement instanceof Element ? document.activeElement : null;
    setInert(overlay, false);
    overlay.classList.remove('hidden');
    overlay.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    isOpen = true;
    const first = overlay.querySelector(firstFocusableSelector);
    if (first) {
      try { first.focus({ preventScroll: true }); } catch (e) { first.focus(); }
    }
    safeLog('openLogin executed');
  }

  function closeLogin() {
    if (!isOpen && overlay.classList.contains('hidden')) return;
    const activeInside = overlay.contains(document.activeElement) ? document.activeElement : null;
    if (activeInside && typeof activeInside.blur === 'function') activeInside.blur();

    setInert(overlay, true);
    overlay.classList.add('hidden');
    overlay.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    isOpen = false;

    if (lastFocusedElement && typeof lastFocusedElement.focus === 'function') {
      try { lastFocusedElement.focus({ preventScroll: true }); } catch (e) { lastFocusedElement.focus(); }
    } else {
      try { document.body.focus(); } catch (e) {}
    }
    lastFocusedElement = null;
    safeLog('closeLogin executed');
  }

  // Guard inicial: se o overlay estiver visível no carregamento, fecha e registra log
  (function guardInitialVisibility() {
    const initiallyHidden = overlay.classList.contains('hidden') || overlay.getAttribute('aria-hidden') === 'true';
    if (!initiallyHidden) {
      console.warn('[modal] Overlay estava VISÍVEL no carregamento — fechando automaticamente para evitar bloqueio.');
      try { closeLogin(); } catch (e) {
        overlay.classList.add('hidden');
        overlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      }
    } else {
      setInert(overlay, true);
      overlay.setAttribute('aria-hidden', 'true');
    }
  })();

  // abrir por triggers
  if (openTriggers.length) {
    openTriggers.forEach(btn => btn.addEventListener('click', function (e) {
      e.preventDefault(); openLogin();
    }));
  } else {
    safeLog('Nenhum [data-open-login] encontrado. O modal só abrirá se chamar openLogin() manualmente.');
  }

  // fechar ao clicar no X
  if (closeBtn) {
    closeBtn.addEventListener('click', function (e) {
      e.preventDefault(); closeLogin();
    });
    // fallback robusto: caso outro script remova listeners, garante um onclick mínimo
    closeBtn.onclick = function () {
      document.getElementById('login-overlay').classList.add('hidden');
      document.getElementById('login-overlay').setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
      safeLog('closeLogin via fallback onclick');
    };
  } else {
    console.warn('[modal] Botão de fechar (#login-close) não encontrado.');
  }

  // fechar ao clicar fora do modal (no overlay)
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeLogin();
  });

  // ESC para fechar
  document.addEventListener('keydown', function (e) {
    if ((e.key === 'Escape' || e.key === 'Esc') && !overlay.classList.contains('hidden')) {
      closeLogin();
    }
  });

  // exposição para debug/manual
  window.openLogin = openLogin;
  window.closeLogin = closeLogin;

  safeLog('modals.js inicializado (separado).');

  
});