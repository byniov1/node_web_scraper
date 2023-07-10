import puppeteer from "puppeteer";
import {baseUrl, fetchVodProviders, scrapTopMovies ,mergeDeduplicateSort, convertAndSaveToCSV} from './utiliti.js'

async function start() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`${baseUrl}/ranking/vod/film`)
    let movieArray = [];

    const ProviderListLink = await fetchVodProviders(page)
    for (const provider of ProviderListLink) {
        await scrapTopMovies(page, provider, movieArray)
    }
    movieArray = mergeDeduplicateSort(movieArray)
    convertAndSaveToCSV(movieArray)

    await browser.close();
}
start(); 