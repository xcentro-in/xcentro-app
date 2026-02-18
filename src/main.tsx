import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import Clarity from '@microsoft/clarity';
import './index.css'

// 1. Initialize default analytics preference if not set
// This ensures new users have analytics ENABLED by default
if (localStorage.getItem('analytics-opt-out') === null) {
    // No preference set yet - default to analytics ENABLED (no opt-out flag)
    // User can opt-out later via Settings > Security > Help Improve Xcentro
    localStorage.removeItem('analytics-opt-out'); // Ensure it's not set
}

// 2. Check if user has opted out
const isOptedOut = localStorage.getItem('analytics-opt-out') === 'true';

// 3. Only initialize Clarity if they haven't opted out
const clarityProjectId = import.meta.env.VITE_CLARITY_PROJECT_ID;
if (!isOptedOut && clarityProjectId) {
    Clarity.init(clarityProjectId);
}

createRoot(document.getElementById("root")!).render(<App />);
