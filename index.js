const puppeteer = require('puppeteer');
const CREDS     = require('./creds');
const fs        = require('fs').promises;
const { PendingXHR } = require('pending-xhr-puppeteer');
const textRegex = /(javascript|html|XHR)/;

async function run() {
    const browser = await puppeteer.launch({headless: false,args: ['--no-sandbox', '--disable-setuid-sandbox'],width:1024,height:800});
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(0); 

    await page.goto('https://www.maersk.com/instantPrice/', {waitUntil: 'networkidle0', timeout: 0});

    const USERNAME_SELECTOR = '#usernameInput';
    const PASSWORD_SELECTOR = '#passwordInput';

    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(CREDS.username);

    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(CREDS.password);
    console.log(CREDS.username);
    console.log(CREDS.password);
    await page.screenshot({ path: 'screenshots/github.png' });
    const BUTTON_SELECTOR = '#login-form > fieldset > div:nth-child(4) > button';
    await page.click(BUTTON_SELECTOR);
    const response = await page.waitForNavigation();
    
    page.on('response', (response) => {
        const headers = response.headers();

        // example test: check if content-type contains javascript or html
        const contentType = headers['content-type'];
        if (textRegex.test(contentType)) {
            console.log(response.url());
        }
    });
    await page.goto(`...`);
    await page.close();
    
    /*await fs.writeFile('./header.json', JSON.stringify(headers, null, 2), function(err) {
        if (err) throw err;
        console.log('completed write of headers');
    });*/
    
    // SAVE COOKIES
    const cookies = await page.cookies();
    await fs.writeFile('./cookies.json', JSON.stringify(cookies, null, 2), function(err) {
        if (err) throw err;
        console.log('completed write of cookies');
    });
    await page.screenshot({ path: 'screenshots/github2.png' });
    browser.close();
}

run();