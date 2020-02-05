function SubmitUrl() {
    let form = document.querySelector("#shortenUrl")
    let formdata = GetFormData(form);

    Post(formdata, "/").then(data => {
        if (data.stats) {
            sessionStorage.setItem('short', JSON.stringify(data))
            //window.location.href = (data.stats)
            window.location = `/geturl${"?"}url=${data.id}/${data.path}`
        }
        else
            alert("unsuccesful")
    })
}

function GetFormData(form) {
    let obj = {}
    for (let i = 0; i < form.elements.length; i++) {
        var e = form.elements[i];
        e.name = e.name.replace(/\s/g, '_')
        obj[e.name] = e.value;
        //obj[encodeURIComponent(e.name)] = encodeURIComponent(e.value);
    }
    delete obj[""]
    return obj;
}

function Post(data, url) {
    return new Promise(function (resolve, error) {
        var xhr = new XMLHttpRequest();
        xhr.open('POST', url, true);
        xhr.setRequestHeader("Content-Type", "application/json");
        xhr.send(JSON.stringify(data));

        xhr.onreadystatechange = back;
        function back(e) {
            if (xhr.readyState == 4 && xhr.status == 200) {
                resolve(JSON.parse(xhr.responseText));
            }
        }
    })
}
function getUrlParams() {
    let vars = {};
    let parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });
    return vars;
}
function GetURL(url, json = true) {
    return new Promise(function (resolve) {
        let xmlHttp = new XMLHttpRequest();
        xmlHttp.open("GET", url, false); // false for synchronous request
        xmlHttp.send(null);
        if (json)
            resolve(JSON.parse(xmlHttp.responseText))
        else
            resolve(xmlHttp.responseText);
    })
}