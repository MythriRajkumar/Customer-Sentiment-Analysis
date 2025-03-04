import './App.css';
import HomePage from './components/HomePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SentimentDashboard from './components/SentimentDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<SentimentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;