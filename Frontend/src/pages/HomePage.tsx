import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

interface LocationState {
  successMessage?: string;
}

export function HomePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const location = useLocation();
  const state = location.state as LocationState | null;

  if (isLoading) {
    return (
      <section className="home-card">
        <p>Έλεγχος συνεδρίας...</p>
      </section>
    );
  }

  return (
    <section className="home-card">
      <h1>TechStore E-Shop</h1>

      {state?.successMessage && (
        <div className="alert alert-success">{state.successMessage}</div>
      )}

      {isAuthenticated && user ? (
        <div className="user-panel">
          <p>
            Συνδεδεμένος ως <strong>{user.username}</strong> ({user.email})
          </p>
          <p>
            Ρόλος: <span className="role-badge">{user.role}</span>
          </p>
          <button type="button" className="btn-secondary" onClick={logout}>
            Αποσύνδεση
          </button>
        </div>
      ) : (
        <div className="guest-panel">
          <p>Συνδέσου ή δημιούργησε λογαριασμό για να ξεκινήσεις τις αγορές σου.</p>
          <div className="actions-row">
            <Link to="/login" className="btn-primary">
              Σύνδεση
            </Link>
            <Link to="/register" className="btn-secondary">
              Εγγραφή
            </Link>
          </div>
        </div>
      )}
    </section>
  );
}