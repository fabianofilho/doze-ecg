# ECG Interativo: Doencas Tempo-Sensiveis

App interativo de aprendizado de eletrocardiograma com foco em condicoes que exigem reconhecimento rapido e conduta imediata. Disponivel em: **https://fabianofilho.github.io/ecg-learning/**

---

## Por que "tempo-sensivel"?

Em medicina de emergencia, certas alteracoes no ECG nao sao apenas diagnosticas, sao prognosticas pelo tempo. O intervalo entre o reconhecimento e a conduta determina mortalidade, area de necrose e funcao residual do orgao.

Este projeto organiza essas condicoes por categoria e, para cada uma, oferece:

- Traco ECG esquematico com anotacoes nas derivacoes relevantes
- Anatomia do coracao com a parede afetada destacada (para isquemias)
- Criterios diagnosticos com hierarquia de importancia
- Armadilhas clinicas e excecoes que podem induzir ao erro
- Conduta tempo-sensivel resumida

---

## Categorias

### Isquemias (11 entidades)

O IAM com supra de ST (IAMCSST) mata pela demora. Cada parede do ventriculo esquerdo e irrigada por uma arteria coronaria especifica, e as derivacoes do ECG funcionam como "janelas eletrica" para cada parede. Reconhecer qual parede e qual arteria define a estrategia de reperfusao.

| Entidade | Parede | Arteria | Derivacoes |
|---|---|---|---|
| IAM Anterior | Anterior | DA (LAD) | V3-V4 |
| IAM Septal | Septal | DA proximal | V1-V2 |
| IAM Lateral | Lateral | Cx (LCx) | V5-V6, DI, aVL |
| IAM Lateral Alta | Lateral alta | Diagonal/Cx | DI, aVL |
| IAM Inferior | Inferior | CD (RCA) | DII, DIII, aVF |
| IAM Posterior | Posterior | CD ou Cx | V7-V9 (espelho V1-V3) |
| IAM Ventriculo Direito | VD | CD proximal | V3R, V4R |
| IAM Anterior Extensa | Anterior extensa | DA muito proximal | V1-V6 + DI, aVL |
| Sindrome de Wellens | Anterior | DA critica | T bifasica/invertida V2-V3 |
| Padrao de De Winter | Anterior | DA ocluida | Infra J + T alta V1-V6 |
| Isquemia Circunferencial | Global | Tronco/multiarterial | Supra aVR + infra difuso |

**Wellens e De Winter sao equivalentes de IAMCSST** sem supra classico. Sao frequentemente perdidos no pronto-socorro e representam oclusao coronariana ativa com isquemia transmural em andamento.

A isquemia circunferencial por lesao de tronco da coronaria esquerda tem mortalidade hospitalar muito alta e o beneficio cirurgico (CRM) costuma superar a angioplastia isolada.

### Bloqueios (9 entidades)

Os bloqueios de ramo e fasciculares revelam o estado do sistema de conducao. O BRE novo em contexto de dor toracica e IAMCSST equivalente ate prova em contrario: os criterios de Sgarbossa permitem detectar isquemia sobreposta ao BRE.

Os bloqueios AV se estratificam por nivel anatomico: nodal (melhor prognostico, pode responder a atropina) ou infranodal (His-Purkinje, frequentemente requer marcapasso). O Mobitz II e o BAV Total sao indicacoes quase universais de marcapasso definitivo.

### Arritmias (8 entidades)

A fibrilacao atrial e a mais prevalente, mas a emergencia e dupla: taquicardia descompensante OU risco emblolico. FA com WPW e uma emergencia separada: a via acessoria pode conduzir impulsos atriais a 300 bpm ao ventriculo, degenerando em fibrilacao ventricular. Adenosina e diltiazem sao contraindicados nesse cenario.

TV e FV sem pulso exigem desfibrilacao imediata. Torsades de Pointes e uma TV polimorfica ligada ao QT longo que responde a magnesio IV e nao tolera antiarritmicos convencionais.

### Sindromes Especiais (6 entidades)

Condicoes com ECG caracteristico mas mecanismos distintos:

- **WPW**: via acessoria anatomica com risco de morte subita por conducao rapida em FA
- **Brugada**: canalopatia de sodio com padrão coved em V1-V2, risco de FV especialmente com febre
- **QT Longo**: adquirido (farmacos, eletrólitos) ou congenito, precipita Torsades
- **Hipercalemia**: progressao de T apiculada ate onda senoidal e FV; gluconato de calcio estabiliza a membrana enquanto o potassio e removido
- **Pericardite**: supra difuso concavo com depressao PR, principal DD do IAMCSST
- **Tamponamento**: baixa voltagem + alternancia eletrica, drenagem de urgencia se instavel

---

## Como usar

O app funciona diretamente no navegador, sem instalacao. Use as abas horizontais para navegar entre categorias e os chips para selecionar a anomalia.

Para condicoes com anatomatia do coracao, o SVG mostra qual parede e afetada e quais arterias correspondem a cada territorio.

Os criterios com ponto colorido (mais saturado) sao os de maior especificidade ou importancia clinica. Os criterios em amarelo sao armadilhas: situacoes onde o diagnostico pode ser falso-positivo ou falso-negativo.

---

## Aviso

Este projeto e educacional. Os tracos de ECG sao esquematicos, nao gravacoes reais. As condutas resumidas sao referencias para estudo, nao substituem protocolos institucionais ou julgamento clinico individualizado.

---

Para detalhes tecnicos da implementacao, ver [ARQUITETURA.md](ARQUITETURA.md).
