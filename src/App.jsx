
import Index from './pages/ChatLandingPage.jsx'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Chat from './components/chat.jsx'

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Index/>} />
          <Route path="/chat" element={<Chat/>} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;


