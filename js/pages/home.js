const LOG_SCRIPT = [
  { kind: "info", text: "sessão 01 · trilha PhytonFree · python 3.12.4" },
  { kind: "shell", text: "python" },
  { kind: "out", text: "Python 3.12.4 (tags/v3.12.4:8a2c993, Jun 2024)" },
  { kind: "out", text: "[GCC 13.2.0] on linux" },
  { kind: "repl", text: 'print("Do primeiro print à conclusão.")' },
  { kind: "out", text: "Do primeiro print à conclusão." },
  { kind: "repl", text: 'nome = "Ada"' },
  { kind: "repl", text: "nivel = \"iniciante\"" },
  { kind: "repl", text: "print(f\"Olá, {nome}. Nível: {nivel}.\")" },
  { kind: "out", text: "Olá, Ada. Nível: iniciante." },
  { kind: "repl", text: "def dobro(n):" },
  { kind: "cont", text: "    return n * 2" },
  { kind: "repl", text: "dobro(21)" },
  { kind: "out", text: "42" },
  { kind: "repl", text: "notas = [9, 8, 10, 7]" },
  { kind: "repl", text: "sum(notas) / len(notas)" },
  { kind: "out", text: "8.5" },
  { kind: "repl", text: "aluno = {\"xp\": 50, \"liga\": \"Cobre\"}" },
  { kind: "repl", text: 'aluno["xp"] += 25' },
  { kind: "repl", text: "aluno" },
  { kind: "out", text: "{'xp': 75, 'liga': 'Cobre'}" },
  { kind: "shell", text: "pytest test_fundamentos.py -q" },
  { kind: "ok", text: "......" },
  { kind: "ok", text: "6 passed in 0.07s" },
  { kind: "shell", text: "python aula_02.py" },
  { kind: "out", text: ">>> for n in range(3): print(n)" },
  { kind: "out", text: "0" },
  { kind: "out", text: "1" },
  { kind: "out", text: "2" },
  { kind: "repl", text: "class Modulo:" },
  { kind: "cont", text: "    def __init__(self, titulo):" },
  { kind: "cont", text: "        self.titulo = titulo" },
  { kind: "repl", text: 'fundar = Modulo("Tipos e nomes")' },
  { kind: "repl", text: "fundar.titulo" },
  { kind: "out", text: "'Tipos e nomes'" },
  { kind: "shell", text: 'git commit -m "fecha o módulo fundar"' },
  { kind: "ok", text: "[main 4f2c1a] fecha o módulo fundar" },
  { kind: "ok", text: " 3 files changed, 84 insertions(+)" },
  { kind: "err", text: "Traceback (most recent call last):" },
  { kind: "err", text: '  File "<stdin>", line 1, in <module>' },
  { kind: "err", text: "ZeroDivisionError: division by zero" },
  { kind: "repl", text: "try:" },
  { kind: "cont", text: "    1 / 0" },
  { kind: "cont", text: "except ZeroDivisionError as erro:" },
  { kind: "cont", text: "    print(type(erro).__name__)" },
  { kind: "out", text: "ZeroDivisionError" },
  { kind: "ok", text: "contrato restaurado · próximo: funções" },
  { kind: "info", text: "— loop —" },
];

const GUTTER = {
  shell: "$",
  repl: ">>>",
  cont: "...",
  out: " ",
  ok: "ok",
  err: "!!",
  info: "#",
};

const MAX_LINES = 14;

function sleep(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function mountLog(host, script, maxLines) {
  const lines = script;
  const max = maxLines;
  let paused = false;
  let running = true;

  host.addEventListener("pointerenter", () => {
    paused = true;
  });
  host.addEventListener("pointerleave", () => {
    paused = false;
  });
  document.addEventListener("visibilitychange", () => {
    paused = document.hidden;
  });

  async function waitWhilePaused() {
    while (paused && running) {
      await sleep(120);
    }
  }

  function trim() {
    while (host.children.length > max) {
      host.removeChild(host.firstElementChild);
    }
  }

  function addLine(kind, text, withCursor) {
    const row = document.createElement("div");
    row.className = `log-line is-${kind}`;
    const gutter = document.createElement("span");
    gutter.className = "log-gutter";
    gutter.textContent = GUTTER[kind] ?? " ";
    const body = document.createElement("span");
    body.className = "log-body";
    body.textContent = text;
    row.append(gutter, body);
    if (withCursor) {
      const cursor = document.createElement("span");
      cursor.className = "log-cursor";
      body.append(cursor);
    }
    host.append(row);
    trim();
    return body;
  }

  async function typeLine(kind, text) {
    const body = addLine(kind, "", true);
    const cursor = body.querySelector(".log-cursor");
    for (const char of text) {
      await waitWhilePaused();
      body.insertBefore(document.createTextNode(char), cursor);
      await sleep(18 + Math.random() * 22);
    }
    cursor.remove();
  }

  async function play() {
    if (prefersReducedMotion()) {
      lines.slice(-max).forEach((line) => addLine(line.kind, line.text, false));
      return;
    }

    while (running) {
      for (const line of lines) {
        if (!running) return;
        await waitWhilePaused();
        const types = line.kind === "shell" || line.kind === "repl" || line.kind === "cont";
        if (types) {
          await typeLine(line.kind, line.text);
        } else {
          addLine(line.kind, line.text, false);
          await sleep(90 + Math.random() * 80);
        }
        await sleep(line.kind === "info" ? 420 : 160 + Math.random() * 220);
      }
    }
  }

  play();
}

function asReplSource(source) {
  const trimmed = source.trim();
  if (!trimmed) return source;
  const first = trimmed.split("\n")[0];
  const isBlock = /^(def |class |for |while |if |elif |else:|try:|except|finally:|with |import |from |assert |pass$|break$|continue$|return |raise |global |nonlocal |@)/.test(first);
  const isAssign = /^[A-Za-z_]\w*\s*=/.test(first) && !first.includes("==");
  const isPrint = /^print\s*\(/.test(first);
  if (isBlock || isAssign || isPrint || trimmed.includes("\n")) return source;
  return `print(repr(${trimmed}))`;
}

const LOOP_STEPS = [
  {
    gesture: "Pedir",
    ask: "Faça a palavra olá aparecer na tela.",
    why: "print é um pedido: mostre isto. As aspas são o recado.",
    hint: "print(\"olá\")",
    success: "Apareceu olá. Você pediu e o Python mostrou. Isso já é programar.",
    ok: (code, shown) => /print\s*\(\s*["']olá["']\s*\)/i.test(code) || /olá/i.test(shown),
  },
  {
    gesture: "Guardar",
    ask: "Guarde Ada numa caixinha chamada nome.",
    why: "O sinal = aqui não é conta. Quer dizer: ponha isto neste nome, para usar depois.",
    hint: "nome = \"Ada\"",
    quiet: "Guardou, sem mostrar nada. Neste gesto isso é o certo.",
    success: "Ada ficou na caixinha nome. Guardar ainda não mostra. O próximo gesto usa o que ficou.",
    ok: (code) => /nome\s*=\s*["']Ada["']/.test(code),
  },
  {
    gesture: "Usar",
    ask: "Mostre o que está dentro de nome.",
    why: "Sem aspas, nome é a caixinha. Com aspas, seria só a palavra. Por isso print(nome) traz Ada.",
    hint: "print(nome)",
    success: "Saiu Ada. Você pediu, guardou e usou. Falta só repetir o pedido.",
    ok: (code, shown) => /print\s*\(\s*nome\s*\)/.test(code) || /Ada/.test(shown),
  },
  {
    gesture: "Repetir",
    ask: "Guarde três notas e mostre cada uma, uma de cada vez.",
    why: "for é o laço: para cada item da lista, faça o mesmo pedido. Um gesto, várias respostas.",
    hint: "notas = [9, 8, 10]\nfor n in notas:\n    print(n)",
    success: "9, 8 e 10. O laço fechou: pedir, guardar, usar, repetir. Embaixo, matricule-se para continuar.",
    ok: (code, shown) => /for\s+\w+\s+in\s+notas\s*:/.test(code) || (shown.includes("9") && shown.includes("8") && shown.includes("10")),
  },
];

function mountLearningLoop() {
  const input = document.getElementById("repl-in");
  const out = document.getElementById("repl-out");
  const runBtn = document.getElementById("loop-run");
  const fillBtn = document.getElementById("loop-fill");
  const nextBtn = document.getElementById("loop-next");
  const resetBtn = document.getElementById("loop-reset");
  const nowEl = document.getElementById("loop-now");
  const askEl = document.getElementById("loop-ask");
  const whyEl = document.getElementById("loop-why");
  const codeEl = document.getElementById("loop-code");
  const okEl = document.getElementById("loop-ok");
  const helpEl = document.getElementById("loop-help");
  const stations = document.querySelectorAll("#loop-stations li");
  if (!input || !out || !runBtn || !fillBtn || !nextBtn || !resetBtn) return;

  let step = 0;
  let busy = false;

  function builtinRead(filename) {
    if (!Sk.builtinFiles || !Sk.builtinFiles.files[filename]) {
      throw new Error(`File not found: '${filename}'`);
    }
    return Sk.builtinFiles.files[filename];
  }

  if (typeof Sk !== "undefined") {
    Sk.retainGlobals = true;
    const config = {
      output: (text) => {
        out.textContent += text;
      },
      read: builtinRead,
      execLimit: 20000,
      killableWhile: true,
    };
    if (typeof Sk.python3 !== "undefined") config.__future__ = Sk.python3;
    Sk.configure(config);
  }

  function fillHint() {
    input.value = LOOP_STEPS[step].hint;
  }

  function renderStep() {
    const current = LOOP_STEPS[step];
    nowEl.textContent = `Gesto ${step + 1} de ${LOOP_STEPS.length} · ${current.gesture}`;
    askEl.textContent = current.ask;
    whyEl.textContent = current.why;
    codeEl.textContent = current.hint;
    fillHint();
    okEl.hidden = true;
    helpEl.hidden = true;
    nextBtn.hidden = true;
    resetBtn.hidden = true;
    out.textContent = "Ainda nada. Aperte Rodar esta linha.";
    stations.forEach((station, index) => {
      station.classList.toggle("is-done", index < step);
      station.classList.toggle("is-on", index === step);
    });
  }

  async function runCode(source) {
    if (busy) return;
    const code = source.trim();
    if (!code) {
      helpEl.hidden = false;
      helpEl.textContent = "A linha sumiu. Clique no recado amarelo para colocá-la de volta.";
      return;
    }
    if (typeof Sk === "undefined") {
      out.textContent = "O Python desta página não carregou. Recarregue o site.";
      return;
    }
    busy = true;
    out.textContent = "";
    helpEl.hidden = true;
    try {
      await Sk.misceval.asyncToPromise(() =>
        Sk.importMainWithBody("aluno", false, asReplSource(code), true)
      );
      if (!out.textContent.trim()) {
        out.textContent = LOOP_STEPS[step].quiet || "Ainda nada. Aperte Rodar esta linha.";
      }
      const current = LOOP_STEPS[step];
      if (current.ok(code, out.textContent)) {
        okEl.hidden = false;
        okEl.textContent = current.success;
        if (step < LOOP_STEPS.length - 1) {
          nextBtn.hidden = false;
        } else {
          resetBtn.hidden = false;
        }
      } else {
        helpEl.hidden = false;
        helpEl.textContent = "Ainda não. Clique no recado amarelo, deixe a linha como está e rode de novo.";
      }
    } catch (error) {
      out.textContent = String(error).replace(/^Error:\s*/i, "");
      helpEl.hidden = false;
      helpEl.textContent = "Deu erro — normal no começo. Clique no recado amarelo e rode sem mudar nada.";
    } finally {
      busy = false;
    }
  }

  fillBtn.addEventListener("click", () => {
    fillHint();
    input.focus();
  });
  runBtn.addEventListener("click", () => runCode(input.value));
  nextBtn.addEventListener("click", () => {
    if (step < LOOP_STEPS.length - 1) {
      step += 1;
      renderStep();
    }
  });
  resetBtn.addEventListener("click", () => {
    step = 0;
    renderStep();
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey && !input.value.includes("\n")) {
      event.preventDefault();
      runCode(input.value);
    }
  });

  renderStep();
}

document.addEventListener("DOMContentLoaded", () => {
  const host = document.getElementById("live-log");
  if (host) mountLog(host, LOG_SCRIPT, MAX_LINES);
  mountLearningLoop();
});

function showEnrollNotice(el, message, ok) {
  el.hidden = false;
  el.className = `notice ${ok ? "notice-ok" : "notice-err"}`;
  el.textContent = message;
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-matricula");
  const notice = document.getElementById("matricula-notice");
  if (!form || !notice) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const password = String(data.get("password") || "");
    const confirm = String(data.get("confirm") || "");
    const name = String(data.get("name") || "").trim();
    const email = String(data.get("email") || "").trim();
    const phone = String(data.get("phone") || "").trim();
    const birth = String(data.get("birth") || "");

    if (name.split(" ").filter(Boolean).length < 2) {
      showEnrollNotice(notice, "Informe o nome completo.", false);
      return;
    }
    if (!email.includes("@")) {
      showEnrollNotice(notice, "Informe um e-mail válido.", false);
      return;
    }
    if (phone.replace(/\D/g, "").length < 10) {
      showEnrollNotice(notice, "Informe um telefone com DDD.", false);
      return;
    }
    if (!birth) {
      showEnrollNotice(notice, "Informe a data de nascimento.", false);
      return;
    }
    if (password.length < 6) {
      showEnrollNotice(notice, "A senha precisa ter ao menos 6 caracteres.", false);
      return;
    }
    if (password !== confirm) {
      showEnrollNotice(notice, "A confirmação não coincide com a senha.", false);
      return;
    }
    if (!data.get("terms")) {
      showEnrollNotice(notice, "Aceite os termos locais para confirmar a matrícula.", false);
      return;
    }

    Store.register({
      name,
      email,
      password,
      levelStart: String(data.get("levelStart")),
      goal: String(data.get("goal")),
      hours: String(data.get("hours")),
      phone,
      birth,
      city: String(data.get("city")),
      state: String(data.get("state")),
      experience: String(data.get("experience")),
      schedule: String(data.get("schedule")),
      contact: String(data.get("contact")),
      source: String(data.get("source")),
      newsletter: Boolean(data.get("newsletter")),
    });
    showEnrollNotice(notice, "Matrícula confirmada neste navegador. Abrindo a área do aluno…", true);
    window.setTimeout(() => {
      window.location.href = Paths.page("aluno.html");
    }, 800);
  });
});
