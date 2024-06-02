'use server';

import { z } from 'zod';
import { cookies } from 'next/headers';
import { getExchangeRateData } from './exchange-rate-data';

const ExchangeRateFormSchema = z.object({
  currency: z.string(),
  destination: z.string().default('GBP'),
  month: z.string(),
  year: z.coerce.string(),
  amount: z.coerce.number(),
});

export async function performExchangeRateCalculation(
  _: any,
  formData: FormData,
) {
  const validatedFields = ExchangeRateFormSchema.safeParse(
    Object.fromEntries(formData.entries()),
  );

  if (!validatedFields.success) {
    return {
      currency: '',
      month: '',
      year: '',
      amount: 0,
      result: '£0.00',
      error: validatedFields.error.flatten().fieldErrors,
      exchangeRate: 0,
      destination: '',
    };
  }

  const { currency, month, year, amount, destination } = validatedFields.data;

  const data = await getExchangeRateData();

  const exchangeRate =
    data[year][month][currency === 'GBP' ? destination : currency];

  const calculate =
    currency === 'GBP' && destination !== 'GBP'
      ? () => amount * exchangeRate
      : () => amount / exchangeRate;

  const result = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: destination,
  }).format(calculate());

  const state = {
    currency,
    month,
    year,
    amount,
    result,
    exchangeRate,
    destination,
  };

  cookies().set('form_state', JSON.stringify(state));

  return state;
}
