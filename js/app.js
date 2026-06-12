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

  submitButton.addEventListener("click", (event) => {
    event.preventDefault();
    clearErrors();

    const emailValue = emailInput.value.trim() || "user@example.com";
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

function initHomePage() {
  const timerAction = document.getElementById("timerAction");
  const timerFill = document.getElementById("timerFill");
  const timerPercent = document.getElementById("timerPercent");
  const greetName = document.querySelector(".f5-name");
  const goWaterBtn = document.getElementById("goWaterBtn");
  const goExercisesBtn = document.getElementById("goExercisesBtn");
  const goStatsBtn = document.getElementById("goStatsBtn");

  const user = getUserProfile();
  if (greetName) {
    greetName.textContent = user.name;
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

function initWaterPage() {
  const waterAmount = document.getElementById("waterAmount");
  const waterPercent = document.getElementById("waterPercent");
  const waterFill = document.getElementById("waterFill");
  const waterLeft = document.getElementById("waterLeft");
  const addWaterBtn = document.getElementById("addWaterBtn");
  const glassItems = Array.from(document.querySelectorAll(".glass-item"));
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
      current >= goal ? "Đã đạt mục tiêu" : "Thêm 250 ml";
  }

  addWaterBtn.addEventListener("click", () => {
    current = Math.min(goal, current + 250);
    writeStorage(STORAGE_KEYS.WATER, current);
    refreshWaterUI();
  });

  refreshWaterUI();
}

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
        
        // 🎨 đổi màu (giống style nghỉ ngơi nhưng tone xanh dương)
        backgroundColor: [
          "#60a5fa",
          "#3b82f6",
          "#93c5fd",
          "#2563eb",
          "#60a5fa",
          "#1d4ed8",
          "#93c5fd"
        ],
        
        borderRadius: 6,
        borderSkipped: false
      }
    ]
  };

  chartInstance = new Chart(ctx, {
    type: "bar", // 👈 giống "số lần nghỉ ngơi" (bar chart)
    data,
    options: {
      responsive: true,
      maintainAspectRatio: false,
      animation: false,

      plugins: {
        legend: { display: false }
      },

      scales: {
        x: {
          grid: { display: false }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: "#eef2ff"
          }
        }
      }
    }
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
  }
};

document.querySelectorAll(".period-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".period-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const period = btn.dataset.period;

    if (!window.chartInstance) return;

    const dataset = datasets[period];

    window.chartInstance.data.labels = dataset.labels;
    window.chartInstance.data.datasets[0].data = dataset.data;

    window.chartInstance.update();
  });
});


/*
function initStatisticsPage() {
  const chartCanvas = document.getElementById("workChart");
  const periodButtons = document.querySelectorAll(".period-btn");
  if (!chartCanvas || typeof Chart === "undefined") return;

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

  const chart = new Chart(chartCanvas.getContext("2d"), {
    type: "line",
    data: {
      labels: datasets.week.labels,
      datasets: [
        {
          label: "Giờ làm việc",
          data: datasets.week.data,
          backgroundColor: "rgba(59, 130, 246, 0.18)",
          borderColor: "#2563EB",
          borderWidth: 3,
          tension: 0.3,
          pointRadius: 4,
          pointBackgroundColor: "#2563EB",
          fill: true,
        },
      ],
    },
    
    
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "#64748B" },
        },
        y: {
          beginAtZero: true,
          ticks: { color: "#64748B" },
          grid: { color: "rgba(226, 232, 240, 0.6)" },
        },
      },
      plugins: {
        legend: { display: false },
        tooltip: {
          backgroundColor: "#111827",
          titleColor: "#fff",
          bodyColor: "#fff",
        },
      },
    },
  });

  periodButtons.forEach((button) => {
    button.addEventListener("click", () => {
      document
        .querySelectorAll(".period-btn")
        .forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");
      const period = button.dataset.period || "week";
      const dataset = datasets[period] || datasets.week;
      chart.data.labels = dataset.labels;
      chart.data.datasets[0].data = dataset.data;
      chart.update();
    });
  });
}*/

function initSettingsPage() {
  const darkToggle = document.getElementById("darkModeToggle");
  if (!darkToggle) return;
  darkToggle.addEventListener("click", toggleTheme);
}

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
      ? "Chỉnh sửa hồ sơ"
      : "Đóng";
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
  });

  loadProfile();
}

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
      window.location.href = "exercise-detail.html";
    });
  });

  filterCards();
}

function initExerciseDetailPage() {
  const nextBtn = document.getElementById("nextStepBtn");
  const progress = document.getElementById("exerciseProgress");
  const steps = Array.from(document.querySelectorAll(".step-row"));
  if (!nextBtn || !progress || !steps.length) return;

  let currentStep = 0;

  function refreshSteps() {
    steps.forEach((step, index) => {
      const circle = step.querySelector(".step-num");
      if (circle) {
        circle.style.background =
          index === currentStep
            ? "var(--blue)"
            : index < currentStep
              ? "#2563EB"
              : "#E2E8F0";
        circle.style.color = index <= currentStep ? "#fff" : "var(--text)";
      }
      step.style.opacity = index <= currentStep ? "1" : "0.55";
    });

    progress.innerHTML = `<span class="progress-label">Bước ${currentStep + 1}/${steps.length}</span>`;
    nextBtn.textContent =
      currentStep >= steps.length - 1 ? "Hoàn tất" : "Tiếp theo";
  }

  function showConfetti() {
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.inset = "0";
    container.style.pointerEvents = "none";
    container.style.zIndex = "9999";

    const colors = ["#2563EB", "#16A34A", "#F59E0B", "#EF4444", "#8B5CF6"];
    for (let i = 0; i < 30; i += 1) {
      const piece = document.createElement("div");
      piece.style.position = "absolute";
      piece.style.width = "10px";
      piece.style.height = "10px";
      piece.style.background =
        colors[Math.floor(Math.random() * colors.length)];
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.top = "-10px";
      piece.style.opacity = "0.95";
      piece.style.borderRadius = "50%";
      piece.style.transform = `translateX(${Math.random() * 40 - 20}px)`;
      piece.style.animation = `confetti-fall 1.2s ease-out ${Math.random() * 0.4}s forwards`;
      container.appendChild(piece);
    }

    const style = document.createElement("style");
    style.textContent = `@keyframes confetti-fall {to {transform: translateY(120vh) rotate(720deg); opacity: 0;}}`;
    document.body.appendChild(style);
    document.body.appendChild(container);

    setTimeout(() => {
      container.remove();
      style.remove();
    }, 1800);
  }

  nextBtn.addEventListener("click", () => {
    if (currentStep >= steps.length - 1) {
      showConfetti();
      nextBtn.disabled = true;
      nextBtn.textContent = "Đã hoàn thành";
      return;
    }

    currentStep += 1;
    refreshSteps();
  });

  refreshSteps();
}

function initScene() {
  loadTheme();
  bindNavigation();

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
}

window.addEventListener("DOMContentLoaded", () => {
  requestAnimationFrame(() => document.body.classList.add("ready"));
  initScene();
});
