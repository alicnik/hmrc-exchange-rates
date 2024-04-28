'use server';

import { z } from 'zod';
import { MONTHS } from './constants';

const ExchangeRateFormSchema = z.object({
  currency: z.enum(['EUR', 'USD']),
  month: z.enum(MONTHS),
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
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { currency, month, year, amount } = validatedFields.data;

  const exchangeRate = 1.2631; // hardcoded USD for September 2023

  const formatter = new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  });
  const result = amount / exchangeRate;

  return {
    result: formatter.format(result) || null,
  };
}
