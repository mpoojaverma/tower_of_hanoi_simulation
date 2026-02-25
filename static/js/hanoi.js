const NUM_PEGS = 3;
const PEG_NAMES = ['Source', 'Middle', 'Destination'];
const CANVAS_WIDTH = 650;
const CANVAS_HEIGHT = 450;
const DISK_HEIGHT = 20;
const PEG_X_POS = [120, 325, 530];
const PEG_Y_BASE = CANVAS_HEIGHT - 40;

let moves = [];
let moveIndex = 0;
let disksOnPegs = [[], [], []];
let diskColors = ["#4D70B3", "#8A9A5B", "#FF6F61", "#B565A7", "#48AAAD", "#F7CAC9", "#9B772A", "#6B5B95"];

const canvas = document.getElementById('hanoi-canvas');
const diskInput = document.getElementById('disk-input');
const speedInput = document.getElementById('speed-input');
const speedValue = document.getElementById('speed-value');
const statusMessage = document.getElementById('status-message');
const nextBtn = document.getElementById('next-btn');
const autoBtn = document.getElementById('auto-btn');
const solveBtn = document.getElementById('solve-btn');

const explanationContent = document.getElementById('explanation-content');
const currentMoveNum = document.getElementById('current-move-num');
const totalMovesNum = document.getElementById('total-moves-num');

let autoRunTimer = null;

function getDiskColor(diskId) {
    return diskColors[(diskId - 1) % diskColors.length];
}

function getDiskWidth(diskId) {
    return 50 + diskId * 18;
}

function drawInitialState() {
    canvas.innerHTML = '';
    disksOnPegs = [[], [], []];

    canvas.innerHTML += `<rect x="50" y="${PEG_Y_BASE}" width="${CANVAS_WIDTH - 100}" height="10" fill="#8D6E63"/>`;

    PEG_X_POS.forEach((x, i) => {
        canvas.innerHTML += `<rect x="${x - 5}" y="${PEG_Y_BASE - 250}" width="10" height="250" fill="#3E2723"/>`;
        canvas.innerHTML += `<text x="${x}" y="${PEG_Y_BASE + 20}" font-weight="bold" font-size="12" fill="#3E2723" text-anchor="middle">${PEG_NAMES[i].toUpperCase()}</text>`;
    });

    try {
        const nDisks = parseInt(diskInput.value, 10);
        if (isNaN(nDisks) || nDisks < 3 || nDisks > 8) {
            throw new Error('Invalid disk count');
        }

        for (let i = nDisks; i >= 1; i--) {
            const diskWidth = getDiskWidth(i);
            const pegIndex = 0;

            const yBottom = PEG_Y_BASE - (disksOnPegs[pegIndex].length * DISK_HEIGHT);
            const yTop = yBottom - DISK_HEIGHT;
            const xCenter = PEG_X_POS[pegIndex];

            canvas.innerHTML += `<rect id="disk-${i}" x="${xCenter - diskWidth / 2}" y="${yTop}" width="${diskWidth}" height="${DISK_HEIGHT}" fill="${getDiskColor(i)}" stroke="white" stroke-width="1"/>`;

            disksOnPegs[pegIndex].push(i);
        }

        statusMessage.textContent = `Ready for N=${nDisks} Disks`;
        statusMessage.style.color = '#007bff';
    } catch (e) {
        statusMessage.textContent = e.message;
        statusMessage.style.color = 'red';
    }
}

speedInput.addEventListener('input', () => {
    speedValue.textContent = `${speedInput.value}ms`;
});

async function generateAndStart() {
    if (autoRunTimer) {
        toggleAutoRun();
    }

    if (solveBtn.textContent === 'Reset') {
        drawInitialState();
        solveBtn.textContent = 'Generate & Start';
        nextBtn.disabled = true;
        autoBtn.disabled = true;
        explanationContent.innerHTML = '<p>Click "Generate & Start" to begin the solution.</p><p>Instructions for each disk move will appear here.</p>';
        currentMoveNum.textContent = '0';
        totalMovesNum.textContent = '0';
        return;
    }

    try {
        const nDisks = parseInt(diskInput.value, 10);
        if (isNaN(nDisks) || nDisks < 3 || nDisks > 8) {
            throw new Error('Disks must be between 3 and 8');
        }

        drawInitialState();
        moves = [];
        moveIndex = 0;
        explanationContent.innerHTML = '';

        const response = await fetch('/solve', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ disks: nDisks })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch moves from backend.');
        }

        const data = await response.json();
        moves = data.moves;

        totalMovesNum.textContent = String(moves.length);
        currentMoveNum.textContent = '0';

        statusMessage.textContent = `Total Moves: ${moves.length}`;
        statusMessage.style.color = '#333';

        nextBtn.disabled = false;
        autoBtn.disabled = false;
        solveBtn.textContent = 'Reset';
    } catch (error) {
        statusMessage.textContent = `Error: ${error.message}`;
        statusMessage.style.color = 'red';
    }
}

function toggleAutoRun() {
    if (autoRunTimer) {
        clearInterval(autoRunTimer);
        autoRunTimer = null;
        autoBtn.textContent = 'Auto Run';
        nextBtn.disabled = false;
    } else {
        autoBtn.textContent = 'Stop';
        nextBtn.disabled = true;
        autoRunTimer = setInterval(nextMove, parseInt(speedInput.value, 10));
    }
}

function nextMove() {
    if (moveIndex >= moves.length) {
        clearInterval(autoRunTimer);
        autoRunTimer = null;
        statusMessage.textContent = 'Puzzle Solved! All disks moved to Destination.';
        statusMessage.style.color = 'green';
        nextBtn.disabled = true;
        autoBtn.disabled = true;
        autoBtn.textContent = 'Auto Run';
        explanationContent.innerHTML += `<div class="step-item active"><strong>COMPLETE!</strong> All ${diskInput.value} disks are now on Destination.</div>`;
        return;
    }

    const [diskId, sourceIdx, destIdx] = moves[moveIndex];
    moveIndex++;

    if (disksOnPegs[sourceIdx]) {
        disksOnPegs[sourceIdx].pop();
        disksOnPegs[destIdx].push(diskId);
    }

    const newYBottom = PEG_Y_BASE - (disksOnPegs[destIdx].length * DISK_HEIGHT);
    const finalYTop = newYBottom - DISK_HEIGHT;
    const finalXCenter = PEG_X_POS[destIdx];

    const sourceName = PEG_NAMES[sourceIdx];
    const destName = PEG_NAMES[destIdx];
    const explanation = generateExplanation(diskId, sourceName, destName, diskInput.value);

    const stepDiv = document.createElement('div');
    stepDiv.className = 'step-item active';
    stepDiv.id = `step-${moveIndex}`;
    stepDiv.innerHTML = `<strong>Step ${moveIndex}:</strong> ${explanation}`;

    const previousActive = document.querySelector('.step-item.active');
    if (previousActive) {
        previousActive.classList.remove('active');
    }

    explanationContent.appendChild(stepDiv);
    stepDiv.scrollIntoView({ behavior: 'smooth', block: 'end' });

    statusMessage.textContent = `Move ${moveIndex}/${moves.length}: Moving Disk ${diskId} from ${sourceName} to ${destName}`;
    statusMessage.style.color = '#6A5ACD';
    currentMoveNum.textContent = String(moveIndex);

    animateDisk(diskId, finalXCenter, finalYTop);
}

function animateDisk(diskId, targetXCenter, targetYTop) {
    const diskElement = document.getElementById(`disk-${diskId}`);
    const diskWidth = getDiskWidth(diskId);
    const targetX = targetXCenter - diskWidth / 2;

    diskElement.setAttribute('x', targetX);
    diskElement.setAttribute('y', targetYTop);
}

function generateExplanation(diskId, sourceName, destName, totalDisks) {
    let explanation = `Relocate <strong>Disk ${diskId}</strong> from <strong>${sourceName}</strong> to <strong>${destName}</strong>.`;

    if (diskId == totalDisks) {
        explanation += ' This is the <strong>Largest Disk</strong> (Base Disk). It moves only when the entire stack above it is cleared.';
    } else if (diskId == 1) {
        explanation += ' This is the <strong>Smallest Disk</strong> (Disk 1). It is used frequently to temporarily stage the larger stack.';
    }

    if (destName === 'Destination') {
        explanation += ' This move advances the disk to the <strong>FINAL DESTINATION</strong> pole.';
    } else if (destName === 'Middle') {
        explanation += ' This move uses the <strong>MIDDLE</strong> pole to facilitate a larger move later.';
    } else if (destName === 'Source') {
        explanation += ' This move stages the disk back onto the <strong>SOURCE</strong> pole temporarily.';
    }

    return explanation;
}

window.onload = drawInitialState;