// =============================
// CONFIGURAÇÃO GERAL
// =============================
document.addEventListener("DOMContentLoaded", () => {
    console.log("GameBoy Cloud iniciado");

    // Esconde seleção de texto
    document.body.style.userSelect = "none";

    // Vibração curta
    function vibrar(ms = 30) {
        if (navigator.vibrate) {
            navigator.vibrate(ms);
        }
    }

    // Som de clique
    const clickSound = new Audio("assets/click.mp3");
    clickSound.volume = 0.4;

    function playClick() {
        clickSound.currentTime = 0;
        clickSound.play().catch(() => {});
    }

    // =============================
    // BOTÕES VIRTUAIS
    // =============================
    const buttons = document.querySelectorAll(".controls button");

    buttons.forEach(btn => {
        btn.addEventListener("touchstart", () => {
            vibrar();
            playClick();
            btn.classList.add("active");
        });

        btn.addEventListener("touchend", () => {
            btn.classList.remove("active");
        });
    });

    // =============================
    // FULLSCREEN
    // =============================
    const emu = document.getElementById("emulator");

    emu.addEventListener("dblclick", () => {
        vibrar(60);
        if (!document.fullscreenElement) {
            emu.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    });

    // =============================
    // LOADING SCREEN
    // =============================
    const loading = document.createElement("div");
    loading.id = "loading";
    loading.innerHTML = "🎮 Carregando Game Boy...";
    document.body.appendChild(loading);

    window.addEventListener("load", () => {
        setTimeout(() => {
            loading.style.opacity = "0";
            setTimeout(() => loading.remove(), 500);
        }, 1200);
    });
});

// =============================
// TECLAS DO EMULADOR
// =============================
// EmulatorJS usa teclado virtual
// A = X | B = Z | Start = Enter | Select = Shift

function pressKey(key) {
    const event = new KeyboardEvent("keydown", {
        key: key,
        bubbles: true
    });
    document.dispatchEvent(event);
}

function releaseKey(key) {
    const event = new KeyboardEvent("keyup", {
        key: key,
        bubbles: true
    });
    document.dispatchEvent(event);
}

// =============================
// MAPEAMENTO DOS BOTÕES
// =============================
document.addEventListener("DOMContentLoaded", () => {

    document.querySelectorAll(".controls button").forEach(btn => {
        const name = btn.innerText.toUpperCase();

        btn.addEventListener("touchstart", () => {
            if (name === "A") pressKey("x");
            if (name === "B") pressKey("z");
            if (name === "START") pressKey("Enter");
            if (name === "SELECT") pressKey("Shift");
        });

        btn.addEventListener("touchend", () => {
            if (name === "A") releaseKey("x");
            if (name === "B") releaseKey("z");
            if (name === "START") releaseKey("Enter");
            if (name === "SELECT") releaseKey("Shift");
        });
    });

});
