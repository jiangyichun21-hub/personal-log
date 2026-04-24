import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppHeader } from '@/components/AppHeader';
import type { ReactNode } from 'react';

interface SettingItem {
  label: string;
  icon: ReactNode;
  action: () => void;
  disabled?: boolean;
  hint?: string;
  rightText?: string;
  danger?: boolean;
}

interface SettingGroup {
  title: string;
  items: SettingItem[];
}

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const settingGroups: SettingGroup[] = [
    {
      title: '账号',
      items: [
        {
          label: '修改密码',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" fill="currentColor" />
            </svg>
          ),
          action: () => {},
          disabled: true,
          hint: '暂未开放',
        },
      ],
    },
    {
      title: '关于',
      items: [
        {
          label: '版本信息',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor" />
            </svg>
          ),
          action: () => {},
          rightText: 'v1.0.0',
        },
      ],
    },
    {
      title: '',
      items: [
        {
          label: '退出登录',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="#ef4444" />
            </svg>
          ),
          action: handleLogout,
          danger: true,
        },
      ],
    },
  ];

  return (
    <div className="page-container" style={{ background: '#f5f5f5', minHeight: '100vh' }}>
      <AppHeader title="设置" showBack />

      <div style={{ padding: '1rem 0' }}>
        {settingGroups.map((group, groupIndex) => (
          <div key={groupIndex} style={{ marginBottom: '0.75rem' }}>
            {group.title && (
              <div style={{
                padding: '0 1.25rem 0.375rem',
                fontSize: '0.75rem',
                color: 'var(--color-text-muted)',
                fontWeight: 700,
                letterSpacing: '0.04em',
              }}>
                {group.title}
              </div>
            )}
            <div style={{
              background: '#fff',
              borderRadius: 'var(--radius-lg)',
              margin: '0 0.875rem',
              overflow: 'hidden',
              boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
            }}>
              {group.items.map((item, itemIndex) => (
                <button
                  key={itemIndex}
                  onClick={item.action}
                  disabled={item.disabled}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    padding: '1rem 1.25rem',
                    background: 'none',
                    border: 'none',
                    borderTop: itemIndex > 0 ? '1px solid var(--color-border)' : 'none',
                    cursor: item.disabled ? 'default' : 'pointer',
                    textAlign: 'left',
                    opacity: item.disabled ? 0.5 : 1,
                  }}
                >
                  <span style={{ color: item.danger ? '#ef4444' : 'var(--color-text-muted)', flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  <span style={{
                    flex: 1,
                    fontSize: '0.9375rem',
                    fontWeight: 600,
                    color: item.danger ? '#ef4444' : 'var(--color-text-primary)',
                  }}>
                    {item.label}
                  </span>
                  {item.hint && (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                      {item.hint}
                    </span>
                  )}
                  {item.rightText && (
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                      {item.rightText}
                    </span>
                  )}
                  {!item.disabled && !item.danger && (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z" fill="var(--color-text-muted)" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
