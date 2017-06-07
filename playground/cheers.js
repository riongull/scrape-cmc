var cheers = require('cheers');
var express = require('express');


var app = express();

app.get('/', function(req, res) {

    //let's scrape this excellent JS news website
    var config = {
        url: "http://www.echojs.com/",
        curlOptions: {
            'useragent': 'Cheers'
        },
        blockSelector: "article",
        scrape: {
            title: {
                selector: "h2 a",
                extract: "text"
            },
            link: {
                selector: "h2 a",
                extract: "href"
            },
            articleInnerHtml: {
                selector: ".",
                extract: "html"
            },
            articleOuterHtml: {
                selector: ".",
                extract: "outerHTML"
            },
            articlePublishedTime: {
                selector: 'p',
                extract: /\d* (?:hour[s]?|day[s]?) ago/
            }
        }
    };

    cheers.scrape(config).then(function (results) {
        // console.log(JSON.stringify(results));
        res.send(results);
    }).catch(function (error) {
        console.error(error);
    });
    
});

app.listen('3000');
console.log('cheers is listening on port 3000');
exports = module.exports = app;


