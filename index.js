import puppeteer from "puppeteer";

const baseUrl = 'https://www.filmweb.pl'
async function start() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`${baseUrl}/ranking/vod/film`)

    const ProviderListLink = await page.evaluate(() => {
        const providerElements = Array.from(document.querySelectorAll('.rankingProvider__item')).slice(0, 4);

        return providerElements.map(element => {
            const providerName = element.querySelector('img').getAttribute('alt');
            const providerLink = element.querySelector('a').getAttribute('href');
            return { providerName, providerLink }
        })
    })

    const x = []
    for(const link of ProviderListLink){
        await Promise.all([
            page.goto(`${baseUrl}${link.providerLink}`),
            page.waitForNavigation()
        ])
    
        await page.click('.rankingHeader__filter')
        await page.click('button[data-placeholder="Wybierz rok produkcji"]')
        await page.click('label[data-name="2023"].filterSelect__option')
    
        const info = await page.$eval('div.page__subtitle', el => el.textContent);
        console.log(info)
    
        const movies = await page.evaluate(() => {
            const movieElements = [...document.querySelectorAll('div.rankingType[itemprop="itemListElement"]')]
    
            const movieSliced = movieElements.slice(0, 10)
            return movieSliced.map(element => {
                const rating = element.querySelector('.rankingType__rate--value').innerText;
                const name = element.querySelector('.rankingType__title a').innerText
    
                return { rating, name }
            })
        });
        x.push(movies)
        console.log(movies)
    }


    console.log(x)
    await browser.close();
}

start()