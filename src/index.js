//const re = new RegExp('Earn\S\W*')
//const re = new RegExp('Earn([\s\S]*)')
// const { NlpManager } = require("node-nlp");
// const manager = new NlpManager({ languages: ["en"], forceNER: true });
const reOfferAmt = /(Earn|Get) (.*?)[\s]?([\d\.\,]+)(.*?) (back|credit)/g;
const reMoney = /\$[\s]?([\d\.\,]+)/gi;
const rePercent = /[\d]+\%/gi;
const reFrequency =
  /(valid one time only|one-time|redeemed once| limit of ([\d\.\,]+)|redeemed (.*?) ([\d\.\,]+))/gi;
const reFrequencyNumber = /(one(.*?)time|once| ([\d\.\,]+))/gi;
const reSpentAmt = /(spend|purchase of) (.*?) (more)/gi;
const reSpentAmtTransactionCount = /one or more/gi;
const reLimitAmt =
  /((until|with a|limit|up to) (.*?)\$[\s]?([\d\.\,]+\d)|(maximum) (.*?)\$[\s]?([\d\.\,]+))/gi;

function offerExtractor(description) {
  const result = {
    description,
    earnOfferLang: null,
    offerCashbackDollarsValue: null,
    offerCashbackPercentValue: null,
    spendCriteriaLang: null,
    spendAmountMin: null,
    spendTransactionCount: null,
    qualifyingLimitLang: null,
    qualifyingLimitAmount: 9999999,
    qualifyingFrequencyLang: null,
    qualifyingFrequency: null,
  };
  const earnOfferLang = description.match(reOfferAmt);
  if (earnOfferLang) {
    result.earnOfferLang = earnOfferLang[0];
    const money = result.earnOfferLang.match(reMoney);
    result.offerCashbackDollarsValue = money
      ? Number(money[0]?.replace("$", "") || 0)
      : null;
    if (!money) {
      const percent = result.earnOfferLang.match(rePercent);
      result.offerCashbackPercentValue = Number(
        percent && percent[0]?.replace("%", "") | 0
      );
    }
  }
  const frequency = description.match(reFrequency);
  result.qualifyingFrequencyLang = frequency ? frequency[0] : null;
  if (frequency) {
    const frequencyStandard =
      result.qualifyingFrequencyLang.match(reFrequencyNumber);
    result.qualifyingFrequency = frequencyStandard
      ? isNaN(frequencyStandard[0])
        ? 1
        : Number(frequencyStandard[0])
      : null;
  }
  const spent = description.match(reSpentAmt);
  result.spendCriteriaLang = spent ? spent[0] : null;
  if (spent) {
    description = description.replace(result.spendCriteriaLang, "");
    const spendAmountMin = result.spendCriteriaLang.match(reMoney);
    result.spendAmountMin = Number(spendAmountMin[0]?.replace("$", "") || 0);

    const spendTransactionCount = result.spendCriteriaLang.match(
      reSpentAmtTransactionCount
    );
    result.spendTransactionCount = spendTransactionCount ? -1 : 1;
  }

  const limit = description.match(reLimitAmt);
  result.qualifyingLimitLang = limit ? limit[0] : null;
  if (limit) {
    const qualifyingLimitAmount = result.qualifyingLimitLang.match(reMoney);
    result.qualifyingLimitAmount = Number(
      qualifyingLimitAmount && qualifyingLimitAmount[0]?.replace("$", "") || 0
    );
    if (result.qualifyingFrequency > 1 && result.qualifyingFrequencyLang.includes("redeemed")) {
      result.qualifyingLimitAmount =
        result.qualifyingLimitAmount * result.qualifyingFrequency;
    }
  }
  if (!result.spendAmountMin) {
    result.spendAmountMin = result.offerCashbackDollarsValue || null;
  }

  return result;
}

exports.offerExtractor = offerExtractor;
return;

const reOfferValidity = new RegExp("Offer valid ([a-z]|[0-9]){1,}");
//const reOfferValidity = new RegExp('Offer valid \w*');
//inputText = 'Earn $50 back on your Showtime purchase Get instant access to commercial-free SHOWTIME original series, including Billions, The Chi, and Black Monday, plus hit Hollywood movies, documentaries, combat sports and more.  Watch live TV or catch up on demand on your TV, tablet, phone or computer. You can also download full episodes and movies to your mobile devices and watch them offline, wherever and whenever. Offer expires 9/30/2022. Offer valid one time only.   Offer not valid on third-party services. Payment must be made on or before offer expiration date.';
//inputText = 'Earn $5 cash back. Up to $5.00 Offer expires 10/26/2022. Offer valid one time only. Offer not valid on third-party services. Payment must be made on or before offer expiration date. Misfits Market is an affordable online grocery service that fights food waste. We source organic produce and high-quality pantry staples directly from farmers and makers, then deliver them to your door at up to 40% off grocery store prices. Skip the trip to the store and enjoy fresh, healthy food at home while you help fix the food system.'
inputText =
  "Earn $25 back on your SimpliSafe purchase, when you spend $250 or more. ";
offerAmountStartIndex = inputText.indexOf("Earn");
console.log(offerAmountStartIndex);
offerAmountEndIndex = inputText.slice(offerAmountStartIndex).indexOf(". ");
console.log(offerAmountEndIndex);
//offerAmountData = inputText.substr(inputText.indexOf('Earn'),inputText.slice(inputText.indexOf('Earn')).indexOf('. '))
offerAmountData = inputText.substr(offerAmountStartIndex, offerAmountEndIndex);
console.log(offerAmountData);
//const reofferLimit = new RegExp(('Up to \\$[0-9]*'|'up to [0-9]{1,}'))
//const reofferLimit = new RegExp('Up to \\$[0-9]*'|'up to [0-9]{1,}\\%');
//([a-z]|[0-9]|[A-Z]|\s) [\r\n] (\.*?)
//const reofferLimit = new RegExp('Up to \\$[0-9]*(.*\.\s){1}')
//const reofferLimit = new RegExp('up to [0-9]{1,}\\%')
//offerLimit = reofferLimit.exec(inputText)[0];
offerLimitStartIndex = inputText.indexOf("Up to");
//console.log(offerLimitStartIndex);
offerLimitEndIndex = inputText.slice(offerLimitStartIndex).indexOf(". ");
//console.log(offerLimitEndIndex);
offerLimitData = inputText.substr(offerLimitStartIndex, offerLimitEndIndex);
//console.log(inputText.slice(offerLimitStartIndex));
/*offerAmountdata = reOfferAmt.exec(inputText)[0];
offerValidity = reOfferValidity.exec(inputText)[0];*/
//console.log(offerLimit);
//console.log(offerAmountdata);
//console.log(offerValidity);
(async () => {
  await manager.train();
  manager.save();
  response = await manager.process("en", offerAmountData);
  //console.log(response.sourceEntities);
  //TO DO  - pick typeName: 'currency'
  //response = await manager.process('en', offerValidity);
  //response = await manager.process('en', offerLimitData);
  console.log(response.sourceEntities);
  //TO DO  - pick typeName:
  //console.log(response.sourceEntities);
})();
