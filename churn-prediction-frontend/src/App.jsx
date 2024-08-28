import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import ChurnPredictionForm from './components/features/ChurnPredictionForm';
import CustomerTable from './components/features/CustomerTable';
import VisualizationDashboard from './components/features/VisualizationDashboard';
import CustomerDetails from './components/features/CustomerDetails';
import Login from './layout/Login';
import Register from './layout/Register';
import Home from './layout/Home';
import NotFound from './layout/NotFound';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function Logout() {
  localStorage.clear();
  return <Navigate to="/login" />;
}

function RegisterAndLogout() {
  localStorage.clear();
  return <Register />;
}

function App() {
  return (
    <BrowserRouter>
  {/*      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout>
                <Routes>
                  <Route path="/" element={<Home />} />
                <Route path="/predict-churn" element={<ChurnPredictionForm />} />
                  <Route path="/customers" element={<CustomerTable />} />   
                  <Route path="/dashboard" element={<VisualizationDashboard />} />
                        <Route path="/customer-details/:id" element={<CustomerDetails />} />        
                </Routes>
              </MainLayout>
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<RegisterAndLogout />} />
        <Route path="*" element={<NotFound />} />
      </Routes> */ }







<Routes>
        {/* Rotas sem MainLayout */}
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />

        {/* Rotas com MainLayout  <Route path="/" element={<VisualizationDashboard />} />*/}
        <Route
          path="*"
          element={
            <MainLayout>
              <Routes>
                <Route path="/" element={<ChurnPredictionForm />} />
                <Route path="/predict-churn" element={<ChurnPredictionForm />} />
                <Route path="/customers" element={<CustomerTable />} />
                <Route path="/customer-details/:id" element={<CustomerDetails />} /> 
                <Route path="/dashboard" element={<VisualizationDashboard />} />
               
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
          }
        />
      </Routes>


    </BrowserRouter>
  );
}

export default App;
