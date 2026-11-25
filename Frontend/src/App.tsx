import { BrowserRouter, Link, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="navbar">
      <Link to="/" className="navbar-brand">
        TechStore
      </Link>

      <nav className="navbar-links">
        {isAuthenticated && user ? (
          <>
            <span className="navbar-user">
              {user.username} <span className="role-badge">{user.role}</span>
            </span>
            <button type="button" className="btn-link" onClick={logout}>
              Αποσύνδεση
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Σύνδεση</Link>
            <Link to="/register">Εγγραφή</Link>
          </>
        )}
      </nav>
    </header>
  );
}

export function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app-shell">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;