// DOM Elements
const inputCount = document.getElementById("input-count");
const inputFields = document.getElementById("input-fields");
const generateBtn = document.getElementById("generate-btn");
const qrCodeContainer = document.getElementById("qr-code-container");

// Function to create input fields
function createInputFields(count) {
  inputFields.innerHTML = ""; // Clear previous inputs
  qrCodeContainer.innerHTML = "";
  for (let i = 1; i <= count; i++) {
    const inputField = document.createElement("div");
    inputField.classList.add("flex", "flex-col", "space-y-2");
    inputField.innerHTML = `
          <label for="input-${i}" class="text-sm font-medium text-gray-700">Input ${i}</label>
          <input type="text" id="input-${i}" class="p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter text or URL">
        `;
    inputFields.appendChild(inputField);
  }
}

// Function to generate combined QR code
function generateCombinedQRCode() {
  qrCodeContainer.innerHTML = ""; // Clear previous QR code
  const count = parseInt(inputCount.value);
  const inputs = [];

  // Collect all inputs
  for (let i = 1; i <= count; i++) {
    const input = document.getElementById(`input-${i}`).value.trim();
    if (input) {
      inputs.push(input);
    }
  }

  // Generate combined QR code if there are inputs
  if (inputs.length > 0) {
    const combinedData = JSON.stringify(inputs); // Combine inputs as JSON
    const qrCodeDiv = document.createElement("div");
    qrCodeDiv.id = "combined-qr-code";
    qrCodeContainer.appendChild(qrCodeDiv);

    // Generate QR code
    new QRCode(document.getElementById("combined-qr-code"), {
      text: combinedData,
      width: 256,
      height: 256,
    });
  } else {
    alert("Please enter at least one input.");
  }
}

// Event Listeners
inputCount.addEventListener("change", () => {
  const count = parseInt(inputCount.value);
  createInputFields(count);
});

generateBtn.addEventListener("click", generateCombinedQRCode);

// Initialize with 1 input field
createInputFields(1);
