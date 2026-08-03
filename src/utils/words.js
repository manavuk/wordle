import dictionaryData from './dictionaryData.json';

// Secret target words for game answers (curated recognizable words)
export const TARGET_WORDS = {
  4: [
    "ACID", "BAKE", "BEAM", "BOLD", "CALM", "DART", "ECHO", "FAME", "GIFT", "GLOW",
    "HERO", "ICON", "JAZZ", "KEEN", "LAVA", "MINT", "NEON", "PEAK", "QUIK", "RAYS",
    "SOUL", "TIDE", "UNIT", "VIBE", "WAVE", "ZEAL", "ZEST", "BLUE", "FIRE", "GOLD",
    "STAR", "MOON", "WIND", "ROCK", "SNOW", "RAIN", "DARK", "LUCK", "LAMP", "GAME",
    "PLAY", "LOVE", "HOPE", "TIME", "LIFE", "MIND", "WORK", "TEAM", "COOL", "FAST",
    "BIRD", "BOAT", "BOOK", "BUSH", "CAKE", "CAMP", "CARD", "CARE", "CITY", "CLUB",
    "COAT", "CODE", "COIN", "COLD", "COOK", "DOOR", "DUST", "DUTY", "EARN", "EAST",
    "EDGE", "EXAM", "FACE", "FACT", "FARM", "FISH", "FLAG", "FOOD", "FOOT", "FREE",
    "FROG", "FUEL", "FULL", "GATE", "GIRL", "GIVE", "GOAL", "GROW", "HAIR", "HALF",
    "HAND", "HARD", "HEAD", "HEAT", "HILL", "HOLD", "HOLE", "HOME", "HOUR", "IRON",
    "ITEM", "JOIN", "JUMP", "KEEP", "KING", "KNOW", "LAND", "LANE", "LAST", "LATE",
    "LEAF", "LINE", "LINK", "LION", "LIST", "LOCK", "LONG", "LOOK", "LORD", "MAIN",
    "MAKE", "MANY", "MARK", "MASS", "MEAL", "MEAT", "MEET", "MILK", "MODE", "MOST",
    "NAME", "NEAR", "NECK", "NEWS", "NOTE", "OPEN", "PARK", "PATH", "PLAN", "POST",
    "RACE", "READ", "REAL", "RICE", "RICH", "RIDE", "RING", "RISE", "ROAD", "ROSE",
    "RULE", "SAFE", "SAIL", "SALT", "SAME", "SAND", "SAVE", "SEAT", "SEED", "SHIP",
    "SHOE", "SHOP", "SHOT", "SHOW", "SIDE", "SIGN", "SILK", "SING", "SKIN", "SLOW",
    "SONG", "SOUP", "STOP", "SUIT", "TALK", "TALL", "TAPE", "TASK", "TEST", "TEXT",
    "TOWN", "TREE", "TRIP", "USER", "VIEW", "WALL", "WASH", "WEST", "WIFE", "WING",
    "WIRE", "WISH", "WOOD", "WORD", "YARD", "YEAR", "ZERO", "ZONE"
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
    "RIVER", "SHIRT", "SMILE", "SNAKE", "SUGAR", "TOUCH", "WHITE", "WOMAN", "YOUNG",
    "ABOUT", "ADIEU", "ALERT", "ALTER", "APPLY", "AUDIO", "BLACK", "BREAK", "BRING",
    "BUILD", "CHAIN", "CHEST", "CHIEF", "CHILD", "CHINA", "CLAIM", "CLASS", "CLOSE",
    "CLOUD", "COAST", "COUNT", "COURT", "COVER", "CRANE", "DRIVE", "ENTER", "FIELD",
    "FINAL", "FLASH", "FOCUS", "FORCE", "FRAME", "FRONT", "GLOBE", "GROUP", "GUIDE",
    "LOCAL", "MAJOR", "MATCH", "MONTH", "MOTOR", "OFFER", "ORDER", "OTHER", "PRIME",
    "RAISE", "SCALE", "SCORE", "SHIFT", "SOLID", "SPEED", "STAGE", "STAND", "START",
    "STATE", "STEAM", "STEEL", "STICK", "STORY", "TASTE", "TEACH", "THANK", "TOTAL",
    "TRACK", "TREND", "TRIAL", "VALUE", "VIBES", "VOICE", "ACTOR", "ADULT", "AGENT",
    "AGREE", "AHEAD", "ALARM", "ALBUM", "ALIEN", "ALIKE", "ALIVE", "ALLOW", "ALONE",
    "ALONG", "ANGER", "ANGLE", "ANGRY", "APART", "ARGUE", "ARISE", "ARRAY", "ASIDE",
    "ASSET", "AVOID", "AWAKE", "AWARD", "AWARE", "BASIC", "BASIS", "BEGIN", "BEING",
    "BELOW", "BENCH", "BIRTH", "BLOCK", "BLOOD", "BOARD", "BOOST", "BOUND", "BRIEF",
    "BROAD", "BROWN", "BUYER", "CABLE", "CATCH", "CAUSE", "CHANCE", "CHANGE", "CHART",
    "CHASE", "CIVIL", "CLIMB", "COACH", "COLOR", "CRASH", "CREAM", "CRIME", "CROSS",
    "CROWD", "DAILY", "DEPTH", "DRAFT", "DRAMA", "DRESS", "EAGER", "EARLY", "EIGHT",
    "ELECT", "ELITE", "EMPTY", "ENEMY", "ENJOY", "ENTRY", "EQUAL", "ERROR", "EVENT",
    "EVERY", "EXACT", "EXIST", "EXTRA", "FAULT", "FIFTH", "FIFTY", "FIGHT", "FIRST",
    "FLIGHT", "FLOAT", "FORTH", "FORTY", "FORUM", "FOUND", "FRESH", "GIANT", "GIVEN",
    "GRACE", "GRADE", "GRAND", "GRANT", "GRASS", "GUARD", "GUESS", "GUEST", "HELLO",
    "HOTEL", "HUMAN", "HUMOR", "IDEAL", "INDEX", "INNER", "INPUT", "ISSUE", "JAPAN",
    "JOINT", "JUDGE", "KNOCK", "LABEL", "LABOR", "LARGE", "LATER", "LAUGH", "LAYER",
    "LEARN", "LEASE", "LEAST", "LEAVE", "LEGAL", "LEVEL", "LIMIT", "LOGIC", "MAKER",
    "MARCH", "MAYBE", "MAYOR", "MEANT", "MEDIA", "METAL", "MIGHT", "MINOR", "MODEL",
    "MORAL", "MOUNT", "MOUTH", "MOVIE", "NEEDS", "NEVER", "NORTH", "NOTED", "NOVEL",
    "NURSE", "OFTEN", "OUGHT", "PAINT", "PANEL", "PEACE", "PHASE", "PHONE", "PHOTO",
    "PIECE", "PILOT", "PITCH", "PLACE", "PLAIN", "PLANE", "PLATE", "POINT", "POUND",
    "PRESS", "PRICE", "PRIDE", "PRINT", "PRIZE", "PROOF", "PROUD", "PROVE", "RANGE",
    "RAPID", "RATIO", "REACH", "READY", "REFER", "RIGHT", "RIVAL", "ROUGH", "ROUND",
    "ROUTE", "ROYAL", "RURAL", "SCENE", "SCOPE", "SENSE", "SERVE", "SEVEN", "SHALL",
    "SHAPE", "SHARE", "SHEET", "SHELF", "SHELL", "SHOCK", "SHOOT", "SHORT", "SHOWN",
    "SIGHT", "SINCE", "SIXTH", "SIXTY", "SIZED", "SKILL", "SLEEP", "SLIDE", "SMALL",
    "SMOKE", "SOLVE", "SORRY", "SOUTH", "SPARE", "SPEAK", "SPEND", "SPORT", "STAFF",
    "STILL", "STOCK", "STOOD", "STORE", "STRIP", "STUCK", "STUDY", "STUFF", "STYLE",
    "SUITE", "TAKEN", "TAXES", "TEETH", "THEIR", "THEME", "THERE", "THESE", "THICK",
    "THING", "THINK", "THIRD", "THOSE", "THREE", "THREW", "THROW", "TIGHT", "TIMES",
    "TITLE", "TODAY", "TOPIC", "TREAT", "TRIED", "TRIES", "TRUCK", "TRULY", "TRUST",
    "TRUTH", "TWICE", "UNDER", "UNION", "UNITY", "UNTIL", "UPPER", "UPSET", "URBAN",
    "USAGE", "USUAL", "VIDEO", "VIRUS", "VISIT", "VITAL", "WASTE", "WATCH", "WHEEL",
    "WHERE", "WHICH", "WHILE", "WHOLE", "WHOSE", "WOMEN", "WORRY", "WORSE", "WORST",
    "WORTH", "WOULD", "WOUND", "WRITE", "WRONG"
  ],

  6: [
    "ACTION", "BREEZE", "CHORD", "DRAGON", "ENERGY", "FUTURE", "GALAXY", "HARBOR",
    "IMPACT", "JUNGLE", "KNIGHT", "LEGEND", "MAGNET", "NEXUS", "OASIS", "PLANET",
    "QUEST", "RADAR", "SILVER", "TUNNEL", "VELVET", "WONDER", "ZODIAC", "BEAUTY",
    "CHAMP", "EMPIRE", "FRIEND", "GUITAR", "HEROIC", "ISLAND", "VORTEX", "PHOENIX",
    "VISION", "FROZEN", "GENIUS", "MARVEL", "UNITED", "SHIELD", "CASTLE", "BATTLE",
    "ACTIVE", "ACTOR", "ADVICE", "AFRAID", "AGENCY", "ALMOST", "ALWAYS", "AMOUNT",
    "ANIMAL", "ANSWER", "ANYONE", "APPEAR", "AROUND", "ARRIVE", "ARTIST", "AUTHOR",
    "BECOME", "BEFORE", "BEHIND", "BELIEVE", "BETTER", "BEYOND", "BOTTOM", "BRANCH",
    "BRIDGE", "BRIGHT", "BROKEN", "BUDGET", "CAMERA", "CANCER", "CAPTAIN", "CARPET",
    "CASUAL", "CENTER", "CHANCE", "CHANGE", "CHARGE", "CHOICE", "CHURCH", "CIRCLE",
    "CLIENT", "CLOSED", "COFFEE", "COLUMN", "COMBAT", "COMMON", "CORNER", "COUNTY",
    "COURSE", "COUSIN", "CREDIT", "CRIME", "CUSTOM", "DAMAGE", "DANGER", "DEALER",
    "DECIDE", "DEFENSE", "DEGREE", "DEMAND", "DESIGN", "DESIRE", "DEVICE", "DIRECT",
    "DOCTOR", "DOLLAR", "DOMAIN", "DOUBLE", "DRIVEN", "DRIVER", "DURING", "EASILY",
    "EFFECT", "EFFORT", "ENGINE", "ENOUGH", "ENTIRE", "ESCAPE", "ESTATE", "EXPENSE",
    "EXPERT", "EXPORT", "FACTOR", "FAMILY", "FAMOUS", "FARMER", "FATHER", "FELLOW",
    "FIGURE", "FINGER", "FINISH", "FISHER", "FLIGHT", "FLOWER", "FLYING", "FOREST",
    "FORGET", "FORMAL", "FORMAT", "FOSTER", "FOURTH", "FRENCH", "GARDEN", "GENDER",
    "GENTLE", "GLOBAL", "GOLDEN", "GROUND", "GROWTH", "HANDLE", "HAPPEN", "HEALTH",
    "HEAVEN", "HEIGHT", "HIDDEN", "HOLDER", "HONEST", "HONOR", "HUNTER", "IGNORE",
    "IMPORT", "INCOME", "INDIAN", "INSIDE", "INVEST", "ITSELF", "JACKET", "JUSTICE",
    "KITCHEN", "LAWYER", "LEADER", "LEAGUE", "LEAVES", "LETTER", "LIVING", "LOCATE",
    "LOVELY", "MACHINE", "MAINLY", "MAKING", "MANAGE", "MANNER", "MANUAL", "MARKET",
    "MASTER", "MATTER", "MEDIUM", "MEMBER", "MEMORY", "MENTAL", "METHOD", "MIDDLE",
    "MINUTE", "MODERN", "MODEST", "MOMENT", "MOTHER", "MOTION", "MOUNTAIN", "MUSEUM",
    "MUTUAL", "MYSELF", "NATION", "NATIVE", "NATURE", "NEARLY", "NORMAL", "NOTICE",
    "NUMBER", "OBJECT", "OBTAIN", "OFFICE", "ONLINE", "OPTION", "ORANGE", "ORIGIN",
    "OUTPUT", "OXFORD", "PALACE", "PARENT", "PARTNER", "PARTY", "PATIENT", "PATTERN",
    "PEOPLE", "PERFECT", "PERIOD", "PERSON", "PHASE", "PHONE", "PHOTO", "PICTURE",
    "PIECE", "PILOT", "PLASTIC", "POCKET", "POLICE", "POLICY", "PREFER", "PREPARE",
    "PRESENT", "PRETTY", "PRINCE", "PRISON", "PROFIT", "PROPER", "PUBLIC", "PUNISH",
    "PURPLE", "PURPOSE", "RATHER", "RATING", "READER", "REALLY", "REASON", "RECEIVE",
    "RECENT", "RECORD", "REDUCE", "REFORM", "REFUSE", "REGION", "RELATE", "RELIEF",
    "REMAIN", "REMOTE", "REMOVE", "REPAIR", "REPEAT", "REPLACE", "REPORT", "RESCUE",
    "RESULT", "RETAIN", "RETURN", "REVENUE", "REVIEW", "SAFETY", "SALARY", "SAMPLE",
    "SAVING", "SCENE", "SCHEME", "SCHOOL", "SCIENCE", "SCREEN", "SEARCH", "SEASON",
    "SECOND", "SECRET", "SECTOR", "SECURE", "SENIOR", "SERIES", "SEVERE", "SHADOW",
    "SHARED", "SHEET", "SHOULD", "SIGNAL", "SILENT", "SILVER", "SIMPLE", "SINGLE",
    "SISTER", "SKILL", "SLIGHT", "SMOOTH", "SOCIAL", "SOLELY", "SORRY", "SOURCE",
    "SPEAKER", "SPECIAL", "SPEECH", "SPEED", "SPIRIT", "SPREAD", "SPRING", "SQUARE",
    "STABLE", "STAFF", "STAGE", "STANDARD", "STATION", "STATUS", "STREET", "STRESS",
    "STRIKE", "STRONG", "STUDENT", "STUDIO", "SUBJECT", "SUBMIT", "SUDDEN", "SUFFER",
    "SUMMER", "SUMMIT", "SUPERB", "SUPPLY", "SUPPORT", "SUPPOSE", "SURFACE", "SYSTEM",
    "TARGET", "TEACHER", "TEMPLE", "TENANT", "TENSION", "THEORY", "THIRTY", "THOUGH",
    "THREAT", "THRONE", "TICKET", "TIMING", "TISSUE", "TITLE", "TRAVEL", "TREATY",
    "TWELVE", "TWENTY", "UNABLE", "UNIQUE", "UNITED", "UNLESS", "USEFUL", "VALLEY",
    "VECTOR", "VENDOR", "VESSEL", "VICTIM", "VICTORY", "VILLAGE", "VIOLENT", "VIRTUAL",
    "VISUAL", "VOICE", "VOLUME", "WALKER", "WEAPON", "WEATHER", "WEEKLY", "WEIGHT",
    "WINDOW", "WINTER", "WISDOM", "WITHIN", "WONDER", "WORKER", "WRITER", "YELLOW"
  ]
};

// Comprehensive dictionary lookup sets combining ENABLE1, Wordle Official, and DWYL English Dictionaries
export const DICTIONARY_BY_LENGTH = {
  4: new Set(dictionaryData[4] || []),
  5: new Set(dictionaryData[5] || []),
  6: new Set(dictionaryData[6] || [])
};

// Guarantee strict length matching for target word generation
export const getRandomTargetWord = (length = 5) => {
  const reqLength = Number(length) || 5;
  const rawList = TARGET_WORDS[reqLength] || TARGET_WORDS[5];
  const strictList = rawList.filter((word) => word.trim().length === reqLength);
  
  if (strictList.length === 0) {
    return reqLength === 4 ? "GAME" : reqLength === 6 ? "PLANET" : "REACT";
  }
  
  const word = strictList[Math.floor(Math.random() * strictList.length)];
  return word.toUpperCase().trim();
};

/**
 * Validate guess length & dictionary match with full open-source dictionary support.
 * By default (allowInvalid = false), ONLY valid English dictionary words are allowed.
 * When allowInvalid = true (enabled in preferences), any alphabetic string of matching length is allowed.
 */
export const isValidWord = (word, length = 5, allowInvalid = false) => {
  if (!word) return false;
  const upper = word.toUpperCase().trim();
  const reqLen = Number(length) || 5;
  if (upper.length !== reqLen) return false;

  // If user enabled the setting to allow non-dictionary/invalid words
  if (allowInvalid) {
    return /^[A-Z]+$/.test(upper);
  }

  // Fast O(1) Set validation against exhaustive open-source English dictionary
  const validSet = DICTIONARY_BY_LENGTH[reqLen];
  if (validSet && validSet.has(upper)) return true;

  // Fallback check against target word list
  const targetList = TARGET_WORDS[reqLen];
  if (targetList && targetList.some(w => w.toUpperCase().trim() === upper)) return true;

  return false;
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
