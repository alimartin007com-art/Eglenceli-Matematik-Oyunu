// === EMO v3.1 - math.js ===
// Matematik sorularının üretilmesi ve yardımcı matematik fonksiyonları

import * as State from './state.js';

export function randInt(a, b) { 
    return Math.floor(Math.random() * (b - a + 1)) + a; 
}

export function pickRange(l) {
    if (l == 1) return { min: -10, max: 10, absMax: 20 };
    if (l == 2) return { min: -30, max: 30, absMax: 50 };
    return { min: -100, max: 100, absMax: 100 };
}

export function sup(n) { 
    const supMap = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
    return String(n).split('').map(c => supMap[c] || c).join('');
}

export function formatAlgebra(n) {
    return n == 1 ? "x" : n == -1 ? "-x" : n == 0 ? "" : n + "x";
}

export function getEffectiveLevel() {
    if (State.gameState.level === "adaptive") return State.currentAdaptiveLevel;
    return Number(State.gameState.level);
}

export function makeProblem() {
    const m = State.gameState.mode;
    const lvl = getEffectiveLevel();
    
    let t;
    if (m === "speed" || m === "mixed" || m === "survival") {
        const mixPool = ["add", "sub", "mul", "div", "paren", "missing", "exp", "algebra"];
        t = mixPool[randInt(0, mixPool.length - 1)];
    } else {
        t = m;
    }

    const range = pickRange(lvl);
    let a, b, ans, op, text;
    
    if (t === "paren") {
        let x = randInt(-10, 10), y = randInt(-10, 10), z = randInt(-5, 5);
        if (randInt(0, 1) === 0) {
            let parOp = randInt(0, 1) === 0 ? "+" : "-";
            ans = parOp === "+" ? (x + y) * z : (x - y) * z;
            text = `${z} × (${x < 0 ? "(" + x + ")" : x} ${parOp} ${y < 0 ? "(" + y + ")" : y})`;
        } else {
            let parOp1 = randInt(0, 1) === 0 ? "+" : "-";
            let parOp2 = randInt(0, 1) === 0 ? "+" : "-";
            let inner = parOp2 === "+" ? y + z : y - z;
            ans = parOp1 === "+" ? x + inner : x - inner;
            text = `${x < 0 ? "(" + x + ")" : x} ${parOp1} (${y < 0 ? "(" + y + ")" : y} ${parOp2} ${z < 0 ? "(" + z + ")" : z})`;
        }
    } else if (t === "algebra") {
        let c1 = randInt(-10, 10);
        let c2 = randInt(-10, 10);
        while (c1 === 0 && c2 === 0) { c1 = randInt(-10, 10); c2 = randInt(-10, 10); }
        if (randInt(0, 1) === 0) {
            ans = c1 + c2; 
            text = `${formatAlgebra(c1)} + ${c2 < 0 ? "(" + formatAlgebra(c2) + ")" : formatAlgebra(c2)}`;
        } else {
            ans = c1 - c2; 
            text = `${formatAlgebra(c1)} - ${c2 < 0 ? "(" + formatAlgebra(c2) + ")" : formatAlgebra(c2)}`;
        }
        text = `${text} = ?`;
        State.setCurrentProblem({ text: text, ans: ans, type: t, resultText: formatAlgebra(ans) });
        return State.currentProblem;
    } else if (t === "exp") {
        let baseRange = (lvl == 1) ? 4 : (lvl == 2) ? 6 : 8;
        let maxExp = (lvl == 1) ? 3 : (lvl == 2) ? 4 : 5;
        let exponent = randInt(2, maxExp); 
        if (lvl === 3 && randInt(0, 5) === 0) exponent = 0;
        let base = randInt(-1 * baseRange, baseRange); 
        if ((base === 0 && exponent === 0) || Math.abs(base) === 1) return makeProblem();
        ans = Math.pow(base, exponent); 
        if (ans > 2000 || ans < -2000) return makeProblem();
        text = `${base < 0 || base === 0 ? "(" + base + ")" : base}${sup(exponent)}`;
    } else if (t === "missing") {
        a = randInt(range.min, range.max);
        let opType = ["add", "sub", "mul"][randInt(0, 2)];
        op = opType === "add" ? "+" : opType === "sub" ? "-" : "×";
        let result;
        if (opType === "add") result = a + randInt(range.min, range.max);
        else if (opType === "sub") result = a - randInt(range.min, range.max);
        else {
            b = randInt(-5, 5);
            if (b === 0) b = 1;
            result = a * b;
        }
        if (randInt(0, 1) === 0) {
            text = `${a < 0 ? "(" + a + ")" : a} ${op} X = ${result}`;
            ans = opType === "add" ? result - a : opType === "sub" ? a - result : result / a;
        } else {
            text = `X ${op} ${a < 0 ? "(" + a + ")" : a} = ${result}`;
            ans = opType === "add" ? result - a : opType === "sub" ? result + a : result / a;
        }
        if (ans % 1 !== 0) return makeProblem();
        
    } else { 
        a = randInt(range.min, range.max);
        b = randInt(range.min, range.max);
        switch (t) { 
            case "add": op = "+"; ans = a + b; break;
            case "sub": op = "-"; ans = a - b; break; 
            case "mul": 
                a = randInt(-10, 10); b = randInt(-10, 10);
                op = "×"; ans = a * b; break;
            case "div": 
                let divisor = randInt(1, lvl === 3 ? 10 : 5);
                if (randInt(0, 1) === 0) divisor *= -1; 
                ans = randInt(-10, 10); 
                a = divisor * ans; 
                b = divisor;
                op = "÷"; 
                if (b === 0) return makeProblem(); 
                break;
        }
        text = `${a < 0 ? "(" + a + ")" : a} ${op} ${b < 0 ? "(" + b + ")" : b}`;
    }
    
    if (t === "mul") State.setMulCount(State.mulCount + 1);
    
    return { text: text + (t !== "missing" && t !== "exp" && t !== "algebra" ? " = ?" : ""), ans: ans, type: t };
}
