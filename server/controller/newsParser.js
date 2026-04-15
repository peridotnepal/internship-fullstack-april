import Parser from "rss-parser";

const parser = new Parser();

const getNews = async (req, res) => {
  try {
    const keyword = req.query.q || "nepal";

    const url = `https://news.google.com/rss/search?q=${encodeURIComponent(
      keyword
    )}&hl=en-US&gl=US&ceid=US:en`;

    const xml = await fetch(url).then((res) => res.text());
    const feed = await parser.parseString(xml);

    const news = feed.items.map((item) => ({
      title: item.title || "",
      link: item.link || "",
      published: item.pubDate || "",
      source: item.source?.title || item.creator || "",
      description: item.contentSnippet || "",
    }));

    return res.json({ total: news.length, keyword, news });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to fetch news" });
  }
};

export default getNews;