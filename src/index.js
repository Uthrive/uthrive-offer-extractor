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
    spendAmountMin: 0,
    qualifyingLimitLang: null,
    qualifyingLimitAmount: 9999999,
    qualifyingFrequencyLang: null,
    qualifyingFrequency: 255,
    numOfferLimit: null,
    offerMultipleTransaction: "N",
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

    const offerMultipleTransaction = result.spendCriteriaLang.match(
      reSpentAmtTransactionCount
    );
    result.offerMultipleTransaction = offerMultipleTransaction ? "Y" : "N";
  }

  const limit = description.match(reLimitAmt);
  result.qualifyingLimitLang = limit ? limit[0] : null;
  if (limit) {
    const qualifyingLimitAmount = result.qualifyingLimitLang.match(reMoney);
    result.qualifyingLimitAmount = Number(
      (qualifyingLimitAmount && qualifyingLimitAmount[0]?.replace("$", "")) || 0
    );
  }
  if (result.offerCashbackDollarsValue) {
    result.qualifyingLimitAmount = result.offerCashbackDollarsValue;
  }
  if (!result.spendAmountMin) {
    result.spendAmountMin = result.offerCashbackDollarsValue || 0;
  }
  result.numOfferLimit = result.qualifyingFrequency;

  return result;
}

exports.offerExtractor = offerExtractor;
