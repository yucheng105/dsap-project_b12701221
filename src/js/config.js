const CONFIG = {
    DURATION: 5,           // 總長 5 秒
    GRID_X: 20,            // 時間軸切 20 格 (1/4秒一格)
    // C Major Pentatonic 音階 (由低到高)
    SCALE: ["C2", "D2", "E2", "G2", "A2", "C3", "D3", "E3", "G3", "A3", "C4", "D4", "E4", "G4", "A4"],
    COLORS: {
        '#ff0000': 'sawtooth',
        '#ffff00': 'triangle',
        '#0000ff': 'sine'
    }
};

window.CONFIG = CONFIG;