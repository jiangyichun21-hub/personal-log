import { useNavigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface AppHeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: ReactNode;
  onBack?: () => void;
}

export const AppHeader = ({ title, showBack = false, rightAction, onBack }: AppHeaderProps) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(253, 244, 255, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '2px solid #f3d6ff',
        display: 'flex',
        alignItems: 'center',
        height: '3.25rem',
        padding: '0 1rem',
      }}
    >
      {showBack && (
        <button
          onClick={handleBack}
          style={{
            background: 'linear-gradient(135deg, #f3d6ff, #e8c8ff)',
            border: 'none',
            cursor: 'pointer',
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#b06fd8',
            fontSize: '1.1rem',
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          ‹
        </button>
      )}
      <h1
        style={{
          flex: 1,
          textAlign: 'center',
          fontSize: '1rem',
          fontWeight: 800,
          color: '#9b4dca',
          letterSpacing: '0.02em',
        }}
      >
        {title}
      </h1>
      <div style={{ minWidth: '2rem', display: 'flex', justifyContent: 'flex-end' }}>
        {rightAction}
      </div>
    </header>
  );
};
