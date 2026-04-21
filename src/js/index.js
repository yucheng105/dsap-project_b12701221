const playButton = document.getElementById('play');
const stopButton = document.getElementById('stop');

playButton.addEventListener('click', async () => {
    const strokes = window.CanvasApp.getDrawingData();
    const { width, height } = window.CanvasApp.getCanvasSize();
    await window.MusicApp.playMusic(strokes, width, height);
});

stopButton.addEventListener('click', () => {
    window.MusicApp.stopMusic();
});