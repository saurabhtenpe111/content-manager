
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Run migration for adding UI options column
import { migrateAddUIOptions } from './migrations/add-ui-options';

// Try to run the migration when the app starts
migrateAddUIOptions()
  .then(migrated => {
    if (migrated) {
      console.log('Database migration completed successfully');
    } else {
      console.log('No migration needed or migration skipped');
    }
  })
  .catch(error => {
    console.error('Migration error:', error);
  });

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
