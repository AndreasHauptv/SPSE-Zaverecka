let cur = '0', expr = '', justEvaled = false;

// 1-CZK , 2-EUR , 3-DOLLAR , 4-LIBRY
let currency = 1;

function updateDisplay() {
    const r = document.getElementById('result');
    const e = document.getElementById('expr');
    r.textContent = cur;
    e.textContent = expr;
    r.className = 'result';
    if (cur.length > 12) r.classList.add('xsmall');
    else if (cur.length > 8) r.classList.add('small');
}

function calc(a, op,b) {
    a = parseFloat(a);
    b = parseFloat(b);
    if (op === 'CZK'){
        if (currency === 1 ){
            currency = 1
            return a;
        }else if (currency === 2 ){
            currency = 1
            return a * 24.31;
        }else if (currency === 3 ){
            currency = 1
            return a * 20.95;
        }else
            currency = 1
            return a * 28.05;
    }
    if (op === 'DOLLAR'){
        if (currency === 1 ){
            currency = 3
            return a / 20.91;
        }else if (currency === 2 ){
            currency = 3
            return a * 0.86;
        }else if (currency === 3 ){
            currency = 3
            return a;
        }else
            currency = 3
            return a / 0.75;
    }
    if (op === 'EURO'){
        if (currency === 1 ){
            currency = 2
            return a / 24.30;
        }else if (currency === 2 ){
            currency = 2
            return a
        }else if (currency === 3 ){
            currency = 2
            return a * 1.16;
        }else
            currency = 2
            return a * 1.15;
    }
    if (op === 'LIBRY'){
        if (currency === 1 ){
            currency = 4;
            return a / 28.05;
        }else if (currency === 2 ){
            currency = 4;
            return a * 0.87;
        }else if (currency === 3 ){
            currency = 4;
            return a / 1.34;
        }else
            currency = 4;
            return a;
    }
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

    } else if (['LIBRY', 'DOLLAR', 'EURO', 'CZK'].includes(val)) {
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
        '.':'.','Enter':'=','=':'=','LIBRY':'LIBRY',
        'DOLLAR':'DOLLAR','*':'EURO','/':'CZK',
        'Backspace':'DEL','Escape':'C','%':'%'
    };
    if (map[e.key]) { e.preventDefault(); handle(map[e.key]); }
});

updateDisplay();
