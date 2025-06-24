
# Mental Health Chat Application

A compassionate AI-powered chat application designed to provide mental health support and guidance. Built with modern web technologies to create a safe, responsive, and user-friendly environment for mental wellness conversations.

## Features

- **AI-Powered Chat**: Intelligent responses powered by advanced AI to provide supportive mental health conversations
- **Smart Quick Responses**: Context-aware suggested responses that adapt based on conversation history
- **Customizable Experience**: Adjustable settings for response length and tone preferences
- **Theme Support**: Light and dark mode support with custom color schemes
- **Responsive Design**: Optimized for desktop and mobile devices
- **Real-time Interaction**: Smooth, real-time chat experience with typing indicators
- **Privacy Focused**: Secure conversation handling with user privacy in mind

## Technology Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **State Management**: Context API with React Query
- **Backend**: Supabase Edge Functions
- **AI Integration**: Google Gemini API
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js (version 18 or higher)
- npm or yarn package manager

### Installation

```sh
# Step 1: Clone the repository
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory
cd <YOUR_PROJECT_NAME>

# Step 3: Install dependencies
npm install

# Step 4: Start the development server
npm run dev
```

### Environment Setup

To enable AI chat functionality, you'll need to configure the following environment variables in your Supabase project:

- `GEMINI_API_KEY`: Your Google Gemini API key for AI responses

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ChatInput.tsx   # Message input component
│   ├── ChatMessage.tsx # Individual message display
│   ├── QuickResponses.tsx # Suggested response buttons
│   └── SettingsDialog.tsx # User preferences
├── context/            # React context providers
│   ├── ChatContext.tsx # Chat state management
│   └── ThemeContext.tsx # Theme switching
├── pages/              # Application pages
└── integrations/       # External service integrations
```

## Usage

1. **Start a Conversation**: Type your message in the input field or select from quick response suggestions
2. **Customize Experience**: Use the settings dialog to adjust response length and tone preferences
3. **Theme Toggle**: Switch between light and dark modes using the theme toggle button
4. **Mobile Friendly**: Access the application on any device for on-the-go support

## Contributing

This project welcomes contributions to improve mental health support features. Please ensure all contributions maintain the supportive and safe nature of the application.

## Deployment

The application can be deployed using various hosting platforms:

- **Vercel**: Connect your GitHub repository for automatic deployments
- **Netlify**: Deploy directly from your repository
- **Supabase**: Use Supabase hosting for full-stack deployment

## License

This project is designed to provide mental health support and should be used responsibly alongside professional mental health resources when needed.

## Support

If you encounter any issues or have suggestions for improving the mental health support features, please create an issue in the repository.

---

*Remember: This application is designed to provide supportive conversation but is not a replacement for professional mental health care. If you're experiencing a mental health crisis, please contact a mental health professional or crisis hotline immediately.*
