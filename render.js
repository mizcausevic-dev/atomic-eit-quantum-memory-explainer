/* Sectional plate renderer. Hardware stays in structural metal and glass.
   Cyan, gold, and violet are explanatory overlays, not emission. */
(function (global) {
  "use strict";

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

  global.EITDraw = { drawPlate: function () { throw new Error("renderer upload incomplete"); } };
})(typeof globalThis !== "undefined" ? globalThis : this);
