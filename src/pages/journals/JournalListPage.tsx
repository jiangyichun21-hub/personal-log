import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { storageService } from '@/services/storage';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import { VisibilityBadge } from '@/components/VisibilityBadge';
import type { Journal } from '@/types';
import dayjs from 'dayjs';

export const JournalListPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    if (currentUser) {
      const data = storageService.getJournalsByUserId(currentUser.id);
      setJournals(data);
    }
  }, [currentUser]);

  const filteredJournals = journals.filter(
    (j) =>
      j.title.toLowerCase().includes(searchText.toLowerCase()) ||
      j.content.toLowerCase().includes(searchText.toLowerCase())
  );

  const groupedJournals = filteredJournals.reduce<Record<string, Journal[]>>((acc, journal) => {
    const month = dayjs(journal.createdAt).format('YYYY年MM月');
    if (!acc[month]) acc[month] = [];
    acc[month].push(journal);
    return acc;
  }, {});

  return (
    <div className="page-container">
      <AppHeader
        title="我的日记"
        rightAction={
          <button
            onClick={() => navigate('/journal/new')}
            style={{
              width: '2.125rem',
              height: '2.125rem',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-btn)',
              fontSize: '1.375rem',
              color: '#fff',
              fontWeight: 300,
              lineHeight: 1,
            }}
          >
            +
          </button>
        }
      />

      <div
        style={{
          padding: '0.75rem 1rem',
          background: 'var(--color-bg)',
          borderBottom: '1px solid var(--color-border)',
        }}
      >
        <div style={{ position: 'relative' }}>
          <svg
            style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }}
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round"/>
          </svg>
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="搜索日记..."
            style={{
              width: '100%',
              height: '2.5rem',
              padding: '0 1rem 0 2.5rem',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-lg)',
              fontSize: '0.875rem',
              outline: 'none',
              background: 'var(--color-surface)',
              color: 'var(--color-text-primary)',
              fontWeight: 500,
              transition: 'border-color 0.2s',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary-light)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
          />
        </div>
      </div>

      <div style={{ paddingBottom: '5rem' }}>
        {filteredJournals.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '5rem 1rem',
              gap: '0.875rem',
            }}
          >
            <div
              style={{
                width: '4rem',
                height: '4rem',
                background: 'var(--color-surface-2)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="#b09fd8"/>
              </svg>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 600, textAlign: 'center' }}>
              {searchText ? '没有找到相关日记' : '还没有日记，点击右上角开始记录'}
            </p>
          </div>
        ) : (
          Object.entries(groupedJournals).map(([month, items]) => (
            <div key={month}>
              <div
                style={{
                  padding: '1rem 1rem 0.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                {month}
              </div>
              <div style={{ padding: '0 0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {items.map((journal) => (
                  <div
                    key={journal.id}
                    onClick={() => navigate(`/journal/${journal.id}`)}
                    style={{
                      background: 'var(--color-surface)',
                      borderRadius: 'var(--radius-lg)',
                      padding: '1rem 1.125rem',
                      border: '1px solid var(--color-border)',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-sm)',
                      transition: 'transform 0.15s, box-shadow 0.15s',
                    }}
                    onTouchStart={(e) => {
                      e.currentTarget.style.transform = 'scale(0.985)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        marginBottom: '0.375rem',
                        gap: '0.5rem',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '0.9375rem',
                          fontWeight: 800,
                          color: 'var(--color-text-primary)',
                          flex: 1,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {journal.title || '无标题'}
                      </h3>
                      <VisibilityBadge visibility={journal.visibility} />
                    </div>
                    <p
                      style={{
                        fontSize: '0.8125rem',
                        color: 'var(--color-text-muted)',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        lineHeight: 1.65,
                        marginBottom: '0.625rem',
                        fontWeight: 500,
                      }}
                    >
                      {journal.content || '暂无内容'}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-placeholder)', fontWeight: 600 }}>
                      {dayjs(journal.createdAt).format('MM月DD日 HH:mm')}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ height: '0.625rem' }} />
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
};
