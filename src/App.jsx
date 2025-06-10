import Index from './pages/homePage.jsx';
import ChatPage from './pages/chatPage/chatPage.jsx';
import Admin from './pages/AdminPage.jsx';
import AdminUploadRaw from './pages/admin/uploadRaw.jsx';
import UploadJsonQnaPage from './pages/admin/uploadQnaPage.jsx';
import AdminUploadLlama from './pages/admin/uploadDocGemini.jsx';
import AdminLogin from './pages/AdminLogin.jsx';
import PrivateRoute from './secure/privateRoute.jsx';
import AdminPrivateRoute from './secure/adminPrivateRoute.jsx';
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
                <ChatPage />
              </PrivateRoute>
            }
          />
          {/* <Route
            path="/admin"
            element={
              <AdminPrivateRoute>
                <Admin />
              </AdminPrivateRoute>
            }
          /> */}
          <Route
            path="/admin/upload/raw/iit-ism-llama-text-embed-v2-index"
            element={
              <AdminPrivateRoute>
                <AdminUploadRaw />
              </AdminPrivateRoute>
            }
          />
           <Route
            path="/admin/upload/json/iit-ism-llama-text-embed-v2-index"
            element={
              <AdminPrivateRoute>
                <UploadJsonQnaPage />
              </AdminPrivateRoute>
            }
          />
          <Route
            path="/admin/upload/iit-ism-llama-text-embed-v2-index"
            element={
              <AdminPrivateRoute>
                <AdminUploadLlama />
              </AdminPrivateRoute>
            }
          />
          <Route
            path="/admin/login"
            element={
                <AdminLogin />
            }
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;


