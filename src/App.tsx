import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { LoginPage } from '@/pages/auth/LoginPage';
import { RegisterPage } from '@/pages/auth/RegisterPage';
import { JournalListPage } from '@/pages/journals/JournalListPage';
import { JournalDetailPage } from '@/pages/journals/JournalDetailPage';
import { JournalFormPage } from '@/pages/journals/JournalFormPage';
import { ProfilePage } from '@/pages/profile/ProfilePage';
import { SettingsPage } from '@/pages/profile/SettingsPage';
import { FriendsPage } from '@/pages/friends/FriendsPage';
import { PrivateRoute } from '@/components/PrivateRoute';

const App = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/journals" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/journals"
            element={
              <PrivateRoute>
                <JournalListPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/journal/new"
            element={
              <PrivateRoute>
                <JournalFormPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/journal/:id"
            element={
              <PrivateRoute>
                <JournalDetailPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/journal/:id/edit"
            element={
              <PrivateRoute>
                <JournalFormPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route
            path="/friends"
            element={
              <PrivateRoute>
                <FriendsPage />
              </PrivateRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            }
          />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
