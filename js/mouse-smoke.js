/**
 * ============================================================================
 * TIGHT HARMONIC SILK BRUSH (EXACT GOLDEN REFERENCE MATCH)
 * 5 Closely-Bundled Silk Strands | Tight 5px Spread | Natural Feathered Tail
 * Brand Colors: Luminous White -> Flame Orange -> Ice Cyan
 * ============================================================================
 */

(function () {
  'use strict';

  // 1. TIGHT & DELICATE SILK BUNDLE CONFIGURATION
  const CONFIG = {
    strandCount: 5,           // 5 Parallel silk threads
    maxSpread: 5.5,           // Tightly bundled (Poonch bilkul moti nahi phaylegi, sirf 5px spread)
    lineWidth: 0.95,          // Halki patli tangible silk line (0.95px)
    maxAge: 0.22,             // Compact ~90px arc length
    minDist: 3.0,             // Zero-glitch spacing
    
    // Brand 3 Colors
    cWhite: [255, 255, 255],
    cOrange: [255, 107, 0],   // Flame Orange
    cBlue: [0, 180, 216],     // Electric Ice Cyan
    
    dprCap: 3                 // Full 3X Retina Crispness
  };

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  // 2. ULTRA-HD CANVAS
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d', { alpha: true, desynchronized: true });

  Object.assign(canvas.style, {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100vw',
    height: '100vh',
    pointerEvents: 'none',
    zIndex: '999999',
    background: 'transparent'
  });

  let width = 0;
  let height = 0;
  let dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, CONFIG.dprCap);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
  }

  // 3. 120Hz/240Hz SUB-PIXEL INPUT TRACKING
  const points = [];
  let mouseX = -9999;
  let mouseY = -9999;
  let smoothX = -9999;
  let smoothY = -9999;
  let hasMoved = false;

  function onPointerMove(px, py) {
    mouseX = px;
    mouseY = py;
    if (!hasMoved) {
      smoothX = px;
      smoothY = py;
      hasMoved = true;
    }
  }

  window.addEventListener('pointermove', (e) => {
    if (e.getCoalescedEvents) {
      const events = e.getCoalescedEvents();
      for (let i = 0; i < events.length; i++) {
        onPointerMove(events[i].clientX, events[i].clientY);
      }
    } else {
      onPointerMove(e.clientX, e.clientY);
    }
  }, { passive: true });

  window.addEventListener('resize', resize, { passive: true });

  // 4. FRAME-RATE INDEPENDENT ANIMATION LOOP (LOCKED 60/120 FPS)
  let lastTime = performance.now();
  let isRunning = true;

  document.addEventListener('visibilitychange', () => {
    isRunning = !document.hidden;
    if (isRunning) {
      lastTime = performance.now();
      requestAnimationFrame(render);
    }
  });

  function render(now) {
    if (!isRunning) return;
    requestAnimationFrame(render);

    const dt = Math.min((now - lastTime) * 0.001, 0.033);
    lastTime = now;
    const currentTime = now * 0.001;

    // Silky spring cursor interpolation
    if (hasMoved) {
      const lerpFactor = 1 - Math.exp(-42 * dt);
      smoothX += (mouseX - smoothX) * lerpFactor;
      smoothY += (mouseY - smoothY) * lerpFactor;

      const lastPt = points[0];
      if (!lastPt || Math.hypot(smoothX - lastPt.x, smoothY - lastPt.y) >= CONFIG.minDist) {
        points.unshift({ x: smoothX, y: smoothY, time: currentTime });
      }
    }

    // Strict 220ms time decay (Guarantees compact arc)
    while (points.length > 0 && (currentTime - points[points.length - 1].time) > CONFIG.maxAge) {
      points.pop();
    }

    ctx.clearRect(0, 0, width, height);

    const len = points.length;
    if (len < 4) return;

    // Calculate Tangents and Normals along Unbroken Spine
    const normals = [];
    for (let i = 0; i < len; i++) {
      const pPrev = points[Math.max(0, i - 1)];
      const pNext = points[Math.min(len - 1, i + 1)];

      let dx = pNext.x - pPrev.x;
      let dy = pNext.y - pPrev.y;
      let dLen = Math.hypot(dx, dy);

      if (dLen < 0.001) {
        normals.push(normals[i - 1] || { x: 0, y: 1 });
      } else {
        normals.push({ x: -dy / dLen, y: dx / dLen });
      }
    }

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 5 Closely-Spaced Parallel Offsets (Centered tight bundle)
    const offsets = [-1.0, -0.5, 0, 0.5, 1.0];

    for (let s = 0; s < CONFIG.strandCount; s++) {
      const strandOffsetFactor = offsets[s];

      // Natural Feathered Tail: Outer strands terminate 2-3 points earlier (Brush effect)
      const strandLen = Math.max(3, Math.floor(len * (1 - Math.abs(strandOffsetFactor) * 0.14)));

      const strandPoints = [];
      for (let i = 0; i < strandLen; i++) {
        const pt = points[i];
        const norm = normals[i];
        const progress = i / (len - 1);

        // Smooth subtle envelope: Starts tight at cursor, subtle 5px silk gap in turn
        const envelope = Math.sin(progress * Math.PI * 0.9);
        const offsetDist = strandOffsetFactor * (CONFIG.maxSpread * 0.5 * envelope);

        strandPoints.push({
          x: pt.x + norm.x * offsetDist,
          y: pt.y + norm.y * offsetDist
        });
      }

      // Brand 3-Color Gradient for this strand
      const head = strandPoints[0];
      const tail = strandPoints[strandPoints.length - 1];
      const grad = ctx.createLinearGradient(head.x, head.y, tail.x, tail.y);
      
      grad.addColorStop(0.0, 'rgba(255, 255, 255, 0.95)');       // White hot tip
      grad.addColorStop(0.28, 'rgba(255, 107, 0, 0.85)');       // Warm Flame Orange
      grad.addColorStop(0.70, 'rgba(0, 180, 216, 0.70)');       // Cool Ice Cyan
      grad.addColorStop(1.0, 'rgba(0, 180, 216, 0)');           // Feathered soft fade

      // Draw single unbroken silk thread
      ctx.beginPath();
      ctx.strokeStyle = grad;
      ctx.lineWidth = CONFIG.lineWidth;

      ctx.moveTo(strandPoints[0].x, strandPoints[0].y);
      for (let i = 1; i < strandPoints.length - 1; i++) {
        const xc = (strandPoints[i].x + strandPoints[i + 1].x) * 0.5;
        const yc = (strandPoints[i].y + strandPoints[i + 1].y) * 0.5;
        ctx.quadraticCurveTo(strandPoints[i].x, strandPoints[i].y, xc, yc);
      }
      ctx.lineTo(strandPoints[strandPoints.length - 1].x, strandPoints[strandPoints.length - 1].y);
      ctx.stroke();
    }

    ctx.restore();
  }

  // 5. BOOTSTRAP
  function init() {
    resize();
    document.body.appendChild(canvas);
    requestAnimationFrame(render);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();