import React from 'react';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Home, Create, Detail } from './components/pages';
import { Footer, Header } from './components/common';
import { VwblContainer } from './container';

function App() {
  return (
    <BrowserRouter>
      <VwblContainer.Provider>
        <div className="App">
          <Header />
          <Routes>
            <Route path={'/'} element={<Home />} />
            <Route path={'/new/'} element={<Create />} />
            <Route path={'/assets/:id'} element={<Detail />} />
          </Routes>
          <Footer />
        </div>
      </VwblContainer.Provider>
    </BrowserRouter>
  );
}

export default App;
