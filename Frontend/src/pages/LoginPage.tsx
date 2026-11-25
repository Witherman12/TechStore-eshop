import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../api/authApi';
import { useAuth } from '../context/useAuth';

interface LoginFormErrors {
  username?: string;
  password?: string;
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<LoginFormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): LoginFormErrors => {
    const nextErrors: LoginFormErrors = {};

    if (!username.trim()) {
      nextErrors.username = 'Το username είναι υποχρεωτικό.';
    }

    if (!password) {
      nextErrors.password = 'Ο κωδικός πρόσβασης είναι υποχρεωτικός.';
    }

    return nextErrors;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setApiError(null);

    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await login({
        username: username.trim(),
        password,
      });

      navigate('/', {
        replace: true,
        state: {
          successMessage: `Επιτυχής σύνδεση! Καλώς ήρθες, ${response.username}.`,
        },
      });
    } catch (error) {
      setApiError(
        getApiErrorMessage(error, 'Αποτυχία σύνδεσης. Έλεγξε τα στοιχεία σου.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-card">
      <h1>Σύνδεση</h1>
      <p className="auth-subtitle">Συνδέσου στον λογαριασμό σου στο TechStore.</p>

      {apiError && <div className="alert alert-error">{apiError}</div>}

      <form onSubmit={handleSubmit} noValidate className="auth-form">
        <div className="form-group">
          <label htmlFor="login-username">Username</label>
          <input
            id="login-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="π.χ. Dev_testing"
            autoComplete="username"
          />
          {errors.username && <span className="field-error">{errors.username}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="login-password">Κωδικός πρόσβασης</label>
          <input
            id="login-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Σύνδεση...' : 'Σύνδεση'}
        </button>
      </form>

      <p className="auth-footer">
        Δεν έχεις λογαριασμό; <Link to="/register">Εγγραφή</Link>
      </p>
    </section>
  );
}