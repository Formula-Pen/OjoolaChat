// OjoolaChat - Main JavaScript

const chatArea = document.querySelector(".chat-area");
const messageInput = document.querySelector("#messageInput");
const sendButton = document.querySelector("#sendButton");

// Send a message
function sendMessage() {
    const message = messageInput.value.trim();

    if (message === "") {
        return;
    }

    const messageElement = document.createElement("div");

    messageElement.textContent = message;

    messageElement.style.background = "#dcf8c6";
    messageElement.style.padding = "10px 15px";
    messageElement.style.margin = "10px 0";
    messageElement.style.borderRadius = "12px";
    messageElement.style.maxWidth = "80%";
    messageElement.style.marginLeft = "auto";
    messageElement.style.overflowWrap = "anywhere";

    chatArea.appendChild(message
