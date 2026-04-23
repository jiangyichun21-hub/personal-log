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
        background: 'rgba(253, 246, 238, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--color-border)',
        display: 'flex',
        alignItems: 'center',
        height: '3.25rem',
        padding: '0 1rem',
        gap: '0.5rem',
      }}
    >
      {showBack ? (
        <button
          onClick={handleBack}
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
            cursor: 'pointer',
            width: '2rem',
            height: '2rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)',
            fontSize: '1.125rem',
            fontWeight: 700,
            flexShrink: 0,
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          ‹
        </button>
      ) : (
        <div style={{ width: '2rem', flexShrink: 0 }} />
      )}
      <h1
        style={{
          flex: 1,
          textAlign: 'center',
          fontSize: '1rem',
          fontWeight: 800,
          color: 'var(--color-text-primary)',
          letterSpacing: '0.01em',
        }}
      >
        {title}
      </h1>
      <div style={{ minWidth: '2rem', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
        {rightAction}
      </div>
    </header>
  );
};
