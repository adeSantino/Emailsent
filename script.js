// Global variables
// Note: File upload functionality has been removed

// Firebase configuration - now loaded from config.js
let firebaseConfig;
let firebaseStorage;

// Initialize Firebase
async function initializeFirebase() {
    try {
        // Get config from config.js
        firebaseConfig = window.FIREBASE_CONFIG;
        
        if (!firebaseConfig || !firebaseConfig.apiKey || firebaseConfig.apiKey === "YOUR_API_KEY") {
            throw new Error('Firebase configuration not found. Please update config.js with your Firebase credentials.');
        }
        
        const { initializeApp } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js");
        const { getStorage } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js");
        
        const app = initializeApp(firebaseConfig);
        firebaseStorage = getStorage(app);
        

        
        console.log('Firebase initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Firebase:', error);
        showMessageBox('Firebase configuration error. Please check config.js', 'error');
    }
}

// Initialize EmailJS with config from config.js
function initializeEmailJS() {
    try {
        const emailjsConfig = window.EMAILJS_CONFIG;
        
        if (!emailjsConfig || !emailjsConfig.publicKey) {
            throw new Error('EmailJS configuration not found. Please check config.js for your EmailJS credentials.');
        }
        
        // Check if the public key is still the placeholder
        if (emailjsConfig.publicKey === "YOUR_PUBLIC_KEY") {
            throw new Error('Please update config.js with your actual EmailJS public key.');
        }
        
        emailjs.init({
            publicKey: emailjsConfig.publicKey,
        });
        
        console.log('EmailJS initialized successfully with key:', emailjsConfig.publicKey.substring(0, 10) + '...');
    } catch (error) {
        console.error('Failed to initialize EmailJS:', error);
        showMessageBox('EmailJS configuration error: ' + error.message, 'error');
    }
}









// Function to fetch specific PDFs from Firebase Storage 'pdfs' folder
async function fetchSpecificPDFsFromStorage() {
    try {
        if (!firebaseStorage) {
            await initializeFirebase();
        }

        const { listAll, ref } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js");
        
        // Reference to the 'pdfs' folder in Firebase Storage
        const pdfsFolderRef = ref(firebaseStorage, 'pdfs');
        
        // List all files in the pdfs folder
        const result = await listAll(pdfsFolderRef);
        
        const pdfFiles = {};
        
        // Process each file in the pdfs folder
        for (const item of result.items) {
            try {
                // Get download URL for each file
                const { getDownloadURL } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js");
                const downloadURL = await getDownloadURL(item);
                
                // Get file name without extension
                const fileName = item.name.toLowerCase();
                
                console.log(`Processing PDF file: "${item.name}" (lowercase: "${fileName}")`);
                
                // Match files to template variables based on filename - more specific matching
                let matched = false;
                
                // Check for Inspire Company Profile (most specific first)
                if (fileName.includes('inspire') && !matched) {
                    pdfFiles.pdf_inspire = {
                        name: item.name,
                        url: downloadURL,
                        type: 'application/pdf'
                    };
                    console.log(`✅ Matched to pdf_inspire: ${item.name}`);
                    matched = true;
                }
                
                // Check for NEO Brochure (most specific first)
                if (fileName.includes('neo') && !matched) {
                    pdfFiles.pdf_neo = {
                        name: item.name,
                        url: downloadURL,
                        type: 'application/pdf'
                    };
                    console.log(`✅ Matched to pdf_neo: ${item.name}`);
                    matched = true;
                }
                
                // Check for SQRC Brochure (most specific first)
                if (fileName.includes('sqrc') && !matched) {
                    pdfFiles.pdf_sqrc = {
                        name: item.name,
                        url: downloadURL,
                        type: 'application/pdf'
                    };
                    console.log(`✅ Matched to pdf_sqrc: ${item.name}`);
                    matched = true;
                }
                
                // Fallback matching for files that might have "brochure" in name
                if (!matched) {
                    if (fileName.includes('company') || fileName.includes('profile')) {
                        pdfFiles.pdf_inspire = {
                            name: item.name,
                            url: downloadURL,
                            type: 'application/pdf'
                        };
                        console.log(`✅ Fallback matched to pdf_inspire: ${item.name}`);
                        matched = true;
                    } else if (fileName.includes('brochure') && !pdfFiles.pdf_neo && !pdfFiles.pdf_sqrc) {
                        // Only assign to neo if sqrc is not already assigned
                        if (!pdfFiles.pdf_neo) {
                            pdfFiles.pdf_neo = {
                                name: item.name,
                                url: downloadURL,
                                type: 'application/pdf'
                            };
                            console.log(`✅ Fallback matched to pdf_neo: ${item.name}`);
                        } else if (!pdfFiles.pdf_sqrc) {
                            pdfFiles.pdf_sqrc = {
                                name: item.name,
                                url: downloadURL,
                                type: 'application/pdf'
                            };
                            console.log(`✅ Fallback matched to pdf_sqrc: ${item.name}`);
                        }
                        matched = true;
                    }
                }
                
                if (!matched) {
                    console.log(`❌ No match found for: ${item.name}`);
                }
                
                console.log(`Found PDF: ${item.name} -> ${downloadURL}`);
                
            } catch (error) {
                console.error(`Error getting download URL for ${item.name}:`, error);
            }
        }
        
        // Log summary of what was found
        console.log('📋 PDF Matching Summary:');
        console.log('  pdf_inspire:', pdfFiles.pdf_inspire ? `✅ ${pdfFiles.pdf_inspire.name}` : '❌ Not found');
        console.log('  pdf_neo:', pdfFiles.pdf_neo ? `✅ ${pdfFiles.pdf_neo.name}` : '❌ Not found');
        console.log('  pdf_sqrc:', pdfFiles.pdf_sqrc ? `✅ ${pdfFiles.pdf_sqrc.name}` : '❌ Not found');
        
        // Validate that all 3 PDFs are found
        const missingPDFs = [];
        if (!pdfFiles.pdf_inspire) missingPDFs.push('Inspire Company Profile');
        if (!pdfFiles.pdf_neo) missingPDFs.push('NEO Brochure');
        if (!pdfFiles.pdf_sqrc) missingPDFs.push('SQRC Brochure');
        
        if (missingPDFs.length > 0) {
            console.warn(`⚠️ Missing PDFs: ${missingPDFs.join(', ')}`);
            console.warn('This might cause issues with email sending.');
        } else {
            console.log('🎉 All 3 required PDFs found successfully!');
        }
        
        // Log all files found for debugging
        console.log('📁 All files found in pdfs folder:');
        result.items.forEach(item => console.log(`  - ${item.name}`));
        
        return pdfFiles;
        
    } catch (error) {
        console.error('Error fetching PDFs from storage:', error);
        throw error;
    }
}

// Function to create email template parameters with specific PDF variables
function createEmailTemplateParams(formData, pdfFiles) {
    const templateParams = {
        // Sender information
        name: formData.name,                     // Who is sending the email
        sender_name: formData.name,              // Alternative name field
        
        // EmailJS standard recipient fields (multiple options to ensure compatibility)
        to_email: formData.recipient,          // Who receives the email - EmailJS standard field
        recipient: formData.recipient,          // Alternative recipient field
        email: formData.recipient,              // Another common recipient field
        
        // Email content - only essential fields
        message: formData.message,              // Email message
        time: new Date().toLocaleString(),      // Current timestamp
        
        // Specific PDF variables for your EmailJS template
        pdf_inspire: pdfFiles.pdf_inspire?.url || '#',
        pdf_neo: pdfFiles.pdf_neo?.url || '#',
        pdf_sqrc: pdfFiles.pdf_sqrc?.url || '#',
        
        // Additional file info (optional)
        pdf_inspire_name: pdfFiles.pdf_inspire?.name || 'Inspire Company Profile',
        pdf_neo_name: pdfFiles.pdf_neo?.name || 'NEO Brochure',
        pdf_sqrc_name: pdfFiles.pdf_sqrc?.name || 'SQRC Brochure'
    };
    
    return templateParams;
}

// Function to test EmailJS configuration
function testEmailJSConfig() {
    try {
        const emailjsConfig = window.EMAILJS_CONFIG;
        
        if (!emailjsConfig) {
            console.error('❌ EmailJS config not loaded from config.js');
            return false;
        }
        
        console.log('📧 EmailJS Configuration Status:');
        console.log('  Public Key:', emailjsConfig.publicKey ? '✅ Loaded' : '❌ Missing');
        console.log('  Service ID:', emailjsConfig.serviceID ? '✅ Loaded' : '❌ Missing');
        console.log('  Template ID:', emailjsConfig.templateID ? '✅ Loaded' : '❌ Missing');
        
        if (emailjsConfig.publicKey === "YOUR_PUBLIC_KEY") {
            console.error('❌ Public Key still has placeholder value');
            return false;
        }
        
        if (emailjsConfig.serviceID === "YOUR_SERVICE_ID") {
            console.error('❌ Service ID still has placeholder value');
            return false;
        }
        
        if (emailjsConfig.templateID === "YOUR_TEMPLATE_ID") {
            console.error('❌ Template ID still has placeholder value');
            return false;
        }
        
        console.log('✅ All EmailJS configuration values are properly set!');
        return true;
        
    } catch (error) {
        console.error('❌ Error testing EmailJS config:', error);
        return false;
    }
}





// Form submission handler
async function handleFormSubmit(event) {
    event.preventDefault(); // Prevent default form submission

    console.log('Form submitted! Starting email process...');

    // Show loading state
    const sendButton = event.target.querySelector('button[type="submit"]');
    const buttonText = document.getElementById('buttonText');
    const buttonLoading = document.getElementById('buttonLoading');
    
    sendButton.disabled = true;
    buttonText.classList.add('hidden');
    buttonLoading.classList.remove('hidden');

    // Show loading modal
    showModalLoading();

    try {
        console.log('Step 1: Fetching PDFs from Firebase...');
        
        // Fetch specific PDFs from the 'pdfs' folder in Firebase Storage
        const pdfFiles = await fetchSpecificPDFsFromStorage();
        
        console.log('PDFs fetched:', pdfFiles);
        
        // Validate that all required PDFs are found
        const requiredPDFs = ['pdf_inspire', 'pdf_neo', 'pdf_sqrc'];
        const missingPDFs = requiredPDFs.filter(key => !pdfFiles[key]);
        
        if (missingPDFs.length > 0) {
            const missingNames = missingPDFs.map(key => {
                switch(key) {
                    case 'pdf_inspire': return 'Inspire Company Profile';
                    case 'pdf_neo': return 'NEO Brochure';
                    case 'pdf_sqrc': return 'SQRC Brochure';
                    default: return key;
                }
            });
            
            showModalError(`Missing required PDFs: ${missingNames.join(', ')}. Please check your Firebase Storage pdfs folder.`);
            sendButton.disabled = false;
            buttonText.classList.remove('hidden');
            buttonLoading.classList.add('hidden');
            return;
        }
        
        console.log('✅ All 3 required PDFs found and validated!');
        
        if (Object.keys(pdfFiles).length === 0) {
            showModalError('No PDF files found in Firebase Storage. Please check your pdfs folder.');
            sendButton.disabled = false;
            buttonText.classList.remove('hidden');
            buttonLoading.classList.add('hidden');
            return;
        }

        console.log('Step 2: Getting form data...');
        
        // Get form data
        const formData = {
            name: document.getElementById('name').value,
            recipient: document.getElementById('recipient').value,
            message: document.getElementById('message').value
        };

        console.log('Form data:', formData);

        // Validate required fields
        if (!formData.name || !formData.recipient || !formData.message) {
            showModalError('Please fill in all required fields.');
            sendButton.disabled = false;
            buttonText.classList.remove('hidden');
            buttonLoading.classList.add('hidden');
            return;
        }
        
        // Additional validation for recipient email
        if (!formData.recipient.trim()) {
            showModalError('Recipient email address cannot be empty.');
            sendButton.disabled = false;
            buttonText.classList.remove('hidden');
            buttonLoading.classList.add('hidden');
            return;
        }
        
        // Log the exact recipient value for debugging
        console.log('Recipient email value:', `"${formData.recipient}"`);
        console.log('Recipient email length:', formData.recipient.length);
        console.log('Recipient email trimmed:', `"${formData.recipient.trim()}"`);

        console.log('Step 3: Creating email template parameters...');

        // Create email template parameters with PDF variables
        const templateParams = createEmailTemplateParams(formData, pdfFiles);

        console.log('Template parameters:', templateParams);
        console.log('Recipient email being sent:', formData.recipient);
        console.log('Sender name being sent:', formData.name);
        console.log('All template params keys:', Object.keys(templateParams));

        console.log('Step 4: Getting EmailJS configuration...');

        // Get EmailJS configuration
        const emailjsConfig = window.EMAILJS_CONFIG;
        
        // Check if EmailJS is properly initialized
        if (!emailjsConfig || !emailjsConfig.publicKey) {
            showModalError('EmailJS not initialized. Please check your configuration.');
            sendButton.disabled = false;
            buttonText.classList.remove('hidden');
            buttonLoading.classList.add('hidden');
            return;
        }
        
        const serviceID = emailjsConfig.serviceID;
        const templateID = emailjsConfig.templateID;
        
        console.log('EmailJS config:', { 
            publicKey: emailjsConfig.publicKey.substring(0, 10) + '...',
            serviceID, 
            templateID 
        });
        
        if (!serviceID || !templateID || serviceID === "YOUR_SERVICE_ID" || templateID === "YOUR_TEMPLATE_ID") {
            showModalError('EmailJS configuration incomplete. Please update config.js with your service ID and template ID.');
            sendButton.disabled = false;
            buttonText.classList.remove('hidden');
            buttonLoading.classList.add('hidden');
            return;
        }

        console.log('Step 5: Sending email via EmailJS...');

        // Ensure recipient is always included
        if (!templateParams.recipient && !templateParams.to_email && !templateParams.email) {
            showModalError('Recipient email is missing from template parameters.');
            sendButton.disabled = false;
            buttonText.classList.remove('hidden');
            buttonLoading.classList.add('hidden');
            return;
        }
        
        // Debug: Log all recipient fields being sent
        console.log('🔍 Recipient Debug Info:');
        console.log('  formData.recipient:', `"${formData.recipient}"`);
        console.log('  templateParams.recipient:', `"${templateParams.recipient}"`);
        console.log('  templateParams.to_email:', `"${templateParams.to_email}"`);
        console.log('  templateParams.email:', `"${templateParams.email}"`);
        console.log('  All template params keys:', Object.keys(templateParams));
        
        console.log('Final template parameters being sent to EmailJS:', templateParams);
        
        // Send email using EmailJS with PDF variables
        emailjs.send(serviceID, templateID, templateParams)
            .then(() => {
                console.log('Email sent successfully!');
                
                // Show success modal
                const pdfCount = Object.keys(pdfFiles).length;
                showModalSuccess(formData.recipient, `${pdfCount} PDFs`);
                
                // Reset form
                document.getElementById('emailForm').reset();
                uploadedFiles = [];
                fileUrls = [];
                autoPdfUploaded = false;
                updateFileList();
            }, (error) => {
                console.error('EmailJS Error:', error);
                showModalError(`Failed to send email: ${error.text || error}`);
            })
            .finally(() => {
                // Reset button state
                sendButton.disabled = false;
                buttonText.classList.remove('hidden');
                buttonLoading.classList.add('hidden');
            });

    } catch (error) {
        console.error('Error in form submission:', error);
        showModalError(`Error preparing email: ${error.message}`);
        
        // Reset button state
        sendButton.disabled = false;
        buttonText.classList.remove('hidden');
        buttonLoading.classList.add('hidden');
    }
}

// Function to show a custom message box instead of alert()
function showMessageBox(message, type = 'info') {
    const messageBox = document.getElementById('messageBox');
    messageBox.textContent = message;
    messageBox.classList.remove('hidden', 'success', 'error', 'info');

    messageBox.classList.add(type);
    messageBox.classList.remove('hidden'); // Make it visible
    messageBox.scrollIntoView({ behavior: 'smooth', block: 'center' }); // Scroll to it

    // Auto-hide success messages after 5 seconds
    if (type === 'success') {
        setTimeout(() => {
            messageBox.classList.add('hidden');
        }, 5000);
    }
}

// Modal control functions
function showModal() {
    const modal = document.getElementById('emailModal');
    modal.classList.remove('hidden');
    modal.classList.add('show');
}

function hideModal() {
    const modal = document.getElementById('emailModal');
    modal.classList.remove('show');
    modal.classList.add('hidden');
}

function closeModal() {
    hideModal();
}

function showModalLoading() {
    showModal();
    document.getElementById('modalLoading').classList.remove('hidden');
    document.getElementById('modalSuccess').classList.add('hidden');
    document.getElementById('modalError').classList.add('hidden');
}

function showModalSuccess(recipient, pdfCount) {
    document.getElementById('modalLoading').classList.add('hidden');
    document.getElementById('modalSuccess').classList.remove('hidden');
    document.getElementById('modalError').classList.add('hidden');
    
    // Update success details
    document.getElementById('successRecipient').textContent = recipient;
    document.getElementById('successPdfCount').textContent = pdfCount;
}

function showModalError(errorMessage) {
    document.getElementById('modalLoading').classList.add('hidden');
    document.getElementById('modalSuccess').classList.add('hidden');
    document.getElementById('modalError').classList.remove('hidden');
    
    // Update error details
    document.getElementById('errorDetails').textContent = errorMessage;
}

// Retry function for failed emails
function retryEmail() {
    hideModal();
    // Reset form and try again
    document.getElementById('emailForm').dispatchEvent(new Event('submit'));
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('emailModal');
    const modalOverlay = document.querySelector('.modal-overlay');
    
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    }
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
});

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Email Sender initializing...');
    
    // Test EmailJS configuration first
    testEmailJSConfig();
    
    // Initialize Firebase
    initializeFirebase();
    initializeEmailJS(); // Initialize EmailJS
    
    // Setup event listeners
    document.getElementById('emailForm').addEventListener('submit', handleFormSubmit);
    
    console.log('✅ Email Sender initialized successfully');
    
    // Add debug function to global scope for console testing
    window.debugPDFs = async function() {
        console.log('🔍 Debugging PDF files in Firebase Storage...');
        try {
            const pdfFiles = await fetchSpecificPDFsFromStorage();
            console.log('📊 Final PDF mapping:', pdfFiles);
            return pdfFiles;
        } catch (error) {
            console.error('❌ Debug failed:', error);
        }
    };
    
    console.log('💡 Use debugPDFs() in console to check PDF status');
}); 