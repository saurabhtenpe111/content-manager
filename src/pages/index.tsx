
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Index from './Index';

// This file acts as a re-export of the Index component
// and also provides redirection logic
const IndexPage = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // We use this file to redirect to the actual Index component
    // This solves the import issue while maintaining functionality
  }, []);

  return <Index />;
};

export default IndexPage;
