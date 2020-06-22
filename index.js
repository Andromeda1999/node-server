
let app = require('express')();
var request = require('request');
var fs = require('fs')
const sharp = require('sharp');
const { query } = require('express');


let path2 = ""
var dir = 'salida/';
let path3 = ''
//server
var http = require('http').createServer(webServer),
    form = require('fs').readFileSync('index.html'),
    querystring = require('querystring'),
    util = require('util'),
    dataString = ''

function webServer(req, res) {
    if (req.method == 'GET') {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(form)
    }

    if (req.method == 'POST') {
        req.on('data', function (data) {
            dataString += data
        }).on("end", function () {
            var templateString = querystring.parse(dataString)
            // res.end(JSON.stringify(templateString))
            try {
                path2 = templateString.into + "/"

                fs.readdir(path2, function (err, archivos) {
                    if (err) {
                        onError(err);
                        return;
                    }
                    arrayImage = archivos
                    console.log("dev archivos", archivos)


                    if (!fs.existsSync(path2 + dir)) {
                        fs.mkdirSync(path2 + dir);
                    }
                    path3 = path2 + dir
                    // console.log(archivos);
                    transformImage(archivos)
                    // test(archivos)
                });
            } catch (error) {
                console.error("ocurred an error", error)
            }

        })
    }
}

http.listen(3000)

// const path = "C:/Users/51988/Desktop/TRANSFORMER/NICK/FOTOS INGRESANTES ETAPA-II/EDUCACIÓN PRIMARIA/"


let keys = [
    "q52uKr1KrwfXgB3168wj2n9D",
    "16ZoFmttd9iEMCY5cPPo9XEW",
    "nzWRFuEowU99Fkf5mp2z3d44",
    "6mwwesVVdggVS7S8vUn6gE55",
    "Ydwm9JnBQZP9pxJXqgMvG2TK",
    "VrzLYHkec9EQ1CFVjvwimdF3",
    "iH489EMz9kASeD2bSqHPgn6t",
    "i3ifrViXm1MkMu2c6kcU76Yu",
    "MtbByFNyBaezx6fMt81RrcJA",
    "91XM57FttHDmcGMmQ4U5He5z",
    "SS63Vw2cytT1WUyU24gd8TJA",
    "yBpx8WqC8g4QpeiZWfu5cKCy",
    "2vQrqa6LwzKYydLjoYRZtr5Q",
    "4vzasrp7M81K5UDmvHggCACf",
    "Auyu2aottcECFzkZh1LihUKj",
    "QvpVqjrwvFeWNEoiGs8Q1mhs",
    "JFbHs19MrRUBgnWe3NAcPtxi",
    "CJaVU7pYmQ3Q8WTR4R1JZqhL",
    "ZhiVhqR4oGmkdy7hitem1Arp",
    "pWGMThB5dNDNXc226zYwkw5b",
    "uTwzgSnZoVZiYsnZsxKqL1z5",
    "SGd7U5Z2wjCQuosTdwhZq87o",
]
let keyValid = keys[0]




async function apiPeticion(params) {

    await request.post({
        url: 'https://api.remove.bg/v1.0/removebg',
        formData: {
            // image_file: fs.createReadStream(path2 + iterator),
            image_file: fs.createReadStream(params),
            size: 'auto',
            bg_color: 'white',
        },
        headers: {
            'X-Api-Key': keyValid
        },
        encoding: null
    }, function (error, response, body) {
        // if (error) return console.error('Request failed:', error);
        if (response.statusCode != 200) {

            let index = keys.findIndex(
                (item) => item == keyValid
            );
            keys.splice(index, 1)
            if (!(keys.length > 0)) {
                console.error("no quedan keys")
                return
            }
            keyValid = keys[0]
            apiPeticion(params)
            // return console.error('Error:', response.statusCode, body.toString('utf8'));
        } else {
            console.log("dev params", params)
            fs.writeFileSync(`${params}`, body)
        }

    })
}
async function transformImage(archivos) {
    Promise.all(
        archivos.map(async iterator => {
            sharp(path2 + iterator, {
                density: 2400,
            })
                .rotate()
                .resize({
                    height: 288, width: 240,
                    position: 'center',

                })
                .toBuffer().then(data => {
                    fs.writeFileSync(`${path3}${iterator}`, data)
                    // console.log("changes dep", changedpi.changeDpiDataUrl)
                    apiPeticion(`${path3}${iterator}`)
                });
        })
    )
}

