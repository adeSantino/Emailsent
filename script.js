// Global variables
let firebaseConfig;
let firebaseStorage;
let selectedEmailId = null;
let recipients = [];
let emailHistory = [];
let senderName = '';

// Initialize Firebase
async function initializeFirebase() {
    try {
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

// Initialize EmailJS
function initializeEmailJS() {
    try {
        const emailjsConfig = window.EMAILJS_CONFIG;
        
        if (!emailjsConfig || !emailjsConfig.publicKey) {
            throw new Error('EmailJS configuration not found. Please check config.js for your EmailJS credentials.');
        }
        
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

// Sender Name Functions
function setSenderName() {
    const senderNameInput = document.getElementById('senderNameInput');
    const name = senderNameInput.value.trim();
    
    if (name && name.length >= 2) {
        senderName = name;
        updateSenderDisplay();
        senderNameInput.value = '';
        
        // Add system message
        addSystemMessage(`👤 Sender name set to: ${name}`);
    } else {
        addSystemMessage('❌ Please enter a valid name (at least 2 characters)');
    }
}

function removeSenderName() {
    senderName = '';
    updateSenderDisplay();
    addSystemMessage('🗑️ Sender name removed');
}

function updateSenderDisplay() {
    const display = document.getElementById('senderDisplay');
    display.innerHTML = '';
    
    if (senderName) {
        const tag = document.createElement('div');
        tag.className = 'sender-tag';
        tag.innerHTML = `
            <i class="fas fa-user"></i>
            ${senderName}
            <button class="remove-btn" onclick="removeSenderName()">
                <i class="fas fa-times"></i>
            </button>
        `;
        display.appendChild(tag);
    }
}

// Email History Functions
function selectEmail(emailId) {
    // Remove active class from all email items
    document.querySelectorAll('.email-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to selected email
    const selectedItem = document.querySelector(`[data-email-id="${emailId}"]`);
    if (selectedItem) {
        selectedItem.classList.add('active');
    }
    
    selectedEmailId = emailId;
    
    // Load email details
    loadEmailDetails(emailId);
}

function loadEmailDetails(emailId) {
    const email = emailHistory.find(e => e.id === emailId);
    if (email) {
        console.log(`Selected email:`, email);
        
        // Add a message to the chat area showing the selected email
        addSystemMessage(`📧 Selected email sent by ${email.senderName} to ${email.recipients.join(', ')} at ${email.time}`);
        
        // You could also populate the input fields with the email content
        // document.getElementById('recipientInput').value = email.recipients.join(', ');
        // document.getElementById('messageInput').value = email.message;
    }
}

function refreshHistory() {
    console.log('Refreshing email history...');
    
    // Add a loading state to the refresh button
    const refreshBtn = document.querySelector('.refresh-btn');
    const originalIcon = refreshBtn.innerHTML;
    
    refreshBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    // Simulate refresh delay
    setTimeout(() => {
        refreshBtn.innerHTML = originalIcon;
        addSystemMessage('Email history refreshed');
    }, 1000);
}

function showComposeArea() {
    // Clear any selected email
    selectedEmailId = null;
    document.querySelectorAll('.email-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Clear recipients and message
    recipients = [];
    document.getElementById('recipientInput').value = '';
    document.getElementById('messageInput').value = '';
    updateRecipientsDisplay();
    
    // Add system message
    addSystemMessage('✏️ Compose new email');
}

function updateEmailHistoryDisplay() {
    const emailList = document.getElementById('emailList');
    
    if (emailHistory.length === 0) {
        // Show empty state
        emailList.innerHTML = `
            <div class="email-empty-state">
                <div class="empty-icon">
                    <i class="fas fa-inbox"></i>
                </div>
                <p class="empty-text">No emails sent today</p>
                <p class="empty-subtext">Your sent emails will appear here</p>
            </div>
        `;
    } else {
        // Show email history
        emailList.innerHTML = emailHistory.map(email => `
            <div class="email-item" data-email-id="${email.id}" onclick="selectEmail(${email.id})">
                <div class="email-avatar">
                    <i class="fas fa-user"></i>
                </div>
                <div class="email-content">
                    <div class="email-sender">${email.recipients.join(', ')}</div>
                    <div class="email-subject">${email.subject || 'No subject'}</div>
                    <div class="email-preview">${email.message.substring(0, 60)}${email.message.length > 60 ? '...' : ''}</div>
                    <div class="email-time">${email.time}</div>
                </div>
                <div class="email-status">
                    <i class="fas fa-check-circle text-green-500"></i>
                </div>
            </div>
        `).join('');
    }
}

// Chat Functions
function addSystemMessage(message) {
    const systemMessagesContainer = document.getElementById('systemMessagesContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message system-message';
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <div class="message-icon">
                <i class="fas fa-info-circle"></i>
            </div>
            <div class="message-text">
                <p>${message}</p>
            </div>
        </div>
    `;
    
    systemMessagesContainer.appendChild(messageDiv);
    
    // Scroll to the bottom of the system messages
    systemMessagesContainer.scrollTop = systemMessagesContainer.scrollHeight;
    
    // Auto-remove old messages after 5 seconds (except welcome message)
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

function addRecipient() {
    const recipientInput = document.getElementById('recipientInput');
    const email = recipientInput.value.trim();
    
    if (email && isValidEmail(email)) {
        if (!recipients.includes(email)) {
            recipients.push(email);
            updateRecipientsDisplay();
            recipientInput.value = '';
            
            // Add system message
            addSystemMessage(`✅ Added recipient: ${email}`);
        } else {
            addSystemMessage(`ℹ️ Recipient ${email} already added`);
        }
    } else {
        addSystemMessage('❌ Please enter a valid email address');
    }
}

function removeRecipient(email) {
    recipients = recipients.filter(r => r !== email);
    updateRecipientsDisplay();
    addSystemMessage(`🗑️ Removed recipient: ${email}`);
}

function updateRecipientsDisplay() {
    const display = document.getElementById('recipientsDisplay');
    display.innerHTML = '';
    
    recipients.forEach(email => {
        const tag = document.createElement('div');
        tag.className = 'recipient-tag';
        tag.innerHTML = `
            ${email}
            <button class="remove-btn" onclick="removeRecipient('${email}')">
                <i class="fas fa-times"></i>
            </button>
        `;
        display.appendChild(tag);
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// Quick Start Modal Functions
function showQuickStart() {
    const modal = document.getElementById('quickStartModal');
    modal.classList.remove('hidden');
    modal.classList.add('show');
}

function closeQuickStart() {
    const modal = document.getElementById('quickStartModal');
    modal.classList.remove('show');
    modal.classList.add('hidden');
}

// Email Functions
async function sendEmail() {
    if (!senderName) {
        addSystemMessage('❌ Please set your sender name first');
        return;
    }
    
    if (recipients.length === 0) {
        addSystemMessage('❌ Please add at least one recipient');
        return;
    }
    
    const message = document.getElementById('messageInput').value.trim();
    if (!message) {
        addSystemMessage('❌ Please enter a message');
        return;
    }
    
    // Show loading state
    const sendBtn = document.getElementById('sendBtn');
    const originalContent = sendBtn.innerHTML;
    sendBtn.disabled = true;
    sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    
    // Add system message
    addSystemMessage('📤 Sending email...');
    
    try {
        console.log('Step 1: Fetching PDFs from Firebase...');
        
        const pdfFiles = await fetchSpecificPDFsFromStorage();
        
        console.log('PDFs fetched:', pdfFiles);
        
        // Validate PDFs
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
            
            addSystemMessage(`❌ Error: Missing required PDFs: ${missingNames.join(', ')}`);
            return;
        }
        
        console.log('✅ All 3 required PDFs found and validated!');
        
        // Create form data
        const formData = {
            name: senderName,
            recipient: recipients.join(', '),
            message: message
        };
        
        console.log('Form data:', formData);
        
        // Create template parameters
        const templateParams = createEmailTemplateParams(formData, pdfFiles);
        
        console.log('Template parameters:', templateParams);
        
        // Get EmailJS configuration
        const emailjsConfig = window.EMAILJS_CONFIG;
        
        if (!emailjsConfig || !emailjsConfig.publicKey) {
            addSystemMessage('❌ Error: EmailJS not initialized');
            return;
        }
        
        const serviceID = emailjsConfig.serviceID;
        const templateID = emailjsConfig.templateID;
        
        if (!serviceID || !templateID || serviceID === "YOUR_SERVICE_ID" || templateID === "YOUR_TEMPLATE_ID") {
            addSystemMessage('❌ Error: EmailJS configuration incomplete');
            return;
        }
        
        console.log('Sending email via EmailJS...');
        
        // Send email
        emailjs.send(serviceID, templateID, templateParams)
            .then(() => {
                console.log('Email sent successfully!');
                
                // Add success message
                addSystemMessage(`✅ Email sent successfully by ${senderName} to ${recipients.length} recipient(s)!`);
                
                // Add to email history
                addToEmailHistory(recipients, message);
                
                // Show success modal
                const pdfCount = Object.keys(pdfFiles).length;
                const timestamp = new Date().toLocaleString();
                showModalSuccess(formData.recipient, `${pdfCount} PDFs`, timestamp);
                
                // Clear form
                recipients = [];
                document.getElementById('messageInput').value = '';
                updateRecipientsDisplay();
                
            }, (error) => {
                console.error('EmailJS Error:', error);
                addSystemMessage(`❌ Failed to send email: ${error.text || error}`);
            })
            .finally(() => {
                // Reset button state
                sendBtn.disabled = false;
                sendBtn.innerHTML = originalContent;
            });
            
    } catch (error) {
        console.error('Error in email sending:', error);
        addSystemMessage(`❌ Error: ${error.message}`);
        
        // Reset button state
        sendBtn.disabled = false;
        sendBtn.innerHTML = originalContent;
    }
}

function addToEmailHistory(recipients, message) {
    const newEmail = {
        id: Date.now(), // Use timestamp as unique ID
        senderName: senderName,
        recipients: [...recipients],
        message: message,
        subject: message.substring(0, 50) + (message.length > 50 ? '...' : ''),
        time: new Date().toLocaleString(),
        timestamp: new Date()
    };
    
    // Add to beginning of history (most recent first)
    emailHistory.unshift(newEmail);
    
    // Keep only today's emails
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    emailHistory = emailHistory.filter(email => email.timestamp >= today);
    
    // Update the display
    updateEmailHistoryDisplay();
    
    console.log('Added to email history:', newEmail);
    console.log('Current history:', emailHistory);
}

// PDF Functions (keeping existing functionality)
async function fetchSpecificPDFsFromStorage() {
    try {
        if (!firebaseStorage) {
            await initializeFirebase();
        }

        const { listAll, ref } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js");
        
        const pdfsFolderRef = ref(firebaseStorage, 'pdfs');
        const result = await listAll(pdfsFolderRef);
        
        const pdfFiles = {};
        
        for (const item of result.items) {
            try {
                const { getDownloadURL } = await import("https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js");
                const downloadURL = await getDownloadURL(item);
                
                const fileName = item.name.toLowerCase();
                
                let matched = false;
                
                if (fileName.includes('inspire') && !matched) {
                    pdfFiles.pdf_inspire = {
                        name: item.name,
                        url: downloadURL,
                        type: 'application/pdf'
                    };
                    matched = true;
                }
                
                if (fileName.includes('neo') && !matched) {
                    pdfFiles.pdf_neo = {
                        name: item.name,
                        url: downloadURL,
                        type: 'application/pdf'
                    };
                    matched = true;
                }
                
                if (fileName.includes('sqrc') && !matched) {
                    pdfFiles.pdf_sqrc = {
                        name: item.name,
                        url: downloadURL,
                        type: 'application/pdf'
                    };
                    matched = true;
                }
                
                if (!matched) {
                    if (fileName.includes('company') || fileName.includes('profile')) {
                        pdfFiles.pdf_inspire = {
                            name: item.name,
                            url: downloadURL,
                            type: 'application/pdf'
                        };
                        matched = true;
                    } else if (fileName.includes('brochure') && !pdfFiles.pdf_neo && !pdfFiles.pdf_sqrc) {
                        if (!pdfFiles.pdf_neo) {
                            pdfFiles.pdf_neo = {
                                name: item.name,
                                url: downloadURL,
                                type: 'application/pdf'
                            };
                        } else if (!pdfFiles.pdf_sqrc) {
                            pdfFiles.pdf_sqrc = {
                                name: item.name,
                                url: downloadURL,
                                type: 'application/pdf'
                            };
                        }
                        matched = true;
                    }
                }
                
            } catch (error) {
                console.error(`Error getting download URL for ${item.name}:`, error);
            }
        }
        
        return pdfFiles;
        
    } catch (error) {
        console.error('Error fetching PDFs from storage:', error);
        throw error;
    }
}

function createEmailTemplateParams(formData, pdfFiles) {
    const templateParams = {
        name: formData.name,
        sender_name: formData.name,
        to_email: formData.recipient,
        recipient: formData.recipient,
        email: formData.recipient,
        message: formData.message,
        time: new Date().toLocaleString(),
        pdf_inspire: pdfFiles.pdf_inspire?.url || '#',
        pdf_neo: pdfFiles.pdf_neo?.url || '#',
        pdf_sqrc: pdfFiles.pdf_sqrc?.url || '#',
        pdf_inspire_name: pdfFiles.pdf_inspire?.name || 'Inspire Company Profile',
        pdf_neo_name: pdfFiles.pdf_neo?.name || 'NEO Brochure',
        pdf_sqrc_name: pdfFiles.pdf_sqrc?.name || 'SQRC Brochure'
    };
    
    return templateParams;
}

// Modal Functions
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

function showModalSuccess(recipient, pdfCount, timestamp) {
    document.getElementById('modalLoading').classList.add('hidden');
    document.getElementById('modalSuccess').classList.remove('hidden');
    document.getElementById('modalError').classList.add('hidden');
    
    document.getElementById('successRecipient').textContent = recipient;
    document.getElementById('successPdfCount').textContent = pdfCount;
    document.getElementById('successTimestamp').textContent = timestamp;
}

function showModalError(errorMessage) {
    document.getElementById('modalLoading').classList.add('hidden');
    document.getElementById('modalSuccess').classList.add('hidden');
    document.getElementById('modalError').classList.remove('hidden');
    
    document.getElementById('errorDetails').textContent = errorMessage;
}

function retryEmail() {
    hideModal();
    sendEmail();
}

// Event Listeners
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Inspire Email Chat initializing...');
    
    // Initialize services
    initializeFirebase();
    initializeEmailJS();
    
    // Initialize displays
    updateEmailHistoryDisplay();
    updateSenderDisplay();
    
    // Setup keyboard shortcuts
    document.getElementById('senderNameInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            setSenderName();
        }
    });
    
    document.getElementById('recipientInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addRecipient();
        }
    });
    
    document.getElementById('messageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendEmail();
        }
    });
    
    // Close modals when clicking outside
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal-overlay')) {
            closeModal();
            closeQuickStart();
        }
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeModal();
            closeQuickStart();
        }
    });
    
    console.log('✅ Inspire Email Chat initialized successfully');
});

// Debug function
window.debugChat = function() {
    console.log('Chat Debug Info:');
    console.log('Sender Name:', senderName);
    console.log('Selected Email ID:', selectedEmailId);
    console.log('Recipients:', recipients);
    console.log('Email History:', emailHistory);
    console.log('Firebase Storage:', firebaseStorage);
}; 