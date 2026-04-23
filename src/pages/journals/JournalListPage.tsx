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
        title="✨ 我的日记"
        rightAction={
          <button
            onClick={() => navigate('/journal/new')}
            style={{
              width: '2.25rem',
              height: '2.25rem',
              background: 'linear-gradient(135deg, #e879f9, #a855f7)',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 3px 10px rgba(168,85,247,0.4)',
              fontSize: '1.25rem',
              color: '#fff',
              fontWeight: 700,
            }}
          >
            +
          </button>
        }
      />

      <div style={{ padding: '0.75rem 1rem', background: 'rgba(253,244,255,0.8)' }}>
        <div style={{ position: 'relative' }}>
          <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', fontSize: '1rem' }}>🔍</span>
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="搜索日记..."
            style={{
              width: '100%',
              height: '2.5rem',
              padding: '0 1rem 0 2.5rem',
              border: '2px solid #f3d6ff',
              borderRadius: '1.25rem',
              fontSize: '0.875rem',
              outline: 'none',
              background: '#fff',
              color: '#5b21b6',
              fontWeight: 600,
            }}
          />
        </div>
      </div>

      <div style={{ paddingBottom: '5rem' }}>
        {filteredJournals.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '4rem 1rem' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📝</div>
            <p style={{ color: '#c084fc', fontSize: '0.9375rem', fontWeight: 600, textAlign: 'center' }}>
              {searchText ? '没有找到相关日记 🥺' : '还没有日记，点击右上角开始记录吧 🌸'}
            </p>
          </div>
        ) : (
          Object.entries(groupedJournals).map(([month, items]) => (
            <div key={month}>
              <div
                style={{
                  padding: '0.625rem 1rem',
                  fontSize: '0.8125rem',
                  color: '#a855f7',
                  fontWeight: 800,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.375rem',
                }}
              >
                <span>🗓</span> {month}
              </div>
              <div style={{ padding: '0 0.875rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {items.map((journal) => (
                  <div
                    key={journal.id}
                    onClick={() => navigate(`/journal/${journal.id}`)}
                    style={{
                      background: '#fff',
                      borderRadius: '1.25rem',
                      padding: '1rem 1.125rem',
                      border: '2px solid #f3d6ff',
                      cursor: 'pointer',
                      boxShadow: '0 2px 12px rgba(168,85,247,0.08)',
                      transition: 'transform 0.15s, box-shadow 0.15s',
                    }}
                    onTouchStart={(e) => { e.currentTarget.style.transform = 'scale(0.98)'; e.currentTarget.style.boxShadow = '0 1px 6px rgba(168,85,247,0.12)'; }}
                    onTouchEnd={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(168,85,247,0.08)'; }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
                      <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#5b21b6', flex: 1, marginRight: '0.5rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {journal.title || '无标题'}
                      </h3>
                      <VisibilityBadge visibility={journal.visibility} />
                    </div>
                    <p style={{ fontSize: '0.8125rem', color: '#9b7ec8', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.6, marginBottom: '0.5rem', fontWeight: 500 }}>
                      {journal.content || '暂无内容'}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: '#c084fc', fontWeight: 600 }}>
                      🕐 {dayjs(journal.createdAt).format('MM月DD日 HH:mm')}
                    </span>
                  </div>
                ))}
              </div>
              <div style={{ height: '0.5rem' }} />
            </div>
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
};
