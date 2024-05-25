import cheerio from "cheerio";
import rp from "request-promise";

const baseUrl = `https://freshershunt.in/`;

async function scrapeJobPages() {
  try {
    const allJobs = [];

    for (let page = 1; page <= 5; page++) {
      const pageUrl = `${baseUrl}page/${page}/`;

      // Fetch HTML for the current page
      const html = await rp(pageUrl);

      // Load HTML into Cheerio
      const $ = cheerio.load(html);
      const jobsArticle = $(".site-main article");

      // Iterate over each job posting jobsArticle on the page and fetch title and link
      jobsArticle.each((index, element) => {
        const title = $(element).find(".inside-article .entry-title a").text();
        const link = $(element)
          .find(".inside-article .entry-title a")
          .attr("href");

        // Push job into allJobs array
        allJobs.push({ title, link });
      });
    }

    return allJobs;
  } catch (error) {
    console.error("Error:", error);
    throw error; // Re-throwing the error to handle it elsewhere if needed
  }
}

export { scrapeJobPages };
