# RotaCerta

**Rotas otimizadas para o transporte não urgente de doentes.**

Projeto da UC **Laboratório de Programação [22356]** — Licenciatura em Engenharia Informática, ISLA Gaia, 2026/2027.

## Objetivo

As corporações de bombeiros recebem do SGTD uma listagem diária de serviços por motorista, mas a ordem das recolhas e o percurso continuam a ser decididos à mão. O RotaCerta vai importar essa listagem, validar as moradas num mapa e propor a cada motorista uma rota otimizada que respeite as horas de consulta.

## Equipa

| Nome | Papel |
|---|---|
| Francisco Rocha (a22401621) | Scrum Master (Sprint 0) · Developer |
| João Mouta (a22409272) | Developer |
| Ernelson Barros (a22511572) | Developer |

Product Owner: docente da UC. O papel de Scrum Master roda a cada sprint.

## Estado atual: protótipo do Sprint 1

O protótipo é uma página web estática que mostra a ideia principal do produto:

- escolher um motorista de uma listagem de exemplo;
- ver as recolhas no mapa **pela ordem da listagem** e **pela ordem otimizada**;
- comparar os quilómetros das duas ordens.

A otimização experimenta **todas as ordens possíveis** (força bruta, até 8 recolhas; acima disso usa o vizinho mais próximo) e as distâncias são **em linha reta** (haversine). É um protótipo descartável, que serve para validar a ideia. A arquitetura final (Python + OSRM + OR-Tools) começa a ser construída no Sprint 2.

> ⚠️ Todos os dados são **fictícios**. Nunca colocar dados reais de utentes neste repositório (RGPD — dados de saúde).

## Como correr

**Ver o protótipo:** abrir o `index.html` no browser (duplo clique). É preciso ter internet para carregar o mapa.

**Correr os testes** (requer [Node.js](https://nodejs.org) 18 ou superior):

```bash
npm test
```

## Estrutura de pastas

```
rotacerta/
├── index.html            # página do protótipo
├── css/estilo.css        # estilos
├── js/
│   ├── rotas.js          # lógica: distâncias e ordem otimizada (funções puras)
│   └── app.js            # interface: mapa (Leaflet) e lista de paragens
├── data/servicos.js      # listagem de exemplo (dados fictícios)
├── tests/rotas.test.js   # testes automáticos (node:test)
├── docs/                 # documentos dos sprints (artigo, análise, planeamento)
└── .github/workflows/    # integração contínua (corre os testes a cada push)
```

## Forma de trabalhar

- **Quadro de tarefas:** GitHub Projects (A Fazer → Em Curso → Em Revisão → Concluído).
- **Branches:** GitHub Flow. A `main` está sempre estável; cada tarefa tem uma branch curta e entra por pull request.
- **Commits:** Conventional Commits, por exemplo `feat: adiciona mapa por motorista`, `fix: corrige cálculo de distância`, `docs: atualiza README`, `test: cobre rota sem recolhas`.
- **CI:** o GitHub Actions corre `npm test` a cada push e pull request.

## Roadmap

| Sprint | Foco |
|---|---|
| 0 · Descoberta e Proposta | Avaliação crítica (ViaMichelin), estado da arte, proposta ✔ |
| 1 · Plano | User Stories, modelos, arquitetura, protótipo inicial ← **estamos aqui** |
| 2 · Desenvolvimento | Importar listagem, geocodificar moradas, otimizar com OR-Tools, mapa por motorista |
| 3 · Implantação | Testes com dados anonimizados da central, poster e artigo final |
