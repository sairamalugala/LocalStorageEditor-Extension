let table = document.getElementById('table');

function fetchData() {
    chrome.tabs.query({
        currentWindow: true,
        active: true
    }, function (tabs) {
        var activeTab = tabs[0];
        chrome.tabs.sendMessage(activeTab.id, {
            todo: "requestLocalStorage"
        });
    });
}
fetchData();
//document.getElementById('update').addEventListener('click', fetchData)
chrome.runtime.onMessage.addListener(function (request, response, responseResponse) {
    if (request.todo == 'informed') {
        chrome.storage.sync.get('local_storage', function (data) {
            let local_storage = data.local_storage;
            if (local_storage) {
                let str = "";
                local_storage = JSON.parse(local_storage);
                for (let key in local_storage) {
                    str += addRow(key, local_storage[key])
                }
                document.getElementById('tbody').innerHTML = `${str}`;
            }
        })
    }
});

document.getElementById('add').addEventListener('click', function () {
    table.insertRow();
    let rows = table.rows;
    rows[rows.length - 1].innerHTML = '<tr><td><input type="text" data-attr="key" class="form-control" placeholder="key..."></td><td><input type="text" class="form-control" placeholder="value..." data-attr="val"></td><td><span class="btn btn-danger" title="remove..">X</span></td></tr>';
    let dataEmpty = table.querySelector('[data-attr=empty]');
    if (dataEmpty) {
        dataEmpty.remove();
    }
});

document.getElementById('update').addEventListener('click', function () {
    let dataEmpty = table.querySelector('[data-attr=empty]');
    if (dataEmpty) {
        return;
    }

    let localStorageStr = {}
    table.querySelectorAll('tbody>tr').forEach(row => {
        let keyInput = row.querySelector('[data-attr=key]'),
            key = keyInput.value.trim();
        if (key) {
            // tobe continued
            let valInput = row.querySelector('[data-attr=val]'),
                val = valInput.value.trim();
            localStorageStr[key] = val;
        }
    });
    console.log(localStorageStr);
    if (!localStorageStr) {
        return;
    }
    chrome.storage.sync.set({
        'local_storage': localStorageStr
    }, function () {
        window.close();
        chrome.tabs.query({
            currentWindow: true,
            active: true
        }, function (tabs) {
            var activeTab = tabs[0];
            chrome.tabs.sendMessage(activeTab.id, {
                todo: "updateLocalStorage"
            });
        });
    })
});

document.addEventListener("click", function (e) {
    let clickedElement = e.target;
    if (clickedElement.classList.contains("btn-danger")) {
        clickedElement.closest('tr').remove();
    }
})

function addRow(key, value) {
    return `<tr><td><input type="text" class="form-control" value='${key}' data-attr="key" placeholder="key..."></td><td><input type="text" class="form-control" value='${value}' placeholder="value..." data-attr="val"></td><td><span class="btn btn-danger" title="remove..">X</span></td></tr>`;
}
