# Convenções

## Adicionar uma tela

1. Criar `pages/nome.html` com `data-root="../"` e os cinco CSS na ordem foundation → layout → components → pages.
2. Incluir os scripts do núcleo e, se houver comportamento próprio, `js/pages/nome.js`.
3. Registrar a rota em `js/core/shell.js` (menu ou rodapé) via `Paths.page("nome.html")`.
4. Ligar a partir de `index.html` com `href="pages/nome.html"`.
5. Incluir a URL em `sitemap.xml`.
6. Se o conteúdo for da linguagem Python, preferir `js/content/` em vez de misturar texto longo no HTML.

## Ordem dos scripts

```
js/core/paths.js
js/core/data.js
js/core/store.js
js/core/shell.js
js/content/…          (só se a tela precisar)
js/pages/….js         (script da tela)
```

## Caminhos

Não escrever `../pages/` nem `index.html` solto em scripts compartilhados. Usar `Paths`. O atributo `data-root` no `<body>` é o contrato entre HTML e JavaScript.

## CSS

- Tokens e reset em `css/foundation/`
- Estrutura de página em `css/layout/`
- Peças reutilizáveis em `css/components/`
- Exceções de uma tela em `css/pages/pages.css`

Evitar `url()` para arquivos de marca no CSS: o logo entra pelo HTML/`Paths.brand`.

## Dados da trilha

Aulas, módulos e exercícios: `js/core/data.js`.  
Temas oficiais da linguagem: `js/content/docs.js`.  
Não duplicar catálogo nas páginas.

## Persistência

A chave `phytonfree.aluno.v1` é a sessão local. Mudança de formato exige nova versão da chave ou migração explícita em `store.js`.

## Idioma e tom

Interface em pt-BR. Títulos de aula e exercícios na mesma voz da home: clara, concreta, sem jargão de marketing vazio.
