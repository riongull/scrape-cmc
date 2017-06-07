var fs = require('fs');
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');

var app = express();

app.get('/', function(req, res) {

    var url = 'https://coinmarketcap.com/historical/';
    var historyLinks = [];
    
    request(url, null , function(error, response, html) {
        var $ = cheerio.load(html, {
            ignoreWhitespace: true
        });

        var link = "";
        var links = [];
        var historyLink = false;
        // var historyLinks = []

        $('a').each(function(i,elem) {
            link = $(this).attr('href')
            historyLink = (link && link.length === 21) ? true : false 
            if (historyLink) { historyLinks.push('https://coinmarketcap.com'+link) } 
        })
        // res.send(historyLinks)
        // console.log(historyLinks);

        // url = 'https://coinmarketcap.com/historical/20130428/';
        url = historyLinks[100];
        console.log(url);

        data = {
            "date": url.slice(37,45),
            "results": []
        }

        // console.log('data', data);

        request(url, null, function(error, response, html) {
            var $ = cheerio.load(html, {
                ignoreWhitespace: true,
            });

            var coins = [];

            $('#currencies-all > tbody').children().each(function(i, elem) {
                coins[i] = $(this).text()
                // console.log(coins[i])
            });
            console.log(coins)

            var keys = [
                'rank',
                'name',
                'symbol',
                'marketcap',
                'price_usd',
                'supply',
                'change_1hr',
                'change_1day',
                'change_1week',
            ]

            data.results = coins
                .map(line => line.split(' ')
                    .filter(item => item.length > 0)
                    .filter(item => item !== '$')
                    .filter(item => item !== '%')
                    .filter(item => item !== 'Low')
                    .filter(item => item !== 'Vol')
                    .reduce((obj, item, i) => {
                        obj[keys[i]] = item
                        return obj
                    }, {})
                )
            
            res.send(data);
            // var marketcap = $('#total-marketcap').text();
            // console.log(marketcap);
        });
    });
});

app.listen('3000');
console.log('server is listening on port 3000');
exports = module.exports = app;