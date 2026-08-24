/* ==========================================================================
   GEAR SWAP :: who is building for whom
   --------------------------------------------------------------------------
   Draws one of the 24 permutations of the four divers. Position i in the
   permutation is the diver that diver i builds gear for, so a permutation
   with a fixed point means somebody drew themselves — all 24 are in play,
   not just the 9 derangements.

   A second wheel draws the gear scope from GEAR_SCOPES — what class of kit is
   actually being built. One scope covers the whole squad, so everybody builds
   the same sort of thing for their target.

   Both ride in the URL hash as #a=assignment.scope, so one person can roll and
   paste the link to the squad; a static site has no other way to agree on one.
   Failing that it falls back to what this browser last stored. Diver names come
   from js/names.js and are shared with The Wheel of Pain.
   ========================================================================== */

const SWAP_KEY = "goondivers.swap";

/** Every ordering of `list`, lexicographic, so #a=7 always means the same one. */
function permutations(list) {
  if (list.length <= 1) return [list];
  const out = [];
  list.forEach((item, i) => {
    const rest = list.slice(0, i).concat(list.slice(i + 1));
    for (const tail of permutations(rest)) out.push([item, ...tail]);
  });
  return out;
}

const ASSIGNMENTS = permutations([0, 1, 2, 3]);   // 24 of them
const refs = [];   // one per diver
let scopeRef = null;
let current = 0;   // index into ASSIGNMENTS
let scope = 0;     // index into GEAR_SCOPES

/* --- Which roll are we showing? ------------------------------------------- */

const inRange = (n, max) =>
  Number.isInteger(n) && n >= 0 && n < max ? n : null;

function validPair(assignment, gear) {
  const a = inRange(assignment, ASSIGNMENTS.length);
  const s = inRange(gear, GEAR_SCOPES.length);
  return a === null || s === null ? null : { assignment: a, scope: s };
}

/* A shared link has to pin down everything the squad sees, so a hash carrying
   only the assignment is rejected rather than left to roll its own scope. */
function readHashRoll() {
  const match = /^#a=(\d+)\.(\d+)$/.exec(window.location.hash || "");
  return match ? validPair(Number(match[1]) - 1, Number(match[2]) - 1) : null;
}

function readStoredRoll() {
  try {
    const raw = localStorage.getItem(SWAP_KEY);
    // Guard the empty cases: JSON.parse("") throws and a bare number is what
    // the pre-scope build wrote, neither of which is a usable roll.
    if (raw === null || raw === "") return null;
    const saved = JSON.parse(raw);
    return saved && typeof saved === "object"
      ? validPair(saved.assignment, saved.scope)
      : null;
  } catch (err) {
    return null;   // storage blocked or unreadable; a fresh roll is fine
  }
}

function storeRoll() {
  try {
    localStorage.setItem(SWAP_KEY, JSON.stringify({ assignment: current, scope }));
  } catch (err) { /* it just won't survive a reload */ }
}

/** A fresh index into `length`, never landing back on `not`. */
function randomIndex(length, not) {
  const open = Array.from({ length }, (_, i) => i).filter((i) => i !== not);
  return open[Math.floor(Math.random() * open.length)];
}

/* --- Rendering ------------------------------------------------------------ */

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

function render() {
  const order = ASSIGNMENTS[current];

  for (let i = 0; i < DIVER_COUNT; i++) {
    const target = order[i];
    const ref = refs[i];

    ref.card.style.setProperty("--target", `var(--p${target + 1})`);
    ref.target.textContent = diverName(target);
    ref.self.hidden = target !== i;
    ref.nameInput.placeholder = defaultDiverName(i);
    ref.card.setAttribute(
      "aria-label",
      target === i
        ? `${diverName(i)} builds for themselves`
        : `${diverName(i)} builds for ${diverName(target)}`
    );
  }

  scopeRef.name.textContent = GEAR_SCOPES[scope];
  scopeRef.card.setAttribute("aria-label", `Affected gear: ${GEAR_SCOPES[scope]}`);

  document.getElementById("assignment-no").textContent =
    `${String(current + 1).padStart(2, "0")} / ${ASSIGNMENTS.length}`;

  // replaceState so rerolling doesn't stack up back-button history.
  history.replaceState(null, "", `#a=${current + 1}.${scope + 1}`);
}

function reassign() {
  // The assignment refuses to land on itself, so the button always visibly
  // does something. The scope does not: with only a few options, forbidding a
  // repeat would mean the same scope could never come up twice running, which
  // is not what a wheel does.
  current = randomIndex(ASSIGNMENTS.length, current);
  scope = randomIndex(GEAR_SCOPES.length, null);
  storeRoll();
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

function buildNameInput(diverIndex) {
  const input = el("input", "diver-name");
  input.type = "text";
  input.value = diverNames[diverIndex];
  input.placeholder = defaultDiverName(diverIndex);
  input.maxLength = 22;
  input.spellcheck = false;
  input.autocomplete = "off";
  input.title = "Click to name this diver";
  input.setAttribute("aria-label", `Name for diver ${diverIndex + 1}`);

  input.addEventListener("input", () => {
    diverNames[diverIndex] = input.value;
    saveDiverNames();
    render();   // this diver may be somebody's target
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === "Escape") input.blur();
  });
  return input;
}

/** Full-width banner above the squad, since one scope covers everybody. */
function buildScopeCard() {
  const card = el("article", "diver scope-card");
  const head = el("div", "diver-head");
  head.append(el("span", "card-title", "Affected Gear"));
  card.append(head);

  const body = el("div", "swap-body");
  const name = el("div", "scope-name", "—");
  body.append(name);
  card.append(body);

  scopeRef = { card, name };
  return card;
}

function buildCard(diverIndex) {
  const card = el("article", "diver");
  const ref = { card };

  const head = el("div", "diver-head");
  ref.nameInput = buildNameInput(diverIndex);
  head.append(ref.nameInput);
  card.append(head);

  const body = el("div", "swap-body");
  body.append(el("div", "swap-caption", "Builds gear for"));
  ref.target = el("div", "swap-target", "—");
  body.append(ref.target);
  ref.self = el("div", "swap-self", "Drew themselves");
  ref.self.hidden = true;
  body.append(ref.self);
  card.append(body);

  refs.push(ref);
  return card;
}

/* --- Boot ----------------------------------------------------------------- */

function init() {
  const restored = readHashRoll() || readStoredRoll();
  if (restored) {
    current = restored.assignment;
    scope = restored.scope;
  } else {
    current = randomIndex(ASSIGNMENTS.length, null);
    scope = randomIndex(GEAR_SCOPES.length, null);
  }
  storeRoll();

  const grid = document.getElementById("grid");
  grid.append(buildScopeCard());
  for (let i = 0; i < DIVER_COUNT; i++) grid.append(buildCard(i));
  render();

  document.getElementById("reassign").addEventListener("click", reassign);
  document.getElementById("copy-link").addEventListener("click", copyLink);

  // Someone pasting a link into this tab, or renaming a diver in another one.
  window.addEventListener("hashchange", () => {
    const fromHash = readHashRoll();
    if (!fromHash) return;
    current = fromHash.assignment;
    scope = fromHash.scope;
    storeRoll();
    render();
  });

  window.addEventListener("storage", (event) => {
    if (event.key !== NAMES_KEY) return;
    reloadDiverNames();
    for (let i = 0; i < DIVER_COUNT; i++) {
      if (document.activeElement !== refs[i].nameInput) {
        refs[i].nameInput.value = diverNames[i];
      }
    }
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
