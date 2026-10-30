/* ==========================================================================
   THE WHEEL OF PAIN :: loadout roller
   --------------------------------------------------------------------------
   Rules of engagement, as specified:
     - Completely random. No themes, no synergy, no mercy.
     - No enforcement of in-game slot rules: two backpacks is a valid roll and
       an entirely deserved outcome.
     - A stratagem cannot repeat WITHIN one diver's four.
     - Stratagems CAN repeat across divers; each diver is rolled on its own.
     - Boosters are the ONE exception: they do not stack, so no two divers
       are ever handed the same one.
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

/* Warbonds each diver has switched off, one Set per diver. Only items listed
   in WARBOND_ITEMS can be filtered out: base kit, Super Store items and the
   Super Citizen's Edition Knight are never in a warbond, so they always roll.
   Mobilize is left out of the toggle list, so it can never be disabled. */
const disabledWarbonds = Array.from({ length: DIVER_COUNT }, () => new Set());
const TOGGLE_WARBONDS = Object.keys(WARBOND_ITEMS).filter((w) => w !== MOBILIZE);

/** Pick one entry from `pool`, skipping any whose name is in `exclude` and
 *  any from a warbond the given diver has switched off. */
function pick(pool, exclude = [], diverIndex) {
  const off = disabledWarbonds[diverIndex];
  const allowed = off && off.size
    ? pool.filter((entry) => !off.has(WARBOND_OF[entry[0]]))
    : pool;
  const open = allowed.filter((entry) => !exclude.includes(entry[0]));
  const from = open.length ? open : allowed;
  return from[Math.floor(Math.random() * from.length)];
}

function rollStratagems(diverIndex) {
  const chosen = [];
  for (let i = 0; i < STRAT_COUNT; i++) {
    chosen.push(pick(STRATAGEMS, chosen.map((s) => s[0]), diverIndex));
  }
  return chosen;
}

/** Booster names held by every diver except `exceptIndex`. */
function squadBoosters(exceptIndex) {
  return state.reduce((taken, diver, i) => {
    if (i !== exceptIndex) taken.push(diver.booster[0]);
    return taken;
  }, []);
}

function rollDiver(diverIndex, takenBoosters = []) {
  const diver = { stratagems: rollStratagems(diverIndex) };
  for (const slot of KIT_SLOTS) {
    diver[slot.key] = pick(slot.pool, slot.key === "booster" ? takenBoosters : [], diverIndex);
  }
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
 * Spin a slot through random entries before landing on `entry`. `show` paints
 * everything that belongs to an entry (name, kind, note, colour), so the whole
 * row spins together rather than just the name. Reduced-motion visitors just
 * get the result.
 */
function settle(nameEl, pool, entry, show, spinMs = 380) {
  if (reduceMotion) {
    show(entry);
    return;
  }
  const started = performance.now();
  nameEl.classList.add("rolling");
  (function tick() {
    if (performance.now() - started < spinMs) {
      show(pool[Math.floor(Math.random() * pool.length)]);
      setTimeout(tick, 45);
    } else {
      show(entry);
      nameEl.classList.remove("rolling");
    }
  })();
}

/** Fill a slot's origin note; Super Store items get the blue treatment. */
function paintNote(noteEl, name) {
  const origin = originNote(name);
  noteEl.textContent = origin ? origin.text : "";
  noteEl.classList.toggle("store", Boolean(origin && origin.store));
}

/** Push one slot's current state into the DOM, with the spin animation. */
function paintSlot(diverIndex, slotKey, stratIndex) {
  const diver = state[diverIndex];
  const ref   = refs[diverIndex];

  if (slotKey === "stratagem") {
    const entry = diver.stratagems[stratIndex];
    const row   = ref.stratagems[stratIndex];
    settle(row.name, STRATAGEMS, entry, (e) => {
      row.kind.textContent = GROUP_LABEL[e[1]] || "Stratagem";
      row.wrap.style.setProperty("--tag", `var(--g-${e[1]})`);
      row.name.textContent = e[0];
      paintNote(row.note, e[0]);
    });
  } else {
    const slot  = KIT_SLOTS.find((s) => s.key === slotKey);
    const entry = diver[slotKey];
    const row   = ref[slotKey];
    settle(row.name, slot.pool, entry, (e) => {
      row.kind.textContent = `${slot.label} · ${e[1]}`;
      row.name.textContent = e[0];
      paintNote(row.note, e[0]);
    });
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
  strats[stratIndex] = pick(STRATAGEMS, taken, diverIndex);
  paintSlot(diverIndex, "stratagem", stratIndex);
}

function rerollKit(diverIndex, slotKey) {
  const slot = KIT_SLOTS.find((s) => s.key === slotKey);
  // Always block the current pick so the button visibly does something, and
  // for boosters block the rest of the squad's too.
  const blocked = [state[diverIndex][slotKey][0]];
  if (slotKey === "booster") blocked.push(...squadBoosters(diverIndex));
  state[diverIndex][slotKey] = pick(slot.pool, blocked, diverIndex);
  paintSlot(diverIndex, slotKey);
}

function rerollDiver(diverIndex) {
  // The other three keep their boosters, so rolling against them one diver at
  // a time keeps the squad unique however the rerolls are sequenced.
  state[diverIndex] = rollDiver(diverIndex, squadBoosters(diverIndex));
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
  const note = el("div", "slot-note");
  const btn  = el("button", "icon-btn", "⟳");

  btn.type = "button";
  btn.title = ariaLabel;
  btn.setAttribute("aria-label", ariaLabel);
  btn.addEventListener("click", onReroll);

  body.append(kind, name, note);
  wrap.append(bar, body, btn);
  return { wrap, kind, name, note };
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

/** Collapsed-by-default list of warbond checkboxes for one diver. */
function buildWarbondToggles(diverIndex) {
  const off = disabledWarbonds[diverIndex];
  const box = el("details", "wb-toggles");
  const summary = el("summary");
  const list = el("div", "wb-list");
  const checks = new Map();

  const refreshSummary = () => {
    summary.textContent =
      `Warbonds · ${TOGGLE_WARBONDS.length - off.size}/${TOGGLE_WARBONDS.length}`;
  };

  for (const name of TOGGLE_WARBONDS) {
    const label = el("label", "wb-item");
    const check = el("input");
    check.type = "checkbox";
    check.checked = true;
    check.addEventListener("change", () => {
      if (check.checked) off.delete(name); else off.add(name);
      refreshSummary();
    });
    checks.set(name, check);
    label.append(check, el("span", "", name));
    list.append(label);
  }

  const setAll = (on) => {
    for (const [name, check] of checks) {
      check.checked = on;
      if (on) off.delete(name); else off.add(name);
    }
    refreshSummary();
  };
  const actions = el("div", "wb-actions");
  for (const [text, on] of [["All", true], ["None", false]]) {
    const btn = el("button", "wb-link", text);
    btn.type = "button";
    btn.addEventListener("click", () => setAll(on));
    actions.append(btn);
  }

  refreshSummary();
  box.append(summary, actions, list);
  return box;
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

  card.append(buildWarbondToggles(diverIndex));

  refs.push(ref);
  return card;
}

/* --- Boot ----------------------------------------------------------------- */

function init() {
  const grid = document.getElementById("grid");
  for (let i = 0; i < DIVER_COUNT; i++) {
    state.push(rollDiver(i, state.map((diver) => diver.booster[0])));
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
