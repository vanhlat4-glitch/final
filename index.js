let tiles = Array.from(document.querySelectorAll('.grid > div'));
let timeDisplay = document.querySelector('.time2');
let btnStart = document.querySelector('.btn-start');
let btnEnd = document.querySelector('.btn-end');
let modal = document.getElementById('winModal');
let replayBtn = document.getElementById('replayBtn');
let historyList = document.getElementById('historyList');

let gameStarted = false;
let timer = null;
let seconds = 0;
let moves = 0;
let gameHistory = [];
let isShuffling = false;

function getEmptyIndex() {
    return tiles.findIndex(tile => tile.classList.contains('tile-empty'));
}

function canMove(index, emptyIndex) {
    const row = Math.floor(index / 4);
    const col = index % 4;
    const emptyRow = Math.floor(emptyIndex / 4);
    const emptyCol = emptyIndex % 4;

    return (
        (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
        (col === emptyCol && Math.abs(row - emptyRow) === 1)
    );
}

function moveTile(index) {
    if (!gameStarted && !isShuffling) return;
    const emptyIndex = getEmptyIndex();
    if (canMove(index, emptyIndex)) {
        const tempHTML = tiles[index].innerHTML;
        const tempClass = tiles[index].className;
        tiles[index].innerHTML = tiles[emptyIndex].innerHTML;
        tiles[index].className = tiles[emptyIndex].className;
        tiles[emptyIndex].innerHTML = tempHTML;
        tiles[emptyIndex].className = tempClass;
        tiles = Array.from(document.querySelectorAll('.grid > div'));
    if (!isShuffling) {
        moves++;
        checkWin();
        }
    }
}
function checkWin() {
    const correctOrder = ['1','2','3','4','5','6','7','8','9','10','11',''];
    const currentOrder = tiles.map(tile => tile.textContent);
    if (JSON.stringify(correctOrder) === JSON.stringify(currentOrder)) {
        endGame(true);
    }
}
function startGame() {
    gameStarted = true;
    moves = 0;
    seconds = 0;
    clearInterval(timer);
    timer = null;
    btnStart.style.display = 'none';
    btnEnd.style.display = 'block';
    shuffleTiles();
    timer = setInterval(() => {
        seconds++;
        updateTimeDisplay();
    }, 1000);
}
function shuffleTiles() {
    isShuffling = true;
    for (let i = 0; i < 150; i++) {
        const emptyIndex = getEmptyIndex();
        const validMoves = [];
        tiles.forEach((tile, idx) => {
        if (canMove(idx, emptyIndex)) validMoves.push(idx);
        });
        const randomIdx = validMoves[Math.floor(Math.random() * validMoves.length)];
        moveTile(randomIdx);
    }
    moves = 0;
    isShuffling = false;
}
function endGame(won = false) {
    gameStarted = false;
    clearInterval(timer);
    timer = null;
    if (won) {
        gameHistory.push({ moves: moves, time: formatTime(seconds) });
        updateHistory();
        document.getElementById('finalTime').textContent = formatTime(seconds);
        document.getElementById('finalMoves').textContent = moves;
        modal.classList.add('show');
    } else {
        resetGame();
    }
    btnStart.style.display = 'block';
    btnEnd.style.display = 'none';
}
function resetGame() {
    clearInterval(timer);
    timer = null;
    seconds = 0;
    moves = 0;
    updateTimeDisplay();
    const initial = [
        {class:'tile-1', text:'1'},
        {class:'tile-2', text:'2'},
        {class:'tile-3', text:'3'},
        {class:'tile-4', text:'4'},
        {class:'tile-5', text:'5'},
        {class:'tile-6', text:'6'},
        {class:'tile-7', text:'7'},
        {class:'tile-8', text:'8'},
        {class:'tile-9', text:'9'},
        {class:'tile-10', text:'10'},
        {class:'tile-11', text:'11'},
        {class:'tile-empty', text:''}
    ];
    tiles.forEach((tile, i) => {
        tile.className = initial[i].class;
        tile.textContent = initial[i].text;
    });
    tiles = Array.from(document.querySelectorAll('.grid > div'));
}
function updateTimeDisplay() {
    timeDisplay.textContent = formatTime(seconds);
}
function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
}
function updateHistory() {
    historyList.innerHTML = '';
    gameHistory.forEach((g, i) => {
        const row = document.createElement('div');
        row.className = 'history-row';
        row.innerHTML = `
            <div>Lần chơi ${i+1}</div>
            <div>${g.moves} bước</div>
            <div>${g.time}</div>
        `;
            historyList.appendChild(row);
        });
}
tiles.forEach((tile, i) =>
    tile.addEventListener('click', () => moveTile(i))
);
document.addEventListener('keydown', e => {
    if (!gameStarted) return;
    const empty = getEmptyIndex();
    const r = Math.floor(empty / 4);
    const c = empty % 4;
    let target = -1;
    switch(e.key.toLowerCase()) {
    case 'arrowup':
    case 'w':
        if (r > 0) target = empty - 4;
        break;
    case 'arrowdown':
    case 's':
        if (r < 3) target = empty + 4;
        break;
    case 'arrowleft':
    case 'a':
        if (c > 0) target = empty - 1;
        break;
    case 'arrowright':
    case 'd':
        if (c < 3) target = empty + 1;
        break;
  }
    if (target !== -1) moveTile(target);
});
btnStart.addEventListener('click', startGame);
btnEnd.addEventListener('click', () => endGame(false));
replayBtn.addEventListener('click', () => {
    modal.classList.remove('show');
    resetGame();
    startGame();
});
