import type { JournalVisibility } from '@/types';

const VISIBILITY_CONFIG: Record<JournalVisibility, { label: string; color: string; bg: string; border: string }> = {
  private: { label: '私密', color: '#a05020', bg: '#fdecd8', border: '#f0c898' },
  friends: { label: '好友可见', color: '#c06030', bg: '#fef3e8', border: '#f5c8a0' },
  public: { label: '公开', color: '#2d7a4a', bg: '#e8f5ee', border: '#a8d8b8' },
};

interface VisibilityBadgeProps {
  visibility: JournalVisibility;
}

export const VisibilityBadge = ({ visibility }: VisibilityBadgeProps) => {
  const config = VISIBILITY_CONFIG[visibility];
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.25rem',
        padding: '0.2rem 0.625rem',
        borderRadius: '6px',
        fontSize: '0.6875rem',
        fontWeight: 700,
        color: config.color,
        background: config.bg,
        border: `1px solid ${config.border}`,
        letterSpacing: '0.02em',
        flexShrink: 0,
      }}
    >
      {config.label}
    </span>
  );
};
