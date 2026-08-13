const PHYTONFREE_DOCS = [
  {
    id: "linguagem",
    level: "iniciante",
    title: "A linguagem e o interpretador",
    lead: "Python é uma linguagem interpretada, de tipagem dinâmica e indentação significativa. O arquivo .py vira bytecode e o CPython executa.",
    body: "O ciclo é sempre o mesmo: escrever, executar, ler o erro, corrigir. O interpretador interativo (REPL) serve para provar uma ideia em uma linha. Um script serve para guardar o argumento. A documentação oficial descreve a gramática, a biblioteca padrão e o modelo de dados — esta página traduz o essencial da trilha.",
    code: `python --version
python -c "print('olá, PhytonFree')"
# REPL: python
# >>> 2 + 2
# 4`,
    official: "https://docs.python.org/pt-br/3/tutorial/interpreter.html",
  },
  {
    id: "sintaxe",
    level: "iniciante",
    title: "Sintaxe e indentação",
    lead: "O espaço em branco não é decoração: quatro espaços abrem um bloco. Dois pontos (:) anunciam o corpo.",
    body: "Não misture tab com espaço. Comentários começam com #. Uma linha física pode continuar com \\ ou dentro de parênteses. Nomes usam snake_case. Constantes, por convenção, usam MAIÚSCULAS. A PEP 8 é o guia de estilo da linguagem.",
    code: `if pronto:
    print("seguir")
else:
    print("esperar")

# continuação implícita
total = (
    10
    + 20
)`,
    official: "https://docs.python.org/pt-br/3/reference/lexical_analysis.html",
  },
  {
    id: "tipos",
    level: "iniciante",
    title: "Tipos built-in",
    lead: "int, float, bool, str, list, tuple, dict, set e NoneType cobrem a maior parte do dia a dia.",
    body: "Tudo em Python é objeto. type(x) revela a classe. isinstance(x, int) pergunta com herança. Conversões são explícitas: int('2'), str(2), float('3.14'). Somar 2 + '2' levanta TypeError — a linguagem não adivinha.",
    code: `n = 10          # int
preco = 9.9     # float
ok = True       # bool
nome = "Ada"    # str
vazio = None    # ausência explícita

print(type(n), isinstance(ok, bool))
print(int("2") + 2)   # 4
# print(2 + "2")      # TypeError`,
    official: "https://docs.python.org/pt-br/3/library/stdtypes.html",
  },
  {
    id: "variaveis",
    level: "iniciante",
    title: "Variáveis e atribuição",
    lead: "O nome aponta para um objeto. A atribuição não copia o valor: ela religa a etiqueta.",
    body: "a = b faz as duas variáveis apontarem para o mesmo objeto se ele for mutável (lista, dicionário). Para tipos imutáveis (int, str, tuple) a reatribuição cria outro objeto. Nomes descritivos reduzem comentários. Evite x1, temp2, dados3.",
    code: `aluna = "Ada"
xp, nivel = 30, "Iniciante"   # desempacote
aluna, xp = xp, aluna         # troca

lista = [1, 2]
alias = lista
alias.append(3)
print(lista)   # [1, 2, 3] — mesmo objeto`,
    official: "https://docs.python.org/pt-br/3/reference/simple_stmts.html#assignment-statements",
  },
  {
    id: "operadores",
    level: "iniciante",
    title: "Operadores",
    lead: "Aritméticos, comparação, lógicos e o de identidade. // é divisão inteira; ** é potência; is pergunta identidade, == pergunta igualdade.",
    body: "and e or devolvem o operando, não necessariamente True/False. not inverte. in testa pertinência em coleção ou substring. Cuidado: is None é o idioma certo para ausência; não use == None.",
    code: `print(7 / 2)    # 3.5
print(7 // 2)   # 3
print(7 % 2)    # 1
print(2 ** 10)  # 1024

print(3 < 5 < 9)          # True — comparação encadeada
print("py" in "python")   # True
print(valor is None)`,
    official: "https://docs.python.org/pt-br/3/library/stdtypes.html#numeric-types-int-float-complex",
  },
  {
    id: "strings",
    level: "iniciante",
    title: "Strings",
    lead: "str é imutável e Unicode. f-strings interpolam. Métodos devolvem nova string, não alteram a original.",
    body: "Aspas simples ou duplas são equivalentes. Três aspas abrem um bloco. Índices e fatiamento funcionam como nas listas, mas sem atribuição no meio. len, split, join, strip, replace e startswith cobrem o essencial.",
    code: `nome = "Ada"
print(f"Olá, {nome}!")
print(nome.upper(), nome[0], nome[-1])
print("a,b,c".split(","))
print("-".join(["py", "thos"]))
print("""bloco
com várias linhas""")`,
    official: "https://docs.python.org/pt-br/3/library/stdtypes.html#text-sequence-type-str",
  },
  {
    id: "condicionais",
    level: "iniciante",
    title: "Condicionais",
    lead: "if, elif e else desenham ramos. A condição é qualquer objeto: 0, '', [], None e False são falsy.",
    body: "elif é o meio-termo pythonico — não existe else if. Expressão condicional cabe numa linha: valor = a if ok else b. Prefira ramos curtos e retornos cedo em funções, para o olho não perder o caminho feliz.",
    code: `nota = 8
if nota >= 9:
    conceito = "A"
elif nota >= 7:
    conceito = "B"
else:
    conceito = "C"

status = "ok" if nota >= 7 else "revisar"`,
    official: "https://docs.python.org/pt-br/3/tutorial/controlflow.html#if-statements",
  },
  {
    id: "lacos",
    level: "iniciante",
    title: "Laços for e while",
    lead: "for percorre um iterável. while repete enquanto a condição for verdadeira. break sai; continue salta a iteração.",
    body: "O idioma natural é for item in colecao. range(n) gera 0..n-1. enumerate entrega índice e valor. zip percorre duas sequências juntas. Evite for i in range(len(lista)) salvo quando o índice for o assunto.",
    code: `for i, letra in enumerate("py"):
    print(i, letra)

n = 3
while n > 0:
    n -= 1

for a, b in zip([1, 2], ["a", "b"]):
    print(a, b)`,
    official: "https://docs.python.org/pt-br/3/tutorial/controlflow.html#for-statements",
  },
  {
    id: "listas",
    level: "iniciante",
    title: "Listas",
    lead: "list é sequência mutável e ordenada. Cresce com append, encolhe com pop, fatia com [inicio:fim:passo].",
    body: "Índices começam em 0; -1 é o último. lista[:] copia rasa. sort ordena no lugar; sorted devolve outra lista. Uma lista de listas é só uma lista cujos itens são listas — não é matriz mágica.",
    code: `trilha = ["fundar", "encadear"]
trilha.append("modelar")
print(trilha[0], trilha[-1], trilha[1:])
copia = trilha[:]
print(sorted(trilha), trilha)`,
    official: "https://docs.python.org/pt-br/3/tutorial/introduction.html#lists",
  },
  {
    id: "tuplas-sets",
    level: "iniciante",
    title: "Tuplas e conjuntos",
    lead: "tuple protege a ordem e é imutável. set guarda itens únicos, sem ordem, com teses de pertinência rápidas.",
    body: "Uma tupla de um item precisa da vírgula: (1,). Tuplas servem para registros leves e chaves compostas. set([1, 1, 2]) vira {1, 2}. Operações |, &, - fazem união, interseção e diferença.",
    code: `ponto = (3, 4)
# ponto[0] = 9  # TypeError

unicos = {1, 1, 2, 3}
print(2 in unicos)
print({1, 2} | {2, 3})   # {1, 2, 3}
print({1, 2} & {2, 3})   # {2}`,
    official: "https://docs.python.org/pt-br/3/tutorial/datastructures.html#tuples-and-sequences",
  },
  {
    id: "dicionarios",
    level: "iniciante",
    title: "Dicionários",
    lead: "dict associa chave a valor. A chave precisa ser hasheável (str, int, tuple imutável). O acesso é por nome, não por posição.",
    body: "aluno['xp'] lê; aluno.get('liga', 'Cobre') evita KeyError. keys, values e items percorrem. Desde o 3.7 a ordem de inserção é estável. Compreensão de dicionário: {k: v for k, v in pares}.",
    code: `aluno = {"nome": "Ada", "xp": 30}
aluno["xp"] += 10
print(aluno.get("liga", "Cobre"))

for chave, valor in aluno.items():
    print(chave, valor)`,
    official: "https://docs.python.org/pt-br/3/tutorial/datastructures.html#dictionaries",
  },
  {
    id: "funcoes",
    level: "intermediario",
    title: "Funções",
    lead: "def abre um parágrafo reutilizável. Parâmetros entram; return devolve. Sem return, o resultado é None.",
    body: "Argumentos posicionais vêm primeiro; nomeados deixam a chamada explícita. *args empacota extras posicionais; **kwargs, os nomeados. Docstring na primeira linha documenta o contrato. Anotações (nome: str) -> int são opcionais e não obrigam o tipo em tempo de execução.",
    code: `def saudar(nome, vezes=1):
    """Devolve a saudação repetida."""
    return " ".join([f"Olá, {nome}!"] * vezes)

print(saudar("Ada"))
print(saudar(nome="Ada", vezes=2))

def soma(*parcelas):
    return sum(parcelas)`,
    official: "https://docs.python.org/pt-br/3/tutorial/controlflow.html#defining-functions",
  },
  {
    id: "escopo",
    level: "intermediario",
    title: "Escopo e None",
    lead: "LEGB: Local, Enclosing, Global, Built-in. None é a ausência explícita — compare com is, não com ==.",
    body: "Uma função que só lê variável global funciona. Para reatribuir, declare global nome. Closures usam nonlocal. Evite global: passe argumentos e devolva valores. None aparece em return omitido, get sem padrão e parâmetros opcionais.",
    code: `def proximo(atual):
    if atual is None:
        return 0
    return atual + 1

print(proximo(None), proximo(4))`,
    official: "https://docs.python.org/pt-br/3/tutorial/classes.html#python-scopes-and-namespaces",
  },
  {
    id: "modulos",
    level: "intermediario",
    title: "Módulos, pacotes e import",
    lead: "Um arquivo .py é um módulo. Uma pasta com __init__.py (ou namespace) é um pacote. import estabelece a fronteira.",
    body: "from math import sqrt importa um nome. import math as m cria um alias. Nunca faça from modulo import * em código de trilha. venv isola dependências. if __name__ == '__main__': guarda o ponto de entrada.",
    code: `import math
from pathlib import Path

print(math.sqrt(16))
print(Path("docs").exists())

if __name__ == "__main__":
    print("ponto de entrada")`,
    official: "https://docs.python.org/pt-br/3/tutorial/modules.html",
  },
  {
    id: "arquivos",
    level: "intermediario",
    title: "Arquivos e contexto",
    lead: "with open(...) as f garante o fechamento mesmo se houver erro. O gerenciador de contexto é o idioma certo.",
    body: "Modos: 'r' leitura, 'w' escrita (apaga), 'a' acréscimo, 'b' binário, encoding='utf-8' no texto. pathlib.Path lê e escreve com menos cerimônia. Sempre feche recursos: arquivos, conexões, locks.",
    code: `from pathlib import Path

caminho = Path("notas.txt")
caminho.write_text("aula 1\\n", encoding="utf-8")

with caminho.open(encoding="utf-8") as f:
    for linha in f:
        print(linha.strip())`,
    official: "https://docs.python.org/pt-br/3/tutorial/inputoutput.html#reading-and-writing-files",
  },
  {
    id: "excecoes",
    level: "intermediario",
    title: "Exceções",
    lead: "try / except trata o esperado. raise lança. finally corre sempre. except Exception é amplo demais para o dia a dia.",
    body: "Capture o tipo específico: ValueError, KeyError, FileNotFoundError. else do try roda se não houve erro. Mensagens claras fazem parte da interface. Não silencie except: pass sem registrar o motivo.",
    code: `def inteiro(texto):
    try:
        return int(texto)
    except ValueError as erro:
        raise ValueError(f"não é inteiro: {texto}") from erro

print(inteiro("8"))
# inteiro("oito")`,
    official: "https://docs.python.org/pt-br/3/tutorial/errors.html",
  },
  {
    id: "classes",
    level: "intermediario",
    title: "Classes e objetos",
    lead: "__init__ inicializa. self é a instância. Métodos são funções ligadas ao objeto. Modele o domínio antes da classe.",
    body: "Atributos de instância vivem em self. Atributos de classe são compartilhados. @property expõe cálculo como campo. __str__ é a representação amigável; __repr__, a do depurador. Herança existe — use quando houver um “é um” verdadeiro, não para reaproveitar duas linhas.",
    code: `class Aluno:
    def __init__(self, nome, xp=0):
        self.nome = nome
        self.xp = xp

    def ganhar(self, pontos):
        self.xp += pontos

    def __str__(self):
        return f"{self.nome} · {self.xp} XP"

ada = Aluno("Ada")
ada.ganhar(30)
print(ada)`,
    official: "https://docs.python.org/pt-br/3/tutorial/classes.html",
  },
  {
    id: "compreensoes",
    level: "avancado",
    title: "Compreensões",
    lead: "List, set e dict comprehensions descrevem uma coleção nova numa expressão. Mantenha curtas o bastante para caber num título.",
    body: "[n**2 for n in range(5) if n % 2 == 0] filtra e transforma. Se a expressão pedir dois ifs e um comentário, volte ao for. Gerador entre parênteses não materializa a lista inteira.",
    code: `quadrados = [n ** 2 for n in range(5)]
pares = [n for n in range(10) if n % 2 == 0]
mapa = {n: n ** 2 for n in range(4)}
fluxo = (n ** 2 for n in range(1000))  # gerador`,
    official: "https://docs.python.org/pt-br/3/tutorial/datastructures.html#list-comprehensions",
  },
  {
    id: "iteradores",
    level: "avancado",
    title: "Iteradores e geradores",
    lead: "Um iterável implementa __iter__. Um iterador implementa __next__. yield pausa a função e devolve o próximo valor sob demanda.",
    body: "Geradores economizam memória em fluxos longos. next(it, padrão) evita StopIteration. itertools (count, cycle, islice) compõe fluxos. Não percorra um gerador duas vezes — ele se esgota.",
    code: `def contagem(n):
    atual = 0
    while atual < n:
        yield atual
        atual += 1

for valor in contagem(3):
    print(valor)`,
    official: "https://docs.python.org/pt-br/3/howto/functional.html#generators",
  },
  {
    id: "decorators",
    level: "avancado",
    title: "Decorators",
    lead: "@decorador envolve a função. É açúcar para f = decorador(f). Serve para log, cache, permissão e medição — não para esconder regra de negócio.",
    body: "functools.wraps preserva o nome e a docstring da função original. Um decorator com argumentos vira fábrica: @repete(3). Entenda o envoltório antes de empilhar três @ no mesmo def.",
    code: `from functools import wraps

def registrar(fn):
    @wraps(fn)
    def envolta(*args, **kwargs):
        print("chamou", fn.__name__)
        return fn(*args, **kwargs)
    return envolta

@registrar
def somar(a, b):
    return a + b`,
    official: "https://docs.python.org/pt-br/3/glossary.html#term-decorator",
  },
  {
    id: "testes",
    level: "avancado",
    title: "Testes e qualidade",
    lead: "assert e unittest (ou pytest) protegem o contrato: entradas, saídas e erros. O teste não cobre a cor do botão — cobre o comportamento.",
    body: "Um teste tem nome que descreve o fato. Arrange, act, assert. Rode a suíte a cada mudança da função. Qualidade também é nome, limite e regressão sob controle. A documentação oficial de unittest mostra o esqueleto; o hábito é que segura a trilha.",
    code: `def dobro(n):
    return n * 2

def test_dobro():
    assert dobro(3) == 6
    assert dobro(0) == 0

test_dobro()
print("ok")`,
    official: "https://docs.python.org/pt-br/3/library/unittest.html",
  },
  {
    id: "oficial",
    level: "referencia",
    title: "Documentação oficial",
    lead: "Esta página é o mapa da trilha. A fonte da linguagem é docs.python.org — tutorial, library reference e language reference.",
    body: "Use o Tutorial para o primeiro passeio, a Library Reference para um módulo (pathlib, json, datetime, re) e a Language Reference quando a dúvida for de gramática. A versão em português cobre a maior parte do 3.x. Em dúvida de comportamento, o interpretador e o docs oficial vencem qualquer resumo.",
    code: `# Pontos de partida
# Tutorial:     https://docs.python.org/pt-br/3/tutorial/
# Biblioteca:   https://docs.python.org/pt-br/3/library/
# Referência:   https://docs.python.org/pt-br/3/reference/
# Glossário:    https://docs.python.org/pt-br/3/glossary.html
# PEP 8:        https://peps.python.org/pep-0008/`,
    official: "https://docs.python.org/pt-br/3/",
  },
];
