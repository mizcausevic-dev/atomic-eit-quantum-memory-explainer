"use strict";
var EITGlobal = typeof globalThis !== "undefined" ? globalThis : window;


  var SANS = '"Segoe UI", system-ui, sans-serif';
  var MONO = 'ui-monospace, "Cascadia Code", "Segoe UI Mono", monospace';
  var INK = {
    stage: "#0B1019",
    struct: "#344257",
    structLite: "#51627A",
    structDark: "#1C2533",
    edge: "#7E90A6",
    text: "#E7EBF1",
    muted: "#B7C0CE",
    dim: "#8B97A8",
    cyan: "#00E5FF",
    gold: "#FFD166",
    violet: "#9D4EDD",
    line: "rgba(231,235,241,0.72)"
  };

  function mulberry32(a) {
    return function () {
      a |= 0;
      a = (a + 0x6D2B79F5) | 0;
      var t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function gauss(rng) {
    var u = Math.max(rng(), 1e-8);
    var v = rng();
    var r = Math.sqrt(-2 * Math.log(u));
    return [r * Math.cos(Math.PI * 2 * v), r * Math.sin(Math.PI * 2 * v)];
  }

  var GEO = null;
  var ATOMS = [];

  function ensureAtoms() {
    if (ATOMS.length || !GEO) return;
    var rng = mulberry32(0xE17A11);
    while (ATOMS.length < 148) {
      var g = gauss(rng);
      var x = g[0] * 86;
      var y = g[1] * 20;
      if (x < GEO.cellIn + 18 || x > GEO.cellOut - 18) continue;
      if (Math.abs(y) > 46) continue;
      ATOMS.push({ x: x, y: GEO.axisY + y });
    }
  }

  function roundRect(ctx, x, y, w, h, r) {
    var rr = Math.min(r, Math.abs(w) / 2, Math.abs(h) / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  }

  function worldToScreen(cam, x, y, W, H) {
    return [(x - cam.x) * cam.zoom + W / 2, (y - cam.y) * cam.zoom + H / 2];
  }

  function setFont(ctx, size, weight, mono) {
    ctx.font = (weight || 500) + " " + size + "px " + (mono ? MONO : SANS);
  }

  function label(ctx, str, x, y, opt) {
    opt = opt || {};
    ctx.save();
    ctx.globalAlpha = opt.a == null ? 1 : opt.a;
    ctx.fillStyle = opt.color || INK.text;
    setFont(ctx, opt.size || 14, opt.weight || 500, opt.mono);
    ctx.textAlign = opt.align || "left";
    ctx.textBaseline = opt.base || "top";
    ctx.fillText(str, x, y);
    ctx.restore();
  }

  function wrap(ctx, str, x, y, maxW, opt) {
    opt = opt || {};
    setFont(ctx, opt.size || 14, opt.weight || 500, opt.mono);
    var words = str.split(" ");
    var line = "";
    var yy = y;
    var lh = opt.lh || Math.round((opt.size || 14) * 1.35);
    ctx.fillStyle = opt.color || INK.muted;
    ctx.globalAlpha = opt.a == null ? 1 : opt.a;
    ctx.textAlign = opt.align || "left";
    ctx.textBaseline = "top";
    for (var i = 0; i < words.length; i++) {
      var test = line ? line + " " + words[i] : words[i];
      if (ctx.measureText(test).width > maxW && line) {
        ctx.fillText(line, x, yy);
        line = words[i];
        yy += lh;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, x, yy);
    ctx.globalAlpha = 1;
    return yy + lh;
  }

  function panel(ctx, x, y, w, h) {
    ctx.save();
    ctx.fillStyle = "rgba(16, 22, 32, 0.88)";
    ctx.strokeStyle = "rgba(126, 144, 166, 0.45)";
    ctx.lineWidth = 1;
    roundRect(ctx, x, y, w, h, 8);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  function metal(ctx, x, y, w, h, r) {
    var g = ctx.createLinearGradient(x, y, x, y + h);
    g.addColorStop(0, "#4A5C74");
    g.addColorStop(0.4, "#344257");
    g.addColorStop(1, "#232C3A");
    ctx.fillStyle = g;
    roundRect(ctx, x, y, w, h, r);
    ctx.fill();
    ctx.strokeStyle = "#6A7C94";
    ctx.lineWidth = 1.25;
    ctx.stroke();
  }

  function hatch(ctx, x, y, w, h, gap) {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    ctx.strokeStyle = "rgba(126, 144, 166, 0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    for (var d = -h; d < w; d += gap) {
      ctx.moveTo(x + d, y);
      ctx.lineTo(x + d + h, y + h);
    }
    ctx.stroke();
    ctx.restore();
  }

  function envelopePath(ctx, z0, sigma, amp, axisY, height) {
    var extent = Math.max(sigma * 2.35, 10);
    var n = 56;
    ctx.beginPath();
    var i, t, z, gss, y;
    for (i = 0; i <= n; i++) {
      t = i / n;
      z = z0 - extent + t * extent * 2;
      gss = Math.exp(-0.5 * Math.pow((z - z0) / Math.max(sigma, 1), 2));
      y = axisY - gss * amp * height;
      if (i === 0) ctx.moveTo(z, y);
      else ctx.lineTo(z, y);
    }
    for (i = n; i >= 0; i--) {
      t = i / n;
      z = z0 - extent + t * extent * 2;
      gss = Math.exp(-0.5 * Math.pow((z - z0) / Math.max(sigma, 1), 2));
      y = axisY + gss * amp * height;
      ctx.lineTo(z, y);
    }
    ctx.closePath();
  }

  function drawBeam(ctx, x0, y0, x1, y1, w0, w1) {
    var dx = x1 - x0;
    var dy = y1 - y0;
    var len = Math.hypot(dx, dy) || 1;
    var px = -dy / len;
    var py = dx / len;
    ctx.beginPath();
    ctx.moveTo(x0 + px * w0, y0 + py * w0);
    ctx.lineTo(x1 + px * w1, y1 + py * w1);
    ctx.lineTo(x1 - px * w1, y1 - py * w1);
    ctx.lineTo(x0 - px * w0, y0 - py * w0);
    ctx.closePath();
  }

  function drawHardware(ctx, frame, geo) {
    var open = EITGlobal.EIT.smootherstep(EITGlobal.EIT.clamp(frame / 120, 0, 1));
    var axis = geo.axisY;

    ctx.save();
    ctx.strokeStyle = "rgba(231,235,241,0.045)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    var gx;
    for (gx = -1000; gx <= 1000; gx += 48) {
      ctx.moveTo(gx, 80);
      ctx.lineTo(gx, 760);
    }
    for (gx = 80; gx <= 760; gx += 48) {
      ctx.moveTo(-1000, gx);
      ctx.lineTo(1000, gx);
    }
    ctx.stroke();
    ctx.restore();

    metal(ctx, -920, 586, 1760, 26, 3);
    ctx.fillStyle = "#1A2330";
    for (gx = -860; gx <= 800; gx += 140) {
      ctx.beginPath();
      ctx.arc(gx, 599, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    function post(x, top) {
      metal(ctx, x - 7, top, 14, 586 - top, 2);
    }

    metal(ctx, -890, axis - 58, 150, 116, 8);
    hatch(ctx, -884, axis - 52, 18, 104, 6);
    ctx.fillStyle = "#10161F";
    roundRect(ctx, -748, axis - 16, 22, 32, 3);
    ctx.fill();
    ctx.strokeStyle = INK.edge;
    ctx.stroke();
    post(-800, axis + 58);

    metal(ctx, -620, 150, 132, 86, 8);
    hatch(ctx, -614, 156, 16, 74, 6);
    ctx.fillStyle = "#10161F";
    roundRect(ctx, -496, 178, 18, 28, 3);
    ctx.fill();
    ctx.strokeStyle = INK.edge;
    ctx.stroke();
    post(-560, 236);

    function lens(x) {
      ctx.save();
      ctx.fillStyle = "rgba(186, 206, 222, 0.16)";
      ctx.strokeStyle = INK.edge;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(x, axis - 52);
      ctx.bezierCurveTo(x + 16, axis - 30, x + 16, axis + 30, x, axis + 52);
      ctx.bezierCurveTo(x - 16, axis + 30, x - 16, axis - 30, x, axis - 52);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      post(x, axis + 52);
    }
    lens(-430);
    lens(352);

    ctx.save();
    ctx.strokeStyle = INK.structLite;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-360, axis - 34);
    ctx.lineTo(-348, axis - 8);
    ctx.lineTo(-360, axis + 8);
    ctx.moveTo(-360, axis + 34);
    ctx.lineTo(-348, axis + 8);
    ctx.stroke();
    ctx.restore();
    post(-354, axis + 36);

    var shieldX = -360;
    var shieldY = axis - 148;
    var shieldW = 720;
    var shieldH = 292;
    ctx.save();
    ctx.fillStyle = "rgba(52, 66, 87, 0.28)";
    roundRect(ctx, shieldX, shieldY, shieldW, shieldH, 18);
    ctx.fill();
    hatch(ctx, shieldX, shieldY, 22, shieldH, 7);
    hatch(ctx, shieldX + shieldW - 22, shieldY, 22, shieldH, 7);
    ctx.strokeStyle = INK.structLite;
    ctx.lineWidth = 1.5;
    ctx.setLineDash([5, 5]);
    roundRect(ctx, shieldX + 8, shieldY + 8, shieldW - 16, shieldH - 16, 14);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    var cellX = -300;
    var cellY = axis - 96;
    var cellW = 600;
    var cellH = 192;
    ctx.save();
    ctx.fillStyle = "rgba(16, 22, 32, 0.92)";
    roundRect(ctx, cellX, cellY, cellW, cellH, 48);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.globalAlpha = 0.5 * (1 - open) + 0.06;
    ctx.fillStyle = "#3C4D63";
    roundRect(ctx, cellX + 10, cellY + 10, cellW - 20, cellH - 20, 40);
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = "rgba(154, 171, 190, 0.55)";
    ctx.lineWidth = 1.25;
    ctx.setLineDash([4, 4]);
    roundRect(ctx, cellX + 16, cellY + 16, cellW - 32, cellH - 32, 36);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.strokeStyle = INK.edge;
    ctx.lineWidth = 2;
    roundRect(ctx, cellX, cellY, cellW, cellH, 48);
    ctx.stroke();
    ctx.restore();

    function windowCap(x) {
      ctx.save();
      ctx.fillStyle = "rgba(198, 214, 226, 0.2)";
      ctx.strokeStyle = "#C5D2DF";
      ctx.lineWidth = 1.5;
      roundRect(ctx, x, axis - 58, 16, 116, 4);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
    windowCap(cellX - 8);
    windowCap(cellX + cellW - 8);

    ctx.save();
    ctx.strokeStyle = "rgba(231,235,241,0.35)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(geo.cellIn, axis + 78);
    ctx.lineTo(geo.cellIn, axis + 92);
    ctx.lineTo(geo.cellOut, axis + 92);
    ctx.lineTo(geo.cellOut, axis + 78);
    ctx.stroke();
    ctx.restore();

    metal(ctx, geo.outputX - 36, axis - 46, 92, 92, 8);
    ctx.save();
    ctx.strokeStyle = INK.edge;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(geo.outputX + 10, axis, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
    post(geo.outputX + 8, axis + 46);

    ctx.save();
    ctx.strokeStyle = "rgba(231,235,241,0.28)";
    ctx.setLineDash([2, 7]);
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(-748, axis);
    ctx.lineTo(geo.outputX - 36, axis);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  function drawFields(ctx, st) {
    var geo = st.geo;
    var s = st.sample;
    var axis = geo.axisY;
    var oc = s.oc;

    drawBeam(ctx, -496, 192, -20, axis - 88, 7, 2.4);
    ctx.save();
    ctx.fillStyle = INK.gold;
    ctx.globalAlpha = 0.04 + 0.28 * oc;
    ctx.fill();
    ctx.restore();

    ctx.save();
    ctx.strokeStyle = INK.gold;
    ctx.globalAlpha = oc > 0.04 ? 0.85 : 0.35;
    ctx.lineWidth = 1.25;
    if (oc < 0.04) ctx.setLineDash([4, 6]);
    ctx.beginPath();
    ctx.moveTo(-490, 192);
    ctx.lineTo(-36, axis - 78);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    if (!s.alive || s.amp <= 0.001) return;

    envelopePath(ctx, s.z, s.sigma, s.amp, axis, 74);
    ctx.save();
    if (s.spin > 0.02) {
      ctx.fillStyle = INK.violet;
      ctx.globalAlpha = 0.5 * s.spin;
      ctx.fill();
    }
    if (s.photonic > 0.02) {
      ctx.fillStyle = INK.cyan;
      ctx.globalAlpha = 0.42 * s.photonic;
      ctx.fill();
    }
    ctx.lineWidth = 2;
    ctx.strokeStyle = INK.violet;
    ctx.globalAlpha = 0.15 + 0.85 * s.spin;
    ctx.stroke();
    ctx.strokeStyle = INK.cyan;
    ctx.globalAlpha = s.photonic < 0.04 ? 0 : Math.min(1, 0.25 + 0.85 * s.photonic);
    ctx.lineWidth = 2.4;
    ctx.stroke();
    ctx.restore();

    if (!s.frozen && s.vg > 0.08) {
      var tip = s.z + s.sigma * 1.15;
      ctx.save();
      ctx.strokeStyle = "rgba(231,235,241,0.8)";
      ctx.fillStyle = "rgba(231,235,241,0.8)";
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(tip, axis);
      ctx.lineTo(tip - 14, axis - 6);
      ctx.lineTo(tip - 14, axis + 6);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  function drawAtoms(ctx, st) {
    var s = st.sample;
    var i, a, gss, len, phase;
    for (i = 0; i < ATOMS.length; i++) {
      a = ATOMS[i];
      ctx.beginPath();
      ctx.fillStyle = "#C5CDD8";
      ctx.globalAlpha = 0.78;
      ctx.arc(a.x, a.y, 3.1, 0, Math.PI * 2);
      ctx.fill();
      if (s.inside && s.spin > 0.12 && s.amp > 0.05) {
        gss = Math.exp(-0.5 * Math.pow((a.x - s.z) / Math.max(s.sigma, 1), 2));
        len = 16 * gss * s.spin * s.amp;
        if (len > 2.2) {
          phase = 0.22 * (a.x - s.z);
          ctx.save();
          ctx.translate(a.x, a.y);
          ctx.rotate(Math.sin(phase) * 0.9);
          ctx.strokeStyle = INK.violet;
          ctx.globalAlpha = Math.min(0.95, 0.35 + gss);
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(-len * 0.5, 0);
          ctx.lineTo(len * 0.5, 0);
          ctx.stroke();
          ctx.restore();
        }
      }
    }
    ctx.globalAlpha = 1;
  }
