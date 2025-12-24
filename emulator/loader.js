// =============================
// EMULATOR LOADER (Game Boy)
// =============================

// Config padrão (pode ser sobrescrita no index.html)
window.EJS_player = window.EJS_player || "#emulator";
window.EJS_core = window.EJS_core || "gb";
window.EJS_gameUrl = window.EJS_gameUrl || "";
window.EJS_pathtodata = window.EJS_pathtodata || "emulator/";
window.EJS_startOnLoaded = true;
window.EJS_Buttons = {
    playPause: false,
    restart: false,
    mute: true,
    settings: true,
    fullscreen: true,
    saveState: false,
    loadState: false
};

// Mobile otimização
window.EJS_defaultControls = true;
window.EJS_touchControls = true;
window.EJS_screenRecording = false;
window.EJS_disableDatabases = false;

// =============================
// LOAD EMULATORJS SCRIPT
// =============================
(function () {
    const script = document.createElement("script");
    script.src = EJS_pathtodata + "emulator.min.js";
    script.async = true;
    document.head.appendChild(script);
})();

// =============================
// READY CHECK
// =============================
let waitEmulator = setInterval(() => {
    if (window.EJS_emulator) {
        clearInterval(waitEmulator);
        onEmulatorReady();
    }
}, 100);

// =============================
// EMULATOR READY
// =============================
function onEmulatorReady() {
    console.log("EmulatorJS pronto");

    // Força foco (mobile)
    const player = document.querySelector(EJS_player);
    player.tabIndex = 1;
    player.focus();

    // Ajuste tela
    resizeScreen();
    window.addEventListener("resize", resizeScreen);

    // FPS mais estável em celular fraco
    try {
        EJS_emulator.setSpeed(1);
    } catch (e) {}

    // Auto-load save se existir
    autoLoad();
}

// =============================
// AUTO LOAD
// =============================
function autoLoad() {
    if (!window.indexedDB) return;

    const request = indexedDB.open("GameBoyMemoryCard", 1);
    request.onsuccess = e => {
        const db = e.target.result;
        const tx = db.transaction("saves", "readonly");
        const store = tx.objectStore("saves");
        const req = store.get(getGameId());

        req.onsuccess = () => {
            if (req.result) {
                try {
                    EJS_emulator.loadState(req.result.state);
                    console.log("Save carregado automaticamente");
                } catch (e) {}
            }
        };
    };
}

// =============================
// SCREEN RESIZE
// =============================
function resizeScreen() {
    const el = document.querySelector(EJS_player);
    if (!el) return;

    const w = window.innerWidth;
    const h = window.innerHeight;

    el.style.maxWidth = w + "px";
    el.style.maxHeight = h * 0.55 + "px";
}

// =============================
// GAME ID (por ROM)
// =============================
function getGameId() {
    if (!EJS_gameUrl) return "default";
    return EJS_gameUrl
        .split("/")
        .pop()
        .replace(".gb", "")
        .replace(".gbc", "");
}

// =============================
// API GLOBAL (USO NO script.js)
// =============================
window.GameBoyAPI = {
    save() {
        try {
            return EJS_emulator.saveState();
        } catch {
            return null;
        }
    },

    load(state) {
        try {
            EJS_emulator.loadState(state);
        } catch {}
    },

    screenshot() {
        try {
            return EJS_emulator.getScreenshot();
        } catch {
            return null;
        }
    },

    fullscreen() {
        const el = document.querySelector(EJS_player);
        if (el.requestFullscreen) el.requestFullscreen();
    }
};
