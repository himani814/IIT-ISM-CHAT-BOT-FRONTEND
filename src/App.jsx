import Index from './pages/ChatLandingPage.jsx';
import Chat from './pages/ChatPage.jsx';
import Admin from './pages/AdminPage.jsx';
import PrivateRoute from './secure/privateRoute.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <Admin/>
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;


