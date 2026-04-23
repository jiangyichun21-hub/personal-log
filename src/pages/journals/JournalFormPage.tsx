import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { storageService } from '@/services/storage';
import { AppHeader } from '@/components/AppHeader';
import type { JournalVisibility } from '@/types';

const VISIBILITY_OPTIONS: { value: JournalVisibility; label: string; emoji: string; desc: string }[] = [
  { value: 'private', label: '私密', emoji: '🔒', desc: '仅自己可见' },
  { value: 'friends', label: '好友可见', emoji: '🌸', desc: '好友可以查看' },
  { value: 'public', label: '公开', emoji: '🌈', desc: '所有人可见' },
];

export const JournalFormPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const isEdit = !!id;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [visibility, setVisibility] = useState<JournalVisibility>('private');
  const [showVisibilityPicker, setShowVisibilityPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isEdit && id) {
      const journal = storageService.getJournalById(id);
      if (journal) {
        setTitle(journal.title);
        setContent(journal.content);
        setVisibility(journal.visibility);
      }
    }
  }, [id, isEdit]);

  const handleSave = async () => {
    if (!currentUser) return;
    setIsSaving(true);
    try {
      const now = new Date().toISOString();
      if (isEdit && id) {
        const existing = storageService.getJournalById(id);
        if (existing) {
          storageService.updateJournal({ ...existing, title, content, visibility, updatedAt: now });
          navigate(`/journal/${id}`, { replace: true });
        }
      } else {
        const newJournal = {
          id: storageService.generateId(),
          userId: currentUser.id,
          title,
          content,
          visibility,
          createdAt: now,
          updatedAt: now,
        };
        storageService.createJournal(newJournal);
        navigate('/journals', { replace: true });
      }
    } finally {
      setIsSaving(false);
    }
  };

  const selectedOption = VISIBILITY_OPTIONS.find((o) => o.value === visibility)!;

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader
        title={isEdit ? '✏️ 编辑日记' : '📝 新建日记'}
        showBack
        rightAction={
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{
              background: isSaving ? '#e9d5ff' : 'linear-gradient(135deg, #e879f9, #a855f7)',
              border: 'none',
              borderRadius: '1rem',
              padding: '0.3rem 0.875rem',
              color: '#fff',
              fontSize: '0.875rem',
              fontWeight: 800,
              cursor: isSaving ? 'not-allowed' : 'pointer',
              boxShadow: isSaving ? 'none' : '0 2px 8px rgba(168,85,247,0.35)',
            }}
          >
            {isSaving ? '保存中' : '保存 ✨'}
          </button>
        }
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="✍️ 给今天起个标题吧~"
          maxLength={50}
          style={{
            padding: '1rem 1.125rem',
            fontSize: '1.125rem',
            fontWeight: 800,
            border: 'none',
            borderBottom: '2px solid #f3d6ff',
            outline: 'none',
            background: '#fdf4ff',
            color: '#5b21b6',
          }}
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="今天发生了什么有趣的事情呢？🌸"
          style={{
            flex: 1,
            padding: '1rem 1.125rem',
            fontSize: '0.9375rem',
            border: 'none',
            outline: 'none',
            resize: 'none',
            background: '#fdf4ff',
            color: '#4c1d95',
            lineHeight: 1.9,
            fontFamily: 'inherit',
            fontWeight: 500,
          }}
        />
      </div>

      <div
        style={{
          borderTop: '2px solid #f3d6ff',
          padding: '0.75rem 1rem',
          background: 'rgba(253,244,255,0.95)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <button
          onClick={() => setShowVisibilityPicker(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.375rem',
            background: '#fff',
            border: '2px solid #f3d6ff',
            borderRadius: '1.25rem',
            padding: '0.375rem 0.875rem',
            cursor: 'pointer',
            fontSize: '0.8125rem',
            color: '#9b4dca',
            fontWeight: 700,
          }}
        >
          <span>{selectedOption.emoji}</span>
          {selectedOption.label}
        </button>
        <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 600 }}>{content.length} 字</span>
      </div>

      {showVisibilityPicker && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(91,33,182,0.25)', display: 'flex', alignItems: 'flex-end', zIndex: 200, backdropFilter: 'blur(4px)' }}
          onClick={() => setShowVisibilityPicker(false)}
        >
          <div
            style={{ width: '100%', maxWidth: '480px', margin: '0 auto', background: '#fdf4ff', borderRadius: '1.75rem 1.75rem 0 0', padding: '1.5rem 1.25rem 2.5rem', border: '2px solid #f3d6ff', borderBottom: 'none' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: '#5b21b6', textAlign: 'center' }}>
              👀 谁可以看到这篇日记？
            </h3>
            {VISIBILITY_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => { setVisibility(option.value); setShowVisibilityPicker(false); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.875rem',
                  padding: '0.875rem 1rem',
                  background: visibility === option.value ? '#f5eeff' : '#fff',
                  border: `2px solid ${visibility === option.value ? '#c084fc' : '#f3d6ff'}`,
                  borderRadius: '1rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                  marginBottom: '0.625rem',
                  transition: 'all 0.15s',
                }}
              >
                <span style={{ fontSize: '1.5rem' }}>{option.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#5b21b6', marginBottom: '0.125rem' }}>{option.label}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#9b7ec8', fontWeight: 600 }}>{option.desc}</div>
                </div>
                {visibility === option.value && (
                  <span style={{ fontSize: '1.25rem' }}>✅</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
