const puppeteer = require('puppeteer');
const CREDS     = require('./creds');

async function run() {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']});
    //const browser = await puppeteer.launch();
    const page = await browser.newPage();

    await page.goto('https://www.maersk.com/portaluser/login', {waitUntil: 'load', timeout: 0});

    const USERNAME_SELECTOR = '#usernameInput';
    const PASSWORD_SELECTOR = '#passwordInput';
    
    


    await page.click(USERNAME_SELECTOR);
    await page.keyboard.type(CREDS.username);

    await page.click(PASSWORD_SELECTOR);
    await page.keyboard.type(CREDS.password);
    await page.screenshot({ path: 'screenshots/github.png' });
    console.log(CREDS.username);
    console.log(CREDS.password);
   // const [button] = await page.$x("//button[contains(., 'Log in')]");
  /*  await page.waitForSelector('button[class="button button--primary button--block"]');
    await page.click('button[class="button button--primary button--block"]');
*/
    const BUTTON_SELECTOR = '#login-form > fieldset > div:nth-child(4) > button';

    await page.click(BUTTON_SELECTOR);
    /*const query = "Log in";
    page.evaluate( query => {
        const elements = [...document.querySelectorAll('button.button button--primary button--block')];

        // Either use .find or .filter, comment one of these
        // find element with find
        const targetElement = elements.find(e => e.innerText.includes(query));

        // OR, find element with filter
        // const targetElement = elements.filter(e => e.innerText.includes(query))[0];

        // make sure the element exists, and only then click it
        targetElement && targetElement.click();
    }, query);*/

    await page.waitForNavigation();
    await page.screenshot({ path: 'screenshots/github2.png' });
    browser.close();
}

run();