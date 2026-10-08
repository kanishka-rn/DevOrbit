import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { UploadPage } from './pages/UploadPage';
import { WorkspacePage } from './pages/WorkspacePage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<UploadPage />} />
          <Route path="workspace" element={<WorkspacePage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
