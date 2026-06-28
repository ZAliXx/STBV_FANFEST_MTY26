const PALABRAS = [
    // Fandom
    { palabra: "DUAL",       categoria: "Fandom" },
    { palabra: "DREW",       categoria: "Fandom" },
    { palabra: "CARAMELO",     categoria: "Fandom" },
    { palabra: "VELOCIDADE",      categoria: "Fandom" },
    { palabra: "WOW",      categoria: "Fandom" },
    { palabra: "MHM",      categoria: "Fandom" },
    { palabra: "ZERO",      categoria: "Fandom" },
    { palabra: "CELULAR",       categoria: "Fandom" },
    { palabra: "ALEJANDRO",       categoria: "Fandom" },
    { palabra: "SANTOS",      categoria: "Fandom" },
    { palabra: "BRAVOS",       categoria: "Fandom" },
    { palabra: "GABI",     categoria: "Fandom" },
    { palabra: "TORTA",    categoria: "Fandom" },
    { palabra: "PASTEL",      categoria: "Fandom" },
    { palabra: "PERU",      categoria: "Fandom" },
    { palabra: "BRASIL",     categoria: "Fandom" },
    { palabra: "MEXICO",       categoria: "Fandom" },
    { palabra: "UNIDOS",      categoria: "Fandom" },
    //Español
    { palabra: "MARIPOSA",    categoria: "Español" },
    { palabra: "ESTRELLA",    categoria: "Español" },
    { palabra: "PASTEL",      categoria: "Español" },
    { palabra: "GIRASOL",     categoria: "Español" },
    { palabra: "CHOCOLATE",   categoria: "Español" },
    { palabra: "PRIMAVERA",   categoria: "Español" },
    { palabra: "ARCOIRIS",    categoria: "Español" },
    { palabra: "CORAZON",     categoria: "Español" },
    { palabra: "CANCION",     categoria: "Español" },
    { palabra: "AVENTURA",    categoria: "Español" },
    { palabra: "FANTASMA",    categoria: "Español" },
    { palabra: "GALAXIA",     categoria: "Español" },
    { palabra: "MELODIA",     categoria: "Español" },
    { palabra: "CRISTAL",     categoria: "Español" },
    //Inglés
    { palabra: "MOONLIGHT",   categoria: "English" },
    { palabra: "SPARKLE",     categoria: "English" },
    { palabra: "BLOSSOM",     categoria: "English" },
    { palabra: "RAINBOW",     categoria: "English" },
    { palabra: "TREASURE",    categoria: "English" },
    { palabra: "STARDUST",    categoria: "English" },
    { palabra: "DREAMER",     categoria: "English" },
    { palabra: "BUTTERFLY",   categoria: "English" },
    { palabra: "SUNSHINE",    categoria: "English" },
    { palabra: "GALAXY",      categoria: "English" },
    { palabra: "CRYSTAL",     categoria: "English" },
    { palabra: "MELODY",      categoria: "English" },
    { palabra: "FANTASY",     categoria: "English" },
    { palabra: "ADVENTURE",   categoria: "English" },
];

const PARTES = ["p1","p2","p3","p4","p5","p6","p7"];

let palabraActual   = "";
let categoriaActual = "";
let letrasAdivinadas = new Set();
let letrasErradas    = new Set();
let intentosMax      = 7;

const divPalabra       = document.getElementById("palabra");
const divTeclado       = document.getElementById("teclado");
const spanCategoria    = document.getElementById("categoria");
const pLetrasUsadas    = document.getElementById("letrasUsadas");
const modalVictoria    = document.getElementById("modalVictoria");
const modalDerrota     = document.getElementById("modalDerrota");
const palabraFinalV    = document.getElementById("palabraFinalV");
const palabraFinalD    = document.getElementById("palabraFinalD");

function elegirPalabra() {
    const i = Math.floor(Math.random() * PALABRAS.length);
    return PALABRAS[i];
}


function actualizarDibujo() {
    PARTES.forEach((id, idx) => {
        const el = document.getElementById(id);
        if (idx < letrasErradas.size) {
            el.classList.remove("oculto");
            el.classList.add("visible");
        } else {
            el.classList.add("oculto");
            el.classList.remove("visible");
        }
    });
}

function actualizarVidas() {
    const vidasRestantes = intentosMax - letrasErradas.size;
    for (let i = 1; i <= intentosMax; i++) {
        const c = document.getElementById("corazon" + i);
        if (i > vidasRestantes) {
            c.classList.add("perdido");
        } else {
            c.classList.remove("perdido");
        }
    }
}


function renderizarPalabra() {
    divPalabra.innerHTML = "";
    for (const letra of palabraActual) {
        const slot = document.createElement("div");
        slot.classList.add("letra-slot");

        const char = document.createElement("div");
        char.classList.add("letra-char");

        if (letrasAdivinadas.has(letra)) {
            char.textContent = letra;
            char.classList.add("revelada");
        } else {
            char.textContent = "";
        }

        const linea = document.createElement("div");
        linea.classList.add("letra-linea");

        slot.appendChild(char);
        slot.appendChild(linea);
        divPalabra.appendChild(slot);
    }
}

const LETRAS_ES = "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split("");

function renderizarTeclado() {
    divTeclado.innerHTML = "";
    LETRAS_ES.forEach(letra => {
        const btn = document.createElement("button");
        btn.classList.add("tecla");
        btn.textContent = letra;
        btn.id = "tecla-" + letra;
        btn.addEventListener("click", () => clickLetra(letra));
        divTeclado.appendChild(btn);
    });
}

function deshabilitarTecla(letra, tipo) {
    const btn = document.getElementById("tecla-" + letra);
    if (!btn) return;
    btn.disabled = true;
    btn.classList.add(tipo); // "correcta" o "incorrecta"
}

function actualizarLetrasUsadas() {
    const todas = [...letrasErradas].sort().join("  ");
    pLetrasUsadas.textContent = todas.length ? "Letras: " + todas : "";
}


function clickLetra(letra) {
    if (letrasAdivinadas.has(letra) || letrasErradas.has(letra)) return;

    if (palabraActual.includes(letra)) {
        letrasAdivinadas.add(letra);
        renderizarPalabra();
        deshabilitarTecla(letra, "correcta");

        // ¿Ganó?
        const gano = [...palabraActual].every(l => letrasAdivinadas.has(l));
        if (gano) {
            setTimeout(mostrarVictoria, 500);
        }
    } else {
        letrasErradas.add(letra);
        actualizarDibujo();
        actualizarVidas();
        actualizarLetrasUsadas();
        deshabilitarTecla(letra, "incorrecta");

        if (letrasErradas.size >= intentosMax) {
            setTimeout(mostrarDerrota, 500);
        }
    }
}

function mostrarVictoria() {
    palabraFinalV.textContent = palabraActual;
    modalVictoria.classList.remove("oculto");
}

function mostrarDerrota() {
    // Revelar toda la palabra
    [...palabraActual].forEach(l => letrasAdivinadas.add(l));
    renderizarPalabra();
    palabraFinalD.textContent = palabraActual;
    modalDerrota.classList.remove("oculto");
}

function iniciarJuego() {
    letrasAdivinadas = new Set();
    letrasErradas    = new Set();

    modalVictoria.classList.add("oculto");
    modalDerrota.classList.add("oculto");

    const entrada = elegirPalabra();
    palabraActual   = entrada.palabra;
    categoriaActual = entrada.categoria;

    spanCategoria.textContent = "Categoría: " + categoriaActual;

    actualizarDibujo();
    actualizarVidas();
    renderizarPalabra();
    renderizarTeclado();
    actualizarLetrasUsadas();
}

document.getElementById("btnOtraVictoria").addEventListener("click", iniciarJuego);
document.getElementById("btnOtraDerrota").addEventListener("click", iniciarJuego);

document.addEventListener("keydown", (e) => {
    const letra = e.key.toUpperCase();
    if (LETRAS_ES.includes(letra)) clickLetra(letra);
});

iniciarJuego();