// Countdown timer function
function startTimer(duration, display) {
    let timer = duration;
    let intervalId = setInterval(function () {
      display.textContent = timer + "s";
      if (--timer < 0) {
        clearInterval(intervalId);
        document.getElementById("resend-btn").disabled = false;
      }
    }, 1000);
  }
  
  // Focus on the next input field on keyup
  function focusNextInput(nextInput) {
    const currentInput = document.getElementById("digit" + nextInput);
    if (currentInput) {
      currentInput.focus();
    }
  }
  
  // Call the timer function on page load
  document.addEventListener("DOMContentLoaded", function () {
    const countdownDisplay = document.getElementById("countdown");
    startTimer(60, countdownDisplay);
  
    // Resend OTP button click event
    document.getElementById("resend-btn").addEventListener("click", function () {
      document.getElementById("resend-btn").disabled = true;
      startTimer(60, countdownDisplay);
    });
  });
  