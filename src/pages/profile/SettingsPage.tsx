import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppHeader } from '@/components/AppHeader';

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="page-container" style={{ background: 'linear-gradient(160deg, #fff5ec 0%, #fde8d0 30%, #f5f5f5 60%)' }}>
      <AppHeader title="设置" showBack />

      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div
          style={{
            background: 'linear-gradient(145deg, #fff0f0, #ffe8e8)',
            borderRadius: '22px',
            border: '2px solid rgba(254, 202, 202, 0.8)',
            boxShadow: '0 6px 20px rgba(220,38,38,0.10), inset 0 2px 0 rgba(255,255,255,0.90)',
            overflow: 'hidden',
          }}
        >
          <button
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              padding: '1rem 1.125rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <div
              style={{
                width: '2.25rem',
                height: '2.25rem',
                background: 'linear-gradient(145deg, #fecaca, #fca5a5)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: '0 3px 8px rgba(220,38,38,0.18), inset 0 1px 0 rgba(255,255,255,0.6)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="#dc2626" />
              </svg>
            </div>
            <span style={{ flex: 1, fontSize: '0.9375rem', fontWeight: 800, color: '#dc2626' }}>
              退出登录
            </span>
          </button>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--color-text-placeholder)', fontWeight: 600, paddingBottom: '1rem' }}>
          小日记 · 记录每一个温柔的瞬间
        </p>
      </div>
    </div>
  );
};
