import { useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';

export default function AuthCallback() {
  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSessionFromUrl();
        if (error) throw error;

        if (data?.session) {
          // Redirect to home or dashboard after successful login
          window.location.replace('/');
        } else {
          window.location.replace('/auth/error');
        }
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Auth callback error:', err);
        window.location.replace('/auth/error');
      }
    };

    handleAuthCallback();
  }, []);

  return <div>Processing authentication...</div>;
}
