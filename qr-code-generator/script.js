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
    inputField.classList.add(
      "flex",
      "flex-row",
      "space-y-2",
      "justify-center",
      "items-center",
      "gap-4"
    );
    inputField.innerHTML = `
          <div class = "flex flex-row  justify-between items-center "> 
          <label for="title-${i}" class="text-sm font-medium text-gray-700 ">Title ${i}</label>
          <input type="text" id="title-${i}" class="w-3/4 p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter title">
          </div>
          <div class = "flex flex-row  justify-between items-center w-full">
          <label for="input-${i}" class="text-sm font-medium text-gray-700">Input ${i}</label>
          <input type="text" id="input-${i}" class="p-2  w-[450px] border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Enter text or URL">
          </div>
        `;
    inputFields.appendChild(inputField);
  }
}

// Function to generate combined QR code
function generateCombinedQRCode() {
  qrCodeContainer.innerHTML = ""; // Clear previous QR code
  const count = parseInt(inputCount.value);
  const inputs = [];
  const keys = [];
  const values = [];

  // Collect all inputs
  for (let i = 1; i <= count; i++) {
    const input = document.getElementById(`input-${i}`).value.trim();
    const title = document.getElementById(`title-${i}`).value.trim();
    const val = document.getElementById(`input-${i}`).value.trim();

    if (title && val) {
      keys.push(title);
      values.push(val);
    }
  }
  const data = Object.assign(
    {},
    ...keys.map((key, index) => ({ [key]: values[index] }))
  );
  console.log(Object.entries(data).length);
  // Generate combined QR code if there are inputs
  if (Object.entries(data).length > 0) {
    const combinedData = JSON.stringify(data); // Combine inputs as JSON
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
