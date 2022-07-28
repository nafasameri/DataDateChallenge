const http = require('http');
const log4js = require('log4js');
const fs = require('fs');

const logger = log4js.getLogger();
logger.level = 'debug';

const port = process.env.port || 5000;
const sample = fs.readFileSync('sample.json').toString();


const server = http.createServer((req, res) => {
    // req.on('data', (chunk) => {
    //     data = JSON.parse(chunk);
    //     logger.error(data);
    // });

    if (req.url == '/search') {
        res.writeHead(200);
        res.write(sample);
        res.end();
    }
}).listen(port);