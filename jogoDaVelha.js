let quadradosEl = document.querySelectorAll('.quadrado');
let contadorXEl = document.querySelector('#vitorias-X');
let contadorOEl = document.querySelector('#vitorias-O');
let indicadorVezEl = document.querySelector('h1');

let vitoriasX = window.sessionStorage.getItem('vitoriasX');
let vitoriasO = window.sessionStorage.getItem('vitoriasO');
if (vitoriasX) {
    contadorXEl.innerHTML = `Vitórias X: ${vitoriasX}`;
}
if (vitoriasO) {
    contadorOEl.innerHTML = `Vitórias O: ${vitoriasO}`;
}

let marcadorXO = window.localStorage.getItem('marcadorXO');
if (marcadorXO % 2 === 1) {
    indicadorVezEl.innerHTML = 'Vez de X';
} else if (marcadorXO % 2 === 0) {
    indicadorVezEl.innerHTML = 'Vez de O';
}

for(let i = 0; i < 9; i++) {
    quadradosEl[i].innerHTML = window.localStorage.getItem(`quadrado${i}`);
}


function reiniciar() {
    for (let i = 0; i < 9; i++) {
        quadradosEl[i].innerHTML = '';
        window.localStorage.setItem(`quadrado${i}`, '');
    }
    marcadorXO = 1;
    window.localStorage.setItem('marcadorXO', marcadorXO);
    indicadorVezEl.innerHTML = 'Vez de X';
}
function reiniciarVitorias() {
    vitoriasX = 0;
    vitoriasO = 0;
    window.sessionStorage.setItem('vitoriasX', 0);
    window.sessionStorage.setItem('vitoriasO', 0);
    contadorXEl.innerHTML = 'Vitórias X: 0';
    contadorOEl.innerHTML = 'Vitórias O: 0';
}
function verificaTabuleiroCheio() {
    for (let quadradoEl of quadradosEl) {
        if (quadradoEl.innerHTML === '') {
            return 0;
        }
    }
    return 1;
}
function verificaColunaCompleta(coluna) {
    let marcacaoAtual = quadradosEl[coluna].innerHTML;
    for (let i = 0; i < 3; i++) {
        if (quadradosEl[coluna + 3 * i].innerHTML != marcacaoAtual) {
            return 0;
        }
    }
    return 1;
}
function verificaLinhaCompleta(linha) {
    let marcacaoAtual = quadradosEl[3 * linha].innerHTML;
    for (let i = 0; i < 3; i++) {
        if (quadradosEl[ 3 * linha + i].innerHTML != marcacaoAtual) {
            return 0;
        }
    }
    return 1;
}
function verificaDiagonalCompleta(index) {
    let marcacaoAtual = quadradosEl[index].innerHTML;
    let verificacaoDiagonal1 = 1;
    let verificacaoDiagonal2 = 1;
    for (let i = 0; i < 9; i += 4) {
        if (quadradosEl[i].innerHTML != marcacaoAtual) {
            verificacaoDiagonal1 = 0;
            break;
        }
    }
    for (let i = 2; i < 7; i += 2) {
        if (quadradosEl[i].innerHTML != marcacaoAtual) {
            verificacaoDiagonal2 = 0;
            break;
        }
    }
    return Math.ceil((verificacaoDiagonal1 + verificacaoDiagonal2) / 2);
}
function verificaVitoria(quadrado) {
    let arrayQuadradosEl = Array.from(quadradosEl);
    let indexQuadrado = arrayQuadradosEl.indexOf(quadrado);

    if (verificaColunaCompleta(Math.floor(indexQuadrado % 3))
    || verificaLinhaCompleta(Math.floor(indexQuadrado / 3))
    || verificaDiagonalCompleta(indexQuadrado)) {
        let vencedor = quadrado.innerHTML
        reiniciar();
        indicadorVezEl.innerHTML = `Vitória de ${vencedor}`;

        let vitoriasVencedor;
        if (vencedor === 'X') {
            vitoriasX++;
            window.sessionStorage.setItem('vitoriasX', vitoriasX);
            vitoriasVencedor = vitoriasX;
        } else {
            vitoriasO++;
            window.sessionStorage.setItem('vitoriasO', vitoriasO);
            vitoriasVencedor = vitoriasO;
        }
        let contadorVencedorEl = document.querySelector(`#vitorias-${vencedor}`);
        contadorVencedorEl.innerHTML = `Vitórias ${vencedor}: ${vitoriasVencedor}`;
    } else if (verificaTabuleiroCheio() === 1) {
        reiniciar();
        indicadorVezEl.innerHTML = 'Velha';
    }
}
function alternaMarcador(quadrado) {
    if (marcadorXO % 2 === 1 && quadrado.innerHTML === '') {
        quadrado.innerHTML = 'X';
        indicadorVezEl.innerHTML = 'Vez de O';
        marcadorXO = 0;
    } else if (marcadorXO % 2 === 0 && quadrado.innerHTML === '') {
        quadrado.innerHTML = 'O';
        indicadorVezEl.innerHTML = 'Vez de X';
        marcadorXO = 1;
    }
    window.localStorage.setItem('marcadorXO', marcadorXO);
}

let botaoReiniciarEl = document.querySelector('#botao-reiniciar');
botaoReiniciarEl.addEventListener('click', reiniciar);

let botaoReiniciarVitoriasEl = document.querySelector('#botao-reiniciar-vitorias');
botaoReiniciarVitoriasEl.addEventListener('click', reiniciarVitorias);

for (let quadradoEl of quadradosEl) {
    quadradoEl.addEventListener('click', (e) => {
        let quadradoAtual = e.currentTarget;
        let arrayQuadradosEl = Array.from(quadradosEl);
        let indexQuadradoAtual = arrayQuadradosEl.indexOf(quadradoAtual);

        alternaMarcador(quadradoAtual);
        verificaVitoria(quadradoAtual);

        window.localStorage.setItem(`quadrado${indexQuadradoAtual}`, quadradoAtual.innerHTML);
    });
}