# Planejamento

## Objetivo

Entregar um portal navegável, com identidade própria, que cubra cadastro, área do aluno, documentação da linguagem, sala de aula, exercícios e curva de evolução — do iniciante à conclusão.

## Páginas planejadas

| Rota | Arquivo | Papel |
| --- | --- | --- |
| Home | `index.html` | Entrada, conceito, laboratório, estratégia |
| Cadastro | `pages/cadastro.html` | Criar conta local, login, visitante |
| Área do aluno | `pages/aluno.html` | Painel: XP, anel, próxima aula, pendências |
| Evolução | `pages/evolucao.html` | Curva SVG, barras por módulo, linha do tempo |
| Exercícios | `pages/exercicios.html` | Ateliê com filtro de nível e query `?atividade=` / `?nivel=` |
| Sala | `pages/sala.html` | Player, notas, playlist, `?aula=` |
| Docs da linguagem | `pages/docs.html` | Temas + código + link oficial, `?tema=` |

## Conteúdo da trilha

Definido em `js/core/data.js` (módulos, aulas, exercícios) e `js/content/docs.js` (temas da linguagem).

- 6 módulos: fundamentos, fluxo, funções, objetos, avançado, projeto
- 12 aulas com vídeo, duração e notas
- 12 exercícios (escolha ou resposta curta) com XP e explicação
- Temas de documentação alinhados à trilha, cada um com exemplo e URL oficial

## Critérios de pronto

- Raiz apenas com entrada e configuração
- Cada arquivo de código, página, estilo ou marca na pasta da sua responsabilidade
- Navegação e assets resolvidos por `js/core/paths.js` (`data-root` no `<body>`)
- SEO básico: title, description, canonical, sitemap, robots, JSON-LD na home e nos docs da linguagem
- Progresso persistido localmente; logout limpa a sessão
- Documentação de projeto em `docs/`, distinta da documentação para o aluno

## Ordem de trabalho (histórico)

1. Identidade e layout (tokens, base, componentes)
2. Shell (cabeçalho, barra de status, rodapé)
3. Páginas de percurso e conteúdo da trilha
4. **Organização de pastas e dossiê** — este documento e os vizinhos desta pasta
