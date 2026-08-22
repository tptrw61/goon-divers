# Goon Divers

A three-page static site for GitHub Pages.

| Page | File | Status |
| --- | --- | --- |
| The Wheel of Pain | `index.html` | Built — random Helldivers 2 loadout generator |
| Mr. President | `mr-president.html` | Stub |
| Gear Swap | `gear-swap.html` | Stub |

## The Wheel of Pain

Rolls four divers at once. Each gets four stratagems plus a primary, secondary,
grenade and booster, drawn from the whole armory — every warbond, every Super
Store item, all three Legendary (crossover) warbonds.

- Rolls are completely random. Nothing is themed and no synergy is attempted.
- No in-game slot rules are enforced. Four backpacks is a legal roll.
- A stratagem never repeats within one diver's four.
- Stratagems *can* repeat across divers; each diver is rolled independently.
- Boosters are the one exception. They do not stack in game, so no two divers
  are ever handed the same booster — including when only a single booster or a
  single diver is rerolled.
- Every line has a `⟳` button that rerolls only that item. The card header
  rerolls one diver; **Spin the Wheel** rerolls all four.
- Click a diver's name to rename them. Names default to `Diver 01`–`Diver 04`,
  survive rerolls and reloads, and are stored in `localStorage` — they live in
  that one browser and are never sent anywhere. **Clear Names** resets all four
  without touching the loadouts.

## Squad colours

Cards are tinted to the in-game join-order colours — top border, header wash,
name text and reroll buttons. The stratagem slot bars deliberately stay on the
category palette, since those carry information of their own.

| Diver | Colour | Hex | Source |
| --- | --- | --- | --- |
| 1 | orange | `#ff9d45` | community palette |
| 2 | blue | `#81abff` | community palette |
| 3 | pink | `#f88aff` | community palette |
| 4 | green | `#7cff70` | **derived** — see below |

No public source documents diver 4's green. The three that are documented are
all exactly 100% saturation at 64–77% lightness, so the green is matched to
that family at hue 115. To use the real value, change `--p4` in
`css/style.css`; nothing else needs touching.

## Diver names across pages

`js/names.js` owns the roster and is loaded by all three pages. `localStorage`
is scoped to the site origin rather than to a single HTML file, so a name typed
on The Wheel of Pain is already readable from Mr. President and Gear Swap —
call `diverName(i)` for the name to show, which falls back to `Diver 0i` when
nothing has been typed. Edit `diverNames[i]` and call `saveDiverNames()` to
change one. Open tabs resync via the `storage` event.

The key is namespaced `goondivers.names` because every project site under
`<you>.github.io` shares one origin, and therefore one `localStorage`.

## Editing the armory

Everything lives in `js/data.js` as plain `["Display Name", "group"]` pairs.
Add, remove or rename an entry, save, reload — there is no build step.

For stratagems the `group` sets the colour tag on the card and must be one of
`orbital`, `eagle`, `support`, `backpack`, `vehicle`, `sentry`, `emplacement`.
For weapons, grenades and boosters the second value is free text and is shown
next to the slot label.

## Deploying to GitHub Pages

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin git@github.com:<you>/goon-divers.git
git push -u origin main
```

Then in the repo: **Settings → Pages → Build and deployment → Source: Deploy
from a branch**, branch `main`, folder `/ (root)`. The site lands at
`https://<you>.github.io/goon-divers/`.

All paths are relative, so it works from a project subpath or a custom domain
without changes. `.nojekyll` is present so Jekyll leaves the files alone.

## Running it locally

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080>.
