import { useEffect } from 'react';
import { useNavigate } from 'react-router';

// This component is no longer needed since email verification is disabled
// Redirecting to home page
export const Verification = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/');
  }, [navigate]);

  return null;
};
