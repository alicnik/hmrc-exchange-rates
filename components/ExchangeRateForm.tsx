'use client';

import * as React from 'react';
import { useFormState } from 'react-dom';
import { performExchangeRateCalculation } from '@/app/actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Separator } from './ui/separator';
import { Output } from './ui/output';
import { FormState } from '@/app/form-state';
import { cn } from '@/lib/utils';
import { CopyToClipboard } from './CopyToClipboard';

type ExchangeRateFormProps = {
  initialState: FormState;
  currencies: string[];
  yearsAndMonths: Record<string, string[]>;
};

export function ExchangeRateForm({
  initialState,
  currencies,
  yearsAndMonths,
}: ExchangeRateFormProps) {
  const [state, action] = useFormState(
    performExchangeRateCalculation,
    initialState,
  );

  const [currency, setCurrency] = React.useState(state.currency);
  const [month, setMonth] = React.useState(state.month);
  const [year, setYear] = React.useState(state.year);

  const monthsWithData = yearsAndMonths[year];
  const isDifferentMonthOrYear = state.year !== year || state.month !== month;

  const explanatoryNote = `${state.amount.toFixed(2)} ${
    state.currency
  } converted to ${state.result
    .toString()
    .slice(1)} ${state.destination} using HMRC exchange rate for ${state.month} ${
    state.year
  } at ${state.exchangeRate}.`;

  return (
    <form action={action} className="flex flex-col gap-4 p-4">
      <div className="space-y-1">
        <Label htmlFor="currency">Origin Currency</Label>
        <Select
          defaultValue={state.currency}
          name="currency"
          onValueChange={setCurrency}
        >
          <SelectTrigger>
            <SelectValue placeholder="Currency" id="currency" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="GBP">GBP</SelectItem>
            {currencies.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {currency === 'GBP' ? (
        <div className="space-y-1">
          <Label htmlFor="currency">Destination Currency</Label>
          <Select defaultValue="GBP" name="destination">
            <SelectTrigger>
              <SelectValue placeholder="Currency" id="currency" />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : null}

      <div className="space-y-1">
        <Label htmlFor="amount">
          Amount {currency ? `(${currency})` : null}
        </Label>
        <Input
          type="number"
          id="amount"
          name="amount"
          step=".01"
          defaultValue={state.amount}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex-grow space-y-1">
          <Label htmlFor="month">Month</Label>
          <Select
            name="month"
            defaultValue={state.month}
            value={monthsWithData.includes(month) ? month : monthsWithData[0]}
            onValueChange={setMonth}
          >
            <SelectTrigger>
              <SelectValue placeholder="Month" id="month" />
            </SelectTrigger>
            <SelectContent>
              {monthsWithData.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Label htmlFor="year">Year</Label>
          <Select name="year" defaultValue={state.year} onValueChange={setYear}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Year" id="year" />
            </SelectTrigger>
            <SelectContent>
              {Object.keys(yearsAndMonths).map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit">Submit</Button>

      <Separator className="my-8" />

      <div className="space-y-2">
        <div className="flex gap-2">
          <Label>Exchange Rate Note</Label>{' '}
          <CopyToClipboard text={explanatoryNote} />
        </div>
        <p className="text-sm">
          {state.result !== '£0.00' ? (
            <span className={cn(isDifferentMonthOrYear && 'text-warning')}>
              {explanatoryNote}
            </span>
          ) : (
            'Please enter an amount above then click submit.'
          )}
        </p>
      </div>

      <div className="space-y-1">
        <Label htmlFor="result">Result</Label>
        <Output id="result" name="result" htmlFor="amount currency month year">
          {state.result}
        </Output>
      </div>
    </form>
  );
}
