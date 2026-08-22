/* ==========================================================================
   DIVER NAMES :: shared across every page
   --------------------------------------------------------------------------
   localStorage is scoped to the site origin rather than to a single HTML file,
   so a name typed on The Wheel of Pain is readable from Mr. President and Gear
   Swap without any extra plumbing. Load this script on any page that needs the
   roster and use diverName(i) to read it.

   Storage is guarded everywhere: the accessor itself throws in some
   locked-down browsers, and an empty roster is a normal, working state.
   ========================================================================== */

const DIVER_COUNT = 4;
const NAMES_KEY   = "goondivers.names";

function readStoredNames() {
  try {
    const parsed = JSON.parse(localStorage.getItem(NAMES_KEY) || "[]");
    if (Array.isArray(parsed)) {
      return Array.from({ length: DIVER_COUNT }, (_, i) => String(parsed[i] || ""));
    }
  } catch (err) { /* nothing readable; fall through to blanks */ }
  return Array(DIVER_COUNT).fill("");
}

/** Live roster. Mutate in place, then call saveDiverNames(). */
const diverNames = readStoredNames();

function saveDiverNames() {
  try {
    localStorage.setItem(NAMES_KEY, JSON.stringify(diverNames));
  } catch (err) { /* names won't persist; every page still works */ }
}

/** Refresh from storage — used when another tab edits the roster. */
function reloadDiverNames() {
  const stored = readStoredNames();
  for (let i = 0; i < DIVER_COUNT; i++) diverNames[i] = stored[i];
}

const defaultDiverName = (i) => `Diver ${String(i + 1).padStart(2, "0")}`;

/** The name to show for diver `i`: whatever was typed, else the default. */
const diverName = (i) => diverNames[i].trim() || defaultDiverName(i);
