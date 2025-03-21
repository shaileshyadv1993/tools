// DOM Elements
const dropZone = document.getElementById("drop-zone");
const fileInput = document.getElementById("file-input");
const imageContainer = document.getElementById("image-container");
const generatePdfButton = document.getElementById("generate-pdf");
const marginInput = document.getElementById("margin");
const marginValue = document.getElementById("margin-value");
const pdfPreviewModal = document.getElementById("pdf-preview-modal");
const pdfPreview = document.getElementById("pdf-preview");
const pdfCanvas = document.getElementById("pdf-canvas");
const downloadPdfButton = document.getElementById("download-pdf");
const closePreviewButton = document.getElementById("close-preview");
const nav = document.getElementById("nav-Id");

let images = [];
let pdfBlob = null;

// Update margin value display
marginInput.addEventListener("input", () => {
  marginValue.textContent = marginInput.value;
});

// Trigger file input when drop zone is clicked
dropZone.addEventListener("click", () => {
  fileInput.click();
});

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

// Handle uploaded files
function handleFiles(files) {
  for (const file of files) {
    // Check if the file is a PNG or JPEG
    if (!file.type.match(/image\/(png|jpeg)/)) {
      alert(
        `File "${file.name}" is not a PNG or JPEG. Please upload only PNG or JPEG files.`
      );
      continue; // Skip non-PNG/JPEG files
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = document.createElement("img");
      img.src = e.target.result;
      img.classList.add(
        "w-24",
        "h-24",
        "object-cover",
        "rounded-lg",
        "shadow-sm"
      );

      // Add drag handle to image
      const dragHandle = document.createElement("div");
      dragHandle.classList.add(
        "drag-handle",
        "cursor-move",
        "bg-gray-200",
        "p-1",
        "rounded-full"
      );
      dragHandle.innerHTML = "↕️"; // Drag icon

      // Add image name
      const imageName = document.createElement("span");
      imageName.textContent = file.name;
      imageName.classList.add("text-sm", "text-gray-600");

      // Add fancy delete button
      const deleteButton = document.createElement("button");
      deleteButton.innerHTML = "Delete";
      deleteButton.classList.add(
        "bg-red-500",
        "text-white",
        "px-2",
        "py-1",
        "rounded-lg",
        "hover:bg-red-600",
        "transition-colors"
      );
      deleteButton.addEventListener("click", () => {
        imageWrapper.remove();
        images = images.filter((image) => image.src !== e.target.result);
      });

      const imageWrapper = document.createElement("div");
      imageWrapper.classList.add("flex", "items-center", "gap-2");
      imageWrapper.appendChild(dragHandle);
      imageWrapper.appendChild(img);
      imageWrapper.appendChild(imageName);
      imageWrapper.appendChild(deleteButton);

      imageContainer.appendChild(imageWrapper);
      images.push({ src: e.target.result, name: file.name, type: file.type });
    };
    reader.readAsDataURL(file);
  }
}

// Initialize Sortable for reordering images
const sortable = new Sortable(imageContainer, {
  animation: 150,
  handle: ".drag-handle", // Add a drag handle to images
  onEnd: (event) => {
    // Update the `images` array to reflect the new order
    const newOrder = Array.from(imageContainer.children).map((child) => {
      const img = child.querySelector("img");
      return images.find((image) => image.src === img.src);
    });
    images = newOrder;
  },
});

// Render PDF preview using PDF.js
async function renderPdfPreview(pdfBlob) {
  const pdfData = await pdfBlob.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: pdfData }).promise;

  // Clear previous canvas
  pdfPreview.innerHTML = "";

  // Render each page
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const viewport = page.getViewport({ scale: 1.7 });
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = viewport.width;
    canvas.height = viewport.height;

    await page.render({ canvasContext: context, viewport }).promise;
    pdfPreview.appendChild(canvas);
  }
}

// Generate PDF and show preview
generatePdfButton.addEventListener("click", async () => {
  if (images.length === 0) {
    alert("Please upload at least one image.");
    return;
  }

  const margin = parseInt(marginInput.value, 10); // Get margin value
  const { PDFDocument } = PDFLib;
  const pdfDoc = await PDFDocument.create();

  for (const image of images) {
    const imageBytes = await fetch(image.src).then((res) => res.arrayBuffer());

    let imageEmbed;
    if (image.type === "image/png") {
      imageEmbed = await pdfDoc.embedPng(imageBytes); // Embed PNG
    } else if (image.type === "image/jpeg") {
      imageEmbed = await pdfDoc.embedJpg(imageBytes); // Embed JPEG
    } else {
      alert(`Unsupported image type: ${image.type}`);
      continue;
    }

    // Calculate centered position
    const pageWidth = imageEmbed.width + margin * 2;
    const pageHeight = imageEmbed.height + margin * 2;

    const page = pdfDoc.addPage([pageWidth, pageHeight]);

    // Center the image on the page
    const x = (pageWidth - imageEmbed.width) / 2;
    const y = (pageHeight - imageEmbed.height) / 2;

    page.drawImage(imageEmbed, {
      x,
      y,
      width: imageEmbed.width,
      height: imageEmbed.height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

  // Show PDF preview
  pdfPreview.innerHTML = ""; // Clear previous preview
  await renderPdfPreview(pdfBlob);
  nav.classList.add("hidden");
  pdfPreviewModal.classList.remove("hidden");
});

// Download PDF when confirmed
downloadPdfButton.addEventListener("click", () => {
  if (!pdfBlob) return;
  const link = document.createElement("a");
  link.href = URL.createObjectURL(pdfBlob);
  link.download = "combined.pdf";
  link.click();
  nav.classList.remove("hidden");
  pdfPreviewModal.classList.add("hidden");
});

// Close preview modal
closePreviewButton.addEventListener("click", () => {
  nav.classList.remove("hidden");
  pdfPreviewModal.classList.add("hidden");
});
