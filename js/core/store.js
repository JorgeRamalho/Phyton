const STORE_KEY = "phytonfree.aluno.v1";

const Store = {
  empty() {
    return {
      student: null,
      progress: {
        xp: 0,
        streak: 0,
        lastVisit: null,
        minutes: 0,
        completedLessons: [],
        completedExercises: [],
        currentLessonId: "l01",
        createdAt: Date.now(),
      },
    };
  },

  read() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return this.empty();
      return { ...this.empty(), ...JSON.parse(raw) };
    } catch {
      return this.empty();
    }
  },

  write(state) {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent("phytonfree:update", { detail: state }));
    return state;
  },

  patch(mutator) {
    const state = this.read();
    mutator(state);
    return this.write(state);
  },

  register(payload) {
    const id = crypto.randomUUID ? crypto.randomUUID() : String(Date.now());
    return this.write({
      student: {
        id,
        name: payload.name.trim(),
        email: payload.email.trim().toLowerCase(),
        password: btoa(payload.password),
        levelStart: payload.levelStart,
        goal: payload.goal,
        hours: Number(payload.hours) || 4,
      },
      progress: {
        ...this.empty().progress,
        currentLessonId: payload.levelStart === "avancado" ? "l10" : payload.levelStart === "intermediario" ? "l06" : "l01",
      },
    });
  },

  login(email, password) {
    const state = this.read();
    if (!state.student) return { ok: false, error: "Nenhuma conta local encontrada. Cadastre-se primeiro." };
    const sameEmail = state.student.email === email.trim().toLowerCase();
    const samePass = state.student.password === btoa(password);
    if (!sameEmail || !samePass) return { ok: false, error: "E-mail ou senha não conferem nesta sessão local." };
    this.touchStreak();
    return { ok: true, state: this.read() };
  },

  guest() {
    return this.register({
      name: "Ada Lovelace",
      email: "ada@phytonfree.local",
      password: "phytonfree",
      levelStart: "iniciante",
      goal: "Concluir a trilha do primeiro print ao projeto final",
      hours: 6,
    });
  },

  logout() {
    localStorage.removeItem(STORE_KEY);
    window.dispatchEvent(new CustomEvent("phytonfree:update", { detail: this.empty() }));
  },

  touchStreak() {
    return this.patch((state) => {
      const today = new Date().toDateString();
      const last = state.progress.lastVisit;
      if (last === today) return;
      const yesterday = new Date(Date.now() - 86400000).toDateString();
      state.progress.streak = last === yesterday ? state.progress.streak + 1 : 1;
      state.progress.lastVisit = today;
    });
  },

  completeLesson(id) {
    const lesson = PHYTONFREE.lessons.find((item) => item.id === id);
    return this.patch((state) => {
      if (!state.progress.completedLessons.includes(id)) {
        state.progress.completedLessons.push(id);
        state.progress.xp += 50;
        state.progress.minutes += lesson ? lesson.minutes : 15;
      }
      const index = PHYTONFREE.lessons.findIndex((item) => item.id === id);
      const next = PHYTONFREE.lessons[index + 1];
      state.progress.currentLessonId = next ? next.id : id;
    });
  },

  completeExercise(id, xp) {
    return this.patch((state) => {
      if (!state.progress.completedExercises.includes(id)) {
        state.progress.completedExercises.push(id);
        state.progress.xp += xp;
        state.progress.minutes += 8;
      }
    });
  },

  setCurrentLesson(id) {
    return this.patch((state) => {
      state.progress.currentLessonId = id;
    });
  },
};

function derive(state) {
  const lessons = PHYTONFREE.lessons.length;
  const exercises = PHYTONFREE.exercises.length;
  const doneLessons = state.progress.completedLessons.length;
  const doneExercises = state.progress.completedExercises.length;
  const percent = Math.round(((doneLessons + doneExercises) / (lessons + exercises)) * 100);
  const level = [...PHYTONFREE.levels].reverse().find((item) => state.progress.xp >= item.minXp) || PHYTONFREE.levels[0];
  const league = PHYTONFREE.leagues[Math.min(PHYTONFREE.leagues.length - 1, Math.floor(state.progress.xp / 180))];
  const current = PHYTONFREE.lessons.find((item) => item.id === state.progress.currentLessonId) || PHYTONFREE.lessons[0];
  const modulesDone = PHYTONFREE.modules.filter((mod) => {
    const ids = PHYTONFREE.lessons.filter((lesson) => lesson.module === mod.id).map((lesson) => lesson.id);
    return ids.length > 0 && ids.every((id) => state.progress.completedLessons.includes(id));
  }).length;
  return {
    percent,
    level,
    league,
    current,
    modulesDone,
    doneLessons,
    doneExercises,
    lessons,
    exercises,
    hours: Math.round((state.progress.minutes / 60) * 10) / 10,
  };
}
