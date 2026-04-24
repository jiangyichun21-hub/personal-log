import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import type { Journal } from '@/types';

export const ProfilePage = () => {
  const { currentUser, logout, updateCurrentUser } = useAuth();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (currentUser) {
      apiService.getMyJournals().then((data) => setJournals(data));
      setEditBio(currentUser.bio);
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const privateCount = journals.filter((j) => j.visibility === 'private').length;
  const friendsCount = journals.filter((j) => j.visibility === 'friends').length;
  const publicCount = journals.filter((j) => j.visibility === 'public').length;

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      const updated = await apiService.updateMe(currentUser.avatar, editBio);
      updateCurrentUser(updated);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const statItems = [
    { label: '全部', value: journals.length, color: 'var(--color-primary)', bg: 'var(--color-primary-pale)' },
    { label: '私密', value: privateCount, color: '#a05020', bg: '#fdecd8' },
    { label: '好友', value: friendsCount, color: '#c06030', bg: '#fef3e8' },
    { label: '公开', value: publicCount, color: '#2d7a4a', bg: '#e8f5ee' },
  ];

  const avatarUrl =
    currentUser.avatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`;

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
            padding: '1.75rem 1.25rem 1.5rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-2rem',
              right: '-2rem',
              width: '8rem',
              height: '8rem',
              background: 'rgba(240, 112, 64, 0.08)',
              borderRadius: '50%',
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '-1rem',
              left: '-1rem',
              width: '5rem',
              height: '5rem',
              background: 'rgba(232, 149, 109, 0.06)',
              borderRadius: '50%',
            }}
          />

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1rem',
              position: 'relative',
            }}
          >
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img
                src={avatarUrl}
                alt={currentUser.username}
                style={{
                  width: '4.5rem',
                  height: '4.5rem',
                  borderRadius: '50%',
                  border: '3px solid #fff',
                  boxShadow: '0 4px 16px rgba(180, 100, 40, 0.2)',
                  background: 'var(--color-surface-2)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '1.25rem',
                  height: '1.25rem',
                  background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
                  borderRadius: '50%',
                  border: '2px solid #fff',
                }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <h2
                style={{
                  fontSize: '1.25rem',
                  fontWeight: 900,
                  color: 'var(--color-text-primary)',
                  marginBottom: '0.25rem',
                  letterSpacing: '-0.01em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {currentUser.username}
              </h2>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                日记本成员
              </p>
            </div>
          </div>

          {isEditing ? (
            <div style={{ position: 'relative' }}>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="写点什么介绍自己吧..."
                maxLength={100}
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1.5px solid var(--color-primary)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.875rem',
                  outline: 'none',
                  resize: 'none',
                  height: '4rem',
                  fontFamily: 'inherit',
                  marginBottom: '0.75rem',
                  background: '#fff',
                  color: 'var(--color-text-primary)',
                  fontWeight: 500,
                  boxShadow: '0 0 0 3px rgba(240, 112, 64, 0.15)',
                }}
              />
              <div style={{ display: 'flex', gap: '0.625rem' }}>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    flex: 1,
                    height: '2.5rem',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    background: '#fff',
                    fontSize: '0.875rem',
                    cursor: 'pointer',
                    color: 'var(--color-text-secondary)',
                    fontWeight: 700,
                  }}
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
                    background: isSaving
                      ? 'var(--color-primary-pale)'
                      : 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
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
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative',
              }}
            >
              <p
                style={{
                  fontSize: '0.875rem',
                  color: 'var(--color-text-secondary)',
                  flex: 1,
                  fontWeight: 500,
                  lineHeight: 1.6,
                }}
              >
                {currentUser.bio || (
                  <span style={{ color: 'var(--color-text-placeholder)' }}>
                    还没有个人简介，点击编辑添加
                  </span>
                )}
              </p>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  background: 'rgba(255,255,255,0.85)',
                  border: '1px solid var(--color-border)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.25rem 0.625rem',
                  fontSize: '0.8125rem',
                  cursor: 'pointer',
                  color: 'var(--color-primary)',
                  marginLeft: '0.75rem',
                  whiteSpace: 'nowrap',
                  fontWeight: 700,
                  flexShrink: 0,
                }}
              >
                编辑
              </button>
            </div>
          )}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            background: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
            borderTop: '1px solid var(--color-border)',
            margin: '0.75rem 0',
          }}
        >
          {statItems.map((item, index) => (
            <div
              key={item.label}
              style={{
                padding: '1rem 0',
                textAlign: 'center',
                borderRight: index < statItems.length - 1 ? '1px solid var(--color-border)' : 'none',
              }}
            >
              <div
                style={{
                  fontSize: '1.5rem',
                  fontWeight: 900,
                  color: item.color,
                  marginBottom: '0.25rem',
                  letterSpacing: '-0.02em',
                }}
              >
                {item.value}
              </div>
              <div
                style={{
                  fontSize: '0.6875rem',
                  color: 'var(--color-text-muted)',
                  fontWeight: 700,
                  letterSpacing: '0.02em',
                }}
              >
                {item.label}
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '0 0.875rem' }}>
          <div
            style={{
              background: 'var(--color-surface)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--color-border)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-sm)',
            }}
          >
            <div
              style={{
                padding: '0.875rem 1rem',
                borderBottom: '1px solid var(--color-border)',
                background: 'var(--color-surface-2)',
              }}
            >
              <h3
                style={{
                  fontSize: '0.875rem',
                  fontWeight: 800,
                  color: 'var(--color-text-primary)',
                  letterSpacing: '0.01em',
                }}
              >
                账号信息
              </h3>
            </div>
            {[
              {
                label: '注册时间',
                value: new Date(currentUser.createdAt).toLocaleDateString('zh-CN'),
              },
              { label: '好友数量', value: `${currentUser.friendIds.length} 人` },
            ].map((item, index, arr) => (
              <div
                key={item.label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.875rem 1rem',
                  borderBottom: index < arr.length - 1 ? '1px solid var(--color-border)' : 'none',
                }}
              >
                <span
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-secondary)',
                    fontWeight: 600,
                  }}
                >
                  {item.label}
                </span>
                <span
                  style={{
                    fontSize: '0.875rem',
                    color: 'var(--color-text-muted)',
                    fontWeight: 700,
                  }}
                >
                  {item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};
