import axios from "axios";
import * as cheerio from "cheerio";

export default async function scrapeMetadata(url: string) {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    const title = $("meta[property='og:title']").attr("content") || $("title").text();
    const description =
      $("meta[property='og:description']").attr("content") || $("meta[name='description']").attr("content");
    const image_url = $("meta[property='og:image']").attr("content");

    if (!title) return null;

    return { title, description, image_url };
  } catch (error) {
    console.error("Scraping failed:", error);
    return null;
  }
}
