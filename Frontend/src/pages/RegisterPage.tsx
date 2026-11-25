import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../api/authApi';
import { useAuth } from '../context/useAuth';

interface RegisterFormErrors {
  username?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<RegisterFormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): RegisterFormErrors => {
    const nextErrors: RegisterFormErrors = {};
    const trimmedUsername = username.trim();
    const trimmedEmail = email.trim();

    if (!trimmedUsername) {
      nextErrors.username = 'Το username είναι υποχρεωτικό.';
    } else if (trimmedUsername.length < 3) {
      nextErrors.username = 'Το username πρέπει να έχει τουλάχιστον 3 χαρακτήρες.';
    } else if (trimmedUsername.length > 50) {
      nextErrors.username = 'Το username δεν μπορεί να υπερβαίνει τους 50 χαρακτήρες.';
    }

    if (!trimmedEmail) {
      nextErrors.email = 'Το email είναι υποχρεωτικό.';
    } else if (!EMAIL_REGEX.test(trimmedEmail)) {
      nextErrors.email = 'Εισήγαγε μια έγκυρη διεύθυνση email.';
    }

    if (!password) {
      nextErrors.password = 'Ο κωδικός πρόσβασης είναι υποχρεωτικός.';
    } else if (password.length < 6) {
      nextErrors.password = 'Ο κωδικός πρέπει να έχει τουλάχιστον 6 χαρακτήρες.';
    }

    if (!confirmPassword) {
      nextErrors.confirmPassword = 'Η επιβεβαίωση κωδικού είναι υποχρεωτική.';
    } else if (password !== confirmPassword) {
      nextErrors.confirmPassword = 'Οι κωδικοί δεν ταιριάζουν.';
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
      const response = await register({
        username: username.trim(),
        email: email.trim(),
        password,
      });

      navigate('/', {
        replace: true,
        state: {
          successMessage: `Ο λογαριασμός "${response.username}" δημιουργήθηκε με επιτυχία!`,
        },
      });
    } catch (error) {
      setApiError(
        getApiErrorMessage(error, 'Αποτυχία εγγραφής. Δοκίμασε ξανά.')
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-card">
      <h1>Εγγραφή</h1>
      <p className="auth-subtitle">Δημιούργησε νέο λογαριασμό στο TechStore.</p>

      {apiError && <div className="alert alert-error">{apiError}</div>}

      <form onSubmit={handleSubmit} noValidate className="auth-form">
        <div className="form-group">
          <label htmlFor="register-username">Username</label>
          <input
            id="register-username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Τουλάχιστον 3 χαρακτήρες"
            autoComplete="username"
          />
          {errors.username && <span className="field-error">{errors.username}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            autoComplete="email"
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="register-password">Κωδικός πρόσβασης</label>
          <input
            id="register-password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Τουλάχιστον 6 χαρακτήρες"
            autoComplete="new-password"
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="register-confirm-password">Επιβεβαίωση κωδικού</label>
          <input
            id="register-confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Επανέλαβε τον κωδικό"
            autoComplete="new-password"
          />
          {errors.confirmPassword && (
            <span className="field-error">{errors.confirmPassword}</span>
          )}
        </div>

        <button type="submit" className="btn-primary" disabled={isSubmitting}>
          {isSubmitting ? 'Δημιουργία...' : 'Δημιουργία λογαριασμού'}
        </button>
      </form>

      <p className="auth-footer">
        Έχεις ήδη λογαριασμό; <Link to="/login">Σύνδεση</Link>
      </p>
    </section>
  );
}