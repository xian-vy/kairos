export enum BOSS_NAMES_NIGHTCROWS {
  Anggolt = "Anggolt",
  Kiaron = "Kiaron",
  Grish = "Grish",
  Inferno = "Inferno",
  Liantte = "Liantte",
  Seyron = "Seyron",
  Gottmol = "Gottmol",
  Gehenna = "Gehenna",
}

export type BOSSDATA_TYPE = {
  name: BOSS_NAMES_NIGHTCROWS;
  locations: string[];
  respawnCount: number;
  respawnInterval: number;
  respawnIntervalDelay: number;
  sortOrder: number;
};



enum Liantte_SpawnLocation {
  _68_FF = "68 Forlorn Field",
  _72_FF = "72 Weathered Field",
  _76_FF = "76 Faded Field",
}

enum Seyron_SpawnLocation {
  _80_WF = "80 Battlefield of Response",

}
enum Gottmol_SpawnLocation {
  _84_WF = "84 Battlefield of Counterattack",
}

enum Gehenna_SpawnLocation {
  _88_WF = "88 Battlefield of Hostility",
  _88_PR = "88 Peaks of Revolt",

}

enum Anggolt_SpawnLocation {
  _40_RPB = "40 Rally Point of Belligerence",
  _40_RPV = "40 Rally Point of Victory",
  _40_RPU = "40 Rally Point of Unity",
  _45_TRB = "45 Training Grounds of Belligerence",
  _45_TRV = "45 Training Grounds of Victory",
  _45_TRU = "45 Training Grounds of Unity",
}

enum Kiaron_SpawnLocation {
  _50_CB = "50 Conquest of Belligerence",
  _50_CV = "50 Conquest of Victory",
  _50_CU = "50 Conquest of Unity",
  _55_RMC = "55 Wind Path Flatland",
  _55_SGS = "55 Stone Grave Field",
  _55_CWT = "55 Stone Path  Wilderness",
}

enum Grish_SpawnLocation {
  _58_APB = "58 Assault Point of Belligerence",
  _58_APV = "58 Assault Point of Victory",
  _58_APU = "58 Assault Point of Unity",
  _68_RMC = "68 Rocky Mountain Cliff",
  _68_SGS = "68 Stone Grave Summit",
  _68_CWT = "68 Cloud Path Watchtower",
}

enum Inferno_SpawnLocation {
  _72_HP = "72 Horizon Peaks",
  _72_NB = "72 New Breeze Border",
  _72_HS = "72 High Grounds Summit",
  _76_SHC = "76 Source of Heavy Combat",
}
export const BOSSDATA_NIGHTCROWS: BOSSDATA_TYPE[] = [
  {
    name: BOSS_NAMES_NIGHTCROWS.Anggolt,
    locations: Object.values(Anggolt_SpawnLocation),
    respawnCount: 3,
    respawnInterval: 7,
    respawnIntervalDelay: 3,
    sortOrder: 1,
  },
  {
    name: BOSS_NAMES_NIGHTCROWS.Kiaron,
    locations: Object.values(Kiaron_SpawnLocation),
    respawnCount: 3,
    respawnInterval: 9,
    respawnIntervalDelay: 3,
    sortOrder: 2,
  },
  {
    name: BOSS_NAMES_NIGHTCROWS.Grish,
    locations: Object.values(Grish_SpawnLocation),
    respawnCount: 3,
    respawnInterval: 11,
    respawnIntervalDelay: 3,
    sortOrder: 3,
  },
  {
    name: BOSS_NAMES_NIGHTCROWS.Inferno,
    locations: Object.values(Inferno_SpawnLocation),
    respawnCount: 3,
    respawnInterval: 13,
    respawnIntervalDelay: 3,
    sortOrder: 4,
  },
  {
    name: BOSS_NAMES_NIGHTCROWS.Liantte,
    locations: Object.values(Liantte_SpawnLocation),
    respawnCount: 3,
    respawnInterval: 5.5,
    respawnIntervalDelay: 3,
    sortOrder: 5,
  },
  {
    name: BOSS_NAMES_NIGHTCROWS.Seyron,
    locations: Object.values(Seyron_SpawnLocation),
    respawnCount: 3,
    respawnInterval: 6.5,
    respawnIntervalDelay: 3,
    sortOrder: 6,
  },
  {
    name: BOSS_NAMES_NIGHTCROWS.Gottmol,
    locations: Object.values(Gottmol_SpawnLocation),
    respawnCount: 3,
    respawnInterval: 7.5,
    respawnIntervalDelay: 3,
    sortOrder: 7,
  },
  {
    name: BOSS_NAMES_NIGHTCROWS.Gehenna,
    locations: Object.values(Gehenna_SpawnLocation),
    respawnCount: 3,
    respawnInterval: 8.5,
    respawnIntervalDelay: 3,
    sortOrder: 8,
  },
];
