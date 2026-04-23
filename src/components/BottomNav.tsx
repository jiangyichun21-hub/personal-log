import { useNavigate, useLocation } from 'react-router-dom';

const navItems = [
  {
    path: '/journals',
    label: '日记',
    emoji: '📖',
    activeEmoji: '📖',
  },
  {
    path: '/friends',
    label: '好友',
    emoji: '🌸',
    activeEmoji: '🌸',
  },
  {
    path: '/profile',
    label: '我的',
    emoji: '🐱',
    activeEmoji: '🐱',
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
        background: 'rgba(253, 244, 255, 0.96)',
        backdropFilter: 'blur(16px)',
        borderTop: '2px solid #f3d6ff',
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
              padding: '0.5rem 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              gap: '0.15rem',
              position: 'relative',
            }}
          >
            {isActive && (
              <div
                style={{
                  position: 'absolute',
                  top: '0.3rem',
                  width: '2.5rem',
                  height: '2.5rem',
                  background: 'linear-gradient(135deg, #f3d6ff, #e0b8ff)',
                  borderRadius: '50%',
                  zIndex: 0,
                }}
              />
            )}
            <span style={{ fontSize: '1.375rem', position: 'relative', zIndex: 1 }}>
              {item.emoji}
            </span>
            <span
              style={{
                fontSize: '0.625rem',
                color: isActive ? '#9b4dca' : '#c9a0dc',
                fontWeight: isActive ? 800 : 500,
                position: 'relative',
                zIndex: 1,
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
