const button = document.createElement("button");
button.id = "finkBtn";
button.textContent = "🎙️";
document.body.appendChild(button);

let activeElement;
button.addEventListener("mousedown", (event) => {
    activeElement = document.activeElement;
});

button.addEventListener("click", (e) => {
    if (activeElement) {
        activeElement.focus();
    }
    toggleRecognition();
});


if (!window.recognition) {
    const customSpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition || window.mozSpeechRecognition || window.msSpeechRecognition || window.oSpeechRecognition;

    window.recognition = new customSpeechRecognition();
}
recognition.lang = 'tr-TR';
//recognition.interimResults = true;
//recognition.maxAlternatives = 1;
//recognition.continuous = true;
recognition.manualStop = true;
// toggleRecognition();

recognition.transcript = "";

toggleRecognition();
const commandLine = [
    {task: "youtube", command: null},
    {task: "google", command: commandGoogle},
];
recognition.onresult = (event) => {
    console.log("onresult");
    const transcript = event.results[event.results.length - 1][0].transcript;
    recognition.transcript = transcript;

    if (event.results[event.results.length - 1].isFinal) {
        console.log("last transcript;", transcript);
    }


    commandLine.filter(row => {
        if (transcript.toLowerCase().includes(row.task)) {
            console.log("command detected...", row.task);
            row.command();
        }
    })


};


recognition.audioend = () => {
};
recognition.onspeechend = function () {
};
recognition.onerror = function (e) {
    console.log("recognition.onerror");
    recognition.stop();
}
recognition.onend = function () {
    console.log("recognition.onend");
    recognition.start();

}
chrome.runtime.onMessage.addListener((request) => {
    if (request.command === "stopRecognition") {
        stopRecognition();
    }
});

function stopRecognition() {
    console.log("stopRecognition", stopRecognition);
    recognition.manualStop = true;
    recognition.stop();
    button.style.background = "#000";
}

function toggleRecognition() {
    console.log("toggleRecognition");

    if (!recognition.manualStop) {
        stopRecognition();
    } else {
        recognition.manualStop = false;
        setTimeout(function () {
            recognition.start();
        }, 400);
        button.style.background = "#f00";
    }
}


function commandGoogle() {
    window.location.href = "http://google.com";

}
