import { Routes, Route } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import ProjectForm from './pages/ProjectForm';
import StatusPage from './pages/StatusPage';

function App() {
  return (
  <div className='dark bg-zinc-900 text-white min-h-screen'>

    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/form" element={<ProjectForm />} />
      <Route path="/status" element={<StatusPage />} />
    </Routes>
  </div>
  );
}

export default App;
