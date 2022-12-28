const fs = require("fs");
var XLSX = require("xlsx");

const { offerExtractor } = require("./src");

// const test = offerExtractor('Earn $1 back on any subscription. News of tomorrow, today. Stay informed with WIRED. WIRED explores the ways technology is changing our lives - from culture to business, science to design. With a WIRED subscription, you get over 70 new online stories each week, subscriber-only newsletters, and weekly podcasts and video series tailored to your interests. After your initial term, your subscription will automatically renew for one year until you cancel. After your first renewal the term/rate may change. We\'ll send a notice before renewal with the term/rate in effect. If you do nothing, we\'ll charge the payment method you chose. Cancel at any time at wired.com/customerservice to get a refund for the portion remaining on your subscription. Current annual rates and information on the terms of your subscription can be found on the checkout page.')
// console.log(test)
// return
const INPUT_FILE = "./input.json";
fs.readFile(INPUT_FILE, "utf8", (err, data) => {
  if (err) {
    console.error(err);
    return;
  }
  const dataJSON = JSON.parse(data);
  const results = [];
  dataJSON.map((itm) => {
    if (!itm.trf_long_description) return;
    const result = offerExtractor(itm.trf_long_description);
    results.push(result);
  });
  data = JSON.stringify(results);
  fs.writeFileSync("results.json", data);
  const worksheet = XLSX.utils.json_to_sheet(results);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Dates");

  XLSX.writeFile(workbook, "result.csv");
});
