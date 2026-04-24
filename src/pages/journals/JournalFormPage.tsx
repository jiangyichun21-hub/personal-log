import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { apiService } from '@/services/api';
import { AppHeader } from '@/components/AppHeader';
import type { JournalVisibility } from '@/types';

const VISIBILITY_OPTIONS: { value: JournalVisibility; label: string; desc: string }[] = [
  { value: 'private', label: '私密', desc: '仅自己可见' },
  { value: 'friends', label: '好友可见', desc: '好友可以查看' },
  { value: 'public', label: '公开', desc: '所有人可见' },
];

const VISIBILITY_COLORS: Record<JournalVisibility, { color: string; bg: string; border: string }> =
  {
    private: { color: '#a05020', bg: '#fdecd8', border: '#f0c898' },
    friends: { color: '#c06030', bg: '#fef3e8', border: '#f5c8a0' },
    public: { color: '#2d7a4a', bg: '#e8f5ee', border: '#a8d8b8' },
  };

export const JournalFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEdit = !!id;

  // 统一编辑区文本，第一行为标题，其余为正文
  const [editorText, setEditorText] = useState('');
  const [visibility, setVisibility] = useState<JournalVisibility>('private');
  const [showVisibilityPicker, setShowVisibilityPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      apiService.getJournalById(id).then((journal) => {
        // 编辑时将标题和正文合并回一个文本块
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
    // 后端要求 content 不能为空，若正文为空则用标题兜底
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

  // 统计正文字数（去掉第一行标题）
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
                ? 'var(--color-primary-pale)'
                : 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '0.35rem 0.875rem',
              color: isSaving ? 'var(--color-text-muted)' : '#fff',
              fontSize: '0.875rem',
              fontWeight: 800,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              boxShadow: isSaving ? 'none' : 'var(--shadow-btn)',
              letterSpacing: '0.02em',
            }}
          >
            {isSaving ? '保存中' : '保存'}
          </button>
        }
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <textarea
          value={editorText}
          onChange={(e) => setEditorText(e.target.value)}
          placeholder={'今天发生了什么...'}
          autoFocus
          style={{
            flex: 1,
            padding: '1.25rem 1.125rem',
            fontSize: '0.9375rem',
            border: 'none',
            outline: 'none',
            resize: 'none',
            background: 'var(--color-bg)',
            color: 'var(--color-text-primary)',
            lineHeight: 2,
            fontFamily: 'inherit',
            fontWeight: 500,
          }}
        />
      </div>

      <div
        style={{
          borderTop: '1px solid var(--color-border)',
          padding: '0.75rem 1rem',
          background: 'rgba(253, 246, 238, 0.97)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button
          onClick={() => setShowVisibilityPicker(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            background: selectedColors.bg,
            border: `1px solid ${selectedColors.border}`,
            borderRadius: 'var(--radius-sm)',
            padding: '0.35rem 0.75rem',
            cursor: 'pointer',
            fontSize: '0.8125rem',
            color: selectedColors.color,
            fontWeight: 700,
            letterSpacing: '0.02em',
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
        <span
          style={{ fontSize: '0.75rem', color: 'var(--color-text-placeholder)', fontWeight: 600 }}
        >
          {bodyText.length} 字
        </span>
      </div>

      {showVisibilityPicker && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(45, 31, 14, 0.35)',
            display: 'flex',
            alignItems: 'flex-end',
            zIndex: 200,
            backdropFilter: 'blur(6px)',
          }}
          onClick={() => setShowVisibilityPicker(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              margin: '0 auto',
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-2xl) var(--radius-2xl) 0 0',
              padding: '1.5rem 1.25rem 2.5rem',
              border: '1px solid var(--color-border)',
              borderBottom: 'none',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '2.5rem',
                height: '3px',
                background: 'var(--color-border-dashed)',
                borderRadius: '2px',
                margin: '0 auto 1.25rem',
              }}
            />
            <h3
              style={{
                fontSize: '0.9375rem',
                fontWeight: 800,
                marginBottom: '1rem',
                color: 'var(--color-text-primary)',
                textAlign: 'center',
                letterSpacing: '0.01em',
              }}
            >
              谁可以看到这篇日记？
            </h3>
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
                    padding: '0.875rem 1rem',
                    background: isSelected ? colors.bg : 'var(--color-surface)',
                    border: `1.5px solid ${isSelected ? colors.border : 'var(--color-border)'}`,
                    borderRadius: 'var(--radius-md)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    marginBottom: '0.5rem',
                    transition: 'all 0.15s',
                  }}
                >
                  <div
                    style={{
                      width: '2.25rem',
                      height: '2.25rem',
                      background: colors.bg,
                      border: `1.5px solid ${colors.border}`,
                      borderRadius: 'var(--radius-sm)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <span style={{ fontSize: '0.75rem', fontWeight: 800, color: colors.color }}>
                      {option.value === 'private' ? '私' : option.value === 'friends' ? '友' : '公'}
                    </span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        fontSize: '0.9375rem',
                        fontWeight: 800,
                        color: 'var(--color-text-primary)',
                        marginBottom: '0.125rem',
                      }}
                    >
                      {option.label}
                    </div>
                    <div
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--color-text-muted)',
                        fontWeight: 500,
                      }}
                    >
                      {option.desc}
                    </div>
                  </div>
                  {isSelected && (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M20 6L9 17l-5-5"
                        stroke={colors.color}
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
