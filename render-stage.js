"use strict";
function drawCallouts(ctx, st, W, H) {
    var f = st.frame;
    var cam = st.camera;
    var geo = st.geo;
    var s = st.sample;
    function P(x, y) { return worldToScreen(cam, x, y, W, H); }

    if (f < 300) {
      var src = P(geo.sourceX, geo.axisY);
      if (src[0] > 40 && src[0] < W - 40) {
        leader(ctx, src[0], src[1], src[0] - 10, src[1] - 78, "01  Signal source", "pulsed probe mode", INK.cyan, W);
      }
      var ctl = P(-560, 190);
      if (ctl[0] > 20 && ctl[0] < W - 180) {
        leader(ctx, ctl[0], ctl[1], ctl[0] + 24, ctl[1] + 56, "02  Control source", st.sample.oc > 0.2 ? "classical field on" : "path, field off", INK.gold, W);
      }
    }

    var cellPt = P(0, geo.axisY - 96);
    if (f >= 70 && f < 520 && cellPt[0] > 80 && cellPt[0] < W - 220) {
      leader(ctx, cellPt[0], cellPt[1], cellPt[0] + 36, cellPt[1] - 36, "03  Ensemble cell", "longitudinal section", INK.line, W);
    }

    if (f >= 150 && f < 340) {
      var plate = P(128, 36);
      if (plate[0] > 0 && plate[0] < W - 200) {
        label(ctx, "05  Lambda diagram, not a spatial scale", plate[0], plate[1] - 18, { size: 13, color: INK.violet, weight: 650 });
      }
    }

    if (s.alive && f >= 286 && f < 760) {
      var env = P(s.z, geo.axisY);
      if (env[0] > 120 && env[0] < W - 280) {
        var title = "06  Signal envelope";
        var body = "vacuum group velocity, c";
        var col = INK.cyan;
        if (s.frozen) {
          title = "07  Collective spin wave";
          body = "delocalized coherence, not a photon";
          col = INK.violet;
        } else if (s.inside) {
          body = "slower group velocity inside";
          col = s.spin > s.photonic ? INK.violet : INK.cyan;
        }
        leader(ctx, env[0], env[1], env[0] + 28, env[1] - 86, title, body, col, W);
      }
    }

    if (f >= 860) {
      var out = P(geo.outputX, geo.axisY);
      if (out[0] > 80 && out[0] < W - 160) {
        leader(ctx, out[0], out[1], out[0] - 20, out[1] - 78, "08  Forward output mode", "retrieved envelope, weaker", INK.cyan, W);
      }
    }
  }

  function drawHud(ctx, st, W, H) {
    var f = st.frame;
    var sec = st.section;

    ctx.save();
    ctx.fillStyle = "rgba(8, 12, 18, 0.92)";
    ctx.fillRect(0, 0, W, 34);
    ctx.fillStyle = INK.gold;
    ctx.fillRect(0, 33, W, 1);
    label(ctx, "EXPLANATORY SCHEMATIC    Not a laboratory procedure, laser setup, or device specification.    Overlay colors are not emission.", 16, 9, { size: 13, color: INK.text, weight: 600 });
    ctx.restore();

    ctx.save();
    ctx.fillStyle = "rgba(11, 16, 25, 0.88)";
    roundRect(ctx, 164, 42, 860, 112, 8);
    ctx.fill();
    ctx.restore();
    label(ctx, "QUANTUM COMMUNICATION", 176, 50, { size: 11, color: INK.gold, weight: 700 });
    label(ctx, sec.clock + "     " + sec.title, 176, 68, { size: 22, color: INK.text, weight: 650 });
    wrap(ctx, sec.line, 176, 100, 820, { size: 15, color: INK.muted, lh: 20 });

    var stages = ["Optics", "Lambda", "Compress", "Spin wave", "Retrieve"];
    var i;
    for (i = 0; i < stages.length; i++) {
      var on = i <= sec.index;
      var y = 188 + i * 58;
      ctx.save();
      ctx.strokeStyle = on ? INK.cyan : "rgba(126,144,166,0.4)";
      ctx.fillStyle = i === sec.index ? "rgba(0,229,255,0.12)" : "rgba(0,0,0,0)";
      ctx.lineWidth = 1.25;
      roundRect(ctx, 18, y, 132, 46, 7);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
      label(ctx, "0" + (i + 1), 30, y + 6, { size: 11, color: on ? INK.cyan : INK.dim, mono: true });
      label(ctx, stages[i], 30, y + 22, { size: 14, color: on ? INK.text : INK.dim, weight: 600 });
      if (i < 4) {
        ctx.strokeStyle = i < sec.index ? INK.cyan : "rgba(126,144,166,0.35)";
        ctx.beginPath();
        ctx.moveTo(84, y + 46);
        ctx.lineTo(84, y + 58);
        ctx.stroke();
      }
    }

    var rx = W - 400;
    var rw = 376;
    if (f >= 170) {
      panel(ctx, rx, 150, rw, 92);
      drawMeter(ctx, rx, 150, rw, 92, st);
    }
    if (f >= 330 && f < 560) {
      panel(ctx, rx, 250, rw, 176);
      drawSpectrum(ctx, rx, 250, rw, 176);
    }
    if (f >= 510 && f < 800) {
      var ey = f < 560 ? 434 : 250;
      panel(ctx, rx, ey, rw, 128);
      drawEquation(ctx, rx + 12, ey + 10, rw - 24);
    }
    if (f >= 800) {
      panel(ctx, rx, 250, rw, 150);
      drawEquation(ctx, rx + 12, 260, rw - 24);
      panel(ctx, rx, 408, rw, 112);
      drawCompare(ctx, rx, 408, rw, 112);
      panel(ctx, rx, 528, rw, 118);
      label(ctx, "Accuracy boundaries", rx + 12, 536, { size: 13, color: INK.gold, weight: 650 });
      label(ctx, "Vacuum c does not change.", rx + 12, 556, { size: 12, color: INK.text });
      label(ctx, "No stationary photon. No copy.", rx + 12, 574, { size: 12, color: INK.text });
      label(ctx, "Retrieval is partial.", rx + 12, 592, { size: 12, color: INK.text });
      label(ctx, "Storage is temporary.", rx + 12, 610, { size: 12, color: INK.text });
    }

    panel(ctx, 176, 930, 980, 78);
    label(ctx, st.scaleCaption, 190, 940, { size: 13, color: INK.text });
    wrap(ctx, st.timeCaption, 190, 962, 950, { size: 13, color: INK.muted, lh: 18 });

    var legend = [
      [INK.cyan, "Cyan", "signal pathway"],
      [INK.gold, "Gold", "control / actuation"],
      [INK.violet, "Violet", "coherence / state"]
    ];
    for (i = 0; i < legend.length; i++) {
      var lx = 176 + i * 210;
      ctx.fillStyle = legend[i][0];
      roundRect(ctx, lx, 1020, 18, 10, 2);
      ctx.fill();
      label(ctx, legend[i][1] + "  " + legend[i][2], lx + 26, 1016, { size: 13, color: INK.muted });
    }

    var secClock = (st.seconds < 10 ? "0" : "") + st.seconds.toFixed(2) + " s";
    label(ctx, "FRAME " + String(f).padStart(4, "0") + " / 1019", W - 420, 1016, { size: 13, color: INK.text, mono: true });
    label(ctx, secClock + "   30 fps", W - 230, 1016, { size: 13, color: INK.gold, mono: true });
  }

  function drawPlate(ctx, frame, W, H) {
    GEO = EITGlobal.EIT.GEO;
    ensureAtoms();
    var st = EITGlobal.EIT.state(frame);
    var cam = st.camera;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = INK.stage;
    ctx.fillRect(0, 0, W, H);

    ctx.save();
    ctx.beginPath();
    ctx.rect(176, 168, W - 196, H - 276);
    ctx.clip();
    ctx.translate(W / 2, H / 2);
    ctx.scale(cam.zoom, cam.zoom);
    ctx.translate(-cam.x, -cam.y);

    drawHardware(ctx, frame, st.geo);
    drawFields(ctx, st);
    drawAtoms(ctx, st);
    drawLambdaWorld(ctx, frame);

    ctx.restore();

    var vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.35, W / 2, H / 2, H * 0.72);
    vig.addColorStop(0, "rgba(0,0,0,0)");
    vig.addColorStop(1, "rgba(0,0,0,0.28)");
    ctx.fillStyle = vig;
    ctx.fillRect(0, 0, W, H);

    drawCallouts(ctx, st, W, H);
    drawHud(ctx, st, W, H);

    ctx.save();
    ctx.strokeStyle = "rgba(126,144,166,0.35)";
    ctx.lineWidth = 1;
    ctx.strokeRect(8.5, 8.5, W - 17, H - 17);
    ctx.restore();
    label(ctx, "PLATE QM-EIT-01", 18, H - 22, { size: 11, color: INK.dim, mono: true });
  }

  EITGlobal.EITDraw = { drawPlate: drawPlate };
