const chatBox = document.getElementById('chat-box');
const userInput = document.getElementById('user-input');
const sendBtn = document.getElementById('send-btn');
const micBtn = document.getElementById('mic-btn');
const langSelect = document.getElementById('lang-select');
const attachBtn = document.getElementById('attach-btn');
const fileUpload = document.getElementById('file-upload');

const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000'
    : 'http://10.0.2.2:8000'; // Fallback for android emulator

// Set up Speech Recognition (Web Speech API)
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition = null;
let isRecording = false;

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = function() {
        isRecording = true;
        micBtn.classList.add('recording');
        userInput.placeholder = "Listening...";
    };

    recognition.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        userInput.value = transcript;
        sendMessage();
    };

    recognition.onerror = function(event) {
        console.error("Speech recognition error", event.error);
        stopRecording();
    };

    recognition.onend = function() {
        stopRecording();
    };
} else {
    micBtn.style.display = 'none';
    console.warn("Speech Recognition not supported in this browser.");
}

function stopRecording() {
    isRecording = false;
    micBtn.classList.remove('recording');
    userInput.placeholder = "Type, speak, or attach a legal document...";
}

micBtn.addEventListener('click', () => {
    if (!recognition) return;

    if (isRecording) {
        recognition.stop();
    } else {
        recognition.lang = langSelect.value;
        recognition.start();
    }
});

// Attach Button Handler
attachBtn.addEventListener('click', () => {
    fileUpload.click();
});

fileUpload.addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    appendMessage(`Uploading attachment: ${file.name}...`, 'system');

    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await fetch(`${API_BASE_URL}/api/upload`, {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const errData = await response.json();
            throw new Error(errData.detail || "Upload failed");
        }

        const data = await response.json();
        appendMessage(`System: ${data.message}`, 'system');

    } catch (error) {
        console.error("Upload error:", error);
        appendMessage(`System Error: Failed to upload file. ${error.message}`, 'system');
    } finally {
        // Reset file input
        fileUpload.value = '';
    }
});


// Text to Speech (Web Speech API)
function speak(text) {
    if (!('speechSynthesis' in window)) return;

    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langSelect.value;
    window.speechSynthesis.speak(utterance);
}

// UI Functions
function appendMessage(text, sender) {
    const wrapperDiv = document.createElement("div");
    wrapperDiv.classList.add("message-wrapper", sender);

    if (sender !== "system") {
        const avatarDiv = document.createElement("div");
        avatarDiv.classList.add("avatar");
        avatarDiv.innerHTML = sender === "user" ? "<i class=\"fas fa-user\"></i>" : "<i class=\"fas fa-robot\"></i>";
        wrapperDiv.appendChild(avatarDiv);
    }

    const msgDiv = document.createElement('div');
    msgDiv.classList.add('message');

    if (sender === 'user') {
        msgDiv.classList.add('user-message');
    } else if (sender === 'system') {
        msgDiv.classList.add('system-message');
    } else {
        msgDiv.classList.add('ai-message');
    }

    msgDiv.textContent = text;
    wrapperDiv.appendChild(msgDiv);
    chatBox.appendChild(wrapperDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    // Stop recording if active
    if (isRecording && recognition) {
        recognition.stop();
    }

    // Add user message to UI
    appendMessage(text, 'user');
    userInput.value = '';

    // Add loading indicator
    const loadingWrapper = document.createElement("div");
    loadingWrapper.classList.add("message-wrapper", "ai");
    loadingWrapper.innerHTML = `<div class="avatar"><i class="fas fa-robot"></i></div><div class="message ai-message">Analyzing legal documents...</div>`;


    chatBox.appendChild(loadingWrapper);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const response = await fetch(`${API_BASE_URL}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: text })
        });

        chatBox.removeChild(loadingWrapper);

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const data = await response.json();
        appendMessage(data.reply, 'ai');

        // Speak the response
        speak(data.reply);

    } catch (error) {
        console.error("Error communicating with AI:", error);
        chatBox.removeChild(loadingWrapper);
        appendMessage("Sorry, I am having trouble connecting to my database right now. Please try again later.", 'ai');
    }
}

sendBtn.addEventListener('click', sendMessage);

userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});
