import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage';
import UploadPage from './pages/FileUploadPage';
import DownloadPage from './pages/FileDownloadPage';
import GenerateLinkPage from './pages/GenerateLinkPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<UploadPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<RegisterPage />} />
          <Route path="/upload" element={<Navigate to="/" replace />} />
          <Route path="/download/:shareId" element={<DownloadPage />} />
          <Route path="/generate-link" element={<GenerateLinkPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
