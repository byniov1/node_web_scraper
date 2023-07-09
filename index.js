import puppeteer from "puppeteer";


async function start(){
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://www.filmweb.pl/ranking/vod/film') 

    const info = await page.$eval('div.page__subtitle', el => el.textContent);
    console.log(info)

    const ProviderListLink = await page.evaluate(() => {
        const providerElements = Array.from(document.querySelectorAll('.rankingProvider__item')).slice(0, 4);
        
        return providerElements.map(element => {
            const providerName = element.querySelector('img').getAttribute('alt');
            const providerLink = element.querySelector('a').getAttribute('href');
            return { providerName, providerLink }
        })
    })

    console.log(ProviderListLink)

    await browser.close();
}

start()