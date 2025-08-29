If you are using React Router, create a route for the auth callback:

Example (React Router v6):
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import AuthCallback from '../components/AuthCallback';

<BrowserRouter>
  <Routes>
    <Route path="/" element={<App />} />
    <Route path="/auth/callback" element={<AuthCallback />} />
  </Routes>
</BrowserRouter>

If you are not using a router, Supabase auth will still parse session from URL when the component is mounted
(e.g., if you mount <AuthCallback /> on a page that loads at /auth/callback).
