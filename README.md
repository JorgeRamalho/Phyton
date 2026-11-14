📌 ## Academia Phyton 🐍 - Programação Scholl

🌐 ## Website Link do projeto online: https://phyton-ten.vercel.app/

📂 ## Repositório: https://github.com/JorgeRamalho/Phyton

💻 ## Tecnologias

HTML CSS JavaScript Python FastAPI SQLite

📲 ## Funcionalidades

Portal de estudos em Python: área do aluno, documentação da linguagem, sala de aula, exercícios, sandbox e curva de evolução. Com a API ativa, o motor executa código real, autentica matrícula e sincroniza progresso.

📠 ## Como executar

Frontend:

```bash
git clone https://github.com/JorgeRamalho/Phyton.git
cd Phyton
npm start
```

Abre o servidor local em [http://localhost:4173](http://localhost:4173). A entrada do site é `index.html`. Com Live Server na porta `5501`, use [http://127.0.0.1:5501/index.html](http://127.0.0.1:5501/index.html).

Motor Python (FastAPI) — execução real, matrícula no servidor e barra **Motor** na interface:

```bash
cd backend
pip install -r requirements.txt
cd ..
npm run api
```

A API sobe em [http://127.0.0.1:8765](http://127.0.0.1:8765). Testes:

```bash
npm run test:api
```

Com a API ativa:

- O laço “Primeiro laço” na home usa o Python instalado na máquina
- Exercícios podem ser corrigidos pelo servidor (`POST /api/exercises/check`)
- Login e cadastro autenticam contra matrículas gravadas em `backend/data/`
- O progresso (XP, aulas, exercícios) sincroniza com `POST /api/progress/push` e `pull`
- A página `pages/exercicios.html` inclui um sandbox de código
- O painel `pages/admin.html` lista matrículas e progresso (chave local `phytonfree-local-dev`)
- **SQLite** em `backend/data/phytonfree.sqlite` (importa JSON legado na primeira subida)
- **JWT** (`access_token`) — sync em `GET /api/progress/me` e `POST /api/progress/sync` sem reenviar senha
- Atividades **code_run** (`e13`, `e14`) — o servidor executa o código e valida a saída

Variável opcional de produção: `PHYTONFREE_JWT_SECRET`.

Sem API, o portal continua com Skulpt no navegador e correção local.

## Pasta raiz

A raiz contém apenas entrada e configuração:

| Arquivo | Função |
| --- | --- |
| `index.html` | Página inicial — único HTML na raiz |
| `package.json` | Scripts e metadados do projeto |
| `robots.txt` | Diretrizes para indexação |
| `sitemap.xml` | Mapa de URLs públicas |
| `site.webmanifest` | Identidade do app (PWA leve) |
| `README.md` | Este arquivo |

O restante vive em pastas por responsabilidade. Mapa completo: [docs/04-estrutura.md](docs/04-estrutura.md).

## Documentação do projeto

Não confundir com `pages/docs.html` (mapa da linguagem Python para o aluno).

| Documento | Conteúdo |
| --- | --- |
| [docs/README.md](docs/README.md) | Índice |
| [docs/01-pesquisa.md](docs/01-pesquisa.md) | Pesquisa, público e referências |
| [docs/02-planejamento.md](docs/02-planejamento.md) | Escopo, páginas e critérios |
| [docs/03-arquitetura.md](docs/03-arquitetura.md) | Camadas técnicas e dados |
| [docs/04-estrutura.md](docs/04-estrutura.md) | Organização de pastas e arquivos |
| [docs/05-convencoes.md](docs/05-convencoes.md) | Convenções para evoluir o código |

💿 ## Autor: Jorge R. Barbosa 💼 LinkedIn: https://www.linkedin.com/in/jorge-r-barbosa-aabb0417b/
👾 GitHub: https://github.com/JorgeRamalho ☎️ Contato: 41 99143-4153
