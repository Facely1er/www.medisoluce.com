import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../ProtectedRoute';

const authState = {
  user: null as { id: string; email: string } | null,
  loading: false,
  authProvider: 'local' as 'local' | 'supabase',
  signOut: vi.fn(),
};

vi.mock('../../../context/AuthContext', () => ({
  useAuth: () => authState,
}));

vi.mock('../../../config/runtimeConfig', async () => {
  const actual = await vi.importActual<typeof import('../../../config/runtimeConfig')>(
    '../../../config/runtimeConfig'
  );
  return {
    ...actual,
    isSupabaseAuthEnabled: true,
  };
});

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/login" element={<div>login-page</div>} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <div>dashboard-page</div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </MemoryRouter>
  );
}

describe('ProtectedRoute (Supabase mode)', () => {
  beforeEach(() => {
    authState.user = null;
    authState.loading = false;
  });

  it('shows a loading state while the session is resolving', () => {
    authState.loading = true;
    renderAt('/dashboard');
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.queryByText('dashboard-page')).not.toBeInTheDocument();
    expect(screen.queryByText('login-page')).not.toBeInTheDocument();
  });

  it('redirects unauthenticated visitors to login', () => {
    renderAt('/dashboard');
    expect(screen.getByText('login-page')).toBeInTheDocument();
    expect(screen.queryByText('dashboard-page')).not.toBeInTheDocument();
  });

  it('renders the account page when a session exists', () => {
    authState.user = { id: 'user-1', email: 'ciso@clinic.example' };
    renderAt('/dashboard');
    expect(screen.getByText('dashboard-page')).toBeInTheDocument();
  });
});
