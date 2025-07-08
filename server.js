const express = require("express");
const multer = require("multer");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const tesseract = require("tesseract.js");
const poppler = require("pdf-poppler");
const natural = require("natural");

const app = express();
const port = 4000;
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));
const upload = multer({ dest: "uploads/" });

const convertPdfToImage = async (pdfPath) => {
    const outputPath = path.join(__dirname, "uploads");
    const outputPrefix = "output_page";

    const options = {
        format: "png",
        out_dir: outputPath,
        out_prefix: outputPrefix,
        page: 1,
    };

    try {
        await poppler.convert(pdfPath, options);
        const imagePath = path.join(outputPath, `${outputPrefix}-1.png`);
        if (!fs.existsSync(imagePath)) {
            throw new Error("Image file not created.");
        }
        console.log(`Image saved at: ${imagePath}`);
        return imagePath;
    } catch (error) {
        console.error(`PDF to Image Conversion Failed: ${error.message}`);
        throw new Error("PDF conversion failed.");
    }
};

const extractTextFromImage = async (imagePath) => {
    try {
        console.log(`Extracting text from: ${imagePath}`);
        const { data: { text } } = await tesseract.recognize(imagePath, 'eng');
        console.log(`Extracted Text:\n${text}`);
        return text;
    } catch (error) {
        console.error(`OCR Failed: ${error.message}`);
        throw new Error("Text extraction failed.");
    }
};

const calculateSimilarity = (text1, text2) => {
    const tokenizer = new natural.WordTokenizer();
    const words1 = tokenizer.tokenize(text1.toLowerCase());
    const words2 = tokenizer.tokenize(text2.toLowerCase());

    const tfidf = new natural.TfIdf();
    tfidf.addDocument(words1.join(" "));
    tfidf.addDocument(words2.join(" "));

    return natural.JaroWinklerDistance(words1.join(" "), words2.join(" "));
};

app.post("/upload", upload.array("files", 2), async (req, res) => {
    try {
        if (!req.files || req.files.length < 2) {
            return res.status(400).json({ error: "Upload two PDFs (Reference & Student's answer)!" });
        }

        let extractedTexts = [];
        for (const file of req.files) {
            const imagePath = await convertPdfToImage(file.path);
            const extractedText = await extractTextFromImage(imagePath);
            extractedTexts.push(extractedText);
        }

        const similarity = calculateSimilarity(extractedTexts[0], extractedTexts[1]);
        res.json({
            referenceText: extractedTexts[0],
            studentText: extractedTexts[1],
            similarity: similarity.toFixed(2),
            message: "Text extraction & similarity calculation successful!",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
