// === EMO v3.1 - state.js ===
// Tüm global oyun durumu (state) ve profil yönetimi

import { badgeDefinitions } from './config.js';

// --- Global Oyun Durumu ---
export let wallet = 0;
export let lives = 3;
export let currentSessionWrongs = [];
export let adaptiveHistory = [];
export let currentAdaptiveLevel = 1;
export let hints = 0;
export let skipTokens = 0;
export let isSoundEnabled = true;
export let itemsPurchased = 0;
export let freezeTime = false;
export let doubleScoreTurns = 0;
export let doubleXPTurns = 0;
export let doubleWalletTurns = 0;
export let streak = 0;
export let mulCount = 0;
export let timer = null;
export let globalTimer = null;
export let globalTimerLeft = 60;
export let timeLeft = 0;
export let initialTime = 0;
export let currentProblem = null;
export let isBlitzMode = false;
export let isSurvivalMode = false;
export let survivalStartTime = 10;
export let survivalCorrectBonus = 3;
export let survivalWrongPenalty = 2;

// XP & Seviye Sistemi
export let xp = 0;
export let level = 1;
export let streakShields = 0;
export let customUsername = "";

// Tüm temalar ücretsiz
export let ownedThemes = ['light', 'dark'];

export let gameState = {
    running: false,
    mode: "mixed",
    level: 1,
    total: -1,
    asked: 0,
    correct: 0,
    wrong: 0,
    score: 0,
};

export let gameStats = {
    gamesPlayed: 0,
    maxScore: 0,
    totalCorrect: 0,
    totalWrong: 0,
    addCorrect: 0, addWrong: 0,
    subCorrect: 0, subWrong: 0,
    mulCorrect: 0, mulWrong: 0,
    divCorrect: 0, divWrong: 0,
    parenCorrect: 0, parenWrong: 0,
    missingCorrect: 0, missingWrong: 0,
    expCorrect: 0, expWrong: 0,
    algebraCorrect: 0, algebraWrong: 0,
    blitzCorrect: 0, blitzWrong: 0,
    survivalCorrect: 0, survivalWrong: 0,
};

// Rozetler (badgeDefinitions'dan kopyalanarak earned alanı eklenir)
export let badges = {};
function initBadges() {
    for (const key in badgeDefinitions) {
        badges[key] = { ...badgeDefinitions[key], earned: false };
    }
}
initBadges();

// --- State Güncelleme Fonksiyonları (setter'lar) ---
// ES6 modüllerinde export edilen değişkenler dışarıdan doğrudan atanamaz,
// bu yüzden setter fonksiyonları kullanıyoruz.

export function setWallet(v) { wallet = v; }
export function setLives(v) { lives = v; }
export function setHints(v) { hints = v; }
export function setSkipTokens(v) { skipTokens = v; }
export function setIsSoundEnabled(v) { isSoundEnabled = v; }
export function setItemsPurchased(v) { itemsPurchased = v; }
export function setFreezeTime(v) { freezeTime = v; }
export function setDoubleScoreTurns(v) { doubleScoreTurns = v; }
export function setDoubleXPTurns(v) { doubleXPTurns = v; }
export function setDoubleWalletTurns(v) { doubleWalletTurns = v; }
export function setStreak(v) { streak = v; }
export function setMulCount(v) { mulCount = v; }
export function setTimer(v) { timer = v; }
export function setGlobalTimer(v) { globalTimer = v; }
export function setGlobalTimerLeft(v) { globalTimerLeft = v; }
export function setTimeLeft(v) { timeLeft = v; }
export function setInitialTime(v) { initialTime = v; }
export function setCurrentProblem(v) { currentProblem = v; }
export function setIsBlitzMode(v) { isBlitzMode = v; }
export function setIsSurvivalMode(v) { isSurvivalMode = v; }
export function setXP(v) { xp = v; }
export function setLevel(v) { level = v; }
export function setStreakShields(v) { streakShields = v; }
export function setCustomUsername(v) { customUsername = v; }
export function setCurrentAdaptiveLevel(v) { currentAdaptiveLevel = v; }
export function setCurrentSessionWrongs(v) { currentSessionWrongs = v; }
export function setAdaptiveHistory(v) { adaptiveHistory = v; }

export function setOwnedThemes(v) { ownedThemes = v; }

export function setGameState(newState) {
    Object.assign(gameState, newState);
}

export function resetGameState() {
    gameState.running = false;
    gameState.mode = "mixed";
    gameState.level = 1;
    gameState.total = -1;
    gameState.asked = 0;
    gameState.correct = 0;
    gameState.wrong = 0;
    gameState.score = 0;
}

export function resetGameStats() {
    gameStats.gamesPlayed = 0;
    gameStats.maxScore = 0;
    gameStats.totalCorrect = 0;
    gameStats.totalWrong = 0;
    gameStats.addCorrect = 0; gameStats.addWrong = 0;
    gameStats.subCorrect = 0; gameStats.subWrong = 0;
    gameStats.mulCorrect = 0; gameStats.mulWrong = 0;
    gameStats.divCorrect = 0; gameStats.divWrong = 0;
    gameStats.parenCorrect = 0; gameStats.parenWrong = 0;
    gameStats.missingCorrect = 0; gameStats.missingWrong = 0;
    gameStats.expCorrect = 0; gameStats.expWrong = 0;
    gameStats.algebraCorrect = 0; gameStats.algebraWrong = 0;
    gameStats.blitzCorrect = 0; gameStats.blitzWrong = 0;
    gameStats.survivalCorrect = 0; gameStats.survivalWrong = 0;
}

export function resetBadges() {
    for (const k in badges) {
        badges[k].earned = false;
    }
}

export function resetStatBadges() {
    for (const k in badges) {
        const b = badges[k];
        if (b.type === 'stats' || b.type === 'streak' || b.type === 'score') {
            badges[k].earned = false;
        }
    }
}
