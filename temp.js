

// Function to format date as YYYY-MM-DD
const formatDate = (date) => date.toISOString().split('T')[0];

// Function to add days to a date
const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

// Start date
let currentDate = new Date('2023-03-02');

// Async function to fetch data for a given date
async function fetchDataForDate(date) {
  const url = `https://svatkyapi.cz/api/day/${formatDate(date)}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Network response was not ok: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Fetch error for ${formatDate(date)}: ${error}`);
    return null;
  }
}

// Main async function to run the loop
async function main() {
  for (let i = 0; i < 200; i++) {
    const data = await fetchDataForDate(currentDate);
    if (data && data.name) {
      console.log(`${formatDate(currentDate)}: ${data.name}`);
    } else {
      console.log(`${formatDate(currentDate)}: No name data available`);
    }
    currentDate = addDays(currentDate, 1);
  }
}

// Run the main function
main().catch(error => console.error('Main function error:', error));