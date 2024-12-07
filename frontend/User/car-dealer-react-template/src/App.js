import './App.css';

import { Header, Navbar } from './components/Header/Header';
import Admin from './admin/admin';
import { CarDetail } from './components/DesignCar/ChiTiet';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Admin />} />
          <Route path="/car/:id" element={<CarDetail />} />
        </Routes>

      </div >


    </Router >
  );
}

export default App;
