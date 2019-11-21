const puppeteer = require('puppeteer');
const CREDS     = require('./creds');
const fs        = require('fs').promises;
"use strict";

const http = require("http");
const util = require("util");

async function run() {
    const browser = await puppeteer.launch({headless: false,args: ['--no-sandbox', '--disable-setuid-sandbox']});

    const page = await browser.newPage();
    await page.setViewport({
        width: 1024,
        height: 700,
    });
    await page.setDefaultNavigationTimeout(0); 

    await page.goto('https://www.maersk.com/portaluser/login', {waitUntil: 'networkidle0', timeout: 0});

    const USERNAME_SELECTOR = '#usernameInput';
    const PASSWORD_SELECTOR = '#passwordInput';

    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(CREDS.username);

    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(CREDS.password);
    //console.log(CREDS.username);
    //console.log(CREDS.password);
    //await page.screenshot({ path: 'screenshots/github.png' });
    const BUTTON_SELECTOR = '#login-form > fieldset > div:nth-child(4) > button';
    await page.click(BUTTON_SELECTOR);
    await page.waitForNavigation();

    const response = await page.goto('https://www.maersk.com/instantPrice/');

    page.on('response', response => {
        //console.log('Response Request:', response.request());
        const req = response.request();
        //console.log('Response URl:', req.url());
        if (req.url() === 'https://api.maersk.com/tokenValidation?serviceName=product-prices') {
            response.buffer().then(
                b => {
                    let headerPage  = '';
                    headerPage      = JSON.stringify(req.headers());
                    let inicio      = headerPage.indexOf('Bearer');
                    let fin         = headerPage.length;
                    let bearer_enc  = headerPage.substring(inicio,fin-2);
                    //console.log(bearer_enc);
                    extrae(bearer_enc);
                },
                e => {
                    console.error(`${response.status()} ${response.url()} failed: ${e}`);
                }
            );
        }
    });

    await page.waitFor(2000);

    //console.log('llega');
    await page.goto(`https://www.maersk.com/portaluser/logoff`);

    //console.log(texto2);
    await page.close();

    browser.close();
}
  
function extrae(data){
    http.createServer((request, response) => {
        response.setHeader("Content-Type", "text/plain;charset=utf-8");
        response.end(util.inspect(data));
    }).listen(8000, "::1");
}


run();