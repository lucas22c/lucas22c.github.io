(() => {
  'use strict';

  const slots = [
    { position: 'LW', group: 'FORWARD', first: 'TypeScript', second: 'React' },
    { position: 'C', group: 'FORWARD', first: 'Python', second: 'JavaScript' },
    { position: 'RW', group: 'FORWARD', first: 'TensorFlow', second: 'C++' },
    { position: 'LD', group: 'DEFENSE', first: 'SQL', second: 'AWS' },
    { position: 'RD', group: 'DEFENSE', first: 'Docker', second: 'Agile' },
    { position: 'G', group: 'GOALIE', first: 'GitHub', second: 'PyCharm' }
  ];
  const reports = {
    TypeScript: { level: 'Professional experience', used: 'Briza — Junior Software Developer; full-stack API platform.' },
    Python: { level: 'Project experience', used: 'QMIND design teams; machine-learning projects and computer-vision work.' },
    TensorFlow: { level: 'Project experience', used: 'QMIND; 3D Hand Tracking.' },
    SQL: { level: 'Professional experience', used: 'Briza — SQL data storage and platform testing.' },
    Docker: { level: 'Professional experience', used: 'Briza — tested full-stack platform.' },
    GitHub: { level: 'Professional experience', used: 'Briza — GitHub and Agile coding practices.' },
    React: { level: 'Listed skill', used: 'Included in the portfolio skills roster; project usage not specified.' },
    JavaScript: { level: 'Listed skill', used: 'Included in the portfolio skills roster; project usage not specified.' },
    'C++': { level: 'Listed skill', used: 'Included in the portfolio skills roster; project usage not specified.' },
    AWS: { level: 'Listed skill', used: 'Included in the portfolio skills roster; role or project usage not specified.' },
    Agile: { level: 'Professional experience', used: 'Briza — team and independent Agile coding practices.' },
    PyCharm: { level: 'Listed tool', used: 'Included in the portfolio skills roster; role or project usage not specified.' }
  };

  const section = document.createElement('section');
  section.className = 'lineup-section';
  section.setAttribute('aria-labelledby', 'lineup-title');
  section.innerHTML = `
    <div class="lineup-heading">
      <div><p class="eyebrow">PRE-GAME ROSTER · SKILLS ON ICE</p><h2 id="lineup-title">Starting <span>lineup.</span></h2><p class="lineup-deck">Tap a player for the scouting report. Switch lines to see the full roster.</p></div>
      <div class="line-switch" role="group" aria-label="Choose a skill lineup">
        <button type="button" class="line-switch-button is-active" data-line="first" aria-pressed="true">1ST LINE <small>CORE STACK</small></button>
        <button type="button" class="line-switch-button" data-line="second" aria-pressed="false">2ND LINE <small>SUPPORTING TOOLS</small></button>
      </div>
    </div>
    <div class="lineup-board">
      <div class="lineup-board-top"><span>HOME ROSTER · 6 ON THE ICE</span><span class="line-name" data-line-name>1ST LINE / CORE STACK</span></div>
      <div class="formation-rink" aria-label="Hockey formation showing three forwards, two defense players, and one goalie">
        <span class="formation-center-line"></span><span class="formation-blue-line formation-blue-left"></span><span class="formation-blue-line formation-blue-right"></span><span class="formation-circle formation-circle-left"></span><span class="formation-circle formation-circle-right"></span><span class="formation-crease"></span>
        <div class="formation-slots">
          ${slots.map((slot, index) => `<button type="button" class="formation-player ${slot.position === 'G' ? 'goalie-slot' : ''}" data-slot="${index}" aria-pressed="false"><span class="player-position">${slot.position}</span><span class="player-skill" data-player-skill>${slot.first}</span><span class="player-group">${slot.group}</span></button>`).join('')}
        </div>
      </div>
      <div class="lineup-report" data-lineup-report aria-live="polite"><span class="report-icon">✳</span><p>Select a player on the ice to see their experience and game tape.</p></div>
      <p class="lineup-footnote">POSITIONING IS A PLAYFUL METAPHOR · SKILL LEVELS REFLECT EXPERIENCE LISTED IN THE PORTFOLIO</p>
    </div>`;

  const overview = document.querySelector('[data-panel="overview"]');
  const bento = overview?.querySelector('.bento-grid');
  if (!overview || !bento) return;
  bento.insertAdjacentElement('afterend', section);

  const report = section.querySelector('[data-lineup-report]');
  const lineupButtons = [...section.querySelectorAll('.formation-player')];
  let activeLine = 'first';

  function selectPlayer(button) {
    const index = Number(button.dataset.slot);
    const skill = slots[index][activeLine];
    const note = reports[skill];
    lineupButtons.forEach(player => {
      const selected = player === button;
      player.classList.toggle('is-selected', selected);
      player.setAttribute('aria-pressed', String(selected));
    });
    report.innerHTML = `<span class="report-icon">${slots[index].position}</span><div><span class="report-skill">${skill}</span><span class="report-level">${note.level}</span><p>${note.used}</p></div>`;
  }

  function changeLine(line) {
    activeLine = line;
    section.querySelectorAll('[data-line]').forEach(button => {
      const selected = button.dataset.line === line;
      button.classList.toggle('is-active', selected);
      button.setAttribute('aria-pressed', String(selected));
    });
    section.querySelector('[data-line-name]').textContent = line === 'first' ? '1ST LINE / CORE STACK' : '2ND LINE / SUPPORTING TOOLS';
    lineupButtons.forEach((button, index) => {
      button.classList.remove('is-selected');
      button.setAttribute('aria-pressed', 'false');
      button.classList.add('player-entering');
      button.querySelector('[data-player-skill]').textContent = slots[index][line];
      setTimeout(() => button.classList.remove('player-entering'), 460 + index * 55);
    });
    report.innerHTML = '<span class="report-icon">✳</span><p>Select a player on the ice to see their experience and game tape.</p>';
  }

  section.querySelectorAll('[data-line]').forEach(button => button.addEventListener('click', () => changeLine(button.dataset.line)));
  lineupButtons.forEach(button => button.addEventListener('click', () => selectPlayer(button)));
})();
