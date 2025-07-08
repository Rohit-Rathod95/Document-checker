const path = require("path");
const fs = require("fs");
const poppler = require("pdf-poppler");

const convertPdfToImages = async (pdfPath, outputDir, format = "jpeg") => {
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }

    let opts = {
        format: format,
        out_dir: outputDir,
        out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
        page: null // Convert all pages
    };

    try {
        await poppler.convert(pdfPath, opts);
        console.log("Conversion successful! Images saved in:", outputDir);
    } catch (error) {
        console.error("Error converting PDF to images:", error);
    }
};

// Example usage
const pdfFile = "C:\Users\USER\OneDrive\Desktop\development\hackWack\Earth.pdf"; // Replace with your PDF file path
const outputFolder = "output_images";

fs.readdir(outputFolder, (err, files) => {
    if (err) {
        console.error("Error reading output folder:", err);
    } else {
        console.log("Generated Images:", files);
    }
});

convertPdfToImages(pdfFile, outputFolder);
