import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  { path: '/journals', label: '日记', icon: '✦' },
  { path: '/friends', label: '好友', icon: '◈' },
  { path: '/profile', label: '我的', icon: '◉' },
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
        background: 'rgba(250, 247, 255, 0.96)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderTop: '1px solid var(--color-border)',
        display: 'flex',
        zIndex: 100,
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
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
                  top: '0.5rem',
                  width: '2.25rem',
                  height: '2.25rem',
                  background: 'var(--color-primary-pale)',
                  borderRadius: '50%',
                  zIndex: 0,
                }}
              />
            )}
            <span
              style={{
                fontSize: '1.25rem',
                position: 'relative',
                zIndex: 1,
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                transition: 'color 0.2s',
              }}
            >
              {item.icon}
            </span>
            <span
              style={{
                fontSize: '0.625rem',
                color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
                fontWeight: isActive ? 800 : 600,
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
