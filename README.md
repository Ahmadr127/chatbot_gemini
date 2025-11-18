# AI_RIFAI - Gemini Chat Application

A Flask-based web application that provides a chat interface for interacting with Google's Gemini AI API.

## Screenshot

![AI_RIFAI Chat Interface](screenshot.png)

## Features

- Clean, responsive dark mode chat interface
- Real-time communication with Gemini AI
- Loading indicators during API requests
- Error handling for failed requests
- Environment-based configuration
- Cross-origin resource sharing (CORS) support

## Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

## Installation

1. Clone or download this repository

2. Create a virtual environment:
   ```bash
   python -m venv venv
   ```

3. Activate the virtual environment:
   - On Windows:
     ```bash
     venv\Scripts\activate
     ```
   - On macOS/Linux:
     ```bash
     source venv/bin/activate
     ```

4. Install the required packages:
   ```bash
   pip install -r requirements.txt
   ```

## Configuration

The application uses environment variables for configuration. These are loaded from the `.env` file:

- `GEMINI_API_KEY`: Your Google Gemini API key (default: AIzaSyBwDPexu2ERe_c6rAwry4K_YUmVmx9XinY)
- `GEMINI_MODEL`: The Gemini model to use (default: gemini-pro)
- `TEMPERATURE`: Controls randomness (default: 0.7)
- `TOP_P`: Controls diversity (default: 0.9)
- `MAX_OUTPUT_TOKENS`: Maximum response length (default: 2048)
- `PORT`: Server port (default: 5000)
- `SYSTEM_PROMPT`: System instruction for the AI (default: "You are a helpful AI assistant.")

## Running the Application

1. Make sure you're in the project directory and the virtual environment is activated

2. Run the Flask application:
   ```bash
   python app.py
   ```

3. Open your web browser and navigate to `http://localhost:5000`

## Usage

1. Type your message in the input box at the bottom of the chat interface
2. Press Enter or click the "Send" button to submit your message
3. Wait for the AI response to appear in the chat history
4. Continue the conversation as desired

## Project Structure

```
.
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── .env                # Environment variables
├── README.md           # This file
├── templates/
│   └── index.html      # Main HTML template
└── static/
    ├── main.js         # Frontend JavaScript
    └── styles.css      # CSS styles
```

## API Endpoints

- `GET /` - Serve the chat interface
- `POST /api/chat` - Handle chat messages and return AI responses

## Error Handling

The application includes error handling for:
- Network issues
- API errors
- Invalid requests
- Server-side exceptions

Errors are displayed in the chat interface with descriptive messages.

## Security

- API keys are stored server-side and never exposed to clients
- CORS is enabled for local development
- Input validation is performed on all requests