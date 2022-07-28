const http = require('http');
const log4js = require('log4js');

const logger = log4js.getLogger();
logger.level = 'debug';

// let Tags = prompt("Enter Tags: ");
let Tags = JSON.stringify(['enc_base64', 'active']);
let SortIndex = 1;
let PageSize = 3;
let PageIndex = 2;

///// level 1
let optionSearch = {
    hostname: 'localhost',
    port: process.env.port || 5000,
    path: '/search',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Tags.length
    },
    method: 'POST',
    timeout: 120000
};

let reqSearch = http.request(optionSearch, (res) => {
    if (res.statusCode == 200) {
        let DataSet = [];
        res.on('data', (chunk) => {
            DataSet = JSON.parse(chunk);
        });

        res.on('end', () => {
            ///// Sorting
            // DataSet = DataSet.sort(a => a.Data);
            // logger.warn(DataSet);
            for (const data of DataSet) {
                logger.info(data.Tags[SortIndex]);
            }

            ///// Paging
            let Pages = [];
            let len = Math.ceil(DataSet.length / PageSize);
            logger.info("length of Pages = " + len)
            for (let i = 0; i < len; i++) {
                let Page = [];
                for (let j = 0; j < PageSize; j++) {
                    let index = (i * PageSize) + j;
                    let page = DataSet[index];
                    if (page != undefined)
                        Page[j] = page;
                }
                Pages[i] = Page;
            }
            logger.info(Pages[PageIndex]);
        });
    }
}).end();