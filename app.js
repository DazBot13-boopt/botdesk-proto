const bots = {
  botpdg: {
    label: "botpdg",
    phone: "22955724800",
    up: "4h12m",
    metrics: [1284, 312, 47, 19],
    active: true,
  },
  botpdg2: {
    label: "botpdg2",
    phone: "22952727294",
    up: "1h07m",
    metrics: [402, 88, 11, 4],
    active: true,
  },
};

let current = "botpdg";
let pairTimer = null;

const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];

function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.add("hidden"), 2200);
}

function countUp(values) {
  $$(".figure b").forEach((node, i) => {
    const target = values[i] ?? 0;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / 650);
      const e = 1 - (1 - t) ** 3;
      node.textContent = Math.round(target * e).toLocaleString("fr-FR");
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

function applyBot(id) {
  const bot = bots[id];
  if (!bot) return;
  current = id;
  $("#home-bot").textContent = bot.label;
  $("#st-up").textContent = bot.up;
  $("#st-bot").textContent = bot.active ? "Actif" : "Pause";
  $("#t-active").checked = bot.active;
  $("#pair-phone").value = bot.phone;
  countUp(bot.metrics);
}

function setView(view) {
  $$(".tab").forEach((t) => t.classList.toggle("active", t.dataset.view === view));
  $$(".view").forEach((v) => v.classList.toggle("active", v.id === `view-${view}`));
}

$("#enter-app")?.addEventListener("click", () => {
  $("#splash").classList.add("hidden");
  $("#app").classList.remove("hidden");
  applyBot(current);
});

$$(".tab").forEach((tab) => {
  tab.addEventListener("click", () => setView(tab.dataset.view));
});

$$("[data-jump]").forEach((btn) => {
  btn.addEventListener("click", () => setView(btn.dataset.jump));
});

$("#bot-select")?.addEventListener("change", (e) => {
  applyBot(e.target.value);
  toast(`Bot : ${e.target.value}`);
});

$("#btn-refresh")?.addEventListener("click", () => {
  applyBot(current);
  toast("Actualisé (mock)");
});

$("#btn-restart")?.addEventListener("click", () => toast(`Restart ${current} (mock)`));

$("#t-active")?.addEventListener("change", (e) => {
  bots[current].active = e.target.checked;
  $("#st-bot").textContent = e.target.checked ? "Actif" : "Pause";
  toast(e.target.checked ? "Bot actif" : "Bot en pause");
});

$$(".tog input").forEach((input) => {
  if (input.id === "t-active") return;
  input.addEventListener("change", () => toast("Réglage mis à jour (mock)"));
});

$("#save-emoji")?.addEventListener("click", () => {
  toast(`Emoji : ${$("#emoji").value || "—"}`);
});

$("#btn-pair")?.addEventListener("click", () => {
  $("#pair-idle").classList.add("hidden");
  $("#pair-box").classList.remove("hidden");
  let left = 45;
  const timer = $("#pair-timer");
  clearInterval(pairTimer);
  const render = () => {
    timer.textContent = `expire dans ${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
  };
  render();
  pairTimer = setInterval(() => {
    left -= 1;
    if (left <= 0) {
      clearInterval(pairTimer);
      timer.textContent = "expiré — régénère un code";
      return;
    }
    render();
  }, 1000);
  toast("Code généré (mock)");
});

$("#btn-pair-reset")?.addEventListener("click", () => {
  clearInterval(pairTimer);
  $("#pair-box").classList.add("hidden");
  $("#pair-idle").classList.remove("hidden");
  toast("Pairage effacé");
});

$("#cfg")?.addEventListener("submit", (e) => {
  e.preventDefault();
  $("#cfg-ok").classList.remove("hidden");
  toast("Config sauvée (mock)");
  setTimeout(() => $("#cfg-ok").classList.add("hidden"), 1600);
});
