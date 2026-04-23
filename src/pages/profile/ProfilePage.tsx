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
    { label: '全部', value: journals.length },
    { label: '私密', value: privateCount },
    { label: '好友可见', value: friendsCount },
    { label: '公开', value: publicCount },
  ];

  return (
    <div className="page-container">
      <AppHeader
        title="我的"
        rightAction={
          <button
            onClick={logout}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8c8c8c', fontSize: '0.875rem' }}
          >
            退出
          </button>
        }
      />

      <div style={{ paddingBottom: '5rem' }}>
        <div style={{ background: 'linear-gradient(160deg, #e6f4ff 0%, #f0f7ff 100%)', padding: '1.5rem 1rem 1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <img
              src={currentUser.avatar}
              alt={currentUser.username}
              style={{ width: '4.5rem', height: '4.5rem', borderRadius: '50%', border: '3px solid #fff', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', background: '#e6f4ff' }}
            />
            <div style={{ flex: 1 }}>
              {isEditing ? (
                <input
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  style={{ fontSize: '1.125rem', fontWeight: 700, border: '1.5px solid #1677ff', borderRadius: '0.5rem', padding: '0.25rem 0.5rem', outline: 'none', width: '100%', marginBottom: '0.25rem' }}
                />
              ) : (
                <h2 style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.25rem' }}>{currentUser.username}</h2>
              )}
              <p style={{ fontSize: '0.8125rem', color: '#8c8c8c' }}>{currentUser.email}</p>
            </div>
          </div>

          {isEditing ? (
            <div>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                placeholder="写点什么介绍自己..."
                maxLength={100}
                style={{ width: '100%', padding: '0.625rem', border: '1.5px solid #1677ff', borderRadius: '0.625rem', fontSize: '0.875rem', outline: 'none', resize: 'none', height: '4rem', fontFamily: 'inherit', marginBottom: '0.75rem' }}
              />
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{ flex: 1, height: '2.25rem', border: '1.5px solid #e5e6eb', borderRadius: '0.625rem', background: '#fff', fontSize: '0.875rem', cursor: 'pointer', color: '#595959' }}
                >
                  取消
                </button>
                <button
                  onClick={handleSaveProfile}
                  style={{ flex: 1, height: '2.25rem', border: 'none', borderRadius: '0.625rem', background: '#1677ff', fontSize: '0.875rem', cursor: 'pointer', color: '#fff', fontWeight: 600 }}
                >
                  保存
                </button>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <p style={{ fontSize: '0.875rem', color: '#595959', flex: 1 }}>
                {currentUser.bio || <span style={{ color: '#bfbfbf' }}>还没有个人简介</span>}
              </p>
              <button
                onClick={() => setIsEditing(true)}
                style={{ background: 'none', border: '1px solid #d9d9d9', borderRadius: '1rem', padding: '0.25rem 0.75rem', fontSize: '0.8125rem', cursor: 'pointer', color: '#595959', marginLeft: '0.75rem', whiteSpace: 'nowrap' }}
              >
                编辑
              </button>
            </div>
          )}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
          {statItems.map((item) => (
            <div key={item.label} style={{ padding: '1rem 0', textAlign: 'center' }}>
              <div style={{ fontSize: '1.375rem', fontWeight: 700, color: '#1677ff', marginBottom: '0.25rem' }}>{item.value}</div>
              <div style={{ fontSize: '0.75rem', color: '#8c8c8c' }}>{item.label}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: '1rem', background: '#fff', marginTop: '0.5rem' }}>
          <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1a1a1a', marginBottom: '0.75rem' }}>账号信息</h3>
          {[
            { label: '注册时间', value: new Date(currentUser.createdAt).toLocaleDateString('zh-CN') },
            { label: '好友数量', value: `${currentUser.friendIds.length} 人` },
          ].map((item) => (
            <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid #f5f5f5' }}>
              <span style={{ fontSize: '0.875rem', color: '#595959' }}>{item.label}</span>
              <span style={{ fontSize: '0.875rem', color: '#8c8c8c' }}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
};
