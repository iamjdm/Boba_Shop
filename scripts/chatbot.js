const CHAT_API_URL = window.CHAT_API_URL || "/api/chat";

function toggleChat() {
	const chatWindow = document.getElementById("chat-window");
	if (chatWindow) {
		chatWindow.classList.toggle("hidden");
	}
}

function addMessage(text, sender) {
	const messages = document.getElementById("chat-messages");
	if (!messages) return null;

	const messageDiv = document.createElement("div");
	messageDiv.className = sender === "user" ? "user-message" : "bot-message";
	messageDiv.textContent = text;
	messages.appendChild(messageDiv);
	messages.scrollTop = messages.scrollHeight;
	return messageDiv;
}

function wait(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendMessage() {
	const input = document.getElementById("chatInput");
	if (!input) return;

	const message = input.value.trim();
	if (!message) return;

	addMessage(message, "user");
	input.value = "";

	const thinkingMessage = addMessage("Thinking...", "bot");

	try {
		const response = await fetch(CHAT_API_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				message: message
			})
		});

		const data = await response.json();

		await wait(1000);

		if (thinkingMessage) {
			thinkingMessage.textContent =
				data.reply || "Sorry, I couldn't answer that right now.";
		}
	} catch (error) {
		await wait(1000);

		if (thinkingMessage) {
			thinkingMessage.textContent = "Error connecting to Flask backend.";
		}

		console.error(error);
	}
}

document.addEventListener("DOMContentLoaded", function () {
	const input = document.getElementById("chatInput");
	if (input) {
		input.addEventListener("keydown", function (event) {
			if (event.key === "Enter") {
				sendMessage();
			}
		});
	}
});