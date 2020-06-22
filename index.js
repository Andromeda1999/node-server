
let app = require('express')();
let http = require('http').Server(app);
var request = require('request');
var fs = require('fs')
const sharp = require('sharp');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
});

http.listen(3000, () => {
    console.log('Listening on port *: 3000');
});

app.post('/myaction', function (req, res) {
    // res.send('You sent the name "' + req.body + '".');
    console.log("dev respuesta", { req, res })

});

// const path = "C:/Users/51988/Desktop/TRANSFORMER/NICK/FOTOS INGRESANTES ETAPA-II/EDUCACIÓN PRIMARIA/"
const path2 = "D:/FOTOS-INGRESANTES 2020/fotos Ingresantes  2020 Filial San Lorenzo/"
var dir = 'salida';
fs.mkdirSync(dir);
if (!fs.existsSync(dir)) {
    fs.mkdirSync(path2 + dir);
}
const path3 = path2 + dir

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
fs.readdir(path2, function (err, archivos) {
    if (err) {
        onError(err);
        return;
    }
    arrayImage = archivos
    // console.log(archivos);
    transformImage(archivos)
    // test(archivos)
});



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

