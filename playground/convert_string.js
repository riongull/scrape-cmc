var string = `  1    Bitcoin  BTC  $ 1,503,882,196   $ 135.58    11,092,162   Low Vol  0.32 % ? ? 
  2    Litecoin  LTC  $ 74,426,609   $ 4.33    17,170,739   Low Vol  0.12 % ? ? 
  3    Peercoin  PPC  $ 7,311,640   $ 0.389696    18,762,419   Low Vol  0.08 % ? ? 
  4    Namecoin  NMC  $ 6,414,724   $ 1.18    5,417,308   Low Vol  1.37 % ? ? 
  5    Terracoin  TRC  $ 1,522,275   $ 0.654561    2,325,642   Low Vol  0.53 % ? ? 
  6    Devcoin  DVC  $ 1,460,589   $ 0.000334    4,367,702,656   Low Vol  0.56 % ? ? 
  7    Novacoin  NVC  $ 1,152,424   $ 4.21    273,797   Low Vol  0.33 % ? ? `

var keys = [
    'rank',
    'name',
    'symbol',
    'marketcap',
    'price_usd',
    'supply',
    'change_1hr',
    'change_1day',
    'change_1week',
]

var output = string
    .split('\n')
    .map(line => line.split(' ')
        .filter(item => item.length > 0)
        .filter(item => item !== '$')
        .filter(item => item !== '%')
        .filter(item => item !== 'Low')
        .filter(item => item !== 'Vol')
        .reduce((obj, item, i) => {
            obj[keys[i]] = item
            return obj
        }, {})
    )

console.log(output);


// var marketcap = $('#total-marketcap').text();
// console.log(marketcap);
