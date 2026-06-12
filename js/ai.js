document.body.classList.add("ready");

const sendBtn = document.getElementById("sendBtn");

const input = document.getElementById("userInput");

const chatBox = document.getElementById("chatBox");

function addMessage(text,type){

    const div = document.createElement("div");

    div.className = "msg " + type;

    div.textContent = text;

    chatBox.appendChild(div);

    chatBox.scrollTop = chatBox.scrollHeight;
}

sendBtn.addEventListener("click",()=>{

    const text = input.value.trim();

    if(!text) return;

    addMessage(text,"user");

    let answer =
    "Bạn nên nghỉ ngơi khoảng 5 phút.";

    if(text.includes("cổ"))
        answer =
        "Bạn nên thực hiện bài tập giãn cổ trong 30 giây.";

    else if(text.includes("mắt"))
        answer =
        "Hãy áp dụng quy tắc 20-20-20 để thư giãn mắt.";

    else if(text.includes("lưng"))
        answer =
        "Bạn nên đứng dậy và kéo giãn cơ lưng.";

    else if(text.includes("nước"))
        answer =
        "Bạn nên uống thêm khoảng 250ml nước.";

    addMessage(answer,"ai");

    input.value = "";
});

input.addEventListener("keydown",(e)=>{

    if(e.key==="Enter"){
        sendBtn.click();
    }

});