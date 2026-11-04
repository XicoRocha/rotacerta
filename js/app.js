// RotaCerta — interface do protótipo (mapa + lista de paragens)

const el = (id) => document.getElementById(id);
const km = (v) => v.toFixed(1).replace(".", ",") + " km";

// Se não houver internet, o Leaflet não carrega: a lista e os km continuam a funcionar.
const temMapa = typeof L !== "undefined";
let mapa, camada;
if (temMapa) {
  mapa = L.map("mapa").setView([QUARTEL.lat, QUARTEL.lon], 12);
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "© OpenStreetMap",
  }).addTo(mapa);
  camada = L.layerGroup().addTo(mapa);
} else {
  el("mapa").innerHTML = '<p class="sem-mapa">Mapa indisponível (sem ligação à internet).</p>';
}

let modo = "listagem";

// preencher a lista de motoristas
LISTAGEM.forEach((s, i) => {
  const opt = document.createElement("option");
  opt.value = i;
  opt.textContent = `${s.motorista} · ${s.viatura}`;
  el("motorista").appendChild(opt);
});

function marcador(ponto, texto, classe) {
  return L.marker([ponto.lat, ponto.lon], {
    icon: L.divIcon({ className: "", html: `<div class="pino ${classe}">${texto}</div>`, iconSize: [26, 26] }),
  });
}

function desenhar() {
  const servico = LISTAGEM[el("motorista").value];
  const otimizada = ordemOtimizada(QUARTEL, servico.recolhas, servico.destino);
  const ordem = modo === "listagem" ? servico.recolhas : otimizada;

  // números
  const kmL = distanciaRota(QUARTEL, servico.recolhas, servico.destino);
  const kmO = distanciaRota(QUARTEL, otimizada, servico.destino);
  el("kmListagem").textContent = km(kmL);
  el("kmOtimizada").textContent = km(kmO);
  el("poupanca").textContent = `${km(kmL - kmO)} (${Math.round(((kmL - kmO) / kmL) * 100)}%)`;
  el("info").textContent = `Destino: ${servico.destino.nome} · consulta às ${servico.horaConsulta}`;

  // lista de paragens
  el("paragens").innerHTML = "";
  [QUARTEL, ...ordem, servico.destino].forEach((p, i, todos) => {
    const li = document.createElement("li");
    if (i === 0) li.textContent = "Saída do quartel";
    else if (i === todos.length - 1) li.textContent = `Chegada: ${p.nome}`;
    else li.textContent = `${p.utente} — ${p.freguesia}`;
    el("paragens").appendChild(li);
  });

  // mapa
  if (!temMapa) return;
  camada.clearLayers();
  const pontos = [QUARTEL, ...ordem, servico.destino];
  L.polyline(pontos.map((p) => [p.lat, p.lon]), {
    color: modo === "listagem" ? "#c0392b" : "#0f9d8f",
    weight: 4,
  }).addTo(camada);
  marcador(QUARTEL, "Q", "quartel").bindTooltip("Quartel").addTo(camada);
  ordem.forEach((p, i) => marcador(p, i + 1, "recolha").bindTooltip(`${p.utente} — ${p.freguesia}`).addTo(camada));
  marcador(servico.destino, "H", "destino").bindTooltip(servico.destino.nome).addTo(camada);
  mapa.fitBounds(L.latLngBounds(pontos.map((p) => [p.lat, p.lon])), { padding: [30, 30] });
}

function mudarModo(novo) {
  modo = novo;
  el("btnListagem").classList.toggle("ativo", novo === "listagem");
  el("btnOtimizada").classList.toggle("ativo", novo === "otimizada");
  desenhar();
}

el("motorista").addEventListener("change", desenhar);
el("btnListagem").addEventListener("click", () => mudarModo("listagem"));
el("btnOtimizada").addEventListener("click", () => mudarModo("otimizada"));

desenhar();
