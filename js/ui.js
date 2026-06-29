// === EMO v3.1 - ui.js ===
// DOM elementleri, UI güncelleme, tema, bildirim ve efektler

import { allThemesMap, purchasableThemes, mathSymbols, snowflakes, digitalRain, petals, summerIcons } from './config.js';
import * as State from './state.js';

// --- Ses efektleri ---
export const correctSound = new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg");
export const wrongSound = new Audio("https://actions.google.com/sounds/v1/cartoon/cartoon_boing.ogg");
export const levelUpSound = new Audio("https://actions.google.com/sounds/v1/impacts/wind_chimes.ogg");
export const buyThemeSound = new Audio("https://actions.google.com/sounds/v1/coins/magic_chime.ogg");

// --- DOM Elementleri ---
export const shopEl = document.getElementById("shop");
export const equationEl = document.getElementById("equation");
export const answerInput = document.getElementById("answer");
export const submitBtn = document.getElementById("submit");
export const skipBtn = document.getElementById("skip");
export const resultEl = document.getElementById("result");
export const hintBtn = document.getElementById("hintBtn");
export const startBtn = document.getElementById("startBtn");
export const gamePageBtn = document.getElementById("gamePageBtn");
export const timeBarEl = document.getElementById("timeBar");
export const mathSymbolsBg = document.getElementById("mathSymbolsBg");
export const soundToggleBtn = document.getElementById("soundToggleBtn");
export const levelUpModal = document.getElementById("levelUpModal");
export const levelUpCloseBtn = document.getElementById("levelUpCloseBtn");
export const levelUpNewLevel = document.getElementById("levelUpNewLevel");
export const levelUpNewLevel2 = document.getElementById("levelUpNewLevel2");
export const levelUpCoinReward = document.getElementById("levelUpCoinReward");
export const levelUpHintReward = document.getElementById("levelUpHintReward");
export const themeSelector = document.getElementById("themeSelector");
export const inputNumeric = document.getElementById("input-numeric");
export const xpBar = document.getElementById("xpBar");
export const xpText = document.getElementById("xpText");
export const gameTimerPill = document.getElementById("game-timer-pill");
export const gameTimeBar = document.getElementById("gameTimeBar");
export const gameTime = document.getElementById("gameTime");
export const gameTimeLabel = document.getElementById("gameTimeLabel");
export const questionTimerPill = document.getElementById("question-timer-pill");
export const modeDisplayPill = document.getElementById("mode-display");
export const modeDisplayText = document.getElementById("modeDisplayText");
export const mainFooter = document.getElementById("main-footer");
export const scoreEl = document.getElementById("score");
export const correctEl = document.getElementById("correct");
export const wrongEl = document.getElementById("wrong");
export const levelDisplayEl = document.getElementById("levelDisplay");
export const timeEl = document.getElementById("time");
export const streakEl = document.getElementById("streak");
export const shieldsEl = document.getElementById("shields");
export const skipsEl = document.getElementById("skips");

// --- Bildirim ---
export function notify(message, isGood = true) {
    let n = document.createElement("div");
    n.className = "notify";
    n.style.backgroundColor = isGood ? 'var(--good)' : 'var(--bad)';
    n.textContent = message;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3500);
}

// --- Kutlama ve Ses ---
export function celebrate() {
    if (State.isSoundEnabled) {
        correctSound.currentTime = 0;
        correctSound.play().catch(() => { });
    }
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
}

export function speakWrong() {
    if (State.isSoundEnabled) {
        wrongSound.currentTime = 0;
        wrongSound.play().catch(() => { });
    }
}

// --- Seviye Atlama Modalı ---
export function showLevelUpModal(newLvl, coin, hint) {
    levelUpNewLevel.textContent = `Seviye ${newLvl}`;
    levelUpNewLevel2.textContent = newLvl;
    levelUpCoinReward.textContent = coin;
    levelUpHintReward.textContent = hint;
    levelUpModal.classList.remove('hidden');
}

export function hideLevelUpModal() {
    levelUpModal.classList.add('hidden');
}

// --- Sayfa Navigasyonu ---
export function showPage(pageId, endGameFn) {
    document.querySelectorAll('.wrap > div').forEach(div => {
        div.classList.add('hidden');
    });
    document.getElementById(pageId).classList.remove('hidden');

    if (pageId === 'home') {
        mainFooter.style.display = 'none';
    } else {
        mainFooter.style.display = 'block';
    }

    if (pageId === 'home' || pageId === 'how' || pageId === 'about' || pageId === 'stats') {
        if (State.gameState.running) {
            endGameFn('Oyun durduruldu.');
        }
    }
    shopEl.classList.add('hidden');
    if (pageId === 'stats') {
        renderStats();
    }
}

// --- Mağaza ---
export function openShop() {
    shopEl.classList.toggle('hidden');
    if (!shopEl.classList.contains('hidden')) {
        updateThemeShopUI();
    }
}

// --- XP Bar ---
export function getXPForNextLevel(lvl) {
    return Math.floor(100 * Math.pow(1.2, lvl - 1));
}

export function updateXPBar() {
    const xpNeeded = getXPForNextLevel(State.level);
    const percentage = Math.min(100, (State.xp / xpNeeded) * 100);
    xpBar.style.width = `${percentage}%`;
    xpText.textContent = `XP: ${State.xp} / ${xpNeeded}`;
    levelDisplayEl.textContent = `${State.level} 🎖️`;
}

// --- Meta Güncelleme ---
export function updateMeta(saveProfileFn) {
    scoreEl.textContent = State.gameState.score;
    correctEl.textContent = State.gameState.correct;
    wrongEl.textContent = State.gameState.wrong;

    // Streak değiştiğinde animasyon ekle
    if (streakEl.textContent !== State.streak.toString()) {
        streakEl.textContent = State.streak;
        if (State.streak > 0) {
            streakEl.parentElement.classList.remove('streak-anim');
            void streakEl.parentElement.offsetWidth; // trigger reflow
            streakEl.parentElement.classList.add('streak-anim');
        }
    }

    shieldsEl.textContent = State.streakShields;
    skipsEl.textContent = State.skipTokens;

    document.getElementById("wallet").textContent = State.wallet;
    document.getElementById("wallet2").textContent = State.wallet;
    document.getElementById("lives").textContent = State.lives;
    document.getElementById("hints").textContent = State.hints;

    questionTimerPill.style.display = State.gameState.running && !State.freezeTime && !State.isBlitzMode && !State.isSurvivalMode ? 'flex' : 'none';
    gameTimerPill.style.display = State.gameState.running && (State.isBlitzMode || State.isSurvivalMode) ? 'flex' : 'none';

    inputNumeric.classList.toggle('hidden', !State.gameState.running);

    answerInput.disabled = !State.gameState.running;
    submitBtn.disabled = !State.gameState.running;
    skipBtn.disabled = !State.gameState.running;
    hintBtn.disabled = !State.gameState.running || State.hints <= 0;

    startBtn.textContent = State.gameState.running ? "Oyunu Durdur" : "Oyuna Başlat";
    gamePageBtn.textContent = State.gameState.running ? "Oyunu Durdur" : "Ayarlar/Başlat";
    soundToggleBtn.textContent = State.isSoundEnabled ? "🔊 Ses Açık" : "🔇 Ses Kapalı";
    soundToggleBtn.classList.toggle('secondary', State.isSoundEnabled);

    if (State.gameState.running) {
        modeDisplayPill.classList.remove('hidden');
        let modeName = document.getElementById("mode").options[document.getElementById("mode").selectedIndex].text;
        modeDisplayText.textContent = modeName;
    } else {
        modeDisplayPill.classList.add('hidden');
    }

    saveProfileFn();
}

// --- Rozet Render ---
export function renderBadges() {
    let cont = document.getElementById("badges");
    cont.innerHTML = "";
    for (let k in State.badges) {
        let b = State.badges[k];
        let div = document.createElement("div");
        div.className = "badge " + (b.earned ? "earned" : "locked");
        div.innerHTML = `<div style="font-size:18px">${b.icon}</div><div>${b.name}</div><div style="font-size:12px;color:var(--text-light)">${b.desc}</div>`;
        cont.appendChild(div);
    }
}

// --- İstatistik Render ---
function createRatioBar(title, correct, wrong) {
    const total = correct + wrong;
    if (total === 0) return "";

    const ratio = (correct / total) * 100;
    const ratioText = `${correct} D / ${wrong} Y (${ratio.toFixed(0)}% Başarı)`;

    return `
        <div class="ratio-item">
            <div class="ratio-header">
                <span>${title}</span>
                <span>${ratioText}</span>
            </div>
            <progress value="${correct}" max="${total}"></progress>
            <div class="ratio-text" style="color: #fff; text-shadow: 0 1px 2px #000;">${ratio.toFixed(0)}%</div>
        </div>
    `;
}

export function renderStats() {
    document.getElementById("stat-games").textContent = State.gameStats.gamesPlayed;
    document.getElementById("stat-max-score").textContent = State.gameStats.maxScore;
    document.getElementById("stat-total-correct").textContent = State.gameStats.totalCorrect;
    document.getElementById("stat-total-wrong").textContent = State.gameStats.totalWrong;

    const container = document.getElementById("operationStatsContainer");
    container.innerHTML = "";

    const operationMap = {
        "Toplama (+)": { c: State.gameStats.addCorrect, w: State.gameStats.addWrong },
        "Çıkarma (-)": { c: State.gameStats.subCorrect, w: State.gameStats.subWrong },
        "Çarpma (×)": { c: State.gameStats.mulCorrect, w: State.gameStats.mulWrong },
        "Bölme (÷)": { c: State.gameStats.divCorrect, w: State.gameStats.divWrong },
        "Parantezli": { c: State.gameStats.parenCorrect, w: State.gameStats.parenWrong },
        "Eksik Sayı (X)": { c: State.gameStats.missingCorrect, w: State.gameStats.missingWrong },
        "Üslü Sayılar": { c: State.gameStats.expCorrect, w: State.gameStats.expWrong },
        "Cebirli İfadeler": { c: State.gameStats.algebraCorrect, w: State.gameStats.algebraWrong },
        "Blitz Modu": { c: State.gameStats.blitzCorrect, w: State.gameStats.blitzWrong },
        "Hayatta Kalma": { c: State.gameStats.survivalCorrect, w: State.gameStats.survivalWrong },
    };
    for (const [title, data] of Object.entries(operationMap)) {
        container.innerHTML += createRatioBar(title, data.c, data.w);
    }

    const totalContainer = document.getElementById("totalRatioContainer");
    totalContainer.innerHTML = createRatioBar(
        "Genel Başarı Oranı",
        State.gameStats.totalCorrect,
        State.gameStats.totalWrong
    );
}

// --- Tema ---
export function updateThemeSelectorUI() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    themeSelector.innerHTML = '';

    for (const themeKey in allThemesMap) {
        if (State.ownedThemes.includes(themeKey)) {
            const option = document.createElement('option');
            option.value = themeKey;
            option.textContent = allThemesMap[themeKey];
            themeSelector.appendChild(option);
        }
    }

    themeSelector.value = currentTheme;
    updateThemeShopUI();
}

export function updateThemeShopUI() {
    purchasableThemes.forEach(theme => {
        const btn = document.getElementById(theme.id);
        if (btn) {
            if (State.ownedThemes.includes(theme.key)) {
                btn.disabled = true;
                btn.textContent = "Kullanımda";
                btn.style.backgroundColor = "var(--good)";
                btn.style.color = "white";
            } else {
                if (theme.cost !== undefined) {
                    btn.disabled = false;
                    btn.textContent = `${theme.cost} 🪙`;
                    btn.style.backgroundColor = "var(--accent)";
                    btn.style.color = "white";
                } else if (theme.unlockAt !== undefined) {
                    const totalCorrect = State.gameStats.totalCorrect;
                    if (totalCorrect >= theme.unlockAt) {
                        btn.disabled = false;
                        btn.textContent = "Kilidi Aç";
                        btn.style.backgroundColor = "var(--accent)";
                        btn.style.color = "white";
                    } else {
                        btn.disabled = true;
                        btn.textContent = `🔒 ${theme.unlockAt} Doğru`;
                        btn.style.backgroundColor = "var(--text-light)";
                        btn.style.color = "white";
                    }
                }
            }
        }
    });
}

export function setTheme(themeName) {
    if (!State.ownedThemes.includes(themeName)) {
        themeName = 'light';
    }

    document.documentElement.setAttribute('data-theme', themeName);
    localStorage.setItem("mathThemeV3.0", themeName);
    themeSelector.value = themeName;

    setTimeout(() => {
        const symbolColor = getComputedStyle(document.documentElement).getPropertyValue('--accent');
        const symbolOpacity = (themeName === 'light' || themeName === 'arctic') ? '0.25' : '0.5';
        document.querySelectorAll('.math-symbol').forEach(s => {
            s.style.color = symbolColor;
            s.style.opacity = symbolOpacity;
        });

        initMathSymbols();
    }, 50);
}

// --- Arka Plan Animasyonu ---
function randInt(a, b) { return Math.floor(Math.random() * (b - a + 1)) + a; }

function createMathSymbol() {
    const symbol = document.createElement('div');
    symbol.classList.add('math-symbol');

    const startX = randInt(0, window.innerWidth);
    symbol.style.left = `${startX}px`;

    const themeName = document.documentElement.getAttribute('data-theme') || 'light';

    let duration = randInt(20, 40);
    let delay = randInt(0, 20);
    let fontSize = randInt(2, 6);

    if (themeName === 'arctic') {
        symbol.textContent = snowflakes[randInt(0, snowflakes.length - 1)];
        symbol.style.animationName = 'fall-digital';
        duration = randInt(15, 30);
    }
    else if (themeName === 'cyberpunk') {
        symbol.textContent = digitalRain[randInt(0, digitalRain.length - 1)];
        symbol.style.animationName = 'fall-digital';
        symbol.style.color = randInt(0, 1) === 0 ? 'var(--accent)' : 'var(--good)';
        duration = randInt(5, 15);
        fontSize = randInt(1, 4);
        delay = randInt(0, 5);
    }
    else if (themeName === 'sakura') {
        symbol.textContent = petals[randInt(0, petals.length - 1)];
        symbol.style.animationName = 'fall-flutter';
        symbol.style.color = randInt(0, 1) === 0 ? 'var(--accent)' : '#fdebf3';
        duration = randInt(10, 20);
        delay = randInt(0, 15);
        fontSize = randInt(1, 3);
    }
    else if (themeName === 'summer') {
        symbol.textContent = summerIcons[randInt(0, summerIcons.length - 1)];
        symbol.style.animationName = 'fall-flutter';
        duration = randInt(12, 22);
        delay = randInt(0, 15);
        fontSize = randInt(2, 4);
    }
    else {
        symbol.textContent = mathSymbols[randInt(0, mathSymbols.length - 1)];
        symbol.style.animationName = 'fall';
    }

    symbol.style.animationDuration = `${duration}s`;
    symbol.style.animationDelay = `${delay}s`;
    symbol.style.fontSize = `${fontSize}em`;

    const symbolColor = getComputedStyle(document.documentElement).getPropertyValue('--accent');
    let symbolOpacity = (themeName === 'light' || themeName === 'arctic') ? '0.25' : '0.5';
    if (themeName === 'summer') symbolOpacity = '0.4';

    if (themeName !== 'cyberpunk' && themeName !== 'sakura' && themeName !== 'summer') {
        symbol.style.color = symbolColor;
        symbol.style.opacity = symbolOpacity;
    } else if (themeName === 'summer') {
        symbol.style.opacity = symbolOpacity;
    }

    mathSymbolsBg.appendChild(symbol);

    symbol.addEventListener('animationend', () => {
        symbol.remove();
        if (document.querySelectorAll('.math-symbol').length < 30) {
            createMathSymbol();
        }
    });
}

export function initMathSymbols(count = 30) {
    mathSymbolsBg.innerHTML = '';
    for (let i = 0; i < count; i++) {
        createMathSymbol();
    }
}

// --- Yanlış Geçmiş Modalı ---
export function showWrongHistory() {
    const listEl = document.getElementById("wrongHistoryList");
    listEl.innerHTML = "";

    State.currentSessionWrongs.forEach((item) => {
        let div = document.createElement('div');
        div.className = "history-item";

        let qDiv = document.createElement('div');
        qDiv.className = "history-question";
        qDiv.textContent = `Soru: ${item.question.replace(' = ?', '')} = ?`;

        let ansDiv = document.createElement('div');
        ansDiv.className = "history-answers";
        ansDiv.innerHTML = `<span style="color: var(--bad);">Senin Cevabın: ${item.userAnswer || "Boş/Pas"}</span> | <span style="color: var(--good);">Doğru Cevap: ${item.correctAnswer}</span>`;

        let expDiv = document.createElement('div');
        expDiv.className = "history-explanation hidden";

        let explanation = "";
        switch (item.type) {
            case "add": case "sub": case "mul": case "div":
                explanation = "Temel işlem kuralı: İşaretlere dikkat et. Aynı işaretlilerin çarpımı/bölümü pozitif, zıt işaretliler negatif olur. Toplama ve çıkarmada büyüklükleri ve işaretleri doğru hesaplamalısın.";
                break;
            case "paren":
                explanation = "İşlem Önceliği Kuralı: Önce parantez içindeki işlemler yapılır, ardından çarpma/bölme, en son toplama/çıkarma işlemleri gerçekleştirilir.";
                break;
            case "algebra":
                explanation = `Cebirsel ifadelerde benzer terimlerin (x'li terimler) katsayıları toplanır veya çıkarılır. Burada doğru katsayı ${item.correctAnswer} olmalıydı.`;
                break;
            case "exp":
                explanation = "Üslü sayılarda, tabandaki sayı kendisi ile üs kadar çarpılır. Negatif bir sayının çift kuvveti pozitif, tek kuvveti negatiftir.";
                break;
            case "missing":
                explanation = "Bilinmeyeni (X) bulmak için, eşitsizliğin diğer tarafına işlemi tersine çevirerek atmalısın (örneğin toplama ise çıkarma olarak geçer).";
                break;
            default:
                explanation = "Daha dikkatli olmalısın. İşaretlere ve işlemlere tekrar göz at.";
        }
        expDiv.textContent = "💡 Açıklama: " + explanation;

        div.appendChild(qDiv);
        div.appendChild(ansDiv);
        div.appendChild(expDiv);

        div.onclick = () => {
            expDiv.classList.toggle('hidden');
        };

        listEl.appendChild(div);
    });

    document.getElementById("wrongHistoryModal").classList.remove('hidden');
}
