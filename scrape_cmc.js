let fs = require('fs');
let axios = require('axios');
let cheerio = require('cheerio');
let cheers = require('cheers');
let Baby = require('babyparse');

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

    historyLinks = historyLinks.slice(0,2);  // trim load for testing
    console.log('historyLinks:', historyLinks);
    
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

const outputData = (cmcData) => {
    console.log(cmcData);

    // let JSONData = JSON.stringify(cmcData, null, 2);
    // console.log('JSONData', JSONData);

    const headers = Object.keys(cmcData[Object.keys(cmcData)[0]][0]);
    console.log('headers:', headers);

    const getCsvLine = (currency = 'Litecoin', day = '20130505') => {
        return cmcData[day].find((coin) => coin.currency === currency)
    };

    csvData = [];
    
    Object.keys(cmcData).forEach(day => {    
        // JSONcsvLine = getCsvLine();
        csvData.push(getCsvLine('Litecoin', day)[headers[4]]);
    });

    console.log(csvData)

    
    // let dataString = '';
    // reducedData = Object.keys(cmcData).reduce((acc, date, i) => {
    //     console.log('i:', i);
    //     console.log('acc:', acc);
    //     console.log('date:', date);
    //     console.log('price:', cmcData[Object.keys(cmcData)[i]].find((coin) => coin.currency === 'Litecoin'));
    //     // line = date + Baby.unparse(JSON.stringify(cmcData[Object.keys(cmcData)[i]]))
    //     // return acc.concat(dailyData,'\n');
    //     return acc.concat(date,',');
    //     // console.log(cmcData[Object.keys(cmcData)[i]].find((coin) => coin.currency === 'Litecoin'));
    // },'');

    // console.log(reducedData);

    let csv = Baby.unparse(JSON.stringify(cmcData[Object.keys(cmcData)[0]]));
    // let csv = Baby.unparse(JSON.stringify(JSONData[Object.keys(JSONData)[0]])); 

    // fs.writeFile('scrape_cmc.csv', csv, (err) => {
    //     if (err) throw err;
    //     console.log('file saved');
    // });

    return csv;
};

const scrapeSite = async (url) => {
    try {
        const historyLinks = await getHistoryLinks(url);
        const cmcData = await getData(historyLinks);
        const csv = outputData(cmcData); 
        // console.log('csv:\n', csv);
    } catch (error) {
        console.log(error);
    }
};

scrapeSite('https://coinmarketcap.com/historical/');