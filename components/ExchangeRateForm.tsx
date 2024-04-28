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
import { MONTHS } from '@/app/constants';
import { Separator } from './ui/separator';
import { Output } from './ui/output';

export function ExchangeRateForm() {
  const [state, action] = useFormState(performExchangeRateCalculation, {
    result: null,
  });
  const [currency, setCurrency] = React.useState('');
  console.log(state);
  return (
    <form action={action} className="flex flex-col gap-4 p-4">
      <div>
        <Label htmlFor="currency">Origin Currency</Label>
        <Select name="currency" onValueChange={setCurrency}>
          <SelectTrigger>
            <SelectValue
              placeholder="Currency"
              defaultValue="EUR"
              id="currency"
            />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="EUR">Euro</SelectItem>
            <SelectItem value="USD">US Dollar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="amount">
          Amount {currency ? `(${currency})` : null}
        </Label>
        <Input type="number" id="amount" name="amount" step=".01" />
      </div>

      <div className="flex gap-4">
        <div>
          <Label htmlFor="month">Month</Label>
          <Select name="month">
            <SelectTrigger className="w-60">
              <SelectValue
                placeholder="Month"
                defaultValue="January"
                id="month"
              />
            </SelectTrigger>
            <SelectContent>
              {MONTHS.map((month) => (
                <SelectItem key={month} value={month}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="year">Year</Label>
          <Select name="year">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Year" defaultValue="2023" id="year" />
            </SelectTrigger>
            <SelectContent>
              {['2022', '2023'].map((year) => (
                <SelectItem key={year} value={year}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit">Submit</Button>
      <Separator />
      <div>
        <Label htmlFor="result">Result</Label>
        <Output id="result" name="result" htmlFor="amount currency month year">
          {state.result}
        </Output>
      </div>
    </form>
  );
}
