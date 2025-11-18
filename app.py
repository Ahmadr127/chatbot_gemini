import os
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Configure Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Configure Gemini API
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY', 'AIzaSyBwDPexu2ERe_c6rAwry4K_YUmVmx9XinY')
genai.configure(api_key=GEMINI_API_KEY)

# Set up the model
model_name = os.getenv('GEMINI_MODEL', 'gemini-pro')
model = genai.GenerativeModel(model_name)

@app.route('/')
def index():
    """Serve the chat interface"""
    return render_template('index.html')

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages"""
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        
        if not user_message:
            return jsonify({'error': 'Message is required'}), 400
        
        # Get generation config from environment or use defaults
        generation_config = {
            'temperature': float(os.getenv('TEMPERATURE', '0.7')),
            'top_p': float(os.getenv('TOP_P', '0.9')),
            'max_output_tokens': int(os.getenv('MAX_OUTPUT_TOKENS', '2048')),
        }
        
        # Get system prompt if provided
        system_prompt = os.getenv('SYSTEM_PROMPT')
        
        # Prepare the prompt
        if system_prompt:
            prompt = f"{system_prompt}\n\nUser: {user_message}\nAssistant:"
        else:
            prompt = user_message
            
        # Generate response
        response = model.generate_content(
            prompt,
            generation_config=generation_config
        )
        
        return jsonify({
            'response': response.text
        })
        
    except Exception as e:
        app.logger.error(f"Error in chat endpoint: {str(e)}")
        return jsonify({'error': 'An error occurred while processing your request'}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)