const puppeteer = require('puppeteer');
import {fetchVodProviders} from '../app/index.js'

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