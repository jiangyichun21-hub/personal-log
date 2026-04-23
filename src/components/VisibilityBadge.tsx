import type { JournalVisibility } from '@/types';

const VISIBILITY_CONFIG: Record<JournalVisibility, { label: string; color: string; bg: string }> = {
  private: { label: '私密', color: '#8c8c8c', bg: '#f5f5f5' },
  friends: { label: '好友可见', color: '#fa8c16', bg: '#fff7e6' },
  public: { label: '公开', color: '#52c41a', bg: '#f6ffed' },
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
        padding: '0.1rem 0.5rem',
        borderRadius: '0.75rem',
        fontSize: '0.7rem',
        fontWeight: 500,
        color: config.color,
        background: config.bg,
      }}
    >
      {config.label}
    </span>
  );
};
