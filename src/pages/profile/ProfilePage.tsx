import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import { VisibilityBadge } from '@/components/VisibilityBadge';
import type { Journal } from '@/types';
import dayjs from 'dayjs';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, logout, updateCurrentUser } = useAuth();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      setEditBio(currentUser.bio);
      setEditUsername(currentUser.username);
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

  if (!currentUser) return null;

  const privateCount = journals.filter((j) => j.visibility === 'private').length;
  const friendsCount = journals.filter((j) => j.visibility === 'friends').length;
  const publicCount = journals.filter((j) => j.visibility === 'public').length;

  const handleSaveProfile = async () => {
    setSaveError('');
    setIsSaving(true);
    try {
      const updated = await apiService.updateMe({
        avatar: currentUser.avatar,
        bio: editBio,
        username: editUsername,
      });
      updateCurrentUser(updated);
      setIsEditing(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : '保存失败');
    } finally {
      setIsSaving(false);
    }
  };

  const avatarUrl =
    currentUser.avatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`;

  const statItems = [
    { label: '日记', value: journals.length },
    { label: '好友', value: currentUser.friendIds.length },
    { label: '私密', value: privateCount },
    { label: '公开', value: publicCount },
  ];

  return (
    <div className="page-container">
      <AppHeader
        title="我的日记"
        rightAction={
          <button
            onClick={logout}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              fontSize: '0.8125rem',
              fontWeight: 700,
              padding: '0.25rem 0.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5-5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" fill="currentColor" />
            </svg>
            退出
          </button>
        }
      />

      <div style={{ paddingBottom: '6rem' }}>
        <div
          style={{
            background: '#fff',
            padding: '1.25rem 1.25rem 0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '0.875rem' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img
                src={avatarUrl}
                alt={currentUser.username}
                style={{
                  width: '5rem',
                  height: '5rem',
                  borderRadius: '50%',
                  border: '2px solid var(--color-border)',
                  background: 'var(--color-surface-2)',
                  display: 'block',
                  objectFit: 'cover',
                }}
              />
            </div>

            <div style={{ flex: 1, minWidth: 0, paddingTop: '0.25rem' }}>
              <h2 style={{
                fontSize: '1.125rem',
                fontWeight: 900,
                color: 'var(--color-text-primary)',
                marginBottom: '0.25rem',
                letterSpacing: '-0.01em',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}>
                {currentUser.username}
              </h2>
              <p style={{
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
                fontWeight: 500,
                marginBottom: '0.5rem',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {currentUser.bio || (
                  <span style={{ color: 'var(--color-text-placeholder)', fontStyle: 'italic' }}>
                    还没有个人简介
                  </span>
                )}
              </p>
              <span style={{
                fontSize: '0.6875rem',
                color: 'var(--color-text-muted)',
                fontWeight: 500,
              }}>
                注册于 {dayjs(currentUser.createdAt).format('YYYY年MM月')}
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            marginBottom: '1rem',
            paddingLeft: '0.25rem',
          }}>
            {statItems.map((item) => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <div style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: 'var(--color-text-primary)',
                  lineHeight: 1.1,
                  letterSpacing: '-0.02em',
                }}>
                  {item.value}
                </div>
                <div style={{
                  fontSize: '0.6875rem',
                  color: 'var(--color-text-muted)',
                  fontWeight: 600,
                  marginTop: '0.125rem',
                }}>
                  {item.label}
                </div>
              </div>
            ))}

            <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end' }}>
              {!isEditing && (
                <button
                  onClick={() => { setIsEditing(true); setSaveError(''); }}
                  style={{
                    background: '#fff',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: '1.5rem',
                    padding: '0.375rem 1.25rem',
                    fontSize: '0.8125rem',
                    cursor: 'pointer',
                    color: 'var(--color-text-primary)',
                    fontWeight: 700,
                    letterSpacing: '0.02em',
                  }}
                >
                  编辑资料
                </button>
              )}
            </div>
          </div>

          {isEditing && (
            <div style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              padding: '1rem',
              marginBottom: '1rem',
              border: '1px solid var(--color-border)',
            }}>
              <div style={{ marginBottom: '0.625rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: '0.375rem' }}>
                  用户名
                </label>
                <input
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="用户名（2-20字符）"
                  maxLength={20}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    border: '1.5px solid var(--color-primary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    background: '#fff',
                    color: 'var(--color-text-primary)',
                    fontWeight: 600,
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div style={{ marginBottom: '0.75rem' }}>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, marginBottom: '0.375rem' }}>
                  个人简介
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="写点什么介绍自己吧..."
                  maxLength={100}
                  style={{
                    width: '100%',
                    padding: '0.625rem 0.75rem',
                    border: '1.5px solid var(--color-primary)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: '0.875rem',
                    outline: 'none',
                    resize: 'none',
                    height: '3.5rem',
                    fontFamily: 'inherit',
                    background: '#fff',
                    color: 'var(--color-text-primary)',
                    fontWeight: 500,
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              {saveError && (
                <div style={{ marginBottom: '0.625rem', padding: '0.5rem 0.75rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', color: '#dc2626', fontSize: '0.8125rem', fontWeight: 600 }}>
                  {saveError}
                </div>
              )}
              <div style={{ display: 'flex', gap: '0.625rem' }}>
                <button
                  onClick={() => { setIsEditing(false); setSaveError(''); setEditUsername(currentUser.username); setEditBio(currentUser.bio); }}
                  style={{ flex: 1, height: '2.5rem', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', background: '#fff', fontSize: '0.875rem', cursor: 'pointer', color: 'var(--color-text-secondary)', fontWeight: 700 }}
                >
                  取消
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                  style={{
                    flex: 1,
                    height: '2.5rem',
                    border: 'none',
                    borderRadius: 'var(--radius-md)',
                    background: isSaving ? 'var(--color-primary-pale)' : 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                    fontSize: '0.875rem',
                    cursor: isSaving ? 'not-allowed' : 'pointer',
                    color: isSaving ? 'var(--color-text-muted)' : '#fff',
                    fontWeight: 800,
                    boxShadow: isSaving ? 'none' : 'var(--shadow-btn)',
                  }}
                >
                  {isSaving ? '保存中...' : '保存'}
                </button>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            borderTop: '1px solid var(--color-border)',
            borderBottom: '1px solid var(--color-border)',
            background: 'var(--color-surface)',
            padding: '0.75rem 1.25rem 0.5rem',
          }}
        >
          <span style={{
            fontSize: '0.9375rem',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            borderBottom: '2.5px solid var(--color-primary)',
            paddingBottom: '0.375rem',
            display: 'inline-block',
          }}>
            全部日记
          </span>
        </div>

        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 1rem' }}>
            <div style={{ width: '2rem', height: '2rem', border: '3px solid var(--color-primary-pale)', borderTop: '3px solid var(--color-primary)', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
          </div>
        ) : journals.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1rem', gap: '0.75rem' }}>
            <div style={{ width: '3.5rem', height: '3.5rem', background: 'var(--color-primary-pale)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="var(--color-primary)" />
              </svg>
            </div>
            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
              还没有日记，点击下方按钮开始记录
            </p>
          </div>
        ) : (
          <div style={{ padding: '0.75rem 0.875rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {journals.map((journal) => (
              <div
                key={journal.id}
                onClick={() => navigate(`/journal/${journal.id}`)}
                style={{
                  background: '#fff',
                  borderRadius: 'var(--radius-lg)',
                  padding: '1rem 1.125rem',
                  border: '1px solid var(--color-border)',
                  cursor: 'pointer',
                  boxShadow: 'var(--shadow-sm)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.15s, box-shadow 0.15s',
                }}
                onTouchStart={(e) => { e.currentTarget.style.transform = 'scale(0.985)'; e.currentTarget.style.boxShadow = 'none'; }}
                onTouchEnd={(e) => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'var(--shadow-sm)'; }}
              >
                <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', background: 'linear-gradient(to bottom, var(--color-primary), var(--color-accent))', borderRadius: '3px 0 0 3px' }} />
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.375rem', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {journal.title || '无标题'}
                  </h3>
                  <VisibilityBadge visibility={journal.visibility} />
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.65, marginBottom: '0.5rem', fontWeight: 500 }}>
                  {journal.content || '暂无内容'}
                </p>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  {dayjs(journal.createdAt).format('MM月DD日 HH:mm')}
                </span>
              </div>
            ))}
            <div style={{ height: '0.5rem' }} />
          </div>
        )}
      </div>

      <button
        onClick={() => navigate('/journal/new')}
        style={{
          position: 'fixed',
          bottom: 'calc(4rem + env(safe-area-inset-bottom) + 1rem)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
          border: 'none',
          boxShadow: '0 6px 24px rgba(240, 112, 64, 0.45)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99,
          transition: 'transform 0.15s, box-shadow 0.15s',
        }}
        onTouchStart={(e) => { e.currentTarget.style.transform = 'translateX(-50%) scale(0.92)'; }}
        onTouchEnd={(e) => { e.currentTarget.style.transform = 'translateX(-50%) scale(1)'; }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      <BottomNav />
    </div>
  );
};
