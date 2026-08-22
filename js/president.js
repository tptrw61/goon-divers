/* ==========================================================================
   MR. PRESIDENT :: custom mode roller
   --------------------------------------------------------------------------
   Four sections:
     1. VIP        — one diver.
     2. Bodyguard  — a different diver; never the VIP.
     3. Kill permission — a straight coin flip on whether the VIP may kill at
        all. When they may, one of VIP_KILL_MODIFIERS says how, all equally
        likely.
     4. Salve Nerf — switchable. When on, exactly one nerf from SALVE_NERFS
        is drawn. It is not pinned to anybody: it is a rule for the run, not a
        handicap on a named diver. Nerfs are allowed to contradict the VIP's
        kill modifier; that is the point.

   The whole roll rides in the URL hash so one person can roll and paste it to
   the squad. Both tables live in js/data.js.
   ========================================================================== */

const PRESIDENT_KEY = "goondivers.president";

const refs = {};
let roll = null;
let nerfEnabled = true;

/* --- Rolling -------------------------------------------------------------- */

const randomIndex = (length) => Math.floor(Math.random() * length);

/** A fresh everything. `how` and the nerf fields are always filled in, even
    when the coin flip or the switch means they go unshown, so that toggling
    the nerf back on never needs a second source of randomness. */
function rollEverything() {
  const vip = randomIndex(DIVER_COUNT);
  const others = Array.from({ length: DIVER_COUNT }, (_, i) => i).filter((i) => i !== vip);
  return {
    vip,
    guard:  others[randomIndex(others.length)],
    kill:   Math.random() < 0.5,
    how:    randomIndex(VIP_KILL_MODIFIERS.length),
    nerf:   randomIndex(SALVE_NERFS.length),
  };
}

/* --- Share link ----------------------------------------------------------- */

/* #r=vip.guard.kill.how.nerfOn.nerf — divers 1-based, flags 0/1, table
   positions 0-based. Links minted before the nerf stopped naming a diver
   carried a seventh field; those no longer parse and are rerolled. */

function validRoll(candidate) {
  const index = (n, max) => Number.isInteger(n) && n >= 0 && n < max;
  const flag  = (n) => n === 0 || n === 1;
  const ok =
    index(candidate.vip, DIVER_COUNT) &&
    index(candidate.guard, DIVER_COUNT) && candidate.guard !== candidate.vip &&
    index(candidate.how, VIP_KILL_MODIFIERS.length) &&
    index(candidate.nerf, SALVE_NERFS.length) &&
    flag(candidate.killFlag) && flag(candidate.nerfFlag);
  if (!ok) return null;
  return {
    state: {
      vip: candidate.vip, guard: candidate.guard, kill: candidate.killFlag === 1,
      how: candidate.how, nerf: candidate.nerf,
    },
    nerfOn: candidate.nerfFlag === 1,
  };
}

function readHash() {
  const match = /^#r=(\d+(?:\.\d+){5})$/.exec(window.location.hash || "");
  if (!match) return null;
  const [vip, guard, killFlag, how, nerfFlag, nerf] = match[1].split(".").map(Number);
  return validRoll({ vip: vip - 1, guard: guard - 1, killFlag, how, nerfFlag, nerf });
}

function writeHash() {
  const parts = [
    roll.vip + 1, roll.guard + 1, roll.kill ? 1 : 0, roll.how,
    nerfEnabled ? 1 : 0, roll.nerf,
  ];
  // replaceState so rerolling doesn't pile up back-button history.
  history.replaceState(null, "", `#r=${parts.join(".")}`);
}

/* --- Storage -------------------------------------------------------------- */

function readStored() {
  try {
    const raw = localStorage.getItem(PRESIDENT_KEY);
    if (raw === null || raw === "") return null;   // Number("") is 0; JSON of "" throws
    const saved = JSON.parse(raw);
    return validRoll({
      vip: saved.vip, guard: saved.guard, killFlag: saved.kill ? 1 : 0,
      how: saved.how, nerfFlag: saved.nerfOn ? 1 : 0,
      nerf: saved.nerf,
    });
  } catch (err) {
    return null;   // unreadable or stale against a changed table; roll fresh
  }
}

function store() {
  try {
    localStorage.setItem(PRESIDENT_KEY, JSON.stringify({ ...roll, nerfOn: nerfEnabled }));
  } catch (err) { /* it just won't survive a reload */ }
}

/* --- Rendering ------------------------------------------------------------ */

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

const colorFor = (diverIndex) => `var(--p${diverIndex + 1})`;

function render() {
  for (const role of ["vip", "guard"]) {
    const ref = refs[role];
    const diver = roll[role];
    ref.card.style.setProperty("--diver", colorFor(diver));
    ref.name.placeholder = defaultDiverName(diver);
    if (document.activeElement !== ref.name) ref.name.value = diverNames[diver];
    ref.name.setAttribute("aria-label", `Name for diver ${diver + 1}`);
  }

  refs.kill.verdict.textContent = roll.kill ? "May kill" : "May not kill";
  refs.kill.verdict.classList.toggle("is-denied", !roll.kill);
  refs.kill.howWrap.hidden = !roll.kill;
  refs.kill.how.textContent = VIP_KILL_MODIFIERS[roll.how];
  refs.kill.card.setAttribute(
    "aria-label",
    roll.kill
      ? `The VIP may kill: ${VIP_KILL_MODIFIERS[roll.how]}`
      : "The VIP may not kill"
  );

  refs.nerf.toggle.textContent = nerfEnabled ? "On" : "Off";
  refs.nerf.toggle.setAttribute("aria-pressed", String(nerfEnabled));
  refs.nerf.on.hidden = !nerfEnabled;
  refs.nerf.off.hidden = nerfEnabled;
  if (nerfEnabled) {
    refs.nerf.name.textContent = SALVE_NERFS[roll.nerf];
    refs.nerf.card.setAttribute("aria-label", `Salve nerf: ${SALVE_NERFS[roll.nerf]}`);
  } else {
    refs.nerf.card.setAttribute("aria-label", "Salve nerf switched off");
  }

  writeHash();
}

/* --- Actions -------------------------------------------------------------- */

function reroll() {
  roll = rollEverything();
  store();
  render();
}

/** Toggling the nerf back on shows the nerf already rolled, so flipping the
    switch never quietly rerolls the rest of the run. */
function toggleNerf() {
  nerfEnabled = !nerfEnabled;
  store();
  render();
}

async function copyLink() {
  const note = document.getElementById("copy-note");
  try {
    await navigator.clipboard.writeText(window.location.href);
    note.textContent = "Link copied";
  } catch (err) {
    note.textContent = "Copy blocked — the link is in the address bar";
  }
}

/* --- Cards ---------------------------------------------------------------- */

function buildCard(title) {
  const card = el("article", "diver");
  const head = el("div", "diver-head");
  head.append(el("span", "card-title", title));
  card.append(head);
  const body = el("div", "pres-body");
  card.append(body);
  return { card, head, body };
}

/** The name shown for a role is that diver's shared name, editable in place. */
function buildRoleCard(role, title) {
  const { card, body } = buildCard(title);

  const input = el("input", "pres-name");
  input.type = "text";
  input.maxLength = 22;
  input.spellcheck = false;
  input.autocomplete = "off";
  input.title = "Click to rename this diver";
  input.addEventListener("input", () => {
    // Nothing else on this page shows the name, so saving is the whole job;
    // the input already holds what the visitor typed.
    diverNames[roll[role]] = input.value;
    saveDiverNames();
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === "Escape") input.blur();
  });

  body.append(input);
  refs[role] = { card, name: input };
  return card;
}

function buildKillCard() {
  const { card, body } = buildCard("Kill Permission");
  card.style.setProperty("--diver", "var(--se-yellow)");

  body.append(el("div", "pres-caption", "The VIP"));
  const verdict = el("div", "pres-verdict", "—");
  body.append(verdict);

  const howWrap = el("div", "pres-sub");
  howWrap.append(el("div", "pres-caption", "How"));
  const how = el("div", "pres-detail", "—");
  howWrap.append(how);
  body.append(howWrap);

  refs.kill = { card, verdict, howWrap, how };
  return card;
}

function buildNerfCard() {
  const { card, head, body } = buildCard("Salve Nerf");
  card.style.setProperty("--diver", "var(--se-yellow)");

  const toggle = el("button", "toggle", "On");
  toggle.type = "button";
  toggle.title = "Switch the salve nerf on or off";
  toggle.setAttribute("aria-label", "Salve nerf");
  toggle.addEventListener("click", toggleNerf);
  head.append(toggle);

  const on = el("div", "pres-sub");
  const name = el("div", "pres-nerf", "—");
  on.append(name);
  body.append(on);

  const off = el("div", "pres-off", "No nerf this run");
  body.append(off);

  refs.nerf = { card, toggle, on, off, name };
  return card;
}

/* --- Boot ----------------------------------------------------------------- */

function init() {
  const restored = readHash() || readStored();
  if (restored) {
    roll = restored.state;
    nerfEnabled = restored.nerfOn;
  } else {
    roll = rollEverything();
  }
  store();

  const grid = document.getElementById("grid");
  grid.append(
    buildRoleCard("vip", "VIP"),
    buildRoleCard("guard", "Bodyguard"),
    buildKillCard(),
    buildNerfCard()
  );
  render();

  document.getElementById("reroll").addEventListener("click", reroll);
  document.getElementById("copy-link").addEventListener("click", copyLink);

  window.addEventListener("hashchange", () => {
    const fromHash = readHash();
    if (!fromHash) return;
    roll = fromHash.state;
    nerfEnabled = fromHash.nerfOn;
    store();
    render();
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== NAMES_KEY) return;
    reloadDiverNames();
    render();
  });
}

/* A stale cached script is the realistic failure mode here: a browser can hold
   an old js/data.js for up to ten minutes after a deploy, and the page would
   otherwise sit there blank with dead buttons. Say so out loud instead. Each
   page keeps its own copy so the handler survives a stale sibling script. */
function bootFailure(err) {
  console.error(err);
  const grid = document.getElementById("grid");
  if (!grid) return;
  grid.textContent = "";
  const box = document.createElement("div");
  box.className = "boot-error";
  box.textContent =
    "This page failed to start, usually because the browser is holding an " +
    "outdated copy of a script. Reload with Ctrl+Shift+R (Cmd+Shift+R on a Mac).";
  grid.append(box);
}

document.addEventListener("DOMContentLoaded", () => {
  try {
    init();
  } catch (err) {
    bootFailure(err);
  }
});
