// Testes do protótipo — correr com:  npm test
const test = require("node:test");
const assert = require("node:assert/strict");
const { haversine, distanciaRota, ordemVizinhoMaisProximo, ordemOtimizada } = require("../js/rotas.js");
const { QUARTEL, LISTAGEM } = require("../data/servicos.js");

test("haversine: distância de um ponto a si próprio é 0", () => {
  assert.equal(haversine(QUARTEL, QUARTEL), 0);
});

test("haversine: Porto–Lisboa em linha reta fica entre 270 e 280 km", () => {
  const porto = { lat: 41.1496, lon: -8.6109 };
  const lisboa = { lat: 38.7223, lon: -9.1393 };
  const d = haversine(porto, lisboa);
  assert.ok(d > 270 && d < 280, `obtido ${d.toFixed(1)} km`);
});

test("ordem otimizada visita todas as recolhas exatamente uma vez", () => {
  for (const s of LISTAGEM) {
    const ordem = ordemOtimizada(QUARTEL, s.recolhas, s.destino);
    assert.equal(ordem.length, s.recolhas.length);
    assert.deepEqual(
      ordem.map((r) => r.utente).sort(),
      s.recolhas.map((r) => r.utente).sort()
    );
  }
});

test("nos dados de exemplo, a ordem otimizada faz menos km do que a listagem", () => {
  for (const s of LISTAGEM) {
    const original = distanciaRota(QUARTEL, s.recolhas, s.destino);
    const otimizada = distanciaRota(QUARTEL, ordemOtimizada(QUARTEL, s.recolhas, s.destino), s.destino);
    assert.ok(otimizada < original, `${s.motorista}: ${otimizada.toFixed(1)} vs ${original.toFixed(1)}`);
  }
});

test("rota sem recolhas é só partida -> destino", () => {
  const destino = LISTAGEM[0].destino;
  assert.equal(distanciaRota(QUARTEL, [], destino), haversine(QUARTEL, destino));
});

test("força bruta nunca é pior do que o vizinho mais próximo", () => {
  for (const s of LISTAGEM) {
    const bruta = distanciaRota(QUARTEL, ordemOtimizada(QUARTEL, s.recolhas, s.destino), s.destino);
    const vizinho = distanciaRota(QUARTEL, ordemVizinhoMaisProximo(QUARTEL, s.recolhas), s.destino);
    assert.ok(bruta <= vizinho + 1e-9);
  }
});
