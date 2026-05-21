let cur = '0', expr = '', justEvaled = false;
<!-- Aktualizace číšel na kalkulačce -->
function updateDisplay() {
    const r = document.getElementById('result');
    const e = document.getElementById('expr');
    r.textContent = cur;
    e.textContent = expr;
    r.className = 'result';
    if (cur.length > 12) r.classList.add('xsmall');
    else if (cur.length > 8) r.classList.add('small');
}

<!-- Funkce kalkulačky -->
function calc(a, op, b) {
    a = parseFloat(a);
    b = parseFloat(b);
    if (op === '+') return a + b;
    if (op === '−') return a - b;
    if (op === '×') return a * b;
    if (op === '÷') return b === 0 ? 'Error' : a / b;
    return b;
}

function fmt(n) {
    if (n === 'Error') return 'Error';
    return parseFloat(n.toPrecision(12)).toString();
}

function handle(val) {
    if (val === 'C') {
        cur = '0'; expr = ''; justEvaled = false;

    } else if (val === 'DEL') {
        if (justEvaled) { cur = '0'; expr = ''; justEvaled = false; return; }
        cur = cur.length > 1 ? cur.slice(0, -1) : '0';

    } else if (val === '%') {
        cur = fmt(parseFloat(cur) / 100);

    } else if (['+', '−', '×', '÷'].includes(val)) {
        if (expr && !justEvaled) {
            const parts = expr.trim().split(' ');
            if (parts.length === 3) {
                const res = calc(parts[0], parts[1], cur);
                cur = typeof res === 'number' ? fmt(res) : res;
            }
        }
        expr = cur + ' ' + val + ' ';
        justEvaled = false;

    } else if (val === '=') {
        if (!expr) return;
        const parts = expr.trim().split(' ');
        if (parts.length >= 2) {
            const res = calc(parts[0], parts[1], cur);
            expr = expr + cur + ' =';
            cur = typeof res === 'number' ? fmt(res) : res;
            justEvaled = true;
        }

    } else {
        if (justEvaled) { cur = ''; expr = ''; justEvaled = false; }
        if (val === '.') {
            if (cur.includes('.')) return;
            if (cur === '0' || cur === '') { cur = '0.'; updateDisplay(); return; }
        }
        if (cur === '0' && val !== '.') cur = val;
        else cur += val;
    }

    updateDisplay();
}

document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', () => handle(btn.dataset.val));
});

document.addEventListener('keydown', e => {
    const map = {
        '0':'0','1':'1','2':'2','3':'3','4':'4',
        '5':'5','6':'6','7':'7','8':'8','9':'9',
        '.':'.','Enter':'=','=':'=','+':'+',
        '-':'−','*':'×','/':'÷',
        'Backspace':'DEL','Escape':'C','%':'%'
    };
    if (map[e.key]) { e.preventDefault(); handle(map[e.key]); }
});

updateDisplay();
