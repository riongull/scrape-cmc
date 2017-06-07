var fs = require('fs');
var express = require('express');
var request = require('request');
var cheerio = require('cheerio');

var app = express();

app.get('/scrape', function(req, res) {

    // upon client request, call out to coinmarketcap
    var url = 'https://coinmarketcap.com/historical/';
    var historyLinks = [];
    request(url, null , function(error, response, html) {        

        // load html from page, store all historical data links in 'links' array
        var link = "";
        var links = [];
        var historyLink = false;
        var $ = cheerio.load(html, {ignoreWhitespace: true });
        $('a').each(function(i,elem) {
            link = $(this).attr('href')
            historyLink = (link && link.length === 21) ? true : false 
            if (historyLink) { historyLinks.push('https://coinmarketcap.com'+link) } 
        })
        
        // initialize data, populate by scraping a specific link
        data = {
            "date": url.slice(37,45),
            "results": []
        }
        url = historyLinks[0];  // console.log(url);
        request(url, null, function(error, response, html) {
            // load html
            var coins = [];
            var $ = cheerio.load(html, {ignoreWhitespace: true});
            
            // $('#currencies-all > tbody').children().each(function(i, elem) {
            //     coins[i] = $(this).text()
            //     // console.log(coins[i])
            // });
            $('#currencies-all > tbody').children().each(function(i, elem) {
                // var values = [];
                console.log(this)
                // coins[i] = elem.children.each(function(j, elem) {
                    // values[j] = $(this).text();
                    // console.log("inner elem")
                // })
            });

            console.log(coins);
            res.send(coins);
        });
    });
});

app.listen('3000');
console.log('scraper is listening on port 3000');
exports = module.exports = app;