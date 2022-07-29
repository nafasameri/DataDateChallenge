const http = require('http');
const log4js = require('log4js');

const logger = log4js.getLogger();
logger.level = 'debug';


let Tags = JSON.stringify(['enc_base64', 'active']);
let SortIndex = 2;
let PageSize = 4;
let PageIndex = 6;

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
            // DataSet = DataSet.sort(a => a.Tags[SortIndex]);
            // logger.warn(DataSet);
            sort(DataSet, SortIndex);
            // quicksort(DataSet, 0, DataSet.length - 1);
            for (const data of DataSet) {
                try {
                    logger.info(data.Tags);
                } catch (ex) {
                    logger.info(data);
                }
            }

            ///// Paging
            let Pages = [];
            let len = Math.ceil(DataSet.length / PageSize);
            logger.info(`length of Pages = ${len}`)
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
            if (len <= PageIndex)
                logger.error(`length of Pages is ${len} enter PageIndex`)
            else
                logger.info(Pages[PageIndex]);
        });
    }
});
reqSearch.write(Tags);
reqSearch.end();

///// functions
function swap(array, i, j) {
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
}

function sort(DataSet, SortIndex) {
    let undefinedes = [];
    for (let i = 0; i < DataSet.length; i++) {
        for (let j = 0; j < DataSet.length; j++) {
            try {
                if (DataSet[i].Tags[SortIndex] != undefined) {
                    if (DataSet[i].Tags[SortIndex] < DataSet[j].Tags[SortIndex])
                        swap(DataSet, i, j);
                } else {
                    swap(DataSet, i, DataSet.length - 1);
                    let temp = DataSet.pop();
                    undefinedes.push(temp);
                }
            } catch (ex) {
            }
        }
    }
    for (const item of undefinedes) {
        DataSet.push(item);
    }
    // logger.warn(undefinedes);
}

// It uses Dutch National Flag Algorithm
function partition(a, low, high, i, j) {
    // To handle 2 elements
    if (high - low <= 1) {
        if (a[high] < a[low])
            swap(a, high, low);
        i = low;
        j = high;
        return;
    }

    let mid = low;
    let pivot = a[high];
    while (mid <= high) {
        if (a[mid] < pivot)
            swap(a, low++, mid++);
        else if (a[mid] == pivot)
            mid++;
        else if (a[mid] > pivot)
            swap(a, mid, high--);
    }

    // update i and j
    i = low - 1;
    j = mid; // or high+1
}

// 3-way partition based quick sort
function quicksort(a, low, high) {
    if (low >= high) // 1 or 0 elements
        return;

    let i = low, j = high;

    // Note that i and j are passed
    partition(a, low, high, i, j);

    // Recur two halves
    quicksort(a, low, i);
    quicksort(a, j, high);
}
