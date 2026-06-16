const STORAGE_KEYS = {
  USER: "workcare_user",
  THEME: "workcare_theme",
  WATER: "workcare_water",
  PROFILE: "workcare_profile",
  TIMER: "workcare_timer",
};

const pageLinks = {
  "Trang chủ": "home.html",
  "Thống kê": "statistics.html",
  "Thành tích": "achievement.html",
  "Cá nhân": "profile.html",
  "AI Coach": "ai-chat.html",
};

const defaultTimer = {
  elapsed: 59 * 60,
  running: false,
  lastTick: null,
};

function readStorage(key, fallback = null) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getUserProfile() {
  const savedProfile = readStorage(STORAGE_KEYS.PROFILE, null);
  const savedUser = readStorage(STORAGE_KEYS.USER, null);
  return {
    name: savedProfile?.name || savedUser?.name || "Người dùng",
    email: savedProfile?.email || savedUser?.email || "user@example.com",
    job: savedProfile?.job || savedUser?.job || "Thành viên",
  };
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function setTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("dark");
  } else {
    document.body.classList.remove("dark");
  }

  const toggle = document.getElementById("darkModeToggle");
  if (toggle) {
    toggle.classList.toggle("on", theme === "dark");
    toggle.classList.toggle("off", theme !== "dark");
  }
}

function loadTheme() {
  const stored = localStorage.getItem(STORAGE_KEYS.THEME) || "light";
  setTheme(stored);
}

function toggleTheme() {
  const activeTheme = document.body.classList.contains("dark")
    ? "dark"
    : "light";
  const nextTheme = activeTheme === "dark" ? "light" : "dark";
  localStorage.setItem(STORAGE_KEYS.THEME, nextTheme);
  setTheme(nextTheme);
}

function bindNavigation() {
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.addEventListener("click", () => {
      const name = item.querySelector("span")?.textContent.trim();
      const target = pageLinks[name];
      if (target) {
        window.location.href = target;
      }
    });
  });
}

/* ========== ÂM THANH THÔNG BÁO ========== */
function playNotificationSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Tạo âm thanh notification đơn giản
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime); // A5
    oscillator.frequency.setValueAtTime(660, audioCtx.currentTime + 0.2); // E5
    oscillator.frequency.setValueAtTime(880, audioCtx.currentTime + 0.4); // A5

    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      audioCtx.currentTime + 0.6,
    );

    oscillator.start(audioCtx.currentTime);
    oscillator.stop(audioCtx.currentTime + 0.6);
  } catch (e) {
    console.log("Audio not supported:", e);
  }
}

function playBreakSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Âm thanh báo hiệu giờ nghỉ - chuông dài hơn
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "triangle";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.15);
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime + i * 0.15);
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        audioCtx.currentTime + i * 0.15 + 0.4,
      );
      osc.start(audioCtx.currentTime + i * 0.15);
      osc.stop(audioCtx.currentTime + i * 0.15 + 0.4);
    });
  } catch (e) {
    console.log("Audio not supported:", e);
  }
}

function playCompleteSound() {
  try {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    // Âm thanh hoàn thành bài tập - vui tai
    const notes = [523, 587, 659, 784, 880, 1047];
    notes.forEach((freq, i) => {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime + i * 0.1);
      gain.gain.setValueAtTime(0.25, audioCtx.currentTime + i * 0.1);
      gain.gain.exponentialRampToValueAtTime(
        0.01,
        audioCtx.currentTime + i * 0.1 + 0.3,
      );
      osc.start(audioCtx.currentTime + i * 0.1);
      osc.stop(audioCtx.currentTime + i * 0.1 + 0.3);
    });
  } catch (e) {
    console.log("Audio not supported:", e);
  }
}

/* ========== CHỨC NĂNG BACK ========== */
function bindBackButtons() {
  document.querySelectorAll(".back-btn, .f8-back").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      window.history.back();
    });
  });
}

/* ========== WELCOME ========== */
function initWelcomePage() {
  const startBtn = document.getElementById("startBtn");
  const welcomeLoginLink = document.getElementById("welcomeLoginLink");
  const user = readStorage(STORAGE_KEYS.USER, null);
  if (!startBtn) return;

  startBtn.addEventListener("click", () => {
    window.location.href = user ? "home.html" : "intro.html";
  });

  if (welcomeLoginLink) {
    welcomeLoginLink.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
}

/* ========== INTRO ========== */
function initIntroPage() {
  const continueBtn = document.getElementById("introContinueBtn");
  const introLoginLink = document.getElementById("introLoginLink");
  if (!continueBtn) return;

  continueBtn.addEventListener("click", () => {
    window.location.href = "login.html";
  });

  if (introLoginLink) {
    introLoginLink.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }
}

/* ========== AUTH (Login/Register) ========== */
function validateEmail(email) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email);
}

function initAuthPage() {
  const emailInput = document.getElementById("authEmail");
  const passwordInput = document.getElementById("authPassword");
  const nameInput = document.getElementById("authName");
  const confirmInput = document.getElementById("authConfirm");
  const submitButton = document.getElementById("authSubmit");
  const pageType = document.body.dataset.page;
  if (!emailInput || !passwordInput || !submitButton) return;

  const emailError = document.getElementById("authEmailError");
  const passwordError = document.getElementById("authPasswordError");
  const nameError = document.getElementById("authNameError");
  const confirmError = document.getElementById("authConfirmError");

  function updateSubmitState() {
    submitButton.disabled = false;
  }

  function clearErrors() {
    if (emailError) emailError.textContent = "";
    if (passwordError) passwordError.textContent = "";
    if (nameError) nameError.textContent = "";
    if (confirmError) confirmError.textContent = "";
  }

  document.querySelectorAll(".toggle-password").forEach((icon) => {
    icon.addEventListener("click", () => {
      const targetId = icon.dataset.target;
      const targetInput = document.getElementById(targetId);
      if (!targetInput) return;
      const isPassword = targetInput.type === "password";
      targetInput.type = isPassword ? "text" : "password";
      icon.classList.toggle("ti-eye", !isPassword);
      icon.classList.toggle("ti-eye-off", isPassword);
    });
  });

  [emailInput, passwordInput, nameInput, confirmInput].forEach((input) => {
    if (!input) return;
    input.addEventListener("input", () => {
      clearErrors();
      updateSubmitState();
    });
  });

  const loginLink = document.getElementById("goLoginLink");
  const registerLink = document.getElementById("goRegisterLink");

  if (loginLink) {
    loginLink.addEventListener("click", () => {
      window.location.href = "login.html";
    });
  }

  if (registerLink) {
    registerLink.addEventListener("click", () => {
      window.location.href = "register.html";
    });
  }

  // Forgot password link
  const forgotLink = document.getElementById("forgotPasswordLink");
  if (forgotLink) {
    forgotLink.addEventListener("click", () => {
      alert("Chức năng quên mật khẩu sẽ được phát triển sau!");
    });
  }

  submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    clearErrors();

    let isValid = true;

    if (pageType === "register") {
      const nameValue = nameInput?.value.trim();
      if (!nameValue) {
        if (nameError) nameError.textContent = "Vui lòng nhập họ tên";
        isValid = false;
      }

      const passwordValue = passwordInput.value.trim();
      if (passwordValue.length < 6 && passwordValue !== "") {
        if (passwordError)
          passwordError.textContent = "Mật khẩu phải có ít nhất 6 ký tự";
        isValid = false;
      }

      const confirmValue = confirmInput?.value.trim();
      if (confirmValue !== passwordValue) {
        if (confirmError)
          confirmError.textContent = "Mật khẩu xác nhận không khớp";
        isValid = false;
      }
    }

    const emailValue = emailInput.value.trim() || "user@example.com";
    if (
      emailValue &&
      !validateEmail(emailValue) &&
      emailValue !== "user@example.com"
    ) {
      if (emailError) emailError.textContent = "Email không hợp lệ";
      isValid = false;
    }

    if (!isValid) return;

    const passwordValue = passwordInput.value.trim() || "password";
    const savedUser = readStorage(STORAGE_KEYS.USER, null);
    const defaultName = savedUser?.name || "WorkCare User";
    const nameValue =
      pageType === "register"
        ? nameInput?.value.trim() || defaultName
        : defaultName;

    const userPayload = {
      name: nameValue,
      email: emailValue,
      password: passwordValue,
      job: "Lập trình viên",
    };

    writeStorage(STORAGE_KEYS.USER, userPayload);
    writeStorage(STORAGE_KEYS.PROFILE, {
      name: nameValue,
      email: emailValue,
      job: "Lập trình viên",
    });

    window.location.href = "home.html";
  });

  updateSubmitState();
}

/* ========== HOME ========== */
function initHomePage() {
  const timerAction = document.getElementById("timerAction");
  const timerFill = document.getElementById("timerFill");
  const timerPercent = document.getElementById("timerPercent");
  const greetName = document.querySelector(".f5-name");
  const goWaterBtn = document.getElementById("goWaterBtn");
  const goExercisesBtn = document.getElementById("goExercisesBtn");
  const goStatsBtn = document.getElementById("goStatsBtn");
  const goBreakBtn = document.getElementById("goBreakBtn");

  const user = getUserProfile();
  if (greetName) {
    greetName.textContent = user.name;
  }

  // Thay đổi lời chào theo giờ
  const greeting = document.querySelector(".f5-greeting");
  if (greeting) {
    const hour = new Date().getHours();
    if (hour < 12) greeting.textContent = "Chào buổi sáng ☀️";
    else if (hour < 18) greeting.textContent = "Chào buổi chiều 🌤️";
    else greeting.textContent = "Chào buổi tối 🌙";
  }

  if (goWaterBtn) {
    goWaterBtn.addEventListener("click", () => {
      window.location.href = "water.html";
    });
  }

  if (goExercisesBtn) {
    goExercisesBtn.addEventListener("click", () => {
      window.location.href = "exercises.html";
    });
  }

  if (goStatsBtn) {
    goStatsBtn.addEventListener("click", () => {
      window.location.href = "statistics.html";
    });
  }

  if (goBreakBtn) {
    goBreakBtn.addEventListener("click", () => {
      window.location.href = "break.html";
    });
  }

  // Gợi ý bài tập click
  document.querySelectorAll(".suggested-exercise").forEach((item) => {
    item.addEventListener("click", () => {
      window.location.href = "exercise-detail.html";
    });
  });

  const restModal = document.getElementById("restModal");
  const restCountdown = document.getElementById("restCountdown");
  const restEndBtn = document.getElementById("restEndBtn");

  if (
    !timerAction ||
    !timerFill ||
    !timerPercent ||
    !restModal ||
    !restCountdown ||
    !restEndBtn
  )
    return;

  const goalSeconds = 60 * 60;
  const restSecondsTotal = 10 * 60;
  let workingTimer = readStorage(STORAGE_KEYS.TIMER, defaultTimer);
  let restSeconds = restSecondsTotal;
  let intervalId = null;
  let restInterval = null;

  function saveTimer() {
    writeStorage(STORAGE_KEYS.TIMER, workingTimer);
  }

  function updateHomeUI() {
    timerAction.textContent = workingTimer.running ? "Tạm dừng" : "Bắt đầu";
    const elapsed = Math.min(workingTimer.elapsed, goalSeconds);
    timerFill.style.width = `${Math.min(100, (elapsed / goalSeconds) * 100)}%`;
    timerPercent.textContent = `${Math.min(100, Math.round((elapsed / goalSeconds) * 100))}%`;
    const timerNumber = document.querySelector(".timer-num");
    if (timerNumber) timerNumber.textContent = formatTime(elapsed);

    // Update alert text
    const alertText = document.querySelector(".f5-alert-txt");
    if (alertText) {
      const remaining = goalSeconds - elapsed;
      if (remaining > 0) {
        alertText.textContent = `Còn ${formatTime(remaining)} nữa đến giờ nghỉ`;
      } else {
        alertText.textContent = "Đã đến giờ nghỉ!";
      }
    }
  }

  function stopWork() {
    if (intervalId) {
      clearInterval(intervalId);
      intervalId = null;
    }
    workingTimer.running = false;
    saveTimer();
    updateHomeUI();
  }

  function startRestCountdown() {
    restSeconds = restSecondsTotal;
    restCountdown.textContent = formatTime(restSeconds);
    restModal.classList.remove("hidden");
    restModal.setAttribute("aria-hidden", "false");

    // Phát âm thanh thông báo nghỉ
    playBreakSound();

    if (restInterval) clearInterval(restInterval);
    restInterval = setInterval(() => {
      restSeconds -= 1;
      restCountdown.textContent = formatTime(restSeconds);
      if (restSeconds <= 0) {
        clearInterval(restInterval);
        restInterval = null;
        closeRestModal();
      }
    }, 1000);
  }

  function closeRestModal() {
    restModal.classList.add("hidden");
    restModal.setAttribute("aria-hidden", "true");
    if (restInterval) {
      clearInterval(restInterval);
      restInterval = null;
    }
    workingTimer.elapsed = 0;
    saveTimer();
    updateHomeUI();
  }

  function updateWorkTick() {
    workingTimer.elapsed += 1;
    saveTimer();
    updateHomeUI();

    // Thông báo khi còn 5 phút
    if (workingTimer.elapsed === goalSeconds - 300) {
      playNotificationSound();
    }

    if (workingTimer.elapsed >= goalSeconds) {
      stopWork();
      startRestCountdown();
    }
  }

  timerAction.addEventListener("click", () => {
    if (workingTimer.running) {
      stopWork();
      return;
    }

    workingTimer.running = true;
    intervalId = setInterval(updateWorkTick, 1000);
    saveTimer();
    updateHomeUI();
  });

  restEndBtn.addEventListener("click", () => {
    closeRestModal();
  });

  if (workingTimer.running) {
    intervalId = setInterval(updateWorkTick, 1000);
  }

  updateHomeUI();

  const aiBtn = document.getElementById("aiBtn");

  if (aiBtn) {
    aiBtn.addEventListener("click", () => {
      console.log("AI clicked");
      location.href = "ai-chat.html";
    });
  }
}

/* ========== WATER ========== */
function initWaterPage() {
  const waterAmount = document.getElementById("waterAmount");
  const waterPercent = document.getElementById("waterPercent");
  const waterFill = document.getElementById("waterFill");
  const waterLeft = document.getElementById("waterLeft");
  const addWaterBtn = document.getElementById("addWaterBtn");
  const glassItems = Array.from(document.querySelectorAll(".glass-item"));
  const resetWaterBtn = document.getElementById("resetWaterBtn");
  if (!waterAmount || !waterPercent || !waterFill || !waterLeft || !addWaterBtn)
    return;

  const goal = 2500;
  let current = readStorage(STORAGE_KEYS.WATER, 1625);

  function refreshWaterUI() {
    const percent = Math.round((current / goal) * 100);
    waterAmount.innerHTML = `${(current / 1000).toFixed(3).replace(/\.0+$/, "")}<span style="font-size:14px">L</span>`;
    waterPercent.textContent = `${Math.min(100, percent)}%`;
    waterFill.style.width = `${Math.min(100, percent)}%`;
    waterLeft.textContent = `${Math.max(0, goal - current)} ml`;

    const filledCount = Math.round(current / 250);
    glassItems.forEach((item, index) => {
      item.classList.toggle("filled", index < filledCount);
      item.classList.toggle("empty", index >= filledCount);
    });

    addWaterBtn.disabled = current >= goal;
    addWaterBtn.textContent =
      current >= goal ? "🎉 Đã đạt mục tiêu" : "💧 Thêm 250 ml";
  }

  addWaterBtn.addEventListener("click", () => {
    current = Math.min(goal, current + 250);
    writeStorage(STORAGE_KEYS.WATER, current);
    refreshWaterUI();

    // Âm thanh khi thêm nước
    playNotificationSound();
  });

  if (resetWaterBtn) {
    resetWaterBtn.addEventListener("click", () => {
      if (confirm("Bạn có chắc muốn reset lượng nước hôm nay?")) {
        current = 0;
        writeStorage(STORAGE_KEYS.WATER, current);
        refreshWaterUI();
      }
    });
  }

  refreshWaterUI();
}

/* ========== STATISTICS ========== */
let chartInstance = null;

function initStatisticsPage() {
  window.chartInstance = chartInstance;
  const canvas = document.getElementById("workChart");
  if (!canvas || typeof Chart === "undefined") return;

  if (chartInstance) {
    chartInstance.destroy();
  }

  const ctx = canvas.getContext("2d");

  const data = {
    labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
    datasets: [
      {
        label: "Thời gian làm việc",
        data: [6, 7.2, 5.8, 8.1, 7.2, 8.5, 6.9],

        backgroundColor: [
          "#60a5fa",
          "#3b82f6",
          "#93c5fd",
          "#2563eb",
          "#60a5fa",
          "#1d4ed8",
          "#93c5fd",
        ],

        borderRadius: 6,
        borderSkipped: false,
      },
    ],
  };

  chartInstance = new Chart(ctx, {
    type: "bar",
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,

      plugins: {
        legend: { display: false },
      },

      scales: {
        x: {
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          grid: {
            color: "#eef2ff",
          },
        },
      },
    },
  });
}

const datasets = {
  day: {
    labels: ["6h", "9h", "12h", "15h", "18h", "21h", "0h"],
    data: [1.2, 1.5, 1.8, 2.0, 1.7, 1.9, 1.6],
  },
  week: {
    labels: ["T2", "T3", "T4", "T5", "T6", "T7", "CN"],
    data: [6, 7.2, 5.8, 8.1, 7.2, 8.5, 6.9],
  },
  month: {
    labels: ["W1", "W2", "W3", "W4", "W5", "W6", "W7"],
    data: [5.8, 6.2, 6.7, 7.1, 6.8, 7.3, 7.9],
  },
};

document.querySelectorAll(".period-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document
      .querySelectorAll(".period-btn")
      .forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    const period = btn.dataset.period || btn.textContent.toLowerCase().trim();

    if (!window.chartInstance) return;

    const dataset = datasets[period] || datasets.week;

    window.chartInstance.data.labels = dataset.labels;
    window.chartInstance.data.datasets[0].data = dataset.data;

    window.chartInstance.update();
  });
});

/* ========== SETTINGS ========== */
function initSettingsPage() {
  const darkToggle = document.getElementById("darkModeToggle");
  if (!darkToggle) return;
  darkToggle.addEventListener("click", toggleTheme);

  // Logout button
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      if (confirm("Bạn có chắc muốn đăng xuất?")) {
        localStorage.removeItem(STORAGE_KEYS.USER);
        localStorage.removeItem(STORAGE_KEYS.PROFILE);
        localStorage.removeItem(STORAGE_KEYS.TIMER);
        localStorage.removeItem(STORAGE_KEYS.WATER);
        window.location.href = "login.html";
      }
    });
  }
}

/* ========== PROFILE ========== */
function initProfilePage() {
  const editBtn = document.getElementById("editProfileBtn");
  const profileForm = document.querySelector(".profile-form");
  const nameInput = document.getElementById("profileName");
  const emailInput = document.getElementById("profileEmail");
  const jobInput = document.getElementById("profileJob");
  const saveBtn = document.getElementById("profileSaveBtn");
  const profileNameLabel = document.querySelector(".f12-name");
  const profileEmailLabel = document.querySelector(".f12-email");
  const avatar = document.querySelector(".avatar");

  if (
    !editBtn ||
    !profileForm ||
    !nameInput ||
    !emailInput ||
    !jobInput ||
    !saveBtn
  )
    return;

  function loadProfile() {
    const profile = readStorage(STORAGE_KEYS.PROFILE, null);
    const user = readStorage(STORAGE_KEYS.USER, null);
    const current = profile || user || {};

    nameInput.value = current.name || nameInput.value;
    emailInput.value = current.email || emailInput.value;
    jobInput.value = current.job || jobInput.value;
    if (profileNameLabel)
      profileNameLabel.textContent =
        current.name || profileNameLabel.textContent;
    if (profileEmailLabel)
      profileEmailLabel.textContent =
        current.email || profileEmailLabel.textContent;
    if (avatar)
      avatar.textContent = current.name
        ? current.name
            .split(" ")
            .map((part) => part[0])
            .join("")
            .slice(0, 2)
            .toUpperCase()
        : avatar.textContent;
  }

  function toggleEditMode() {
    profileForm.classList.toggle("hidden");
    editBtn.textContent = profileForm.classList.contains("hidden")
      ? "✏️ Chỉnh sửa hồ sơ"
      : "❌ Đóng";
  }

  editBtn.addEventListener("click", toggleEditMode);

  saveBtn.addEventListener("click", (event) => {
    event.preventDefault();
    const profile = {
      name: nameInput.value.trim(),
      email: emailInput.value.trim(),
      job: jobInput.value.trim(),
    };
    writeStorage(STORAGE_KEYS.PROFILE, profile);
    loadProfile();
    toggleEditMode();
    alert("✅ Thông tin đã được lưu!");
  });

  loadProfile();

  // Settings button on profile page
  const settingsBtn = document.getElementById("goSettingsBtn");
  if (settingsBtn) {
    settingsBtn.addEventListener("click", () => {
      window.location.href = "settings.html";
    });
  }
}

/* ========== EXERCISES ========== */
function initExercisesPage() {
  const searchInput = document.getElementById("exerciseSearch");
  const pills = Array.from(document.querySelectorAll(".cat-pill"));
  const cards = Array.from(document.querySelectorAll(".ex-card"));
  if (!searchInput || !pills.length || !cards.length) return;

  function filterCards() {
    const filter = searchInput.value.trim().toLowerCase();
    const activeCategory =
      document.querySelector(".cat-pill.active")?.dataset.category || "all";

    cards.forEach((card) => {
      const name =
        card.querySelector(".ex-name")?.textContent.toLowerCase() || "";
      const category = card.dataset.category || "all";
      const categoryMatch =
        activeCategory === "all" || category === activeCategory;
      const textMatch = !filter || name.includes(filter);
      card.style.display = categoryMatch && textMatch ? "" : "none";
    });
  }

  pills.forEach((pill) => {
    pill.addEventListener("click", () => {
      pills.forEach((item) => item.classList.remove("active"));
      pill.classList.add("active");
      filterCards();
    });
  });

  searchInput.addEventListener("input", filterCards);
  cards.forEach((card) => {
    card.addEventListener("click", () => {
      // Lấy tên bài tập để truyền qua URL
      const exName = card.querySelector(".ex-name")?.textContent.trim() || "";
      window.location.href = `exercise-detail.html?name=${encodeURIComponent(exName)}`;
    });
  });

  filterCards();
}

/* ========== EXERCISE DATABASE ========== */
/* Helper: draw a person sitting on chair */
function svgSitting(headTilt, armLeft, armRight, extra) {
  return `<svg viewBox="0 0 200 260">
    <!-- Chair -->
    <rect x="65" y="175" width="8" height="55" rx="4" fill="#93C5FD"/>
    <rect x="127" y="175" width="8" height="55" rx="4" fill="#93C5FD"/>
    <rect x="55" y="195" width="90" height="8" rx="4" fill="#BFDBFE"/>
    <rect x="55" y="225" width="90" height="6" rx="3" fill="#93C5FD"/>
    <!-- Head group (with tilt) -->
    <g transform="${headTilt}">
      <circle cx="100" cy="95" r="22" fill="#FED7AA"/>
      <!-- Hair -->
      <path d="M78 88 Q80 70 100 68 Q120 70 122 88" fill="#8B5CF6"/>
      <!-- Face -->
      <circle cx="92" cy="98" r="3" fill="#1E40AF"/>
      <circle cx="108" cy="98" r="3" fill="#1E40AF"/>
      <path d="M93 107 Q100 113 107 107" stroke="#DC2626" stroke-width="1.5" fill="none"/>
      <!-- Ear -->
      <circle cx="76" cy="97" r="4" fill="#F59E0B"/>
    </g>
    <!-- Body -->
    <rect x="82" y="125" width="36" height="50" rx="12" fill="#2563EB"/>
    <!-- Arms -->
    ${armLeft}
    ${armRight}
    <!-- Legs -->
    <rect x="85" y="175" width="12" height="20" rx="4" fill="#1E3A5F"/>
    <rect x="103" y="175" width="12" height="20" rx="4" fill="#1E3A5F"/>
    ${extra || ""}
  </svg>`;
}

/* Helper: draw a person standing */
function svgStanding(headTilt, armLeft, armRight, legs, extra) {
  return `<svg viewBox="0 0 200 260">
    <!-- Shadow -->
    <ellipse cx="100" cy="240" rx="30" ry="5" fill="#E2E8F0"/>
    <!-- Head group -->
    <g transform="${headTilt}">
      <circle cx="100" cy="65" r="22" fill="#FED7AA"/>
      <path d="M78 58 Q80 40 100 38 Q120 40 122 58" fill="#8B5CF6"/>
      <circle cx="92" cy="68" r="3" fill="#1E40AF"/>
      <circle cx="108" cy="68" r="3" fill="#1E40AF"/>
      <path d="M93 77 Q100 83 107 77" stroke="#DC2626" stroke-width="1.5" fill="none"/>
      <circle cx="76" cy="67" r="4" fill="#F59E0B"/>
    </g>
    <!-- Body -->
    <rect x="82" y="95" width="36" height="60" rx="12" fill="#2563EB"/>
    <!-- Arms -->
    ${armLeft}
    ${armRight}
    <!-- Legs -->
    ${legs}
    ${extra || ""}
  </svg>`;
}

const _armDown = (side) => {
  const x = side === "r" ? 118 : 82;
  const tx = side === "r" ? 145 : 55;
  const q = side === "r" ? 140 : 60;
  return `<path d="M${x} 110 Q${q} 130 ${tx} 145" stroke="#FED7AA" stroke-width="8" stroke-linecap="round" fill="none"/>
    <circle cx="${tx}" cy="148" r="5" fill="#FED7AA"/>`;
};
const _armUp = (side) => {
  const x = side === "r" ? 118 : 82;
  const tx = side === "r" ? 155 : 45;
  return `<path d="M${x} 110 L${tx} 70" stroke="#FED7AA" stroke-width="8" stroke-linecap="round"/>
    <circle cx="${tx}" cy="66" r="5" fill="#FED7AA"/>`;
};
const _armForward = (side) => {
  const x = side === "r" ? 118 : 82;
  const tx = side === "r" ? 150 : 50;
  return `<path d="M${x} 110 Q${tx} 100 ${tx} 110" stroke="#FED7AA" stroke-width="8" stroke-linecap="round" fill="none"/>
    <circle cx="${tx}" cy="113" r="5" fill="#FED7AA"/>`;
};
const _legStand = `<rect x="85" y="155" width="12" height="50" rx="5" fill="#1E3A5F"/>
  <rect x="103" y="155" width="12" height="50" rx="5" fill="#1E3A5F"/>
  <ellipse cx="91" cy="210" rx="10" ry="5" fill="#374151"/>
  <ellipse cx="109" cy="210" rx="10" ry="5" fill="#374151"/>`;
const _legLunge = `<path d="M91 155 L65 210" stroke="#1E3A5F" stroke-width="12" stroke-linecap="round"/>
  <path d="M109 155 L140 200" stroke="#1E3A5F" stroke-width="12" stroke-linecap="round"/>
  <ellipse cx="62" cy="213" rx="10" ry="5" fill="#374151"/>
  <ellipse cx="143" cy="203" rx="10" ry="5" fill="#374151"/>`;

/* Arrow helper */
const arrow = (x, y, dir, color) => {
  const arrows = {
    right: `<text x="${x}" y="${y}" font-size="28" fill="${color}">→</text>`,
    left: `<text x="${x}" y="${y}" font-size="28" fill="${color}">←</text>`,
    up: `<text x="${x}" y="${y}" font-size="28" fill="${color}">↑</text>`,
    down: `<text x="${x}" y="${y}" font-size="28" fill="${color}">↓</text>`,
    "↻": `<text x="${x}" y="${y}" font-size="28" fill="${color}">↻</text>`,
    "↺": `<text x="${x}" y="${y}" font-size="28" fill="${color}">↺</text>`,
  };
  return arrows[dir] || "";
};

const exerciseDB = {
  "Giãn cơ cổ": {
    duration: "3 phút",
    level: "Dễ",
    levelBg: "#F0FDF4",
    levelColor: "var(--green)",
    benefit: "Giảm đau mỏi cổ, tăng tuần hoàn máu lên não, giảm đau đầu",
  },
  "Giãn cơ vai": {
    duration: "5 phút",
    level: "TB",
    levelBg: "#FEF3C7",
    levelColor: "#D97706",
    benefit: "Giảm căng cứng vai gáy, cải thiện tư thế ngồi làm việc",
  },
  "Giãn cơ lưng": {
    duration: "7 phút",
    level: "TB",
    levelBg: "#FEF3C7",
    levelColor: "#D97706",
    benefit: "Giảm đau lưng do ngồi lâu, kéo giãn cột sống",
  },
  "Thư giãn mắt": {
    duration: "5 phút",
    level: "Dễ",
    levelBg: "#F0FDF4",
    levelColor: "var(--green)",
    benefit: "Giảm mỏi mắt, khô mắt, áp dụng quy tắc 20-20-20",
  },
  "Vận động toàn thân": {
    duration: "10 phút",
    level: "Cao",
    levelBg: "#FEE2E2",
    levelColor: "#DC2626",
    benefit: "Đánh thức toàn bộ cơ thể, tăng năng lượng sau ngồi lâu",
  },
  "Giãn cổ tay": {
    duration: "3 phút",
    level: "Dễ",
    levelBg: "#F0FDF4",
    levelColor: "var(--green)",
    benefit: "Giảm đau cổ tay do gõ phím, phòng ngừa ống cổ tay",
  },
  "Giãn cơ chân": {
    duration: "4 phút",
    level: "Dễ",
    levelBg: "#F0FDF4",
    levelColor: "var(--green)",
    benefit: "Giảm tê mỏi chân, kích thích tuần hoàn máu, phòng chuột rút",
  },
};

const stepSvgs = {
  "Giãn cơ cổ": [
    {
      /* Bước 0: Ngồi thẳng */
      svg: svgSitting(
        "rotate(0)",
        _armDown("l"),
        _armDown("r"),
        `<text x="135" y="110" font-size="14" fill="#16A34A" style="animation:breathe 2s infinite">✓</text>`,
      ),
      desc: "Ngồi thẳng lưng, hai tay thả lỏng trên đùi, mắt nhìn thẳng phía trước.",
      duration: 10,
    },
    {
      /* Bước 1: Nghiêng phải */
      svg: svgSitting(
        "rotate(-15, 100, 95)",
        _armDown("l"),
        _armDown("r"),
        `${arrow(135, 80, "right", "#EF4444")}
         <path d="M125 90 Q140 85 135 80" stroke="#EF4444" stroke-width="2" fill="none" stroke-dasharray="4 2"/>`,
      ),
      desc: "Từ từ <strong>nghiêng đầu sang phải</strong>, tai hướng về phía vai. Giữ <strong>15 giây</strong>. KHÔNG nhấc vai lên.",
      duration: 15,
    },
    {
      /* Bước 2: Nghiêng trái */
      svg: svgSitting(
        "rotate(15, 100, 95)",
        _armDown("l"),
        _armDown("r"),
        `${arrow(40, 80, "left", "#EF4444")}
         <path d="M75 90 Q60 85 65 80" stroke="#EF4444" stroke-width="2" fill="none" stroke-dasharray="4 2"/>`,
      ),
      desc: "Trở về giữa, thở ra. Sau đó <strong>nghiêng đầu sang trái</strong>, giữ <strong>15 giây</strong>. Cảm nhận cơ cổ giãn ra.",
      duration: 15,
    },
    {
      /* Bước 3: Lặp lại */
      svg: svgSitting(
        "rotate(0)",
        _armDown("l"),
        _armDown("r"),
        `<text x="80" y="140" font-size="22" fill="#2563EB" style="animation:breathe 1.5s infinite">🔄</text>
         <text x="60" y="165" font-size="12" fill="#2563EB">Lặp lại 5 lần</text>`,
      ),
      desc: "Lặp lại động tác <strong>mỗi bên 5 lần</strong>. Hít vào khi về giữa, thở ra khi nghiêng. Thở đều, không giật cơ.",
      duration: 10,
    },
  ],
  "Giãn cơ vai": [
    {
      /* Bước 0: Đứng thả lỏng */
      svg: svgStanding(
        "rotate(0)",
        _armDown("l"),
        _armDown("r"),
        _legStand,
        `<text x="140" y="130" font-size="12" fill="#16A34A">✓</text>`,
      ),
      desc: "Đứng thẳng, hai chân rộng bằng vai. Hai tay thả lỏng dọc thân người. Thở đều.",
      duration: 10,
    },
    {
      /* Bước 1: Nhún vai lên */
      svg: `<svg viewBox="0 0 200 260">
        <ellipse cx="100" cy="240" rx="30" ry="5" fill="#E2E8F0"/>
        <g style="animation:shoulderUp 2s ease-in-out infinite">
          <circle cx="100" cy="55" r="22" fill="#FED7AA"/>
          <path d="M78 48 Q80 30 100 28 Q120 30 122 48" fill="#8B5CF6"/>
          <circle cx="92" cy="58" r="3" fill="#1E40AF"/>
          <circle cx="108" cy="58" r="3" fill="#1E40AF"/>
          <path d="M93 67 Q100 73 107 67" stroke="#DC2626" stroke-width="1.5" fill="none"/>
          <rect x="82" y="85" width="36" height="60" rx="12" fill="#2563EB"/>
          ${_armDown("l")}
          ${_armDown("r")}
        </g>
        ${_legStand}
        ${arrow(140, 50, "up", "#EF4444")}
        <text x="130" y="70" font-size="12" fill="#EF4444">Nhún lên</text>
      </svg>`,
      desc: "<strong>Nhún hai vai lên cao</strong> hết cỡ về phía tai. Giữ <strong>5 giây</strong>, cảm nhận cơ vai co lại.",
      duration: 15,
    },
    {
      /* Bước 2: Xoay vai ra sau */
      svg: svgStanding(
        "rotate(0)",
        _armDown("l"),
        _armDown("r"),
        _legStand,
        `${arrow(55, 90, "↻", "#2563EB")}
         <text x="30" y="80" font-size="12" fill="#2563EB">Xoay ra sau</text>`,
      ),
      desc: "<strong>Xoay vai ra sau</strong> theo vòng tròn lớn, chậm rãi. Xoay <strong>10 lần</strong>. Giữ nhịp thở đều.",
      duration: 20,
    },
    {
      /* Bước 3: Xoay vai về trước */
      svg: svgStanding(
        "rotate(0)",
        _armDown("l"),
        _armDown("r"),
        _legStand,
        `${arrow(115, 90, "↺", "#2563EB")}
         <text x="110" y="80" font-size="12" fill="#2563EB">Xoay về trước</text>`,
      ),
      desc: "Đổi chiều: <strong>xoay vai về phía trước</strong> 10 lần. Cảm nhận vai bớt căng cứng. Kết hợp hít thở đều.",
      duration: 20,
    },
  ],
  "Giãn cơ lưng": [
    {
      /* Bước 0: Đứng thẳng */
      svg: svgStanding(
        "rotate(0)",
        _armDown("l"),
        _armDown("r"),
        _legStand,
        `<text x="140" y="120" font-size="12" fill="#16A34A">✓ Đứng thẳng</text>`,
      ),
      desc: "Đứng thẳng, hai chân rộng bằng vai, hai tay chống hông. Thở đều, chuẩn bị.",
      duration: 10,
    },
    {
      /* Bước 1: Ưỡn người ra sau */
      svg: `<svg viewBox="0 0 200 260">
        <ellipse cx="100" cy="240" rx="30" ry="5" fill="#E2E8F0"/>
        <g transform="rotate(-8, 100, 155)">
          <circle cx="100" cy="55" r="22" fill="#FED7AA"/>
          <path d="M78 48 Q80 30 100 28 Q120 30 122 48" fill="#8B5CF6"/>
          <circle cx="92" cy="58" r="3" fill="#1E40AF"/>
          <circle cx="108" cy="58" r="3" fill="#1E40AF"/>
          <rect x="82" y="85" width="36" height="60" rx="12" fill="#2563EB"/>
          <path d="M82 110 L60 135 L65 145" stroke="#FED7AA" stroke-width="8" stroke-linecap="round" fill="none"/>
          <path d="M118 110 L140 135 L135 145" stroke="#FED7AA" stroke-width="8" stroke-linecap="round" fill="none"/>
          <path d="M91 145 L85 210" stroke="#1E3A5F" stroke-width="12" stroke-linecap="round"/>
          <path d="M109 145 L115 210" stroke="#1E3A5F" stroke-width="12" stroke-linecap="round"/>
          <ellipse cx="82" cy="213" rx="10" ry="5" fill="#374151"/>
          <ellipse cx="118" cy="213" rx="10" ry="5" fill="#374151"/>
        </g>
        ${arrow(145, 45, "up", "#EF4444")}
        <path d="M135 55 Q145 45 145 35" stroke="#EF4444" stroke-width="2" fill="none" stroke-dasharray="4 2"/>
      </svg>`,
      desc: "Hít vào sâu, <strong>đẩy hông về phía trước, ngửa nhẹ người ra sau</strong>. Giữ <strong>10 giây</strong>. Cảm nhận cơ lưng giãn ra.",
      duration: 15,
    },
    {
      /* Bước 2: Cúi gập người */
      svg: `<svg viewBox="0 0 200 260">
        <ellipse cx="100" cy="240" rx="30" ry="5" fill="#E2E8F0"/>
        <g>
          <!-- Legs standing -->
          <path d="M91 155 L85 210" stroke="#1E3A5F" stroke-width="12" stroke-linecap="round"/>
          <path d="M109 155 L115 210" stroke="#1E3A5F" stroke-width="12" stroke-linecap="round"/>
          <ellipse cx="82" cy="213" rx="10" ry="5" fill="#374151"/>
          <ellipse cx="118" cy="213" rx="10" ry="5" fill="#374151"/>
          <!-- Body bent forward -->
          <rect x="82" y="130" width="36" height="30" rx="10" fill="#2563EB" transform="rotate(70, 100, 155)"/>
          <!-- Head hanging down -->
          <circle cx="60" cy="170" r="18" fill="#FED7AA"/>
          <path d="M48 163 Q50 148 60 146 Q70 148 72 163" fill="#8B5CF6"/>
          <circle cx="55" cy="172" r="2.5" fill="#1E40AF"/>
          <circle cx="65" cy="172" r="2.5" fill="#1E40AF"/>
          <!-- Arms reaching down -->
          <path d="M100 145 L55 190" stroke="#FED7AA" stroke-width="8" stroke-linecap="round"/>
          <path d="M95 148 L50 185" stroke="#FED7AA" stroke-width="8" stroke-linecap="round"/>
        </g>
        ${arrow(35, 150, "down", "#EF4444")}
      </svg>`,
      desc: "Thở ra, <strong>cúi gập người về phía trước</strong>, tay chạm mũi chân hoặc đất. Giữ <strong>15 giây</strong>. KHÔNG gật đầu mạnh.",
      duration: 20,
    },
    {
      /* Bước 3: Lặp lại */
      svg: svgStanding(
        "rotate(0)",
        _armDown("l"),
        _armDown("r"),
        _legStand,
        `<text x="80" y="140" font-size="22" fill="#2563EB" style="animation:breathe 1.5s infinite">🔄</text>
         <text x="60" y="165" font-size="12" fill="#2563EB">Lặp lại 5 lần</text>`,
      ),
      desc: "Trở về tư thế đứng. <strong>Lặp lại 5 lần</strong>. Hít vào khi ngửa, thở ra khi cúi. Giữ nhịp chậm, đều đặn.",
      duration: 10,
    },
  ],
  "Thư giãn mắt": [
    {
      /* Bước 0: Xoa tay */
      svg: `<svg viewBox="0 0 200 260">
        <circle cx="100" cy="80" r="22" fill="#FED7AA"/>
        <path d="M78 73 Q80 55 100 53 Q120 55 122 73" fill="#8B5CF6"/>
        <circle cx="92" cy="83" r="3" fill="#1E40AF"/>
        <circle cx="108" cy="83" r="3" fill="#1E40AF"/>
        <rect x="82" y="110" width="36" height="50" rx="12" fill="#2563EB"/>
        <!-- Hands rubbing together -->
        <g style="animation:breathe 1s infinite">
          <rect x="80" y="155" width="18" height="14" rx="6" fill="#FED7AA"/>
          <rect x="100" y="155" width="18" height="14" rx="6" fill="#FED7AA"/>
          <text x="88" y="166" font-size="10" fill="#DC2626">~</text>
        </g>
        <text x="120" y="165" font-size="12" fill="#2563EB">Xoa tay</text>
        <text x="115" y="180" font-size="12" fill="#2563EB">cho ấm 🤲</text>
      </svg>`,
      desc: "Xoa hai lòng bàn tay vào nhau thật nhanh trong <strong>15 giây</strong> cho đến khi cảm thấy ấm nóng.",
      duration: 15,
    },
    {
      /* Bước 1: Úp tay lên mắt */
      svg: `<svg viewBox="0 0 200 260">
        <circle cx="100" cy="80" r="22" fill="#FED7AA"/>
        <path d="M78 73 Q80 55 100 53 Q120 55 122 73" fill="#8B5CF6"/>
        <rect x="82" y="110" width="36" height="50" rx="12" fill="#2563EB"/>
        <!-- Hands covering eyes -->
        <rect x="72" y="68" width="56" height="30" rx="12" fill="#FED7AA" opacity="0.95"/>
        <text x="92" y="90" font-size="16">🖐️</text>
        <path d="M82 110 L70 100" stroke="#FED7AA" stroke-width="8" stroke-linecap="round"/>
        <path d="M118 110 L130 100" stroke="#FED7AA" stroke-width="8" stroke-linecap="round"/>
        <text x="40" y="120" font-size="12" fill="#2563EB">Úp tay lên mắt</text>
        <text x="35" y="135" font-size="11" fill="#60A5FA">Giữ 30 giây ⏱️</text>
      </svg>`,
      desc: "Úp nhẹ hai lòng bàn tay ấm lên mắt, <strong>không ấn mạnh</strong>. Thư giãn trong <strong>30 giây</strong>. Cảm nhận hơi ấm.",
      duration: 30,
    },
    {
      /* Bước 2: Chớp mắt */
      svg: `<svg viewBox="0 0 200 260">
        <!-- Two large eyes blinking -->
        <g>
          <!-- Left eye -->
          <ellipse cx="70" cy="120" rx="30" ry="22" fill="white" stroke="#F97316" stroke-width="2"/>
          <g style="animation:eyeBlinkFast 2s infinite; transform-origin:70px 120px">
            <circle cx="70" cy="120" r="12" fill="#1E40AF"/>
            <circle cx="67" cy="116" r="3" fill="white"/>
          </g>
          <!-- Right eye -->
          <ellipse cx="130" cy="120" rx="30" ry="22" fill="white" stroke="#F97316" stroke-width="2"/>
          <g style="animation:eyeBlinkFast 2s infinite; transform-origin:130px 120px">
            <circle cx="130" cy="120" r="12" fill="#1E40AF"/>
            <circle cx="127" cy="116" r="3" fill="white"/>
          </g>
        </g>
        <text x="55" y="165" font-size="13" fill="#2563EB">Chớp mắt nhanh 10 lần</text>
        <text x="65" y="180" font-size="11" fill="#60A5FA">👁️眨眼</text>
      </svg>`,
      desc: "Bỏ tay ra, <strong>chớp mắt nhanh 10 lần</strong> liên tục. Sau đó nhắm mắt 5 giây, mở mắt ra.",
      duration: 20,
    },
    {
      /* Bước 3: Nhìn xa */
      svg: `<svg viewBox="0 0 200 260">
        <circle cx="120" cy="80" r="22" fill="#FED7AA"/>
        <path d="M98 73 Q100 55 120 53 Q140 55 142 73" fill="#8B5CF6"/>
        <circle cx="112" cy="83" r="3" fill="#1E40AF"/>
        <circle cx="128" cy="83" r="3" fill="#1E40AF"/>
        <rect x="102" y="110" width="36" height="50" rx="12" fill="#2563EB"/>
        <path d="M102 125 L70 115" stroke="#FED7AA" stroke-width="8" stroke-linecap="round"/>
        <!-- Looking at tree -->
        <text x="15" y="90" font-size="28">🌳</text>
        <!-- Sight lines -->
        <line x1="115" y1="83" x2="40" y2="85" stroke="#60A5FA" stroke-width="1.5" stroke-dasharray="6 3"/>
        <text x="20" y="140" font-size="12" fill="#2563EB">Nhìn xa 20s 👀</text>
      </svg>`,
      desc: "Nhìn ra <strong>xa cửa sổ hoặc nơi có cây xanh</strong>, giữ mắt nhìn xa <strong>20 giây</strong>. Áp dụng quy tắc 20-20-20.",
      duration: 20,
    },
  ],
  "Vận động toàn thân": [
    {
      /* Bước 0: Giơ tay lên */
      svg: svgStanding(
        "rotate(0)",
        _armUp("l"),
        _armUp("r"),
        _legStand,
        `${arrow(100, 25, "up", "#EF4444")}`,
      ),
      desc: "Đứng thẳng, <strong>giơ hai tay lên trời</strong>, hít vào sâu. Mở rộng ngực, cảm nhận cơ thể kéo giãn.",
      duration: 15,
    },
    {
      /* Bước 1: Cúi gập người */
      svg: `<svg viewBox="0 0 200 260">
        <ellipse cx="100" cy="240" rx="30" ry="5" fill="#E2E8F0"/>
        <path d="M91 155 L85 210" stroke="#1E3A5F" stroke-width="12" stroke-linecap="round"/>
        <path d="M109 155 L115 210" stroke="#1E3A5F" stroke-width="12" stroke-linecap="round"/>
        <ellipse cx="82" cy="213" rx="10" ry="5" fill="#374151"/>
        <ellipse cx="118" cy="213" rx="10" ry="5" fill="#374151"/>
        <rect x="82" y="130" width="36" height="30" rx="10" fill="#2563EB" transform="rotate(70, 100, 155)"/>
        <circle cx="55" cy="165" r="18" fill="#FED7AA"/>
        <path d="M43 158 Q45 143 55 141 Q65 143 67 158" fill="#8B5CF6"/>
        <path d="M95 145 L50 185" stroke="#FED7AA" stroke-width="8" stroke-linecap="round"/>
        <path d="M100 148 L60 188" stroke="#FED7AA" stroke-width="8" stroke-linecap="round"/>
        ${arrow(100, 45, "down", "#EF4444")}
      </svg>`,
      desc: "Thở ra, <strong>cúi gập người xuống</strong>, tay chạm đất (gập gối nếu cần). Giữ <strong>10 giây</strong>.",
      duration: 15,
    },
    {
      /* Bước 2: Chùng chân phải */
      svg: `<svg viewBox="0 0 200 260">
        <ellipse cx="100" cy="240" rx="30" ry="5" fill="#E2E8F0"/>
        <circle cx="100" cy="55" r="22" fill="#FED7AA"/>
        <path d="M78 48 Q80 30 100 28 Q120 30 122 48" fill="#8B5CF6"/>
        <circle cx="92" cy="58" r="3" fill="#1E40AF"/>
        <circle cx="108" cy="58" r="3" fill="#1E40AF"/>
        <rect x="82" y="85" width="36" height="60" rx="12" fill="#2563EB"/>
        <!-- Left arm up, right arm down -->
        <path d="M82 100 L45 60" stroke="#FED7AA" stroke-width="8" stroke-linecap="round"/>
        <circle cx="42" cy="56" r="5" fill="#FED7AA"/>
        <path d="M118 110 L140 135" stroke="#FED7AA" stroke-width="8" stroke-linecap="round"/>
        <!-- Lunge right leg back -->
        ${_legLunge}
        ${arrow(35, 50, "up", "#16A34A")}
      </svg>`,
      desc: "<strong>Chùng chân phải ra sau</strong>, tay trái giơ lên cao. Giữ <strong>15 giây</strong>. Cân bằng cơ thể.",
      duration: 15,
    },
    {
      /* Bước 3: Đổi bên */
      svg: `<svg viewBox="0 0 200 260">
        <ellipse cx="100" cy="240" rx="30" ry="5" fill="#E2E8F0"/>
        <circle cx="100" cy="55" r="22" fill="#FED7AA"/>
        <path d="M78 48 Q80 30 100 28 Q120 30 122 48" fill="#8B5CF6"/>
        <circle cx="92" cy="58" r="3" fill="#1E40AF"/>
        <circle cx="108" cy="58" r="3" fill="#1E40AF"/>
        <rect x="82" y="85" width="36" height="60" rx="12" fill="#2563EB"/>
        <!-- Right arm up, left arm down -->
        <path d="M118 100 L155 60" stroke="#FED7AA" stroke-width="8" stroke-linecap="round"/>
        <circle cx="158" cy="56" r="5" fill="#FED7AA"/>
        <path d="M82 110 L60 135" stroke="#FED7AA" stroke-width="8" stroke-linecap="round"/>
        <!-- Lunge left leg back -->
        <path d="M91 155 L65 210" stroke="#1E3A5F" stroke-width="12" stroke-linecap="round"/>
        <path d="M109 155 L140 200" stroke="#1E3A5F" stroke-width="12" stroke-linecap="round"/>
        <ellipse cx="62" cy="213" rx="10" ry="5" fill="#374151"/>
        <ellipse cx="143" cy="203" rx="10" ry="5" fill="#374151"/>
        ${arrow(140, 50, "up", "#16A34A")}
      </svg>`,
      desc: "<strong>Đổi bên</strong>: chân trái ra sau, tay phải giơ lên cao. Giữ <strong>15 giây</strong>. Lặp lại 3 lần mỗi bên.",
      duration: 15,
    },
  ],
  "Giãn cổ tay": [
    {
      /* Bước 0: Duỗi tay */
      svg: `<svg viewBox="0 0 200 260">
        <!-- Two arms extended forward -->
        <rect x="20" y="120" width="80" height="12" rx="6" fill="#FED7AA"/>
        <rect x="100" y="120" width="80" height="12" rx="6" fill="#FED7AA"/>
        <rect x="25" y="105" width="20" height="16" rx="5" fill="#2563EB"/>
        <rect x="155" y="105" width="20" height="16" rx="5" fill="#2563EB"/>
        <!-- Fingers pointing up -->
        <rect x="15" y="100" width="8" height="22" rx="3" fill="#FED7AA"/>
        <rect x="26" y="97" width="7" height="25" rx="3" fill="#FED7AA"/>
        <rect x="36" y="100" width="7" height="22" rx="3" fill="#FED7AA"/>
        <text x="60" y="160" font-size="12" fill="#2563EB">✋ Duỗi thẳng tay</text>
        <text x="55" y="175" font-size="11" fill="#60A5FA">Lòng bàn tay hướng lên</text>
      </svg>`,
      desc: "Duỗi thẳng tay trái ra trước, <strong>lòng bàn tay hướng lên trên</strong>. Ngón tay hướng lên trời.",
      duration: 10,
    },
    {
      /* Bước 1: Kéo ngón */
      svg: `<svg viewBox="0 0 200 260">
        <!-- Left arm extended -->
        <rect x="10" y="120" width="90" height="12" rx="6" fill="#FED7AA"/>
        <rect x="15" y="105" width="20" height="16" rx="5" fill="#2563EB"/>
        <!-- Fingers pointing up -->
        <rect x="5" y="95" width="8" height="22" rx="3" fill="#FED7AA"/>
        <rect x="16" y="92" width="7" height="25" rx="3" fill="#FED7AA"/>
        <rect x="26" y="95" width="7" height="22" rx="3" fill="#FED7AA"/>
        <!-- Right hand pulling fingers down -->
        <path d="M30 88 Q35 80 45 85" stroke="#FED7AA" stroke-width="6" stroke-linecap="round" fill="none"/>
        <circle cx="47" cy="88" r="5" fill="#FED7AA"/>
        <!-- Arrow showing pull direction -->
        ${arrow(5, 75, "down", "#EF4444")}
        <text x="55" y="160" font-size="12" fill="#2563EB">Kéo nhẹ ngón tay ↓</text>
        <text x="55" y="175" font-size="11" fill="#60A5FA">Giữ 15 giây</text>
      </svg>`,
      desc: "Dùng tay phải <strong>kéo nhẹ các ngón tay trái xuống dưới</strong>. Giữ <strong>15 giây</strong>. Cảm nhận cổ tay giãn ra.",
      duration: 15,
    },
    {
      /* Bước 2: Đổi tay */
      svg: `<svg viewBox="0 0 200 260">
        <!-- Right arm extended -->
        <rect x="100" y="120" width="90" height="12" rx="6" fill="#FED7AA"/>
        <rect x="165" y="105" width="20" height="16" rx="5" fill="#2563EB"/>
        <!-- Fingers pointing up -->
        <rect x="187" y="95" width="8" height="22" rx="3" fill="#FED7AA"/>
        <rect x="177" y="92" width="7" height="25" rx="3" fill="#FED7AA"/>
        <rect x="167" y="95" width="7" height="22" rx="3" fill="#FED7AA"/>
        <!-- Left hand pulling -->
        <path d="M170 88 Q165 80 155 85" stroke="#FED7AA" stroke-width="6" stroke-linecap="round" fill="none"/>
        <circle cx="153" cy="88" r="5" fill="#FED7AA"/>
        ${arrow(185, 75, "down", "#EF4444")}
        <text x="30" y="160" font-size="12" fill="#2563EB">Đổi tay: kéo ↓ 15s</text>
      </svg>`,
      desc: "Đổi tay: duỗi tay phải ra trước, dùng tay trái <strong>kéo nhẹ các ngón xuống</strong>. Giữ <strong>15 giây</strong>.",
      duration: 15,
    },
    {
      /* Bước 3: Xoay cổ tay */
      svg: `<svg viewBox="0 0 200 260">
        <rect x="60" y="120" width="80" height="12" rx="6" fill="#FED7AA"/>
        <rect x="65" y="105" width="20" height="16" rx="5" fill="#2563EB"/>
        <rect x="115" y="105" width="20" height="16" rx="5" fill="#2563EB"/>
        <!-- Circular arrows for wrist rotation -->
        <circle cx="75" cy="100" r="20" fill="none" stroke="#2563EB" stroke-width="2" stroke-dasharray="6 3"/>
        <path d="M60 85 L55 80 L58 88" fill="#2563EB"/>
        <circle cx="125" cy="100" r="20" fill="none" stroke="#2563EB" stroke-width="2" stroke-dasharray="6 3"/>
        <path d="M140 85 L145 80 L142 88" fill="#2563EB"/>
        <text x="50" y="160" font-size="12" fill="#2563EB">↺ Xoay cổ tay ↻</text>
        <text x="55" y="175" font-size="11" fill="#60A5FA">10 vòng mỗi chiều</text>
      </svg>`,
      desc: "<strong>Xoay cổ tay</strong> theo vòng tròn, 10 vòng theo chiều kim đồng hồ, 10 vòng ngược lại. Lặp lại 3 lần.",
      duration: 20,
    },
  ],
  "Giãn cơ chân": [
    {
      /* Bước 0: Kiễng chân phải */
      svg: svgSitting(
        "rotate(0)",
        _armDown("l"),
        _armDown("r"),
        `<text x="140" y="200" font-size="18" fill="#EF4444">↑</text>
         <text x="135" y="215" font-size="10" fill="#2563EB">Kiễng lên</text>`,
      ),
      desc: "Ngồi thẳng, duỗi thẳng chân phải ra trước. <strong>Kiễng gót chân lên, hạ xuống</strong> 15 lần liên tục.",
      duration: 15,
    },
    {
      /* Bước 1: Kiễng chân trái */
      svg: svgSitting(
        "rotate(0)",
        _armDown("l"),
        _armDown("r"),
        `<text x="55" y="200" font-size="18" fill="#EF4444">↑</text>
         <text x="48" y="215" font-size="10" fill="#2563EB">Kiễng lên</text>`,
      ),
      desc: "Đổi sang chân trái: <strong>kiễng gót chân lên, hạ xuống</strong> 15 lần. Giữ nhịp đều đặn, không quá nhanh.",
      duration: 15,
    },
    {
      /* Bước 2: Xoay cổ chân */
      svg: `<svg viewBox="0 0 200 260">
        <!-- Leg and foot -->
        <rect x="70" y="100" width="60" height="12" rx="6" fill="#FED7AA"/>
        <rect x="130" y="100" width="40" height="12" rx="6" fill="#FED7AA"/>
        <!-- Foot -->
        <rect x="165" y="95" width="25" height="22" rx="8" fill="#2563EB"/>
        <!-- Ankle circle -->
        <circle cx="170" cy="106" r="15" fill="none" stroke="#60A5FA" stroke-width="2" stroke-dasharray="5 3"/>
        <path d="M182 95 L187 90 L185 100" fill="#60A5FA"/>
        <text x="50" y="160" font-size="12" fill="#2563EB">Xoay cổ chân ↻↺</text>
        <text x="55" y="175" font-size="11" fill="#60A5FA">10 vòng mỗi chiều</text>
      </svg>`,
      desc: "<strong>Xoay cổ chân</strong> phải 10 vòng theo chiều kim đồng hồ, 10 vòng ngược lại. Đổi chân trái và lặp lại.",
      duration: 20,
    },
    {
      /* Bước 3: Bước tại chỗ */
      svg: svgStanding(
        "rotate(0)",
        _armDown("l"),
        _armDown("r"),
        `<path d="M91 155 L80 210" stroke="#1E3A5F" stroke-width="12" stroke-linecap="round"/>
         <path d="M109 155 L120 200" stroke="#1E3A5F" stroke-width="12" stroke-linecap="round"/>
         <ellipse cx="77" cy="213" rx="10" ry="5" fill="#374151"/>
         <ellipse cx="123" cy="203" rx="10" ry="5" fill="#374151"/>`,
        `<text x="120" y="190" font-size="16" fill="#16A34A" style="animation:breathe 1s infinite">🚶</text>
         <text x="45" y="200" font-size="12" fill="#2563EB">Bước tại chỗ 30s</text>`,
      ),
      desc: "Đứng dậy, <strong>bước tại chỗ</strong> trong <strong>30 giây</strong>. Nâng cao gối, vung tay nhẹ nhàng. Kết thúc bài tập!",
      duration: 30,
    },
  ],
};

/* ========== EXERCISE DETAIL (Step-by-step animated) ========== */
let exStepTimer = null;
let exCountdown = 0;

function initExerciseDetailPage() {
  const nextBtn = document.getElementById("nextStepBtn");
  const svgBox = document.getElementById("exSvgBox");
  const timerEl = document.getElementById("stepTimer");
  const stepNum = document.getElementById("stepNum");
  const stepDesc = document.getElementById("stepDesc");
  const dotsContainer = document.getElementById("stepDots");
  const progressFill = document.getElementById("stepProgressFill");
  const resetBtn = document.getElementById("resetBtn");

  if (!nextBtn || !svgBox) return;

  const urlParams = new URLSearchParams(window.location.search);
  let exName = urlParams.get("name");
  if (!exName || !exerciseDB[decodeURIComponent(exName)]) exName = "Giãn cơ cổ";
  else exName = decodeURIComponent(exName);

  const exData = exerciseDB[exName];
  const steps = stepSvgs[exName];
  if (!exData || !steps) return;

  let currentStep = 0;

  /* Fill exercise info */
  document.getElementById("exName").textContent = exName;
  document.getElementById("exDuration").textContent = exData.duration;
  const lv = document.getElementById("exLevel");
  lv.textContent = exData.level;
  lv.style.background = exData.levelBg;
  lv.style.color = exData.levelColor;
  document.getElementById("exBenefitText").textContent = exData.benefit;

  /* Create progress dots */
  dotsContainer.innerHTML = steps
    .map((_, i) => `<div class="dot${i === 0 ? " active" : ""}"></div>`)
    .join("");

  function updateDots() {
    const dots = dotsContainer.querySelectorAll(".dot");
    dots.forEach((d, i) => {
      d.className =
        "dot" +
        (i < currentStep ? " done" : i === currentStep ? " active" : "");
    });
  }

  function startTimer(duration) {
    clearInterval(exStepTimer);
    exCountdown = duration;
    timerEl.textContent = exCountdown + "s";
    timerEl.classList.remove("done");
    progressFill.style.transition = "none";
    progressFill.style.width = "100%";
    requestAnimationFrame(() => {
      progressFill.style.transition = `width ${duration}s linear`;
      progressFill.style.width = "0%";
    });
    exStepTimer = setInterval(() => {
      exCountdown--;
      timerEl.textContent = Math.max(0, exCountdown) + "s";
      if (exCountdown <= 0) {
        clearInterval(exStepTimer);
        timerEl.classList.add("done");
        timerEl.textContent = "✓";
        /* Vibrate if supported */
        if (navigator.vibrate) navigator.vibrate(200);
      }
    }, 1000);
  }

  function renderStep() {
    const step = steps[currentStep];
    svgBox.innerHTML = step.svg;
    stepNum.textContent = currentStep + 1;
    stepDesc.innerHTML = step.desc;
    nextBtn.innerHTML =
      currentStep >= steps.length - 1 ? "🏁 Hoàn tất!" : "👉 Tiếp theo";
    updateDots();
    startTimer(step.duration);
  }

  function showConfetti() {
    const c = document.createElement("div");
    c.style.cssText = "position:fixed;inset:0;pointer-events:none;z-index:9999";
    const colors = ["#2563EB", "#16A34A", "#F59E0B", "#EF4444", "#8B5CF6"];
    for (let i = 0; i < 50; i++) {
      const p = document.createElement("div");
      p.style.cssText = `position:absolute;font-size:${10 + Math.random() * 16}px;color:${colors[i % 5]};left:${Math.random() * 100}%;top:-20px;`;
      p.textContent = ["■", "●", "▲", "★", "♦"][i % 5];
      p.style.animation = `confetti-fall ${1 + Math.random() * 1.5}s ease-out ${Math.random() * 0.5}s forwards`;
      c.appendChild(p);
    }
    const s = document.createElement("style");
    s.textContent = `@keyframes confetti-fall{to{transform:translateY(120vh) rotate(720deg);opacity:0}}`;
    document.body.appendChild(s);
    document.body.appendChild(c);
    playCompleteSound();
    setTimeout(() => {
      c.remove();
      s.remove();
    }, 3000);
  }

  nextBtn.addEventListener("click", () => {
    clearInterval(exStepTimer);
    if (currentStep >= steps.length - 1) {
      showConfetti();
      nextBtn.disabled = true;
      nextBtn.innerHTML = "✅ Đã hoàn thành!";
      nextBtn.style.background = "linear-gradient(135deg,#16a34a,#22c55e)";
      timerEl.textContent = "✓";
      timerEl.classList.add("done");
      if (resetBtn) resetBtn.style.display = "block";
      updateDots();
      return;
    }
    currentStep++;
    renderStep();
  });

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      currentStep = 0;
      nextBtn.disabled = false;
      nextBtn.style.background = "";
      resetBtn.style.display = "none";
      renderStep();
    });
  }

  renderStep();
}

/* ========== BREAK PAGE ========== */
function initBreakPage() {
  const breakNowBtn = document.getElementById("breakNowBtn");
  const breakLaterBtn = document.getElementById("breakLaterBtn");
  const breakTimer = document.getElementById("breakTimer");

  // Đếm ngược trên break page
  if (breakTimer) {
    let seconds = 600; // 10 phút
    const updateTimer = () => {
      breakTimer.textContent = formatTime(seconds);
      if (seconds > 0) {
        seconds--;
        setTimeout(updateTimer, 1000);
      }
    };
    updateTimer();
  }

  if (breakNowBtn) {
    breakNowBtn.addEventListener("click", () => {
      alert("Hãy đứng dậy và vận động nhẹ nhàng! 🧘‍♂️");
      window.location.href = "exercises.html";
    });
  }

  if (breakLaterBtn) {
    breakLaterBtn.addEventListener("click", () => {
      window.location.href = "home.html";
    });
  }
}

/* ========== MAIN INIT ========== */
function initScene() {
  loadTheme();
  bindNavigation();
  bindBackButtons();

  const page = document.body.dataset.page;
  initWelcomePage();
  if (page === "intro") initIntroPage();
  if (page === "login" || page === "register") initAuthPage();
  if (page === "home") initHomePage();
  if (page === "water") initWaterPage();
  if (page === "statistics") initStatisticsPage();
  if (page === "settings") initSettingsPage();
  if (page === "profile") initProfilePage();
  if (page === "exercises") initExercisesPage();
  if (page === "exercise-detail") initExerciseDetailPage();
  if (page === "break") initBreakPage();
}

window.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(() => document.body.classList.add("ready"));
  initScene();

  /* Register Service Worker for PWA */
  if ("serviceWorker" in navigator) {
    const swPath = location.pathname.includes("/screens/")
      ? "../sw.js"
      : "./sw.js";
    navigator.serviceWorker
      .register(swPath)
      .then((reg) => {
        console.log("Service Worker registered:", reg.scope);
      })
      .catch((err) => {
        console.log("Service Worker registration failed:", err);
      });
  }
});
