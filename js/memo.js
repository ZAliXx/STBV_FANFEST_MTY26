const TODAS_LAS_IMAGENES = [
    "../assets/img/memo/ale.png",
    "../assets/img/memo/boy.png",
    "../assets/img/memo/dreew.png",
    "../assets/img/memo/drew.png",
    "../assets/img/memo/gab.png",
    "../assets/img/memo/gabiheart.png",
    "../assets/img/memo/ka.png",
    "../assets/img/memo/ke.png",
    "../assets/img/memo/kes.png",
    "../assets/img/memo/kime.png",
    "../assets/img/memo/kimo.png",
    "../assets/img/memo/kiwi.png",
    "../assets/img/memo/le.png",
    "../assets/img/memo/lol.png",
    "../assets/img/memo/meme.png",
    "../assets/img/memo/v.png",
    "../assets/img/memo/yum.png",
    "../assets/img/memo/all.png",
    "../assets/img/memo/sweet.png",
    "../assets/img/memo/stbv.png",
    "../assets/img/memo/a.png",
    "../assets/img/memo/b.png",
    "../assets/img/memo/c.png",
    "../assets/img/memo/d.png",
    "../assets/img/memo/e.png",
    "../assets/img/memo/f.png",
    "../assets/img/memo/g.png",
    "../assets/img/memo/h.png",
    "../assets/img/memo/i.png"
];

let primeraCarta  = null;
let segundaCarta  = null;
let bloqueado     = false;
let paresEncontrados = 0;
let movimientos   = 0;
let segundos      = 0;
let intervalo     = null;

const tablero       = document.getElementById("tablero");
const spanMov       = document.getElementById("movimientos");
const spanTiempo    = document.getElementById("tiempo");
const modal         = document.getElementById("modalVictoria");
const spanMovFinal  = document.getElementById("movFinal");
const spanTiempoFinal = document.getElementById("tiempoFinal");

function mezclar(arr) {

    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

function elegir8Aleatorias() {
    return mezclar(TODAS_LAS_IMAGENES).slice(0, 8);
}

function formatearTiempo(seg) {
    const m = String(Math.floor(seg / 60)).padStart(2, "0");
    const s = String(seg % 60).padStart(2, "0");
    return `${m}:${s}`;
}

function iniciarTimer() {
    clearInterval(intervalo);
    segundos = 0;
    spanTiempo.textContent = "00:00";
    intervalo = setInterval(() => {
        segundos++;
        spanTiempo.textContent = formatearTiempo(segundos);
    }, 1000);
}

function detenerTimer() {
    clearInterval(intervalo);
}

function crearCarta(src) {
    const carta = document.createElement("div");
    carta.classList.add("carta");

    carta.innerHTML = `
        <div class="carta-interior">
            <div class="carta-frente">
                <img src="${src}" alt="carta">
            </div>
            <div class="carta-reverso"></div>
        </div>
    `;

    carta.dataset.imagen = src;
    carta.addEventListener("click", clickCarta);
    return carta;
}

function clickCarta() {
    if (bloqueado) return;
    if (this.classList.contains("volteada")) return;
    if (this.classList.contains("encontrada")) return;

    this.classList.add("volteada");

    if (!primeraCarta) {
        primeraCarta = this;
        return;
    }

    segundaCarta = this;
    bloqueado = true;

    movimientos++;
    spanMov.textContent = movimientos;

    verificarPar();
}

function verificarPar() {
    const esPar = primeraCarta.dataset.imagen === segundaCarta.dataset.imagen;

    if (esPar) {
        primeraCarta.classList.add("encontrada");
        segundaCarta.classList.add("encontrada");
        primeraCarta.removeEventListener("click", clickCarta);
        segundaCarta.removeEventListener("click", clickCarta);
        resetearSeleccion();
        paresEncontrados++;
        if (paresEncontrados === 8) victoria();
    } else {
        setTimeout(() => {
            primeraCarta.classList.remove("volteada");
            segundaCarta.classList.remove("volteada");
            resetearSeleccion();
        }, 1000);
    }
}

function resetearSeleccion() {
    primeraCarta = null;
    segundaCarta = null;
    bloqueado    = false;
}

function victoria() {
    detenerTimer();
    spanMovFinal.textContent   = movimientos;
    spanTiempoFinal.textContent = formatearTiempo(segundos);
    setTimeout(() => modal.classList.remove("oculto"), 400);
}


function iniciarJuego() {

    primeraCarta     = null;
    segundaCarta     = null;
    bloqueado        = false;
    paresEncontrados = 0;
    movimientos      = 0;
    spanMov.textContent = "0";
    modal.classList.add("oculto");

    const elegidas = elegir8Aleatorias();
    const pares    = mezclar([...elegidas, ...elegidas]);

    tablero.innerHTML = "";
    pares.forEach(src => tablero.appendChild(crearCarta(src)));

    iniciarTimer();
}

document.getElementById("nuevaPartida").addEventListener("click", iniciarJuego);

iniciarJuego();