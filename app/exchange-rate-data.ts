import path from 'path';
import { MONTHS } from './constants';

export async function getExchangeRateData() {
  const filePath = path.join(process.cwd(), 'public', 'data.json');
  const file = Bun.file(filePath);
  const data = JSON.parse(await file.text());

  return data;
}

export async function getExchangeRateFormData() {
  const data = await getExchangeRateData();

  const yearsAndMonths = Object.fromEntries(
    Object.entries(data).map(([key, value]) => [
      key,
      Object.keys(value as Record<string, any>).sort(
        (a, b) => MONTHS.indexOf(a) - MONTHS.indexOf(b),
      ),
    ]),
  );

  const prioritisedCurrencies = ['EUR', 'USD'];
  const sortedRemainingCurrencies = Object.keys(data['2023']['January'])
    .filter((currency) => !prioritisedCurrencies.includes(currency))
    .sort();
  const currencies = prioritisedCurrencies.concat(sortedRemainingCurrencies);

  return { currencies, yearsAndMonths };
}
