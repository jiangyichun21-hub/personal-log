import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { storageService } from '@/services/storage';
import { AppHeader } from '@/components/AppHeader';
import type { JournalVisibility } from '@/types';

const VISIBILITY_OPTIONS: { value: JournalVisibility; label: string; desc: string }[] = [
  { value: 'private', label: '私密', desc: '仅自己可见' },
  { value: 'friends', label: '好友可见', desc: '好友可以查看' },
  { value: 'public', label: '公开', desc: '所有人可见' },
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

  const selectedVisibility = VISIBILITY_OPTIONS.find((o) => o.value === visibility)!;

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <AppHeader
        title={isEdit ? '编辑日记' : '新建日记'}
        showBack
        rightAction={
          <button
            onClick={handleSave}
            disabled={isSaving}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1677ff', fontSize: '0.9375rem', fontWeight: 600, padding: '0.25rem' }}
          >
            {isSaving ? '保存中' : '保存'}
          </button>
        }
      />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="标题（可选）"
          maxLength={50}
          style={{ padding: '1rem', fontSize: '1.125rem', fontWeight: 600, border: 'none', borderBottom: '1px solid #f0f0f0', outline: 'none', background: '#fff', color: '#1a1a1a' }}
        />

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="今天发生了什么..."
          style={{ flex: 1, padding: '1rem', fontSize: '0.9375rem', border: 'none', outline: 'none', resize: 'none', background: '#fff', color: '#262626', lineHeight: 1.8, fontFamily: 'inherit' }}
        />
      </div>

      <div style={{ borderTop: '1px solid #f0f0f0', padding: '0.75rem 1rem', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button
          onClick={() => setShowVisibilityPicker(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', background: '#f7f8fa', border: '1px solid #e5e6eb', borderRadius: '1.25rem', padding: '0.375rem 0.875rem', cursor: 'pointer', fontSize: '0.8125rem', color: '#595959' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#8c8c8c">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
          </svg>
          {selectedVisibility.label}
        </button>
        <span style={{ fontSize: '0.75rem', color: '#bfbfbf' }}>{content.length} 字</span>
      </div>

      {showVisibilityPicker && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }}
          onClick={() => setShowVisibilityPicker(false)}
        >
          <div
            style={{ width: '100%', maxWidth: '480px', margin: '0 auto', background: '#fff', borderRadius: '1rem 1rem 0 0', padding: '1.25rem 1rem 2rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '1rem', color: '#1a1a1a' }}>谁可以看到这篇日记？</h3>
            {VISIBILITY_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => { setVisibility(option.value); setShowVisibilityPicker(false); }}
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.875rem 0', background: 'none', border: 'none', borderBottom: '1px solid #f5f5f5', cursor: 'pointer', textAlign: 'left' }}
              >
                <div>
                  <div style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#1a1a1a', marginBottom: '0.125rem' }}>{option.label}</div>
                  <div style={{ fontSize: '0.8125rem', color: '#8c8c8c' }}>{option.desc}</div>
                </div>
                {visibility === option.value && (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1677ff">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
