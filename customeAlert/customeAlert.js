// Inject container vào body nếu chưa có
if (!document.getElementById("customAlert")) {
    const div = document.createElement("div");
    div.id = "customAlert";
    div.className = "custom-alert";
    div.innerHTML = `
      <div class="custom-alert-content">
        <span id="customAlertMessage"></span>
        <button class="close-btn" onclick="closeCustomAlert()">×</button>
      </div>
    `;
    document.body.appendChild(div);
  }
  
  // Hiển thị alert
  function showCustomAlert(message, type = "default", timeout = 3000) {
    const alertBox = document.getElementById("customAlert");
    const messageEl = document.getElementById("customAlertMessage");
  
    // Reset class
    alertBox.className = "custom-alert " + type;
  
    // Set message
    messageEl.textContent = message;
    alertBox.style.display = "block";
  
    // Auto close
    if (timeout > 0) {
      setTimeout(() => {
        closeCustomAlert();
      }, timeout);
    }
  }
  
  // Đóng alert
  function closeCustomAlert() {
    const alertBox = document.getElementById("customAlert");
    if (alertBox) {
      alertBox.style.display = "none";
    }
  }
  