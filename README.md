# Email Sender with PDF Folder Integration

## 📁 PDF Folder Setup

### 1. Create the PDF Folder
Create a folder named `pdfs` in your project directory:
```
your-project/
├── index.html
├── pdfs/          ← Create this folder
└── README.md
```

### 2. Add Your PDF Files
Place any PDF files you want to automatically include in emails into the `pdfs` folder:
```
pdfs/
├── company-brochure.pdf
├── terms-and-conditions.pdf
├── contact-info.pdf
└── any-other-document.pdf
```

### 3. How It Works
- **Local PDF Selection**: Click the "Select PDFs from Local Folder" button to choose PDFs from your computer
- **Automatic Inclusion**: Selected PDFs are automatically uploaded to Firebase and included in every email
- **Visual Indicators**: Local PDFs show a green "From Local Folder" label
- **Easy Management**: Remove PDFs individually or replace them as needed

## 🚀 Features

- **Automatic PDF Upload**: PDFs are uploaded to Firebase Storage
- **Email Integration**: All selected PDFs are automatically attached to emails
- **File Management**: Easy to add/remove PDFs from the automatic list
- **Professional Touch**: Ensures every email includes important documents

## 🔧 Configuration

### Firebase Setup
1. Replace `YOUR_API_KEY` with your Firebase API key
2. Replace `YOUR_AUTH_DOMAIN` with your Firebase auth domain
3. Replace `YOUR_PROJECT_ID` with your Firebase project ID
4. Replace `YOUR_STORAGE_BUCKET` with your Firebase storage bucket
5. Replace `YOUR_MESSAGING_SENDER_ID` with your Firebase messaging sender ID
6. Replace `YOUR_APP_ID` with your Firebase app ID

### EmailJS Setup
1. Replace `YOUR_PUBLIC_KEY` with your EmailJS public key
2. Replace `YOUR_SERVICE_ID` with your EmailJS service ID
3. Replace `YOUR_TEMPLATE_ID` with your EmailJS template ID

## 📱 Usage

1. **Select Local PDFs**: Click the "Select PDFs from Local Folder" button
2. **Choose Files**: Select the PDF files you want to include automatically
3. **Fill Email Form**: Enter recipient, subject, and message
4. **Add Additional Files**: Optionally drag and drop or select additional files
5. **Send Email**: Click "Send Email" - all PDFs will be automatically included

## 🎨 Customization

### PDF Content
You can modify the auto-generated PDF content by editing the `pdfContent` object in the JavaScript code.

### Styling
The application uses your brand colors:
- Primary: #03acff
- Highlight: #341bca
- Support: #000000 (black) and #ffffff (white)

## 📋 File Types Supported

- **PDF**: Primary format for automatic inclusion
- **Documents**: DOC, DOCX, TXT
- **Images**: JPG, JPEG, PNG, GIF
- **Size Limit**: 10MB per file

## 🔒 Security

- Files are uploaded to your Firebase Storage
- Secure file handling with proper validation
- No files are stored locally on the server

## 🆘 Troubleshooting

### PDF Not Uploading
- Check Firebase configuration
- Ensure file size is under 10MB
- Verify file is a valid PDF

### Email Not Sending
- Verify EmailJS configuration
- Check all required fields are filled
- Ensure files have finished uploading

## 📞 Support

For issues or questions, check your Firebase and EmailJS configurations first, then review the browser console for error messages. 