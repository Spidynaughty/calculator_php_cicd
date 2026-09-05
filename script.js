const display = document.getElementById('display');
const buttons = document.querySelectorAll('.buttons .btn');

let expression = '';

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