import type { JournalVisibility } from '@/types';

const VISIBILITY_CONFIG: Record<JournalVisibility, { label: string; emoji: string; color: string; bg: string; border: string }> = {
  private: { label: '私密', emoji: '🔒', color: '#9b7ec8', bg: '#f5eeff', border: '#e0c8ff' },
  friends: { label: '好友', emoji: '🌸', color: '#d4608a', bg: '#fff0f6', border: '#ffc8e0' },
  public: { label: '公开', emoji: '🌈', color: '#5b9bd5', bg: '#eef6ff', border: '#c0dcff' },
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
        gap: '0.2rem',
        padding: '0.15rem 0.6rem',
        borderRadius: '1rem',
        fontSize: '0.7rem',
        fontWeight: 700,
        color: config.color,
        background: config.bg,
        border: `1.5px solid ${config.border}`,
      }}
    >
      <span style={{ fontSize: '0.75rem' }}>{config.emoji}</span>
      {config.label}
    </span>
  );
};
