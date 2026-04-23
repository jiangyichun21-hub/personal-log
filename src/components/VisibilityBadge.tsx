import type { JournalVisibility } from '@/types';

const VISIBILITY_CONFIG: Record<JournalVisibility, { label: string; color: string; bg: string; border: string }> = {
  private: { label: '私密', color: '#7c5cbf', bg: '#f0ebff', border: '#d8c8ff' },
  friends: { label: '好友可见', color: '#be4b8a', bg: '#fce7f3', border: '#f9a8d4' },
  public: { label: '公开', color: '#0369a1', bg: '#e0f2fe', border: '#7dd3fc' },
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
      }}
    >
      {config.label}
    </span>
  );
};
