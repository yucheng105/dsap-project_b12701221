let synthByColor = null;

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function getSynthByColor(color) {
    if (!synthByColor) {
        synthByColor = {};
    }

    if (!synthByColor[color]) {
        const oscillatorType = CONFIG.COLORS[color] || 'sine';
        synthByColor[color] = new Tone.PolySynth(Tone.Synth, {
            oscillator: { type: oscillatorType },
            envelope: { attack: 0.01, decay: 0.1, sustain: 0.2, release: 0.3 },
        }).toDestination();
    }

    return synthByColor[color];
}

async function playMusic(allStrokes, canvasWidth, canvasHeight) {
    const { CONFIG } = window;

    if (!allStrokes.length) {
        return;
    }

    await Tone.start();
    Tone.Transport.stop();
    Tone.Transport.cancel();
    Tone.Transport.position = 0;

    allStrokes.forEach((stroke) => {
        const synth = getSynthByColor(String(stroke.color).toLowerCase());
        const pointCount = stroke.points.length;

        stroke.points.forEach((point, index) => {

            // x value determines the start time of the note
            // y value determines the pitch
            // line width determines the velocity

            const startTime = (point.x / canvasWidth) * CONFIG.DURATION;
            const yPercent = clamp(1 - (point.y / canvasHeight), 0, 1);
            const noteIndex = Math.floor(yPercent * (CONFIG.SCALE.length - 1)); // map to C Major Pentatonic scale
            const note = CONFIG.SCALE[noteIndex];
            const velocity = clamp(stroke.lineWidth / 12, 0.15, 1);

            // 讓每個筆劃內的音長依照點數自動調整，避免整段都擠在一起
            const durationSeconds = clamp(CONFIG.DURATION / Math.max(pointCount, 1), 0.05, 0.25);

            Tone.Transport.schedule((time) => {
                synth.triggerAttackRelease(note, durationSeconds, time, velocity);
            }, startTime + index * 0.01);
        });
    });

    Tone.Transport.start();
}

function stopMusic() {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    Tone.Transport.position = 0;
}

window.MusicApp = {
    playMusic,
    stopMusic,
};