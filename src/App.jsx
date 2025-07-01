import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/layout/Layout';
import routes from './routes';

const App = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Layout>
            {routes}
          </Layout>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;