/* ==========================================================================
   MR. PRESIDENT :: custom mode roller
   --------------------------------------------------------------------------
   Four sections:
     1. VIP        — one diver.
     2. Bodyguard  — a different diver; never the VIP.
     3. Kill permission — a one-in-three chance the VIP may not kill at
        all. When they may, one of VIP_KILL_MODIFIERS says how, all equally
        likely.
     4. Salve Nerf — switchable. When on, exactly one nerf from SALVE_NERFS
        is drawn. A second switch, Target, decides whether it is pinned to a
        diver: off, it is a rule for the whole run; on, a further draw picks
        one of the four divers to carry it, free to be the VIP or the
        bodyguard. Nerfs are allowed to contradict the VIP's kill modifier;
        that is the point.

   Each group rerolls on its own: VIP and Bodyguard together, Kill Permission
   and its modifier together, the nerf, and the nerf's target.

   The whole roll rides in the URL hash so one person can roll and paste it to
   the squad. Both tables live in js/data.js.
   ========================================================================== */

const PRESIDENT_KEY = "goondivers.president";

const refs = {};
let roll = null;
let nerfEnabled = true;
let targetEnabled = false;

/* --- Rolling -------------------------------------------------------------- */

const randomIndex = (length) => Math.floor(Math.random() * length);

/** A fresh everything. `how` and the nerf fields are always filled in, even
    when the kill roll or the switch means they go unshown, so that toggling
    the nerf back on never needs a second source of randomness. */
function rollEverything() {
  const vip = randomIndex(DIVER_COUNT);
  const others = Array.from({ length: DIVER_COUNT }, (_, i) => i).filter((i) => i !== vip);
  return {
    vip,
    guard:  others[randomIndex(others.length)],
    kill:   Math.random() >= 1 / 3,   // 1 in 3 to be denied
    how:    randomIndex(VIP_KILL_MODIFIERS.length),
    nerf:   randomIndex(SALVE_NERFS.length),
    target: randomIndex(DIVER_COUNT),
  };
}

/* --- Share link ----------------------------------------------------------- */

/* #r=vip.guard.kill.how.nerfOn.nerf[.targetOn.target] — divers 1-based, flags
   0/1, table positions 0-based. The last two fields are optional: a link
   without them has the target switch off. A link with only one of them does
   not parse and is rerolled. */

function validRoll(candidate) {
  const index = (n, max) => Number.isInteger(n) && n >= 0 && n < max;
  const flag  = (n) => n === 0 || n === 1;
  const ok =
    index(candidate.vip, DIVER_COUNT) &&
    index(candidate.guard, DIVER_COUNT) && candidate.guard !== candidate.vip &&
    index(candidate.how, VIP_KILL_MODIFIERS.length) &&
    index(candidate.nerf, SALVE_NERFS.length) &&
    index(candidate.target, DIVER_COUNT) &&
    flag(candidate.killFlag) && flag(candidate.nerfFlag) && flag(candidate.targetFlag);
  if (!ok) return null;
  return {
    state: {
      vip: candidate.vip, guard: candidate.guard, kill: candidate.killFlag === 1,
      how: candidate.how, nerf: candidate.nerf, target: candidate.target,
    },
    nerfOn: candidate.nerfFlag === 1,
    targetOn: candidate.targetFlag === 1,
  };
}

function readHash() {
  const match = /^#r=(\d+(?:\.\d+){5}(?:\.\d+\.\d+)?)$/.exec(window.location.hash || "");
  if (!match) return null;
  const [vip, guard, killFlag, how, nerfFlag, nerf, targetFlag = 0, target = 1] =
    match[1].split(".").map(Number);
  return validRoll({ vip: vip - 1, guard: guard - 1, killFlag, how, nerfFlag, nerf,
                     targetFlag, target: target - 1 });
}

function writeHash() {
  const parts = [
    roll.vip + 1, roll.guard + 1, roll.kill ? 1 : 0, roll.how,
    nerfEnabled ? 1 : 0, roll.nerf, targetEnabled ? 1 : 0, roll.target + 1,
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
      nerf: saved.nerf, targetFlag: saved.targetOn ? 1 : 0,
      target: saved.target === undefined ? 0 : saved.target,
    });
  } catch (err) {
    return null;   // unreadable or stale against a changed table; roll fresh
  }
}

function store() {
  try {
    localStorage.setItem(PRESIDENT_KEY, JSON.stringify({ ...roll, nerfOn: nerfEnabled, targetOn: targetEnabled }));
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
  refs.nerf.targetToggle.hidden = !nerfEnabled;
  refs.nerf.targetToggle.textContent = targetEnabled ? "Target On" : "Target Off";
  refs.nerf.targetToggle.setAttribute("aria-pressed", String(targetEnabled));
  refs.nerf.targetWrap.hidden = !targetEnabled;

  // Colour means "this is about that diver", so the card only takes a squad
  // colour while it is actually pinned to one.
  const pinned = nerfEnabled && targetEnabled;
  refs.nerf.card.style.setProperty("--diver", pinned ? colorFor(roll.target) : "var(--se-yellow)");

  if (nerfEnabled) {
    refs.nerf.name.textContent = SALVE_NERFS[roll.nerf];
    refs.nerf.target.textContent = diverName(roll.target);
    refs.nerf.card.setAttribute(
      "aria-label",
      targetEnabled
        ? `Salve nerf: ${SALVE_NERFS[roll.nerf]}, on ${diverName(roll.target)}`
        : `Salve nerf: ${SALVE_NERFS[roll.nerf]}`
    );
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

/** Redraw until the part of the roll the squad can see has changed, so a
    reroll button always visibly does something. With a one-option table there
    is nothing else to land on, so it gives up after a few tries. */
function rerollUntilChanged(draw, visibleKey) {
  const before = visibleKey(roll);
  for (let attempt = 0; attempt < 50; attempt++) {
    Object.assign(roll, draw());
    if (visibleKey(roll) !== before) break;
  }
  store();
  render();
}

function rerollDetail() {
  rerollUntilChanged(
    () => {
      const { vip, guard } = rollEverything();
      return { vip, guard };
    },
    (r) => `${r.vip}.${r.guard}`
  );
}

function rerollKill() {
  rerollUntilChanged(
    () => {
      const { kill, how } = rollEverything();
      return { kill, how };
    },
    (r) => (r.kill ? `1.${r.how}` : "0")   // the modifier is hidden on a no
  );
}

function rerollNerf() {
  rerollUntilChanged(() => ({ nerf: randomIndex(SALVE_NERFS.length) }), (r) => r.nerf);
}

function rerollTarget() {
  rerollUntilChanged(() => ({ target: randomIndex(DIVER_COUNT) }), (r) => r.target);
}

function toggleTarget() {
  targetEnabled = !targetEnabled;
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

function buildRerollButton(label, onClick) {
  const btn = el("button", "icon-btn", "⟳");
  btn.type = "button";
  btn.title = label;
  btn.setAttribute("aria-label", label);
  btn.addEventListener("click", onClick);
  return btn;
}

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
  const { card, head, body } = buildCard(title);

  const input = el("input", "pres-name");
  input.type = "text";
  input.maxLength = 22;
  input.spellcheck = false;
  input.autocomplete = "off";
  input.title = "Click to rename this diver";
  input.addEventListener("input", () => {
    diverNames[roll[role]] = input.value;
    saveDiverNames();
    render();   // this diver may also be the nerf target
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === "Escape") input.blur();
  });

  body.append(input);
  head.append(buildRerollButton("Reroll the VIP and Bodyguard", rerollDetail));
  refs[role] = { card, name: input };
  return card;
}

function buildKillCard() {
  const { card, head, body } = buildCard("Kill Permission");
  card.style.setProperty("--diver", "var(--se-yellow)");
  head.append(buildRerollButton("Reroll the kill permission and its modifier", rerollKill));

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

  const targetToggle = el("button", "toggle", "Target Off");
  targetToggle.type = "button";
  targetToggle.title = "Switch rolling a diver for the nerf on or off";
  targetToggle.addEventListener("click", toggleTarget);
  head.append(targetToggle, toggle);

  const on = el("div", "pres-sub");
  const nerfRow = el("div", "pres-row");
  const name = el("div", "pres-nerf", "—");
  nerfRow.append(name, buildRerollButton("Reroll the salve nerf", rerollNerf));
  on.append(nerfRow);

  const targetWrap = el("div", "pres-sub");
  targetWrap.append(el("div", "pres-caption", "Lands on"));
  const targetRow = el("div", "pres-row");
  const target = el("div", "pres-nerf", "—");
  targetRow.append(target, buildRerollButton("Reroll which diver gets the nerf", rerollTarget));
  targetWrap.append(targetRow);
  on.append(targetWrap);
  body.append(on);

  const off = el("div", "pres-off", "No nerf this run");
  body.append(off);

  refs.nerf = { card, toggle, targetToggle, on, off, name, targetWrap, target };
  return card;
}

/* --- Boot ----------------------------------------------------------------- */

function init() {
  const restored = readHash() || readStored();
  if (restored) {
    roll = restored.state;
    nerfEnabled = restored.nerfOn;
    targetEnabled = restored.targetOn;
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
    targetEnabled = fromHash.targetOn;
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
