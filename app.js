const bots = {
  botpdg: {
    label: "botpdg",
    phone: "22955724800",
    uptime: "4h12m",
    wa: "Connecté",
    active: true,
    metrics: [1284, 312, 47, 19],
  },
  botpdg2: {
    label: "botpdg2",
    phone: "22952727294",
    uptime: "1h07m",
    wa: "Connecté",
    active: true,
    metrics: [402, 88, 11, 4],
  },
};

const titles = {
  overview: "Vue d’ensemble",
  controls: "Contrôles",
  pairing: "Pairing",
  config: "Config",
};

let currentBot = "botpdg";
let pairCountdown = null;

const $ = (sel) => document.querySelector(sel);
const $$ = (sel) => [...document.querySelectorAll(sel)];

function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    el.hidden = true;
  }, 2200);
}

function animateCounts(values) {
  $$(".metric-n").forEach((node, i) => {
    const target = values[i] ?? 0;
    const start = performance.now();
    const from = 0;
    const dur = 700;
    function tick(now) {
      const t = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - t, 3);
      node.textContent = Math.round(from + (target - from) * eased).toLocaleString("fr-FR");
      if (t < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

function applyBot(id) {
  const bot = bots[id];
  if (!bot) return;
  currentBot = id;
  $("#active-bot-label").textContent = bot.label;
  $("#uptime").textContent = bot.uptime;
  $("#wa-state").textContent = bot.wa;
  $("#bot-state").textContent = bot.active ? "Actif" : "Pause";
  $("#bot-state").classList.toggle("ok", bot.active);
  $("#toggle-active").checked = bot.active;
  $("#pair-phone").value = bot.phone;
  animateCounts(bot.metrics);
  $$(".bot-chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.bot === id);
  });
}

function setView(view) {
  $$(".nav-item").forEach((n) => n.classList.toggle("active", n.dataset.view === view));
  $$(".panel.view").forEach((p) => p.classList.toggle("active", p.id === `view-${view}`));
  $("#view-title").textContent = titles[view] || view;
  $("#app").dataset.view = view;
}

function startPairMock() {
  const code = "LK9T-R8MG";
  $("#pair-code").textContent = code;
  $("#pair-code-wrap").classList.remove("hidden");
  $(".pair-idle")?.classList.add("hidden");
  let left = 45;
  const timer = $("#pair-timer");
  clearInterval(pairCountdown);
  const render = () => {
    const m = Math.floor(left / 60);
    const s = String(left % 60).padStart(2, "0");
    timer.textContent = `expire dans ${m}:${s}`;
  };
  render();
  pairCountdown = setInterval(() => {
    left -= 1;
    if (left <= 0) {
      clearInterval(pairCountdown);
      timer.textContent = "expiré — régénère un code";
      return;
    }
    render();
  }, 1000);
  toast("Code pairing généré (mock)");
}

function resetPair() {
  clearInterval(pairCountdown);
  $("#pair-code-wrap").classList.add("hidden");
  const idle = $(".pair-idle");
  if (idle) idle.classList.remove("hidden");
  toast("Pairing réinitialisé");
}

$("#enter-app")?.addEventListener("click", () => {
  $("#splash").classList.add("hidden");
  $("#app").classList.remove("hidden");
  applyBot(currentBot);
});

$$(".nav-item").forEach((btn) => {
  btn.addEventListener("click", () => setView(btn.dataset.view));
});

$$(".bot-chip:not([disabled])").forEach((chip) => {
  chip.addEventListener("click", () => {
    applyBot(chip.dataset.bot);
    toast(`Basculé sur ${chip.dataset.bot}`);
  });
});

$("#btn-refresh")?.addEventListener("click", () => {
  applyBot(currentBot);
  toast("Statut rafraîchi (mock)");
});

$("#btn-restart")?.addEventListener("click", () => {
  toast(`Restart demandé pour ${currentBot} (mock)`);
});

$("#toggle-active")?.addEventListener("change", (e) => {
  bots[currentBot].active = e.target.checked;
  $("#bot-state").textContent = e.target.checked ? "Actif" : "Pause";
  $("#bot-state").classList.toggle("ok", e.target.checked);
  toast(e.target.checked ? "Bot activé" : "Bot en pause");
});

["toggle-viewonly", "toggle-antidelete", "toggle-vv", "toggle-react"].forEach((id) => {
  $(`#${id}`)?.addEventListener("change", () => toast("Réglage mis à jour (mock)"));
});

$("#save-emoji")?.addEventListener("click", () => {
  toast(`Emoji fixé : ${$("#fixed-emoji").value || "—"}`);
});

$("#btn-pair")?.addEventListener("click", startPairMock);
$("#btn-pair-reset")?.addEventListener("click", resetPair);

$("#config-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const hint = $("#config-hint");
  hint.hidden = false;
  toast("Config sauvée (mock)");
  setTimeout(() => {
    hint.hidden = true;
  }, 1800);
});
