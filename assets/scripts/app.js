const ATTACK_VALUE = 10; //damage argument in vendor.js
const STRONG_ATTACK_VALUE = 17; //strong attack value instead of ATTACK_VALUE
const MONSTER_ATTACK_VALUE = 14; //damage of monster to player must be more
const HEAL_VALUE = 20;

const MODE_ATTACK = "ATTACK"; //MODE_ATTACK = 0
const MODE_STRONG_ATTACK = "STRONG_ATTACK"; //MODE_STRONG_ATTACK = 1

const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";
let battleLog = [];

function getMaxLifeValues() {
  const enteredMaxHealthValue = prompt(
    "مقدار ماکزیمم عمر خود و هیولا را انتخاب کنید:",
    "100"
  );
  let parsedValue = parseInt(enteredMaxHealthValue); //maxLife argument of adjustHealthBars() in vendor.js
  if (isNaN(parsedValue) || parsedValue <= 0) {
    throw { message: "مقدار نامعتبر" };
  }

  return parsedValue;
}

let chosenMaxLife;
try {
  chosenMaxLife = getMaxLifeValues();
} catch (error) {
  console.log(error);
  chosenMaxLife =100;
}

let currentMonsterHealth = chosenMaxLife; //for the first of the game and manuplating
let currentPlayerHealth = chosenMaxLife; //for the first of the game and manuplating
let hasBonusLife = true;

adjustHealthBars(chosenMaxLife);

function writeToLog(event, value, monsterHealth, playerHealth) {
  let logEntry; //an object for key and value

  switch (event) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry = {
        event: event,
        value: value,
        target: "هیولا",
        finalMonsteHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry = {
        event: event,
        value: value,
        target: "هیولا",
        finalMonsteHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      logEntry = {
        event: event,
        value: value,
        target: "بازیکن",
        finalMonsteHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntry = {
        event: event,
        value: value,
        target: "مداوای بازیکن",
        finalMonsteHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    case LOG_EVENT_GAME_OVER:
      logEntry = {
        event: event,
        value: value,
        finalMonsteHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
      break;
    default:
      logEntry = {};
  }

  // if (event === LOG_EVENT_PLAYER_ATTACK) {
  //   logEntry = {
  //     event: event,
  //     value: value,
  //     target: "هیولا",
  //     finalMonsteHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth,
  //   };
  // } else if (event === LOG_EVENT_PLAYER_STRONG_ATTACK) {
  //   logEntry = {
  //     event: event,
  //     value: value,
  //     target: "هیولا",
  //     finalMonsteHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth,
  //   };
  // } else if (event === LOG_EVENT_MONSTER_ATTACK) {
  //   logEntry = {
  //     event: event,
  //     value: value,
  //     target: "بازیکن",
  //     finalMonsteHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth,
  //   };
  // } else if (event === LOG_EVENT_PLAYER_HEAL) {
  //   logEntry = {
  //     event: event,
  //     value: value,
  //     target: "مداوای بازیکن",
  //     finalMonsteHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth,
  //   };
  // } else if (event === LOG_EVENT_GAME_OVER) {
  //   logEntry = {
  //     event: event,
  //     value: value,
  //     finalMonsteHealth: monsterHealth,
  //     finalPlayerHealth: playerHealth,
  //   };
  // }
  battleLog.push(logEntry);
}

function reset() {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
}

//function for monster attack to player at the end of each round
function endOfEachRound() {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;

  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );

  if (currentPlayerHealth <= 0 && hasBonusLife) {
    hasBonusLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
    alert("نزدیک بود کشته بشی ولی چون جایزه داشتی نجات پیدا کردی!");
  }

  if (currentMonsterHealth <= 0 && currentPlayerHealth > 0) {
    alert("شما برنده اید!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "بازیکن برنده شد",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth <= 0 && currentMonsterHealth > 0) {
    alert("شما باختید!");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "هیولا برنده شد",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "بازی مساوی شد",
      currentMonsterHealth,
      currentPlayerHealth
    );
    alert("بازی مساوی شد!");
  }

  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
}

//give mode and then attack by the mode
function attackToMonster(mode) {
  const damageValue = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const logEvent =
    mode === MODE_ATTACK
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;

  // let damageValue;
  // let logEvent;
  // if (mode === MODE_ATTACK) {
  //   damageValue = ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_ATTACK;
  // } else {
  //   damageValue = STRONG_ATTACK_VALUE;
  //   logEvent = LOG_EVENT_PLAYER_STRONG_ATTACK;
  // }

  const damage = dealMonsterDamage(damageValue);
  currentMonsterHealth -= damage;
  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
  endOfEachRound();
}

//function for normal attack to monster
function attackHandler() {
  attackToMonster(MODE_ATTACK);
}

//function for heavy attack to monster
function strongAttackHandler() {
  attackToMonster(MODE_STRONG_ATTACK);
}

//function for healing the player health
function healPlayerHandler() {
  let healValue;

  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert(
      "شما نمیتوانید میزان سلامتتان را بیشتر از مقدار ماکزیمم عمرتان اضافه نمایید!"
    );
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }

  increasePlayerHealth(healValue); //just show the display (not logic)
  currentPlayerHealth += healValue; //this line handles logic
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endOfEachRound();
}

function printLogHandler() {
  for (const logEntry of battleLog) {
    //loop for objects in array
    for (const key in logEntry) {
      //loop for objects property
      if (key === "target") {
        continue;
      }
      console.log(`${key} => ${logEntry[key]}`);
    }
    console.log("_________");
  }
}

attackBtn.addEventListener("click", attackHandler);
strongAttackBtn.addEventListener("click", strongAttackHandler);
healBtn.addEventListener("click", healPlayerHandler);
logBtn.addEventListener("click", printLogHandler);
