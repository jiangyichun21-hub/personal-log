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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: '#bfbfbf' }}>
          日记不存在
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
        title="日记详情"
        showBack
        rightAction={
          isOwner ? (
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              <button
                onClick={() => navigate(`/journal/${journal.id}/edit`)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1677ff', padding: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}
              >
                编辑
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4f', padding: '0.25rem', fontSize: '0.875rem', fontWeight: 500 }}
              >
                删除
              </button>
            </div>
          ) : null
        }
      />

      <div style={{ padding: '1.25rem 1rem', paddingBottom: '3rem' }}>
        <div style={{ marginBottom: '0.75rem' }}>
          <VisibilityBadge visibility={journal.visibility} />
        </div>

        <h1 style={{ fontSize: '1.375rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.5rem', lineHeight: 1.4 }}>
          {journal.title || '无标题'}
        </h1>

        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem', color: '#8c8c8c', fontSize: '0.8125rem' }}>
          <span>{dayjs(journal.createdAt).format('YYYY年MM月DD日 HH:mm')}</span>
          {journal.updatedAt !== journal.createdAt && (
            <span>· 编辑于 {dayjs(journal.updatedAt).format('MM月DD日')}</span>
          )}
        </div>

        <div
          style={{
            fontSize: '1rem',
            color: '#262626',
            lineHeight: 1.8,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {journal.content || <span style={{ color: '#bfbfbf' }}>暂无内容</span>}
        </div>
      </div>

      {showDeleteConfirm && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'flex-end', zIndex: 200 }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            style={{ width: '100%', maxWidth: '480px', margin: '0 auto', background: '#fff', borderRadius: '1rem 1rem 0 0', padding: '1.5rem 1rem 2rem' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ textAlign: 'center', fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>确认删除</h3>
            <p style={{ textAlign: 'center', color: '#8c8c8c', fontSize: '0.875rem', marginBottom: '1.5rem' }}>删除后无法恢复，确定要删除这篇日记吗？</p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{ flex: 1, height: '2.75rem', border: '1.5px solid #e5e6eb', borderRadius: '0.75rem', background: '#fff', fontSize: '1rem', cursor: 'pointer', color: '#595959' }}
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                style={{ flex: 1, height: '2.75rem', border: 'none', borderRadius: '0.75rem', background: '#ff4d4f', fontSize: '1rem', cursor: 'pointer', color: '#fff', fontWeight: 600 }}
              >
                删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
