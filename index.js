const request = require('request-promise');
const cheerio = require('cheerio');

(async() => {

    const USERNAME = 'willsmith';
    const BASE_URL = `https://instagram.com/${USERNAME}`;

    let response = await request(BASE_URL);

    let $ = cheerio.load(response);

    // eq(3) because I want the fourth script tag
    let script = $('script[type="text/javascript"]').eq(3).html();

    console.log(script);
})()