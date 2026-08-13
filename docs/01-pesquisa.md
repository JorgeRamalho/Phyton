# Pesquisa

## Problema

Quem começa Python encontra material abundante e desconectado: tutoriais oficiais, playlists longas, listas de exercícios sem contexto e dashboards que não mostram o estado do estudo. O aluno perde o fio entre assistir, ler e praticar.

PhytonFree reúne esses três gestos num único portal, com identidade visual própria e uma barra de status que expõe o progresso como variáveis de um sistema.

## Público

| Perfil | Necessidade | Resposta no portal |
| --- | --- | --- |
| Iniciante absoluto | Primeiro ambiente, tipos, `print` | Cadastro com nível inicial, docs e aulas 01–05, laboratório nível 01 |
| Quem já leu listas e `if` | Encadear funções e coleções | Módulos intermediários, exercícios de contrato (`def`, `with`) |
| Quem quer fechar a trilha | Qualidade, testes, um sistema próprio | Aulas avançadas, projeto final, curva de evolução |

O cadastro pede nome, e-mail, nível, horas semanais e objetivo. Essas variáveis alimentam a barra de status em todas as páginas.

## Referências de conteúdo

- [Documentação oficial do Python (pt-BR)](https://docs.python.org/pt-br/3/) — fonte canônica ligada a cada tema em `pages/docs.html`
- [python.org/downloads](https://www.python.org/downloads/) — instalação, aberta em nova aba no menu
- Playlists públicas de referência (Curso em Vídeo e percursos intermediários/avançados) — embutidas na sala via YouTube nocookie
- Práticas de estudo: sessões curtas, recuperação ativa, espaçamento e exercício no mesmo bloco da aula (seção Estratégia da home)

## Decisões de produto

1. **Site estático.** Sem backend nesta fase: o progresso vive no `localStorage` do navegador. Serve para demonstração, oficina e portfólio sem conta em servidor.
2. **Uma trilha, quatro órbitas.** Fundar → encadear → modelar → concluir. Seis módulos, doze aulas, doze exercícios.
3. **Documentação da linguagem ≠ documentação do projeto.** O aluno lê o mapa da linguagem no portal. Quem desenvolve lê esta pasta `docs/`.
4. **Marca Python visível.** Logo oficial em `assets/brand/`, tipografia de título (Fraunces), serif nas legendas (Source Serif 4), sans no texto (Manrope) e mono no código (IBM Plex Mono).
5. **Laboratório como divisão própria.** A home trata exercícios como ateliê (níveis + acesso direto), não como lista genérica.

## Fora de escopo (pesquisa atual)

- Autenticação em servidor, e-mail transacional, multi-dispositivo
- Correção automática de código Python executado no browser
- CMS ou painel administrativo de conteúdo
- Temas claro/escuro além do esquema escuro atual

Esses itens podem entrar em iterações futuras; não bloqueiam a organização atual das pastas.
