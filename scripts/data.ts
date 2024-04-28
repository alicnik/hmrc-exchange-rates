import parse from 'csv-simple-parser';
import fs from 'fs/promises';

type Row = {
  'Country/Territories': string;
  Currency: string;
  'Currency Code': string;
  'Currency Units per £1': string;
  'Start date': `${number}/${number}/${number}`;
  'End date': `${number}/${number}/${number}`;
};

const filenames = await fs.readdir('./data');

const csvData = await Promise.all(
  filenames.map(async (filename) => {
    const file = Bun.file(`./data/${filename}`);
    const text = await file.text();
    return parse(text, { header: true }) as Row[];
  }),
);

const data = csvData.reduce((acc, rows) => {
  const [monthInput, yearInput] = rows[0]['Start date'].split('/').slice(-2);
  const date = new Date(Number(yearInput), Number(monthInput) - 1);
  const [month, year] = date
    .toLocaleString('default', { month: 'long', year: 'numeric' })
    .split(' ');

  const rowData = rows.reduce((acc, row) => {
    const code = row['Currency Code'];
    const rate = row['Currency Units per £1'];

    if (!code || !rate || acc[code] != null) {
      return acc;
    }

    return {
      ...acc,
      [code]: Number(rate),
    };
  }, {} as { [currencyCode: string]: number });

  return {
    ...acc,
    [year]: {
      ...acc[year],
      [month]: rowData,
    },
  };
}, {} as { [year: string]: { [month: string]: { [currencyCode: string]: number } } });

await Bun.write('./public/data.json', JSON.stringify(data));
