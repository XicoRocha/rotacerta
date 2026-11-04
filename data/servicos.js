/*
 * DADOS FICTÍCIOS — apenas para demonstração do protótipo.
 *
 * Simulam uma listagem diária de transporte não urgente de doentes.
 * Não há nomes nem moradas reais: cada utente está colocado no centro
 * aproximado da sua freguesia. Nunca colocar dados reais de utentes
 * neste repositório (RGPD — dados de saúde).
 */

const QUARTEL = { nome: "Quartel (partida)", lat: 41.0961, lon: -8.6376 };

const LISTAGEM = [
  {
    motorista: "Motorista A",
    viatura: "VDTD 01",
    destino: { nome: "Hospital de São João", lat: 41.1833, lon: -8.6023 },
    horaConsulta: "09:30",
    // ordem tal como vem na listagem (não otimizada)
    recolhas: [
      { utente: "Utente 01", freguesia: "Canelas", lat: 41.0797, lon: -8.6015 },
      { utente: "Utente 02", freguesia: "Madalena", lat: 41.1110, lon: -8.6495 },
      { utente: "Utente 03", freguesia: "Perosinho", lat: 41.0640, lon: -8.5920 },
      { utente: "Utente 04", freguesia: "Vilar do Paraíso", lat: 41.1130, lon: -8.6270 },
      { utente: "Utente 05", freguesia: "Arcozelo", lat: 41.0630, lon: -8.6330 },
    ],
  },
  {
    motorista: "Motorista B",
    viatura: "VDTD 02",
    destino: { nome: "Hospital Santos Silva (CHVNG)", lat: 41.1070, lon: -8.5920 },
    horaConsulta: "10:00",
    recolhas: [
      { utente: "Utente 06", freguesia: "Serzedo", lat: 41.0530, lon: -8.6100 },
      { utente: "Utente 07", freguesia: "Canidelo", lat: 41.1260, lon: -8.6440 },
      { utente: "Utente 08", freguesia: "Gulpilhares", lat: 41.0820, lon: -8.6430 },
      { utente: "Utente 09", freguesia: "Vilar de Andorinho", lat: 41.1020, lon: -8.5790 },
      { utente: "Utente 10", freguesia: "Oliveira do Douro", lat: 41.1170, lon: -8.5850 },
    ],
  },
];

if (typeof module !== "undefined") {
  module.exports = { QUARTEL, LISTAGEM };
}
