document.body.classList.add("ready");

const sendBtn = document.getElementById("sendBtn");
const input = document.getElementById("userInput");
const chatBox = document.getElementById("chatBox");

// Database câu trả lời thông minh
const answers = {
  cổ: "🤔 **Đau cổ do ngồi sai tư thế**\n\nBạn nên thực hiện bài tập giãn cơ cổ ngay:\n1️⃣ Ngồi thẳng, thả lỏng vai\n2️⃣ Nghiêng đầu sang phải, giữ 15 giây\n3️⃣ Nghiêng sang trái, giữ 15 giây\n4️⃣ Lặp lại 5 lần mỗi bên\n\n📌 Mẹo: Điều chỉnh màn hình ngang tầm mắt để tránh tái phát.",

  mắt: "👁️ **Mỏi mắt do nhìn màn hình quá lâu**\n\nHãy áp dụng quy tắc **20-20-20**:\n• Cứ 20 phút, nhìn xa 20 feet (6m) trong 20 giây\n\nBài tập thư giãn mắt:\n1️⃣ Chớp mắt nhanh 10 lần\n2️⃣ Massage nhẹ vùng quanh mắt\n3️⃣ Nhìn xa ra cửa sổ\n\n💡 Nhỏ mắt nhân tạo nếu mắt bị khô.",

  lưng: "🦴 **Đau lưng - Vấn đề phổ biến của dân văn phòng**\n\nBạn nên đứng dậy và thực hiện:\n1️⃣ Đứng thẳng, hai tay chống hông\n2️⃣ Nhẹ nhàng đẩy hông về phía trước\n3️⃣ Ngửa người ra sau, giữ 10 giây\n4️⃣ Cúi gập người, tay chạm mũi chân\n\n⚠️ Nếu đau kéo dài, hãy gặp bác sĩ chuyên khoa.",

  vai: "🔁 **Mỏi vai do căng cơ**\n\nBài tập giãn vai đơn giản:\n1️⃣ Xoay vai tròn 10 lần mỗi chiều\n2️⃣ Đưa tay phải sang trái, dùng tay trái kéo nhẹ\n3️⃣ Giữ 15 giây, đổi bên\n4️⃣ Lặp lại 3 lần\n\n💪 Kết hợp hít thở sâu để thư giãn.",

  nước: "💧 **Nhắc nhở uống nước**\n\nBạn nên uống thêm **250ml** nước ngay bây giờ!\n\n📊 Lợi ích của uống đủ nước:\n• Tăng tập trung 25%\n• Giảm đau đầu\n• Cải thiện làn da\n• Hỗ trợ tiêu hóa\n\n🎯 Mục tiêu hôm nay: 2.5 lít",

  "căng thẳng":
    "😰 **Giảm căng thẳng tại chỗ**\n\nKỹ thuật thở 4-7-8:\n1️⃣ Hít vào **4 giây** qua mũi\n2️⃣ Giữ hơi **7 giây**\n3️⃣ Thở ra từ từ **8 giây** qua miệng\n4️⃣ Lặp lại 5 lần\n\n🧘 Kết hợp với nhạc thư giãn và đứng dậy đi lại.",

  stress:
    "😰 **Giảm căng thẳng tại chỗ**\n\nKỹ thuật thở 4-7-8:\n1️⃣ Hít vào **4 giây** qua mũi\n2️⃣ Giữ hơi **7 giây**\n3️⃣ Thở ra từ từ **8 giây** qua miệng\n4️⃣ Lặp lại 5 lần\n\n🧘 Kết hợp với nhạc thư giãn và đứng dậy đi lại.",

  ngồi: "🪑 **Ngồi lâu gây hại cho sức khỏe**\n\nHãy đứng dậy ngay và:\n1️⃣ Đi lại 2-3 phút\n2️⃣ Vươn vai, xoay người\n3️⃣ Duỗi chân, xoay cổ chân\n\n⏰ Đặt báo thức nhắc nhở đứng dậy mỗi 30 phút!\n\n📌 Mẹo: Sử dụng bàn đứng (standing desk) nếu có thể.",

  "cổ tay":
    "✋ **Đau cổ tay do gõ bàn phím nhiều**\n\nBài tập giãn cơ cổ tay:\n1️⃣ Duỗi thẳng tay, lòng bàn tay hướng lên\n2️⃣ Dùng tay kia kéo nhẹ các ngón xuống dưới\n3️⃣ Giữ 15 giây, đổi tay\n4️⃣ Xoay cổ tay 10 lần mỗi chiều\n\n💡 Sử dụng wrist rest để hỗ trợ.",

  chân: "🦵 **Mỏi chân do ngồi lâu**\n\nBài tập tại chỗ:\n1️⃣ Kiễng gót chân lên - hạ xuống 15 lần\n2️⃣ Xoay cổ chân 10 vòng mỗi chiều\n3️⃣ Duỗi thẳng chân, gập bàn chân 10 lần\n4️⃣ Đứng dậy và bước tại chỗ 1 phút",

  "mệt mỏi":
    "😴 **Mệt mỏi giữa giờ làm việc**\n\nCách nhanh chóng lấy lại năng lượng:\n1️⃣ Uống một cốc nước mát\n2️⃣ Hít thở sâu 5 lần\n3️⃣ Vận động nhẹ 2 phút (vươn vai, xoay cổ)\n4️⃣ Rửa mặt bằng nước lạnh\n5️⃣ Ăn nhẹ một ít trái cây",

  đầu: "🤕 **Đau đầu do căng thẳng hoặc mỏi mắt**\n\nGiải pháp tức thì:\n1️⃣ Massage nhẹ vùng thái dương\n2️⃣ Nhắm mắt thư giãn 5 phút\n3️⃣ Uống nước lọc\n4️⃣ Điều chỉnh độ sáng màn hình\n\n⚠️ Nếu đau đầu thường xuyên, nên khám bác sĩ.",

  hello:
    "👋 Chào bạn! Mình là AI Coach của WorkCare.\n\nMình có thể giúp gì cho bạn hôm nay?\n• 🤕 Đau cổ, vai, lưng\n• 👁️ Mỏi mắt\n• 😰 Căng thẳng\n• 💧 Nhắc uống nước\n• 🪑 Ngồi lâu\n\nHãy nhập câu hỏi hoặc chọn gợi ý bên dưới!",

  "xin chào":
    "👋 Chào bạn! Mình là AI Coach của WorkCare.\n\nMình có thể giúp gì cho bạn hôm nay?\n• 🤕 Đau cổ, vai, lưng\n• 👁️ Mỏi mắt\n• 😰 Căng thẳng\n• 💧 Nhắc uống nước\n• 🪑 Ngồi lâu\n\nHãy nhập câu hỏi hoặc chọn gợi ý bên dưới!",

  hi: '👋 Xin chào! Có vấn đề sức khỏe nào mình có thể giúp bạn không?\n\nVí dụ:\n• "Đau cổ quá"\n• "Mỏi mắt"\n• "Nhức lưng"\n• "Căng thẳng"',
};

function addMessage(text, type) {
  const div = document.createElement("div");
  div.className = "msg " + type;
  div.innerHTML = text.replace(/\n/g, "<br>");
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function showTyping() {
  const div = document.createElement("div");
  div.className = "msg ai typing";
  div.id = "typingIndicator";
  div.innerHTML = "<span></span><span></span><span></span>";
  chatBox.appendChild(div);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function hideTyping() {
  const el = document.getElementById("typingIndicator");
  if (el) el.remove();
}

function getAnswer(text) {
  const lower = text.toLowerCase();

  // Kiểm tra từng keyword
  for (const [key, answer] of Object.entries(answers)) {
    if (lower.includes(key)) {
      return answer;
    }
  }

  // Nếu không match keyword nào
  return `🤔 Cảm ơn bạn đã chia sẻ!\n\nMình là AI Coach của WorkCare, hiện tại mình có thể hỗ trợ các vấn đề:\n\n• 🤕 **Đau cổ** - Bài tập giãn cơ cổ\n• 👁️ **Mỏi mắt** - Quy tắc 20-20-20\n• 🦴 **Đau lưng** - Bài tập giãn cơ lưng\n• 🔁 **Mỏi vai** - Giãn cơ vai\n• 😰 **Căng thẳng** - Kỹ thuật thở\n• 💧 **Uống nước** - Nhắc nhở uống nước\n• 🪑 **Ngồi lâu** - Vận động\n\nBạn muốn mình giúp gì về các vấn đề trên? 😊`;
}

sendBtn.addEventListener("click", () => {
  const text = input.value.trim();
  if (!text) return;

  addMessage(text, "user");
  input.value = "";

  // Show typing indicator
  showTyping();

  // Simulate AI thinking
  setTimeout(
    () => {
      hideTyping();
      const answer = getAnswer(text);
      addMessage(answer, "ai");
    },
    800 + Math.random() * 600,
  );
});

input.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    sendBtn.click();
  }
});

// Click on suggestion buttons
document.querySelectorAll(".suggest").forEach((btn) => {
  btn.addEventListener("click", () => {
    input.value = btn.dataset.text || btn.textContent.trim();
    sendBtn.click();
  });
});
