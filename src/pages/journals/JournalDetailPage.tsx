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
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '60vh',
          }}
        >
          <div
            style={{
              width: '2rem',
              height: '2rem',
              border: '3px solid var(--color-primary-pale)',
              borderTop: '3px solid var(--color-primary)',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
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
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '60vh',
            gap: '0.875rem',
          }}
        >
          <div
            style={{
              width: '3.5rem',
              height: '3.5rem',
              background: 'var(--color-primary-pale)',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                stroke="var(--color-primary)"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <p style={{ color: 'var(--color-text-muted)', fontWeight: 600, fontSize: '0.9rem' }}>
            日记不存在
          </p>
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
                  background: 'var(--color-primary-pale)',
                  border: '1px solid var(--color-border-dashed)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.3rem 0.75rem',
                  color: 'var(--color-primary)',
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
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.3rem 0.75rem',
                  color: '#dc2626',
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

      <div style={{ padding: '1.25rem 1rem 4rem' }}>
        <div
          style={{
            marginBottom: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.625rem',
          }}
        >
          <VisibilityBadge visibility={journal.visibility} />
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            {dayjs(journal.createdAt).format('YYYY年MM月DD日 HH:mm')}
          </span>
          {journal.updatedAt !== journal.createdAt && (
            <span
              style={{
                fontSize: '0.75rem',
                color: 'var(--color-text-placeholder)',
                fontWeight: 600,
              }}
            >
              · 编辑于 {dayjs(journal.updatedAt).format('MM月DD日')}
            </span>
          )}
        </div>

        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 900,
            color: 'var(--color-text-primary)',
            marginBottom: '1.25rem',
            lineHeight: 1.35,
            letterSpacing: '-0.01em',
          }}
        >
          {journal.title || '无标题'}
        </h1>

        <div
          style={{
            background: 'var(--color-surface)',
            borderRadius: 'var(--radius-xl)',
            padding: '1.375rem 1.25rem',
            border: '1px solid var(--color-border)',
            boxShadow: 'var(--shadow-sm)',
            fontSize: '1rem',
            color: 'var(--color-text-primary)',
            lineHeight: 2,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
            fontWeight: 500,
            minHeight: '10rem',
            position: 'relative',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '3px',
              background: 'linear-gradient(to bottom, var(--color-primary), var(--color-accent))',
              borderRadius: '3px 0 0 3px',
            }}
          />
          {journal.content || (
            <span style={{ color: 'var(--color-text-placeholder)' }}>暂无内容</span>
          )}
        </div>
      </div>

      {showDeleteConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(45, 31, 14, 0.4)',
            display: 'flex',
            alignItems: 'flex-end',
            zIndex: 200,
            backdropFilter: 'blur(6px)',
          }}
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '480px',
              margin: '0 auto',
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-2xl) var(--radius-2xl) 0 0',
              padding: '1.75rem 1.25rem 2.5rem',
              border: '1px solid var(--color-border)',
              borderBottom: 'none',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div
              style={{
                width: '3rem',
                height: '3rem',
                background: '#fef2f2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 1rem',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
                  stroke="#dc2626"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h3
              style={{
                textAlign: 'center',
                fontSize: '1.0625rem',
                fontWeight: 800,
                marginBottom: '0.5rem',
                color: 'var(--color-text-primary)',
              }}
            >
              确认删除
            </h3>
            <p
              style={{
                textAlign: 'center',
                color: 'var(--color-text-muted)',
                fontSize: '0.875rem',
                marginBottom: '1.5rem',
                fontWeight: 500,
                lineHeight: 1.6,
              }}
            >
              删除后无法恢复，确定要删除这篇日记吗？
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{
                  flex: 1,
                  height: '3rem',
                  border: '1.5px solid var(--color-border)',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--color-surface)',
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  color: 'var(--color-text-secondary)',
                  fontWeight: 700,
                }}
              >
                取消
              </button>
              <button
                onClick={handleDelete}
                style={{
                  flex: 1,
                  height: '3rem',
                  border: 'none',
                  borderRadius: 'var(--radius-md)',
                  background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                  fontSize: '0.9375rem',
                  cursor: 'pointer',
                  color: '#fff',
                  fontWeight: 800,
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.35)',
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
