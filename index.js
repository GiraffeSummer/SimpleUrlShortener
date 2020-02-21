const express = require('express')
const bodyParser = require('body-parser')
const fs = require('fs')
const app = express()
const port = 4900

let path = "./urls.json"
let urls = []

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static('public', {
    extensions: ['html']
}));

app.use(bodyParser.json())


app.get('/:id/:path', (req, res) => {
    let conPath = {
        id: "",
        path: ""
    }
    let con = req.originalUrl
    if (con.length > 1) {
        con = con.split("/")
        con.shift()
        conPath.id = con[0]
        conPath.path = con[1]

        let ur = urls.find((o) => {
            return (o.id === conPath.id && o.path === conPath.path)
        })

        if (!ur) {
            res.setHeader('Content-Type', 'application/json')
            res.send({ status: 404, reason: "not found, limit was possibly reached" })
            return
        }

        let index = urls.indexOf(ur)
        ur.clicks += 1
        console.log(`${ur.title}: Was clicked(${ur.clicks}/${ur.limit}): ${ur.id}/${ur.path}`)

        if (ur.clicks >= ur.limit && !ur.unlimited) {
            console.log("Limit Reached")
            urls.splice(index, 1)
        }
        else
            urls[index] = ur

        res.redirect(ur.url)
    }
})

app.get("/stats/:id/:path", (req, res) => {
    let conPath = {
        id: "",
        path: ""
    }
    let con = req.originalUrl
    if (con.length > 1) {
        con = con.split("/")
        con.splice(0, 2)
        conPath.id = con[0]
        conPath.path = con[1]

        let ur = urls.find((o) => {
            return (o.id === conPath.id && o.path === conPath.path)
        })

        if (!ur) {
            notFound()
            return
        }

        res.setHeader('Content-Type', 'application/json')
        res.send(ur)
    } else notFound()

    function notFound() {
        res.setHeader('Content-Type', 'application/json')
        res.send({ status: 404, reason: "not found, limit was possibly reached" })
    }
})

app.post('/', (req, res) => {
    let postUrl = req.body
    postUrl.origin = req.headers.host

    let shorturl = CreateShortUrl(postUrl)

    res.setHeader('Content-Type', 'application/json')
    res.send(shorturl)
})

app.get("/create", (req, res) => {
    let postUrl = req.query

    postUrl.origin = req.headers.host
    let shorturl = CreateShortUrl(postUrl)

    res.setHeader('Content-Type', 'application/json')
    res.send(shorturl)
})

app.listen(port, () => {
    if (!fs.existsSync(path))
        fs.writeFileSync(path, "[]")

    urls = LoadJson(path)
    console.log(`url shortner app listening on port ${port}!`)

    setInterval(() => {
        SaveJson(urls, path)
    }, 10000)
})


function CreateShortUrl(postUrl) {
    postUrl.title = (postUrl.title) ? postUrl.title : ""

    let shorturl = {
        title: postUrl.title,
        id: makeid(2),
        path: makeid(10),
        url: postUrl.url,
        shorturl: "",
        stats: "",
        clicks: 0,
        limit: (postUrl.limit) ? Math.min(Math.max(postUrl.limit, 1), 10000) : 10,
        unlimited: false
    }
    shorturl.shorturl = `http://${postUrl.origin}/${shorturl.id}/${shorturl.path}`
    shorturl.stats = `http://${postUrl.origin}/stats/${shorturl.id}/${shorturl.path}`

    urls.push(shorturl)
    SaveJson(urls, path)
    return shorturl;
}


function makeid(am = 20) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < am; i++)
        text += possible.charAt(RandomNum(possible.length - 1));

    return text;
}

function RandomNum(max) {
    let res;
    let min = 0;
    res = Math.floor(Math.random() * (max - min + 1)) + min;
    return res;
}

function SaveJson(json, location) {
    let data = JSON.stringify(json, null, 4);
    fs.writeFileSync(location, data);
}

function LoadJson(location) {
    let rawdata;
    rawdata = fs.readFileSync(location);
    let loadData = JSON.parse(rawdata);
    return loadData;
}