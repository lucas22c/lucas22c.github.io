(() => {
  'use strict';
  const EMAIL = 'lucascoster90@gmail.com';
  const validTabs = ['overview', 'experience', 'projects', 'education'];
  const tabs = [...document.querySelectorAll('[data-tab]')];
  const panels = [...document.querySelectorAll('[data-panel]')];
  const toast = document.querySelector('[data-toast]');
  let toastTimer;

  function setTab(name, updateHash = true) {
    const active = validTabs.includes(name) ? name : 'overview';
    tabs.forEach(tab => {
      const selected = tab.dataset.tab === active;
      tab.setAttribute('aria-selected', String(selected));
      tab.id = `tab-${tab.dataset.tab}`;
      tab.tabIndex = selected ? 0 : -1;
    });
    panels.forEach(panel => { panel.hidden = panel.dataset.panel !== active; });
    document.title = `${active[0].toUpperCase()}${active.slice(1)} — Lucas Coster`;
    if (updateHash && location.hash !== `#/${active}`) history.pushState(null, '', `#/${active}`);
  }
  function readHash() { setTab(location.hash.replace(/^#\/?/, ''), false); }
  tabs.forEach(tab => tab.addEventListener('click', event => {
    event.preventDefault();
    setTab(tab.dataset.tab);
  }));
  window.addEventListener('hashchange', readHash);
  window.addEventListener('popstate', readHash);
  readHash();

  document.querySelector('[data-current-year]').textContent = new Date().getFullYear();
  document.querySelector('[data-back-top]').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  function announce(message) {
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }
  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(EMAIL);
    } catch (error) {
      const temporary = document.createElement('textarea');
      temporary.value = EMAIL;
      temporary.setAttribute('readonly', '');
      temporary.style.position = 'fixed';
      temporary.style.opacity = '0';
      document.body.append(temporary);
      temporary.select();
      document.execCommand('copy');
      temporary.remove();
    }
    const button = document.querySelector('[data-copy-email]');
    button.classList.add('goal-pulse');
    setTimeout(() => button.classList.remove('goal-pulse'), 650);
    announce('Email copied to clipboard');
  }
  document.querySelector('[data-copy-email]').addEventListener('click', copyEmail);

  document.querySelectorAll('[data-flip-card]').forEach(card => card.addEventListener('click', () => {
    const flipped = card.classList.toggle('is-flipped');
    card.setAttribute('aria-pressed', String(flipped));
  }));

  document.querySelectorAll('.glow-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      const box = card.getBoundingClientRect();
      card.style.setProperty('--x', `${event.clientX - box.left}px`);
      card.style.setProperty('--y', `${event.clientY - box.top}px`);
    });
  });

  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => {
      const selected = item === button;
      item.classList.toggle('active', selected);
      item.setAttribute('aria-pressed', String(selected));
    });
    document.querySelectorAll('.project-card').forEach(card => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
  }));

  const projectData = JSON.parse(document.querySelector('#project-data').textContent);
  const projectDialog = document.querySelector('[data-project-dialog]');
  function openProject(id) {
    const project = projectData[id];
    if (!project) return;
    document.querySelector('[data-dialog-title]').textContent = project.title;
    document.querySelector('[data-dialog-meta]').textContent = project.category;
    document.querySelector('[data-dialog-summary]').textContent = project.summary;
    document.querySelector('[data-dialog-problem]').textContent = project.problem;
    document.querySelector('[data-dialog-approach]').textContent = project.approach;
    document.querySelector('[data-dialog-impact]').textContent = project.impact;
    const tagContainer = document.querySelector('[data-dialog-tags]');
    tagContainer.replaceChildren(...project.tags.map(tag => {
      const element = document.createElement('span');
      element.textContent = tag;
      return element;
    }));
    const link = document.querySelector('[data-dialog-link]');
    link.href = project.url;
    projectDialog.showModal();
  }
  document.querySelectorAll('[data-project]').forEach(card => card.querySelector('.project-open').addEventListener('click', () => openProject(card.dataset.project)));
  document.querySelector('[data-close-dialog]').addEventListener('click', () => projectDialog.close());
  projectDialog.addEventListener('click', event => { if (event.target === projectDialog) projectDialog.close(); });

  const palette = document.querySelector('[data-palette-dialog]');
  const paletteInput = document.querySelector('[data-palette-input]');
  function openPalette() {
    palette.showModal();
    paletteInput.value = '';
    paletteInput.dispatchEvent(new Event('input'));
    paletteInput.focus();
  }
  document.querySelector('[data-open-palette]').addEventListener('click', openPalette);
  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
      event.preventDefault();
      palette.open ? palette.close() : openPalette();
    }
    if (event.key === 'Escape' && projectDialog.open) projectDialog.close();
    if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
      if (palette.open || projectDialog.open || event.target.matches('input, textarea, button')) return;
      const current = validTabs.findIndex(name => location.hash.includes(name));
      const next = (current + (event.key === 'ArrowRight' ? 1 : -1) + validTabs.length) % validTabs.length;
      setTab(validTabs[next]);
    }
  });
  palette.querySelectorAll('[data-command]').forEach(button => button.addEventListener('click', () => {
    const command = button.dataset.command;
    palette.close();
    if (command === 'copy') copyEmail();
    else setTab(command);
  }));
  paletteInput.addEventListener('input', () => {
    const query = paletteInput.value.trim().toLowerCase();
    palette.querySelectorAll('[data-command]').forEach(button => {
      button.hidden = query.length > 0 && !button.textContent.toLowerCase().includes(query) && button.dataset.command !== 'copy';
    });
  });
  palette.addEventListener('click', event => { if (event.target === palette) palette.close(); });
})();
