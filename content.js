chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    if (request.todo == 'requestLocalStorage') {
        if (localStorage.length) {
            chrome.storage.sync.set({
                'local_storage': JSON.stringify(localStorage)
            }, function () {
                var error = chrome.runtime.lastError;
                if (error) {
                    return alert("unable to fetch data");
                }
                chrome.runtime.sendMessage({
                    todo: "inform"
                });
            })
        }
    }

    if (request.todo == 'updateLocalStorage') {
        chrome.storage.sync.get('local_storage', function (data) {
            let local_storage = data.local_storage;
            try {
                localStorage.clear();
                for (let key in local_storage) {
                    localStorage.setItem(key, local_storage[key]);
                }
            } catch (e) {
                alert('error')
            }
        });
    }
});