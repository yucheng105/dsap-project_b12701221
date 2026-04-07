const canvas = document.getElementById('drawing-board');
const container = document.querySelector('.drawing-board');
const toolbar = document.getElementById('toolbar');
const ctx = canvas.getContext('2d');

let isPainting = false;
let lineWidth = 5;
let startX;
let startY;
const allowedColors = ['#ff0000', '#ffff00', '#0000ff'];
const allowedLineWidths = [20, 10, 2];

ctx.strokeStyle = allowedColors[0];

function getCanvasCoordinates(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
    };
}

function resizeCanvas() {
    canvas.width = container.clientWidth - 40; // 扣除 padding
    canvas.height = container.clientHeight - 40;
}

//////
function stopPainting() {
    if (!isPainting) {
        return;
    }

    isPainting = false;
    ctx.beginPath();
}
/////


// Init Canvas Size
resizeCanvas();

toolbar.addEventListener('click', e => {
    if (e.target.id === 'clear') {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
});

toolbar.addEventListener('change', e => {
    if(e.target.id === 'stroke') {
        const selectedColor = String(e.target.value).toLowerCase();
        if (allowedColors.includes(selectedColor)) {
            ctx.strokeStyle = selectedColor;
        }
    }

    if(e.target.id === 'lineWidth') {
        const selectedLineWidth = Number(e.target.value);
        if (allowedLineWidths.includes(selectedLineWidth)) {
            lineWidth = selectedLineWidth;
        }
    }
    
});

// Runs if mouse moves
const draw = (e) => {
    if(!isPainting) {
        return;
    }

    const { x, y } = getCanvasCoordinates(e);

    if (x < 0 || y < 0 || x > canvas.width || y > canvas.height) {
        stopPainting();
        return;
    }

    ctx.lineWidth = lineWidth;
    ctx.lineCap = 'round';

    ctx.lineTo(x, y);
    ctx.stroke();
}


canvas.addEventListener('mousedown', (e) => {
    const { x, y } = getCanvasCoordinates(e);

    isPainting = true;
    ctx.beginPath();
    ctx.moveTo(x, y);
    startX = x;
    startY = y;
});

canvas.addEventListener('mouseup', e => {
    stopPainting();
});

canvas.addEventListener('mouseleave', stopPainting);

canvas.addEventListener('mousemove', draw);


// Resize Canvas according to current Window Size
window.addEventListener('resize', resizeCanvas);
