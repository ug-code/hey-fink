async function stopRecognition() {
    const [activeTab] = await chrome.tabs.query({active: true, currentWindow: true});
    chrome.tabs.sendMessage(activeTab.id, {command: "stopRecognition"});
    chrome.scripting.executeScript({
        target: {tabId: activeTab.id},
        function: function () {
            console.log("background function run");
        }
    });
}

chrome.action.onClicked.addListener(() => {
    stopRecognition().then();
});

chrome.commands.onCommand.addListener((command) => {
    if (command === "toggle_speech_to_text") {
        stopRecognition().then();
    }
});
