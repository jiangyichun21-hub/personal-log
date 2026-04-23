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
      setJournals(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
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

  const todayStr = dayjs().format('YYYY年MM月DD日');
  const todayJournal = journals.find((j) => dayjs(j.createdAt).format('YYYY年MM月DD日') === todayStr);

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
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
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
          margin: '0.875rem',
          background: todayJournal
            ? 'linear-gradient(135deg, #fff8f0, #fdecd8)'
            : 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
          borderRadius: 'var(--radius-xl)',
          padding: '1.125rem 1.25rem',
          cursor: 'pointer',
          boxShadow: todayJournal ? 'var(--shadow-md)' : 'var(--shadow-btn)',
          border: todayJournal ? '1px solid var(--color-border-dashed)' : 'none',
          position: 'relative',
          overflow: 'hidden',
        }}
        onClick={() => todayJournal ? navigate(`/journal/${todayJournal.id}`) : navigate('/journal/new')}
      >
        {!todayJournal && (
          <div
            style={{
              position: 'absolute',
              top: '-1.5rem',
              right: '-1.5rem',
              width: '6rem',
              height: '6rem',
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '50%',
            }}
          />
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <p
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: todayJournal ? 'var(--color-text-muted)' : 'rgba(255,255,255,0.8)',
                marginBottom: '0.25rem',
                letterSpacing: '0.04em',
              }}
            >
              {dayjs().format('MM月DD日 dddd')}
            </p>
            <p
              style={{
                fontSize: '1rem',
                fontWeight: 800,
                color: todayJournal ? 'var(--color-text-primary)' : '#fff',
              }}
            >
              {todayJournal ? todayJournal.title || '今天的日记' : '今天还没有记录，写点什么？'}
            </p>
            {todayJournal && (
              <p
                style={{
                  fontSize: '0.8125rem',
                  color: 'var(--color-text-muted)',
                  marginTop: '0.25rem',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '16rem',
                  fontWeight: 500,
                }}
              >
                {todayJournal.content || '暂无内容'}
              </p>
            )}
          </div>
          <div
            style={{
              width: '2.5rem',
              height: '2.5rem',
              background: todayJournal ? 'var(--color-primary-pale)' : 'rgba(255,255,255,0.2)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
                fill={todayJournal ? 'var(--color-primary)' : '#fff'}
              />
            </svg>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 0.875rem 0.625rem' }}>
        <div style={{ position: 'relative' }}>
          <svg
            style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.45 }}
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round"/>
          </svg>
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="搜索日记..."
            style={{
              width: '100%',
              height: '2.5rem',
              padding: '0 1rem 0 2.375rem',
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
              padding: '4rem 1rem',
              gap: '0.875rem',
            }}
          >
            <div
              style={{
                width: '4rem',
                height: '4rem',
                background: 'var(--color-primary-pale)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="var(--color-primary)"/>
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
                  padding: '0.875rem 1rem 0.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--color-text-muted)',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span>{month}</span>
                <span
                  style={{
                    background: 'var(--color-primary-pale)',
                    color: 'var(--color-primary)',
                    borderRadius: '10px',
                    padding: '0.1rem 0.5rem',
                    fontSize: '0.6875rem',
                    fontWeight: 800,
                  }}
                >
                  {items.length}
                </span>
              </div>
              <div style={{ padding: '0 0.875rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
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
                      position: 'relative',
                      overflow: 'hidden',
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
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '3px',
                        background: 'linear-gradient(to bottom, var(--color-primary), var(--color-accent))',
                        borderRadius: '3px 0 0 3px',
                      }}
                    />
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
                        color: 'var(--color-text-secondary)',
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
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      {dayjs(journal.createdAt).format('MM月DD日 HH:mm')}
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
