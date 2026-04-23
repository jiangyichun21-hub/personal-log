import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { storageService } from '@/services/storage';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import type { Journal } from '@/types';

export const ProfilePage = () => {
  const { currentUser, logout, updateCurrentUser } = useAuth();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editUsername, setEditUsername] = useState('');

  useEffect(() => {
    if (currentUser) {
      const data = storageService.getJournalsByUserId(currentUser.id);
      setJournals(data);
      setEditBio(currentUser.bio);
      setEditUsername(currentUser.username);
    }
  }, [currentUser]);

  if (!currentUser) return null;

  const privateCount = journals.filter((j) => j.visibility === 'private').length;
  const friendsCount = journals.filter((j) => j.visibility === 'friends').length;
  const publicCount = journals.filter((j) => j.visibility === 'public').length;

  const handleSaveProfile = () => {
    const updated = { ...currentUser, username: editUsername, bio: editBio };
    updateCurrentUser(updated);
    setIsEditing(false);
  };

  const statItems = [
    { label: '全部', value: journals.length, emoji: '📚' },
    { label: '私密', value: privateCount, emoji: '🔒' },
    { label: '好友', value: friendsCount, emoji: '🌸' },
    { label: '公开', value: publicCount, emoji: '🌈' },
  ];

  return (
    <div className="page-container">
      <AppHeader
        title="🐱 我的"
        rightAction={
          <button
            onClick={logout}
            style={{
              background: 'none',
              border: '2px solid #f3d6ff',
              borderRadius: '1rem',
              padding: '0.2rem 0.625rem',
              cursor: 'pointer',
              color: '#c084fc',
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
            background: 'linear-gradient(160deg, #f5eeff 0%, #fce7ff 50%, #ffeef8 100%)',
            padding: '1.75rem 1.25rem 1.5rem',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div style={{ position: 'absolute', top: '-1rem', right: '-1rem', fontSize: '5rem', opacity: 0.12, transform: 'rotate(15deg)' }}>🌸</div>
          <div style={{ position: 'absolute', bottom: '-0.5rem', left: '1rem', fontSize: '3rem', opacity: 0.1 }}>✨</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', position: 'relative' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={currentUser.avatar}
                alt={currentUser.username}
                style={{ width: '5rem', height: '5rem', borderRadius: '50%', border: '3px solid #fff', boxShadow: '0 4px 16px rgba(168,85,247,0.25)', background: '#f5eeff' }}
              />
              <div style={{ position: 'absolute', bottom: 0, right: 0, width: '1.5rem', height: '1.5rem', background: 'linear-gradient(135deg, #e879f9, #a855f7)', borderRadius: '50%', border: '2px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem' }}>
                ✨
              </div>
            </div>
            <div style={{ flex: 1 }}>
              {isEditing ? (
                <input
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  style={{ fontSize: '1.125rem', fontWeight: 800, border: '2px solid #c084fc', borderRadius: '0.75rem', padding: '0.25rem 0.625rem', outline: 'none', width: '100%', marginBottom: '0.25rem', background: '#fff', color: '#5b21b6' }}
                />
              ) : (
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#5b21b6', marginBottom: '0.25rem' }}>{currentUser.username}</h2>
              )}
              <p style={{ fontSize: '0.8125rem', color: '#c084fc', fontWeight: 600 }}>{currentUser.email}</p>
            </div>
          </div>

          {isEditing ? (
            <div style={{ position: 'relative' }}>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="写点什么介绍自己吧~"
                maxLength={100}
                style={{ width: '100%', padding: '0.75rem', border: '2px solid #c084fc', borderRadius: '1rem', fontSize: '0.875rem', outline: 'none', resize: 'none', height: '4rem', fontFamily: 'inherit', marginBottom: '0.75rem', background: '#fff', color: '#5b21b6', fontWeight: 600 }}
              />
              <div style={{ display: 'flex', gap: '0.625rem' }}>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{ flex: 1, height: '2.5rem', border: '2px solid #f3d6ff', borderRadius: '1rem', background: '#fff', fontSize: '0.875rem', cursor: 'pointer', color: '#9b7ec8', fontWeight: 700 }}
                >
                  取消
                </button>
                <button
                  onClick={handleSaveProfile}
                  style={{ flex: 1, height: '2.5rem', border: 'none', borderRadius: '1rem', background: 'linear-gradient(135deg, #e879f9, #a855f7)', fontSize: '0.875rem', cursor: 'pointer', color: '#fff', fontWeight: 800, boxShadow: '0 3px 10px rgba(168,85,247,0.35)' }}
                >
                  保存 ✨
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
              <p style={{ fontSize: '0.875rem', color: '#7c3aed', flex: 1, fontWeight: 600 }}>
                {currentUser.bio || <span style={{ color: '#d8b4fe' }}>还没有个人简介，点击编辑添加吧~</span>}
              </p>
              <button
                onClick={() => setIsEditing(true)}
                style={{ background: '#fff', border: '2px solid #f3d6ff', borderRadius: '1rem', padding: '0.25rem 0.75rem', fontSize: '0.8125rem', cursor: 'pointer', color: '#9b4dca', marginLeft: '0.75rem', whiteSpace: 'nowrap', fontWeight: 700 }}
              >
                编辑
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: '#fff', borderBottom: '2px solid #f3d6ff', borderTop: '2px solid #f3d6ff', margin: '0.75rem 0' }}>
          {statItems.map((item) => (
            <div key={item.label} style={{ padding: '1rem 0', textAlign: 'center' }}>
              <div style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{item.emoji}</div>
              <div style={{ fontSize: '1.375rem', fontWeight: 800, color: '#7c3aed', marginBottom: '0.125rem' }}>{item.value}</div>
              <div style={{ fontSize: '0.6875rem', color: '#c084fc', fontWeight: 700 }}>{item.label}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: '0 0.875rem' }}>
          <div style={{ background: '#fff', borderRadius: '1.25rem', border: '2px solid #f3d6ff', overflow: 'hidden' }}>
            <div style={{ padding: '0.875rem 1rem', borderBottom: '1px solid #f3d6ff' }}>
              <h3 style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#5b21b6' }}>📋 账号信息</h3>
            </div>
            {[
              { label: '🗓 注册时间', value: new Date(currentUser.createdAt).toLocaleDateString('zh-CN') },
              { label: '👫 好友数量', value: `${currentUser.friendIds.length} 人` },
            ].map((item, index, arr) => (
              <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.875rem 1rem', borderBottom: index < arr.length - 1 ? '1px solid #f9f0ff' : 'none' }}>
                <span style={{ fontSize: '0.875rem', color: '#7c3aed', fontWeight: 700 }}>{item.label}</span>
                <span style={{ fontSize: '0.875rem', color: '#c084fc', fontWeight: 600 }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
};
