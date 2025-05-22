// Level cap.
const F_LEVEL_CAP_18_20 = '18_20';
const F_LEVEL_CAP_15_18 = '15_18';

const features = (() => {
  // The level cap.
  const levelCap = F_LEVEL_CAP_18_20;

  return {levelCap};
})();
window.f = features;

// Rarity
const G_R6 = 'group_rarity_6';
const G_R5 = 'group_rarity_5';
const G_R4 = 'group_rarity_4';
const G_R3 = 'group_rarity_3';
const G_R2 = 'group_rarity_2';
const G_R1 = 'group_rarity_1';

// Category
const G_BODY = 'group_body';
const G_WEAPON = 'group_weapon';
const G_WHEEL = 'group_wheel';
const G_GADGET = 'group_gadget';

// Class for Weapons and Gadgets.
const G_CL_UNKNOWN = 'group_class_unknown';
const G_CL_NONE = 'group_class_none';
const G_CL_MELEE = 'group_class_melee';
const G_CL_RANGED = 'group_class_ranged';
const G_CL_AUTO_AIM = 'group_class_auto_aim';
const G_CL_MINION = 'group_class_minion';
const G_CL_SPECIAL = 'group_class_special';

// Sponsor
const G_SP_NONE = 'group_sp_none';
const G_SP_MECHA = 'group_sp_mecha';
const G_SP_NATURALIS = 'group_sp_naturalis';
const G_SP_GLUTTONY = 'group_sp_gluttony';
const G_SP_SPORTY = 'group_sp_sporty';

// Bonus
const BONUS_BODY_10 = {c: G_BODY, p: 10};
const BONUS_WEAPON_10 = {c: G_WEAPON, p: 10};
const BONUS_WEAPON_15 = {c: G_WEAPON, p: 15};
const BONUS_WHEEL_10 = {c: G_WHEEL, p: 10};
const BONUS_WHEEL_15 = {c: G_WHEEL, p: 15};
const BONUS_WHEEL_25 = {c: G_WHEEL, p: 25};
const BONUS_WHEEL_50 = {c: G_WHEEL, p: 50};
const BONUS_GADGET_10 = {c: G_GADGET, p: 10};
const BONUS_GADGET_20 = {c: G_GADGET, p: 20};
const BONUS_GADGET_25 = {c: G_GADGET, p: 25};

// Slots
const SLOT_024 = {weapon: 0, wheel: 2, gadget: 4};
const SLOT_121 = {weapon: 1, wheel: 2, gadget: 1};
const SLOT_123 = {weapon: 1, wheel: 2, gadget: 3};
const SLOT_131 = {weapon: 1, wheel: 3, gadget: 1};
const SLOT_202 = {weapon: 2, wheel: 0, gadget: 2};
const SLOT_203 = {weapon: 2, wheel: 0, gadget: 3};
const SLOT_221 = {weapon: 2, wheel: 2, gadget: 1};
const SLOT_222 = {weapon: 2, wheel: 2, gadget: 2};
const SLOT_232 = {weapon: 2, wheel: 3, gadget: 2};
const SLOT_321 = {weapon: 3, wheel: 2, gadget: 1};
const SLOT_331 = {weapon: 3, wheel: 3, gadget: 1};
const SLOT_322 = {weapon: 3, wheel: 2, gadget: 2};
const SLOT_421 = {weapon: 4, wheel: 2, gadget: 1};

// Stats increment patterns
const G_SIP_R1 = 'group_sip_r1';
const G_SIP_R2 = 'group_sip_r2';
const G_SIP_R3 = 'group_sip_r3';
const G_SIP_R4 = 'group_sip_r4';
const G_SIP_R5 = 'group_sip_r5';
const G_SIP_R6 = 'group_sip_r6';
const G_SIP_R6_L = 'group_sip_r6_legacy';

const sipToRarity = (sip) => {
  if (sip == G_SIP_R6 || sip == G_SIP_R6_L) {
    return G_R6;
  } else if (sip == G_SIP_R5) {
    return G_R5;
  } else if (sip == G_SIP_R4) {
    return G_R4;
  } else if (sip == G_SIP_R3) {
    return G_R3;
  } else if (sip == G_SIP_R2) {
    return G_R2;
  } else if (sip == G_SIP_R1) {
    return G_R1;
  }
  logger.warn('sipToRarity: Invalid sip', sip);
  return '';
};

const rarityToDefaultSip = (rarity) => {
  if (rarity == G_R6) {
    return G_SIP_R6;
  } else if (rarity == G_R5) {
    return G_SIP_R5;
  } else if (rarity == G_R4) {
    return G_SIP_R4;
  } else if (rarity == G_R3) {
    return G_SIP_R3;
  } else if (rarity == G_R2) {
    return G_SIP_R2;
  } else if (rarity == G_R1) {
    return G_SIP_R1;
  }
};

const maxLevelFromRarity = (rarity) => {
  if (features.levelCap == F_LEVEL_CAP_18_20) {
    return rarity == G_R6 ? 18 : 20;
  } else {
    return rarity == G_R6 ? 15 : 18;
  }
};

const maxLevelFromStatsIncrementPattern = (sip) => {
  return maxLevelFromRarity(sip);
};

// From level 1
const mapToLevelBySip = (base, to, sip) => {
  if (to <= 0 || to > maxLevelFromStatsIncrementPattern(sip)) {
    logger.warn('Map', base, 'to level', to, 'with stats increment pattern ', sip);
    return 0;
  }
  if (sip == G_SIP_R6_L) {
    let delta = Math.floor(base * 0.19163);
    let delta2 = Math.floor(base / 15);
    for (let i = 2; i <= to; ++i) {
      base += delta;
      delta += delta2;
    }
    return base;
    /*
    const kMultipliers = [0, 1, 1.1916, 1.4499, 1.7748, 2.1664, 2.6247, 3.1496, 3.7413, 4.3996, 5.1245, 5.9162, 6.7744, 7.6994, 8.6911, 9.7495];
    return Math.floor(base * kMultipliers[to]);
    */
  } else {
    for (let i = 2; i <= Math.min(to, 16); ++i) {
      base = Math.floor(base * 1.2);
    }
    if (to >= 17) {
      const fixedDelta = Math.max(Math.floor(base * 0.0875) - 1, 0);
      base += fixedDelta * (to - 16);
    }
    /*
    if (to >= 17) {
      base = Math.floor(base * 1.087490716);
    }
    if (to >= 18) {
      base = Math.floor(base * 1.08046);
    }
    */
    return base;
  }
}

const itemPool = {};
const allItemNames = [];
window.ip = itemPool;

const createItem = (item) => {
  return {
      index: function() { return this.data.index },
      name: function() { return this.data.n || '' },
      nameEn: function() { return this.data.nEn || this.name() },
      nameZh: function() { return this.data.nZh || this.name() },
      nameJa: function() { return this.data.nJa || this.name() },
      category: function() { return this.data.c },
      class: function() { return this.data.cl || G_CL_NONE },
      rarity: function() { return this.data.r },
      rarityImage: function() { return 'images/' + this.rarity().replace(/^group_/, '') + '.png' },
      sponsor: function() { return this.data.s || G_SP_NONE },
      sponsorImage: function() { return this.sponsor() == G_SP_NONE ? '' : 'images/' + this.sponsor().replace(/^group_/, '') + '.png' },
      image: function() { return this.data.no_image ? '' : 'images/' + this.name() + '.png' },
      maxLevel: function() { return maxLevelFromRarity(this.rarity()) },
      hp1: function() { return this.data.hp1 || 0 },
      hpMax: function() { return this.hp(this.maxLevel()) },
      hp: function(level) { return mapToLevelBySip(this.hp1(), level, this.sip()) },
      atk1: function() { return this.data.atk1 || 0 },
      atkMax: function() { return this.atk(this.maxLevel()) },
      atk: function(level) { return mapToLevelBySip(this.atk1(), level, this.sip()) },
      mHp1: function() { return this.data.mHp1 || 0 },
      mHpMax: function() { return this.mHp(this.maxLevel()) },
      mHp: function(level) {
        let sip = this.sip();
        if (sip == G_SIP_R6_L) {
          sip = G_SIP_R6;
        }
        return mapToLevelBySip(this.mHp1(), level, sip);
      },
      power: function() { return this.data.power || 0 },
      bonus: function() { return this.data.b },
      slots: function() { return this.data.sl },
      sip: function() {
        return this.data.sip ? this.data.sip : rarityToDefaultSip(this.rarity())
      },
      latest: function() { return this.tbu || false },
      data: item,
  };
};

const addItem = (item) => {
  item.index = Object.keys(itemPool).length;
  normalizedItem = createItem(item);
  itemPool[normalizedItem.name()] = normalizedItem;
  allItemNames.push(normalizedItem.name());
};

// Bodies R6
const TUDDY_BUS = 'tuddy_bus';
addItem({n: TUDDY_BUS, nEn: 'Tuddy Bus', nZh: '肥猫巴士', nJa: 'おデブバス', c: G_BODY, r: G_R6, s: G_SP_GLUTTONY, hp1: 32568, power: 35, b: BONUS_WHEEL_25, sl: SLOT_232});

// Base up, HP SIP changed
const COOL_DUCKY = 'cool_ducky';
addItem({n: COOL_DUCKY, nEn: 'Cool Ducky', nZh: '酷酷鸭', nJa: 'クールダック', c: G_BODY, r: G_R6, s:G_SP_NATURALIS, sip: G_SIP_R6, hp1: 52560, power: 35, b: BONUS_GADGET_10, sl: SLOT_123});

const IRON_MAIDEN = 'iron_maiden';
addItem({n: IRON_MAIDEN, nEn: 'Iron Maiden', nZh: '铁娘子', nJa: 'アイアンメイデン', c: G_BODY, r: G_R6, s:G_SP_MECHA, hp1: 48120, power: 35, b: BONUS_WHEEL_15, sl: SLOT_222});

const POPSICLE_BEAST = 'popsicle_beast';
addItem({n: POPSICLE_BEAST, nEn: 'Popsicle Beast', nZh: '冰棒兽', nJa: 'ポップシクルビースト', c: G_BODY, r: G_R6, s:G_SP_GLUTTONY, hp1: 42382, power: 35, b: BONUS_WEAPON_10, sl: SLOT_421});

const PHANTOM_CIRCUS = 'phantom_circus';
addItem({n: PHANTOM_CIRCUS, nEn: 'Phantom Circus', nZh: '幻影马戏团', nJa: 'ファントムサーカス', c: G_BODY, r: G_R6, s: G_SP_GLUTTONY, hp1: 46088, power: 40, b: BONUS_GADGET_20, sl: SLOT_203});

const RAM = 'ram';
addItem({n: RAM, nEn: 'R.A.M.', nZh: 'R.A.M.', nJa: 'R.A.M.', c: G_BODY, r: G_R6, s:G_SP_MECHA, hp1: 32568, power: 35, b: BONUS_WEAPON_10, sl: SLOT_331});

const SCHRODINTECH = 'schrodintech';
addItem({n: SCHRODINTECH, nEn: 'Schrodintech', nZh: '薛定谔科技', nJa: 'シュレーディンテック', c: G_BODY, r: G_R6, s:G_SP_MECHA, hp1: 38409, power: 35, b: BONUS_GADGET_10, sl: SLOT_222});

const BLOSSOM_STAR = 'blossom_star';
addItem({n: BLOSSOM_STAR, nEn: 'Blossom Star', nZh: '繁花之星', nJa: 'ブロッサムスター', c: G_BODY, r: G_R6, s:G_SP_NATURALIS, hp1: 40164, power: 35, b: BONUS_WEAPON_10, sl: SLOT_222});

const GREEN_DRAGON = 'green_dragon';
addItem({n: GREEN_DRAGON, nEn: 'Green Dragon', nZh: '绿龙', nJa: 'グリーンドラゴン', c: G_BODY, r: G_R6, s:G_SP_NATURALIS, hp1: 48392, power: 35, b: BONUS_WEAPON_10, sl: SLOT_232});

// Bodies R5
const STINGY_BANDIT = 'stingy_bandit';
addItem({n: STINGY_BANDIT, nEn: 'Stingy Bandit', nZh: '尖刺强盗', nJa: 'スティンギーバンディット', c: G_BODY, r: G_R5, hp1: 21240, power: 35, b: BONUS_WEAPON_10, sl: SLOT_232});

const DIAMOND_PIG = 'diamond_pig'
addItem({n: DIAMOND_PIG, nEn: 'Diamond Pig', nZh: '钻石猪', nJa: 'ダイヤモンドピッグ', c: G_BODY, r: G_R5, hp1: 14160, power: 30, b: BONUS_WEAPON_10, sl: SLOT_322});

const GOLEM = 'golem';
addItem({n: GOLEM, nEn: 'Golem', nZh: '石巨人', nJa: 'ゴーレム', c: G_BODY, r: G_R5, hp1: 18880, power: 35, b: BONUS_WEAPON_10, sl: SLOT_222});

const METAL_BEAST = 'metal_beast';
addItem({n: METAL_BEAST, nEn: 'Metal Beast', nZh: '金属野兽', nJa: 'メタルビースト', c: G_BODY, r: G_R5, hp1: 18880, power: 30, b: BONUS_WHEEL_50, sl: SLOT_222});

const PURR_MOBILE = 'purr_mobile';
addItem({n: PURR_MOBILE, nEn: 'Purr-Mobile', nZh: '咕噜战车', nJa: 'ニャーモービル', c: G_BODY, r: G_R5, hp1: 18880, power: 35, b: BONUS_WEAPON_10, sl: SLOT_222});

// Bodies R4
const FLOWER_POWER = 'flower_power';
addItem({n: FLOWER_POWER, nEn: 'Flower Power', nZh: '鲜花力量', nJa: 'フラワーパワー', c: G_BODY, r: G_R4, hp1: 25960, power: 30, sl: SLOT_421});

const STOVE = 'stove';
addItem({n: STOVE, nEn: 'Stove', nZh: '炉子', nJa: 'ストーブ', c: G_BODY, r: G_R4, hp1: 25960, power: 30, sl: SLOT_202});

const APOCATLYPSE_BUS = 'apocatlypse_bus';
addItem({n: APOCATLYPSE_BUS, nEn: 'Apocatlypse Bus', nZh: '猫咪天启巴士', nJa: 'CATの黙示録バス', c: G_BODY, r: G_R4, hp1: 16520, power: 25, sl: SLOT_222});

const WILD_WEST_COACH = 'wild_west_coach';
addItem({n: WILD_WEST_COACH, nEn: 'Wild West Coach', nZh: '狂野西部马车', nJa: 'ワイルドウエストコーチ', c: G_BODY, r: G_R4, hp1: 21240, power: 30, sl: SLOT_123});

const UFO = 'ufo';
addItem({n: UFO, nEn: 'UFO', nZh: '飞碟', nJa: 'UFO', c: G_BODY, r: G_R4, hp1: 16520, power: 30, sl: SLOT_123});

// Bodies R3
const PAWS_ROVER = 'paws_rover';
addItem({n: PAWS_ROVER, nEn: 'Paws Rover', nZh: '猫爪火星车', nJa: '肉球探査車', c: G_BODY, r: G_R3, hp1: 16520, power: 30, sl: SLOT_222});

const LANTERN = 'lantern';
addItem({n: LANTERN, nEn: 'Lantern', nZh: '灯笼', nJa: '灯籠', c: G_BODY, r: G_R3, hp1: 14160, power: 20, sl: SLOT_131});

const SANTAS_SLEIGH = 'santas_sleigh';
addItem({n: SANTAS_SLEIGH, nEn: 'Santa\'s Leigh', nZh: '圣诞老人的雪橇', nJa: 'サンタのソリ', c: G_BODY, r: G_R3, hp1: 16520, power: 25, sl: SLOT_222});

// Bodies R2
const CORSAIR = 'corsair';
addItem({n: CORSAIR, nEn: 'Corsair', nZh: '海盗船', nJa: '海賊車', c: G_BODY, r: G_R2, hp1: 14160, power: 20, sl: SLOT_121});

const FIRE_HAZARD = 'fire_hazard';
addItem({n: FIRE_HAZARD, nEn: 'Fire Hazard', nZh: '火焰危机', nJa: 'ファイヤーハザード', c: G_BODY, r: G_R2, hp1: 11800, power: 25, sl: SLOT_222});

const GLACIAL_MENACE = 'glacial_menace';
addItem({n: GLACIAL_MENACE, nEn: 'Glacial Menace', nZh: '冰川威胁', nJa: 'グレイシャルメナス', c: G_BODY, r: G_R2, hp1: 14160, power: 30, sl: SLOT_123});

const PIG = 'pig';
addItem({n: PIG, nEn: 'Pig', nZh: '猪', nJa: 'ブタ', c: G_BODY, r: G_R2, hp1: 18880, power: 15, sl: SLOT_221});

const LAND_BATHYSCAPHE = 'land_bathyscaphe';
addItem({n: LAND_BATHYSCAPHE, nEn: 'Land Bathyscaphe', nZh: '陆上型深海潜艇', nJa: '陸上潜水艇', c: G_BODY, r: G_R2, hp1: 15340, power: 25, sl: SLOT_222});

// Bodies R1
const CLOUD = 'cloud';
addItem({n: CLOUD, nEn: 'Cloud', nZh: '云朵', nJa: '雲', c: G_BODY, r: G_R1, hp1: 16520, power: 30, sl: SLOT_024});

const DOZER = 'dozer';
addItem({n: DOZER, nEn: 'Dozer', nZh: '推土机', nJa: 'ドーザー', c: G_BODY, r: G_R1, hp1: 11800, power: 20, sl: SLOT_121});

const CUTTER = 'cutter';
addItem({n: CUTTER, nEn: 'Cutter', nZh: '切割机', nJa: 'カッター', c: G_BODY, r: G_R1, hp1: 11800, power: 20, sl: SLOT_121});


// Weapons R6
const HAIRBALL_THROWER = 'hairball_thrower';
addItem({n: HAIRBALL_THROWER, nEn: 'Hairball Thrower', nZh: '毛球投掷机', nJa: '毛玉シューター', c: G_WEAPON, r: G_R6, s: G_SP_MECHA, atk1: 9000, power: -10, cl: G_CL_RANGED, b: BONUS_BODY_10});

const GUMBALL_GUN = 'gumball_gun';
addItem({n: GUMBALL_GUN, nEn: 'Gumball Gun', nZh: '口香糖枪', nJa: 'ガムボール銃', c: G_WEAPON, r: G_R6, s: G_SP_GLUTTONY, atk1: 10920, power: -15, cl: G_CL_AUTO_AIM, b: BONUS_WEAPON_10});

const ACID_ALEIN = 'acid_alein';
addItem({n: ACID_ALEIN, nEn: 'Acid Alien', nZh: '强酸外星人', nJa: 'アシッドエイリアン', c: G_WEAPON, r: G_R6, s: G_SP_NATURALIS, atk1: 10800, power: -10, cl: G_CL_RANGED, b: BONUS_WEAPON_10});

const BATS = 'bats';
addItem({n: BATS, nEn: 'Bats', nZh: '蝙蝠', nJa: 'コウモリ', c: G_WEAPON, r: G_R6, s: G_SP_NATURALIS, atk1: 8000, mHp1: 11000, power: -10, cl: G_CL_MINION, b: BONUS_BODY_10});

const SEA_MONSTER = 'sea_monster';
addItem({n: SEA_MONSTER, nEn: 'Sea Monster', nZh: '海怪', nJa: 'シーモンスター', c: G_WEAPON, r: G_R6, s: G_SP_NATURALIS, atk1: 10500, mHp1: 20000, power: -15, cl: G_CL_MINION, b: BONUS_WEAPON_10});

// SIP changed
const BENTO_DRONE = 'bento_drone';
addItem({n: BENTO_DRONE, nEn: 'Bento Drone', nZh: '便当无人机', nJa: 'キャラ弁ドローン', c: G_WEAPON, r: G_R6, s: G_SP_GLUTTONY, atk1: 9000, mHp1: 30000, power: -10, cl: G_CL_MINION, b: BONUS_GADGET_10});

const BLAZING_DRAGON = 'blazing_dragon';
addItem({n: BLAZING_DRAGON, nEn: 'Blazing Dragon', nZh: '烈焰巨龙', nJa: 'ブレイジングドラゴン', c: G_WEAPON, r: G_R6, s: G_SP_MECHA, atk1: 14742, power: -10, cl: G_CL_SPECIAL, b: BONUS_BODY_10});

const KAPPA_DRONE = 'kappa_drone';
addItem({n: KAPPA_DRONE, nEn: 'Kappa Drone', nZh: 'KAPPA无人机', nJa: 'カッパドローン', c: G_WEAPON, r: G_R6, s: G_SP_NATURALIS, sip: G_SIP_R6, atk1: 8000, mHp1: 12740, power: -10, cl: G_CL_MINION, b: BONUS_WEAPON_10});

const MAD_LOG = 'mad_log';
addItem({n: MAD_LOG, nEn: 'Mad Log', nZh: '疯狂原木', nJa: 'マッド丸太', c: G_WEAPON, r: G_R6, s: G_SP_GLUTTONY, atk1: 7500, power: -5, cl: G_CL_RANGED, b: BONUS_WEAPON_10});

const SPACE_DRILL = 'space_drill';
addItem({n: SPACE_DRILL, nEn: 'Space Drill', nZh: '太空钻头', nJa: 'スペースドリル', c: G_WEAPON, r: G_R6, s: G_SP_MECHA, atk1: 8000, power: -10, cl: G_CL_AUTO_AIM, b: BONUS_WEAPON_10});

// ATK SIP changed
const DARUMA_DRONE = 'daruma_drone';
addItem({n: DARUMA_DRONE, nEn: 'Daruma Drone', nZh: '达摩无人机', nJa: 'ダルマドローン', c: G_WEAPON, r: G_R6, s: G_SP_MECHA, atk1: 8250, mHp1: 12600, power: -10, cl: G_CL_MINION, b: BONUS_WEAPON_10});

const PLASMA_SENTRY = 'plasma_sentry';
addItem({n: PLASMA_SENTRY, nEn: 'Plasma Sentry', nZh: '等离子哨兵', nJa: 'プラズマセントリー', c: G_WEAPON, r: G_R6, s: G_SP_MECHA, atk1: 4500, power: -5, cl: G_CL_AUTO_AIM, b: BONUS_WEAPON_10});

const ROBOT_HEAD = 'robot_head';
addItem({n: ROBOT_HEAD, nEn: 'Robot Head', nZh: '机器人头', nJa: 'ロボットヘッド', c: G_WEAPON, r: G_R6, s: G_SP_MECHA, atk1: 10000, power: -10, cl: G_CL_RANGED, b: BONUS_GADGET_10});

const SONIC_BELL = 'sonic_bell';
addItem({n: SONIC_BELL, nEn: 'Sonic Bell', nZh: '音铃', nJa: 'ソニックベル', c: G_WEAPON, r: G_R6, s: G_SP_GLUTTONY, atk1: 7500, power: -5, cl: G_CL_RANGED, b: BONUS_BODY_10});

const SPICY_BARRAGE = 'spicy_barrage';
addItem({n: SPICY_BARRAGE, nEn: 'Spicy Barrage', nZh: '辛辣弹幕', nJa: 'スパイシーバラージ', c: G_WEAPON, r: G_R6, s: G_SP_GLUTTONY, atk1: 9000, power: -5, cl: G_CL_RANGED, b: BONUS_WEAPON_10});

const WATER_TRIDENT = 'water_trident';
addItem({n: WATER_TRIDENT, nEn: 'Water Trident', nZh: '水纹三叉戟', nJa: 'ウォータートライデント', c: G_WEAPON, r: G_R6, s: G_SP_NATURALIS, sip: G_SIP_R6_L, atk1: 10000, power: -5, cl: G_CL_MELEE, b: BONUS_WEAPON_10});

// Weapons R5
const CAT_DRONE = 'cat_drone';
addItem({n: CAT_DRONE, nEn: 'Cat Drone', nZh: '猫咪无人机', nJa: 'CATドローン', c: G_WEAPON, r: G_R5, atk1: 6000, mHp1: 10000, power: -10, cl: G_CL_MINION, b: BONUS_WEAPON_15});

const DIAMOND_CARP = 'diamond_carp';
addItem({n: DIAMOND_CARP, nEn: 'Diamond Carp', nZh: '钻石鲤', nJa: 'ダイヤモンドコイ', c: G_WEAPON, r: G_R5, atk1: 4000, power: -15, b: BONUS_BODY_10, cl: G_CL_AUTO_AIM});

const BBQ_GUN = 'bbq_gun';
addItem({n: BBQ_GUN, nEn: 'BBQ Gun', nZh: 'BBQ枪', nJa: 'BBQガン', c: G_WEAPON, r: G_R5, atk1: 4500, power: -10, b: BONUS_WEAPON_10, cl: G_CL_RANGED});

const BASKETBALL_CANNON = 'basketball_cannon';
addItem({n: BASKETBALL_CANNON, nEn: 'Basketball Cannon', nZh: '篮球大炮', nJa: 'バスケットボールキャノン', c: G_WEAPON, r: G_R5, atk1: 2800, power: -10, cl: G_CL_RANGED, b: BONUS_GADGET_25});

const DOUBLE_CATCUS = 'double_catcus';
addItem({n: DOUBLE_CATCUS, nEn: 'Double Catcus', nZh: '双头猫咪仙人掌', nJa: 'ダブルネコサボテン', c: G_WEAPON, r: G_R5, atk1: 3500, power: -10, cl: G_CL_MELEE, b: BONUS_BODY_10});

const GYRO_SPIRIT = 'gyro_spirit';
addItem({n: GYRO_SPIRIT, nEn: 'Gyro Spirit', nZh: '陀螺精神', nJa: 'ジャイロスピリット', c: G_WEAPON, r: G_R5, atk1: 5500, power: -10, cl: G_CL_RANGED, b: BONUS_WEAPON_15});

const HORNS_OF_RAGE = 'horns_of_rage';
addItem({n: HORNS_OF_RAGE, nEn: 'Horns of Rage', nZh: '愤怒之角', nJa: '怒りのホーン', c: G_WEAPON, r: G_R5, atk1: 4500, power: -10, cl: G_CL_SPECIAL, b: BONUS_WEAPON_10});

const CAT_MINE = 'cat_mine';
addItem({n: CAT_MINE, nEn: 'Cat\'s Mine', nZh: '猫咪地雷炮', nJa: 'CAT地雷', c: G_WEAPON, r: G_R5, atk1: 3750, power: -10, cl: G_CL_AUTO_AIM, b: BONUS_GADGET_20});

const POPCORN_LAUNCHER = 'popcorn_launcher';
addItem({n: POPCORN_LAUNCHER, nEn: 'Popcorn Launcher', nZh: '爆米花发射器', nJa: 'ポップコーンランチャー', c: G_WEAPON, r: G_R5, atk1: 4500, power: -10, cl: G_CL_RANGED, b: BONUS_BODY_10});

const SALMON_CANNON = 'salmon_cannon';
addItem({n: SALMON_CANNON, nEn: 'Salmon Cannon', nZh: '三文鱼大炮', nJa: 'サーモンキャノン', c: G_WEAPON, r: G_R5, atk1: 3000, power: -10, cl: G_CL_RANGED, b: BONUS_BODY_10});

const UNCLE_SAM = 'uncle_sam';
addItem({n: UNCLE_SAM, nEn: 'Uncle Sam', nZh: '山姆大叔', nJa: 'アングル・サム', c: G_WEAPON, r: G_R5, atk1: 3000, power: -10, b: BONUS_WEAPON_10, cl: G_CL_RANGED});

// Weapons R4
const METEO_SHOWER = 'meteo_shower';
addItem({n: METEO_SHOWER, nEn: 'Meteo Shower', nZh: '流星雨', nJa: 'メテオシャワー', c: G_WEAPON, r: G_R4, atk1: 3500, power: -10, cl: G_CL_AUTO_AIM});

const DOUBLE_LASER = 'double_laser';
addItem({n: DOUBLE_LASER, nEn: 'Double Laser', nZh: '双重激光', nJa: 'ダブルレーザー', c: G_WEAPON, r: G_R4, atk1: 2500, power: -5, cl: G_CL_RANGED});

const ROOT_WHIP = 'root_whip';
addItem({n: ROOT_WHIP, nEn: 'Root Whip', nZh: '根茎之鞭', nJa: 'ポイズンルート', c: G_WEAPON, r: G_R4, atk1: 4500, power: -10, cl: G_CL_SPECIAL});

const GOLEM_FIST = 'golem_fist';
addItem({n: GOLEM_FIST, nEn: 'Golem Fist', nZh: '石巨人之拳', nJa: 'ゴーレムフィスト', c: G_WEAPON, r: G_R4, atk1: 3750, power: -10, cl: G_CL_RANGED});

const HEARTH = 'hearth';
addItem({n: HEARTH, nEn: 'Hearth', nZh: '壁炉', nJa: 'ハース', c: G_WEAPON, r: G_R4, atk1: 4500, power: -10, cl: G_CL_SPECIAL});

const HIDDEN_CLAW = 'hidden_claw';
addItem({n: HIDDEN_CLAW, nEn: 'Hidden Claw', nZh: '隐秘之爪', nJa: '隠しクロー', c: G_WEAPON, r: G_R4, atk1: 5000, power: -15, cl: G_CL_MELEE});

const SUNFLOWER = 'sunflower';
addItem({n: SUNFLOWER, nEn: 'Sunflower', nZh: '向日葵', nJa: 'ヒマワリ', c: G_WEAPON, r: G_R4, atk1: 3500, power: -5, cl: G_CL_AUTO_AIM});

// Weapons R3
const BLAZING_MACE = 'blazing_mace';
addItem({n: BLAZING_MACE, nEn: 'Blazing Mace', nZh: '炽烈狼牙棒', nJa: 'ブレイズメイス', c: G_WEAPON, r: G_R3, atk1: 2500, power: -5, cl: G_CL_MELEE});

const EYE_OF_DEATH = 'eye_of_death';
addItem({n: EYE_OF_DEATH, nEn: 'Eye of Death', nZh: '死亡之眼', nJa: 'デスアイ', c: G_WEAPON, r: G_R3, atk1: 4500, power: -10, cl: G_CL_AUTO_AIM});

const FLAMETHROWER = 'flamethrower';
addItem({n: FLAMETHROWER, nEn: 'Flamethrower', nZh: '火焰喷射器', nJa: '火炎放射器', c: G_WEAPON, r: G_R3, atk1: 4500, power: -10, cl: G_CL_SPECIAL});

const GOLDEN_CARP = 'golden_carp';
addItem({n: GOLDEN_CARP, nEn: 'Golden Carp', nZh: '锦鲤', nJa: '金のコイ', c: G_WEAPON, r: G_R3, atk1: 2000, power: -15, cl: G_CL_AUTO_AIM});

const SANTAS_LASER_BELL = 'santas_laser_bell';
addItem({n: SANTAS_LASER_BELL, nEn: 'Santa\'s Laser Bell', nZh: '圣诞老人的激光铃铛', nJa: 'サンタのレーザーベル', c: G_WEAPON, r: G_R3, atk1: 3000, power: -10, cl: G_CL_RANGED});

const TROMBONE_CANNON = 'trombone_cannon';
addItem({n: TROMBONE_CANNON, nEn: 'Trombone Cannon', nZh: '长号大炮', nJa: 'トロンボーンキャノン', c: G_WEAPON, r: G_R3, atk1: 4000, power: -15, cl: G_CL_RANGED});

// Weapons R2
const SPIKE_STRIKE = 'spike_strike';
addItem({n: SPIKE_STRIKE, nEn: 'Spike Strike', nZh: '突刺', nJa: 'スパイクストライク', c: G_WEAPON, r: G_R2, atk1: 3500, power: -5, cl: G_CL_RANGED});

const DOZER_DOUBLE_BLADE = 'dozer_double_blade';
addItem({n: DOZER_DOUBLE_BLADE, nEn: 'Dozer Double Blade', nZh: '双刃推土机', nJa: 'ドーザーダブルブレード', c: G_WEAPON, r: G_R2, atk1: 3500, power: -10, cl: G_CL_MELEE});

const DRAGON_MORTAR = 'dragon_mortar';
addItem({n: DRAGON_MORTAR, nEn: 'Dragon Mortar', nZh: '龙头炮', nJa: 'ドラゴン迫撃砲', c: G_WEAPON, r: G_R2, atk1: 2800, power: -15, cl: G_CL_RANGED});

const BIG_BOY = 'big_boy';
addItem({n: BIG_BOY, nEn: 'Big Boy', nZh: '大男孩', nJa: 'ビッグボーイ', c: G_WEAPON, r: G_R2, atk1: 3500, power: -10, cl: G_CL_RANGED});

const SWIFT_LASER = 'swift_laser';
addItem({n: SWIFT_LASER, nEn: 'Swift Laser', nZh: '迅捷激光', nJa: 'スピードレーザー', c: G_WEAPON, r: G_R2, atk1: 2200, power: -5, cl: G_CL_RANGED});

const CUTTER_ROCKET = 'cutter_rocket';
addItem({n: CUTTER_ROCKET, nEn: 'Cutter Rocket', nZh: '火箭切割机', nJa: 'カッターロケット', c: G_WEAPON, r: G_R2, atk1: 3000, power: -10, cl: G_CL_RANGED});

const SANTAS_DOUBLE_ROCKET = 'santas_double_rocket';
addItem({n: SANTAS_DOUBLE_ROCKET, nEn: 'Santa\'s Double Rocket', nZh: '圣诞老人的双火箭', nJa: 'サンタのダブルロケット', c: G_WEAPON, r: G_R2, atk1: 1750, power: -5, cl: G_CL_RANGED});

// Weapons R1
const ICE_CREAM_MACE = 'ice_cream_mace';
addItem({n: ICE_CREAM_MACE, nEn: 'Ice Cream Mace', nZh: '冰激凌瓦斯', nJa: 'アイスクリームこん棒', c: G_WEAPON, r: G_R1, atk1: 2000, power: -5, cl: G_CL_MELEE});

const CUTTER_CHAINSAW = 'cutter_chainsaw';
addItem({n: CUTTER_CHAINSAW, nEn: 'Cutter Chainsaw', nZh: '链锯切割机', nJa: 'カッターチェーンソー', c: G_WEAPON, r: G_R1, atk1: 4000, power: -10, cl: G_CL_MELEE});

const ROTATING_MEGA_DRILL_G19 = 'rotating_mega_drill_g19';
addItem({n: ROTATING_MEGA_DRILL_G19, nEn: 'Rotating Mega Drill G-19', nZh: '旋转巨型钻头G-19', nJa: '回転メガドリルG-19', c: G_WEAPON, r: G_R1, atk1: 3500, power: -5, cl: G_CL_MELEE});

const ROTATING_HYPERBOLOID_G27 = 'rotating_hyperboloid_g27';
addItem({n: ROTATING_HYPERBOLOID_G27, nEn: 'Rotating Hyperboloid G-27', nZh: '旋转双曲面G-27', nJa: '回転ハイバーボロイドG-27', c: G_WEAPON, r: G_R1, atk1: 2500, power: -5, cl: G_CL_RANGED});


// Wheels R6
const SAND_TIRE = 'sand_tire';
addItem({n: SAND_TIRE, nEn: 'Sand Tire', nZh: '沙地轮', nJa: 'サンドタイヤ', c: G_WHEEL, r: G_R6, s: G_SP_NATURALIS, sip: G_SIP_R6_L, hp1: 20060, b: BONUS_WEAPON_10});

const DEATH_SCOOTER = 'death_scooter';
addItem({n: DEATH_SCOOTER, nEn: 'Death Scooter', nZh: '死亡滑板轮', nJa: 'デススクーター', c: G_WHEEL, r: G_R6, s: G_SP_MECHA, hp1: 9440, b: BONUS_WEAPON_10});

const LIFE_SCOOTER = 'life_scooter';
addItem({n: LIFE_SCOOTER, nEn: 'Life Scooter', nZh: '生命滑板轮', nJa: 'ライフスクーター', c: G_WHEEL, r: G_R6, s: G_SP_MECHA, hp1: 9440, b: BONUS_BODY_10});

const SAND_SCOOTER = 'sand_scooter';
addItem({n: SAND_SCOOTER, nEn: 'Sand Scooter', nZh: '沙地滑板轮', nJa: 'サンドスクーター', c: G_WHEEL, r: G_R6, s: G_SP_NATURALIS, sip: G_SIP_R6_L, hp1: 17700, b: BONUS_BODY_10});

const FLOWER_HOVER = 'flower_hover';
addItem({n: FLOWER_HOVER, nEn: 'Flower Hover', nZh: '鲜花悬浮器', nJa: 'フラワーホバー', c: G_WHEEL, r: G_R6, s: G_SP_NATURALIS, hp1: 9440, atk1: 1200, b: BONUS_BODY_10});

const ONION_THRUSTER = 'onion_thruster';
addItem({n: ONION_THRUSTER, nEn: 'Onion Thruster', nZh: '洋葱推进器', nJa: 'オニオンスラスタ', c: G_WHEEL, r: G_R6, s: G_SP_NATURALIS, hp1: 9440, atk1: 1200, b: BONUS_WEAPON_10});

const MAKI_KNOB = 'maki_knob';
addItem({n: MAKI_KNOB, nEn: 'Maki Knob', nZh: '手卷旋钮轮', nJa: '巻き寿司ノブ', c: G_WHEEL, r: G_R6, s: G_SP_GLUTTONY, hp1: 8260, b: BONUS_BODY_10});

const NARUTO_KNOB = 'naruto_knob';
addItem({n: NARUTO_KNOB, nEn: 'Naruto Knob', nZh: '鱼板旋钮轮', nJa: 'ナルトノブ', c: G_WHEEL, r: G_R6, s: G_SP_GLUTTONY, hp1: 8260, b: BONUS_WEAPON_10});

const NIGIRI_KNOB = 'nigiri_knob';
addItem({n: NIGIRI_KNOB, nEn: 'Nigiri Knob', nZh: '寿司旋钮轮', nJa: '握り寿司ノブ', c: G_WHEEL, r: G_R6, s: G_SP_GLUTTONY, hp1: 8260, b: BONUS_GADGET_10});

const SHUTTLE_KNOB = 'shuttle_knob';
addItem({n: SHUTTLE_KNOB, nEn: 'Shuttle Knob', nZh: '航天飞机旋钮轮', nJa: 'シャトルノブ', c: G_WHEEL, r: G_R6, s: G_SP_MECHA, hp1: 8260, b: BONUS_WEAPON_10});

const SPACE_KNOB = 'space_knob';
addItem({n: SPACE_KNOB, nEn: 'Space Knob', nZh: '太空旋钮轮', nJa: 'スペースノブ', c: G_WHEEL, r: G_R6, s: G_SP_MECHA, hp1: 8260, b: BONUS_BODY_10});

const BIG_PUMPKIN_WHEEL = 'big_pumpkin_wheel';
addItem({n: BIG_PUMPKIN_WHEEL, nEn: 'Big Pumpkin Wheel', nZh: '大南瓜车轮', nJa: 'ビッグパンプキンホイール', c: G_WHEEL, r: G_R6, s: G_SP_GLUTTONY, hp1: 8260, atk1: 1750, b: BONUS_WEAPON_10});

const SMALL_PUMPKIN_WHEEL = 'small_pumpkin_wheel';
addItem({n: SMALL_PUMPKIN_WHEEL, nEn: 'Small Pumpkin Wheel', nZh: '小南瓜车轮', nJa: 'スモールパンプキンホイール', c: G_WHEEL, r: G_R6, s: G_SP_GLUTTONY, hp1: 7670, atk1: 1250, b: BONUS_WEAPON_10});

const COCONUT_KNOB = 'coconut_knob';
addItem({n: COCONUT_KNOB, nEn: 'Coconut Knob', nZh: '椰子旋钮轮', nJa: 'ココナットノブ', c: G_WHEEL, r: G_R6, s: G_SP_NATURALIS, hp1: 9440, b: BONUS_GADGET_25});

const SEASHELL_ROLLER = 'seashell_roller';
addItem({n: SEASHELL_ROLLER, nEn: 'Seashell Roller', nZh: '海贝滚轮', nJa: 'シーシェルローラー', c: G_WHEEL, r: G_R6, s: G_SP_NATURALIS, hp1: 18880, b: BONUS_WEAPON_15});

// Wheels R5
const BOOST_SCOOTER = 'boost_scooter';
addItem({n: BOOST_SCOOTER, nEn: 'Boost Scooter', nZh: '加速滑板轮', nJa: 'ブーストスクーター', c: G_WHEEL, r: G_R5, hp1: 9440, b: BONUS_WEAPON_10});

const DIAMOND_SLOW_SCOOTER = 'diamond_slow_scooter';
addItem({n: DIAMOND_SLOW_SCOOTER, nEn: 'Diamond Slow Scooter', nZh: '钻石慢速滑板轮', nJa: 'ダイヤモンドスロースクーター', c: G_WHEEL, r: G_R5, hp1: 6490, b: BONUS_WEAPON_10});

const DIAMOND_SLOW_ROLLER = 'diamond_slow_roller';
addItem({n: DIAMOND_SLOW_ROLLER, nEn: 'Diamond Slow Roller', nZh: '钻石慢速滚轮', nJa: 'ダイヤモンドスローローラー', c: G_WHEEL, r: G_R5, hp1: 5900, b: BONUS_BODY_10});

const BANDIT_KNOB = 'bandit_knob';
addItem({n: BANDIT_KNOB, nEn: 'Bandit Knob', nZh: '强盗旋钮轮', nJa: 'バンディットノブ', c: G_WHEEL, r: G_R5, hp1: 7080, b: BONUS_BODY_10});

const BOOST_KNOB = 'boost_knob';
addItem({n: BOOST_KNOB, nEn: 'Boost Knob', nZh: '加速旋钮轮', nJa: 'ブーストノブ', c: G_WHEEL, r: G_R5, hp1: 7080, b: BONUS_BODY_10});

const ROGUE_KNOB = 'rogue_knob';
addItem({n: ROGUE_KNOB, nEn: 'Rogue Knob', nZh: '流氓旋钮轮', nJa: 'ローグノブ', c: G_WHEEL, r: G_R5, hp1: 7080, b: BONUS_GADGET_10});

const STINGY_KNOB = 'stingy_knob';
addItem({n: STINGY_KNOB, nEn: 'Stingy Knob', nZh: '尖刺旋钮轮', nJa: 'スティンギーノブ', c: G_WHEEL, r: G_R5, hp1: 7080, b: BONUS_WEAPON_10});

const GOLEM_TRACKS = 'golem_tracks';
addItem({n: GOLEM_TRACKS, nEn: 'Golem Tracks', nZh: '石巨人履带', nJa: 'ゴーレム無限軌道', c: G_WHEEL, r: G_R5, hp1: 7080, b: BONUS_BODY_10});

// Wheels R4
const TRAIN_DOUBLE_ROLLER = 'train_double_roller';
addItem({n: TRAIN_DOUBLE_ROLLER, nEn: 'Train Double Roller', nZh: '火车双辊', nJa: 'トレインダブルローラー', c: G_WHEEL, r: G_R4, hp1: 7080});

const BIG_TANK_TRACKS = 'big_tank_tracks';
addItem({n: BIG_TANK_TRACKS, nEn: 'Big Tank Tracks', nZh: '大坦克履带', nJa: 'ビッグタンクローリー', c: G_WHEEL, r: G_R4, hp1: 7080});

// Wheels R3
const DRAGON_ROLLER = 'dragon_roller';
addItem({n: DRAGON_ROLLER, nEn: 'Dragon Roller', nZh: '龙辊', nJa: 'ドラゴンローラー', c: G_WHEEL, r: G_R3, hp1: 5900});

const DRAGON_KNOB = 'dragon_knob';
addItem({n: DRAGON_KNOB, nEn: 'Dragon Knob', nZh: '龙旋钮', nJa: 'ドラゴンノブ', c: G_WHEEL, r: G_R3, hp1: 5310});

const STIFF_ROLLER = 'stiff_roller';
addItem({n: STIFF_ROLLER, nEn: 'Stiff Roller', nZh: '坚硬滚轮', nJa: 'スティッフローラー', c: G_WHEEL, r: G_R3, hp1: 5192});

const TRAIN_GUIDE_KNOB = 'train_guide_knob';
addItem({n: TRAIN_GUIDE_KNOB, nEn: 'Train Guide Knob', nZh: '火车导向旋钮轮', nJa: 'トレインガイドノブ', c: G_WHEEL, r: G_R3, hp1: 5900});

const TANK_TRACKS = 'tank_tracks';
addItem({n: TANK_TRACKS, nEn: 'Tank Tracks', nZh: '坦克履带', nJa: 'タンクローリー', c: G_WHEEL, r: G_R3, hp1: 5900});

// Wheels R2
const SANTAS_STICKY_TIRE = 'santas_sticky_tire';
addItem({n: SANTAS_STICKY_TIRE, nEn: 'Santas Sticky Tire', nZh: '圣诞老人的粘性轮胎', nJa: 'サンタのスティッキータイヤ', c: G_WHEEL, r: G_R2, hp1: 6560});

const ANTI_GRAVITY_SCOOTER_X19 = 'anti_gravity_scooter_x19';
addItem({n: ANTI_GRAVITY_SCOOTER_X19, nEn: 'Anti-Gravity Scooter X-19', nZh: '反重力滑板车X-19', nJa: '反重力スクーターX-19', c: G_WHEEL, r: G_R2, hp1: 5711});

const ANTI_GRAVITY_SCOOTER_X70 = 'anti_gravity_scooter_x70';
addItem({n: ANTI_GRAVITY_SCOOTER_X70, nEn: 'Anti-Gravity Scooter X-70', nZh: '反重力滑板车X-70', nJa: '反重力スクーターX-70', c: G_WHEEL, r: G_R2, hp1: 5711});

const ICE_CREAM_TRUCK_DRIVE_SCOOTER = 'ice_cream_truck_drive_scooter';
addItem({n: ICE_CREAM_TRUCK_DRIVE_SCOOTER, nEn: 'Ice Cream Truck Drive Scooter', nZh: '冰上滑行车', nJa: 'アイスドライブスクーター', c: G_WHEEL, r: G_R2, hp1: 5711});

const ANTI_GRAVITY_ROLLER = 'anti_gravity_roller';
addItem({n: ANTI_GRAVITY_ROLLER, nEn: 'Anti-Gravity Roller', nZh: '反重力滚轮', nJa: '反重力ローラー', c: G_WHEEL, r: G_R2, hp1: 5192});

const FIRE_ENGINE_DOUBLE_ROLLER = 'fire_engine_double_roller';
addItem({n: FIRE_ENGINE_DOUBLE_ROLLER, nEn: 'Fire Engine Double Roller', nZh: '火焰双辊', nJa: 'ファイヤーダブルローラー', c: G_WHEEL, r: G_R2, hp1: 5900});

const ANTI_GRAVITY_KNOB = 'anti_gravity_knob';
addItem({n: ANTI_GRAVITY_KNOB, nEn: 'Anti-Gravity Knob', nZh: '反重力旋钮轮', nJa: '反重力ノブ', c: G_WHEEL, r: G_R2, hp1: 4672});

const DOZER_DRIVE_KNOB = 'dozer_drive_knob';
addItem({n: DOZER_DRIVE_KNOB, nEn: 'Dozer Drive Knob', nZh: '推土机驱动柄', nJa: 'ドーザーシフトノブ', c: G_WHEEL, r: G_R2, hp1: 4672});

// Wheels R1
const CUTTER_DRIVE_BIGFOOT = 'cutter_drive_bigfoot';
addItem({n: CUTTER_DRIVE_BIGFOOT, nEn: 'Cutter Drive Bigfoot', nZh: '大轮切割机', nJa: 'カッタードライブビッグフット', c: G_WHEEL, r: G_R1, hp1: 7164});

const CORSAIR_DRIVE_TIRE = 'corsair_drive_tire';
addItem({n: CORSAIR_DRIVE_TIRE, nEn: 'Corsair Drive Tire', nZh: '海盗船驱动轮胎', nJa: '海賊ドライブタイヤ', c: G_WHEEL, r: G_R1, hp1: 5970});

const CUTTER_TIRE = 'cutter_tire';
addItem({n: CUTTER_TIRE, nEn: 'Cutter Tire', nZh: '切割机轮胎', nJa: 'カッタータイヤ', c: G_WHEEL, r: G_R1, hp1: 5970});

const COACH_TIRE = 'coach_tire';
addItem({n: COACH_TIRE, nEn: 'Coach Tire', nZh: '马车轱辘轮', nJa: 'コーチタイヤ', c: G_WHEEL, r: G_R1, hp1: 5970});

const ICE_CREAM_TRUCK_GUIDE_SCOOTER = 'ice_cream_truck_guide_scooter';
addItem({n: ICE_CREAM_TRUCK_GUIDE_SCOOTER, nEn: 'Ice Cream Truck Guide Scooter', nZh: '冰上导航滑行车', nJa: 'アイスガイドスクーター', c: G_WHEEL, r: G_R1, hp1: 5192});

const SLOW_SCOOTER = 'slow_scooter';
addItem({n: SLOW_SCOOTER, nEn: 'Slow Scooter', nZh: '慢速滑板轮', nJa: 'スロースクーター', c: G_WHEEL, r: G_R1, hp1: 5192});

const CORSAIR_GUIDE_ROLLER = 'corsair_guide_roller';
addItem({n: CORSAIR_GUIDE_ROLLER, nEn: 'Corsair Guide Roller', nZh: '海盗船导辊', nJa: '海賊ガイドローラー', c: G_WHEEL, r: G_R1, hp1: 4720});

const FIRE_ENGINE_GUIDE_ROLLER = 'fire_engine_guide_roller';
addItem({n: FIRE_ENGINE_GUIDE_ROLLER, nEn: 'Fire Engine Guide Roller', nZh: '火焰导辊', nJa: 'ファイヤーガイドローラー', c: G_WHEEL, r: G_R1, hp1: 4720});

const SLOW_ROLLER = 'slow_roller';
addItem({n: SLOW_ROLLER, nEn: 'Slow Roller', nZh: '慢速滚轮', nJa: 'スローローラー', c: G_WHEEL, r: G_R1, hp1: 4720});

const SANTAS_STICKY_ROLLER = 'santas_sticky_roller';
addItem({n: SANTAS_STICKY_ROLLER, nEn: 'Santas Sticky Roller', nZh: '圣诞老人的粘辊', nJa: 'サンタのスティッキーローラー', c: G_WHEEL, r: G_R1, hp1: 4720});

const COACH_ROLLER = 'coach_roller';
addItem({n: COACH_ROLLER, nEn: 'Coach Roller', nZh: '马车滚轮', nJa: '駅馬車ローラー', c: G_WHEEL, r: G_R1, hp1: 5192});

const DOZER_GUIDE_KNOB = 'dozer_guide_knob';
addItem({n: DOZER_GUIDE_KNOB, nEn: 'Dozer Guide Knob', nZh: '推土机导柄', nJa: 'ドーザーガイドノブ', c: G_WHEEL, r: G_R1, hp1: 4248});


// Gadgets R6
const COFFEE = 'coffee_cup';
addItem({n: COFFEE , nEn: 'Coffee Cup', nZh: '咖啡杯', nJa: 'コーヒーカップ', c: G_GADGET, r: G_R6, s: G_SP_GLUTTONY, hp1: 16284, power: 5, cl: G_CL_SPECIAL, b: BONUS_WEAPON_15});

const DEFLECTING_SHIELD = 'deflecting_shield';
addItem({n: DEFLECTING_SHIELD, nEn: 'Deflecting Shield', nZh: '偏转盾牌', nJa: '偏向シールド', c: G_GADGET, r: G_R6, s: G_SP_MECHA, hp1: 16520, power: -10, cl: G_CL_SPECIAL, b: BONUS_BODY_10});

const ENRAGER = 'enrager';
addItem({n: ENRAGER, nEn: 'Enrager', nZh: '激怒器', nJa: 'エンレイジャー', c: G_GADGET, r: G_R6, s: G_SP_GLUTTONY, hp1: 14632, power: -10, cl: G_CL_SPECIAL, b: BONUS_GADGET_10});

const GEYSER = 'geyser';
addItem({n: GEYSER, nEn: 'Geyser', nZh: '间歇泉', nJa: 'ガイザー', c: G_GADGET, r: G_R6, s: G_SP_NATURALIS, sip: G_SIP_R6_L, hp1: 18880, power: -5, cl: G_CL_AUTO_AIM, b: BONUS_GADGET_10});

const KITTY_GHOST = 'kitty_ghost';
addItem({n: KITTY_GHOST, nEn: 'Kitty Ghost', nZh: '猫咪鬼魂', nJa: 'キティゴースト', c: G_GADGET, r: G_R6, s: G_SP_MECHA, hp1: 16284, power: -5, cl: G_CL_AUTO_AIM, b: BONUS_WEAPON_10});

const HEALING_DRONE = 'healing_drone';
addItem({n: HEALING_DRONE, nEn: 'Healing Drone', nZh: '治疗无人机', nJa: '回復ドローン', c: G_GADGET, r: G_R6, s: G_SP_NATURALIS, hp1: 16284, mHp1: 32000, power: -5, cl: G_CL_MINION, b: BONUS_BODY_10});

const HUNGRY_HOOK = 'hungry_hook';
addItem({n: HUNGRY_HOOK, nEn: 'Hungry Hook', nZh: '饥饿勾索', nJa: 'ハングリーフック', c: G_GADGET, r: G_R6, s: G_SP_GLUTTONY, hp1: 14632, power: -5, cl: G_CL_RANGED, b: BONUS_BODY_10});

const PARALYZING_POTION = 'paralyzing_potion';
addItem({n: PARALYZING_POTION, nEn: 'Paralyzing Potion', nZh: '麻痹药水', nJa: 'しびれポーション', c: G_GADGET, r: G_R6, s: G_SP_MECHA, hp1: 13334, power: -10, cl: G_CL_RANGED, b: BONUS_WEAPON_10});

const SQUID_CANNON = 'squid_cannon';
addItem({n: SQUID_CANNON , nEn: 'Squid Cannon', nZh: '鱿鱼炮', nJa: 'イカ大砲', c: G_GADGET, r: G_R6, s: G_SP_NATURALIS, hp1: 20072, power: -10, cl: G_CL_AUTO_AIM, b: BONUS_WHEEL_10});

const SWAPPER = 'swapper';
addItem({n: SWAPPER, nEn: 'Swapper', nZh: '交换器', nJa: 'スワッパー', c: G_GADGET, r: G_R6, s: G_SP_MECHA, hp1: 19116, power: -5, cl: G_CL_SPECIAL, b: BONUS_WEAPON_10});

const VOODOO_DOLL = 'voodoo_doll';
addItem({n: VOODOO_DOLL, nEn: 'Voodoo Doll', nZh: '巫毒娃娃', nJa: 'ブードゥー人形', c: G_GADGET, r: G_R6, s: G_SP_GLUTTONY, hp1: 19116, power: -10, cl: G_CL_SPECIAL, b: BONUS_GADGET_10});

const WATER_BLASTER = 'water_blaster';
addItem({n: WATER_BLASTER, nEn: 'Water Blaster', nZh: '水爆枪', nJa: 'ウォーターブラスター', c: G_GADGET, r: G_R6, s: G_SP_NATURALIS, sip: G_SIP_R6_L, hp1: 19470, power: -5, cl: G_CL_SPECIAL, b: BONUS_BODY_10});

// Gadgets R5
const BOXING_GLOVE = 'boxing_glove';
addItem({n: BOXING_GLOVE, nEn: 'Boxing Glove', nZh: '拳击手套', nJa: 'ボクシンググローブ', c: G_GADGET, r: G_R5, hp1: 4720, power: -5, cl: G_CL_MELEE, b: BONUS_WEAPON_10});

const DIAMOND_LOTUS = 'diamond_lotus';
addItem({n: DIAMOND_LOTUS, nEn: 'Diamond Lotus', nZh: '钻石莲花', nJa: 'ダイヤモンド蓮', c: G_GADGET, r: G_R5, hp1: 4720, power: 5, cl: G_CL_SPECIAL, b: BONUS_WEAPON_10});

const FIREWORK = 'firework';
addItem({n: FIREWORK, nEn: 'Firework', nZh: '烟花', nJa: '花火', c: G_GADGET, r: G_R5, hp1: 9440, power: -5, cl: G_CL_AUTO_AIM, b: BONUS_BODY_10});

const LIFESTONE = 'lifestone';
addItem({n: LIFESTONE, nEn: 'Lifestone', nZh: '生命石', nJa: 'ライフストーン', c: G_GADGET, r: G_R5, hp1: 9440, power: -10, b: BONUS_BODY_10, cl: G_CL_SPECIAL});

const RUNE_OF_PROTECTION = 'rune_of_protection';
addItem({n: RUNE_OF_PROTECTION, nEn: 'Rune Of Protection', nZh: '保护符文', nJa: '守りのルーン', c: G_GADGET, r: G_R5, hp1: 7080, power: -10, cl: G_CL_SPECIAL, b: BONUS_BODY_10});

const SCRAMBLER = 'scrambler';
addItem({n: SCRAMBLER, nEn: 'Scrambler', nZh: '扰频器', nJa: 'スクランブラー', c: G_GADGET, r: G_R5, hp1: 7080, power: -10, cl: G_CL_SPECIAL, b: BONUS_BODY_10});

const STOP_SIGN = 'stop_sign';
addItem({n: STOP_SIGN, nEn: 'Stop Sign', nZh: '停止标志', nJa: '停止標識', c: G_GADGET, r: G_R5, hp1: 4720, power: -10, b: BONUS_WEAPON_10, cl: G_CL_SPECIAL,});

// Gadgets R4
const FLUE = 'flue';
addItem({n: FLUE, nEn: 'Flue', nZh: '烟道', nJa: 'フルー', c: G_GADGET, r: G_R4, hp1: 4720, power: -5, cl: G_CL_RANGED});

const SKULL_GOBLET = 'skull_goblet';
addItem({n: SKULL_GOBLET, nEn: 'Skull Goblet', nZh: '骷髅酒杯', nJa: 'スカルゴブレット', c: G_GADGET, r: G_R4, hp1: 5900, power: -5, cl: G_CL_SPECIAL});

const ELECTRIC_LASSO = 'electric_lasso';
addItem({n: ELECTRIC_LASSO, nEn: 'Electric Lasso', nZh: '带电套索', nJa: '電気投げ縄', c: G_GADGET, r: G_R4, hp1: 4720, power: -5, cl: G_CL_RANGED});

// Gadgets R3
const ELECTRIFIED_BARBED_WIRE = 'electrified_barbed_wire';
addItem({n: ELECTRIFIED_BARBED_WIRE, nEn: 'Electrified Barbed Wire', nZh: '带电铁丝网', nJa: '電流有刺鉄線', c: G_GADGET, r: G_R3, hp1: 4720, power: -5, cl: G_CL_MELEE});

const ENERGY_SHIELD = 'energy_shield';
addItem({n: ENERGY_SHIELD, nEn: 'Energy Shield', nZh: '能量护盾', nJa: 'エネルギーシルド', c: G_GADGET, r: G_R3, hp1: 2360, power: -10, cl: G_CL_SPECIAL});

const FROST_SPRINKLER = 'frost_sprinkler';
addItem({n: FROST_SPRINKLER, nEn: 'Frost Sprinkler', nZh: '制冷器', nJa: 'フリーザー', c: G_GADGET, r: G_R3, hp1: 4720, power: -15, cl: G_CL_RANGED});

const LOTUS = 'lotus';
addItem({n: LOTUS, nEn: 'Lotus', nZh: '莲花', nJa: '蓮', c: G_GADGET, r: G_R3, hp1: 2360, power: 5, cl: G_CL_SPECIAL});

const MAGIC_LAMP = 'magic_lamp';
addItem({n: MAGIC_LAMP, nEn: 'Magic_lamp', nZh: '魔法灯', nJa: '魔法のランプ', c: G_GADGET, r: G_R3, hp1: 2360, power: -5, cl: G_CL_SPECIAL});

const NANOBOTS_STATION = 'nanobots_station';
addItem({n: NANOBOTS_STATION, nEn: 'Nanobots Station', nZh: '纳米机器人站', nJa: 'ナノボットステーション', c: G_GADGET, r: G_R3, hp1: 4720, power: -5, cl: G_CL_SPECIAL});

const SANTAS_FREEZING_GIFT = 'santas_freezing_gift';
addItem({n: SANTAS_FREEZING_GIFT, nEn: 'Santas Freezing Gift', nZh: '圣诞老人的冷冻礼物', nJa: 'サンタのフリージングギフト', c: G_GADGET, r: G_R3, hp1: 4720, power: -5, cl: G_CL_MELEE});

// Gadgets R2
const INVERSE_THRUSTER = 'inverse_thruster';
addItem({n: INVERSE_THRUSTER, nEn: 'Inverse Thruster', nZh: '反向推进器', nJa: '逆スラスタ', c: G_GADGET, r: G_R2, hp1: 4720, power: 0, cl: G_CL_SPECIAL});

const BLASTY_NUDGE = 'blasty_nudge';
addItem({n: BLASTY_NUDGE, nEn: 'Blasty Nudge', nZh: '爆裂推进器', nJa: 'ブラストプッシュ', c: G_GADGET, r: G_R2, hp1: 4720, power: 0, cl: G_CL_SPECIAL});

const LUCKY_HORSESHOE = 'lucky_horseshoe';
addItem({n: LUCKY_HORSESHOE, nEn: 'Lucky Horseshoe', nZh: '幸运马蹄铁', nJa: '幸運の蹄鉄', c: G_GADGET, r: G_R2, hp1: 4720, power: -5, cl: G_CL_AUTO_AIM});

// Gadgets R1
const DOZER_FORKLIFT = 'dozer_forklift';
addItem({n: DOZER_FORKLIFT, nEn: 'Dozer Forklift', nZh: '推土机铲车', nJa: 'ドーザーフォークリフト', c: G_GADGET, r: G_R1, hp1: 4720, power: 0, cl: G_CL_MELEE});

const CORSAIR_HARPOON = 'corsair_harpoon';
addItem({n: CORSAIR_HARPOON, nEn: 'Corsair Harpoon', nZh: '海盗船鱼叉', nJa: '海賊のハープーン', c: G_GADGET, r: G_R1, hp1: 4720, power: -5, cl: G_CL_RANGED});

const CUTTER_REPULSE = 'cutter_repulse';
addItem({n: CUTTER_REPULSE, nEn: 'Cutter Repulse', nZh: '切割机反推器', nJa: 'カッターリパルサー', c: G_GADGET, r: G_R1, hp1: 4720, power: -5, cl: G_CL_MELEE});

// Upgrade cost
const upgradeCosts = {
  [G_R1]: [
      {p: 0, c: 0, t: 0}, // 0
      {p: 0, c: 0, t: 0},
      {p: 2, c: 10, t: 0},
      {p: 3, c: 50, t: 0},
      {p: 4, c: 100, t: 0},
      {p: 5, c: 150, t: 0},  // 5
      {p: 6, c: 200, t: 0},
      {p: 7, c: 300, t: 0},
      {p: 8, c: 400, t: 0},
      {p: 9, c: 600, t: 0},
      {p: 14, c: 800, t: 0},  // 10
      {p: 19, c: 2000, t: 0},
      {p: 29, c: 5000, t: 0},
      {p: 49, c: 15000, t: 0},
      {p: 59, c: 20000, t: 0},
      {p: 79, c: 25000, t: 10},  // 15
      {p: 99, c: 30000, t: 12},
      {p: 119, c: 35000, t: 14},
      {p: 144, c: 40000, t: 16},
      {p: 169, c: 45000, t: 18},
      {p: 194, c: 50000, t: 20},  // 20
  ],
  [G_R2]: [
      {p: 0, c: 0, t: 0},  // 0
      {p: 0, c: 0, t: 0},
      {p: 1, c: 20, t: 0},
      {p: 2, c: 100, t: 0},
      {p: 3, c: 200, t: 0},
      {p: 4, c: 300, t: 0},  // 5
      {p: 5, c: 400, t: 0},
      {p: 5, c: 600, t: 0},
      {p: 5, c: 800, t: 0},
      {p: 6, c: 1200, t: 0},
      {p: 9, c: 1600, t: 0},  // 10
      {p: 14, c: 4000, t: 0},
      {p: 19, c: 8000, t: 0},
      {p: 34, c: 25000, t: 0},
      {p: 49, c: 32500, t: 0},
      {p: 64, c: 40000, t: 20},  // 15
      {p: 79, c: 47500, t: 24},
      {p: 94, c: 55000, t: 28},
      {p: 114, c: 62500, t: 32},
      {p: 134, c: 70000, t: 36},
      {p: 154, c: 77500, t: 40},  // 20
  ],
  [G_R3]: [
      {p: 0, c: 0, t: 0},  // 0
      {p: 0, c: 0, t: 0},
      {p: 1, c: 50, t: 0},
      {p: 1, c: 250, t: 0},
      {p: 1, c: 500, t: 0},
      {p: 2, c: 750, t: 0},  // 5
      {p: 2, c: 1000, t: 0},
      {p: 2, c: 1500, t: 0},
      {p: 2, c: 2000, t: 0},
      {p: 3, c: 3000, t: 0},
      {p: 4, c: 4000, t: 0},  // 10
      {p: 5, c: 7500, t: 0},
      {p: 7, c: 12500, t: 0},
      {p: 14, c: 50000, t: 0},
      {p: 24, c: 75000, t: 0},
      {p: 34, c: 100000, t: 30},  // 15
      {p: 44, c: 125000, t: 36},
      {p: 54, c: 150000, t: 42},
      {p: 69, c: 175000, t: 48},
      {p: 84, c: 200000, t: 54},
      {p: 99, c: 225000, t: 60},  // 20
  ],
  [G_R4]: [
      {p: 0, c: 0, t: 0},  // 0
      {p: 0, c: 0, t: 0},
      {p: 1, c: 1000, t: 0},
      {p: 1, c: 1500, t: 0},
      {p: 1, c: 2000, t: 0},
      {p: 1, c: 2500, t: 0},  // 5
      {p: 2, c: 5000, t: 0},
      {p: 2, c: 7500, t: 0},
      {p: 2, c: 10000, t: 0},
      {p: 2, c: 15000, t: 0},
      {p: 3, c: 20000, t: 0},  // 10
      {p: 4, c: 30000, t: 0},
      {p: 5, c: 50000, t: 0},
      {p: 11, c: 100000, t: 0},
      {p: 19, c: 135000, t: 0},
      {p: 27, c: 170000, t: 40},  // 15
      {p: 35, c: 205000, t: 48},
      {p: 43, c: 240000, t: 56},
      {p: 53, c: 275000, t: 64},
      {p: 63, c: 310000, t: 72},
      {p: 73, c: 345000, t: 80},  // 20
  ],
  [G_R5]: [
      {p: 0, c: 0, t: 0},  // 0
      {p: 0, c: 0, t: 0},
      {p: 1, c: 3000, t: 0},
      {p: 1, c: 4500, t: 0},
      {p: 1, c: 6000, t: 0},
      {p: 1, c: 7500, t: 0},  // 5
      {p: 2, c: 15000, t: 0},
      {p: 2, c: 22500, t: 0},
      {p: 2, c: 30000, t: 0},
      {p: 2, c: 45000, t: 0},
      {p: 2, c: 60000, t: 0},  // 10
      {p: 3, c: 90000, t: 0},
      {p: 3, c: 150000, t: 0},
      {p: 7, c: 300000, t: 0},
      {p: 11, c: 350000, t: 0},
      {p: 13, c: 400000, t: 50},  // 15
      {p: 15, c: 450000, t: 60},
      {p: 17, c: 500000, t: 70},
      {p: 22, c: 550000, t: 80},
      {p: 27, c: 600000, t: 90},
      {p: 32, c: 650000, t: 100},  // 20
  ],
  [G_R6]: [
      {p: 0, c: 0, t: 0},  // 0
      {p: 0, c: 0, t: 0},
      {p: 2, c: 8000, t: 0},
      {p: 2, c: 12000, t: 0},
      {p: 3, c: 16000, t: 0},
      {p: 3, c: 25000, t: 1},  // 5
      {p: 4, c: 30000, t: 4},
      {p: 4, c: 50000, t: 8},
      {p: 5, c: 75000, t: 13},
      {p: 6, c: 125000, t: 19},
      {p: 8, c: 175000, t: 26},  // 10
      {p: 10, c: 250000, t: 34},
      {p: 12, c: 325000, t: 43},
      {p: 15, c: 425000, t: 53},
      {p: 20, c: 525000, t: 64},
      {p: 25, c: 650000, t: 76},  // 15
      {p: 30, c: 800000, t: 89},
      {p: 35, c: 900000, t: 103},
      {p: 40, c: 1000000, t: 118},
  ],
};

// Given an item of `level` and `rarity`, return a list of cost. The cost table
// contains 16 elements for R6 items and 19 otherwise. The i-th item is the
// cost to upgrade the item to level i from the current level.
//
// Each element in the returned list is an object with the following entries:
// * p: The number of pieces needed.
// * c: The number of UC needed.
// * t: The number of token needed.
const estimateCosts = (level, rarity) => {
  const list = upgradeCosts[rarity];
  logger.log('estimateCosts', level, rarity, list);
  if (!list) {
    return {p: 0, c: 0, t: 0};
  }
  const results = [{i: 0, p: 0, c: 0, t: 0}];
  let p = 0, c = 0, t = 0;
  for (let i = 1; i <= maxLevelFromRarity(rarity); ++i) {
    if (i > level) {
      p += list[i].p;
      c += list[i].c;
      t += list[i].t;
    }
    results.push({i: i, p: p, c: c, t: t});
  }
  return results;
};
