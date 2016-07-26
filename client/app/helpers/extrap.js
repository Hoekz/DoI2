function P(i, j, x, v) {
  if (j === 0) return v[i][1];
  return ((x - v[i][0]) * P(i + 1, j - 1, x, v) + (v[i + j][0] - x) * P(i, j - 1, x, v)) / (v[i + j][0] - v[i][0]);
}

export default function extrap (time, vector) {
  return P(0, vector.length - 1, time, vector);
};
