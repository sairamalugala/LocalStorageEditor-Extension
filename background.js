chrome.runtime.onMessage.addListener(function (request, response, sendResponse) {
    if (request.todo == 'inform') {
        chrome.runtime.sendMessage({
            todo: 'informed'
        });
    }
});