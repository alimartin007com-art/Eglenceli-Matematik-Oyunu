// === EMO v3.1 - firebase.js ===
// Firebase başlatma, kimlik doğrulama ve liderlik tablosu

import { firebaseConfig, categoryLabels } from './config.js';
import * as State from './state.js';

export let database = null;
export let auth = null;
export let googleProvider = null;
export let currentUser = null;

let leaderboardCallbacks = {};

// --- Firebase Başlatma ---
export function initFirebase(onAuthReady) {
    try {
        firebase.initializeApp(firebaseConfig);
        database = firebase.database();
        auth = firebase.auth();
        googleProvider = new firebase.auth.GoogleAuthProvider();

        auth.onAuthStateChanged(user => {
            currentUser = user;
            if (onAuthReady) onAuthReady(user);
        });
    } catch (error) {
        console.error("Firebase başlatılamadı (Lütfen config ayarlarını yapın):", error);
    }
}

// --- Kimlik Doğrulama ---
export function openAuthModal() {
    document.getElementById('authError').textContent = "";
    document.getElementById('authEmail').value = "";
    document.getElementById('authPassword').value = "";
    document.getElementById('authModal').classList.remove('hidden');
}

export function login() {
    const email = document.getElementById('authEmail').value;
    const pass = document.getElementById('authPassword').value;
    if (auth) {
        auth.signInWithEmailAndPassword(email, pass).catch(err => {
            document.getElementById('authError').textContent = err.message;
        });
    }
}

export function register() {
    const email = document.getElementById('authEmail').value;
    const pass = document.getElementById('authPassword').value;
    if (auth) {
        auth.createUserWithEmailAndPassword(email, pass).catch(err => {
            document.getElementById('authError').textContent = err.message;
        });
    }
}

export function loginWithGoogle() {
    if (window.location.protocol === 'file:') {
        var errBox = document.getElementById('authError');
        errBox.textContent = '';
        var warningDiv = document.createElement('div');
        warningDiv.style.cssText = 'background:rgba(255,152,0,0.15);border-left:4px solid var(--header);padding:12px;border-radius:8px;font-size:13px;text-align:left;line-height:1.4;color:var(--text);margin-bottom:15px;';
        var msg = '';
        msg += '<b>⚠️ Tarayıcı Güvenlik Kısıtlaması:<\/b><br>';
        msg += 'Google Giriş özelliği doğrudan çift tıklatılan dosyalarda (file:\/\/) çalışmaz.<br><br>';
        msg += '<b>Nasıl Çalıştırılır?<\/b><br>';
        msg += '1. VS Code kullanıyorsanız sağ alt köşedeki <b>"Go Live"<\/b> (Live Server) butonuna tıklayın.<br>';
        msg += '2. Veya terminalde bu klasörde <b>npx http-server<\/b> komutunu çalıştırarak <b>http:\/\/localhost:8080<\/b> adresinden oyunu açın.';
        warningDiv.innerHTML = msg;
        errBox.appendChild(warningDiv);
        return;
    }
    if (auth) {
        auth.signInWithPopup(googleProvider).catch(function (err) {
            console.error("Google Giriş Hatası:", err);
            var errorMsg = "Google Girişi Hatalı: " + err.message;
            if (err.code === 'auth/operation-not-supported-in-this-environment') {
                errorMsg = "Google Girişi bu ortamda desteklenmiyor. Lütfen oyunu yerel sunucu (localhost) üzerinden açın.";
            } else if (err.code === 'auth/auth-domain-config-required') {
                errorMsg = "Hata: Firebase yetkilendirilmiş alan adı (Authorized Domain) yapılandırılmamış.";
            }
            document.getElementById('authError').textContent = errorMsg;
        });
    }
}

export function logout(notifyFn, loadProfileFromLocalFn) {
    if (auth) {
        auth.signOut();
        notifyFn("Çıkış yapıldı. Yerel profile dönüldü.", true);
        loadProfileFromLocalFn();
    }
}

// --- Profil Firebase İşlemleri ---
export function loadProfileFromFirebase(uid, applyProfileDataFn, saveProfileFn, notifyFn) {
    database.ref('users/' + uid).once('value').then(snapshot => {
        const p = snapshot.val();
        if (p) {
            applyProfileDataFn(p);
            notifyFn("Bulut profili yüklendi!", true);
        } else {
            saveProfileFn();
            notifyFn("Hesap oluşturuldu, veriler buluta eşitlendi!", true);
        }
    }).catch(err => console.error("Firebase veri çekme hatası:", err));
}

export function saveToFirebase(dataToSave) {
    if (currentUser && database) {
        database.ref('users/' + currentUser.uid).set(dataToSave).catch(err => console.error(err));

        let displayName = State.customUsername || currentUser.displayName || currentUser.email.split('@')[0];
        database.ref('leaderboard/' + currentUser.uid).set({
            username: displayName,
            score: State.gameStats.maxScore || 0,
            level: State.level,
            totalCorrect: State.gameStats.totalCorrect || 0,
            addCorrect: State.gameStats.addCorrect || 0,
            subCorrect: State.gameStats.subCorrect || 0,
            mulCorrect: State.gameStats.mulCorrect || 0,
            divCorrect: State.gameStats.divCorrect || 0,
            blitzCorrect: State.gameStats.blitzCorrect || 0,
            survivalCorrect: State.gameStats.survivalCorrect || 0
        }).catch(err => console.error(err));
    }
}

// --- Liderlik Tablosu ---
export let currentLeaderboardCategory = "totalCorrect";

export function changeLeaderboardCategory() {
    const sel = document.getElementById("leaderboardCategory");
    if (sel) {
        currentLeaderboardCategory = sel.value;
        updateLeaderboard();
    }
}

export function updateLeaderboard() {
    if (!database) return;

    database.ref('leaderboard').orderByChild(currentLeaderboardCategory).limitToLast(10).on('value', snapshot => {
        const list = [];
        snapshot.forEach(child => {
            list.push(child.val());
        });
        list.reverse();

        const lbList = document.getElementById("leaderboardList");
        if (!lbList) return;
        lbList.innerHTML = "";
        if (list.length === 0) {
            lbList.innerHTML = "<p>Henüz kimse skor kaydetmedi.</p>";
            return;
        }

        const label = categoryLabels[currentLeaderboardCategory] || "Doğru";

        list.forEach((entry, index) => {
            const div = document.createElement('div');
            div.className = "history-item";
            div.style.display = "flex";
            div.style.justifyContent = "space-between";
            let rank = index + 1;
            let icon = rank === 1 ? "🥇" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : "🎖️";

            let val = entry[currentLeaderboardCategory] || 0;

            div.innerHTML = `
                <div style="font-weight: bold; font-size: 16px; color: var(--accent);">${icon} ${entry.username} (Seviye ${entry.level || 1})</div>
                <div style="font-weight: bold;">${label}: ${val}</div>
            `;
            lbList.appendChild(div);
        });
    });
}
