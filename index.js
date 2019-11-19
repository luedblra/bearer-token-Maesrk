const puppeteer = require('puppeteer');
const CREDS     = require('./creds');
const fs        = require('fs').promises;

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

    page.on('response', response => {
        console.log('Response Request:', response.request());

       /* const req = response.request();
        if (req.url() === 'https://api.maersk.com/favourites?applicationName=product-prices&userId=productPricesSystemUser&customerCode=12400177853&brandCode=MAEU&componentName=config-params&isUserIdLevelOnly=true') {
            response.buffer().then(
                b => {
                    console.log(`${response.status()} ${response.url()} ${b.length} bytes`);
                },
                e => {
                    console.error(`${response.status()} ${response.url()} failed: ${e}`);
                }
            );
        }*/

        /*fs.writeFile('./logNode.txt', JSON.stringify(response.request()), function(err) {
            if (err) throw err;
            console.log('completed write of request');
        });*/

    });
    await page.goto(`...`);
    await page.close();

    // SAVE COOKIES
    /*const cookies = await page.cookies();
    await fs.writeFile('./cookies.json', JSON.stringify(cookies, null, 2), function(err) {
        if (err) throw err;
        console.log('completed write of cookies');
    });*/
    await page.screenshot({ path: 'screenshots/github2.png' });
    browser.close();
}

run();