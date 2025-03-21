const textInput = document.getElementById("text-input");
const wordCount = document.getElementById("word-count");
const charCountWithSpaces = document.getElementById("char-count-with-spaces");
const charCountWithoutSpaces = document.getElementById(
  "char-count-without-spaces"
);
const clearButton = document.getElementById("clear-button");

// Function to update counters
const updateCounters = () => {
  const text = textInput.value;

  // Word Count
  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0);
  wordCount.textContent = words.length;

  // Character Count (with spaces)
  charCountWithSpaces.textContent = text.length;

  // Character Count (without spaces)
  const charsWithoutSpaces = text.replace(/\s+/g, "").length;
  charCountWithoutSpaces.textContent = charsWithoutSpaces;
};

// Event listener for text input
textInput.addEventListener("input", updateCounters);

// Event listener for clear button
clearButton.addEventListener("click", () => {
  textInput.value = ""; // Clear the textarea
  updateCounters(); // Reset counters to 0
});
