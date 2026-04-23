import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { storageService } from '@/services/storage';
import { AppHeader } from '@/components/AppHeader';
import { VisibilityBadge } from '@/components/VisibilityBadge';
import type { Journal } from '@/types';
import dayjs from 'dayjs';

export const JournalDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [journal, setJournal] = useState<Journal | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (id) {
      const data = storageService.getJournalById(id);
      setJournal(data);
    }
  }, [id]);

  if (!journal) {
    return (
      <div className="page-container">
        <AppHeader title="日记详情" showBack />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
          <span style={{ fontSize: '3rem' }}>🔍</span>
          <p style={{ color: '#c084fc', fontWeight: 600 }}>日记不存在</p>
        </div>
      </div>
    );
  }

  const isOwner = currentUser?.id === journal.userId;

  const handleDelete = () => {
    storageService.deleteJournal(journal.id);
    navigate('/journals', { replace: true });
  };

  return (
    <div className="page-container">
      <AppHeader
        title="📖 日记详情"
        showBack
        rightAction={
          isOwner ? (
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              <button
                onClick={() => navigate(`/journal/${journal.id}/edit`)}
                style={{
                  background: 'linear-gradient(135deg, #e0b8ff, #c084fc)',
                  border: 'none',
                  borderRadius: '1rem',
                  padding: '0.25rem 0.75rem',
                  color: '#fff',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                编辑
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  background: 'linear-gradient(135deg, #ffc8e0, #f472b6)',
                  border: 'none',
                  borderRadius: '1rem',
                  padding: '0.25rem 0.75rem',
                  color: '#fff',
                  fontSize: '0.8125rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                }}
              >
                删除
              </button>
            </div>
          ) : null
        }
      />

      <div style={{ padding: '1.25rem 1rem 3rem' }}>
        <div style={{ marginBottom: '0.875rem' }}>
          <VisibilityBadge visibility={journal.visibility} />
        </div>

        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#5b21b6', marginBottom: '0.625rem', lineHeight: 1.4 }}>
          {journal.title || '无标题'}
        </h1>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', color: '#c084fc', fontSize: '0.8125rem', fontWeight: 600 }}>
          <span>🕐 {dayjs(journal.createdAt).format('YYYY年MM月DD日 HH:mm')}</span>
          {journal.updatedAt !== journal.createdAt && (
            <span>· 编辑于 {dayjs(journal.updatedAt).format('MM月DD日')}</span>
          )}
        </div>

        <div
          style={{
            background: '#fff',
            borderRadius: '1.25rem',
            padding: '1.25rem',
            border: '2px solid #f3d6ff',
            boxShadow: '0 2px 16px rgba(168,85,247,0.08)',
            fontSize: '1rem',
            color: '#4c1d95',
            lineHeight: 1.9,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            fontWeight: 500,
            minHeight: '8rem',
          }}
        >
          {journal.content || <span style={{ color: '#d8b4fe' }}>暂无内容</span>}
        </div>
      </div>

      {showDeleteConfirm && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(91,33,182,0.3)', display: 'flex', alignItems: 'flex-end', zIndex: 200, backdropFilter: 'blur(4px)' }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            style={{ width: '100%', maxWidth: '480px', margin: '0 auto', background: '#fdf4ff', borderRadius: '1.75rem 1.75rem 0 0', padding: '1.75rem 1.25rem 2.5rem', border: '2px solid #f3d6ff', borderBottom: 'none' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <span style={{ fontSize: '2.5rem' }}>🗑️</span>
            </div>
            <h3 style={{ textAlign: 'center', fontSize: '1.0625rem', fontWeight: 800, marginBottom: '0.5rem', color: '#5b21b6' }}>确认删除</h3>
            <p style={{ textAlign: 'center', color: '#9b7ec8', fontSize: '0.875rem', marginBottom: '1.5rem', fontWeight: 600 }}>删除后无法恢复哦，确定要删除这篇日记吗？🥺</p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{ flex: 1, height: '3rem', border: '2px solid #f3d6ff', borderRadius: '1.25rem', background: '#fff', fontSize: '1rem', cursor: 'pointer', color: '#9b7ec8', fontWeight: 700 }}
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                style={{ flex: 1, height: '3rem', border: 'none', borderRadius: '1.25rem', background: 'linear-gradient(135deg, #f472b6, #ec4899)', fontSize: '1rem', cursor: 'pointer', color: '#fff', fontWeight: 800, boxShadow: '0 4px 12px rgba(244,114,182,0.4)' }}
              >
                删除 💔
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
