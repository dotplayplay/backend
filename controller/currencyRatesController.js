const CurrencyRate = require("../model/currency-rates");

const apiKey = "01dc908c351f48758ab957f64c701ec2";
const baseCurrency = "USD";
// const targetCurrencies = ["MYR", "SGD", "AUD", "IDR", "PHP", "VND", "CNY"];

const apiUrl = `https://open.er-api.com/v6/latest/${baseCurrency}?apikey=${apiKey}`;

async function syncCurrencyRates() {
  const data = await fetch(apiUrl).then((response) => response.json());
  const rates = Object.keys(data.rates).map(key => ({
    currency: key,
    rate: data.rates[key]
  }))
  return await CurrencyRate.findOneAndUpdate(
    {
      base: baseCurrency,
    },
    {
      $setOnInsert: { rates },
    },
    { upsert: true, new: true }
  );
}

const currencyRates = async (req, res) => {
    try {
      let ct = await CurrencyRate.findOne({base: "USD"}).lean();
      if (!ct) ct = await syncCurrencyRates();
      res.status(200).json({rates: ct.rates});
    } catch (error) {
      console.log("Error", error);
      res.status(500).json({ error });
    }
  };

module.exports = {
    syncCurrencyRates,
    currencyRates
};
