# 🔧 Troubleshooting Guide

## 🚨 **Common Issues & Solutions:**

### **1. Form Not Working - Check These First:**

#### **Open Browser Console (F12):**
1. Right-click on your page → "Inspect"
2. Click "Console" tab
3. Look for error messages (red text)
4. Try submitting the form and watch the console

#### **Check Configuration:**
- ✅ **Firebase config** - All values filled in `config.js`
- ✅ **EmailJS config** - Service ID and Template ID correct
- ✅ **Template ID format** - Should start with `template_` (not `Ytemplate_`)

### **2. Firebase Issues:**

#### **"Firebase configuration error":**
- Check `config.js` - all Firebase values should be filled
- Verify Firebase project is active
- Check if Storage is enabled in Firebase Console

#### **"No PDF files found":**
- Go to Firebase Console → Storage
- Create folder named `pdfs` (exactly this name)
- Upload your 3 PDF files:
  - `Inspire Company Profile.pdf`
  - `NEO Brochure.pdf`
  - `SQRC Brochure.pdf`

### **3. EmailJS Issues:**

#### **"EmailJS configuration error":**
- Check `config.js` - Service ID and Template ID
- Verify EmailJS account is active
- Check if template exists and is published

#### **"Failed to send email":**
- Check EmailJS dashboard for errors
- Verify template variables match your template
- Check if service is properly configured

### **4. Step-by-Step Debug:**

#### **Test 1: Basic Form**
1. Fill out recipient email
2. Fill out message
3. Click "Send Email"
4. Watch browser console for step-by-step logs

#### **Test 2: Check Console Output**
You should see:
```
Form submitted! Starting email process...
Step 1: Fetching PDFs from Firebase...
Step 2: Getting form data...
Step 3: Creating email template parameters...
Step 4: Getting EmailJS configuration...
Step 5: Sending email via EmailJS...
```

#### **Test 3: Check Each Step**
- **Step 1**: Should show PDFs fetched
- **Step 2**: Should show form data
- **Step 3**: Should show template parameters
- **Step 4**: Should show EmailJS config
- **Step 5**: Should show success or error

### **5. Quick Fixes:**

#### **If nothing happens:**
1. Check browser console for errors
2. Verify all files are loaded (no 404 errors)
3. Check if JavaScript is enabled

#### **If PDFs not found:**
1. Go to Firebase Console
2. Create `pdfs` folder
3. Upload your PDF files
4. Wait a few minutes for sync

#### **If EmailJS fails:**
1. Check EmailJS dashboard
2. Verify template is published
3. Check service configuration
4. Test template manually

### **6. File Structure Check:**

```
html/
├── index.html          ← Main form
├── styles.css          ← Styling
├── script.js           ← Functionality
├── config.js           ← Configuration (check this!)
├── README.md           ← Documentation
└── TROUBLESHOOTING.md  ← This file
```

### **7. Configuration Checklist:**

#### **Firebase (config.js):**
- [ ] `apiKey` - Your Firebase API key
- [ ] `authDomain` - Your Firebase auth domain
- [ ] `projectId` - Your Firebase project ID
- [ ] `storageBucket` - Your Firebase storage bucket
- [ ] `messagingSenderId` - Your Firebase sender ID
- [ ] `appId` - Your Firebase app ID

#### **EmailJS (config.js):**
- [ ] `publicKey` - Your EmailJS public key
- [ ] `serviceID` - Your EmailJS service ID (starts with `service_`)
- [ ] `templateID` - Your EmailJS template ID (starts with `template_`)

### **8. Still Not Working?**

1. **Check browser console** for specific error messages
2. **Verify all credentials** in `config.js`
3. **Test Firebase Storage** manually
4. **Test EmailJS template** manually
5. **Check network tab** for failed requests

### **9. Common Error Messages:**

- **"Firebase configuration not found"** → Check `config.js`
- **"No PDF files found"** → Check Firebase Storage `pdfs` folder
- **"EmailJS configuration error"** → Check EmailJS credentials
- **"Failed to send email"** → Check EmailJS service and template

### **10. Need More Help?**

1. **Copy the exact error message** from console
2. **Check which step failed** in the console logs
3. **Verify your credentials** are correct
4. **Test each service separately** (Firebase, then EmailJS)

Your form should work once all configuration is correct! 🎯 