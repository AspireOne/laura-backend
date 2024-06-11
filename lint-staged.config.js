/*
module.exports = {
  "**!/!*.{js,jsx,ts,tsx}": (filenames) => [
    `npx eslint --fix ${filenames
      .map((filename) => `"${filename}"`)
      .join(" ")}`,
  ],
  "**!/!*.(md|json)": (filenames) =>
    `npx prettier --write ${filenames
      .map((filename) => `"${filename}"`)
      .join(" ")}`,
};
*/

module.exports = {
  '**/*.{js,jsx,ts,tsx}': 'npx eslint --fix',
  '**/*.(md|json)': 'npx prettier --write',
};
