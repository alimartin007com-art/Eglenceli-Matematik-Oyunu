// === EMO v3.1 - config.js ===
// Firebase ve uygulama sabitleri

export const firebaseConfig = {
  apiKey: "AIzaSyCR2LWyzcoT2wPwGzS3oF47RnNx6LxZbHE",
  authDomain: "eglenceli-matematik-oyun-f2396.firebaseapp.com",
  databaseURL: "https://eglenceli-matematik-oyun-f2396-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "eglenceli-matematik-oyun-f2396",
  storageBucket: "eglenceli-matematik-oyun-f2396.firebasestorage.app",
  messagingSenderId: "803199070316",
  appId: "1:803199070316:web:c56ce976770efee1b5e849",
  measurementId: "G-E5NFXTYYT8"
};

// Tüm temaların haritası
export const allThemesMap = {
    light: '☀️ Aydınlık',
    dark: '🌙 Karanlık',
    matrix: '📟 Matrix',
    retro: '🎨 Retro',
    gold: '⚜️ Altın',
    arctic: '❄️ Arktik',
    cyberpunk: '🌃 Cyberpunk',
    sakura: '🌸 Sakura',
    summer: '🏖️ Yaz Tatili'
};

// Satın alınabilir temalar
export const purchasableThemes = [
    { id: 'buy-theme-matrix', key: 'matrix', unlockAt: 20 },
    { id: 'buy-theme-retro', key: 'retro', unlockAt: 40 },
    { id: 'buy-theme-arctic', key: 'arctic', unlockAt: 60 },
    { id: 'buy-theme-summer', key: 'summer', unlockAt: 80 },
    { id: 'buy-theme-cyberpunk', key: 'cyberpunk', unlockAt: 200 },
    { id: 'buy-theme-sakura', key: 'sakura', unlockAt: 200 },
    { id: 'buy-theme-gold', key: 'gold', cost: 500 }
];

// Arka plan sembolleri
const basicOps = ['+', '−', '×', '÷'];
export const mathSymbols = [
    ...basicOps, ...basicOps, ...basicOps, ...basicOps, ...basicOps,
    '(', ')', 'x', 'y', 'z', '=', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', 'π', '√'
];
export const snowflakes = ['❄️', '❅', '❆'];
export const digitalRain = ['0', '1'];
export const petals = ['🌸', '❁', '❀'];
export const summerIcons = ['🏖️', '🌊', '☀️', '🐚', '🦀', '🌴'];

// Rozet tanımları
export const badgeDefinitions = {
    "math_genius": { icon: "🧮", name: "Matematik Dahisi", desc: "Toplam 50 doğru cevap!", condition: 50, type: 'stats' },
    "total_100": { icon: "💯", name: "Yüzlük Seri", desc: "Toplam 100 doğru cevap!", condition: 100, type: 'stats' },
    "max_score_500": { icon: "🌟", name: "Yüksek Skor", desc: "Tek oyunda 500 puana ulaş!", condition: 500, type: 'score' },
    "blitz_runner": { icon: "⚡", name: "Blitz Canavarı", desc: "Blitz Modu'nda 20 doğru cevap!", condition: 20, type: 'stats' },
    "survivor_30": { icon: "⏳", name: "Hayatta Kalan", desc: "Survival modunda 30 doğru cevap!", condition: 30, type: 'stats' },
    "add_master": { icon: "➕", name: "Toplama Ustası", desc: "30 toplama işlemini tamamla!", condition: 30, type: 'stats' },
    "sub_master": { icon: "➖", name: "Çıkarma Ustası", desc: "30 çıkarma işlemini tamamla!", condition: 30, type: 'stats' },
    "mul_master": { icon: "✖️", name: "Çarpma Ustası", desc: "25 çarpma işlemini tamamladın!", condition: 25, type: 'stats' },
    "div_master": { icon: "➗", name: "Bölme Ustası", desc: "20 bölme işlemini tamamla!", condition: 20, type: 'stats' },
    "algebra_pro": { icon: "📐", name: "Cebir Profesörü", desc: "15 cebirli ifade sorusunu doğru çöz!", condition: 15, type: 'stats' },
    "exp_power": { icon: "³", name: "Üslerin Gücü", desc: "15 üslü sayı sorusunu doğru çöz!", condition: 15, type: 'stats' },
    "streak5": { icon: "⚡", name: "Seri Başarı", desc: "Art arda 5 doğru cevap!", condition: 5, type: 'streak' },
    "streak_10": { icon: "🔥", name: "Alev Topu", desc: "Art arda 10 doğru cevap ver!", condition: 10, type: 'streak' },
    "rich": { icon: "💰", name: "Zengin Oyuncu", desc: "500 🪙 biriktir!", condition: 500, type: 'wallet' },
    "very_rich": { icon: "💎", name: "Büyük Zengin", desc: "1500 🪙 biriktir!", condition: 1500, type: 'wallet' },
    "pauper": { icon: "🪙", name: "Coin Harcayıcı", desc: "Mağazadan 5 eşya satın al!", condition: 5, type: 'purchase' },
    "level_5": { icon: "🎖️", name: "Seviye 5", desc: "5. Seviye ulaş!", condition: 5, type: 'level' },
    "level_10": { icon: "🏆", name: "Seviye 10", desc: "10. Seviyeye ulaş!", condition: 10, type: 'level' },
    "level_15": { icon: "👑", name: "Seviye 15", desc: "15. Seviyeye ulaş!", condition: 15, type: 'level' },
    "collector": { icon: "🎨", name: "Tema Koleksiyoncusu", desc: "Tüm temaları satın al!", condition: 9, type: 'themes' },
};

// Liderlik tablosu kategori etiketleri
export const categoryLabels = {
    totalCorrect: "Toplam Doğru",
    addCorrect: "Toplama Doğrusu",
    subCorrect: "Çıkarma Doğrusu",
    mulCorrect: "Çarpma Doğrusu",
    divCorrect: "Bölme Doğrusu",
    blitzCorrect: "Blitz Doğrusu",
    survivalCorrect: "Hayatta Kalma Doğrusu",
    score: "Skor"
};
