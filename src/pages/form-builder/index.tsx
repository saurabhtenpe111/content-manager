
import React from 'react';
import { CMSLayout } from '@/components/layout/CMSLayout';
import { Link } from 'react-router-dom';

const FormBuilderRedirect: React.FC = () => {
  return (
    <CMSLayout>
      <div className="text-center mt-12">
        <h1 className="text-2xl font-bold mb-4">Form Builder</h1>
        <p className="mb-6">The form builder functionality will be available soon.</p>
        <Link to="/content-types" className="text-blue-500 hover:underline">
          Go to Content Types
        </Link>
      </div>
    </CMSLayout>
  );
};

export default FormBuilderRedirect;
