(function () {
    let data = JSON.parse(sessionStorage.getItem("short"))

    document.querySelector("h3").textContent = "URL: " + data.title

    let table = document.querySelector("#urlStats")

    let rows = table.querySelectorAll("tr")

    rows.forEach(el => {
        let type = el.getAttribute('type')
        let name = el.getAttribute('name')
        let prop = (el.getAttribute('prop')) ? el.getAttribute('prop') : name
        let value
        switch (type) {
            case "link":
                value = document.createElement('a')
                value.href = data[prop]
                value.textContent = data[prop]
                break;

            default:
                value = document.createElement('p')
                value.textContent = data[prop]
                break;
        }

        el.appendChild(document.createElement('th')).textContent = name + ": "
        el.appendChild(document.createElement('th')).appendChild(value)
    });
})()