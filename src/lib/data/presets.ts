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

enum Anggolt_SpawnLocation {
  _40_RPB = "40 Rally Point of Belligerence",
  _40_RPV = "40 Rally Point of Victory",
  _40_RPU = "40 Rally Point of Unity",
  _45_TRB = "45 Training Grounds of Belligerence",
  _45_TRV = "45 Training Grounds of Victory",
  _45_TRU = "45 Training Grounds of Unity",
  _50_CB = "50 Conquest of Belligerence",
  _50_CV = "50 Conquest of Victory",
  _50_CU = "50 Conquest of Unity",
}

enum Liantte_SpawnLocation {
  _58_SG = "58 Shaded Gateway",
}

enum Seyron_SpawnLocation {
  _61_AQ = "61 Abandon Wilderness",
  _61_RW = "61 Ruined Wilderness",
  _61_DW = "61 Diminished Wilderness",
}
enum Gottmol_SpawnLocation {
  _64_WF = "64 Weathered Field",
  _64_FF = "64 Faded Field",
  _64_FF2 = "64 Forlorn Field",
}

enum Gehenna_SpawnLocation {
  _68_FRM = "68 Forlorn Rocky Mountain",
  _68_WRM = "68 Weathered Rocky Mountain",
  _68_FRM2 = "68 Faded Rocky Mountain",
}

enum Kiaron_SpawnLocation {
  _58_MPB = "58 Marching Point of Belligerence",
  _58_MPV = "58 Marching Point of Victory",
  _58_MPU = "58 Marching Point of Unity",
  _61_APB = "61 Assault Point of Belligerence",
  _61_APV = "61 Assault Point of Victory",
  _61_APU = "61 Assault Point of Unity",
}

enum Grish_SpawnLocation {
  _68_CPB2 = "68 Confrontation Point of Belligerence",
  _68_CPV2 = "68 Confrontation Point of Victory",
  _68_CPU2 = "68 Confrontation Point of Unity",
  _72_CPB = "72 Conflict Point of Belligerence",
  _72_CPV = "72 Conflict Point of Victory",
  _72_CPU = "72 Conflict Point of Unity",
}

enum Inferno_SpawnLocation {
  _55_RMC = "55 Rocky Mountain Cliff",
  _55_SGS = "55 Stone Grave Summit",
  _55_CWT = "55 Cloud Path Watchtower",
  _64_HP = "64 Horizon Peaks",
  _64_NB = "64 New Breeze Border",
  _64_HS = "64 High Grounds Summit",
  _76_SHC = "76 Source of Heavy Combat",
}
export const BOSSDATA_NIGHTCROWS: BOSSDATA_TYPE[] = [
  {
    name: BOSS_NAMES_NIGHTCROWS.Anggolt,
    locations: Object.values(Anggolt_SpawnLocation),
    respawnCount: 3,
    respawnInterval: 1,
    respawnIntervalDelay: 1,
    sortOrder: 1,
  },
  {
    name: BOSS_NAMES_NIGHTCROWS.Kiaron,
    locations: Object.values(Kiaron_SpawnLocation),
    respawnCount: 1,
    respawnInterval: 12,
    respawnIntervalDelay: 1,
    sortOrder: 2,
  },
  {
    name: BOSS_NAMES_NIGHTCROWS.Grish,
    locations: Object.values(Grish_SpawnLocation),
    respawnCount: 1,
    respawnInterval: 12,
    respawnIntervalDelay: 1,
    sortOrder: 3,
  },
  {
    name: BOSS_NAMES_NIGHTCROWS.Inferno,
    locations: Object.values(Inferno_SpawnLocation),
    respawnCount: 1,
    respawnInterval: 12,
    respawnIntervalDelay: 1,
    sortOrder: 4,
  },
  {
    name: BOSS_NAMES_NIGHTCROWS.Liantte,
    locations: Object.values(Liantte_SpawnLocation),
    respawnCount: 1,
    respawnInterval: 12,
    respawnIntervalDelay: 1,
    sortOrder: 5,
  },
  {
    name: BOSS_NAMES_NIGHTCROWS.Seyron,
    locations: Object.values(Seyron_SpawnLocation),
    respawnCount: 1,
    respawnInterval: 6,
    respawnIntervalDelay: 1,
    sortOrder: 6,
  },
  {
    name: BOSS_NAMES_NIGHTCROWS.Gottmol,
    locations: Object.values(Gottmol_SpawnLocation),
    respawnCount: 1,
    respawnInterval: 12,
    respawnIntervalDelay: 1,
    sortOrder: 7,
  },
  {
    name: BOSS_NAMES_NIGHTCROWS.Gehenna,
    locations: Object.values(Gehenna_SpawnLocation),
    respawnCount: 1,
    respawnInterval: 12,
    respawnIntervalDelay: 1,
    sortOrder: 8,
  },
];
