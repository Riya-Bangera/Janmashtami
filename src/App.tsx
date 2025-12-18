import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import routes from './routes';
import { AppProvider } from '@/contexts/AppContext';
import { Toaster } from '@/components/ui/toaster';

const App: React.FC = () => {
  return (
    <Router>
      <AppProvider>
        <div className="flex flex-col min-h-screen">
          <main className="flex-grow">
            <Routes>
              {routes.map((route, index) => (
                <Route
                  key={index}
                  path={route.path}
                  element={route.element}
                />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
        <Toaster />
      </AppProvider>
    </Router>
  );
};

export default App;
