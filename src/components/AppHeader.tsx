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
        background: '#ffffff',
        borderBottom: '1px solid #f0f0f0',
        display: 'flex',
        alignItems: 'center',
        height: '3rem',
        padding: '0 1rem',
      }}
    >
      {showBack && (
        <button
          onClick={handleBack}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '0.5rem',
            marginLeft: '-0.5rem',
            display: 'flex',
            alignItems: 'center',
            color: '#1677ff',
            fontSize: '1.25rem',
          }}
        >
          ‹
        </button>
      )}
      <h1
        style={{
          flex: 1,
          textAlign: showBack ? 'center' : 'left',
          fontSize: '1rem',
          fontWeight: 600,
          color: '#1a1a1a',
          marginLeft: showBack ? '-1.5rem' : 0,
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
