<?php
// Server-side calculation logic (handles the "Server Calculate" form below)
$serverResult = null;
$serverError  = null;

if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['calculate'])) {
    $num1 = isset($_POST['num1']) ? trim($_POST['num1']) : '';
    $num2 = isset($_POST['num2']) ? trim($_POST['num2']) : '';
    $op   = isset($_POST['operator']) ? $_POST['operator'] : '';

    if (!is_numeric($num1) || !is_numeric($num2)) {
        $serverError = "Please enter valid numbers.";
    } else {
        $num1 = floatval($num1);
        $num2 = floatval($num2);

        switch ($op) {
            case '+':
                $serverResult = $num1 + $num2;
                break;
            case '-':
                $serverResult = $num1 - $num2;
                break;
            case '*':
                $serverResult = $num1 * $num2;
                break;
            case '/':
                if ($num2 == 0) {
                    $serverError = "Cannot divide by zero.";
                } else {
                    $serverResult = $num1 / $num2;
                }
                break;
            default:
                $serverError = "Invalid operator.";
        }
    }
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Simple Calculator (HTML/CSS/JS/PHP)</title>
<link rel="stylesheet" href="style.css">
</head>
<body>

  <div class="page">

    <!-- ===================== JS LIVE CALCULATOR ===================== -->
    <div class="card">
      <h1>Calculator</h1>
      <p class="subtitle">Instant calculation with JavaScript</p>

      <div class="calculator">
        <input type="text" id="display" disabled>

        <div class="buttons">
          <button class="btn clear" data-action="clear">C</button>
          <button class="btn" data-action="back">⌫</button>
          <button class="btn op" data-value="/">÷</button>
          <button class="btn op" data-value="*">×</button>

          <button class="btn" data-value="7">7</button>
          <button class="btn" data-value="8">8</button>
          <button class="btn" data-value="9">9</button>
          <button class="btn op" data-value="-">−</button>

          <button class="btn" data-value="4">4</button>
          <button class="btn" data-value="5">5</button>
          <button class="btn" data-value="6">6</button>
          <button class="btn op" data-value="+">+</button>

          <button class="btn" data-value="1">1</button>
          <button class="btn" data-value="2">2</button>
          <button class="btn" data-value="3">3</button>
          <button class="btn equals" data-action="equals" rowspan="2">=</button>

          <button class="btn zero" data-value="0">0</button>
          <button class="btn" data-value=".">.</button>
        </div>
      </div>
    </div>

    <!-- ===================== PHP SERVER CALCULATOR ===================== -->
    <div class="card">
      <h1>Server Calculate</h1>
      <p class="subtitle">Calculation processed by PHP on the server</p>

      <form method="POST" action="index.php" class="server-form">
        <input type="text" name="num1" placeholder="First number"
               value="<?php echo isset($_POST['num1']) ? htmlspecialchars($_POST['num1']) : ''; ?>" required>

        <select name="operator">
          <?php
            $ops = ['+' => '+', '-' => '−', '*' => '×', '/' => '÷'];
            $selectedOp = $_POST['operator'] ?? '+';
            foreach ($ops as $val => $label) {
                $sel = ($selectedOp === $val) ? 'selected' : '';
                echo "<option value=\"$val\" $sel>$label</option>";
            }
          ?>
        </select>

        <input type="text" name="num2" placeholder="Second number"
               value="<?php echo isset($_POST['num2']) ? htmlspecialchars($_POST['num2']) : ''; ?>" required>

        <button type="submit" name="calculate" class="btn-submit">Calculate</button>
      </form>

      <?php if ($serverError): ?>
        <p class="result error">⚠ <?php echo htmlspecialchars($serverError); ?></p>
      <?php elseif ($serverResult !== null): ?>
        <p class="result success">Result: <?php echo htmlspecialchars($serverResult); ?></p>
      <?php endif; ?>
    </div>

  </div>

<script src="script.js"></script>
</body>
</html>