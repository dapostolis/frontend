export default {
  regions: [
    {value: 'world', name: 'All'},
    {value: 'us', name: 'United States'},
    {value: 'uk', name: 'United Kingdom'},
    // {value: 'nordics', name: 'Nordics'},
    {value: 'eu', name: 'Eurozone'},
    {value: 'ch', name: 'Switzerland'},
  ],
  regionsDict: {
    world: 'World',
    us: 'United States',
    uk: 'United Kingdom',
    // nordics: 'Nordics',
    eu: 'Eurozone',
    ch: 'Switzerland',
  },
  sectors: [
    {value: 'all', name: 'All'},
    {value: 'Consumer Discretionary', name: 'Consumer Discretionary'},
    {value: 'Consumer Staples', name: 'Consumer Staples'},
    {value: 'Energy', name: 'Energy'},
    {value: 'Financials', name: 'Financials'},
    {value: 'Healthcare', name: 'Healthcare'},
    {value: 'Industrials', name: 'Industrials'},
    {value: 'Information Technology', name: 'Information Technology'},
    {value: 'Materials', name: 'Materials'},
    {value: 'Real Estate', name: 'Real Estate'},
    {value: 'Utilities', name: 'Utilities'},
  ],
  market_cap: [
    {value: 'all', name: 'All'},
    {value: 'lc', name: 'Large Cap'},
    {value: 'mc', name: 'Mid Cap'},
    {value: 'sc', name: 'Small Cap'},
  ],
  ref_currency: [
    {value: 'USD', name: 'USD'},
    {value: 'EUR', name: 'EUR'},
    {value: 'GBP', name: 'GBP'},
    {value: 'CHF', name: 'CHF'},
  ],
  frequency: [
    {value: 'M', name: 'Monthly'},
    {value: 'Q', name: 'Quarterly'},
    {value: 'SA', name: 'Semi-annually'},
    {value: 'A', name: 'Annually'},
  ],
  cat_weights: [
    {value: 'R', name: 'MinVol', rank: 'LOWER'},
  ],
};
