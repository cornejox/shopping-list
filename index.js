/* -------------- FORMA SINCRÓNA --------------*/

/* Requerimos el módulo fs */
const fs = require('fs');
const http = require('http');
const url  = require('url');

const replaceTemplate = require('./modules/replaceTemplate')

const slugify = require('slugify');

///////////// FILES /////////////

// /* Leemos el archivo de manera sincróna */
// const textIn = fs.readFileSync('./txt/input.txt', 'utf8');

// /* Mostramos el archivo */
// console.log(textIn)

// /* Le mandamos un poco de texto */
// const textOut = `Esto es lo que sabemos del aguacate ${textIn}.`;

// /* Generamos un nuevo archivo de texto */
// fs.writeFileSync('./txt/output.txt', textOut);

// console.log('File written!');

/* -------------- FORMA ASINCRÓNA --------------*/

// fs.readFile('./txt/start.txt', 'utf8' , (err, data1) => {
//     if(err){return console.log("Error!...")}
//     fs.readFile(`./txt/${data1}.txt`, 'utf8' , (err, data2) => {
//         console.log("data 2: ", data2);
//         fs.readFile(`./txt/append.txt`, 'utf8' , (err, data3) => {
//             console.log("data 3: ", data3);
//         })
//         /* escribimos un mensaje */
//         fs.writeFile('./txt/final.txt', `ESCRITO: ${data2}` ,'utf-8', (err) => {
//             console.log("Su mensaje ha sido escrito! ")
//         })
//     })
// });

// console.log('Se leerá el archivo...')

/* -------------- SERVER --------------*/

/* Vamos a leer los templates */
const tempOverview = fs.readFileSync (`${__dirname}/templates/template-overview.html`, 'utf8');
const tempCard = fs.readFileSync (`${__dirname}/templates/template-card.html`, 'utf8');
const tempProduct = fs.readFileSync (`${__dirname}/templates/template-product.html`, 'utf8');

/* Aquí se lee el API */
const data = fs.readFileSync (`${__dirname}/dev-data/data.json`);
const dataObj = JSON.parse(data);

/* Cambio nombre del id en router */
const slugs = dataObj.map(el => slugify(el.productName, { lower: true })); 
console.log(slugs);
 
/* SE CREA EL SERVIDOR */
const server = http.createServer((req, res) => {

    const {query, pathname } = url.parse(req.url, true);

    /* OVERVIEW PAGE */
    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {
            'Content-Type': 'text/html'
        });

        const cardsHTML = dataObj.map(el => replaceTemplate(tempCard, el)).join('');
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHTML); 
        res.end(output);

        /* PRODUCT PAGE */
    } else if(pathname === '/product'){

        const product = dataObj[query.id]
        const output = replaceTemplate(tempProduct, product)

        res.end(output);

        /* API */
    } else if(pathname === '/api'){
        res.writeHead(200, {
            'Content-Type': 'application/json'
        });
        res.end(data);
    }

    /* NOT FOUND */ 
    else {
        res.writeHead(404, {
            'Content-Type': 'text/html',
            'my-own-header': 'Hello world'
        });
        res.end('<h1>Page not found</h1>');
    }
});

server.listen(8100, '127.0.0.1', () => {
    console.log('----------------Listening on port 8100----------------');
});
