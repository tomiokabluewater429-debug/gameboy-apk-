// =============================
// EMULATOR LOADER (Game Boy / GBA)
// =============================

// Config padrão (sobrescrita pelo index.html)
window.EJS_player = window.EJS_player || "#emulator";
window.EJS_core = window.EJS_core || "gba";
window.EJS_gameUrl = window.EJS_gameUrl || "";
window.EJS_pathtodata = window.EJS_pathtodata || "emulator/";
window.EJS_startOnLoaded = true;

// Remove botões nativos (usaremos os nossos)
window.EJS_Buttons = {
    playPause: false,
    restart: false,
    mute: true,
    settings: false,
    fullscreen: true,
    saveState: false,
    loadState: false
};

// Mobile
window.EJS_defaultControls = true;
window.EJS_touchControls = true;
window.EJS_screenRecording = false;
window.EJS_disableDatabases = false;

// =============================
// LOAD EMULATORJS
// =============================
(function () {
    const script = document.createElement("script");
    script.src = EJS_pathtodata + "emulator.min.js";
    script.defer = true;
    document.head.appendChild(script);
})();

// =============================
// EVENTO CORRETO DE READY
// =============================
window.EJS_onGameStart = function () {
    console.log("EmulatorJS iniciado");

    const player = document.querySelector(EJS_player);
    if (player) {
        player.tabIndex = 1;
        player.focus();
    }

    resizeScreen();
    window.addEventListener("resize", resizeScreen);

    autoLoad();
};

// =============================
// AUTO LOAD SAVE
// =============================
function autoLoad() {
    if (!window.indexedDB || !window.EJS_emulator) return;

    const request = indexedDB.open("GameBoyMemoryCard", 1);

    request.onsuccess = e => {
        const db = e.target.result;

        if (!db.objectStoreNames.contains("saves")) return;

        const tx = db.transaction("saves", "readonly");
        const store = tx.objectStore("saves");
        const req = store.get(getGameId());

        req.onsuccess = () => {
            if (req.result && req.result.state) {
                try {
                    window.EJS_emulator.loadState(req.result.state);
                    console.log("Save carregado");
                } catch (err) {
                    console.warn("Erro ao carregar save");
                }
            }
        };
    };
}

// =============================
// AJUSTE DE TELA
// =============================
function resizeScreen() {
    const el = document.querySelector(EJS_player);
    if (!el) return;

    el.style.width = "100%";
    el.style.maxHeight = "60vh";
}

// =============================
// GAME ID (GB / GBC / GBA)
// =============================
function getGameId() {
    if (!EJS_gameUrl) return "default";

    return EJS_gameUrl
        .split("/")
        .pop()
        .replace(".gba", "")
        .replace(".gbc", "")
        .replace(".gb", "")
        .replace(/\s+/g, "");
}

// =============================
// API GLOBAL
// =============================
window.GameBoyAPI = {
    save() {
        try {
            return window.EJS_emulator.saveState();
        } catch {
            return null;
        }
    },

    load(state) {
        try {
            window.EJS_emulator.loadState(state);
        } catch {}
    },

    screenshot() {
        try {
            return window.EJS_emulator.getScreenshot();
        } catch {
            return null;
        }
    },

    fullscreen() {
        const el = document.querySelector(EJS_player);
        if (el?.requestFullscreen) el.requestFullscreen();
    }
};
