# Arquitetura

## Visão

PhytonFree é um site estático em HTML, CSS e JavaScript. Não há bundler nem framework. O servidor de desenvolvimento (`npm start`) apenas serve arquivos. A lógica de aluno e progresso corre no cliente.

```
Navegador
  ├── Páginas HTML (entrada + pages/)
  ├── CSS em camadas (foundation → layout → components → pages)
  ├── JS núcleo (paths, data, store, shell)
  ├── JS de conteúdo (docs da linguagem)
  ├── JS por página
  └── localStorage  chave phytonfree.aluno.v1
```

## Camadas

| Camada | Pasta | Responsabilidade |
| --- | --- | --- |
| Entrada | raiz | `index.html` e arquivos de configuração |
| Apresentação | `pages/` | HTML de cada tela interna |
| Visual | `css/` | Tokens, reset, layout, componentes, estilos de página |
| Núcleo | `js/core/` | Caminhos, catálogo da trilha, persistência, casca |
| Conteúdo | `js/content/` | Temas da documentação da linguagem |
| Comportamento | `js/pages/` | Script exclusivo de cada tela |
| Marca | `assets/brand/` | Logo e favicon |
| Dossiê | `docs/` | Pesquisa, planejamento e estrutura do repositório |

## Resolução de caminhos

`index.html` declara `data-root="./"`. Páginas em `pages/` declaram `data-root="../"`.

`js/core/paths.js` usa esse atributo para montar:

- `Paths.home()` → `index.html`
- `Paths.page("sala.html")` → `pages/sala.html` relativo à raiz
- `Paths.brand("python-logo.svg")` → `assets/brand/python-logo.svg`

O shell (menu, marca, rodapé, logout) nunca hard-coda caminhos de página. Scripts de tela usam o mesmo helper nas navegações dinâmicas.

## Estado

`js/core/store.js` grava aluno e progresso no `localStorage`. Evento `phytonfree:update` redesenha o shell. Não há sincronização entre aparelhos.

## SEO e descoberta

- Metadados e canonical em cada HTML
- `sitemap.xml` lista a home e as rotas em `pages/`
- `robots.txt` aponta o sitemap
- `site.webmanifest` define nome, tema e ícone em `assets/brand/`

## Limites conscientes

Scripts globais (`<script src>`) compartilham o mesmo escopo. A ordem de carga importa: `paths` → `data` → `store` → `shell` → script da página (e `content/docs.js` antes de `pages/docs-page.js`).
