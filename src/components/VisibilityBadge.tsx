import type { JournalVisibility } from '@/types';

const VISIBILITY_CONFIG: Record<
  JournalVisibility,
  { label: string; color: string; bg: string; border: string; shadow: string }
> = {
  private: {
    label: '私密',
    color: '#a05020',
    bg: 'linear-gradient(145deg, #fdecd8, #fbd8b8)',
    border: '#f0c898',
    shadow: '0 3px 8px rgba(160,80,32,0.18), inset 0 1px 0 rgba(255,255,255,0.75), inset 0 -1px 0 rgba(160,80,32,0.12)',
  },
  friends: {
    label: '好友',
    color: '#c06030',
    bg: 'linear-gradient(145deg, #fef3e8, #fde0c0)',
    border: '#f5c8a0',
    shadow: '0 3px 8px rgba(192,96,48,0.18), inset 0 1px 0 rgba(255,255,255,0.75), inset 0 -1px 0 rgba(192,96,48,0.12)',
  },
  public: {
    label: '公开',
    color: '#2d7a4a',
    bg: 'linear-gradient(145deg, #e8f5ee, #c8ecd8)',
    border: '#a8d8b8',
    shadow: '0 3px 8px rgba(45,122,74,0.18), inset 0 1px 0 rgba(255,255,255,0.75), inset 0 -1px 0 rgba(45,122,74,0.12)',
  },
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
        borderRadius: '999px',
        fontSize: '0.6875rem',
        fontWeight: 800,
        color: config.color,
        background: config.bg,
        border: `1.5px solid ${config.border}`,
        boxShadow: config.shadow,
        letterSpacing: '0.03em',
        flexShrink: 0,
      }}
    >
      {config.label}
    </span>
  );
};
