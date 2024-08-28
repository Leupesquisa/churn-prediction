import React, { useState } from 'react';
import Header from '../components/commom/Header';
import Footer from '../components/commom/Footer';
import './MainLayout.css';
import Sidebar from './Sidebar.jsx';



const MainLayout = ({ children }) => {
  const [selectedModel, setSelectedModel] = useState('logistic_regression');

  return (
    <div className="main-layout">
      <Header />
      <div className="container-fluid">
        <div className="row">
          <nav className="col-md-2 sidebar">
            <Sidebar
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
            />
          </nav>
          <main role="main" className="col-md-9 ml-sm-auto col-lg-10 px-4 main-content">
            {React.cloneElement(children, { selectedModel })}
            <div className="d-flex justify-content-end mt-3">
              <button className="btn btn-outline-light logout-btn">Log out</button>
            </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MainLayout;