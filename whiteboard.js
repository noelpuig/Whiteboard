
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const container = document.getElementById("main-container");
var current_stroke = null;
var current_color = "#222";
var drawing = [];

const spacing = 0.2;
class Stroke {
    constructor (startX, startY, size, color) {
        this.points = [];
        this.points.push([startX, startY, size]);
        this.color = color;
        this.size = size;
    }
    
    addPoint (x, y, size) {
        let lastPoint = this.points[this.points.length - 1];
        if (x - lastPoint[0] > spacing || y - lastPoint[1] > spacing) {
            ctx.beginPath();
            ctx.strokeStyle = this.color;
            ctx.lineCap = 'round';
            ctx.lineWidth = (10 * size).toFixed(2);
            ctx.moveTo(lastPoint[0], lastPoint[1]);
            ctx.lineTo(x, y);
            ctx.stroke();
            this.points.push([x, y, size]);
        }
    }
}

function getMousePos (e) {
    x = e.x;
    y = e.y;
    return [Math.round(x * 1000) / 1000, Math.round(y * 1000) / 1000];
}

let lastTimestamp = 0;
const fps = 1000/60;
document.addEventListener("pointermove", moveMouse, false);
function moveMouse (e) {
    e.preventDefault();
    const now = performance.now();
    if (now - lastTimestamp >= fps) {
        lastTimestamp = now;
        if (current_stroke != null) {
            let [touchX, touchY] = getMousePos(e);
            current_stroke.addPoint(touchX, touchY, e.pressure);
            if (e.pressure == 0) mouseUp();
        }
    }
}

document.addEventListener("pointerdown", (e) => {
    if (current_stroke == null) mouseDown(e);
}, false);
function mouseDown (e) {
    e.preventDefault();
    let [touchX, touchY] = getMousePos(e);
    console.log("NewStroke");
    let stroke = new Stroke(touchX, touchY, e.pressure, current_color);
    drawing.push(stroke);
    current_stroke = stroke;
}

document.addEventListener("pointerup", mouseUp, false);
document.addEventListener("pointerleave", mouseUp, false);
function mouseUp (e) {
    current_stroke = null;
}

function changeColor(col) {
    switch (col) {
        case 'black':
            current_color = "#222";
            break;
        case 'red':
            current_color = "#fc0000";
            break;
        case 'green':
            current_color = "#3f8218";
            break;
        case 'blue':
            current_color = "#00acfc";
            break;
    }
}

function reDrawBoard () {
    drawing.forEach(stroke => {
        ctx.beginPath();
        ctx.strokeStyle = stroke.color;
        ctx.lineCap = 'round';
        ctx.lineWidth = (10 * stroke.points[0][2]).toFixed(2);
        ctx.moveTo(stroke.points[0][0], stroke.points[0][1]);
        for (let i = 1; i < stroke.points.length; i++) {
            ctx.lineWidth = (10 * stroke.points[i][2]).toFixed(2);
            ctx.lineTo(stroke.points[i][0], stroke.points[i][1]);
        }
        ctx.stroke();
    });
}

function resize () {
    let w = container.offsetWidth;
    let h = container.offsetHeight;
    canvas.width = w;
    canvas.height = h;
    reDrawBoard ();
}
window.addEventListener("resize", resize, false);
window.addEventListener("load", resize, false);

