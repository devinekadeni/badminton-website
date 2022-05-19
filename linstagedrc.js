module.exports = {
  '**/*.ts?(x)': () => 'tsc --noEmit --pretty',
  '**/*.{js,jsx,ts,tsx}': (filenames) =>
    `next lint --fix --file ${filenames
      .map((file) => file.split(process.cwd())[1])
      .join(' --file ')}`,
  '*.{ts,tsx,js,jsx,css,scss,md}': 'prettier --write'
}