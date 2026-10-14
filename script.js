const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons .btn');

let expression = '';

if (buttons.length) {
  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const action = button.dataset.action;
      const value = button.dataset.value;

      if (action === 'clear') {
        expression = '';
      } else if (action === 'back') {
        expression = expression.slice(0, -1);
      } else if (action === 'equals') {
        expression = calculate(expression);
      } else if (value !== undefined) {
        expression += value;
      }

      display.value = expression;
    });
  });
}

function calculate(expr) {
  // Only allow safe characters: digits, operators, decimal points
  if (!/^[0-9+\-*/.]+$/.test(expr)) {
    return 'Error';
  }

  try {
    // eslint-disable-next-line no-eval
    const result = Function('"use strict"; return (' + expr + ')')();

    if (!isFinite(result)) {
      return 'Error';
    }

    // Round to avoid floating point noise, then trim trailing zeros
    return parseFloat(result.toFixed(10)).toString();
  } catch (e) {
    return 'Error';
  }
}

// Allow keyboard input too
document.addEventListener('keydown', (e) => {
  if (!display) {
    return;
  }

  const allowed = '0123456789+-*/.';
  if (allowed.includes(e.key)) {
    expression += e.key;
    display.value = expression;
  } else if (e.key === 'Enter') {
    expression = calculate(expression);
    display.value = expression;
  } else if (e.key === 'Backspace') {
    expression = expression.slice(0, -1);
    display.value = expression;
  } else if (e.key === 'Escape') {
    expression = '';
    display.value = expression;
  }
});

const gameBoard = document.getElementById('tic-tac-toe-board');
if (gameBoard) {
  const cells = Array.from(gameBoard.querySelectorAll('.cell'));
  const statusText = document.getElementById('game-status');
  const resetButton = document.getElementById('reset-game');
  let board = Array(9).fill('');
  let currentPlayer = 'X';
  let gameOver = false;

  const winningPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  function updateStatus(message) {
    if (statusText) {
      statusText.textContent = message;
    }
  }

  function checkWinner() {
    for (const pattern of winningPatterns) {
      const [a, b, c] = pattern;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    return null;
  }

  function handleCellClick(event) {
    const cell = event.currentTarget;
    const index = Number(cell.dataset.index);

    if (board[index] || gameOver) {
      return;
    }

    board[index] = currentPlayer;
    cell.textContent = currentPlayer;
    cell.classList.add('filled');

    const winner = checkWinner();
    if (winner) {
      gameOver = true;
      updateStatus(`Player ${winner} wins!`);
      return;
    }

    if (board.every(value => value !== '')) {
      gameOver = true;
      updateStatus('It\'s a draw!');
      return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus(`Player ${currentPlayer}'s turn`);
  }

  function resetGame() {
    board = Array(9).fill('');
    currentPlayer = 'X';
    gameOver = false;
    cells.forEach(cell => {
      cell.textContent = '';
      cell.classList.remove('filled');
    });
    updateStatus("Player X's turn");
  }

  cells.forEach(cell => cell.addEventListener('click', handleCellClick));
  if (resetButton) {
    resetButton.addEventListener('click', resetGame);
  }
}