import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import { VisibilityBadge } from '@/components/VisibilityBadge';
import type { Journal } from '@/types';
import dayjs from 'dayjs';

const clayCardStyle: React.CSSProperties = {
  background: 'linear-gradient(145deg, #ffffff, #fff8f2)',
  borderRadius: '22px',
  padding: '1.125rem 1.25rem',
  border: '2px solid rgba(245, 220, 200, 0.7)',
  cursor: 'pointer',
  boxShadow:
    '0 6px 20px rgba(180, 100, 40, 0.12), 0 2px 8px rgba(180, 100, 40, 0.08), inset 0 2px 0 rgba(255,255,255,0.90), inset 0 -2px 0 rgba(180,100,40,0.06)',
  transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease',
  position: 'relative',
  overflow: 'hidden',
};

export const JournalListPage = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [searchText, setSearchText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      setIsLoading(true);
      apiService
        .getMyJournals()
        .then((data) =>
          setJournals(
            data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          )
        )
        .finally(() => setIsLoading(false));
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
  const todayJournal = journals.find(
    (j) => dayjs(j.createdAt).format('YYYY年MM月DD日') === todayStr
  );

  return (
    <div className="page-container">
      <AppHeader
        title="我的日记"
        rightAction={
          <button
            onClick={() => navigate('/journal/new')}
            style={{
              width: '2.375rem',
              height: '2.375rem',
              background: 'linear-gradient(145deg, #f59060, #f07040)',
              border: 'none',
              borderRadius: '50%',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow:
                '0 6px 18px rgba(240, 112, 64, 0.45), inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(180,60,20,0.20)',
              fontSize: '1.5rem',
              color: '#fff',
              fontWeight: 300,
              lineHeight: 1,
              transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            +
          </button>
        }
      />

      {/* 今日卡片 */}
      <div style={{ padding: '1rem 1rem 0' }}>
        <div
          style={{
            background: todayJournal
              ? 'linear-gradient(145deg, #fff8f2, #fdecd8)'
              : 'linear-gradient(145deg, #f59060, #f07040)',
            borderRadius: '26px',
            padding: '1.25rem 1.375rem',
            cursor: 'pointer',
            boxShadow: todayJournal
              ? '0 8px 24px rgba(180, 100, 40, 0.14), inset 0 2px 0 rgba(255,255,255,0.90), inset 0 -2px 0 rgba(180,100,40,0.08)'
              : '0 10px 30px rgba(240, 112, 64, 0.45), 0 4px 12px rgba(240, 112, 64, 0.30), inset 0 3px 0 rgba(255,255,255,0.30), inset 0 -3px 0 rgba(180,60,20,0.20)',
            border: todayJournal ? '2px solid rgba(245, 220, 200, 0.8)' : 'none',
            position: 'relative',
            overflow: 'hidden',
            transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
          onClick={() =>
            todayJournal ? navigate(`/journal/${todayJournal.id}`) : navigate('/journal/new')
          }
        >
          {/* 装饰圆 */}
          {!todayJournal && (
            <>
              <div style={{ position: 'absolute', top: '-1.5rem', right: '-1.5rem', width: '6rem', height: '6rem', background: 'rgba(255,255,255,0.12)', borderRadius: '50%' }} />
              <div style={{ position: 'absolute', bottom: '-1rem', left: '30%', width: '4rem', height: '4rem', background: 'rgba(255,255,255,0.08)', borderRadius: '50%' }} />
            </>
          )}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: todayJournal ? 'var(--color-text-muted)' : 'rgba(255,255,255,0.85)',
                  marginBottom: '0.3rem',
                  letterSpacing: '0.05em',
                }}
              >
                {dayjs().format('MM月DD日 dddd')}
              </p>
              <p
                style={{
                  fontSize: '1.0625rem',
                  fontWeight: 900,
                  color: todayJournal ? 'var(--color-text-primary)' : '#fff',
                  lineHeight: 1.3,
                }}
              >
                {todayJournal ? todayJournal.title || '今天的日记' : '今天还没有记录，写点什么？'}
              </p>
              {todayJournal && (
                <p
                  style={{
                    fontSize: '0.8125rem',
                    color: 'var(--color-text-muted)',
                    marginTop: '0.3rem',
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
                width: '2.75rem',
                height: '2.75rem',
                background: todayJournal
                  ? 'linear-gradient(145deg, #fdecd8, #fbd8b8)'
                  : 'rgba(255,255,255,0.22)',
                borderRadius: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                boxShadow: todayJournal
                  ? '0 4px 12px rgba(180,100,40,0.15), inset 0 2px 0 rgba(255,255,255,0.8)'
                  : 'inset 0 2px 0 rgba(255,255,255,0.25)',
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
      </div>

      {/* 搜索框 */}
      <div style={{ padding: '0.875rem 1rem 0.625rem' }}>
        <div style={{ position: 'relative' }}>
          <svg
            style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}
            width="15" height="15" viewBox="0 0 24 24" fill="none"
          >
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
          <input
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="搜索日记..."
            style={{
              width: '100%',
              height: '2.75rem',
              padding: '0 1rem 0 2.5rem',
              border: '2px solid rgba(245, 220, 200, 0.8)',
              borderRadius: '999px',
              fontSize: '0.875rem',
              outline: 'none',
              background: 'linear-gradient(145deg, #ffffff, #fff8f2)',
              color: 'var(--color-text-primary)',
              fontWeight: 500,
              boxShadow: 'inset 0 3px 8px rgba(180, 100, 40, 0.08), 0 2px 0 rgba(255,255,255,0.9)',
              transition: 'all 0.2s',
            }}
            onFocus={(e) => {
              e.target.style.borderColor = 'var(--color-primary-light)';
              e.target.style.boxShadow = 'inset 0 3px 8px rgba(180, 100, 40, 0.10), 0 0 0 3px rgba(240,112,64,0.10)';
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(245, 220, 200, 0.8)';
              e.target.style.boxShadow = 'inset 0 3px 8px rgba(180, 100, 40, 0.08), 0 2px 0 rgba(255,255,255,0.9)';
            }}
          />
        </div>
      </div>

      {/* 日记列表 */}
      <div style={{ paddingBottom: '5.5rem' }}>
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 1rem' }}>
            <div
              style={{
                width: '2.5rem',
                height: '2.5rem',
                border: '3px solid var(--color-primary-pale)',
                borderTop: '3px solid var(--color-primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}
            />
          </div>
        ) : filteredJournals.length === 0 ? (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '4rem 1rem',
              gap: '1rem',
            }}
          >
            <div
              style={{
                width: '5rem',
                height: '5rem',
                background: 'linear-gradient(145deg, #fdecd8, #fbd8b8)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 24px rgba(180,100,40,0.15), inset 0 2px 0 rgba(255,255,255,0.8)',
                animation: 'clay-float 3s ease-in-out infinite',
              }}
            >
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="var(--color-primary)" />
              </svg>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 700, textAlign: 'center' }}>
              {searchText ? '没有找到相关日记' : '还没有日记，点击右上角开始记录'}
            </p>
          </div>
        ) : (
          Object.entries(groupedJournals).map(([month, items]) => (
            <div key={month}>
              <div
                style={{
                  padding: '1rem 1rem 0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                }}
              >
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 800, letterSpacing: '0.06em' }}>
                  {month}
                </span>
                <span
                  style={{
                    background: 'linear-gradient(145deg, #fdecd8, #fbd8b8)',
                    color: 'var(--color-primary)',
                    borderRadius: '999px',
                    padding: '0.1rem 0.5rem',
                    fontSize: '0.6875rem',
                    fontWeight: 900,
                    boxShadow: '0 2px 6px rgba(240,112,64,0.20), inset 0 1px 0 rgba(255,255,255,0.8)',
                  }}
                >
                  {items.length}
                </span>
              </div>
              <div style={{ padding: '0 1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {items.map((journal) => (
                  <div
                    key={journal.id}
                    onClick={() => navigate(`/journal/${journal.id}`)}
                    style={clayCardStyle}
                    onTouchStart={(e) => {
                      e.currentTarget.style.transform = 'scale(0.97)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(180,100,40,0.10), inset 0 2px 6px rgba(180,100,40,0.10)';
                    }}
                    onTouchEnd={(e) => {
                      e.currentTarget.style.transform = 'scale(1)';
                      e.currentTarget.style.boxShadow = '0 6px 20px rgba(180, 100, 40, 0.12), 0 2px 8px rgba(180, 100, 40, 0.08), inset 0 2px 0 rgba(255,255,255,0.90), inset 0 -2px 0 rgba(180,100,40,0.06)';
                    }}
                  >
                    {/* 顶部彩色装饰条 */}
                    <div
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        right: 0,
                        height: '4px',
                        background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent))',
                        borderRadius: '22px 22px 0 0',
                      }}
                    />
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        justifyContent: 'space-between',
                        marginBottom: '0.4rem',
                        gap: '0.5rem',
                        marginTop: '0.25rem',
                      }}
                    >
                      <h3
                        style={{
                          fontSize: '0.9375rem',
                          fontWeight: 900,
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
                        lineHeight: 1.7,
                        marginBottom: '0.625rem',
                        fontWeight: 500,
                      }}
                    >
                      {journal.content || '暂无内容'}
                    </p>
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
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
