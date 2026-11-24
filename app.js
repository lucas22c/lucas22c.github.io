(() => {
  'use strict';
  const EMAIL = 'lucascoster90@gmail.com';
  const pages = [
    { id: 'overview', label: 'Pre-Game', point: [118, 70] },
    { id: 'education', label: '1st Period', point: [270, 70] },
    { id: 'experience', label: '2nd Period', point: [420, 70] },
    { id: 'projects', label: '3rd Period', point: [570, 70] },
    { id: 'contact', label: 'Overtime', point: [722, 70] }
  ];
  const nav = document.querySelector('.tabbar');
  const main = document.querySelector('#main');
  const panels = new Map([...document.querySelectorAll('[data-panel]')].map(panel => [panel.dataset.panel, panel]));
  const toast = document.querySelector('[data-toast]');
  let toastTimer;

  // Load the small, static enhancements explicitly: all assets remain GitHub Pages compatible.
  ['hockey.css', 'skill-lineup.css', 'portfolio-craft.css'].forEach(href => {
    const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = href; document.head.append(link);
  });

  const rink = `<div class="rink-wrap" aria-label="Interactive hockey rink navigation"><div class="rink-caption"><span>SELECT YOUR ZONE</span><span>PORTFOLIO ARENA · EST. 1990</span></div><svg class="ice-rink" viewBox="0 0 840 140" role="group" aria-label="Hockey rink sections"><defs><clipPath id="rink-clip"><rect x="8" y="8" width="824" height="124" rx="48"/></clipPath></defs><rect class="rink-ice" x="8" y="8" width="824" height="124" rx="48"/><g clip-path="url(#rink-clip)"><line class="rink-red" x1="420" y1="8" x2="420" y2="132"/><line class="rink-blue" x1="270" y1="8" x2="270" y2="132"/><line class="rink-blue" x1="570" y1="8" x2="570" y2="132"/><circle class="rink-mark" cx="420" cy="70" r="23"/><circle class="rink-mark" cx="110" cy="35" r="13"/><circle class="rink-mark" cx="110" cy="105" r="13"/><circle class="rink-mark" cx="730" cy="35" r="13"/><circle class="rink-mark" cx="730" cy="105" r="13"/><path class="rink-crease" d="M34 52 Q51 70 34 88 L17 88 L17 52Z"/><path class="rink-crease" d="M806 52 Q789 70 806 88 L823 88 L823 52Z"/>${pages.map(page => `<g class="rink-zone" data-rink-tab="${page.id}" tabindex="0" role="button" aria-label="Navigate to ${page.label}"><rect x="${page.point[0] - 62}" y="9" width="124" height="122"/><text x="${page.point[0]}" y="75">${page.label.toUpperCase()}</text></g>`).join('')}</g><circle class="rink-puck" data-rink-puck cx="118" cy="70" r="7"/></svg></div>`;
  nav.innerHTML = pages.map(page => `<a href="#/${page.id}" role="tab" data-tab="${page.id}">${page.label}</a>`).join('');
  nav.insertAdjacentHTML('beforebegin', rink);
  const liveTabs = [...nav.querySelectorAll('[data-tab]')];
  const puck = document.querySelector('[data-rink-puck]');

  const contactSection = document.querySelector('.contact-footer');
  if (contactSection) {
    const contactPanel = document.createElement('section');
    contactPanel.className = 'tab-panel contact-panel'; contactPanel.dataset.panel = 'contact'; contactPanel.id = 'panel-contact';
    contactPanel.setAttribute('role', 'tabpanel'); contactPanel.setAttribute('aria-labelledby', 'tab-contact');
    contactPanel.innerHTML = '<div class="page-heading"><div><p class="eyebrow">OVERTIME · 05 / 05</p><h1>Make the <span>next play.</span></h1><p class="page-deck">Open to a good conversation, a new challenge, or your next big idea.</p></div></div>';
    contactPanel.append(contactSection); main.append(contactPanel); panels.set('contact', contactPanel);
  }

  function setPage(id, updateHash = true) {
    const active = pages.some(page => page.id === id) ? id : 'overview';
    liveTabs.forEach(tab => {
      const selected = tab.dataset.tab === active;
      tab.id = `tab-${tab.dataset.tab}`; tab.tabIndex = selected ? 0 : -1;
      tab.setAttribute('aria-selected', String(selected));
    });
    panels.forEach((panel, name) => { panel.hidden = name !== active; });
    document.querySelectorAll('[data-rink-tab]').forEach(zone => zone.classList.toggle('is-active', zone.dataset.rinkTab === active));
    const page = pages.find(item => item.id === active); puck.setAttribute('cx', page.point[0]); puck.setAttribute('cy', page.point[1]);
    document.title = `${page.label} — Lucas Coster`;
    if (updateHash && location.hash !== `#/${active}`) history.pushState(null, '', `#/${active}`);
  }
  liveTabs.forEach(tab => tab.addEventListener('click', event => { event.preventDefault(); setPage(tab.dataset.tab); }));
  document.querySelectorAll('[data-rink-tab]').forEach(zone => {
    const go = () => setPage(zone.dataset.rinkTab);
    zone.addEventListener('click', go);
    zone.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); go(); } });
  });
  function readHash() { setPage(location.hash.replace(/^#\/?/, ''), false); }
  window.addEventListener('hashchange', readHash); window.addEventListener('popstate', readHash); readHash();
  document.querySelector('[data-current-year]').textContent = new Date().getFullYear();
  document.querySelector('[data-back-top]').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // A promotion is a new EllisDon role, not a rewrite of the 2025 position.
  const experienceList = document.querySelector('.experience-list');
  const oldEllisDon = experienceList?.querySelector('.experience-card');
  if (oldEllisDon) {
    const oldIndex = oldEllisDon.querySelector('.role-index');
    if (oldIndex) oldIndex.textContent = '02 / PREVIOUS ROLE';
    const oldTitle = oldEllisDon.querySelector('.role-top h3');
    if (oldTitle) oldTitle.textContent = 'Full Stack Developer';
    const oldDate = oldEllisDon.querySelector('.role-top time');
    if (oldDate) oldDate.textContent = 'OCT 2025 — SEP 2026';
    const promoted = document.createElement('article');
    promoted.className = 'card experience-card glow-card';
    promoted.innerHTML = '<div class="role-top"><div><span class="role-index">01 / PROMOTED · SAME COMPANY</span><h2>EllisDon</h2><h3>Software Engineer</h3></div><time>OCT 2026 — PRESENT</time></div><p>Responsible for the ideation, planning, development and maintenance of new applications aimed to solve internal and external problems and inefficiencies. Work closely with clients to understand business need, plan solutions and iterate based on feedback. An example of this is a solution built for the sustainability team to assist them in gathering emissions data from invoices. The platform handles 100,000+ invoices and extracts data at a 96% accuracy, uptime is over 95% and the design is fluid and easy for the team to use. I focus on solving problems efficiently and accurately while staying up to date in industry standard tooling, practice and security.</p><div class="outcome-grid"><div><span>100,000+</span><p>Invoices handled</p></div><div><span>96%</span><p>Data extraction accuracy</p></div><div><span>&gt;95%</span><p>Platform uptime</p></div></div><div class="tag-list"><span>APPLICATION DEVELOPMENT</span><span>CLIENT COLLABORATION</span><span>SUSTAINABILITY</span><span>DATA EXTRACTION</span><span>SECURITY</span></div>';
    experienceList.insertBefore(promoted, oldEllisDon);
    const currentLineup = document.querySelector('.now-card');
    if (currentLineup) {
      const title = currentLineup.querySelector('h2'); if (title) title.textContent = 'EllisDon';
      const description = currentLineup.querySelector('p'); if (description) description.textContent = 'Software Engineer · Promoted October 2026';
      const summary = currentLineup.querySelector('.muted'); if (summary) summary.textContent = 'Ideating, planning, developing, and maintaining applications that solve internal and external problems.';
    }
  }

  function announce(message) {
    toast.textContent = message; toast.classList.add('show'); clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }
  async function copyEmail() {
    try { await navigator.clipboard.writeText(EMAIL); }
    catch (error) {
      const temporary = document.createElement('textarea'); temporary.value = EMAIL; temporary.setAttribute('readonly', '');
      temporary.style.position = 'fixed'; temporary.style.opacity = '0'; document.body.append(temporary); temporary.select(); document.execCommand('copy'); temporary.remove();
    }
    const button = document.querySelector('[data-copy-email]'); button.classList.add('goal-pulse');
    document.querySelector('.scorebug').classList.add('goal-light');
    document.querySelector('.shootout-net')?.classList.add('net-goal'); document.querySelector('.shootout-puck')?.classList.add('puck-shot');
    setTimeout(() => { button.classList.remove('goal-pulse'); document.querySelector('.scorebug').classList.remove('goal-light'); }, 1000);
    setTimeout(() => { document.querySelector('.shootout-net')?.classList.remove('net-goal'); document.querySelector('.shootout-puck')?.classList.remove('puck-shot'); }, 900);
    announce('GOAL! Email copied');
  }
  document.querySelector('[data-copy-email]').addEventListener('click', copyEmail);
  document.querySelectorAll('[data-flip-card]').forEach(card => card.addEventListener('click', () => {
    const flipped = card.classList.toggle('is-flipped'); card.setAttribute('aria-pressed', String(flipped));
  }));
  const rookie = document.querySelector('.player-card');
  if (rookie) {
    rookie.classList.add('rookie-card');
    const back = rookie.querySelector('.player-card-back');
    if (back) back.innerHTML = '<span class="card-kicker">SCOUTING REPORT · COMBINE</span><span class="back-stat"><b>3.5+</b><small>Queen’s GPA</small></span><span class="back-stat"><b>CAN</b><small>Ultimate Frisbee · International event</small></span><span class="back-stat"><b>ML + WEB</b><small>Focus areas</small></span><div class="skill-lines"><span><b>OFFENSE / FRONTEND</b> React · JavaScript · TypeScript · HTML</span><span><b>DEFENSE / BACKEND</b> Python · Java · C · C++ · SQL · Algorithms</span><span><b>GOALIE / INFRA</b> Docker · AWS · GitHub · API Environments</span></div><p class="scout-bio">Computer Engineer with a builder’s mindset, a machine-learning focus, and a team-first approach.</p><span class="flip-hint">CLICK TO RETURN ↻</span>';
    rookie.addEventListener('pointermove', event => {
      if (event.pointerType === 'touch' || rookie.classList.contains('is-flipped')) return;
      const bounds = rookie.getBoundingClientRect(); const x = (event.clientX - bounds.left) / bounds.width; const y = (event.clientY - bounds.top) / bounds.height;
      rookie.style.setProperty('--tilt-x', `${(0.5 - y) * 7}deg`); rookie.style.setProperty('--tilt-y', `${(x - 0.5) * 8}deg`);
      rookie.style.setProperty('--shine-x', `${x * 100}%`); rookie.style.setProperty('--shine-y', `${y * 100}%`);
    });
    rookie.addEventListener('pointerleave', () => { rookie.style.setProperty('--tilt-x', '0deg'); rookie.style.setProperty('--tilt-y', '0deg'); });
  }
  document.querySelectorAll('.glow-card').forEach(card => card.addEventListener('pointermove', event => {
    const box = card.getBoundingClientRect(); card.style.setProperty('--x', `${event.clientX - box.left}px`); card.style.setProperty('--y', `${event.clientY - box.top}px`);
  }));
  const shootout = document.createElement('div'); shootout.className = 'shootout-control';
  shootout.innerHTML = '<button type="button" data-shootout aria-label="Shootout: copy email address"><svg class="shootout-net" viewBox="0 0 62 44" aria-hidden="true"><path d="M12 8h38v27H12zM12 8l38 27M50 8L12 35M12 17h38M12 26h38M22 8v27M31 8v27M40 8v27"/></svg><span class="shootout-puck"></span><span>SHOOTOUT <b>· COPY EMAIL</b></span></button>';
  document.querySelector('.quick-links').append(shootout); shootout.querySelector('button').addEventListener('click', copyEmail);

  document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    document.querySelectorAll('[data-filter]').forEach(item => { const selected = item === button; item.classList.toggle('active', selected); item.setAttribute('aria-pressed', String(selected)); });
    document.querySelectorAll('.project-card').forEach(card => { card.hidden = filter !== 'all' && card.dataset.category !== filter; });
  }));

  const projectData = JSON.parse(document.querySelector('#project-data').textContent); const projectDialog = document.querySelector('[data-project-dialog]');
  function buildPlayDiagram(tags) {
    let board = projectDialog.querySelector('.play-diagram');
    if (!board) {
      board = document.createElement('div'); board.className = 'play-diagram';
      board.innerHTML = '<div class="play-heading"><span>COACH’S BOARD · X’S AND O’S</span><span class="mono">POWER PLAY / 5-ON-5</span></div><svg viewBox="0 0 560 154" role="img" aria-label="Animated play diagram showing technology connections"><rect class="board-rink" x="5" y="5" width="550" height="144" rx="42"/><line class="board-red" x1="280" y1="5" x2="280" y2="149"/><line class="board-blue" x1="175" y1="5" x2="175" y2="149"/><line class="board-blue" x1="385" y1="5" x2="385" y2="149"/><circle class="board-circle" cx="280" cy="77" r="24"/><g class="play-lines"></g><g class="play-nodes"></g></svg>';
      projectDialog.querySelector('.dialog-close').insertAdjacentElement('afterend', board);
    }
    const lines = board.querySelector('.play-lines'); const nodes = board.querySelector('.play-nodes'); lines.replaceChildren(); nodes.replaceChildren();
    const points = tags.slice(0, 4).map((tag, index, list) => ({ tag, x: 65 + index * (430 / Math.max(1, list.length - 1)), y: index % 2 === 0 ? 48 : 106 }));
    points.slice(0, -1).forEach((point, index) => {
      const next = points[index + 1]; const line = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      line.setAttribute('d', `M${point.x},${point.y} Q${(point.x + next.x) / 2},${index % 2 ? 40 : 115} ${next.x},${next.y}`); line.setAttribute('class', 'pass-line'); lines.append(line);
    });
    points.forEach((point, index) => {
      const group = document.createElementNS('http://www.w3.org/2000/svg', 'g'); group.setAttribute('transform', `translate(${point.x} ${point.y})`);
      const marker = document.createElementNS('http://www.w3.org/2000/svg', 'circle'); marker.setAttribute('r', '12'); marker.setAttribute('class', index === 0 ? 'play-puck' : 'play-player'); group.append(marker);
      const label = document.createElementNS('http://www.w3.org/2000/svg', 'text'); label.setAttribute('y', '27'); label.setAttribute('text-anchor', 'middle'); label.textContent = point.tag.length > 15 ? `${point.tag.slice(0, 13)}…` : point.tag; group.append(label); nodes.append(group);
    });
    board.classList.remove('play-active'); requestAnimationFrame(() => board.classList.add('play-active'));
  }
  function openProject(id) {
    const project = projectData[id]; if (!project) return;
    document.querySelector('[data-dialog-title]').textContent = project.title; document.querySelector('[data-dialog-meta]').textContent = project.category;
    document.querySelector('[data-dialog-summary]').textContent = project.summary; document.querySelector('[data-dialog-problem]').textContent = project.problem;
    document.querySelector('[data-dialog-approach]').textContent = project.approach; document.querySelector('[data-dialog-impact]').textContent = project.impact;
    document.querySelector('[data-dialog-tags]').replaceChildren(...project.tags.map(tag => { const span = document.createElement('span'); span.textContent = tag; return span; }));
    document.querySelector('[data-dialog-link]').href = project.url; buildPlayDiagram(project.tags); projectDialog.showModal();
  }
  document.querySelectorAll('[data-project]').forEach(card => card.querySelector('.project-open').addEventListener('click', () => openProject(card.dataset.project)));
  document.querySelector('[data-close-dialog]').addEventListener('click', () => projectDialog.close());
  projectDialog.addEventListener('click', event => { if (event.target === projectDialog) projectDialog.close(); });

  const ticker = document.createElement('aside'); ticker.className = 'broadcast-ticker'; ticker.setAttribute('aria-label', 'Live broadcast ticker');
  ticker.innerHTML = '<span class="ticker-live"><i></i> ON AIR</span><div class="ticker-track"><div class="ticker-copy"><span>QUEEN’S UNIVERSITY · COMPUTER ENGINEERING ’24</span><b>·</b><span>ELLISDON · SOFTWARE ENGINEER</span><b>·</b><span>QMIND · CUCAI MACHINE LEARNING</span><b>·</b><span>PYTHON · TYPESCRIPT · TENSORFLOW · DOCKER · AWS</span><b>·</b><span>ULTIMATE FRISBEE · REPRESENTED CANADA</span><b>·</b><span>ACTIVE ROSTER · OPEN TO THE NEXT PLAY</span><b>·</b></div></div>';
  document.body.append(ticker);
  const palette = document.querySelector('[data-palette-dialog]'); const paletteInput = document.querySelector('[data-palette-input]');
  const overtime = document.createElement('button'); overtime.dataset.command = 'contact'; overtime.innerHTML = '<span>Overtime · Contact</span><kbd>05</kbd>'; palette.append(overtime);
  function openPalette() { palette.showModal(); paletteInput.value = ''; paletteInput.dispatchEvent(new Event('input')); paletteInput.focus(); }
  document.querySelector('[data-open-palette]').addEventListener('click', openPalette);
  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); palette.open ? palette.close() : openPalette(); }
    if (event.key === 'Escape' && projectDialog.open) projectDialog.close();
    if ((event.key === 'ArrowRight' || event.key === 'ArrowLeft') && !palette.open && !projectDialog.open && !event.target.matches('input, textarea, button')) {
      const current = pages.findIndex(page => location.hash.includes(page.id)); setPage(pages[(current + (event.key === 'ArrowRight' ? 1 : -1) + pages.length) % pages.length].id);
    }
  });
  palette.querySelectorAll('[data-command]').forEach(button => button.addEventListener('click', () => { const command = button.dataset.command; palette.close(); command === 'copy' ? copyEmail() : setPage(command); }));
  paletteInput.addEventListener('input', () => { const query = paletteInput.value.trim().toLowerCase(); palette.querySelectorAll('[data-command]').forEach(button => { button.hidden = query.length > 0 && !button.textContent.toLowerCase().includes(query); }); });
  palette.addEventListener('click', event => { if (event.target === palette) palette.close(); });

  // Load the existing interactive lineup after the overview exists in the DOM.
  const lineupScript = document.createElement('script'); lineupScript.src = 'skill-lineup.js'; lineupScript.defer = true; document.body.append(lineupScript);
})();
