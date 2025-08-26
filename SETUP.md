# 🚀 Email Sender Setup Guide

## 📁 File Structure
Your project now has a clean, organized structure:
```
html/
├── index.html          ← Main HTML file (clean, no inline code)
├── styles.css          ← All CSS styles
├── script.js           ← All JavaScript functionality
├── config.js           ← Configuration file (update this!)
├── README.md           ← Complete documentation
├── SETUP.md            ← This setup guide
└── pdfs/               ← Create this folder for your PDFs
```

## ⚙️ Configuration Steps

### 1. Update `config.js`
Open `config.js` and replace the placeholder values:

```javascript
// Firebase Configuration
const FIREBASE_CONFIG = {
    apiKey: "your-actual-api-key-here",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project-id",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdef123456"
};

// EmailJS Configuration
const EMAILJS_CONFIG = {
    publicKey: "your-actual-public-key",
    serviceID: "your-service-id",
    templateID: "your-template-id"
};
```

### 2. Get Firebase Credentials
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create/select your project
3. Go to Project Settings → General
4. Scroll down to "Your apps" section
5. Copy the config values

### 3. Get EmailJS Credentials
1. Go to [EmailJS.com](https://www.emailjs.com/)
2. Sign up/login to your account
3. Go to Email Services → Add New Service
4. Go to Email Templates → Create New Template
5. Copy the Service ID and Template ID

## 🔧 How to Use

### Basic Usage
1. **Update config.js** with your credentials
2. **Create pdfs folder** and add your PDF files
3. **Open index.html** in your browser
4. **Click "Select PDFs from Local Folder"** to choose PDFs
5. **Fill out the email form** and send!

### Advanced Features
- **Auto-PDF Generation**: Creates PDFs automatically if no local PDFs selected
- **File Management**: Easy to add/remove files
- **Drag & Drop**: Drag files directly onto the upload area
- **Progress Tracking**: See upload status for all files

## 🎯 Benefits of External Files

✅ **Clean HTML**: No more messy inline code
✅ **Easy Maintenance**: Update styles in one place
✅ **Better Organization**: Separate concerns (HTML, CSS, JS)
✅ **Professional Structure**: Industry-standard file organization
✅ **Easy Updates**: Modify functionality without touching HTML
✅ **Better Performance**: Files can be cached separately

## 🚨 Troubleshooting

### Common Issues:
1. **"Firebase configuration not found"**
   - Check that `config.js` is properly loaded
   - Verify all Firebase values are updated

2. **"EmailJS configuration error"**
   - Ensure EmailJS credentials are correct
   - Check that service ID and template ID are valid

3. **Files not uploading**
   - Verify Firebase Storage is enabled
   - Check file size limits (10MB max)

### Debug Steps:
1. Open browser console (F12)
2. Look for error messages
3. Check if all files are loading
4. Verify configuration values

## 📱 Testing

### Test Your Setup:
1. **Local Test**: Open `index.html` in browser
2. **PDF Selection**: Try selecting PDFs from your computer
3. **Email Test**: Send a test email to yourself
4. **File Upload**: Verify files upload to Firebase

### Success Indicators:
- ✅ No console errors
- ✅ PDFs upload successfully
- ✅ Email sends without errors
- ✅ Files appear in Firebase Storage

## 🔄 Updating

### To Update Styles:
- Edit `styles.css`

### To Update Functionality:
- Edit `script.js`

### To Update Configuration:
- Edit `config.js`

### To Update Content:
- Edit `index.html`

## 📧 EmailJS Template Variables

### **Basic Form Variables:**
```
{{to_email}}      ← Recipient email address (who receives the email)
{{from_name}}     ← Sender's name
{{from_email}}    ← Sender's email address
{{subject}}       ← Email subject line  
{{message}}       ← Email message content
{{time}}          ← Current timestamp
```

### **File Attachment Variables:**
```
{{pdf_inspire}}           ← Inspire Company Profile download URL
{{pdf_neo}}              ← NEO Brochure download URL
{{pdf_sqrc}}             ← SQRC Brochure download URL
{{pdf_inspire_name}}     ← Inspire Company Profile filename
{{pdf_neo_name}}         ← NEO Brochure filename
{{pdf_sqrc_name}}        ← SQRC Brochure filename
```

### **Complete EmailJS Template Example:**

#### **Plain Text Template:**
```
To: {{to_email}}
From: {{from_name}} ({{from_email}})
Subject: {{subject}}
Time: {{time}}

{{message}}

📎 Attached Documents:
• {{pdf_inspire_name}}: {{pdf_inspire}}
• {{pdf_neo_name}}: {{pdf_neo}}
• {{pdf_sqrc_name}}: {{pdf_sqrc}}
```

#### **HTML Template (Updated for your needs):**
```html
<div style="font-family: 'Segoe UI', Arial, sans-serif; font-size: 14px; color: #2c3e50; line-height: 1.6; max-width: 600px; margin: auto;">
  
  <!-- HEADER -->
  <div style="text-align: center; margin-bottom: 20px;">
    <h2 style="margin: 0; font-size: 22px; color: #2980b9;">📩 New Email Received</h2>
    <p style="font-size: 12px; color: #7f8c8d; margin: 5px 0;">You've received an email via the website form</p>
    <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
  </div>

  <!-- EMAIL DETAILS -->
  <div style="background-color: #2980b9; color: white; padding: 6px 12px; display: inline-block; border-radius: 4px; font-size: 12px; font-weight: bold;">
    EMAIL DETAILS
  </div>

  <!-- BODY -->
  <div style="margin-top: 20px; font-size: 15px;">
    <p><strong>Hello,</strong></p>
    <p>You've received an email from <strong>{{from_name}}</strong> ({{from_email}}). Please review the details below:</p>

    <div style="margin-top: 15px; padding: 15px; border: 1px solid #e0e0e0; border-radius: 8px; background: #f9fbfd;">
      <p style="margin: 0; font-size: 15px; color: #34495e;"><strong>From:</strong> {{from_name}} ({{from_email}})</p>
      <p style="margin: 5px 0; font-size: 15px; color: #34495e;"><strong>Subject:</strong> {{subject}}</p>
      <p style="margin: 5px 0; font-size: 15px; color: #34495e;"><strong>Time:</strong> {{time}}</p>
      <p style="margin-top: 10px; padding: 10px 12px; background: #fff; border: 1px solid #ecf0f1; border-radius: 6px; font-size: 15px; color: #2c3e50;">
        {{message}}
      </p>
    </div>
  </div>

  <!-- CTA -->
  <div style="margin-top: 25px; text-align: center;">
    <a href="mailto:{{from_email}}" 
      style="background-color: #2980b9; color: white; text-decoration: none; padding: 10px 18px; border-radius: 5px; font-size: 14px; font-weight: bold; display: inline-block;">
      Reply to {{from_name}}
    </a>
  </div>

  <!-- PDF DOWNLOAD LINKS -->
  <div style="margin-top: 25px;">
    <p style="font-weight: bold; color: #34495e; font-size: 15px;">📎 Attached Documents:</p>
    <ul style="padding-left: 20px; font-size: 14px; color: #2c3e50;">
      <li>
        <a href="{{pdf_inspire}}" target="_blank" download
          style="color: #2980b9; text-decoration: none; font-weight: bold;">
          📄 {{pdf_inspire_name}}
        </a>
      </li>
      <li>
        <a href="{{pdf_neo}}" target="_blank" download
          style="color: #2980b9; text-decoration: none; font-weight: bold;">
          📄 {{pdf_neo_name}}
        </a>
      </li>
      <li>
        <a href="{{pdf_sqrc}}" target="_blank" download
          style="color: #2980b9; text-decoration: none; font-weight: bold;">
          📄 {{pdf_sqrc_name}}
        </a>
      </li>
    </ul>
  </div>

  <!-- FOOTER -->
  <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;">
  <p style="font-size: 12px; color: #7f8c8d; text-align: center;">
    You are receiving this email because someone submitted a message on your website.<br>
    If this wasn't you, you can safely ignore this email.
  </p>
</div>
```

### **File Data Structure:**
Each file in `{{files_json}}` contains:
```json
{
    "name": "document.pdf",
    "url": "https://firebase-storage-url.com/file.pdf",
    "size": 1024000,
    "sizeFormatted": "1.00 MB",
    "type": "application/pdf",
    "isAuto": true,
    "isLocal": false,
    "uploadTime": "2024-01-15T10:30:00.000Z"
}
```

## 📞 Need Help?

1. Check the browser console for errors
2. Verify all configuration values are correct
3. Ensure Firebase and EmailJS services are properly set up
4. Check file permissions and network access

Your email sender is now professionally organized and ready to use! 🎉 