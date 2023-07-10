import puppeteer from 'puppeteer';
import {fetchVodProviders, mergeArray, scrapTopMovies} from '../app/utiliti'
import {moviesAfterScrapData} from './moviesAfterScrap'

const baseUrl = 'https://www.filmweb.pl';
let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch();
    page = await browser.newPage();
    await page.goto(`${baseUrl}/ranking/vod/film`)
});

afterAll(async () => {
    await browser.close();
});

describe('Example Test', () => {
    it('should load the page and assert a specific element', async () => {
        const title = await page.title();
        expect(title).toBe('Najlepsze filmy online - Ranking Filmów Filmweb');
    });
})

describe('Scrapped movies', () => {
    it('Scrapped movies array should not be empty' , async () => {
        const array = await fetchVodProviders(page)
        expect(array).not.toHaveLength(0)
    })
})

describe('Receiving VOD providers' , () => {
    it('We should receive 4 elements of vod providers', async () => {
        const array  = await fetchVodProviders(page);
        expect(array).toHaveLength(4)
    })
})

describe('Receive movies' , () => {
    it('We should receive 4 arrays of movies', async () => {
        const ProviderListLink = await fetchVodProviders(page)
        let array = []
        for (const provider of ProviderListLink) {
            await scrapTopMovies(page, provider, array)
        }
        expect(array).toHaveLength(4)
    })
}, 10000)


describe('Mergig array' , () => {
    it('We should receive only one array affter merging', async () => {
        let mergedArray = mergeArray(moviesAfterScrapData)
        expect(mergedArray).not.toHaveLength(4)
    })
})