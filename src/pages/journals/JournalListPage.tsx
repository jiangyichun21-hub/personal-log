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
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1677ff', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem' }}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="#1677ff">
              <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
            </svg>
          </button>
        }
      />

      <div style={{ padding: '0.75rem 1rem', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
        <div style={{ position: 'relative' }}>
          <svg style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)' }} width="16" height="16" viewBox="0 0 24 24" fill="#bfbfbf">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="搜索日记..."
            style={{ width: '100%', height: '2.25rem', padding: '0 0.75rem 0 2.25rem', border: '1px solid #f0f0f0', borderRadius: '1.125rem', fontSize: '0.875rem', outline: 'none', background: '#f7f8fa' }}
          />
        </div>
      </div>

      <div style={{ paddingBottom: '5rem', overflowY: 'auto' }}>
        {filteredJournals.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem', color: '#bfbfbf' }}>
            <svg width="64" height="64" viewBox="0 0 24 24" fill="#e5e6eb">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
            </svg>
            <p style={{ marginTop: '1rem', fontSize: '0.9375rem' }}>
              {searchText ? '没有找到相关日记' : '还没有日记，点击右上角开始记录'}
            </p>
          </div>
        ) : (
          Object.entries(groupedJournals).map(([month, items]) => (
            <div key={month}>
              <div style={{ padding: '0.75rem 1rem 0.375rem', fontSize: '0.8125rem', color: '#8c8c8c', fontWeight: 600, background: '#f7f8fa' }}>
                {month}
              </div>
              {items.map((journal) => (
                <div
                  key={journal.id}
                  onClick={() => navigate(`/journal/${journal.id}`)}
                  style={{ padding: '1rem', borderBottom: '1px solid #f5f5f5', background: '#fff', cursor: 'pointer', transition: 'background 0.15s' }}
                  onTouchStart={(e) => (e.currentTarget.style.background = '#f7f8fa')}
                  onTouchEnd={(e) => (e.currentTarget.style.background = '#fff')}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1a1a1a', flex: 1, marginRight: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {journal.title || '无标题'}
                    </h3>
                    <VisibilityBadge visibility={journal.visibility} />
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: '#8c8c8c', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.5, marginBottom: '0.5rem' }}>
                    {journal.content || '暂无内容'}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: '#bfbfbf' }}>
                    {dayjs(journal.createdAt).format('MM月DD日 HH:mm')}
                  </span>
                </div>
              ))}
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
};
