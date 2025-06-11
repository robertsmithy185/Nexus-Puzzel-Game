const imageSrc = 'assets/cube.png';
const size = 3;
const container = document.getElementById("game-container");
const winScreen = document.getElementById("win-screen");

const tiles = [];
const positions = [];
let emptyIndex;

function createTiles() {
  for (let i = 0; i < size * size - 1; i++) {
    const tile = document.createElement("div");
    tile.className = "tile";
    tile.style.backgroundImage = `url(${imageSrc})`;

    const x = (i % size) * -100;
    const y = Math.floor(i / size) * -100;
    tile.style.backgroundPosition = `${x}px ${y}px`;

    tiles.push(tile);
  }

  const emptyTile = document.createElement("div");
  emptyTile.className = "tile empty";
  tiles.push(emptyTile);
}

function shufflePositions() {
  positions.length = 0;
  for (let i = 0; i < tiles.length; i++) {
    positions.push(i);
  }

  do {
    for (let i = positions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [positions[i], positions[j]] = [positions[j], positions[i]];
    }
  } while (!isSolvable(positions));

  emptyIndex = positions.indexOf(tiles.length - 1);
}

function isSolvable(arr) {
  let inversions = 0;
  for (let i = 0; i < arr.length - 1; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] !== arr.length - 1 && arr[j] !== arr.length - 1 && arr[i] > arr[j]) {
        inversions++;
      }
    }
  }
  return inversions % 2 === 0;
}

function renderTiles() {
  container.innerHTML = "";

  for (let i = 0; i < positions.length; i++) {
    const tileIndex = positions[i];
    const tile = tiles[tileIndex];

    tile.onclick = () => moveTile(i);
    container.appendChild(tile);
  }
}

function moveTile(index) {
  const row = Math.floor(index / size);
  const col = index % size;
  const emptyRow = Math.floor(emptyIndex / size);
  const emptyCol = emptyIndex % size;

  const isAdjacent =
    (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
    (col === emptyCol && Math.abs(row - emptyRow) === 1);

  if (!isAdjacent) return;

  [positions[index], positions[emptyIndex]] = [positions[emptyIndex], positions[index]];
  emptyIndex = index;

  renderTiles();
  checkWin();
}

function checkWin() {
  for (let i = 0; i < positions.length; i++) {
    if (positions[i] !== i) return;
  }

  setTimeout(() => {
    container.style.display = "none";
    winScreen.style.display = "block";
  }, 300);
}

createTiles();
shufflePositions();
renderTiles();
