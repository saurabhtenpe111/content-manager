
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const FormBuilderRedirect: React.FC = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simply show the form builder UI instead of redirecting (since we're already at the right URL)
    toast.info('Welcome to the form builder');
  }, []);
  
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Form Builder</h1>
        <div className="flex items-center gap-4">
          <button 
            className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
            onClick={() => navigate('/content-types')}
          >
            Create New Form
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm p-8 border">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-3">No Forms Created Yet</h2>
          <p className="text-muted-foreground mb-6">
            Create your first form to get started with collecting data from your users.
          </p>
          <button 
            className="bg-primary text-white px-6 py-3 rounded-md hover:bg-primary/90 transition-colors"
            onClick={() => navigate('/content-types')}
          >
            Create Your First Form
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormBuilderRedirect;
