
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

// Redirect to the dashboard
const Index = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/dashboard');
  }, [navigate]);

  return <div>Redirecting to Dashboard...</div>;
};

export default Index;
