# 📄 Document Similarity Checker Using OCR and NLP

This project is a Node.js-based web service that compares the content of two uploaded **PDF documents** (e.g., reference answer vs. student answer) and calculates the **textual similarity** between them.

---

## 🚀 Features

- 📤 Upload two PDF files (Reference & Student)
- 📄 Convert PDF to image using `pdf-poppler`
- 🔍 Extract text using `Tesseract OCR`
- 🧠 Tokenize and analyze text using `natural` (NLP library)
- 📊 Calculate similarity using **Jaro-Winkler distance**
- 🔁 Returns both extracted texts and their similarity score

---

## 🧰 Tech Stack

- **Backend:** Node.js, Express.js
- **OCR:** `tesseract.js`
- **PDF to Image:** `pdf-poppler`
- **NLP & Similarity:** `natural` (TF-IDF + Jaro-Winkler)
- **File Upload:** `multer`
- **Frontend Support:** Can be integrated via `/upload` API (multipart)

---

## 📂 API Endpoint

### POST `/upload`

Upload exactly **2 PDF files** as `multipart/form-data` under the key `files[]`.

**Response:**
```json
{
  "referenceText": "...",
  "studentText": "...",
  "similarity": "0.86",
  "message": "Text extraction & similarity calculation successful!"
}
