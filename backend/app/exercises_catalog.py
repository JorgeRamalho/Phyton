"""Catálogo de respostas das 12 atividades (espelho de js/core/data.js)."""

from __future__ import annotations

import re
import unicodedata
from typing import Any

from .runner import run_python

EXERCISES: dict[str, dict[str, Any]] = {
    "e01": {
        "type": "choice",
        "answer": 1,
        "xp": 30,
        "explain": "print() é a função nativa de saída. As demais pertencem a outras linguagens ou ao shell.",
    },
    "e02": {
        "type": "choice",
        "answer": 2,
        "xp": 35,
        "explain": "int e str não se somam implicitamente. Converta com int() ou str() de propósito.",
    },
    "e03": {
        "type": "code",
        "accept": ["variavel", "variável", "variaveis", "variáveis"],
        "xp": 25,
        "explain": "Nomes são tipografia semântica. Uma variável clara reduz comentários e erros.",
    },
    "e04": {
        "type": "choice",
        "answer": 2,
        "xp": 30,
        "explain": "elif é o meio-termo pythonico entre if e else.",
    },
    "e05": {
        "type": "choice",
        "answer": 1,
        "xp": 30,
        "explain": "for item in lista é o idioma natural. range(len(...)) só quando o índice importa.",
    },
    "e06": {
        "type": "choice",
        "answer": 3,
        "xp": 35,
        "explain": "O dicionário nomeia o dado. Use quando o acesso por identidade for mais claro que por posição.",
    },
    "e07": {
        "type": "choice",
        "answer": 2,
        "xp": 40,
        "explain": "None é a ausência explícita. Prefira retornar um valor quando a função calcula algo.",
    },
    "e08": {
        "type": "code",
        "accept": ["def"],
        "xp": 25,
        "explain": "def nome(args): abre o bloco. Dois pontos e indentação fecham o contrato visual.",
    },
    "e09": {
        "type": "choice",
        "answer": 1,
        "xp": 40,
        "explain": "with open(...) as f cria um contexto. O arquivo fecha ao sair do bloco.",
    },
    "e10": {
        "type": "code",
        "accept": ["__init__", "init"],
        "xp": 40,
        "explain": "__init__ recebe self e os dados iniciais. Não é o construtor da VM, mas o inicializador.",
    },
    "e11": {
        "type": "choice",
        "answer": 1,
        "xp": 50,
        "explain": "List comprehension com range(5) e o operador **. Mantenha a expressão curta o bastante para caber num título.",
    },
    "e12": {
        "type": "choice",
        "answer": 1,
        "xp": 45,
        "explain": "Teste o contrato: entradas, saídas e erros. Visual muda; a regra de negócio precisa permanecer.",
    },
    "e13": {
        "type": "code_run",
        "xp": 55,
        "stdout_contains": ["PhytonFree"],
        "explain": "O print deve mostrar exatamente a marca do portal. Teste no servidor Python.",
    },
    "e14": {
        "type": "code_run",
        "xp": 60,
        "stdout_regex": [r"0\s*\n\s*1\s*\n\s*2"],
        "explain": "Um for em range(3) com print(n) gera três linhas: 0, 1 e 2.",
    },
}


def normalize(value: str) -> str:
    text = value.strip().lower()
    return "".join(
        char
        for char in unicodedata.normalize("NFD", text)
        if unicodedata.category(char) != "Mn"
    )


def check_answer(
    exercise_id: str,
    *,
    choice_index: int | None = None,
    value: str | None = None,
    source: str | None = None,
) -> dict:
    item = EXERCISES.get(exercise_id)
    if not item:
        return {"ok": False, "error": "Atividade desconhecida.", "explain": ""}

    ok = False
    runtime_note = ""
    if item["type"] == "choice":
        if choice_index is None:
            return {"ok": False, "error": "Índice da alternativa ausente.", "explain": item["explain"]}
        ok = choice_index == item["answer"]
    elif item["type"] == "code_run":
        if not source or not source.strip():
            return {"ok": False, "error": "Envie o código para executar.", "explain": item["explain"]}
        result = run_python(source, repl=False)
        if result.error or result.exit_code != 0:
            return {
                "ok": False,
                "error": result.error or "Erro ao executar o código.",
                "explain": item["explain"],
                "stdout": result.stdout,
            }
        stdout = result.stdout
        ok = True
        for snippet in item.get("stdout_contains", []):
            if snippet not in stdout:
                ok = False
        for pattern in item.get("stdout_regex", []):
            if not re.search(pattern, stdout, re.MULTILINE):
                ok = False
        runtime_note = " Saída validada pelo Python real."
    elif item["type"] == "code":
        if value is None:
            return {"ok": False, "error": "Resposta textual ausente.", "explain": item["explain"]}
        normalized = normalize(value)
        ok = normalized in {normalize(entry) for entry in item.get("accept", [])}
    else:
        return {"ok": False, "error": "Tipo de atividade não suportado.", "explain": item["explain"]}

    explain = item["explain"] + (runtime_note if ok and runtime_note else "")
    return {
        "ok": ok,
        "explain": explain.strip(),
        "xp": item["xp"],
        "exercise_id": exercise_id,
    }