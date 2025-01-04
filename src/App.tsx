import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import Register from './Pages/Register';
import Details from './Pages/Details';
import Dashboard from './Pages/Dashboard';

const App = () => {
  return (
    <Router>
      <header className="bg-blue-500 text-white p-4">
          <h1 className="text-2xl font-semibold">AICTE Tracker App</h1>
        </header>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/details" element={<Details />} />
      </Routes>
    </Router>
  );
};

export default App;
