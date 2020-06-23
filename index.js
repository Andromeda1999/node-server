
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
console.log("listening 3000")

// const path = "C:/Users/51988/Desktop/TRANSFORMER/NICK/FOTOS INGRESANTES ETAPA-II/EDUCACIÓN PRIMARIA/"


let keys = [
    "UE2JeLsEHS2S5U3R8xo5HGHe",
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
            'X-Api-Key': 'UE2JeLsEHS2S5U3R8xo5HGHe'
        },
        encoding: null
    }, function (error, response, body) {
        if (error) return console.error('Request failed:', error);
        if (response.statusCode != 200) {
            return console.error('Error:', response.statusCode, body.toString('utf8'));
        }
        fs.writeFileSync(`${params}`, body)


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
                    kernel: sharp.kernel.nearest,
                    fit: 'fill',

                })
                .toBuffer().then(data => {
                    fs.writeFileSync(`${path3}${iterator}`, data)
                    // console.log("changes dep", changedpi.changeDpiDataUrl)
                    apiPeticion(`${path3}${iterator}`)
                });
        })
    )
}

