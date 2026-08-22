/* ==========================================================================
   GEAR SWAP :: who is building for whom
   --------------------------------------------------------------------------
   Draws one of the 24 permutations of the four divers. Position i in the
   permutation is the diver that diver i builds gear for, so a permutation
   with a fixed point means somebody drew themselves — all 24 are in play,
   not just the 9 derangements.

   The chosen assignment rides in the URL hash (#a=1..24) so one person can
   roll it and paste the link to the squad; a static site has no other way to
   agree on one. Failing that it falls back to what this browser last stored.
   Diver names come from js/names.js and are shared with The Wheel of Pain.
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
const refs = [];
let current = 0;

/* --- Which assignment are we showing? ------------------------------------- */

function inRange(n) {
  return Number.isInteger(n) && n >= 0 && n < ASSIGNMENTS.length ? n : null;
}

function readHashIndex() {
  const match = /^#a=(\d+)$/.exec(window.location.hash || "");
  return match ? inRange(Number(match[1]) - 1) : null;
}

function readStoredIndex() {
  try {
    const raw = localStorage.getItem(SWAP_KEY);
    // Guard the empty cases first: Number(null) and Number("") are both 0,
    // which is a valid index, so a first visit would never roll at random.
    return raw === null || raw === "" ? null : inRange(Number(raw));
  } catch (err) {
    return null;   // storage blocked; a fresh roll is fine
  }
}

function storeIndex(index) {
  try {
    localStorage.setItem(SWAP_KEY, String(index));
  } catch (err) { /* it just won't survive a reload */ }
}

function randomIndex(not) {
  const open = ASSIGNMENTS.map((_, i) => i).filter((i) => i !== not);
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

  document.getElementById("assignment-no").textContent =
    `${String(current + 1).padStart(2, "0")} / ${ASSIGNMENTS.length}`;

  // replaceState so rerolling doesn't stack up back-button history.
  history.replaceState(null, "", `#a=${current + 1}`);
}

function reassign() {
  current = randomIndex(current);
  storeIndex(current);
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
  const fromHash = readHashIndex();
  const stored   = readStoredIndex();
  current = fromHash !== null ? fromHash
          : stored   !== null ? stored
          : randomIndex(null);
  storeIndex(current);

  const grid = document.getElementById("grid");
  for (let i = 0; i < DIVER_COUNT; i++) grid.append(buildCard(i));
  render();

  document.getElementById("reassign").addEventListener("click", reassign);
  document.getElementById("copy-link").addEventListener("click", copyLink);

  // Someone pasting a link into this tab, or renaming a diver in another one.
  window.addEventListener("hashchange", () => {
    const index = readHashIndex();
    if (index !== null && index !== current) {
      current = index;
      storeIndex(current);
      render();
    }
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

document.addEventListener("DOMContentLoaded", init);
