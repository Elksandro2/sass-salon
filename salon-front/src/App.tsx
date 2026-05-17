import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { AlertProvider } from './context/AlertContext';
import { Router } from './Router';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <BrowserRouter>
      <AlertProvider>
        <AuthProvider>
          <Router />
        </AuthProvider>
      </AlertProvider>
    </BrowserRouter>
  );
}

export default App;
