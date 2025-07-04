﻿📬 AI Email Smart Reply App
This is a full-stack project that adds AI-powered smart reply generation to Gmail. It includes:

✅ A frontend Gmail extension that injects an "AI Reply" button into the compose toolbar.

✅ A backend Spring Boot service that communicates with the Gemini API (or compatible LLM API) to generate professional email replies.

🖥️ Frontend (Gmail Extension)
✅ Features
Detects Gmail's compose window.

Injects a native-looking "AI Reply" button.

Extracts original email content.

Sends content to backend to generate a professional reply.

Inserts the reply directly into Gmail's compose box.

🚀 How It Works
Uses DOM observers to detect Gmail's compose window.

When clicked, the "AI Reply" button sends the email thread content to the backend.

Receives the AI-generated reply and injects it into the Gmail compose area.

🛠 Setup
Open Gmail in Chrome.

Use frontend-extension/content-script.js via:

[Option A] Chrome DevTools Snippet

[Option B] Chrome Extension (requires manifest.json)

Ensure your Spring Boot backend is running at http://localhost:8080.

🧠 Backend (Spring Boot Service)
✅ Features
Accepts email content and tone.

Builds a dynamic prompt.

Sends request to the Gemini API.

Parses and returns the generated email reply.

🔧 Configuration (application.properties)
properties
Copy
Edit
gemini.api.url=https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=
gemini.api.key=YOUR_API_KEY


🧪 Development Notes
Frontend
May require updating CSS selectors if Gmail UI changes.

Inject using DevTools Snippet or convert to a Chrome Extension.

Backend
Requires a Gemini API key.

Uses WebClient for non-blocking HTTP requests.

Parses nested JSON from Gemini's response.

