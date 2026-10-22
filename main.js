(function () {
  "use strict";
  var canvas = document.getElementById("plate");
  var ctx = canvas.getContext("2d");
  var W = 1920;
  var H = 1080;
  var params = new URLSearchParams(location.search);
  var shot = params.get("shot") === "1";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var queryFrame = params.has("frame") ? parseInt(params.get("frame"), 10) : null;
  var frame = queryFrame == null || isNaN(queryFrame) ? (reduce && !shot ? 1019 : 0) : Math.max(0, Math.min(1019, queryFrame));
  var playing = !shot && queryFrame == null && !reduce;
  var acc = 0;
  var last = 0;
  var slider = document.getElementById("scrub");
  var playBtn = document.getElementById("play");
  var readOut = document.getElementById("readout");
  var transcript = document.getElementById("transcript");
  var reduceNote = document.getElementById("reduce-note");
  var lastSection = "";

  if (shot) document.body.classList.add("shot");
  if (reduce && reduceNote) reduceNote.hidden = false;

  function paint() {
    var dpr = shot ? 1 : Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    EITDraw.drawPlate(ctx, frame, W, H);
    if (slider && document.activeElement !== slider) slider.value = String(frame);
    var st = EIT.state(frame);
    if (readOut) {
      readOut.textContent = st.section.clock + "  " + st.section.title + "  \u00b7  frame " + frame;
    }
    if (playBtn) playBtn.textContent = playing ? "Pause" : (frame >= 1019 ? "Replay" : "Play");
    if (transcript && st.section.id !== lastSection) {
      lastSection = st.section.id;
      transcript.textContent = st.section.clock + ". " + st.section.title + ". " + st.section.line + " " + st.scaleCaption + " " + st.timeCaption;
    }
  }

  function tick(now) {
    if (!last) last = now;
    var dt = Math.min(80, now - last);
    last = now;
    if (playing) {
      acc += dt;
      var step = 1000 / 30;
      while (acc >= step && frame < 1019) {
        frame += 1;
        acc -= step;
      }
      if (frame >= 1019) {
        frame = 1019;
        playing = false;
        acc = 0;
      }
    }
    paint();
    requestAnimationFrame(tick);
  }

  function setFrame(n) {
    frame = Math.max(0, Math.min(1019, n | 0));
    acc = 0;
    paint();
  }

  if (playBtn) {
    playBtn.addEventListener("click", function () {
      if (frame >= 1019) frame = 0;
      playing = !playing;
      last = 0;
      paint();
    });
  }
  if (slider) {
    slider.addEventListener("input", function () {
      playing = false;
      setFrame(parseInt(slider.value, 10));
    });
  }
  document.querySelectorAll("[data-jump]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      playing = false;
      setFrame(parseInt(btn.getAttribute("data-jump"), 10));
    });
  });
  document.addEventListener("keydown", function (ev) {
    if (ev.target && ev.target.tagName === "INPUT") return;
    if (ev.code === "Space") {
      ev.preventDefault();
      if (frame >= 1019) frame = 0;
      playing = !playing;
      last = 0;
    } else if (ev.code === "ArrowRight") {
      playing = false;
      setFrame(frame + (ev.shiftKey ? 1 : 15));
    } else if (ev.code === "ArrowLeft") {
      playing = false;
      setFrame(frame - (ev.shiftKey ? 1 : 15));
    } else if (ev.code === "Home") {
      playing = false;
      setFrame(0);
    } else if (ev.code === "End") {
      playing = false;
      setFrame(1019);
    }
  });

  paint();
  requestAnimationFrame(tick);
})();
