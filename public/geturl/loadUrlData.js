(function () {

    let path = getUrlParams().url.split('/')

    GetURL(`/stats/${path[0]}/${path[1]}`).then(data => {

        if (data.status){
            NoUrlFound()
            return
        }

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
    })
})()

function NoUrlFound(){
    document.querySelector("h3").textContent = "Url not found"

    let btn = document.createElement('button')
    btn.addEventListener('click',()=>{
        window.location = "/"
    })
    btn.textContent = "Home"
    document.body.appendChild(btn)
}