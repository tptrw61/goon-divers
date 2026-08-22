/* ==========================================================================
   THE WHEEL OF PAIN :: loadout roller
   --------------------------------------------------------------------------
   Rules of engagement, as specified:
     - Completely random. No themes, no synergy, no mercy.
     - No enforcement of in-game slot rules: two backpacks is a valid roll and
       an entirely deserved outcome.
     - A stratagem cannot repeat WITHIN one diver's four.
     - Stratagems CAN repeat across divers; each diver is rolled on its own.
     - Any item can be rerolled on its own without disturbing the rest.
   Diver names are typed straight into the card header and live in
   js/names.js, shared with every other page on the site.
   ========================================================================== */

const STRAT_COUNT = 4;

const GROUP_LABEL = {
  orbital:     "Orbital",
  eagle:       "Eagle",
  support:     "Support Weapon",
  backpack:    "Backpack",
  vehicle:     "Vehicle",
  sentry:      "Sentry",
  emplacement: "Emplacement",
};

/* Kit slots below the stratagems, in card order. */
const KIT_SLOTS = [
  { key: "primary",   label: "Primary",   pool: PRIMARIES   },
  { key: "secondary", label: "Secondary", pool: SECONDARIES },
  { key: "grenade",   label: "Grenade",   pool: GRENADES    },
  { key: "booster",   label: "Booster",   pool: BOOSTERS    },
];

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* --- Rolling -------------------------------------------------------------- */

/** Pick one entry from `pool`, skipping any whose name is in `exclude`. */
function pick(pool, exclude = []) {
  const open = pool.filter((entry) => !exclude.includes(entry[0]));
  const from = open.length ? open : pool;
  return from[Math.floor(Math.random() * from.length)];
}

function rollStratagems() {
  const chosen = [];
  for (let i = 0; i < STRAT_COUNT; i++) {
    chosen.push(pick(STRATAGEMS, chosen.map((s) => s[0])));
  }
  return chosen;
}

function rollDiver() {
  const diver = { stratagems: rollStratagems() };
  for (const slot of KIT_SLOTS) diver[slot.key] = pick(slot.pool);
  return diver;
}

/* --- Rendering ------------------------------------------------------------ */

const state = [];   // one entry per diver
const refs  = [];   // { card, nameInput, stratagems: [row], primary: row, ... }

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text !== undefined) node.textContent = text;
  return node;
}

/**
 * Spin a slot's text through random names before landing on `entry`.
 * Reduced-motion visitors just get the result.
 */
function settle(nameEl, pool, entry, spinMs = 380) {
  if (reduceMotion) {
    nameEl.textContent = entry[0];
    return;
  }
  const started = performance.now();
  nameEl.classList.add("rolling");
  (function tick() {
    if (performance.now() - started < spinMs) {
      nameEl.textContent = pool[Math.floor(Math.random() * pool.length)][0];
      setTimeout(tick, 45);
    } else {
      nameEl.textContent = entry[0];
      nameEl.classList.remove("rolling");
    }
  })();
}

/** Push one slot's current state into the DOM, with the spin animation. */
function paintSlot(diverIndex, slotKey, stratIndex) {
  const diver = state[diverIndex];
  const ref   = refs[diverIndex];

  if (slotKey === "stratagem") {
    const entry = diver.stratagems[stratIndex];
    const row   = ref.stratagems[stratIndex];
    row.kind.textContent = GROUP_LABEL[entry[1]] || "Stratagem";
    row.wrap.style.setProperty("--tag", `var(--g-${entry[1]})`);
    settle(row.name, STRATAGEMS, entry);
  } else {
    const slot  = KIT_SLOTS.find((s) => s.key === slotKey);
    const entry = diver[slotKey];
    const row   = ref[slotKey];
    row.kind.textContent = `${slot.label} · ${entry[1]}`;
    settle(row.name, slot.pool, entry);
  }
}

function paintDiver(diverIndex) {
  for (let i = 0; i < STRAT_COUNT; i++) paintSlot(diverIndex, "stratagem", i);
  for (const slot of KIT_SLOTS) paintSlot(diverIndex, slot.key);
}

/* The card is the labelled region, so the reroll buttons inside it can keep
   short labels and still read unambiguously once a diver has been named. */
function labelCard(diverIndex) {
  refs[diverIndex].card.setAttribute("aria-label", `${diverName(diverIndex)} loadout`);
}

/* --- Reroll actions ------------------------------------------------------- */

function rerollStratagem(diverIndex, stratIndex) {
  const strats = state[diverIndex].stratagems;
  // Block the other three so we stay unique, and the current one so the
  // button always visibly does something.
  const taken = strats.map((s) => s[0]);
  strats[stratIndex] = pick(STRATAGEMS, taken);
  paintSlot(diverIndex, "stratagem", stratIndex);
}

function rerollKit(diverIndex, slotKey) {
  const slot = KIT_SLOTS.find((s) => s.key === slotKey);
  state[diverIndex][slotKey] = pick(slot.pool, [state[diverIndex][slotKey][0]]);
  paintSlot(diverIndex, slotKey);
}

function rerollDiver(diverIndex) {
  state[diverIndex] = rollDiver();
  paintDiver(diverIndex);
}

function rerollAll() {
  for (let i = 0; i < DIVER_COUNT; i++) rerollDiver(i);
}

/** Wipe the typed names and fall back to Diver 01…04. Loadouts are untouched. */
function clearNames() {
  for (let i = 0; i < DIVER_COUNT; i++) {
    diverNames[i] = "";
    refs[i].nameInput.value = "";
    labelCard(i);
  }
  saveDiverNames();
}

/* --- Card construction (runs once) ---------------------------------------- */

function buildSlotRow(kindText, onReroll, ariaLabel) {
  const wrap = el("div", "slot");
  const bar  = el("span", "slot-bar");
  const body = el("div", "slot-body");
  const kind = el("div", "slot-kind", kindText);
  const name = el("div", "slot-name", "—");
  const btn  = el("button", "icon-btn", "⟳");

  btn.type = "button";
  btn.title = ariaLabel;
  btn.setAttribute("aria-label", ariaLabel);
  btn.addEventListener("click", onReroll);

  body.append(kind, name);
  wrap.append(bar, body, btn);
  return { wrap, kind, name };
}

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
    labelCard(diverIndex);
    saveDiverNames();
  });
  input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === "Escape") input.blur();
  });

  return input;
}

function buildDiverCard(diverIndex) {
  const card = el("article", "diver");
  const ref  = { card, stratagems: [] };

  const head = el("div", "diver-head");
  ref.nameInput = buildNameInput(diverIndex);
  head.append(ref.nameInput);

  const headBtn = el("button", "icon-btn", "⟳");
  headBtn.type = "button";
  headBtn.title = "Reroll this entire loadout";
  headBtn.setAttribute("aria-label", "Reroll this entire loadout");
  headBtn.addEventListener("click", () => rerollDiver(diverIndex));
  head.append(headBtn);
  card.append(head);

  card.append(el("div", "section-label", "Stratagems"));
  for (let i = 0; i < STRAT_COUNT; i++) {
    const row = buildSlotRow(
      "Stratagem",
      () => rerollStratagem(diverIndex, i),
      `Reroll stratagem ${i + 1}`
    );
    ref.stratagems.push(row);
    card.append(row.wrap);
  }

  card.append(el("div", "divider"));
  card.append(el("div", "section-label", "Kit"));
  for (const slot of KIT_SLOTS) {
    const row = buildSlotRow(
      slot.label,
      () => rerollKit(diverIndex, slot.key),
      `Reroll ${slot.label.toLowerCase()}`
    );
    ref[slot.key] = row;
    card.append(row.wrap);
  }

  refs.push(ref);
  return card;
}

/* --- Boot ----------------------------------------------------------------- */

function init() {
  const grid = document.getElementById("grid");
  for (let i = 0; i < DIVER_COUNT; i++) {
    state.push(rollDiver());
    grid.append(buildDiverCard(i));
  }
  for (let i = 0; i < DIVER_COUNT; i++) {
    labelCard(i);
    paintDiver(i);
  }

  document.getElementById("reroll-all").addEventListener("click", rerollAll);
  document.getElementById("clear-names").addEventListener("click", clearNames);

  // Another tab (or another page of the site) may rename a diver while this
  // one is open; storage events only fire in the tabs that did not write.
  window.addEventListener("storage", (event) => {
    if (event.key !== NAMES_KEY) return;
    reloadDiverNames();
    for (let i = 0; i < DIVER_COUNT; i++) {
      if (document.activeElement !== refs[i].nameInput) {
        refs[i].nameInput.value = diverNames[i];
      }
      labelCard(i);
    }
  });

  document.getElementById("pool-count").textContent =
    `${STRATAGEMS.length} stratagems · ${PRIMARIES.length} primaries · ` +
    `${SECONDARIES.length} secondaries · ${GRENADES.length} grenades · ` +
    `${BOOSTERS.length} boosters`;
}

document.addEventListener("DOMContentLoaded", init);
