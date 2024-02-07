const axios = require("axios");
const cheerio = require("cheerio");

class MyCima {
  static async search(type, query, domain) {
    //type is the type of the search (movie, series, anime, tv)
    //query is the name of the movie or series or anime or tv
    //domain is the domain of the website (https://we4mycima.store)
    if (!domain) throw new Error("Missing domain");
    const results = []; //here well push the results

    if (!type || !query) throw new Error("Missing parameters");

    if (type === "movie") {
      const sanitizedQuery = query.replace(/[^\w\s]/gi, "+");
      await axios
        .get(`${domain}/search/${sanitizedQuery}`)
        .then(async (response) => {
          const html = response.data;
          const $ = await cheerio.load(html);

          $("div[class=GridItem]").map(async (index, element) => {
            await results.push({
              name: $(element).find("a").attr("title"),
              link: $(element).find("a").attr("href"),
            });
          });
        });
    }

    if (type === "series") {
      const sanitizedQuery = query.replace(/[^\w\s]/gi, "+");
      await axios
        .get(`${domain}/search/${sanitizedQuery}/list/series/`)
        .then(async (response) => {
          const html = response.data;
          const $ = await cheerio.load(html);

          $("div[class=GridItem]").map(async (index, element) => {
            await results.push({
              name: $(element).find("a").attr("title"),
              link: $(element).find("a").attr("href"),
            });
          });
        });
    }

    if (type === "anime") {
      const sanitizedQuery = query.replace(/[^\w\s]/gi, "+");
      await axios
        .get(`${domain}/search/${sanitizedQuery}/list/anime/`)
        .then(async (response) => {
          const html = response.data;
          const $ = cheerio.load(html);

          $("div[class=GridItem]").map(async (index, element) => {
            await results.push({
              name: $(element).find("a").attr("title"),
              link: $(element).find("a").attr("href"),
            });
          });
        });
    }

    if (type === "tv") {
      const sanitizedQuery = query.replace(/[^\w\s]/gi, "+");
      await axios
        .get(`${domain}/search/${sanitizedQuery}/list/tv/`)
        .then(async (response) => {
          const html = response.data;
          const $ = await cheerio.load(html);

          $("div[class=GridItem]").map(async (index, element) => {
            await results.push({
              name: $(element).find("a").attr("title"),
              link: $(element).find("a").attr("href"),
            });
          });
        });
    }

    return results;
  }

  static async Info(url) {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const info = [];

    $('div[class="Inner--Content--Single-begin"]')
      .find("ul")
      .find("li")
      .each((index, element) => {
        const infos = $(element).find("span").text();
        const dec = $(element).find("p").text();

        info.push({ [infos]: dec });
      });

    const title = $('div[class="Title--Content--Single-begin"]')
      .find("h1")
      .text();
    info.push({ title: title });
    return info;
  }

  static async Watch(url) {
    /*
        this function is just to get the watch links 
        */
    const response = await axios.get(url);
    const html = response.data;
    const $ = await cheerio.load(html);
    const watch = [];

    $("ul[class=WatchServersList]")
      .find("li")
      .each(async (index, element) => {
        const watchs = $(element).find("btn").attr("data-url").trim();
        const name = $(element).find("btn").text().trim();
        await watch.push({ name: name, link: `${watchs.trim()}` });
      });

    return watch;
  }

  static async GetSeaseon(url) {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const season = [];
    $("div[class=List--Seasons--Episodes]")
      .find("a")
      .each((index, element) => {
        const seasons = $(element).attr("href");
        const seasonName = $(element).text();
        season.push({ name: seasonName, link: seasons });
      });

    return season;
  }

  static async GetEpisodes(url) {
    //url of season

    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);
    const episodes = [];
    $("div[class=Episodes--Seasons--Episodes]")
      .find("a")
      .each((index, element) => {
        const episode = $(element).attr("href");
        const episodeName = $(element).text();
        episodes.push({ name: episodeName, link: episode });
      });

    return episodes;
  }
}

module.exports = MyCima;
