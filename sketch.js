// Game state
let cards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let startTime;
let gameTimer;
let gameStarted = false;
let canFlip = true;

// Canvas settings
const CARD_WIDTH = 80;
const CARD_HEIGHT = 100;
const CARD_SPACING = 15;
const COLS = 4;
const ROWS = 3;

// Colors (Pinterest pastel palette)
const COLORS = {
  background: '#FFF5E6',
  cardBack: '#FFE4D6',
  cardFront: '#FFFFFF',
  accent1: '#D4A5A5',
  accent2: '#9FA9A3',
  accent3: '#C8B4A8',
  text: '#5D4E37'
};

// Coffee cup types
const COFFEE_TYPES = [
  { name: 'espresso', color: '#8B4513' },
  { name: 'cappuccino', color: '#D2691E' },
  { name: 'latte', color: '#DEB887' },
  { name: 'americano', color: '#654321' },
  { name: 'macchiato', color: '#CD853F' },
  { name: 'coldbrew', color: '#A0826D' }
];

class Card {
  constructor(x, y, type) {
    this.x = x;
    this.y = y;
    this.type = type;
    this.flipped = false;
    this.matched = false;
    this.flipProgress = 0;
  }

  draw() {
    push();
    translate(this.x, this.y);

    // Flip animation
    if (this.flipped || this.matched) {
      this.flipProgress = min(1, this.flipProgress + 0.15);
    } else {
      this.flipProgress = max(0, this.flipProgress - 0.15);
    }

    const scale = abs(cos(this.flipProgress * PI / 2));
    const showFront = this.flipProgress > 0.5;

    push();
    scale(scale, 1);

    // Card shadow
    fill(0, 0, 0, 20);
    noStroke();
    rect(-CARD_WIDTH / 2 + 3, -CARD_HEIGHT / 2 + 3, CARD_WIDTH, CARD_HEIGHT, 10);

    // Card background
    if (this.matched) {
      fill(200, 255, 200);
    } else if (showFront) {
      fill(COLORS.cardFront);
    } else {
      fill(COLORS.cardBack);
    }
    stroke(COLORS.accent3);
    strokeWeight(3);
    rect(-CARD_WIDTH / 2, -CARD_HEIGHT / 2, CARD_WIDTH, CARD_HEIGHT, 10);

    if (showFront) {
      this.drawCoffee();
    } else {
      this.drawCardBack();
    }

    pop();
    pop();
  }

  drawCardBack() {
    // Coffee bean pattern
    noStroke();
    fill(COLORS.accent1);
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 4; j++) {
        const bx = -25 + i * 25;
        const by = -35 + j * 25;
        ellipse(bx, by, 8, 12);
        ellipse(bx, by, 12, 8);
      }
    }
  }

  drawCoffee() {
    const coffee = this.type;
    
    switch(coffee.name) {
      case 'espresso':
        this.drawEspresso(coffee.color);
        break;
      case 'cappuccino':
        this.drawCappuccino(coffee.color);
        break;
      case 'latte':
        this.drawLatte(coffee.color);
        break;
      case 'americano':
        this.drawAmericano(coffee.color);
        break;
      case 'macchiato':
        this.drawMacchiato(coffee.color);
        break;
      case 'coldbrew':
        this.drawColdBrew(coffee.color);
        break;
    }
  }

  drawEspresso(col) {
    // Small espresso cup
    fill(255);
    stroke(COLORS.text);
    strokeWeight(2);
    // Cup
    beginShape();
    vertex(-15, 5);
    vertex(-12, 20);
    vertex(12, 20);
    vertex(15, 5);
    endShape(CLOSE);
    // Handle
    noFill();
    arc(15, 12, 15, 15, -PI/2, PI/2);
    // Coffee
    fill(col);
    noStroke();
    ellipse(0, 5, 25, 8);
    // Saucer
    fill(255);
    stroke(COLORS.text);
    strokeWeight(2);
    ellipse(0, 22, 40, 6);
  }

  drawCappuccino(col) {
    // Cappuccino cup with foam
    fill(255);
    stroke(COLORS.text);
    strokeWeight(2);
    // Cup
    beginShape();
    vertex(-20, 0);
    vertex(-15, 20);
    vertex(15, 20);
    vertex(20, 0);
    endShape(CLOSE);
    // Handle
    noFill();
    arc(20, 10, 18, 18, -PI/2, PI/2);
    // Coffee
    fill(col);
    noStroke();
    quad(-18, 2, -14, 18, 14, 18, 18, 2);
    // Foam
    fill(255, 250, 240);
    ellipse(0, 0, 35, 12);
    // Foam art (heart)
    fill(col);
    ellipse(-3, -2, 5, 5);
    ellipse(3, -2, 5, 5);
    triangle(-3, 0, 3, 0, 0, 5);
  }

  drawLatte(col) {
    // Tall latte glass
    fill(255, 255, 255, 200);
    stroke(COLORS.text);
    strokeWeight(2);
    // Glass
    rect(-12, -15, 24, 35, 5);
    // Layers
    noStroke();
    fill(col);
    rect(-12, 10, 24, 10);
    fill(col, 150);
    rect(-12, 0, 24, 10);
    fill(240, 230, 220);
    rect(-12, -10, 24, 10);
    // Foam top
    fill(255, 250, 240);
    ellipse(0, -15, 24, 8);
  }

  drawAmericano(col) {
    // Simple coffee mug
    fill(COLORS.accent1);
    stroke(COLORS.text);
    strokeWeight(2);
    // Mug
    rect(-18, -5, 36, 25, 5);
    // Handle
    noFill();
    arc(18, 7, 20, 20, -PI/2, PI/2);
    // Coffee
    fill(col);
    noStroke();
    ellipse(0, -5, 32, 10);
    // Steam
    stroke(COLORS.text);
    strokeWeight(1.5);
    noFill();
    bezier(-8, -15, -10, -20, -6, -25, -8, -30);
    bezier(0, -15, -2, -22, 2, -28, 0, -33);
    bezier(8, -15, 10, -20, 6, -25, 8, -30);
  }

  drawMacchiato(col) {
    // Small macchiato cup
    fill(255);
    stroke(COLORS.text);
    strokeWeight(2);
    // Cup
    beginShape();
    vertex(-18, 0);
    vertex(-14, 18);
    vertex(14, 18);
    vertex(18, 0);
    endShape(CLOSE);
    // Handle
    noFill();
    arc(18, 9, 16, 16, -PI/2, PI/2);
    // Coffee
    fill(col);
    noStroke();
    quad(-16, 2, -13, 16, 13, 16, 16, 2);
    // Milk spot
    fill(255, 250, 240);
    ellipse(0, 8, 12, 12);
  }

  drawColdBrew(col) {
    // Iced coffee glass
    fill(255, 255, 255, 150);
    stroke(COLORS.text);
    strokeWeight(2);
    // Glass
    beginShape();
    vertex(-15, -20);
    vertex(-18, 20);
    vertex(18, 20);
    vertex(15, -20);
    endShape(CLOSE);
    // Coffee
    noStroke();
    fill(col, 200);
    quad(-14, -5, -17, 18, 17, 18, 14, -5);
    // Ice cubes
    fill(255, 255, 255, 180);
    stroke(200, 220, 255);
    strokeWeight(1);
    rect(-8, -10, 10, 10, 2);
    rect(2, 0, 8, 8, 2);
    rect(-5, 5, 9, 9, 2);
    // Straw
    stroke(COLORS.accent1);
    strokeWeight(3);
    line(8, -20, 5, 10);
  }

  contains(px, py) {
    return px > this.x - CARD_WIDTH / 2 &&
           px < this.x + CARD_WIDTH / 2 &&
           py > this.y - CARD_HEIGHT / 2 &&
           py < this.y + CARD_HEIGHT / 2;
  }
}

function setup() {
  const canvasWidth = COLS * (CARD_WIDTH + CARD_SPACING) - CARD_SPACING + 40;
  const canvasHeight = ROWS * (CARD_HEIGHT + CARD_SPACING) - CARD_SPACING + 40;
  const canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent('canvas-container');
  
  // Button events
  document.getElementById('restart-btn').addEventListener('click', resetGame);
  document.getElementById('play-again-btn').addEventListener('click', playAgain);
  document.getElementById('scores-btn').addEventListener('click', showHighScores);
  document.getElementById('close-scores-btn').addEventListener('click', closeScoresModal);
  
  initGame();
}

function initGame() {
  cards = [];
  
  // Create pairs
  const cardTypes = [];
  for (let coffee of COFFEE_TYPES) {
    cardTypes.push(coffee);
    cardTypes.push(coffee);
  }
  
  // Shuffle
  for (let i = cardTypes.length - 1; i > 0; i--) {
    const j = floor(random(i + 1));
    [cardTypes[i], cardTypes[j]] = [cardTypes[j], cardTypes[i]];
  }
  
  // Position cards
  let index = 0;
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = 20 + col * (CARD_WIDTH + CARD_SPACING) + CARD_WIDTH / 2;
      const y = 20 + row * (CARD_HEIGHT + CARD_SPACING) + CARD_HEIGHT / 2;
      cards.push(new Card(x, y, cardTypes[index]));
      index++;
    }
  }
}

function draw() {
  background(COLORS.background);
  
  for (let card of cards) {
    card.draw();
  }
  
  updateTimer();
}

function mousePressed() {
  handleInput(mouseX, mouseY);
}

function touchStarted() {
  if (touches.length > 0) {
    const touch = touches[0];
    const rect = canvas.elt.getBoundingClientRect();
    const x = touch.x - rect.left;
    const y = touch.y - rect.top;
    handleInput(x, y);
    return false;
  }
}

function handleInput(x, y) {
  if (!canFlip) return;
  
  // Start game on first click
  if (!gameStarted) {
    gameStarted = true;
    startTime = millis();
  }
  
  for (let card of cards) {
    if (card.contains(x, y) && !card.flipped && !card.matched) {
      card.flipped = true;
      flippedCards.push(card);
      
      if (flippedCards.length === 2) {
        moves++;
        updateStats();
        canFlip = false;
        
        setTimeout(() => {
          checkMatch();
        }, 600);
      }
      
      break;
    }
  }
}

function checkMatch() {
  const [card1, card2] = flippedCards;
  
  if (card1.type.name === card2.type.name) {
    card1.matched = true;
    card2.matched = true;
    matchedPairs++;
    
    if (matchedPairs === COFFEE_TYPES.length) {
      setTimeout(() => {
        gameWon();
      }, 500);
    }
  } else {
    card1.flipped = false;
    card2.flipped = false;
  }
  
  flippedCards = [];
  canFlip = true;
}

function updateStats() {
  document.getElementById('moves').textContent = moves;
}

function updateTimer() {
  if (gameStarted && matchedPairs < COFFEE_TYPES.length) {
    const elapsed = floor((millis() - startTime) / 1000);
    const minutes = floor(elapsed / 60);
    const seconds = elapsed % 60;
    document.getElementById('time').textContent = 
      `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
}

function gameWon() {
  gameStarted = false;
  const finalTime = floor((millis() - startTime) / 1000);
  
  document.getElementById('final-moves').textContent = moves;
  const minutes = floor(finalTime / 60);
  const seconds = finalTime % 60;
  document.getElementById('final-time').textContent = 
    `${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  const score = {
    moves: moves,
    time: finalTime,
    date: new Date().toLocaleDateString('nl-NL')
  };
  
  const isHighScore = saveHighScore(score);
  
  if (isHighScore) {
    document.getElementById('high-score-message').textContent = '🌟 Nieuwe High Score! 🌟';
  } else {
    document.getElementById('high-score-message').textContent = '';
  }
  
  document.getElementById('win-modal').classList.remove('hidden');
}

function saveHighScore(score) {
  let scores = JSON.parse(localStorage.getItem('coffeeMemoryScores') || '[]');
  scores.push(score);
  
  // Sort by moves (ascending), then by time (ascending)
  scores.sort((a, b) => {
    if (a.moves !== b.moves) return a.moves - b.moves;
    return a.time - b.time;
  });
  
  const isTop5 = scores.indexOf(score) < 5;
  
  // Keep only top 10
  scores = scores.slice(0, 10);
  localStorage.setItem('coffeeMemoryScores', JSON.stringify(scores));
  
  return isTop5;
}

function showHighScores() {
  const scores = JSON.parse(localStorage.getItem('coffeeMemoryScores') || '[]');
  const scoresList = document.getElementById('scores-list');
  
  if (scores.length === 0) {
    scoresList.innerHTML = '<p style="text-align:center; color:#9FA9A3;">Nog geen scores</p>';
  } else {
    let html = '';
    scores.slice(0, 5).forEach((score, index) => {
      const minutes = floor(score.time / 60);
      const seconds = score.time % 60;
      const timeStr = `${minutes}:${seconds.toString().padStart(2, '0')}`;
      
      html += `
        <div class="score-item">
          <div>
            <span class="score-rank">#${index + 1}</span>
            ${score.moves} zetten • ${timeStr}
          </div>
          <div style="font-size:0.85em; color:#9FA9A3;">${score.date}</div>
        </div>
      `;
    });
    scoresList.innerHTML = html;
  }
  
  document.getElementById('scores-modal').classList.remove('hidden');
}

function closeScoresModal() {
  document.getElementById('scores-modal').classList.add('hidden');
}

function playAgain() {
  document.getElementById('win-modal').classList.add('hidden');
  resetGame();
}

function resetGame() {
  flippedCards = [];
  matchedPairs = 0;
  moves = 0;
  gameStarted = false;
  canFlip = true;
  
  updateStats();
  document.getElementById('time').textContent = '0:00';
  
  initGame();
}
