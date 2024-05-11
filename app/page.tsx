import { ExchangeRateForm } from '@/components/ExchangeRateForm';
import { getInitialState } from './form-state';
import { getExchangeRateFormData } from './exchange-rate-data';

export default async function Home() {
  const initialState = getInitialState();
  const { currencies, yearsAndMonths } = await getExchangeRateFormData();

  return (
    <main className="container max-w-screen-sm">
      <ExchangeRateForm
        initialState={initialState}
        yearsAndMonths={yearsAndMonths}
        currencies={currencies}
      />
    </main>
  );
}
