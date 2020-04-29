const fs = require('fs');
const http = require('http');
const url = require ('url');


/////FILES 
 
// //Blocking, synchronous way
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn);
// const textOut = `This is what we know about avocado: ${textIn}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/otuput.txt', textOut);
// console.log('File Written');

//SERVER
const overview = fs.readFileSync('homePage.html', 'utf-8');
const tempCards = fs.readFileSync('template-card.html', 'utf-8');
const details = fs.readFileSync('detailsPage.html', 'utf-8');


const data = fs.readFileSync('store.json', 'utf-8');
const parsedData = JSON.parse(data)

function replaceTemplate(temp, data){
    let output = temp.replace(/{%PRODUCTNAME%}/g, data.productName)
    output = output.replace(/{%IMAGE%}/g, data.image)
    output = output.replace(/{%PRICE%}/g, data.price)
    output = output.replace(/{%NUTRIENTS%}/g, data.nutrients)
    output = output.replace(/{%QUANTITY%}/g, data.quantity)
    output = output.replace(/{%DESCRIPTION%}/g, data.description)
    output = output.replace(/{%ID%}/g, data.id)

    return output;

}

const server = http.createServer((req, res) =>{
    
    const {query, pathname} = url.parse(req.url, true);

    if(pathname === '/' || pathname === '/overview'){
        res.writeHead(200, {'Content-type': 'text/html'})
        const templateCards = parsedData.map(el => replaceTemplate(tempCards, el)).toString();
        // console.log(templateCards);
        const output = overview.replace('{%TEMPLATE_CARDS%}', templateCards)
        res.end(output)

    } 
    else if (pathname === '/product'){
        res.writeHead(200, {'Content-type': 'text/html'})
        const product = parsedData[query.id];
        const output = replaceTemplate(details, product);
        res.end(output);

    } else if (pathname === '/api'){
        res.writeHead(200, {'Content-type': 'application/json'})
        // res.end(data);

    } else {
        res.writeHead(404);
        res.end('Page not found');
    }
});

server.listen(3000, () => {
    console.log('app is listenting on port 3000');
});


