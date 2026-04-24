import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppHeader } from '@/components/AppHeader';
import type { ReactNode } from 'react';

interface SettingItem {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  danger?: boolean;
}

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const settingItems: SettingItem[] = [
    {
      label: '账号与安全',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"
            fill="currentColor"
          />
        </svg>
      ),
      onClick: () => {},
    },
    {
      label: '通知设置',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"
            fill="currentColor"
          />
        </svg>
      ),
      onClick: () => {},
    },
    {
      label: '隐私设置',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z"
            fill="currentColor"
          />
        </svg>
      ),
      onClick: () => {},
    },
    {
      label: '关于',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"
            fill="currentColor"
          />
        </svg>
      ),
      onClick: () => {},
    },
    {
      label: '退出登录',
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
          <path
            d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z"
            fill="currentColor"
          />
        </svg>
      ),
      onClick: handleLogout,
      danger: true,
    },
  ];

  return (
    <div className="page-container">
      <AppHeader title="设置" showBack />

      <div style={{ padding: '1rem' }}>
        {settingItems.map((item, index) => (
          <button
            key={index}
            onClick={item.onClick}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.875rem',
              padding: '1rem',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-md)',
              cursor: 'pointer',
              textAlign: 'left',
              marginBottom: '0.5rem',
              color: item.danger ? '#e53e3e' : 'var(--color-text-primary)',
              transition: 'all 0.15s',
            }}
          >
            <span style={{ color: item.danger ? '#e53e3e' : 'var(--color-text-muted)' }}>
              {item.icon}
            </span>
            <span style={{ flex: 1, fontSize: '0.9375rem', fontWeight: 600 }}>{item.label}</span>
            {!item.danger && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 18l6-6-6-6"
                  stroke="var(--color-text-placeholder)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
