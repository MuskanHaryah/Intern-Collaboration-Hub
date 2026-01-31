import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import { CursorGlow } from './components/UI/CursorGlow';

function App() {
  return (
    <Router>
      <CursorGlow />
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
}

export default App;
