import { scrapeJobPages } from "./JobPages.js";
import cheerio from "cheerio";
import rp from "request-promise";

// Function to extract data from <h3> elements and their corresponding paragraphsfunction extractH3Data($) {
function extractH3Data($) {
  const arrayOfObjects = [];

  $("h3").each((index, element) => {
    const nextSibling = $(element).next();

    if (nextSibling.length > 0) {
      // Extract text from the sibling element
      const text = nextSibling.text().trim().replace(/\n/g, "");
      // Remove any irrelevant information
      const cleanText = removeAdsAndIrrelevant(text);
      const obj = {
        [$(element).text().trim()]: cleanText,
      };
      arrayOfObjects.push(obj);
    }
  });

  return arrayOfObjects;
}

function removeAdsAndIrrelevant(text) {
  // Regular expression to match ads and irrelevant content
  const adRegex =
    /\(adsbygoogle\s*=\s*window\.adsbygoogle\s*\|\|\s*\[]\)\s*\.\s*push\s*\({}\);/g;
  // Remove ads and irrelevant content
  return text.replace(adRegex, "");
}

const jobDetails = [];

async function fetchData() {
  try {
    // Call scrapeJobPages function to populate allJobs array
    const allJobs = await scrapeJobPages();

    for (let i = 0; i < allJobs.length; i++) {
      const curPageUrl = allJobs[i].link;
      const html = await rp(curPageUrl);
      const $ = cheerio.load(html);

      const ExtractJd = extractH3Data($);

      // Select all <a> tags inside <li> elements within the <ul> with class ez-toc-list-level-3
      const hrefs = [];
      $("ul.ez-toc-list-level-3 li a").each((index, element) => {
        const href = $(element).attr("href");
        hrefs.push(href);
      });

      // Extracting Company Website
      const companyWebsite = $("strong")
        .filter(function () {
          const text = $(this).text().trim();
          return (
            text === "Company Website:" ||
            text === "Company Website :" ||
            text === "Company Website: " ||
            text === "Company Website : "
          );
        })
        .next("a")
        .attr("href");

      // Extracting Job Role
      const jobRole = $("strong:contains('Job Role:')")
        .parent()
        .text()
        .replace("Job Role:", "")
        .trim();

      // Extracting Qualification
      const qualification = $("strong:contains('Qualification:')")
        .parent()
        .text()
        .replace("Qualification:", "")
        .trim();

      // Extracting Batch
      const batch = $("strong:contains('Batch:')")
        .parent()
        .text()
        .replace("Batch:", "")
        .trim();

      // Extracting Experience
      const experience = $("strong:contains('Experience:')")
        .parent()
        .text()
        .replace("Experience:", "")
        .trim();

      // Extracting Salary
      const salary = $("strong:contains('Salary:')")
        .parent()
        .text()
        .replace("Salary:", "")
        .trim();

      // Extracting Job Location
      const jobLocation = $("strong:contains('Job Location:')")
        .parent()
        .text()
        .replace("Job Location:", "")
        .trim();

      // Extracting Last Date
      const lastDate = $("strong:contains('Last Date:')")
        .parent()
        .text()
        .replace("Last Date:", "")
        .trim();

      // Log the extracted information

      const ob = {
        "Job Title:": allJobs[i].title,
        "Company Website:": companyWebsite,
        "Job Role:": jobRole,
        "Qualification:": qualification,
        "Batch:": batch,
        "Experience:": experience,
        "Salary:": salary,
        "Job Location:": jobLocation,
        "Last Date:": lastDate,
        ExtractJd,
      };

      jobDetails.push(ob);
    }

    console.log(jobDetails);
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}

// Call the fetchData function
fetchData();
for (let i = 0; i < jobDetails.length; i++) {
  console.log(`Job Details for ${i + 1}`);
  console.log("-------------------------------");
  console.log(`Job Title: ${jobDetails[i]["Job Title:"]}`);
  console.log(`Company Website: ${jobDetails[i]["Company Website:"]}`);
  console.log(`Job Role: ${jobDetails[i]["Job Role:"]}`);
  console.log(`Qualification: ${jobDetails[i]["Qualification:"]}`);
  console.log(`Batch: ${jobDetails[i]["Batch:"]}`);
  console.log(`Experience: ${jobDetails[i]["Experience:"]}`);
  console.log(`Salary: ${jobDetails[i]["Salary:"]}`);
  console.log(`Job Location: ${jobDetails[i]["Job Location:"]}`);
  console.log(`Last Date: ${jobDetails[i]["Last Date:"]}`);

  // Log ExtractJd array
  console.log("Extracted Job Details:");
  const extractJd = jobDetails[i].ExtractJd;
  for (let j = 0; j < extractJd.length; j++) {
    const key = Object.keys(extractJd[j])[0];
    console.log(`${key}: ${extractJd[j][key]}`);
  }

  console.log("\n");
}
