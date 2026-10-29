/* ============================================================================
   GOON DIVERS :: ARMORY MANIFEST
   ----------------------------------------------------------------------------
   Every entry below is [ "Display Name", "group" ].
   The group drives the colour tag on the card and nothing else, so adding or
   removing kit is safe: edit a list, save, reload. No build step.
   ========================================================================== */

const STRATAGEMS = [
  /* --- Orbital Cannons ---------------------------------------------------- */
  ["Orbital Precision Strike",        "orbital"],
  ["Orbital Gatling Barrage",         "orbital"],
  ["Orbital Gas Strike",              "orbital"],
  ["Orbital 120mm HE Barrage",        "orbital"],
  ["Orbital Airburst Strike",         "orbital"],
  ["Orbital Smoke Strike",            "orbital"],
  ["Orbital EMS Strike",              "orbital"],
  ["Orbital 380mm HE Barrage",        "orbital"],
  ["Orbital Walking Barrage",         "orbital"],
  ["Orbital Laser",                   "orbital"],
  ["Orbital Napalm Barrage",          "orbital"],
  ["Orbital Railcannon Strike",       "orbital"],

  /* --- Hangar / Eagle ----------------------------------------------------- */
  ["Eagle Strafing Run",              "eagle"],
  ["Eagle Airstrike",                 "eagle"],
  ["Eagle Cluster Bomb",              "eagle"],
  ["Eagle Smoke Strike",              "eagle"],
  ["Eagle Napalm Airstrike",          "eagle"],
  ["Eagle 110mm Rocket Pods",         "eagle"],
  ["Eagle 500kg Bomb",                "eagle"],

  /* --- Support Weapons ---------------------------------------------------- */
  ["MG-43 Machine Gun",               "support"],
  ["EAT-17 Expendable Anti-Tank",     "support"],
  ["M-105 Stalwart",                  "support"],
  ["LAS-98 Laser Cannon",             "support"],
  ["APW-1 Anti-Materiel Rifle",       "support"],
  ["GR-8 Recoilless Rifle",           "support"],
  ["GL-21 Grenade Launcher",          "support"],
  ["FLAM-40 Flamethrower",            "support"],
  ["MG-206 Heavy Machine Gun",        "support"],
  ["AC-8 Autocannon",                 "support"],
  ["ARC-3 Arc Thrower",               "support"],
  ["LAS-99 Quasar Cannon",            "support"],
  ["RL-77 Airburst Rocket Launcher",  "support"],
  ["MLS-4X Commando",                 "support"],
  ["FAF-14 Spear",                    "support"],
  ["RS-422 Railgun",                  "support"],
  ["StA-X3 W.A.S.P. Launcher",        "support"],
  ["CQC-20 Breaching Hammer",         "support"],
  ["PLAS-45 Epoch",                   "support"],
  ["MGX-42 Bullet Storm",             "support"],
  ["S-11 Speargun",                   "support"],
  ["CQC-9 Defoliation Tool",          "support"],
  ["GL-52 De-Escalator",              "support"],
  ["EAT-700 Expendable Napalm",       "support"],
  ["TX-41 Sterilizer",                "support"],
  ["EAT-411 Leveller",                "support"],
  ["GL-28 Belt-Fed Grenade Launcher", "support"],
  ["B/MD C4 Pack",                    "support"],
  ["MS-11 Solo Silo",                 "support"],
  ["B/FLAM-80 Cremator",              "support"],
  ["M-1000 Maxigun",                  "support"],
  ["CQC-1 One True Flag",             "support"],
  ["40-K Meltagun",                   "support"],
  ["AMW-20 Apex",                     "support"],

  /* --- Backpacks ---------------------------------------------------------- */
  ["B-1 Supply Pack",                 "backpack"],
  ["LIFT-850 Jump Pack",              "backpack"],
  ["SH-20 Ballistic Shield Backpack", "backpack"],
  ["AX/AR-23 Guard Dog",              "backpack"],
  ["AX/LAS-5 Rover",                  "backpack"],
  ["SH-32 Shield Generator Pack",     "backpack"],
  ["SH-51 Directional Shield",        "backpack"],
  ["AX/FLAM-75 Hot Dog",              "backpack"],
  ["B-100 Portable Hellbomb",         "backpack"],
  ["AX/ARC-3 K-9",                    "backpack"],
  ["LIFT-860 Hover Pack",             "backpack"],
  ["AX/TX-13 Dog Breath",             "backpack"],
  ["LIFT-182 Warp Pack",              "backpack"],

  /* --- Vehicles & Exosuits ------------------------------------------------ */
  ["M-103 Supply FRV",                "vehicle"],
  ["M-102 Gunner FRV",                "vehicle"],
  ["EXO-45 Patriot Exosuit",          "vehicle"],
  ["EXO-49 Emancipator Exosuit",      "vehicle"],
  ["EXO-55 Breakthrough Exosuit",     "vehicle"],
  ["EXO-51 Lumberer Exosuit",         "vehicle"],
  ["TD-220 Bastion MK XVI",           "vehicle"],
  ["TD-110 Maelstrom",                "vehicle"],

  /* --- Sentries ----------------------------------------------------------- */
  ["A/MG-43 Machine Gun Sentry",      "sentry"],
  ["A/G-16 Gatling Sentry",           "sentry"],
  ["A/AC-8 Autocannon Sentry",        "sentry"],
  ["A/M-12 Mortar Sentry",            "sentry"],
  ["A/MLS-4X Rocket Sentry",          "sentry"],
  ["A/ARC-3 Tesla Tower",             "sentry"],
  ["A/M-23 EMS Mortar Sentry",        "sentry"],
  ["A/LAS-98 Laser Sentry",           "sentry"],
  ["A/FLAM-40 Flame Sentry",          "sentry"],

  /* --- Emplacements & Mines ----------------------------------------------- */
  ["MD-6 Anti-Personnel Minefield",   "emplacement"],
  ["MD-I4 Incendiary Mines",          "emplacement"],
  ["MD-17 Anti-Tank Mines",           "emplacement"],
  ["MD-8 Gas Mines",                  "emplacement"],
  ["FX-12 Shield Generator Relay",    "emplacement"],
  ["E/MG-101 HMG Emplacement",        "emplacement"],
  ["E/GL-21 Grenadier Battlement",    "emplacement"],
  ["E/AT-12 Anti-Tank Emplacement",   "emplacement"],
];

const PRIMARIES = [
  ["AR-23 Liberator",                 "Assault Rifle"],
  ["AR-23P Liberator Penetrator",     "Assault Rifle"],
  ["AR-23C Liberator Concussive",     "Assault Rifle"],
  ["AR-23A Liberator Carbine",        "Assault Rifle"],
  ["AR-61 Tenderizer",                "Assault Rifle"],
  ["BR-14 Adjudicator",               "Assault Rifle"],
  ["StA-52 Assault Rifle",            "Assault Rifle"],
  ["AR-32 Pacifier",                  "Assault Rifle"],
  ["AR-2 Coyote",                     "Assault Rifle"],
  ["MA5C Assault Rifle",              "Assault Rifle"],
  ["AR/GL-21 One-Two",                "Assault Rifle"],
  ["AR-59 Suppressor",                "Assault Rifle"],
  ["AR-11 Arbitrator",                "Assault Rifle"],

  ["R-63 Diligence",                  "Marksman Rifle"],
  ["R-63CS Diligence Counter Sniper", "Marksman Rifle"],
  ["R-2124 Constitution",             "Marksman Rifle"],
  ["R-6 Deadeye",                     "Marksman Rifle"],
  ["R-2 Amendment",                   "Marksman Rifle"],
  ["R-72 Censor",                     "Marksman Rifle"],
  ["R-4 Hyena",                       "Marksman Rifle"],

  ["R-40 Sightliner",                 "Sniper Rifle"],

  ["SMG-37 Defender",                 "Submachine Gun"],
  ["SMG-72 Pummeler",                 "Submachine Gun"],
  ["MP-98 Knight",                    "Submachine Gun"],
  ["SMG-32 Reprimand",                "Submachine Gun"],
  ["StA-11 SMG",                      "Submachine Gun"],
  ["M7S SMG",                         "Submachine Gun"],
  ["SMG/FLAM-34 Stoker",              "Submachine Gun"],
  ["SMG-203 Gallant",                 "Submachine Gun"],

  ["SG-8 Punisher",                   "Shotgun"],
  ["SG-8S Slugger",                   "Shotgun"],
  ["SG-20 Halt",                      "Shotgun"],
  ["SG-451 Cookout",                  "Shotgun"],
  ["SG-225 Breaker",                  "Shotgun"],
  ["SG-225SP Breaker Spray&Pray",     "Shotgun"],
  ["SG-225IE Breaker Incendiary",     "Shotgun"],
  ["SG-97 Sweeper",                   "Shotgun"],
  ["DBS-2 Double Freedom",            "Shotgun"],
  ["M90A Shotgun",                    "Shotgun"],

  ["CB-9 Exploding Crossbow",         "Explosive"],
  ["R-36 Eruptor",                    "Explosive"],
  ["GL-15 Evictor",                   "Explosive"],

  ["SG-8P Punisher Plasma",           "Energy"],
  ["PLAS-39 Accelerator Rifle",       "Energy"],
  ["ARC-12 Blitzer",                  "Energy"],
  ["LAS-5 Scythe",                    "Energy"],
  ["LAS-16 Sickle",                   "Energy"],
  ["LAS-17 Double-Edge Sickle",       "Energy"],
  ["PLAS-1 Scorcher",                 "Energy"],
  ["PLAS-101 Purifier",               "Energy"],
  ["LAS-13 Trident",                  "Energy"],
  ["R/40-K Hot-Shot Marksman Rifle",  "Energy"],
  ["LAS-44 Nova",                     "Energy"],
  ["LAS-12 Sai",                      "Energy"],

  ["VG-70 Variable",                  "Special"],
  ["FLAM-66 Torcher",                 "Special"],
  ["JAR-5 Dominator",                 "Special"],
];

const SECONDARIES = [
  ["P-2 Peacemaker",                  "Pistol"],
  ["P-19 Redeemer",                   "Pistol"],
  ["P-4 Senator",                     "Pistol"],
  ["P-113 Verdict",                   "Pistol"],
  ["P-92 Warrant",                    "Pistol"],
  ["M6C/SOCOM Pistol",                "Pistol"],
  ["P-69 Veto",                       "Pistol"],
  ["P-44 Mist",                       "Pistol"],

  ["CQC-19 Stun Lance",               "Melee"],
  ["CQC-2 Saber",                     "Melee"],
  ["CQC-30 Stun Baton",               "Melee"],
  ["CQC-5 Combat Hatchet",            "Melee"],
  ["CQC-73 Entrenchment Tool",        "Melee"],
  ["CQC-42 Machete",                  "Melee"],

  ["P-11 Stim Pistol",                "Special"],
  ["SG-22 Bushwhacker",               "Special"],
  ["LAS-58 Talon",                    "Special"],
  ["P-72 Crisper",                    "Special"],
  ["GP-31 Grenade Pistol",            "Special"],
  ["LAS-7 Dagger",                    "Special"],
  ["GP-20 Ultimatum",                 "Special"],
  ["PLAS-15 Loyalist",                "Special"],
  ["P-35 Re-Educator",                "Special"],
  ["P-33 Missile Pistol",             "Special"],
  ["P/40-K Bolt Pistol",              "Special"],
  ["P-34 Breacher",                   "Special"],
];

const GRENADES = [
  ["G-6 Frag",                        "Grenade"],
  ["G-12 High Explosive",             "Grenade"],
  ["G-10 Incendiary",                 "Grenade"],
  ["G-7 Pineapple",                   "Grenade"],
  ["TED-63 Dynamite",                 "Grenade"],
  ["G-16 Impact",                     "Grenade"],
  ["G-13 Incendiary Impact",          "Grenade"],
  ["G-23 Stun",                       "Grenade"],
  ["G-4 Gas",                         "Grenade"],
  ["G-50 Seeker",                     "Grenade"],
  ["G-3 Smoke",                       "Grenade"],
  ["G-123 Thermite",                  "Grenade"],
  ["K-2 Throwing Knife",              "Grenade"],
  ["G-142 Pyrotech",                  "Grenade"],
  ["G-109 Urchin",                    "Grenade"],
  ["G-31 Arc",                        "Grenade"],
  ["TM-1 Lure Mine",                  "Grenade"],
  ["G-89 Smokescreen",                "Grenade"],
  ["G/SH-39 Shield",                  "Grenade"],
  ["G-48 Giga Grenade",               "Grenade"],
  ["G/40-K Melta Mine",               "Grenade"],
  ["G-8 Immolation",                  "Grenade"],
  ["G-60 Anti-Tank Seeker",           "Grenade"],
  ["G-11 Caltrops",                   "Grenade"],
];

const BOOSTERS = [
  ["Hellpod Space Optimization",      "Booster"],
  ["Vitality Enhancement",            "Booster"],
  ["UAV Recon Booster",               "Booster"],
  ["Stamina Enhancement",             "Booster"],
  ["Muscle Enhancement",              "Booster"],
  ["Increased Reinforcement Budget",  "Booster"],
  ["Flexible Reinforcement Budget",   "Booster"],
  ["Localization Confusion",          "Booster"],
  ["Expert Extraction Pilot",         "Booster"],
  ["Motivational Shocks",             "Booster"],
  ["Experimental Infusion",           "Booster"],
  ["Firebomb Hellpods",               "Booster"],
  ["Dead Sprint",                     "Booster"],
  ["Armed Resupply Pods",             "Booster"],
  ["Sample Extricator",               "Booster"],
  ["Sample Scanner",                  "Booster"],
  ["Stun Pods",                       "Booster"],
  ["Concealed Insertion",             "Booster"],
  ["Integrated Extinguishers",        "Booster"],
  ["Surplus EAT Allocation",          "Booster"],
];

/* ============================================================================
   WARBONDS :: which warbond an item comes from
   ----------------------------------------------------------------------------
   Keyed by warbond, listing item names exactly as they appear above. Anything
   not listed (base kit) shows no note; Super Store items are further down.
   ========================================================================== */

const WARBOND_ITEMS = {  "Helldivers Mobilize!": [
    "SG-8 Punisher",
    "R-63 Diligence",
    "P-19 Redeemer",
    "SMG-37 Defender",
    "SG-225 Breaker",
    "LAS-5 Scythe",
    "AR-23P Liberator Penetrator",
    "R-63CS Diligence Counter Sniper",
    "SG-8S Slugger",
    "SG-225SP Breaker Spray&Pray",
    "PLAS-1 Scorcher",
    "G-6 Frag",
    "G-16 Impact",
    "G-3 Smoke",
    "Hellpod Space Optimization",
    "Vitality Enhancement",
    "Stamina Enhancement",
    "Muscle Enhancement",
    "UAV Recon Booster",
    "Increased Reinforcement Budget",
  ],  "Steeled Veterans": [
    "AR-23C Liberator Concussive",
    "P-4 Senator",
    "SG-225IE Breaker Incendiary",
    "JAR-5 Dominator",
    "G-10 Incendiary",
    "Flexible Reinforcement Budget",
  ],  "Cutting Edge": [
    "LAS-16 Sickle",
    "SG-8P Punisher Plasma",
    "ARC-12 Blitzer",
    "LAS-7 Dagger",
    "G-23 Stun",
    "Localization Confusion",
  ],  "Democratic Detonation": [
    "BR-14 Adjudicator",
    "G-123 Thermite",
    "R-36 Eruptor",
    "CB-9 Exploding Crossbow",
    "GP-31 Grenade Pistol",
    "Expert Extraction Pilot",
  ],  "Polar Patriots": [
    "AR-61 Tenderizer",
    "SMG-72 Pummeler",
    "P-113 Verdict",
    "PLAS-101 Purifier",
    "G-13 Incendiary Impact",
    "Motivational Shocks",
  ],  "Viper Commandos": [
    "AR-23A Liberator Carbine",
    "SG-22 Bushwhacker",
    "K-2 Throwing Knife",
    "Experimental Infusion",
  ],  "Freedom's Flame": [
    "SG-451 Cookout",
    "FLAM-66 Torcher",
    "P-72 Crisper",
    "Firebomb Hellpods",
  ],  "Chemical Agents": [
    "TX-41 Sterilizer",
    "P-11 Stim Pistol",
    "G-4 Gas",
    "AX/TX-13 Dog Breath",
  ],  "Truth Enforcers": [
    "SG-20 Halt",
    "SMG-32 Reprimand",
    "PLAS-15 Loyalist",
    "Dead Sprint",
  ],  "Urban Legends": [
    "CQC-19 Stun Lance",
    "Armed Resupply Pods",
    "SH-51 Directional Shield",
    "A/FLAM-40 Flame Sentry",
    "E/AT-12 Anti-Tank Emplacement",
  ],  "Servants of Freedom": [
    "LAS-17 Double-Edge Sickle",
    "GP-20 Ultimatum",
    "G-50 Seeker",
    "B-100 Portable Hellbomb",
  ],  "Borderline Justice": [
    "R-6 Deadeye",
    "LAS-58 Talon",
    "TED-63 Dynamite",
    "Sample Extricator",
    "LIFT-860 Hover Pack",
  ],  "Masters of Ceremony": [
    "R-2 Amendment",
    "CQC-2 Saber",
    "G-142 Pyrotech",
    "Sample Scanner",
    "CQC-1 One True Flag",
  ],  "Force of Law": [
    "AR-32 Pacifier",
    "G-109 Urchin",
    "Stun Pods",
    "GL-52 De-Escalator",
    "AX/ARC-3 K-9",
  ],  "Control Group": [
    "VG-70 Variable",
    "PLAS-45 Epoch",
    "G-31 Arc",
    "A/LAS-98 Laser Sentry",
    "LIFT-182 Warp Pack",
  ],  "Dust Devils": [
    "AR-2 Coyote",
    "G-7 Pineapple",
    "S-11 Speargun",
    "EAT-700 Expendable Napalm",
    "MS-11 Solo Silo",
  ],  "Python Commandos": [
    "AR/GL-21 One-Two",
    "CQC-9 Defoliation Tool",
    "M-1000 Maxigun",
    "AX/FLAM-75 Hot Dog",
  ],  "Redacted Regiment": [
    "R-72 Censor",
    "P-35 Re-Educator",
    "AR-59 Suppressor",
    "TM-1 Lure Mine",
    "Concealed Insertion",
    "B/MD C4 Pack",
  ],  "Siege Breakers": [
    "LAS-13 Trident",
    "EAT-411 Leveller",
    "CQC-20 Breaching Hammer",
    "GL-28 Belt-Fed Grenade Launcher",
    "G/SH-39 Shield",
  ],  "Entrenched Division": [
    "SMG/FLAM-34 Stoker",
    "CQC-73 Entrenchment Tool",
    "P-69 Veto",
    "G-48 Giga Grenade",
    "B/FLAM-80 Cremator",
  ],  "Exo Experts": [
    "SMG-203 Gallant",
    "MGX-42 Bullet Storm",
    "P-33 Missile Pistol",
    "EXO-51 Lumberer Exosuit",
    "EXO-55 Breakthrough Exosuit",
  ],  "Ironclad Democracy": [
    "AR-11 Arbitrator",
    "P-34 Breacher",
    "GL-15 Evictor",
    "G-8 Immolation",
    "G-60 Anti-Tank Seeker",
    "Integrated Extinguishers",
    "Surplus EAT Allocation",
  ],  "Scope of Authority": [
    "R-40 Sightliner",
    "AMW-20 Apex",
    "LAS-44 Nova",
    "P-44 Mist",
    "G-11 Caltrops",
  ],  "Obedient Democracy Support Troopers": [
    "MA5C Assault Rifle",
    "M7S SMG",
    "M90A Shotgun",
    "M6C/SOCOM Pistol",
  ],  "Righteous Revenants": [
    "StA-52 Assault Rifle",
    "StA-11 SMG",
    "PLAS-39 Accelerator Rifle",
  ],  "Castellan's Creed": [
    "R/40-K Hot-Shot Marksman Rifle",
    "P/40-K Bolt Pistol",
    "G/40-K Melta Mine",
    "40-K Meltagun",
  ],};

/** Item name -> warbond name. */
const WARBOND_OF = {};
for (const [warbond, items] of Object.entries(WARBOND_ITEMS)) {
  for (const item of items) WARBOND_OF[item] = warbond;
}

/* Super Store items, with the warbond they were released alongside. */
const SUPER_STORE_ITEMS = {
  "SG-97 Sweeper":        "Entrenched Division",
  "DBS-2 Double Freedom": "Python Commandos",
  "CQC-42 Machete":       "Dust Devils",
  "P-92 Warrant":         "Force of Law",
  "CQC-5 Combat Hatchet": "Servants of Freedom",
  "LAS-12 Sai":           "Ironclad Democracy",
  "CQC-30 Stun Baton":    "Urban Legends",
  "G-89 Smokescreen":     "Redacted Regiment",
};

/** The small origin note for an item: { text, store }, or null for base kit. */
function originNote(name) {
  if (WARBOND_OF[name]) return { text: `Warbond: ${WARBOND_OF[name]}`, store: false };
  if (SUPER_STORE_ITEMS[name]) return { text: SUPER_STORE_ITEMS[name], store: true };
  return null;
}

/* ============================================================================
   MR. PRESIDENT :: custom mode tables
   ========================================================================== */

/* How the VIP is permitted to kill, on the runs where they are permitted at
   all. All equally likely; "Anyway" means no restriction on method. */
const VIP_KILL_MODIFIERS = [
  "Anyway",
  "Primary Only",
  "Pistol Only",
  "Melee Only",
  "Stratagem Only",
  "Primary/Secondary Only",
];

/* Salve Nerfs. Add to this freely — no logic reads it by position except the
   share link, so APPENDING to the end keeps old links meaning what they meant.
   Reordering or removing entries will shift what an existing link resolves to;
   a link pointing past the end of the list is treated as stale and rerolled. */
const SALVE_NERFS = [
  "No Stimming",
  "No Resupply",
  "All Eagles",
  "Melee Only",
  "Pistol Only",
  "First Person Only",
  "Third Person Only",
  "No Aiming",
];


/* ============================================================================
   GEAR SWAP :: what the swap covers
   ============================================================================
   One of these is drawn per swap and applies to the whole squad, so everyone
   is building the same class of thing for their target. Equally likely.
   Add to or reword this list freely — the draw reads its length. */

const GEAR_SCOPES = [
  "Primary, Secondary, Grenade, and Booster",
  "Stratagems",
  "Ideal",
];
