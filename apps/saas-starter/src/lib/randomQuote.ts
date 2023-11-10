const quotes = [
  'In the magical land of productivity software, time flies faster than a unicorn on roller skates.',
  'Productivity software: where dreams become to-do lists and tasks come to life.',
  'When productivity software dances, efficiency pirouettes and spreadsheets waltz.',
  'In the realm of productivity software, wizards and wizards-in-training unite to conquer the chaos of deadlines.',
  'Productivity software is the secret ingredient that turns everyday tasks into extraordinary feats of accomplishment.',
];

export function randomQuote() {
  const randomIndex = Math.floor(Math.random() * quotes.length);
  return quotes[randomIndex];
}
