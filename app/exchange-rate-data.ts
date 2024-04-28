import path from 'path';
import { MONTHS } from './constants';
import fs from 'fs/promises';

export async function getExchangeRateData() {
  const filePath = path.join(process.cwd(), 'public', 'data.json');
  const contents = await fs.readFile(filePath, { encoding: 'utf-8' });
  const data = JSON.parse(contents);

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
