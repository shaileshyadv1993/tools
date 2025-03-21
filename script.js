// DOM Elements
const toolSelect = document.getElementById("tool-select");
const toolDisplay = document.getElementById("tool-display");

// Tool Templates
const tools = {
  "image-to-pdf": `
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-2xl font-bold mb-4">Image to PDF Converter</h2>
      <p class="text-gray-600 mb-4">Convert multiple images into a single PDF file.</p>
      <a href="image-to-pdf/index.html" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">Open Tool</a>
    </div>
  `,
  "pdf-to-images": `
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-2xl font-bold mb-4">PDF to Images Converter</h2>
      <p class="text-gray-600 mb-4">Convert a PDF file into multiple images.</p>
      <a href="pdf-to-images/index.html" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">Open Tool</a>
    </div>
  `,
  "qr-code-generator": `
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-2xl font-bold mb-4">QR Code Generator</h2>
      <p class="text-gray-600 mb-4">Generate QR codes for multiple inputs.</p>
      <div class="mb-6">
        <label for="input-count" class="block text-sm font-medium text-gray-700">Number of Inputs</label>
        <select id="input-count" class="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
      </div>
      <div id="input-fields" class="space-y-4"></div>
      <button id="generate-btn" class="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors w-full">Generate QR Codes</button>
      <div id="qr-codes" class="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"></div>
    </div>
  `,
  "unit-converter": `
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-2xl font-bold mb-4">Unit Converter</h2>
      <p class="text-gray-600 mb-4">Convert between different units of measurement.</p>
      <a href="#" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">Open Tool</a>
    </div>
  `,
  "scientific-calculator": `
    <div class="bg-white rounded-lg shadow-lg p-6">
      <h2 class="text-2xl font-bold mb-4">Scientific Calculator</h2>
      <p class="text-gray-600 mb-4">Perform advanced scientific calculations.</p>
      <a href="#" class="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">Open Tool</a>
    </div>
  `,
};

// Handle tool selection
toolSelect.addEventListener("change", (e) => {
  const selectedTool = e.target.value;

  if (selectedTool) {
    toolDisplay.innerHTML = tools[selectedTool];
    toolDisplay.classList.remove("hidden");

    // Initialize QR Code Generator if selected
    if (selectedTool === "qr-code-generator") {
      initializeQRCodeGenerator();
    }
  } else {
    toolDisplay.innerHTML = "";
    toolDisplay.classList.add("hidden");
  }
});

// Function to initialize QR Code Generator
function initializeQRCodeGenerator() {
  const inputCount = document.getElementById("input-count");
  const inputFields = document.getElementById("input-fields");
  const generateBtn = document.getElementById("generate-btn");
  const qrCodes = document.getElementById("qr-codes");

  // Function to create input fields
  function createInputFields(count) {
    inputFields.innerHTML = ""; // Clear previous inputs
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

  // Function to generate QR codes
  function generateQRCodes() {
    qrCodes.innerHTML = ""; // Clear previous QR codes
    const count = parseInt(inputCount.value);

    for (let i = 1; i <= count; i++) {
      const input = document.getElementById(`input-${i}`).value.trim();
      if (input) {
        const qrCodeContainer = document.createElement("div");
        qrCodeContainer.classList.add(
          "flex",
          "flex-col",
          "items-center",
          "space-y-2"
        );
        qrCodeContainer.innerHTML = `
          <div id="qr-code-${i}" class="w-48 h-48"></div>
          <p class="text-sm text-gray-600">Input ${i}</p>
        `;
        qrCodes.appendChild(qrCodeContainer);

        // Generate QR code
        new QRCode(document.getElementById(`qr-code-${i}`), {
          text: input,
          width: 128,
          height: 128,
        });
      }
    }
  }

  // Event Listeners for QR Code Generator
  inputCount.addEventListener("change", () => {
    const count = parseInt(inputCount.value);
    createInputFields(count);
  });

  generateBtn.addEventListener("click", generateQRCodes);

  // Initialize with 1 input field
  createInputFields(1);
}

const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("mobile-menu");

mobileMenuButton.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});
