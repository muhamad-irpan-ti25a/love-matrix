(() => {
  const canvas = document.getElementById("matrix");
  const ctx = canvas.getContext("2d");
  const particlesCanvas = document.getElementById("particles");
  const pctx = particlesCanvas.getContext("2d");
  const countdown = document.getElementById("countdown");
  const message = document.getElementById("message");
  const loveScene = document.getElementById("loveScene");
  const replay = document.getElementById("replay");

  let width, height, fontSize, columns, drops, rainTimer, sceneTimers = [];
  let particles = [];
  const symbols = "01アイウエオカキクケコサシスセソタチツテトハートLOVE♥♡";
  const pinks = ["#ff4f9a", "#ff2e88", "#b72e68", "#ffd0e4", "#ff78b5"];

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth; height = window.innerHeight;
    [canvas, particlesCanvas].forEach(c => {
      c.width = Math.floor(width * dpr); c.height = Math.floor(height * dpr);
      c.style.width = width + "px"; c.style.height = height + "px";
    });
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    pctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    fontSize = width < 600 ? 11 : 14;
    columns = Math.ceil(width / fontSize);
    drops = Array.from({length: columns}, () => Math.random() * -80);
    ctx.fillStyle = "#080812"; ctx.fillRect(0, 0, width, height);
  }

  function drawMatrix() {
    ctx.fillStyle = "rgba(7, 7, 17, 0.105)";
    ctx.fillRect(0, 0, width, height);
    ctx.font = `bold ${fontSize}px monospace`;
    for (let i = 0; i < drops.length; i++) {
      const ch = symbols[Math.floor(Math.random() * symbols.length)];
      const x = i * fontSize, y = drops[i] * fontSize;
      ctx.fillStyle = Math.random() > .9 ? "#ffc4dc" : pinks[Math.floor(Math.random() * pinks.length)];
      ctx.globalAlpha = Math.random() * .65 + .25;
      ctx.fillText(ch, x, y);
      ctx.globalAlpha = 1;
      if (y > height && Math.random() > .972) drops[i] = Math.random() * -35;
      drops[i] += Math.random() * .55 + .35;
    }
    rainTimer = requestAnimationFrame(drawMatrix);
  }

  function addBurst(x, y, count = 130, heartMode = false) {
    for (let i = 0; i < count; i++) {
      let a = Math.random() * Math.PI * 2;
      let speed = Math.random() * 3.2 + .4;
      particles.push({
        x, y, vx: Math.cos(a) * speed, vy: Math.sin(a) * speed,
        life: Math.random() * 70 + 35, maxLife: 105,
        size: Math.random() * 3 + 1.2,
        color: heartMode ? "#ff4f9a" : (Math.random() > .5 ? "#fffde8" : "#ff8dbb"),
        glyph: heartMode ? (Math.random() > .35 ? "♥" : "♡") : "●"
      });
    }
  }

  function heartPoint(t, scale) {
    return { x: 16 * Math.pow(Math.sin(t), 3) * scale,
      y: -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t)) * scale };
  }

  function drawParticles() {
    pctx.clearRect(0, 0, width, height);
    particles = particles.filter(p => p.life > 0);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy; p.vx *= .985; p.vy *= .985; p.life--;
      pctx.globalAlpha = Math.min(1, p.life / 24);
      pctx.fillStyle = p.color;
      pctx.font = `${p.size * (p.glyph === "●" ? 1 : 2.4)}px Arial`;
      pctx.fillText(p.glyph, p.x, p.y);
    }
    pctx.globalAlpha = 1;
    requestAnimationFrame(drawParticles);
  }

  function clearScenes() {
    sceneTimers.forEach(clearTimeout); sceneTimers = [];
    countdown.className = "countdown"; countdown.textContent = "";
    message.className = "message"; message.textContent = "";
    loveScene.className = "love-scene";
  }
  function after(ms, fn) { sceneTimers.push(setTimeout(fn, ms)); }

  function play() {
    clearScenes();
    countdown.textContent = "2";
    after(500, () => { countdown.classList.add("show"); addBurst(width/2, height/2, 150); });
    after(1800, () => { countdown.className = "countdown"; addBurst(width/2, height/2, 180); });
    const words = [
      { text: "YOU", at: 2900 },
      { text: "Are", at: 5900 },
      { text: "MY", at: 8800 },
      { text: "Love", at: 11600 }
    ];
    words.forEach(item => after(item.at, () => {
      message.textContent = item.text;
      message.className = "message show";
      addBurst(width/2, height/2, 180);
    }));
    after(14300, () => {
      message.className = "message";
      loveScene.classList.add("show");
      const scale = Math.min(width, height) / 42;
      for (let i = 0; i < 450; i++) {
        const t = (i / 450) * Math.PI * 2;
        const pt = heartPoint(t, scale * .72);
        particles.push({ x: width/2 + pt.x, y: height/2 + pt.y,
          vx: (Math.random()-.5)*.8, vy: (Math.random()-.5)*.8,
          life: 180 + Math.random()*90, maxLife: 270, size: 2 + Math.random()*3,
          color: pinks[Math.floor(Math.random()*pinks.length)], glyph: Math.random()>.3 ? "♥" : "♡" });
      }
    });
    after(15500, () => addBurst(width/2, height/2, 220, true));
  }

  window.addEventListener("resize", resize);
  replay.addEventListener("click", play);
  resize();
  drawMatrix();
  drawParticles();
  play();
})();