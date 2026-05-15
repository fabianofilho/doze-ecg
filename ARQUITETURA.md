# Arquitetura

## Stack

- React 18 + TypeScript + Vite
- Tailwind CSS v4 (configuracao via `@import "tailwindcss"`)
- SVG puro para tracos ECG e anatomia cardiaca (sem bibliotecas de charting)
- `gh-pages` para deploy no GitHub Pages

## Estrutura

```
src/
  types/ecg.ts          # tipos centrais: Anomaly, Lead, HeartWall, EcgChange
  data/
    ischemias.ts        # 11 entidades com dados de parede, arteria, criterios
    bloqueios.ts        # 9 entidades
    arritmias.ts        # 8 entidades
    sindromes.ts        # 6 entidades
    index.ts            # re-exporta tudo + lista de categorias
  components/
    TabNav.tsx          # abas de categoria com contador
    AnomalySelector.tsx # chips de selecao dentro de cada categoria
    AnomalyDetail.tsx   # layout principal: header + ECG + coracao + criterios
    ECGStrip.tsx        # SVG esquematico do traco ECG
    HeartAnatomy.tsx    # SVG do coracao com parede destacada
    CriteriaCard.tsx    # criterios, excecoes e conduta tempo-sensivel
  App.tsx               # estado global: categoria ativa + anomalia selecionada
```

## ECGStrip

Cada tipo de `EcgChange` tem uma funcao geradora de path SVG. A grade de fundo usa dois `<pattern>` aninhados (pequeno 10x10 e grande 50x50) simulando o papel milimetrado do ECG.

As derivacoes primarias aparecem destacadas na cor da categoria; as derivacoes reciprocas aparecem em amarelo.

## HeartAnatomy

O SVG do coracao e desenhado com paths nomeados por regiao anatomica (anterior, septal, lateral, inferior, posterior, VD). A prop `wall` determina quais paths recebem a cor ativa. As arterias coronarias (DA, CD, Cx) sao paths separados que tambem mudam de cor conforme a parede afetada.

## Deploy

```bash
npm run deploy   # build + gh-pages -d dist
```

O `vite.config.ts` tem `base: '/ecg-learning/'` para que os assets sejam resolvidos corretamente no subpath do GitHub Pages.

Para adicionar uma nova anomalia: incluir um objeto `Anomaly` no arquivo de dados correspondente. O componente `AnomalySelector` e o `AnomalyDetail` sao data-driven e exibem automaticamente qualquer entrada nova.
