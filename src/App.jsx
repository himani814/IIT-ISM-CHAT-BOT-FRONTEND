import Index from './pages/homePage.jsx';
import ChatPage from './pages/chatPage/chatPage.jsx';
// import Admin from './pages/AdminPage.jsx';

import AdminMainPage from './pages/admin/mainPage.jsx';
import AdminFolderPage from './pages/admin/subFolderPage.jsx';

import AdminUploadPdfPage from './pages/admin/uploadPdfPage.jsx';
import AdminUploadRawPage from './pages/admin/uploadRawPage.jsx';
import AdminUploadQnaPage from './pages/admin/uploadQnaPage.jsx';


import AdminLogin from './pages/AdminLogin.jsx';
import PrivateRoute from './secure/privateRoute.jsx';
import AdminPrivateRoute from './secure/adminPrivateRoute.jsx';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Index />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* User Routes */}
          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <ChatPage />
              </PrivateRoute>
            }
          />





          {/* Admin Routes */}
          <Route
            path="/admin/main"
            element={
              <AdminPrivateRoute>
                <AdminMainPage />
              </AdminPrivateRoute>
            }
          />



          
          <Route
            path="/admin/pdf/:folder_id"
            element={
              <AdminPrivateRoute>
                 <AdminFolderPage />
              </AdminPrivateRoute>
            }
          />
          <Route
            path="/admin/qna/:folder_id"
            element={
              <AdminPrivateRoute>
                 <AdminFolderPage />
              </AdminPrivateRoute>
            }
          />
          <Route
            path="/admin/raw/:folder_id"
            element={
              <AdminPrivateRoute>
                 <AdminFolderPage />
              </AdminPrivateRoute>
            }
          />






          <Route
            path="/admin/pdf/subfolder/:folder_id"
            element={
              <AdminPrivateRoute>
                <AdminUploadPdfPage/>
              </AdminPrivateRoute>
            }
          />
          <Route
            path="/admin/raw/subfolder/:folder_id"
            element={
              <AdminPrivateRoute>
                <AdminUploadRawPage />
              </AdminPrivateRoute>
            }
          />
          <Route
            path="/admin/qna/subfolder/:folder_id"
            element={
              <AdminPrivateRoute>
                <AdminUploadQnaPage />
              </AdminPrivateRoute>
            }
          />
          
        </Routes>
      </div>
    </Router>
  );
};

export default App;
