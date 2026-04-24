import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { AppHeader } from '@/components/AppHeader';
import type { ReactNode } from 'react';

interface SettingItem {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  danger?: boolean;
  iconBg?: string;
  iconColor?: string;
}

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const settingGroups: { title: string; items: SettingItem[] }[] = [
    {
      title: '账号',
      items: [
        {
          label: '账号与安全',
          iconBg: 'linear-gradient(145deg, #fdecd8, #fbd8b8)',
          iconColor: '#a05020',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" fill="currentColor" />
            </svg>
          ),
          onClick: () => {},
        },
        {
          label: '隐私设置',
          iconBg: 'linear-gradient(145deg, #e8f5ee, #c8ecd8)',
          iconColor: '#2d7a4a',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 4l5 2.18V11c0 3.5-2.33 6.79-5 7.93-2.67-1.14-5-4.43-5-7.93V7.18L12 5z" fill="currentColor" />
            </svg>
          ),
          onClick: () => {},
        },
      ],
    },
    {
      title: '通知',
      items: [
        {
          label: '通知设置',
          iconBg: 'linear-gradient(145deg, #fef3e8, #fde0c0)',
          iconColor: '#c06030',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="currentColor" />
            </svg>
          ),
          onClick: () => {},
        },
      ],
    },
    {
      title: '其他',
      items: [
        {
          label: '关于小日记',
          iconBg: 'linear-gradient(145deg, #fdecd8, #fbd8b8)',
          iconColor: 'var(--color-primary)',
          icon: (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" fill="currentColor" />
            </svg>
          ),
          onClick: () => {},
        },
      ],
    },
  ];

  return (
    <div className="page-container" style={{ background: 'linear-gradient(160deg, #fff5ec 0%, #fde8d0 30%, #f5f5f5 60%)' }}>
      <AppHeader title="设置" showBack />

      <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {settingGroups.map((group) => (
          <div key={group.title}>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 800, letterSpacing: '0.06em', marginBottom: '0.5rem', paddingLeft: '0.25rem' }}>
              {group.title}
            </div>
            <div
              style={{
                background: 'linear-gradient(145deg, #ffffff, #fff8f2)',
                borderRadius: '22px',
                border: '2px solid rgba(245, 220, 200, 0.7)',
                boxShadow: '0 6px 20px rgba(180, 100, 40, 0.10), inset 0 2px 0 rgba(255,255,255,0.90)',
                overflow: 'hidden',
              }}
            >
              {group.items.map((item, index) => (
                <button
                  key={index}
                  onClick={item.onClick}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.875rem',
                    padding: '1rem 1.125rem',
                    background: 'none',
                    border: 'none',
                    borderBottom: index < group.items.length - 1 ? '1.5px solid rgba(245,220,200,0.5)' : 'none',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'background 0.15s',
                  }}
                >
                  <div
                    style={{
                      width: '2.25rem',
                      height: '2.25rem',
                      background: item.iconBg || 'linear-gradient(145deg, #fdecd8, #fbd8b8)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      color: item.iconColor || 'var(--color-primary)',
                      boxShadow: '0 3px 8px rgba(180,100,40,0.12), inset 0 1px 0 rgba(255,255,255,0.8)',
                    }}
                  >
                    {item.icon}
                  </div>
                  <span style={{ flex: 1, fontSize: '0.9375rem', fontWeight: 700, color: 'var(--color-text-primary)' }}>
                    {item.label}
                  </span>
                  <div
                    style={{
                      width: '1.5rem',
                      height: '1.5rem',
                      background: 'linear-gradient(145deg, #fdecd8, #fbd8b8)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 2px 6px rgba(180,100,40,0.12), inset 0 1px 0 rgba(255,255,255,0.8)',
                    }}
                  >
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                      <path d="M9 18l6-6-6-6" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}

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
