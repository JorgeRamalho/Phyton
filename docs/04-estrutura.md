# Estrutura de pastas

A raiz permanece enxuta. Cada arquivo de produto mora na pasta da sua responsabilidade.

## Raiz — apenas entrada e configuração

```
Projeto-Phyton/
├── index.html
├── package.json
├── robots.txt
├── sitemap.xml
├── site.webmanifest
└── README.md
```

Nenhum HTML interno, CSS, script de página ou SVG de marca fica solto na raiz.

## Árvore completa

```
Projeto-Phyton/
│
├── index.html                 entrada do site
├── package.json               npm start
├── robots.txt                 indexação
├── sitemap.xml                URLs públicas
├── site.webmanifest           PWA / ícone
├── README.md                  porta da documentação
│
├── pages/                     HTML interno (um arquivo por tela)
│   ├── cadastro.html
│   ├── aluno.html
│   ├── evolucao.html
│   ├── exercicios.html
│   ├── sala.html
│   └── docs.html              docs da linguagem para o aluno
│
├── css/                       estilo, um arquivo por camada
│   ├── foundation/
│   │   ├── tokens.css
│   │   └── base.css
│   ├── layout/
│   │   └── layout.css
│   ├── components/
│   │   └── components.css
│   └── pages/
│       └── pages.css
│
├── js/                        script, um arquivo por papel
│   ├── core/
│   │   ├── paths.js
│   │   ├── data.js
│   │   ├── store.js
│   │   └── shell.js
│   ├── content/
│   │   └── docs.js
│   └── pages/
│       ├── cadastro.js
│       ├── aluno.js
│       ├── evolucao.js
│       ├── exercicios.js
│       ├── sala.js
│       └── docs-page.js
│
├── assets/
│   └── brand/
│       ├── python-logo.svg
│       └── favicon.svg
│
└── docs/                      dossiê do repositório
    ├── README.md
    ├── 01-pesquisa.md
    ├── 02-planejamento.md
    ├── 03-arquitetura.md
    ├── 04-estrutura.md
    └── 05-convencoes.md
```

## Arquivo → pasta

| Arquivo | Pasta | Por quê |
| --- | --- | --- |
| `index.html` | raiz | Única entrada pública |
| `cadastro.html`, `aluno.html`, `evolucao.html`, `exercicios.html`, `sala.html`, `docs.html` | `pages/` | Telas internas; não poluem a raiz |
| `tokens.css`, `base.css` | `css/foundation/` | Fundação visual (variáveis e reset) |
| `layout.css` | `css/layout/` | Grade, header, footer, wrap |
| `components.css` | `css/components/` | Botões, cards, formulário, barra |
| `pages.css` | `css/pages/` | Home, laboratório, sala, curva |
| `paths.js`, `data.js`, `store.js`, `shell.js` | `js/core/` | Compartilhados por todas as telas |
| `docs.js` | `js/content/` | Conteúdo da linguagem, não comportamento |
| `cadastro.js` … `docs-page.js` | `js/pages/` | Um script por HTML em `pages/` |
| `python-logo.svg`, `favicon.svg` | `assets/brand/` | Identidade, não conteúdo de aula |
| `01-pesquisa.md` … `05-convencoes.md` | `docs/` | Dossiê de projeto |

## Correspondência página ↔ script

| Página | Script |
| --- | --- |
| `index.html` | só o núcleo (`paths`, `data`, `store`, `shell`) |
| `pages/cadastro.html` | `js/pages/cadastro.js` |
| `pages/aluno.html` | `js/pages/aluno.js` |
| `pages/evolucao.html` | `js/pages/evolucao.js` |
| `pages/exercicios.html` | `js/pages/exercicios.js` |
| `pages/sala.html` | `js/pages/sala.js` |
| `pages/docs.html` | `js/content/docs.js` + `js/pages/docs-page.js` |

## Homônimos a não misturar

| Caminho | Público |
| --- | --- |
| `docs/` | Quem desenvolve o portal |
| `pages/docs.html` | Aluno lendo a linguagem Python |
| `css/pages/` | Folha de estilos das telas |
| `js/pages/` | Comportamento das telas |
| `pages/` | Os HTML das telas |
