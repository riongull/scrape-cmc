let fs = require('fs');
let axios = require('axios');
let cheerio = require('cheerio');
let cheers = require('cheers');
let json2csv = require('json2csv');

const getHistoryLinks = (url) => {  
    return axios(url).then((response) => {
        let html = response.data;
        let $ = cheerio.load(html, {ignoreWhitespace: true});
        let link = "";
        let links = [];
        let historyLink = false;
        let historyLinks = [];

        $('a').each(function(i, elem) {
            link = $(this).attr('href');
            historyLink = (link && link.length === 21) ? true : false
            if (historyLink) { historyLinks.push('https://coinmarketcap.com'+link) }
        });

        return historyLinks;

    }).catch((error) => console.log(error));
};

const getData = (historyLinks) => {

    // historyLinks = historyLinks.slice(0,2);  // trim load for testing
    console.log('historyLinks:\n', historyLinks);
    
    let config = {
        url: historyLinks,
        blockSelector: "tr",
        scrape: {
            currency: {
                selector: "td.no-wrap.currency-name > a",
                extract: "text"
            },
            symbol: {
                selector: "td.text-left",
                extract: "text"
            },
            marketcap: {
                selector: "td.no-wrap.market-cap.text-right",
                extract: "text"
            },
            price_usd: {
                selector: 'td:nth-child(5) > a',
                extract: "text"
            },
            supply: {
                selector: 'td:nth-child(6) > a',
                extract: "text"
            },
            volume: {
                selector: 'td:nth-child(7) > a',
                extract: "text"
            },
            change_1hr: {
                selector: 'td.no-wrap.percent-1h.positive_change.text-right',
                extract: "text"
            },
            change_1day: {
                selector: 'td:nth-child(9)',
                extract: "text"
            },
            change_1week: {
                selector: 'td:nth-child(10)',
                extract: "text"
            }
        }
    };

    return cheers.scrape(config).then((results) => {
               
        cmcData = results.reduce((data, arr, i) => {
            date = `${historyLinks[i].slice(-9, -1)}`;
            data[date] = arr.splice(1, arr.length);
            return data
        }, {});
        
        Object.keys(cmcData).map((i) => {
            cmcData[i].map((o) => {
                Object.keys(o).map((i) => {
                    o[i] = o[i].trim();
                });
            });
        });

        return cmcData

    }).catch((error) => console.error(error));
};

const formatData = (cmcData) => {
    data = [];

    Object.keys(cmcData).forEach(date => {
        cmcData[date].forEach(stats => {
            stats.date = date;
            data.push(stats);
        })
    })

    let fields = ['date'].concat(Object.keys(cmcData[Object.keys(cmcData)[0]][0])).slice(0,-1);
    let csv = json2csv({ data, fields });
    return csv;
}

const outputData = (csv) => {
    console.log('csv:\n', csv);

    fs.writeFile('scrape_cmc.csv', csv, (err) => {
        if (err) throw err;
        console.log('file saved');
    });
};

const scrapeSite = async (url) => {
    try {
        const historyLinks = await getHistoryLinks(url);
        const cmcData = await getData(historyLinks);
        const csv = formatData(cmcData);
        outputData(csv); 
    } catch (error) {
        console.log(error);
    }
};

scrapeSite('https://coinmarketcap.com/historical/');