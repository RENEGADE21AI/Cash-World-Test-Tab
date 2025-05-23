// simplex-noise.js
// Source: https://github.com/jwagner/simplex-noise.js (simplified ES module)

export class SimplexNoise {
  constructor(seed = Math.random()) {
    this.perm = new Uint8Array(512);
    this.grad3 = [
      [1,1], [-1,1], [1,-1], [-1,-1],
      [1,0], [-1,0], [0,1], [0,-1]
    ];

    const perm = new Uint8Array(256);
    for (let i = 0; i < 256; i++) perm[i] = i;

    for (let i = 255; i > 0; i--) {
      const j = Math.floor(seed * (i + 1)) % 256;
      [perm[i], perm[j]] = [perm[j], perm[i]];
    }

    for (let i = 0; i < 512; i++) {
      this.perm[i] = perm[i % 256];
    }
  }

  dot(g, x, y) {
    return g[0]*x + g[1]*y;
  }

  noise2D(xin, yin) {
    const F2 = 0.5 * (Math.sqrt(3) - 1);
    const G2 = (3 - Math.sqrt(3)) / 6;
    let n0, n1, n2;

    const s = (xin + yin) * F2;
    const i = Math.floor(xin + s);
    const j = Math.floor(yin + s);
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = xin - X0;
    const y0 = yin - Y0;

    let i1, j1;
    if (x0 > y0) { i1 = 1; j1 = 0; } else { i1 = 0; j1 = 1; }

    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;

    const ii = i & 255;
    const jj = j & 255;
    const gi0 = this.perm[ii + this.perm[jj]] % 8;
    const gi1 = this.perm[ii + i1 + this.perm[jj + j1]] % 8;
    const gi2 = this.perm[ii + 1 + this.perm[jj + 1]] % 8;

    const t0 = 0.5 - x0*x0 - y0*y0;
    n0 = t0 < 0 ? 0 : (t0*t0) * this.dot(this.grad3[gi0], x0, y0);
    const t1 = 0.5 - x1*x1 - y1*y1;
    n1 = t1 < 0 ? 0 : (t1*t1) * this.dot(this.grad3[gi1], x1, y1);
    const t2 = 0.5 - x2*x2 - y2*y2;
    n2 = t2 < 0 ? 0 : (t2*t2) * this.dot(this.grad3[gi2], x2, y2);

    return 70 * (n0 + n1 + n2);
  }
}
