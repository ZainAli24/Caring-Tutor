# **App Name**: Caring Tutor

## Core Features:

- AI Tutor Chat (Streaming): Real-time streaming chat completions powered by Google Vertex AI's `gemini-2.5-flash` via a Python Cloud Run server. Features robust error handling, timeouts, retries, and fallback mechanisms using cached responses in Firestore.
- Adaptive Test Generation: Dynamically generate quizzes and tests based on user's current skill level and learning goals, seeded with sample questions, and fallback to static cached options for speed/offline.
- Automated Grading & Sentiment Analysis: Grade user attempts, derive sentiment from responses and interactions to assess student wellbeing via a rule-based sentiment and feedback engine.
- User Authentication: Secure user authentication (login/logout) to track progress, chat history, and personalize test/lesson plans, integrated natively with Firebase Auth.
- Dashboard Overview: Centralized dashboard to track completed lessons, tests, grades, sentiment analysis, and areas needing improvement, with UI organized around learning goals.
- Profile & Progress: Profile page displaying user's information, learning history, achievements, and areas for improvement.
- Teacher's Dashboard: A simplified Teacher dashboard with user search/management/reporting functions, designed to highlight issues proactively and give basic intervention levers.

## Style Guidelines:

- Primary color: Calming Blue (#64B5F6), providing a sense of tranquility and focus for the user.
- Background color: Very Light Blue (#F0F8FF), subtly different from pure white to reduce eye strain.
- Accent color: Gentle Orange (#FFAB40) for highlighting important actions and positive feedback.
- Font pairing: 'Space Grotesk' (sans-serif) for headlines and 'Inter' (sans-serif) for body text to offer a clean and tech-friendly reading experience.
- Consistent and intuitive icons aligned with learning concepts, designed to convey positivity, assistance, and growth, using a flat design style.
- Clean and well-spaced layouts to maximize content clarity and reduce cognitive load.
- Use smooth transitions and feedback animations, providing positive reinforcement and a sense of progression.