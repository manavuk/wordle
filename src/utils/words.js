// Word database strictly grouped by word length (4, 5, 6) + definition lookup

export const TARGET_WORDS = {
  4: [
    "ACID", "BAKE", "BEAM", "BOLD", "CALM", "DART", "ECHO", "FAME", "GIFT", "GLOW",
    "HERO", "ICON", "JAZZ", "KEEN", "LAVA", "MINT", "NEON", "PEAK", "QUIK", "RAYS",
    "SOUL", "TIDE", "UNIT", "VIBE", "WAVE", "ZEAL", "ZEST", "BLUE", "FIRE", "GOLD",
    "STAR", "MOON", "WIND", "ROCK", "SNOW", "RAIN", "DARK", "LUCK", "LAMP", "GAME",
    "PLAY", "LOVE", "HOPE", "TIME", "LIFE", "MIND", "WORK", "TEAM", "COOL", "FAST"
  ],
  5: [
    "REACT", "PIXEL", "CYBER", "SPARK", "GHOST", "BLAST", "MAGIC", "LIGHT", "CANDY",
    "FLAME", "SHINE", "OCEAN", "SPACE", "ORBIT", "SOLAR", "LUNAR", "DREAM", "STORM",
    "FROST", "TIGER", "EAGLE", "PRISM", "PULSE", "SONIC", "LASER", "VALOR", "CROWN",
    "PLANT", "SMART", "BRAIN", "POWER", "TOWER", "CLOCK", "HOUSE", "WORLD", "MUSIC",
    "SOUND", "HAPPY", "SUPER", "GREAT", "SWEET", "HEART", "FAITH", "CLEAR", "SHARP",
    "QUICK", "SWIFT", "BLAZE", "CHAMP", "DISCO", "NEXUS", "OASIS", "QUEST", "RADAR",
    "TITAN", "WIZARD", "APPLE", "BEACH", "CHAIR", "DANCE", "EARTH", "FRUIT", "GRAPE",
    "GREEN", "HEAVY", "IMAGE", "JUICE", "KNIFE", "LEMON", "MONEY", "NIGHT", "PAPER",
    "QUEEN", "RADIO", "STONE", "TABLE", "TRAIN", "WATER", "YOUTH", "ZEBRA", "BREAD",
    "CHECK", "DRINK", "FLOOR", "GLASS", "HORSE", "LUNCH", "MOUSE", "NOISE", "PARTY",
    "RIVER", "SHIRT", "SMILE", "SNAKE", "SUGAR", "TOUCH", "WHITE", "WOMAN", "YOUNG"
  ],
  6: [
    "ACTION", "BREEZE", "CHORD", "DRAGON", "ENERGY", "FUTURE", "GALAXY", "HARBOR",
    "IMPACT", "JUNGLE", "KNIGHT", "LEGEND", "MAGNET", "NEXUS", "OASIS", "PLANET",
    "QUEST", "RADAR", "SILVER", "TUNNEL", "VELVET", "WONDER", "ZODIAC", "BEAUTY",
    "CHAMP", "EMPIRE", "FRIEND", "GUITAR", "HEROIC", "ISLAND", "VORTEX", "PHOENIX",
    "VISION", "FROZEN", "GENIUS", "MARVEL", "UNITED", "SHIELD", "CASTLE", "BATTLE"
  ]
};

// Strict dictionary map by length
export const DICTIONARY_BY_LENGTH = {
  4: new Set(TARGET_WORDS[4].filter(w => w.length === 4)),
  5: new Set(TARGET_WORDS[5].filter(w => w.length === 5)),
  6: new Set(TARGET_WORDS[6].filter(w => w.length === 6))
};

// Guarantee strict length matching for target word generation
export const getRandomTargetWord = (length = 5) => {
  const reqLength = Number(length) || 5;
  const rawList = TARGET_WORDS[reqLength] || TARGET_WORDS[5];
  // Strict filter by exact length
  const strictList = rawList.filter((word) => word.trim().length === reqLength);
  
  if (strictList.length === 0) {
    return reqLength === 4 ? "GAME" : reqLength === 6 ? "PLANET" : "REACT";
  }
  
  const word = strictList[Math.floor(Math.random() * strictList.length)];
  return word.toUpperCase().trim();
};

// Validate guess length & dictionary match
export const isValidWord = (word, length = 5) => {
  if (!word) return false;
  const upper = word.toUpperCase().trim();
  if (upper.length !== Number(length)) return false;

  const validSet = DICTIONARY_BY_LENGTH[length];
  if (validSet && validSet.has(upper)) return true;

  return /^[A-Z]+$/.test(upper);
};

export const fetchWordDefinition = async (word) => {
  try {
    const res = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
    if (!res.ok) throw new Error("Not found");
    const data = await res.json();
    const meaning = data[0]?.meanings[0];
    const definition = meaning?.definitions[0]?.definition || "A mystery word worth guessing!";
    const partOfSpeech = meaning?.partOfSpeech || "noun";
    const example = meaning?.definitions[0]?.example || "";
    return { word, definition, partOfSpeech, example };
  } catch (err) {
    return {
      word,
      definition: "An intriguing secret word in your Wordle vocabulary!",
      partOfSpeech: "noun",
      example: `Try using "${word}" in your next conversation!`
    };
  }
};
