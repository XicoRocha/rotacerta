/*
 * RotaCerta — lógica das rotas (protótipo do Sprint 1)
 *
 * Funções puras, sem dependências, para poderem ser usadas no browser
 * (index.html) e testadas com Node (tests/rotas.test.js).
 *
 * Nota: as distâncias são calculadas em linha reta (fórmula de haversine).
 * No Sprint 2 serão substituídas por distâncias reais por estrada (OSRM) e a
 * otimização passará para o OR-Tools, que também respeita as horas de
 * consulta e a capacidade da viatura.
 */

const RAIO_TERRA_KM = 6371;

/** Distância em linha reta entre dois pontos {lat, lon}, em km. */
function haversine(a, b) {
  const rad = (g) => (g * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * RAIO_TERRA_KM * Math.asin(Math.sqrt(h));
}

/** Distância total de uma rota: partida -> paragens (pela ordem dada) -> destino. */
function distanciaRota(partida, paragens, destino) {
  const pontos = [partida, ...paragens, destino];
  let total = 0;
  for (let i = 0; i < pontos.length - 1; i++) {
    total += haversine(pontos[i], pontos[i + 1]);
  }
  return total;
}

/**
 * Heurística do vizinho mais próximo: a partir da partida, vai sempre à
 * recolha mais próxima que ainda não foi feita. Simples e rápida, mas nem
 * sempre ótima (ignora onde fica o destino). Serve de recurso quando há
 * recolhas a mais para a força bruta.
 */
function ordemVizinhoMaisProximo(partida, paragens) {
  const porVisitar = [...paragens];
  const ordem = [];
  let atual = partida;
  while (porVisitar.length > 0) {
    let melhor = 0;
    for (let i = 1; i < porVisitar.length; i++) {
      if (haversine(atual, porVisitar[i]) < haversine(atual, porVisitar[melhor])) {
        melhor = i;
      }
    }
    atual = porVisitar.splice(melhor, 1)[0];
    ordem.push(atual);
  }
  return ordem;
}

/**
 * Força bruta: experimenta TODAS as ordens possíveis e fica com a mais curta
 * (já contando com a chegada ao destino). Dá a melhor ordem, mas o número de
 * ordens cresce fatorialmente (8 recolhas = 40 320 ordens), por isso só se usa
 * até MAX_FORCA_BRUTA recolhas; acima disso usa-se o vizinho mais próximo.
 */
const MAX_FORCA_BRUTA = 8;

function ordemOtimizada(partida, paragens, destino) {
  if (paragens.length > MAX_FORCA_BRUTA) return ordemVizinhoMaisProximo(partida, paragens);

  let melhorOrdem = [...paragens];
  let melhorKm = distanciaRota(partida, melhorOrdem, destino);

  function permutar(atual, resto) {
    if (resto.length === 0) {
      const d = distanciaRota(partida, atual, destino);
      if (d < melhorKm) {
        melhorKm = d;
        melhorOrdem = [...atual];
      }
      return;
    }
    for (let i = 0; i < resto.length; i++) {
      permutar([...atual, resto[i]], [...resto.slice(0, i), ...resto.slice(i + 1)]);
    }
  }

  permutar([], paragens);
  return melhorOrdem;
}

if (typeof module !== "undefined") {
  module.exports = { haversine, distanciaRota, ordemVizinhoMaisProximo, ordemOtimizada, MAX_FORCA_BRUTA };
}
