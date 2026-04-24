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
      apiService.getMyJournals()
        .then((data) =>
          setJournals(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
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
    { label: '全部', value: journals.length, color: 'var(--color-primary)', bg: 'var(--color-primary-pale)' },
    { label: '私密', value: privateCount, color: '#a05020', bg: '#fdecd8' },
    { label: '好友', value: friendsCount, color: '#c06030', bg: '#fef3e8' },
    { label: '公开', value: publicCount, color: '#2d7a4a', bg: '#e8f5ee' },
  ];

  return (
    <div className="page-container">
      <AppHeader
        title="我的"
        rightAction={
          <button
            onClick={logout}
            style={{
              background: 'none',
              border: '1.5px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.25rem 0.625rem',
              cursor: 'pointer',
              color: 'var(--color-text-muted)',
              fontSize: '0.8125rem',
              fontWeight: 700,
            }}
          >
            退出
          </button>
        }
      />

      <div style={{ paddingBottom: '5rem' }}>
        <div
          style={{
            background: 'linear-gradient(160deg, #fef3e8 0%, #fdecd8 100%)',
            padding: '1.5rem 1.25rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: '-2rem', right: '-2rem', width: '8rem', height: '8rem', background: 'rgba(240, 112, 64, 0.08)', borderRadius: '50%' }} />
          <div style={{ position: 'absolute', bottom: '-1rem', left: '-1rem', width: '5rem', height: '5rem', background: 'rgba(232, 149, 109, 0.06)', borderRadius: '50%' }} />

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', position: 'relative' }}>
            <img
              src={avatarUrl}
              alt={currentUser.username}
              style={{
                width: '4rem',
                height: '4rem',
                borderRadius: '50%',
                border: '3px solid #fff',
                boxShadow: '0 4px 16px rgba(180, 100, 40, 0.2)',
                background: 'var(--color-surface-2)',
                flexShrink: 0,
              }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--color-text-primary)', marginBottom: '0.125rem', letterSpacing: '-0.01em' }}>
                {currentUser.username}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  {currentUser.friendIds.length} 位好友
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                  注册于 {dayjs(currentUser.createdAt).format('YYYY年MM月')}
                </span>
              </div>
            </div>
            {!isEditing && (
              <button
                onClick={() => { setIsEditing(true); setSaveError(''); }}
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.3rem 0.75rem',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  color: 'var(--color-primary)',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                编辑
              </button>
            )}
          </div>

          {isEditing ? (
            <div style={{ position: 'relative' }}>
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
                    boxShadow: '0 0 0 3px rgba(240, 112, 64, 0.12)',
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
                    boxShadow: '0 0 0 3px rgba(240, 112, 64, 0.12)',
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
          ) : (
            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: 500, lineHeight: 1.6, position: 'relative' }}>
              {currentUser.bio || (
                <span style={{ color: 'var(--color-text-placeholder)' }}>还没有个人简介，点击编辑添加</span>
              )}
            </p>
          )}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            background: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
            borderTop: '1px solid var(--color-border)',
          }}
        >
          {statItems.map((item, index) => (
            <div
              key={item.label}
              style={{
                padding: '0.875rem 0',
                textAlign: 'center',
                borderRight: index < statItems.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <div style={{ fontSize: '1.375rem', fontWeight: 900, color: item.color, marginBottom: '0.2rem', letterSpacing: '-0.02em' }}>
                {item.value}
              </div>
              <div style={{ fontSize: '0.6875rem', color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '0.02em' }}>
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '0.875rem 0.875rem 0.375rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            我的日记
          </span>
          <button
            onClick={() => navigate('/journal/new')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              background: 'linear-gradient(135deg, var(--color-primary), var(--color-primary-light))',
              border: 'none',
              borderRadius: 'var(--radius-sm)',
              padding: '0.3rem 0.75rem',
              color: '#fff',
              fontSize: '0.75rem',
              fontWeight: 800,
              cursor: 'pointer',
              boxShadow: 'var(--shadow-btn)',
            }}
          >
            + 新建
          </button>
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
              还没有日记，点击新建开始记录
            </p>
          </div>
        ) : (
          <div style={{ padding: '0 0.875rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {journals.map((journal) => (
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

      <BottomNav />
    </div>
  );
};
