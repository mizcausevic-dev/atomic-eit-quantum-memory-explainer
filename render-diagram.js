"use strict";
function drawLambdaWorld(ctx, frame) {
    var fadeIn = EITGlobal.EIT.smootherstep(EITGlobal.EIT.clamp((frame - 168) / 40, 0, 1));
    var fadeOut = 1 - EITGlobal.EIT.smootherstep(EITGlobal.EIT.clamp((frame - 308) / 40, 0, 1));
    var a = fadeIn * fadeOut;
    if (a < 0.02) return;
    var x = 128;
    var y = 36;
    var w = 470;
    var h = 286;
    ctx.save();
    ctx.globalAlpha = a;
    ctx.fillStyle = "rgba(16, 22, 32, 0.94)";
    ctx.strokeStyle = "rgba(157, 78, 221, 0.65)";
    ctx.lineWidth = 1.5;
    roundRect(ctx, x, y, w, h, 10);
    ctx.fill();
    ctx.stroke();
    drawLambdaBody(ctx, x + 28, y + 36, w - 56, h - 52, frame, false);
    ctx.restore();
  }

  function drawLambdaBody(ctx, x, y, w, h, frame, compact) {
    var gX = x + w * 0.22;
    var sX = x + w * 0.78;
    var eY = y + (compact ? 28 : 36);
    var gY = y + h - (compact ? 36 : 48);
    ctx.save();
    ctx.strokeStyle = INK.dim;
    ctx.lineWidth = 1.25;
    ctx.beginPath();
    ctx.moveTo(gX - 34, gY);
    ctx.lineTo(gX + 34, gY);
    ctx.moveTo(sX - 34, gY - 10);
    ctx.lineTo(sX + 34, gY - 10);
    ctx.moveTo((gX + sX) / 2 - 28, eY);
    ctx.lineTo((gX + sX) / 2 + 28, eY);
    ctx.stroke();

    ctx.strokeStyle = INK.cyan;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(gX, gY - 4);
    ctx.lineTo((gX + sX) / 2 - 8, eY + 8);
    ctx.stroke();
    ctx.strokeStyle = INK.gold;
    ctx.beginPath();
    ctx.moveTo(sX, gY - 14);
    ctx.lineTo((gX + sX) / 2 + 8, eY + 8);
    ctx.stroke();

    ctx.strokeStyle = INK.violet;
    ctx.setLineDash([3, 3]);
    ctx.beginPath();
    ctx.moveTo(gX + 8, gY + 22);
    ctx.lineTo(sX - 8, gY + 14);
    ctx.stroke();
    ctx.setLineDash([]);

    var pop = 0.07;
    if (frame >= 520 && frame < 660) pop = 0.13;
    var barX = x + w - 18;
    var barTop = eY + 8;
    var barH = Math.max(28, (gY - eY) * 0.42);
    ctx.fillStyle = "rgba(231,235,241,0.16)";
    roundRect(ctx, barX, barTop, 8, barH, 2);
    ctx.fill();
    ctx.fillStyle = INK.violet;
    ctx.globalAlpha = 0.9;
    roundRect(ctx, barX, barTop, 8, Math.max(3, barH * pop * 1.6), 2);
    ctx.fill();
    ctx.globalAlpha = 1;

    label(ctx, "|e>", (gX + sX) / 2 - 8, eY - 20, { size: compact ? 13 : 16, color: INK.text });
    label(ctx, "|g>", gX - 36, gY - 22, { size: compact ? 13 : 16, color: INK.cyan });
    label(ctx, "|s>", sX + 28, gY - 26, { size: compact ? 13 : 16, color: INK.gold });
    label(ctx, "signal", gX + 8, (gY + eY) / 2, { size: 12, color: INK.cyan });
    label(ctx, "control", sX - 78, (gY + eY) / 2 - 10, { size: 12, color: INK.gold });
    label(ctx, "coherence", (gX + sX) / 2 - 32, gY + (compact ? 16 : 42), { size: 12, color: INK.violet });
    if (!compact) {
      label(ctx, "residual |e| stays small", x + w - 150, eY - 18, { size: 11, color: INK.dim });
    }
    ctx.restore();
  }

  function drawSpectrum(ctx, x, y, w, h) {
    function absAt(d) {
      function peak(x0) {
        return 1 / (1 + Math.pow((d - x0) / 0.2, 2));
      }
      var win = Math.exp(-Math.pow(d / 0.055, 2));
      return 0.08 + (0.5 * peak(-0.48) + 0.5 * peak(0.48)) * (1 - 0.9 * win);
    }
    var left = x + 36;
    var top = y + 28;
    var pw = w - 52;
    var ph = h - 58;
    ctx.save();
    ctx.strokeStyle = "rgba(231,235,241,0.25)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(left, top);
    ctx.lineTo(left, top + ph);
    ctx.lineTo(left + pw, top + ph);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = INK.cyan;
    ctx.lineWidth = 1.6;
    var i, d, ax, ay;
    for (i = 0; i <= 80; i++) {
      d = -1 + (2 * i) / 80;
      ax = left + (i / 80) * pw;
      ay = top + ph - absAt(d) * (ph - 8);
      if (i === 0) ctx.moveTo(ax, ay);
      else ctx.lineTo(ax, ay);
    }
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = INK.gold;
    ctx.lineWidth = 1.25;
    for (i = 0; i <= 80; i++) {
      d = -1 + (2 * i) / 80;
      var disp = Math.tanh(d / 0.08) * 0.55;
      ax = left + (i / 80) * pw;
      ay = top + ph * 0.55 - disp * ph * 0.45;
      if (i === 0) ctx.moveTo(ax, ay);
      else ctx.lineTo(ax, ay);
    }
    ctx.stroke();
    ctx.restore();
    label(ctx, "EIT window, schematic", x + 12, y + 8, { size: 13, color: INK.text, weight: 600 });
    label(ctx, "cyan absorption", x + 12, y + h - 28, { size: 11, color: INK.cyan });
    label(ctx, "gold dispersion", x + 130, y + h - 28, { size: 11, color: INK.gold });
    label(ctx, "axes unscaled", x + 12, y + h - 14, { size: 11, color: INK.dim });
  }

  function drawMeter(ctx, x, y, w, h, st) {
    var m = EITGlobal.EIT.mixingFromControl(st.sample.oc);
    var phot = m.photonic;
    var split = x + 12 + (w - 24) * phot;
    ctx.save();
    roundRect(ctx, x + 12, y + 46, w - 24, 16, 4);
    ctx.clip();
    ctx.fillStyle = INK.violet;
    ctx.fillRect(x + 12, y + 46, w - 24, 16);
    ctx.fillStyle = INK.cyan;
    ctx.fillRect(x + 12, y + 46, Math.max(0, split - (x + 12)), 16);
    ctx.restore();
    label(ctx, "Mixing inside the ensemble", x + 12, y + 8, { size: 13, color: INK.text, weight: 600 });
    label(ctx, "photonic  cos^2 theta", x + 12, y + 28, { size: 11, color: INK.cyan });
    label(ctx, "spin  sin^2 theta", x + w - 12, y + 28, { size: 11, color: INK.violet, align: "right" });
    label(ctx, "illustrative ratio, not a measurement", x + 12, y + 70, { size: 11, color: INK.dim });
  }

  function drawEquation(ctx, x, y, w) {
    label(ctx, "Ideal polariton model", x, y, { size: 13, color: INK.text, weight: 600 });
    label(ctx, "vg = c * cos^2 theta", x, y + 22, { size: 13, color: INK.cyan, mono: true });
    label(ctx, "cos theta = Omega_c / sqrt(Omega_c^2 + g^2 N)", x, y + 42, { size: 11, color: INK.muted, mono: true });
    label(ctx, "Psi = cos theta * E - sin theta * sqrt(N) * S", x, y + 60, { size: 11, color: INK.violet, mono: true });
    wrap(ctx, "E is the signal envelope. S is the collective spin coherence. c is unchanged.", x, y + 80, w, { size: 12, color: INK.dim, lh: 15 });
  }

  function drawCompare(ctx, x, y, w, h) {
    label(ctx, "Envelope comparison", x + 12, y + 8, { size: 13, color: INK.text, weight: 600 });
    function bump(amp, color, dash) {
      ctx.save();
      ctx.beginPath();
      var i, t, gss;
      for (i = 0; i <= 48; i++) {
        t = i / 48;
        gss = Math.exp(-0.5 * Math.pow((t - 0.5) / 0.14, 2));
        var px = x + 16 + t * (w - 32);
        var py = y + h - 28 - gss * amp * 46;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 1.6;
      if (dash) ctx.setLineDash([3, 3]);
      ctx.stroke();
      ctx.restore();
    }
    bump(1, "rgba(231,235,241,0.55)", true);
    bump(0.62, INK.cyan, false);
    label(ctx, "input shape", x + 12, y + h - 16, { size: 11, color: INK.dim });
    label(ctx, "retrieved, weaker", x + w - 12, y + h - 16, { size: 11, color: INK.cyan, align: "right" });
  }

  function leader(ctx, x1, y1, x2, y2, title, body, color, W) {
    if (y1 < 176 || y1 > 900 || x1 < 150 || x1 > W - 430) return;
    if (y2 < 176 || y2 > 900) return;
    var mid = x1 + (x2 - x1) * 0.4;
    var placeLeft = x2 > W * 0.58;
    ctx.save();
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.lineWidth = 1.15;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(mid, y1);
    ctx.lineTo(mid, y2);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x1, y1, 3.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    var tx = placeLeft ? x2 - 8 : x2 + 6;
    var align = placeLeft ? "right" : "left";
    label(ctx, title, tx, y2 - 16, { size: 13, color: color, weight: 650, align: align });
    if (body) label(ctx, body, tx, y2 + 1, { size: 11, color: INK.muted, align: align });
  }
