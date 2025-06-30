import scrape from './utils/scrapData';


async function main() {
    const {todayGoldPrice, todaySilverPrice} = await scrape()
    console.log(todayGoldPrice, todaySilverPrice)
}



main()