// Ensure jsPDF is loaded
const { jsPDF } = window.jspdf;

// Variables to store images and PDF blob
let frontImage = null;
let backImage = null;
let pdfBlob = null;

// Drag and Drop Handlers
function handleDragOver(event) {
  event.preventDefault();
  event.currentTarget.classList.add("drag-over");
}

function handleDragLeave(event) {
  event.preventDefault();
  event.currentTarget.classList.remove("drag-over");
}

function handleDrop(event, type) {
  event.preventDefault();
  event.currentTarget.classList.remove("drag-over");
  const file = event.dataTransfer.files[0];
  if (file && file.type.startsWith("image/")) {
    const input =
      type === "front"
        ? document.getElementById("frontFileInput")
        : document.getElementById("backFileInput");
    input.files = event.dataTransfer.files;
    handleFile(file, type);
  }
}

// File Input Change Handler
function handleFileChange(event, type) {
  const file = event.target.files[0];
  if (file && file.type.startsWith("image/")) {
    handleFile(file, type);
  }
}

// Handle File Upload
function handleFile(file, type) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const preview =
      type === "front"
        ? document.getElementById("frontPreview")
        : document.getElementById("backPreview");
    preview.src = e.target.result;
    preview.classList.remove("hidden");
    if (type === "front") {
      frontImage = e.target.result;
    } else {
      backImage = e.target.result;
    }
  };
  reader.readAsDataURL(file);
}

// Margin Slider
const marginRange = document.getElementById("marginRange");
const marginValue = document.getElementById("marginValue");
marginRange.addEventListener("input", () => {
  marginValue.textContent = `${marginRange.value}px`;
});

// Generate PDF
const generateBtn = document.getElementById("generateBtn");
const pdfPopup = document.getElementById("pdfPopup");
const pdfPreview = document.getElementById("pdfPreview");
const downloadBtn = document.getElementById("downloadBtn");
const closePopup = document.getElementById("closePopup");

generateBtn.addEventListener("click", () => {
  if (!frontImage || !backImage) {
    alert("Please upload both images.");
    return;
  }

  const doc = new jsPDF();
  const imgWidth = 180;
  const imgHeight = 120;
  const margin = parseInt(marginRange.value);

  doc.addImage(frontImage, "JPEG", 15, 15, imgWidth, imgHeight);
  doc.addImage(
    backImage,
    "JPEG",
    15,
    15 + imgHeight + margin,
    imgWidth,
    imgHeight
  );

  pdfBlob = doc.output("blob");
  const pdfUrl = URL.createObjectURL(pdfBlob);
  pdfPreview.src = pdfUrl;
  pdfPopup.classList.remove("hidden");
});

// Download PDF
downloadBtn.addEventListener("click", () => {
  if (pdfBlob) {
    const link = document.createElement("a");
    link.href = URL.createObjectURL(pdfBlob);
    link.download = "combined.pdf";
    link.click();
    URL.revokeObjectURL(link.href); // Clean up
    pdfBlob = null; // Ensure download happens only once
  }
});

// Close Popup
closePopup.addEventListener("click", () => {
  pdfPopup.classList.add("hidden");
});

// Add event listeners for drag-and-drop and file input
document
  .getElementById("frontDropZone")
  .addEventListener("dragover", handleDragOver);
document
  .getElementById("frontDropZone")
  .addEventListener("dragleave", handleDragLeave);
document
  .getElementById("frontDropZone")
  .addEventListener("drop", (event) => handleDrop(event, "front"));

document
  .getElementById("backDropZone")
  .addEventListener("dragover", handleDragOver);
document
  .getElementById("backDropZone")
  .addEventListener("dragleave", handleDragLeave);
document
  .getElementById("backDropZone")
  .addEventListener("drop", (event) => handleDrop(event, "back"));

document
  .getElementById("frontFileInput")
  .addEventListener("change", (event) => handleFileChange(event, "front"));
document
  .getElementById("backFileInput")
  .addEventListener("change", (event) => handleFileChange(event, "back"));
