const Blog = require("../models/blogModel");
const { SitemapStream, streamToPromise } = require("sitemap");
const { createGzip } = require("zlib");

require("dotenv").config();

let sitemapData = {
  createdOn: new Date(),
  sitemap: false,
};
var THIRTY_MIN = 30 * 60 * 1000;

const generateSiteMap = async (req, res) => {
  var date = new Date();
  const isTimedOut = date - new Date(sitemapData.createdOn) > THIRTY_MIN;

  res.header("Content-Type", "application/xml");
  res.header("Content-Encoding", "gzip");
  // if we have a cached entry send it
  if (sitemapData.sitemap && !isTimedOut) {
    res.send(sitemapData.sitemap);
    return;
  }

  try {
    const smStream = new SitemapStream({
      hostname: process.env.HOST_URL,
    });
    const pipeline = smStream.pipe(createGzip());

    const blogs = await Blog.find().select("_id");
    // pipe your entries or directly write them.
    smStream.write({ url: "/", changefreq: "daily", priority: 0.7 });
    blogs.forEach(({ _id }) => {
      smStream.write({
        url: `/blog/${_id}`,
        changefreq: "monthly",
        priority: 0.3,
      });
    });
    smStream.write({ url: "/sign-up" });
    smStream.write({ url: "/log-in" });
    smStream.write({ url: "/about" });

    /* or use
    Readable.from([{url: '/page-1'}...]).pipe(smStream)
    if you are looking to avoid writing your own loop.
    */

    // cache the response
    streamToPromise(pipeline).then((sm) => {
      sitemapData.sitemap = sm;
      sitemapData.createdOn = new Date();
    });
    // make sure to attach a write stream such as streamToPromise before ending
    smStream.end();
    // stream write the response
    pipeline.pipe(res).on("error", (e) => {
      throw e;
    });
  } catch (e) {
    console.error(e);
    res.status(500).end();
  }
};

module.exports = generateSiteMap;
