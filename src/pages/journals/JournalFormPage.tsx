import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';
import { AppHeader } from '@/components/AppHeader';
import type { JournalVisibility } from '@/types';

const VISIBILITY_OPTIONS: { value: JournalVisibility; label: string; desc: string; emoji: string }[] = [
  { value: 'private', label: '私密', desc: '仅自己可见', emoji: '🔒' },
  { value: 'friends', label: '好友可见', desc: '好友可以查看', emoji: '👥' },
  { value: 'public', label: '公开', desc: '所有人可见', emoji: '🌍' },
];

const VISIBILITY_COLORS: Record<JournalVisibility, { color: string; bg: string; border: string; shadow: string }> = {
  private: {
    color: '#a05020',
    bg: 'linear-gradient(145deg, #fdecd8, #fbd8b8)',
    border: 'rgba(240, 200, 152, 0.9)',
    shadow: '0 4px 12px rgba(160,80,32,0.18), inset 0 1px 0 rgba(255,255,255,0.75)',
  },
  friends: {
    color: '#c06030',
    bg: 'linear-gradient(145deg, #fef3e8, #fde0c0)',
    border: 'rgba(245, 200, 160, 0.9)',
    shadow: '0 4px 12px rgba(192,96,48,0.18), inset 0 1px 0 rgba(255,255,255,0.75)',
  },
  public: {
    color: '#2d7a4a',
    bg: 'linear-gradient(145deg, #e8f5ee, #c8ecd8)',
    border: 'rgba(168, 216, 184, 0.9)',
    shadow: '0 4px 12px rgba(45,122,74,0.18), inset 0 1px 0 rgba(255,255,255,0.75)',
  },
};

export const JournalFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  const [editorText, setEditorText] = useState('');
  const [visibility, setVisibility] = useState<JournalVisibility>('private');
  const [showVisibilityPicker, setShowVisibilityPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      apiService.getJournalById(id).then((journal) => {
        const combined = journal.content
          ? `${journal.title}\n${journal.content}`
          : journal.title;
        setEditorText(combined);
        setVisibility(journal.visibility);
      });
    }
  }, [id, isEdit]);

  const handleSave = async () => {
    const lines = editorText.split('\n');
    const title = lines[0].trim();
    const bodyContent = lines.slice(1).join('\n').trim();
    const content = bodyContent || title;

    setIsSaving(true);
    try {
      if (isEdit && id) {
        await apiService.updateJournal(id, title, content, visibility);
        navigate(`/journal/${id}`, { replace: true });
      } else {
        await apiService.createJournal(title, content, visibility);
        navigate('/journals', { replace: true });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const selectedOption = VISIBILITY_OPTIONS.find((o) => o.value === visibility)!;
  const selectedColors = VISIBILITY_COLORS[visibility];
  const bodyText = editorText.split('\n').slice(1).join('\n');

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader
        title={isEdit ? '编辑日记' : '新建日记'}
        showBack
        rightAction={
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              background: isSaving
                ? 'linear-gradient(145deg, #fdecd8, #fbd8b8)'
                : 'linear-gradient(145deg, #f59060, #f07040)',
              border: isSaving ? '2px solid rgba(245,220,200,0.8)' : 'none',
              borderRadius: '14px',
              padding: '0.35rem 1rem',
              color: isSaving ? 'var(--color-text-muted)' : '#fff',
              fontSize: '0.875rem',
              fontWeight: 900,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              boxShadow: isSaving
                ? 'inset 0 2px 6px rgba(180,100,40,0.12)'
                : '0 6px 18px rgba(240,112,64,0.40), inset 0 2px 0 rgba(255,255,255,0.30), inset 0 -2px 0 rgba(180,60,20,0.18)',
              letterSpacing: '0.04em',
              transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {isSaving ? '保存中' : '保存'}
          </button>
        }
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: 'linear-gradient(160deg, #fff8f2 0%, #fff5ee 100%)' }}>
        <textarea
          value={editorText}
          onChange={(e) => setEditorText(e.target.value)}
          placeholder="今天发生了什么..."
          autoFocus
          style={{
            flex: 1,
            padding: '1.5rem 1.25rem',
            fontSize: '1rem',
            border: 'none',
            outline: 'none',
            resize: 'none',
            background: 'transparent',
            color: 'var(--color-text-primary)',
            lineHeight: 2.1,
            fontFamily: 'inherit',
            fontWeight: 500,
          }}
        />
      </div>

      <div
        style={{
          borderTop: '2px solid rgba(245, 220, 200, 0.6)',
          padding: '0.75rem 1rem',
          background: 'linear-gradient(145deg, #ffffff, #fff8f2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 -4px 16px rgba(180,100,40,0.08)',
        }}
      >
        <button
          onClick={() => setShowVisibilityPicker(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            background: selectedColors.bg,
            border: `2px solid ${selectedColors.border}`,
            borderRadius: '999px',
            padding: '0.35rem 0.875rem',
            cursor: 'pointer',
            fontSize: '0.8125rem',
            color: selectedColors.color,
            fontWeight: 800,
            letterSpacing: '0.02em',
            boxShadow: selectedColors.shadow,
            transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {selectedOption.label}
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 9l6 6 6-6"
              stroke={selectedColors.color}
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-text-placeholder)', fontWeight: 700 }}>
          {bodyText.length} 字
        </span>
      </div>

      {showVisibilityPicker && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(45, 31, 14, 0.45)',
            display: 'flex',
            alignItems: 'flex-end',
            zIndex: 200,
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => setShowVisibilityPicker(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              margin: '0 auto',
              background: 'linear-gradient(145deg, #ffffff, #fff8f2)',
              borderRadius: '32px 32px 0 0',
              padding: '1.5rem 1.25rem 2.5rem',
              border: '2px solid rgba(245, 220, 200, 0.6)',
              borderBottom: 'none',
              boxShadow: '0 -8px 32px rgba(180,100,40,0.15), inset 0 2px 0 rgba(255,255,255,0.9)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '2.5rem',
                height: '4px',
                background: 'rgba(245,220,200,0.9)',
                borderRadius: '2px',
                margin: '0 auto 1.25rem',
                boxShadow: 'inset 0 1px 2px rgba(180,100,40,0.15)',
              }}
            />
            <h3
              style={{
                fontSize: '1rem',
                fontWeight: 900,
                marginBottom: '1.125rem',
                color: 'var(--color-text-primary)',
                textAlign: 'center',
                letterSpacing: '-0.01em',
              }}
            >
              谁可以看到这篇日记？
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
              {VISIBILITY_OPTIONS.map((option) => {
                const colors = VISIBILITY_COLORS[option.value];
                const isSelected = visibility === option.value;
                return (
                  <button
                    key={option.value}
                    onClick={() => {
                      setVisibility(option.value);
                      setShowVisibilityPicker(false);
                    }}
                    style={{
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.875rem',
                      padding: '1rem 1.125rem',
                      background: isSelected ? colors.bg : 'linear-gradient(145deg, #ffffff, #fff8f2)',
                      border: `2px solid ${isSelected ? colors.border : 'rgba(245,220,200,0.6)'}`,
                      borderRadius: '20px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      boxShadow: isSelected
                        ? colors.shadow
                        : '0 4px 12px rgba(180,100,40,0.08), inset 0 1px 0 rgba(255,255,255,0.9)',
                      transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    }}
                  >
                    <div
                      style={{
                        width: '2.5rem',
                        height: '2.5rem',
                        background: colors.bg,
                        border: `2px solid ${colors.border}`,
                        borderRadius: '14px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 3px 8px rgba(180,100,40,0.12), inset 0 1px 0 rgba(255,255,255,0.8)',
                      }}
                    >
                      <span style={{ fontSize: '0.8125rem', fontWeight: 900, color: colors.color }}>
                        {option.value === 'private' ? '私' : option.value === 'friends' ? '友' : '公'}
                      </span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 900, color: 'var(--color-text-primary)', marginBottom: '0.125rem' }}>
                        {option.label}
                      </div>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 500 }}>
                        {option.desc}
                      </div>
                    </div>
                    {isSelected && (
                      <div
                        style={{
                          width: '1.5rem',
                          height: '1.5rem',
                          background: colors.bg,
                          border: `2px solid ${colors.border}`,
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: colors.shadow,
                        }}
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                          <path d="M20 6L9 17l-5-5" stroke={colors.color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
