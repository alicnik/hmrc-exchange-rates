import { cookies } from 'next/headers';

export const FORM_STATE_COOKIE_NAME = 'form_state';

const defaultState = {
  currency: 'EUR',
  month: 'January',
  year: '2023',
  amount: 0,
  result: new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
  }).format(0),
  exchangeRate: 1.1652,
  destination: 'GBP',
};

export type FormState = typeof defaultState;

export function getInitialState() {
  const stateCookie = cookies().get('form_state');

  if (!stateCookie) {
    return defaultState;
  }

  return JSON.parse(stateCookie.value);
}
