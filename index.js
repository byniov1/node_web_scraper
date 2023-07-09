import puppeteer from "puppeteer";


async function start(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.filmweb.pl/ranking/vod/film') 

    const info = await page.$eval('div.page__subtitle', el => el.textContent);
    console.log(info)

    await browser.close();
}

start()