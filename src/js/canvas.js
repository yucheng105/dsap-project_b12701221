const canvas = document.getElementById('drawing-board');
const container = document.querySelector('.drawing-board');
const toolbar = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');   
const strokeSelect = document.getElementById('stroke'); // stroke_color
const lineWidthSelect = document.getElementById('lineWidth');

let isPainting = false;
let lineWidth = 5;

const allowedColors = ['#ff0000', '#ffff00', '#0000ff'];
const allowedLineWidths = [10, 5, 2];

let allStrokes = [];
let currentStroke = null;

ctx.lineCap = 'round';

function applyBrushSettingsFromToolbar() {
    const selectedColor = String(strokeSelect.value).toLowerCase();
    const selectedLineWidth = Number(lineWidthSelect.value);

    if (allowedColors.includes(selectedColor)) {
        ctx.strokeStyle = selectedColor;
    } else {
        ctx.strokeStyle = allowedColors[0];
        strokeSelect.value = allowedColors[0];
    }

    if (allowedLineWidths.includes(selectedLineWidth)) {
        lineWidth = selectedLineWidth;
    } else {
        lineWidth = allowedLineWidths[0];
        lineWidthSelect.value = String(allowedLineWidths[0]);
    }

    ctx.lineWidth = lineWidth;
}

function getCanvasCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    };
}

function resizeCanvas() {
    canvas.width = container.clientWidth - 40;
    canvas.height = container.clientHeight - 40;
}

function stopPainting() {
    if (!isPainting) {
        return;
    }

    isPainting = false;
    ctx.beginPath();

    if (currentStroke && currentStroke.points.length > 0) {
        allStrokes.push(currentStroke);
    }

    currentStroke = null;
}

function draw(e) {
    if (!isPainting) {
        return;
    }

    const { x, y } = getCanvasCoordinates(e);

    if (x < 0 || y < 0 || x > canvas.width || y > canvas.height) {
        stopPainting();
        return;
    }

    ctx.lineTo(x, y);
    ctx.stroke();

    currentStroke.points.push({ x, y });
}

canvas.addEventListener('mousedown', (e) => {
    const { x, y } = getCanvasCoordinates(e);

    isPainting = true;
    ctx.beginPath();
    ctx.moveTo(x, y);

    currentStroke = {
        color: String(ctx.strokeStyle).toLowerCase(),
        lineWidth,
        points: [{ x, y }],
    };
});

canvas.addEventListener('mouseup', stopPainting);
canvas.addEventListener('mouseleave', stopPainting);
canvas.addEventListener('mousemove', draw);

toolbar.addEventListener('click', (e) => {
    if (e.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        allStrokes = [];
        currentStroke = null;
    }
});

toolbar.addEventListener('change', (e) => {
    if (e.target.id === 'stroke') {
        applyBrushSettingsFromToolbar();
    }

    if (e.target.id === 'lineWidth') {
        applyBrushSettingsFromToolbar();
    }
});

window.addEventListener('resize', resizeCanvas);
resizeCanvas();
applyBrushSettingsFromToolbar();

function getDrawingData() {
    return allStrokes;
}

function getCanvasSize() {
    return {
        width: canvas.width,
        height: canvas.height,
    };
}

function clearDrawingData() {
    allStrokes = [];
    currentStroke = null;
}

window.CanvasApp = {
    getDrawingData,
    getCanvasSize,
    clearDrawingData,
};
