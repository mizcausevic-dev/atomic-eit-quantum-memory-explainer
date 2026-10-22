/* Atomic EIT quantum memory, frame-accurate schematic model.
   30 fps, frames 0..1019 (34.0 s). Drawing ratios are illustrative.
   They are not measured device parameters. */
(function (global) {
  "use strict";

  var FRAME_COUNT = 1020;
  var FPS = 30;

  var GEO = {
    axisY: 448,
    cellIn: -246,
    cellOut: 246,
    cellRadius: 78,
    sourceX: -790,
    pulseLaunchX: -742,
    outputX: 468,
    moveStart: 286,
    vacuumSpeed: 6.15,
    gOverOmega: 1.62,
    sigma0: 78
  };

  function clamp(v, a, b) {
    return Math.max(a, Math.min(b, v));
  }

  function lerp(a, b, t) {
    return a + (b - a) * t;
  }

  function smootherstep(t) {
    t = clamp(t, 0, 1);
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  function sectionOf(frame) {
    if (frame < 150) {
      return {
        id: "reveal",
        index: 0,
        start: 0,
        end: 149,
        clock: "0-5 s",
        title: "Reveal ensemble and optics",
        line: "A pulsed signal mode and a classical control field are aimed through a long-lived atomic ensemble."
      };
    }
    if (frame < 300) {
      return {
        id: "lambda",
        index: 1,
        start: 150,
        end: 299,
        clock: "5-10 s",
        title: "Lambda energy levels",
        line: "Each atom is addressed as a lambda system. On two-photon resonance the pathways to the excited state cancel."
      };
    }
    if (frame < 510) {
      return {
        id: "compress",
        index: 2,
        start: 300,
        end: 509,
        clock: "10-17 s",
        title: "Compress signal envelope",
        line: "Inside the ensemble the envelope's group velocity drops, so the same pulse occupies less space. Vacuum speed c does not change."
      };
    }
    if (frame < 750) {
      return {
        id: "map",
        index: 3,
        start: 510,
        end: 749,
        clock: "17-25 s",
        title: "Map to collective spin coherence",
        line: "Lowering the control maps the moving polariton onto a collective spin wave. The excitation is transferred, not copied, and no photon is left sitting in the mode."
      };
    }
    return {
      id: "retrieve",
      index: 4,
      start: 750,
      end: 1019,
      clock: "25-34 s",
      title: "Retrieve with control field",
      line: "Restoring the control maps the spin wave back into the forward optical mode. Retrieval is partial, and the stored coherence is temporary."
    };
  }

  function controlAmplitude(frame) {
    if (frame < 96) return 0;
    if (frame < 156) return smootherstep((frame - 96) / 60);
    if (frame < 510) return 1;
    if (frame < 640) return 1 - smootherstep((frame - 510) / 130);
    if (frame < 728) return 0;
    if (frame < 846) return smootherstep((frame - 728) / 118);
    return 1;
  }

  function mixingFromControl(oc) {
    var g = GEO.gOverOmega;
    var o = Math.max(0, oc);
    var d = Math.sqrt(o * o + g * g);
    var cosTheta = o / d;
    var sinTheta = g / d;
    return {
      cosTheta: cosTheta,
      sinTheta: sinTheta,
      photonic: cosTheta * cosTheta,
      spin: sinTheta * sinTheta
    };
  }

  function buildSamples() {
    var z = GEO.pulseLaunchX;
    var frozen = false;
    var holdZ = z;
    var freezeFrame = -1;
    var unfreezeFrame = -1;
    var samples = [];
    var compressed = GEO.sigma0 * mixingFromControl(1).photonic;

    for (var f = 0; f < FRAME_COUNT; f++) {
      var oc = controlAmplitude(f);
      var m = mixingFromControl(oc);
      var insideNow = z >= GEO.cellIn && z <= GEO.cellOut;

      if (!frozen && insideNow && f >= 510 && m.photonic < 0.05) {
        frozen = true;
        holdZ = z;
        freezeFrame = f;
      }
      if (frozen && f >= 736 && m.photonic > 0.07) {
        frozen = false;
        unfreezeFrame = f;
        z = holdZ;
      }

      var pos = frozen ? holdZ : z;
      var inside = pos >= GEO.cellIn && pos <= GEO.cellOut;
      var display = inside
        ? m
        : { photonic: 1, spin: 0, cosTheta: 1, sinTheta: 0 };
      var sigma;
      if (pos <= GEO.cellIn) {
        var approach = clamp((pos - (GEO.cellIn - 70)) / 70, 0, 1);
        sigma = lerp(GEO.sigma0, compressed, smootherstep(approach));
      } else if (pos >= GEO.cellOut) {
        var leave = clamp((pos - GEO.cellOut) / 150, 0, 1);
        sigma = lerp(compressed, GEO.sigma0, smootherstep(leave));
      } else {
        var enter = clamp((pos - GEO.cellIn) / 90, 0, 1);
        sigma = lerp(GEO.sigma0, compressed, smootherstep(enter));
      }

      var alive = f >= GEO.moveStart;
      var amp = 0;
      if (alive) {
        var entry = clamp((pos - (GEO.cellIn - 20)) / 70, 0, 1);
        amp = lerp(1, 0.86, smootherstep(entry));
        if (freezeFrame >= 0 && f >= freezeFrame && (unfreezeFrame < 0 || f <= unfreezeFrame)) {
          var span = (unfreezeFrame < 0 ? 760 : unfreezeFrame) - freezeFrame;
          var hold = clamp((f - freezeFrame) / Math.max(1, span), 0, 1);
          amp = lerp(0.86, 0.78, hold);
        } else if (unfreezeFrame >= 0 && f > unfreezeFrame) {
          var exit = clamp((pos - (GEO.cellOut - 30)) / 120, 0, 1);
          amp = lerp(0.78, 0.62, smootherstep(exit));
        }
      }

      samples.push({
        frame: f,
        z: pos,
        sigma: sigma,
        frozen: frozen,
        alive: alive,
        oc: oc,
        vg: inside ? m.photonic : 1,
        photonic: display.photonic,
        spin: display.spin,
        cosTheta: display.cosTheta,
        sinTheta: display.sinTheta,
        inside: inside,
        amp: amp,
        compressedSigma: compressed,
        modelPhotonic: m.photonic,
        modelSpin: m.spin
      });

      if (!frozen && f >= GEO.moveStart) {
        var stepInside = z >= GEO.cellIn && z <= GEO.cellOut;
        var vgStep = stepInside ? m.photonic : 1;
        z += GEO.vacuumSpeed * vgStep;
        if (z > GEO.outputX) z = GEO.outputX;
      }
    }

    samples.freezeFrame = freezeFrame;
    samples.unfreezeFrame = unfreezeFrame;
    samples.compressedSigma = compressed;
    return samples;
  }

  var SAMPLES = buildSamples();

  function cameraKeys() {
    var z509 = SAMPLES[509].z;
    var z749 = SAMPLES[749].z;
    return [
      { f: 0, x: -250, y: 400, zoom: 0.86 },
      { f: 149, x: -10, y: 430, zoom: 1.58 },
      { f: 236, x: 248, y: 196, zoom: 1.84 },
      { f: 299, x: -20, y: 340, zoom: 1.16 },
      { f: 430, x: clamp(SAMPLES[430].z, -80, 40), y: 448, zoom: 1.64 },
      { f: 509, x: clamp(z509, -40, 50), y: 448, zoom: 1.76 },
      { f: 700, x: clamp(z749, -30, 40), y: 448, zoom: 2.42 },
      { f: 749, x: clamp(z749, -30, 40), y: 448, zoom: 2.42 },
      { f: 960, x: -20, y: 268, zoom: 0.9 },
      { f: 1019, x: -20, y: 268, zoom: 0.9 }
    ];
  }

  var CAM_KEYS = cameraKeys();

  function cameraFor(frame) {
    var keys = CAM_KEYS;
    var f = clamp(frame, 0, 1019);
    var i = 0;
    while (i < keys.length - 2 && f > keys[i + 1].f) i++;
    var a = keys[i];
    var b = keys[i + 1];
    var t = smootherstep((f - a.f) / Math.max(1, b.f - a.f));
    return {
      x: lerp(a.x, b.x, t),
      y: lerp(a.y, b.y, t),
      zoom: lerp(a.zoom, b.zoom, t)
    };
  }

  function scaleCaption(frame) {
    if (frame < 150) {
      return "Scale: apparatus schematic. Lengths are not a measured bench.";
    }
    if (frame < 300) {
      return "Scale change: energy diagram. Not a spatial zoom of the cell.";
    }
    if (frame < 510) {
      return "Scale: same apparatus. The envelope is enlarged against the cell so its shape can be read. The inside-to-outside width ratio follows the illustrative group velocity.";
    }
    if (frame < 750) {
      return "Scale change: ensemble section. Atom count and spacing are diagrammatic, not literal.";
    }
    return "Scale change: return to the full apparatus. Closing view is held still.";
  }

  function timeCaption(frame) {
    if (frame >= 960) {
      return "Hold. Motion is stopped on the complete system for the closing view.";
    }
    if (frame >= 150 && frame < 750) {
      return "Slow motion relative to laboratory pulse timing. No numeric laboratory time is claimed. Optical carrier cycles are omitted.";
    }
    return "Time compression: optical carrier cycles are omitted. Only envelopes and the control amplitude are drawn.";
  }

  function state(frame) {
    var f = clamp(frame | 0, 0, FRAME_COUNT - 1);
    var sample = SAMPLES[f];
    var section = sectionOf(f);
    return {
      frame: f,
      fps: FPS,
      frameCount: FRAME_COUNT,
      seconds: f / FPS,
      section: section,
      sample: sample,
      camera: cameraFor(f),
      scaleCaption: scaleCaption(f),
      timeCaption: timeCaption(f),
      freezeFrame: SAMPLES.freezeFrame,
      unfreezeFrame: SAMPLES.unfreezeFrame,
      geo: GEO
    };
  }

  function invariants() {
    var errors = [];
    function fail(msg) { errors.push(msg); }

    if (SAMPLES.length !== 1020) fail("expected 1020 samples, got " + SAMPLES.length);
    var bounds = [
      [0, "reveal"], [149, "reveal"], [150, "lambda"], [299, "lambda"],
      [300, "compress"], [509, "compress"], [510, "map"], [749, "map"],
      [750, "retrieve"], [1019, "retrieve"]
    ];
    for (var b = 0; b < bounds.length; b++) {
      if (sectionOf(bounds[b][0]).id !== bounds[b][1]) {
        fail("section boundary " + bounds[b][0] + " expected " + bounds[b][1]);
      }
    }
    var prev = -1e9;
    for (var f = 0; f < 1020; f++) {
      var s = SAMPLES[f];
      if (!isFinite(s.z) || !isFinite(s.sigma) || !isFinite(s.amp)) fail("non-finite state at " + f);
      if (s.z + 1e-6 < prev) fail("pulse moved backward at " + f);
      prev = s.z;
      var sum = s.modelPhotonic + s.modelSpin;
      if (Math.abs(sum - 1) > 1e-6) fail("mixing identity broken at " + f);
      if (s.inside && Math.abs(s.vg - s.modelPhotonic) > 1e-6) {
        fail("inside group-velocity factor is not the photonic fraction at " + f);
      }
      if (!s.inside && s.alive && Math.abs(s.vg - 1) > 1e-6) {
        fail("outside group-velocity factor is not 1 at " + f);
      }
    }

    if (SAMPLES[400].oc < 0.95) fail("control should be on during compression");
    if (SAMPLES[700].oc > 0.02) fail("control should be off during storage");
    if (SAMPLES[980].oc < 0.95) fail("control should be restored before the hold");
    if (!SAMPLES[430].inside) fail("pulse should be inside the cell by frame 430, z=" + SAMPLES[430].z);
    if (!SAMPLES[700].frozen) fail("pulse should be stored (not propagating) at frame 700");
    if (SAMPLES[700].inside !== true) fail("stored excitation should remain inside the ensemble");
    if (SAMPLES[700].photonic > 0.08) fail("stored photonic fraction should be near zero");
    if (SAMPLES[700].spin < 0.9) fail("stored spin fraction should dominate");
    if (SAMPLES[430].sigma > SAMPLES[300].sigma) fail("envelope should be spatially narrower once inside");
    if (!(SAMPLES[430].vg < 0.5)) fail("group velocity inside should be well below the vacuum envelope speed");
    var inputAmp = SAMPLES[300].amp;
    var outputAmp = SAMPLES[1019].amp;
    if (!(outputAmp < inputAmp - 0.15)) fail("retrieved amplitude should be clearly below the input amplitude");
    if (SAMPLES[1019].z < GEO.cellOut + 40) fail("retrieved envelope should have left the cell by the final frame");
    if (Math.abs(SAMPLES[1019].z - SAMPLES[960].z) > 1e-6) fail("envelope must be stationary during the closing hold");
    if (SAMPLES.freezeFrame < 510 || SAMPLES.freezeFrame > 700) {
      fail("freeze frame out of mapping window: " + SAMPLES.freezeFrame);
    }

    var movedDuringStore = Math.abs(SAMPLES[740].z - SAMPLES[SAMPLES.freezeFrame].z);
    if (movedDuringStore > 1e-6) fail("stored spin wave drifted");

    return {
      ok: errors.length === 0,
      errors: errors,
      freezeFrame: SAMPLES.freezeFrame,
      unfreezeFrame: SAMPLES.unfreezeFrame,
      probes: [149, 299, 300, 430, 509, 600, 700, 749, 860, 960, 1019].map(function (n) {
        var s = SAMPLES[n];
        return {
          f: n,
          z: Math.round(s.z * 10) / 10,
          sigma: Math.round(s.sigma * 10) / 10,
          oc: Math.round(s.oc * 1000) / 1000,
          phot: Math.round(s.photonic * 1000) / 1000,
          spin: Math.round(s.spin * 1000) / 1000,
          vg: Math.round(s.vg * 1000) / 1000,
          amp: Math.round(s.amp * 1000) / 1000,
          frozen: s.frozen,
          inside: s.inside
        };
      })
    };
  }

  var api = {
    FRAME_COUNT: FRAME_COUNT,
    FPS: FPS,
    GEO: GEO,
    clamp: clamp,
    lerp: lerp,
    smootherstep: smootherstep,
    sectionOf: sectionOf,
    controlAmplitude: controlAmplitude,
    mixingFromControl: mixingFromControl,
    state: state,
    invariants: invariants
  };

  global.EIT = api;

  if (typeof module !== "undefined" && module.exports) {
    module.exports = api;
  }
})(typeof globalThis !== "undefined" ? globalThis : this);
