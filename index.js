const puppeteer = require('puppeteer');
const CREDS     = require('./creds');
const fs        = require('fs').promises;

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
    console.log(CREDS.username);
    console.log(CREDS.password);
    //await page.screenshot({ path: 'screenshots/github.png' });
    const BUTTON_SELECTOR = '#login-form > fieldset > div:nth-child(4) > button';
    await page.click(BUTTON_SELECTOR);
    await page.waitForNavigation();
    let response = await page.goto('https://www.maersk.com/instantPrice/');
    let headerPage = '';
    await page.on('response', response => {
        //console.log('Response Request:', response.request());
        const req = response.request();
        //console.log('Response URl:', req.url());
        if (req.url() === 'https://api.maersk.com/tokenValidation?serviceName=product-prices') {
            response.buffer().then(
                b => {
                    headerPage = JSON.stringify(req.headers());
                    let inicio = headerPage.indexOf('Bearer');
                    let fin = headerPage.length;
                    let texto;
                    texto  = headerPage.substring(inicio,fin-2);
                    headerPage = texto;
                    console.log(texto);
            
                },
                e => {
                    console.error(`${response.status()} ${response.url()} failed: ${e}`);
                }
            );
        }
    });


    //console.log(texto2);
    await page.waitForNavigation();

    await page.goto(`https://www.maersk.com/portaluser/logoff`);
    await page.close();

    browser.close();
}

run();