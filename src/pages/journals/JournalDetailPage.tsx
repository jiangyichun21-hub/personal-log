import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      setIsLoading(true);
      apiService
        .getJournalById(id)
        .then((data) => setJournal(data))
        .catch(() => setJournal(null))
        .finally(() => setIsLoading(false));
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="page-container">
        <AppHeader title="日记详情" showBack />
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
          <div
            style={{
              width: '3rem',
              height: '3rem',
              background: 'linear-gradient(145deg, #fdecd8, #fbd8b8)',
              borderRadius: '50%',
              boxShadow: '0 6px 18px rgba(240,112,64,0.25), inset 0 2px 0 rgba(255,255,255,0.8)',
              animation: 'clay-bounce 0.8s ease-in-out infinite',
            }}
          />
        </div>
      </div>
    );
  }

  if (!journal) {
    return (
      <div className="page-container">
        <AppHeader title="日记详情" showBack />
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '60vh', gap: '1rem' }}>
          <div
            style={{
              width: '4.5rem',
              height: '4.5rem',
              background: 'linear-gradient(145deg, #fdecd8, #fbd8b8)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(180,100,40,0.15), inset 0 2px 0 rgba(255,255,255,0.8)',
            }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="var(--color-primary)" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontWeight: 700, fontSize: '0.9rem' }}>日记不存在</p>
        </div>
      </div>
    );
  }

  const isOwner = currentUser?.id === journal.userId;

  const handleDelete = async () => {
    await apiService.deleteJournal(journal.id);
    navigate('/journals', { replace: true });
  };

  return (
    <div className="page-container">
      <AppHeader
        title="日记详情"
        showBack
        rightAction={
          isOwner ? (
            <div style={{ display: 'flex', gap: '0.375rem' }}>
              <button
                onClick={() => navigate(`/journal/${journal.id}/edit`)}
                style={{
                  background: 'linear-gradient(145deg, #fdecd8, #fbd8b8)',
                  border: '2px solid rgba(245, 220, 200, 0.8)',
                  borderRadius: '12px',
                  padding: '0.3rem 0.75rem',
                  color: 'var(--color-primary)',
                  fontSize: '0.8125rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(240,112,64,0.20), inset 0 1px 0 rgba(255,255,255,0.8)',
                }}
              >
                编辑
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                style={{
                  background: 'linear-gradient(145deg, #fff0f0, #ffe8e8)',
                  border: '2px solid #fecaca',
                  borderRadius: '12px',
                  padding: '0.3rem 0.75rem',
                  color: '#dc2626',
                  fontSize: '0.8125rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(220,38,38,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
                }}
              >
                删除
              </button>
            </div>
          ) : null
        }
      />

      <div style={{ padding: '1.25rem 1rem 4rem' }}>
        {/* 元信息行 */}
        <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.625rem', flexWrap: 'wrap' }}>
          <VisibilityBadge visibility={journal.visibility} />
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
            {dayjs(journal.createdAt).format('YYYY年MM月DD日 HH:mm')}
          </span>
          {journal.updatedAt !== journal.createdAt && (
            <span style={{ fontSize: '0.75rem', color: 'var(--color-text-placeholder)', fontWeight: 600 }}>
              · 编辑于 {dayjs(journal.updatedAt).format('MM月DD日')}
            </span>
          )}
        </div>

        {/* 标题 */}
        <h1
          style={{
            fontSize: '1.625rem',
            fontWeight: 900,
            color: 'var(--color-text-primary)',
            marginBottom: '1.25rem',
            lineHeight: 1.3,
            letterSpacing: '-0.01em',
          }}
        >
          {journal.title || '无标题'}
        </h1>

        {/* 正文卡片 */}
        <div
          style={{
            background: 'linear-gradient(145deg, #ffffff, #fff8f2)',
            borderRadius: '26px',
            padding: '1.5rem 1.375rem',
            border: '2px solid rgba(245, 220, 200, 0.7)',
            boxShadow:
              '0 8px 28px rgba(180, 100, 40, 0.12), 0 3px 10px rgba(180, 100, 40, 0.08), inset 0 2px 0 rgba(255,255,255,0.95), inset 0 -2px 0 rgba(180,100,40,0.06)',
            fontSize: '1rem',
            color: 'var(--color-text-primary)',
            lineHeight: 2,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            fontWeight: 500,
            minHeight: '10rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* 顶部彩色装饰条 */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              right: 0,
              height: '5px',
              background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent), #f0c060)',
              borderRadius: '26px 26px 0 0',
            }}
          />
          <div style={{ marginTop: '0.25rem' }}>
            {journal.content || (
              <span style={{ color: 'var(--color-text-placeholder)' }}>暂无内容</span>
            )}
          </div>
        </div>
      </div>

      {/* 删除确认弹窗 */}
      {showDeleteConfirm && (
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
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              margin: '0 auto',
              background: 'linear-gradient(145deg, #ffffff, #fff8f2)',
              borderRadius: '32px 32px 0 0',
              padding: '1.75rem 1.5rem 2.5rem',
              border: '2px solid rgba(245, 220, 200, 0.6)',
              borderBottom: 'none',
              boxShadow: '0 -8px 32px rgba(180,100,40,0.15), inset 0 2px 0 rgba(255,255,255,0.9)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ width: '2.5rem', height: '4px', background: 'rgba(245,220,200,0.9)', borderRadius: '2px', margin: '0 auto 1.5rem', boxShadow: 'inset 0 1px 2px rgba(180,100,40,0.15)' }} />
            <div
              style={{
                width: '3.5rem',
                height: '3.5rem',
                background: 'linear-gradient(145deg, #fff0f0, #ffe0e0)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
                boxShadow: '0 6px 18px rgba(220,38,38,0.20), inset 0 2px 0 rgba(255,255,255,0.8)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 style={{ textAlign: 'center', fontSize: '1.0625rem', fontWeight: 900, marginBottom: '0.5rem', color: 'var(--color-text-primary)' }}>
              确认删除
            </h3>
            <p style={{ textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1.75rem', fontWeight: 500, lineHeight: 1.6 }}>
              删除后无法恢复，确定要删除这篇日记吗？
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  flex: 1,
                  height: '3.25rem',
                  border: '2px solid rgba(245, 220, 200, 0.8)',
                  borderRadius: '18px',
                  background: 'linear-gradient(145deg, #ffffff, #fff8f2)',
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary)',
                  fontWeight: 800,
                  boxShadow: '0 4px 12px rgba(180,100,40,0.10), inset 0 2px 0 rgba(255,255,255,0.9)',
                }}
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                style={{
                  flex: 1,
                  height: '3.25rem',
                  border: 'none',
                  borderRadius: '18px',
                  background: 'linear-gradient(145deg, #f87171, #ef4444)',
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  color: '#fff',
                  fontWeight: 900,
                  boxShadow: '0 8px 24px rgba(220, 38, 38, 0.40), inset 0 2px 0 rgba(255,255,255,0.25), inset 0 -2px 0 rgba(150,20,20,0.20)',
                }}
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
