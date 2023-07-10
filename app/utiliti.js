import fs from 'fs';
export const baseUrl = 'https://www.filmweb.pl';

export function convertAndSaveToCSV(array){    
    const names = Object.keys(array[0]);
    let result = names.join(',') + '\n';
    array.forEach(element => result += names.map(name => element[name].replace(',', '.')) + '\n')

    fs.writeFile('movies.csv' , result, (err) => {
        if(err){
            console.error('Error writing file' , err)
        } else {
            console.log('CSV file was created')
        }
    })
}

export async function fetchVodProviders(page) {
    const ProviderListLink = await page.evaluate(() => {
        const providerElements = Array.from(document.querySelectorAll('.rankingProvider__item')).slice(0, 4);

        return providerElements.map(element => {
            const providerName = element.querySelector('img').getAttribute('alt');
            const providerLink = element.querySelector('a').getAttribute('href');
            return { providerName, providerLink }
        })
    })
    return ProviderListLink
}

export async function scrapTopMovies(page, provider, array) {
    await Promise.all([
        page.goto(`${baseUrl}${provider.providerLink}`),
        page.waitForNavigation()
    ])

    await page.click('.rankingHeader__filter')
    await page.click('button[data-placeholder="Wybierz rok produkcji"]')
    await page.click('label[data-name="2023"].filterSelect__option')

    // const info = await page.$eval('div.page__subtitle', el => el.textContent);
    // console.log(info)

    const movies = await page.$$eval('div.rankingType[itemprop="itemListElement"]', (elements, providerName) => {
        const movieSliced = elements.slice(0, 10);

        return movieSliced.map(element => {
            const name = element.querySelector('.rankingType__title a').innerText;
            const rating = element.querySelector('.rankingType__rate--value').innerText;

            return {  name, rating, vodServiceName: providerName };
        });
    }, provider.providerName);

    array.push(movies)
}

const ParseFLoatRating = (obj) => parseFloat(obj.rating.replace(',', '.'))

function mergeArray(array) {
    return array.reduce((acc, curr) => acc.concat(curr), [])
}

function deduplicateArray(array) {
    return array.reduce((acc, curr) => {
        const existingObject = acc.find(obj => obj.name === curr.name)

        if (!existingObject) {
            acc.push(curr)
        } else if (ParseFLoatRating(curr) > ParseFLoatRating(existingObject)) {
            existingObject.rating = curr.rating;
            existingObject.vodServiceName = curr.vodServiceName;
        }

        return acc;
    }, [])
}

function sortArray(array) {
    return array.sort((a, b) => ParseFLoatRating(b) - ParseFLoatRating(a))
}

export function mergeDeduplicateSort(array){
    const mergedArray = mergeArray(array);
    const deduplicatedArray = deduplicateArray(mergedArray);
    const sortedArray = sortArray(deduplicatedArray);

    return sortedArray
}