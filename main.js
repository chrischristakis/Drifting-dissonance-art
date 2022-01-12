const canvas = document.getElementById("c");
let cw = canvas.width = window.innerWidth;
let ch = canvas.height = window.innerHeight;
const ctx = canvas.getContext("2d");

const scale = cw/1645; // Use this for different resolutions
const amp = 215;
const smooth = 450; // Used to alter frequency of sine
const width = 1000 // Width of the sin, not the canvas
let t = 0;
let noOfSegs = 85;

function rint(min, max) { return Math.random() * (max - min) + min; }

// Generate random params for our sine wave summation
let rp = []
let rs = []
for(let j = 0; j < 4; j++) {
    rp.push(rint(1.3,3.76));
    rs.push(rint(smooth-75, smooth+75))
}

// Sum a bunch of sine waves to create a 'random' effect
function sinFunc(x) {
    let sum = 0;
    for(let i = 0; i < rp.length; i++)
        sum += (amp/rp.length)*Math.sin( (rp[i]*x)/rs[i] );
    return sum;
}

function drawSin(offsetX, offsetY, alpha) {
    const startX = cw/2 - width/2 + offsetX;
    ctx.beginPath();

    ctx.moveTo(startX, ch/2 - sinFunc(t) + offsetY);
    for(let x = 0; x < width; x++) {
        ctx.lineTo(cw/2 - width/2 + offsetX + x, ch/2 - sinFunc(x+t) + offsetY);
    }

    ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
    ctx.stroke();
}

function drawPath(shiftY, alpha) {
    let osX = 95, osY = 10;
    drawSin(-osX, osY+shiftY, alpha);
    drawSin(osX, -osY+shiftY, alpha);

    for(let i = 0; i <= noOfSegs; i++) {
        ctx.beginPath();
        let x1 = cw/2 - width/2 - osX + (width/noOfSegs * i);
        let y1 = ch/2 - sinFunc((width/noOfSegs * i)+t) + osY+shiftY;
        let x2 = cw/2 - width/2 + osX + (width/noOfSegs * i);
        let y2 = ch/2 - sinFunc((width/noOfSegs * i)+t) - osY+shiftY;

        ctx.moveTo(x1, y1); // 'forward' sine
        ctx.lineTo((x1+x2)/2, (y1+y2)/2 - 55)
        ctx.lineTo(x2, y2); // 'behind' sine

        ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
        ctx.stroke();
    }
}

function draw() {
    requestAnimationFrame(draw);

    ctx.fillStyle = "rgba(21,39,46,0.88)";
    ctx.fillRect(0, 0, cw, ch);

    // This is how I'm dealing with different sized devices. Just scale the entire scene.
    ctx.save();
    ctx.translate(cw/2, ch/2);
    ctx.scale(scale,scale);
    ctx.translate(-cw/2, -ch/2);

    const noOfShadows = 4
    for(let i = 0; i < noOfShadows; i++) {   
        drawPath(28*i, (noOfShadows-i)/noOfShadows);
    }
    
    // Reset our transform to the identity matrix after our scale
    ctx.restore();
    t++;
}

draw();