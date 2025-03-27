
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const FormBuilderRedirect: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the form builder page
    navigate('/form-builder');
    toast.info('Redirecting to form builder...');
  }, [navigate]);
  
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Loading Form Builder...</h1>
        <p className="text-gray-600">Please wait while we redirect you.</p>
      </div>
    </div>
  );
};

export default FormBuilderRedirect;
