import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { UploadPage } from './pages/UploadPage';
import { WorkspacePage } from './pages/WorkspacePage';
import { EvaluationPage } from './pages/EvaluationPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<UploadPage />} />
          <Route path="workspace" element={<WorkspacePage />} />
          <Route path="evaluation" element={<EvaluationPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
