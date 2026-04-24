import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  {
    path: '/friends',
    label: '好友',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z"
          fill={active ? 'var(--color-primary)' : 'var(--color-text-muted)'}
        />
      </svg>
    ),
  },
  {
    path: '/profile',
    label: '我的',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
          fill={active ? 'var(--color-primary)' : 'var(--color-text-muted)'}
        />
      </svg>
    ),
  },
];

export const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: '100%',
        maxWidth: '480px',
        background: 'rgba(255, 245, 236, 0.96)',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)',
        borderTop: '2px solid rgba(245, 220, 200, 0.7)',
        display: 'flex',
        zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom)',
        boxShadow: '0 -4px 20px rgba(180, 100, 40, 0.10), inset 0 1px 0 rgba(255,255,255,0.8)',
      }}
    >
      {navItems.map((item) => {
        const isActive =
          location.pathname === item.path ||
          location.pathname.startsWith(item.path + '/');
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '0.625rem 0 0.5rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              gap: '0.2rem',
              position: 'relative',
            }}
          >
            {isActive && (
              <div
                style={{
                  position: 'absolute',
                  top: '0.35rem',
                  width: '2.75rem',
                  height: '2.75rem',
                  background: 'linear-gradient(145deg, #fde8d8, #fbd0b0)',
                  borderRadius: '50%',
                  zIndex: 0,
                  boxShadow:
                    '0 4px 12px rgba(240, 112, 64, 0.20), inset 0 2px 0 rgba(255,255,255,0.70), inset 0 -2px 0 rgba(180,80,30,0.10)',
                }}
              />
            )}
            <span
              style={{
                position: 'relative',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                transform: isActive ? 'scale(1.12)' : 'scale(1)',
              }}
            >
              {item.icon(isActive)}
            </span>
            <span
              style={{
                fontSize: '0.625rem',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: isActive ? 900 : 600,
                position: 'relative',
                zIndex: 1,
                letterSpacing: '0.02em',
                transition: 'color 0.2s',
              }}
            >
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
