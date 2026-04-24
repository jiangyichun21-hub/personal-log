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
        background: 'rgba(255, 245, 236, 0.92)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '2px solid rgba(245, 220, 200, 0.6)',
        display: 'flex',
        alignItems: 'center',
        height: '3.5rem',
        padding: '0 1rem',
        gap: '0.5rem',
        boxShadow: '0 4px 16px rgba(180, 100, 40, 0.08), inset 0 -1px 0 rgba(255,255,255,0.6)',
      }}
    >
      {showBack ? (
        <button
          onClick={handleBack}
          style={{
            background: 'linear-gradient(145deg, #ffffff, #fef0e4)',
            border: '2px solid rgba(245, 220, 200, 0.8)',
            cursor: 'pointer',
            width: '2.25rem',
            height: '2.25rem',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)',
            fontSize: '1.25rem',
            fontWeight: 700,
            flexShrink: 0,
            boxShadow: 'var(--shadow-clay-sm)',
            transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.15s',
          }}
        >
          ‹
        </button>
      ) : (
        <div style={{ width: '2.25rem', flexShrink: 0 }} />
      )}
      <h1
        style={{
          flex: 1,
          textAlign: 'center',
          fontSize: '1rem',
          fontWeight: 900,
          color: 'var(--color-text-primary)',
          letterSpacing: '0.01em',
        }}
      >
        {title}
      </h1>
      <div style={{ minWidth: '2.25rem', display: 'flex', justifyContent: 'flex-end', flexShrink: 0 }}>
        {rightAction}
      </div>
    </header>
  );
};
