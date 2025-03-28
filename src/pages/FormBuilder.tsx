
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormBuilderRedirect from './form-builder';

const FormBuilder: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the form builder index page
    navigate('/form-builder', { replace: true });
  }, [navigate]);
  
  return <FormBuilderRedirect />;
};

export default FormBuilder;
