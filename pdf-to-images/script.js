// DOM Elements
const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const imageContainer = document.getElementById("image-container");
const downloadAllButton = document.getElementById("download-all");

let images = [];

// Prevent default drag behaviors
["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
});

// Highlight drop zone when dragging over
["dragenter", "dragover"].forEach((eventName) => {
  dropZone.addEventListener(eventName, () => {
    dropZone.classList.add("border-blue-500");
  });
});

// Remove highlight when dragging leaves
["dragleave", "drop"].forEach((eventName) => {
  dropZone.addEventListener(eventName, () => {
    dropZone.classList.remove("border-blue-500");
  });
});

// Handle dropped files
dropZone.addEventListener("drop", (e) => {
  const files = e.dataTransfer.files;
  handleFiles(files);
});

// Handle file input change
fileInput.addEventListener("change", (e) => {
  const files = e.target.files;
  handleFiles(files);
});

// Handle click on drop zone to trigger file input
dropZone.addEventListener("click", () => {
  fileInput.click();
});

// Handle uploaded files
function handleFiles(files) {
  if (files.length === 0) return;

  const file = files[0];

  // Check if the file is a PDF
  if (file.type !== "application/pdf") {
    alert("Please upload a valid PDF file.");
    return;
  }

  // Clear previous images
  imageContainer.innerHTML = "";
  images = [];

  // Convert PDF to images
  convertPdfToImages(file);
}

// Convert PDF to images
async function convertPdfToImages(file) {
  const fileReader = new FileReader();
  fileReader.onload = async (e) => {
    const pdfData = new Uint8Array(e.target.result);
    const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const viewport = page.getViewport({ scale: 2 }); // Increase scale for better quality
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      // Set canvas size
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Draw the page on the canvas
      await page.render({
        canvasContext: context,
        viewport: viewport,
      }).promise;

      // Convert canvas to image
      const image = new Image();
      image.src = canvas.toDataURL("image/png");

      // Add border to the preview image
      image.classList.add(
        "w-full",
        "h-auto",
        "border",
        "border-gray-300",
        "rounded-lg"
      );

      // Create download link
      const downloadLink = document.createElement("a");
      downloadLink.href = image.src;
      downloadLink.download = `page-${i}.png`;
      downloadLink.textContent = `Download Page ${i}`;
      downloadLink.classList.add(
        "bg-blue-500",
        "text-white",
        "px-4",
        "py-2",
        "rounded-lg",
        "hover:bg-blue-600",
        "transition-colors",
        "inline-block",
        "mt-2"
      );

      // Append image and download link to container
      const imageWrapper = document.createElement("div");
      imageWrapper.classList.add("flex", "flex-col", "items-center", "gap-2");
      imageWrapper.appendChild(image);
      imageWrapper.appendChild(downloadLink);
      imageContainer.appendChild(imageWrapper);

      // Save image data for bulk download
      images.push({ src: image.src, name: `page-${i}.png`, canvas });
    }

    // Show the "Download All Images" button
    downloadAllButton.classList.remove("hidden");
  };
  fileReader.readAsArrayBuffer(file);
}

// Download all images as a ZIP file
downloadAllButton.addEventListener("click", () => {
  const zip = new JSZip();
  images.forEach((image, index) => {
    const canvas = image.canvas;

    // Convert the canvas to a data URL
    const imageData = canvas.toDataURL("image/png");

    // Add the image to the ZIP file
    zip.file(image.name, imageData.split("base64,")[1], { base64: true });
  });

  // Generate and download the ZIP file
  zip.generateAsync({ type: "blob" }).then((content) => {
    saveAs(content, "images.zip");
  });
});
