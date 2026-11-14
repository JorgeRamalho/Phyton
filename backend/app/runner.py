"""Execução segura de código de aluno com o interpretador Python local."""

from __future__ import annotations

import re
import subprocess
import sys
import textwrap
from dataclasses import dataclass

MAX_SOURCE_CHARS = 8_000
EXEC_TIMEOUT_SEC = 6
MAX_CAPTURE_CHARS = 32_000

BLOCKED = re.compile(
    r"(?i)\b(__import__|eval|exec|compile|open|breakpoint|import|from|"
    r"subprocess|os\.|sys\.|shutil|socket|ctypes|pickle|importlib)\b"
)


@dataclass(slots=True)
class RunResult:
    stdout: str
    stderr: str
    error: str | None
    exit_code: int


def as_repl_source(source: str) -> str:
    """Espelha a heurística do front (home.js) para linhas de REPL."""
    trimmed = source.strip()
    if not trimmed:
        return source
    first = trimmed.split("\n", 1)[0]
    is_block = bool(
        re.match(
            r"^(def |class |for |while |if |elif |else:|try:|except|finally:|with |"
            r"import |from |assert |pass$|break$|continue$|return |raise |global |nonlocal |@)",
            first,
        )
    )
    is_assign = bool(re.match(r"^[A-Za-z_]\w*\s*=", first)) and "==" not in first
    is_print = bool(re.match(r"^print\s*\(", first))
    if is_block or is_assign or is_print or "\n" in trimmed:
        return source
    return f"print(repr({trimmed}))"


def validate_source(source: str) -> str | None:
    if not source or not source.strip():
        return "Nenhum código enviado."
    if len(source) > MAX_SOURCE_CHARS:
        return f"Código excede {MAX_SOURCE_CHARS} caracteres."
    if BLOCKED.search(source):
        return "Este trecho usa recursos bloqueados no laboratório (arquivos, sistema ou importações avançadas)."
    return None


def run_python(source: str, *, repl: bool = True) -> RunResult:
    issue = validate_source(source)
    if issue:
        return RunResult(stdout="", stderr="", error=issue, exit_code=1)

    body = as_repl_source(source) if repl else source
    wrapped = textwrap.dedent(
        f"""
        import sys
        from io import StringIO
        _out = StringIO()
        _err = StringIO()
        _old_out, _old_err = sys.stdout, sys.stderr
        sys.stdout, sys.stderr = _out, _err
        try:
            _g = {{"__name__": "__main__"}}
            exec({body!r}, _g, _g)
        except Exception as exc:
            print(exc, file=_err)
            raise SystemExit(1)
        finally:
            sys.stdout, sys.stderr = _old_out, _old_err
        print(_out.getvalue(), end="")
        if _err.getvalue():
            print(_err.getvalue(), end="", file=sys.stderr)
        """
    ).strip()

    try:
        completed = subprocess.run(
            [sys.executable, "-I", "-c", wrapped],
            capture_output=True,
            text=True,
            timeout=EXEC_TIMEOUT_SEC,
            check=False,
        )
    except subprocess.TimeoutExpired:
        return RunResult(
            stdout="",
            stderr="",
            error=f"Tempo esgotado ({EXEC_TIMEOUT_SEC}s). Revise laços infinitos.",
            exit_code=124,
        )

    stdout = (completed.stdout or "")[:MAX_CAPTURE_CHARS]
    stderr = (completed.stderr or "")[:MAX_CAPTURE_CHARS]
    error = None
    if completed.returncode != 0:
        error = stderr.strip() or stdout.strip() or "Erro ao executar o código."
    return RunResult(stdout=stdout, stderr=stderr, error=error, exit_code=completed.returncode)