document.addEventListener('DOMContentLoaded', () => {
    const chatHistory = document.getElementById('chat-history');
    const messageInput = document.getElementById('message-input');
    const sendButton = document.getElementById('send-button');

    // Auto-resize textarea
    messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = (this.scrollHeight) + 'px';
    });

    // Function to format AI response (convert markdown-like text to HTML)
    function formatMessage(text) {
        // Convert **bold** to <strong>
        text = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
        
        // Convert *italic* to <em>
        text = text.replace(/\*(.+?)\*/g, '<em>$1</em>');
        
        // Convert numbered lists
        text = text.replace(/^(\d+)\.\s+(.+)$/gm, '<div style="margin-left: 20px;">$1. $2</div>');
        
        // Convert bullet points
        text = text.replace(/^[-•]\s+(.+)$/gm, '<div style="margin-left: 20px;">• $1</div>');
        
        // Convert code blocks ```
        text = text.replace(/```(.+?)```/gs, '<pre style="background: #0d1117; padding: 10px; border-radius: 5px; overflow-x: auto; margin: 10px 0;"><code>$1</code></pre>');
        
        // Convert inline code `code`
        text = text.replace(/`(.+?)`/g, '<code style="background: #0d1117; padding: 2px 6px; border-radius: 3px; font-family: monospace;">$1</code>');
        
        // Convert line breaks to <br>
        text = text.replace(/\n/g, '<br>');
        
        return text;
    }

    // Function to add a message to the chat history
    function addMessage(text, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user-message' : 'ai-message');
        
        if (isUser) {
            messageDiv.textContent = text;
        } else {
            messageDiv.innerHTML = formatMessage(text);
        }
        
        chatHistory.appendChild(messageDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Function to show loading indicator
    function showLoading() {
        const loadingDiv = document.createElement('div');
        loadingDiv.classList.add('message', 'ai-message');
        loadingDiv.id = 'loading-message';
        loadingDiv.innerHTML = `
            <div class="typing-indicator">
                <div class="loading"></div>
                <span>AI_RIFAI is thinking...</span>
            </div>
        `;
        chatHistory.appendChild(loadingDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
        sendButton.disabled = true;
    }

    // Function to hide loading indicator
    function hideLoading() {
        const loadingElement = document.getElementById('loading-message');
        if (loadingElement) {
            loadingElement.remove();
        }
        sendButton.disabled = false;
    }

    // Function to show error message
    function showError(text) {
        const errorDiv = document.createElement('div');
        errorDiv.classList.add('message', 'error-message');
        errorDiv.textContent = text;
        chatHistory.appendChild(errorDiv);
        chatHistory.scrollTop = chatHistory.scrollHeight;
    }

    // Function to send message to backend
    async function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        // Add user message to chat
        addMessage(message, true);
        messageInput.value = '';
        messageInput.style.height = 'auto';

        // Show loading indicator
        showLoading();

        try {
            // Send message to backend
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: message })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Hide loading indicator
            hideLoading();
            
            // Add AI response to chat
            if (data.response) {
                addMessage(data.response, false);
            } else if (data.error) {
                showError(`Error: ${data.error}`);
            }
        } catch (error) {
            // Hide loading indicator
            hideLoading();
            showError(`Error: ${error.message}`);
        }
    }

    // Event listeners
    sendButton.addEventListener('click', sendMessage);

    messageInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Add welcome message
    setTimeout(() => {
        addMessage("Hello! I'm AI_RIFAI, your advanced AI assistant powered by Google's Gemini technology. How can I assist you today?", false);
    }, 500);
});