import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { storageService } from '@/services/storage';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import type { User, Journal } from '@/types';

interface FriendWithJournals extends User {
  visibleJournals: Journal[];
}

export const FriendsPage = () => {
  const { currentUser, updateCurrentUser } = useAuth();
  const [friends, setFriends] = useState<FriendWithJournals[]>([]);
  const [searchEmail, setSearchEmail] = useState('');
  const [searchResult, setSearchResult] = useState<User | null | 'not-found'>(null);
  const [activeTab, setActiveTab] = useState<'journals' | 'manage'>('journals');
  const [expandedFriendId, setExpandedFriendId] = useState<string | null>(null);

  useEffect(() => {
    if (!currentUser) return;
    const friendList = currentUser.friendIds
      .map((fid) => storageService.getUserById(fid))
      .filter((u): u is User => u !== null)
      .map((friend) => {
        const allJournals = storageService.getJournalsByUserId(friend.id);
        const visibleJournals = allJournals.filter(
          (j) => j.visibility === 'public' || (j.visibility === 'friends' && currentUser.friendIds.includes(friend.id))
        );
        return { ...friend, visibleJournals };
      });
    setFriends(friendList);
  }, [currentUser]);

  const handleSearch = () => {
    if (!searchEmail.trim() || !currentUser) return;
    const found = storageService.getUserByEmail(searchEmail.trim());
    if (!found || found.id === currentUser.id) {
      setSearchResult('not-found');
    } else {
      setSearchResult(found);
    }
  };

  const handleAddFriend = (friendId: string) => {
    if (!currentUser) return;
    if (currentUser.friendIds.includes(friendId)) return;
    const updated = { ...currentUser, friendIds: [...currentUser.friendIds, friendId] };
    updateCurrentUser(updated);
    setSearchEmail('');
    setSearchResult(null);
  };

  const handleRemoveFriend = (friendId: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, friendIds: currentUser.friendIds.filter((id) => id !== friendId) };
    updateCurrentUser(updated);
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
  };

  const isFriend = (userId: string) => currentUser?.friendIds.includes(userId) ?? false;

  return (
    <div className="page-container">
      <AppHeader title="好友" />

      <div style={{ display: 'flex', borderBottom: '1px solid #f0f0f0', background: '#fff' }}>
        {[{ key: 'journals', label: '好友日记' }, { key: 'manage', label: '管理好友' }].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'journals' | 'manage')}
            style={{ flex: 1, padding: '0.875rem 0', background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9375rem', fontWeight: activeTab === tab.key ? 600 : 400, color: activeTab === tab.key ? '#1677ff' : '#8c8c8c', borderBottom: activeTab === tab.key ? '2px solid #1677ff' : '2px solid transparent', transition: 'all 0.2s' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ paddingBottom: '5rem', overflowY: 'auto' }}>
        {activeTab === 'journals' && (
          <div>
            {friends.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 1rem', color: '#bfbfbf' }}>
                <svg width="56" height="56" viewBox="0 0 24 24" fill="#e5e6eb">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
                <p style={{ marginTop: '1rem', fontSize: '0.9375rem' }}>还没有好友，去添加吧</p>
              </div>
            ) : (
              friends.map((friend) => (
                <div key={friend.id} style={{ background: '#fff', marginBottom: '0.5rem' }}>
                  <div
                    onClick={() => setExpandedFriendId(expandedFriendId === friend.id ? null : friend.id)}
                    style={{ display: 'flex', alignItems: 'center', padding: '0.875rem 1rem', cursor: 'pointer', gap: '0.75rem' }}
                  >
                    <img src={friend.avatar} alt={friend.username} style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: '#e6f4ff' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1a1a1a' }}>{friend.username}</div>
                      <div style={{ fontSize: '0.8125rem', color: '#8c8c8c' }}>{friend.visibleJournals.length} 篇可见日记</div>
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#bfbfbf" style={{ transform: expandedFriendId === friend.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                      <path d="M7 10l5 5 5-5z" />
                    </svg>
                  </div>

                  {expandedFriendId === friend.id && (
                    <div style={{ borderTop: '1px solid #f5f5f5' }}>
                      {friend.visibleJournals.length === 0 ? (
                        <p style={{ padding: '1rem', color: '#bfbfbf', fontSize: '0.875rem', textAlign: 'center' }}>暂无可见日记</p>
                      ) : (
                        friend.visibleJournals.slice(0, 5).map((journal) => (
                          <div key={journal.id} style={{ padding: '0.75rem 1rem 0.75rem 4.25rem', borderBottom: '1px solid #f5f5f5' }}>
                            <div style={{ fontSize: '0.875rem', fontWeight: 500, color: '#1a1a1a', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {journal.title || '无标题'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#8c8c8c', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {journal.content || '暂无内容'}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'manage' && (
          <div>
            <div style={{ padding: '1rem', background: '#fff', borderBottom: '1px solid #f0f0f0' }}>
              <p style={{ fontSize: '0.8125rem', color: '#8c8c8c', marginBottom: '0.75rem' }}>通过邮箱搜索并添加好友</p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  value={searchEmail}
                  onChange={(e) => { setSearchEmail(e.target.value); setSearchResult(null); }}
                  placeholder="输入对方邮箱"
                  type="email"
                  style={{ flex: 1, height: '2.5rem', padding: '0 0.75rem', border: '1.5px solid #e5e6eb', borderRadius: '0.625rem', fontSize: '0.875rem', outline: 'none' }}
                  onFocus={(e) => (e.target.style.borderColor = '#1677ff')}
                  onBlur={(e) => (e.target.style.borderColor = '#e5e6eb')}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  style={{ height: '2.5rem', padding: '0 1rem', background: '#1677ff', border: 'none', borderRadius: '0.625rem', color: '#fff', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                >
                  搜索
                </button>
              </div>

              {searchResult === 'not-found' && (
                <p style={{ marginTop: '0.75rem', color: '#ff4d4f', fontSize: '0.8125rem' }}>未找到该用户</p>
              )}

              {searchResult && searchResult !== 'not-found' && (
                <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: '#f7f8fa', borderRadius: '0.625rem' }}>
                  <img src={searchResult.avatar} alt={searchResult.username} style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: '#e6f4ff' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 600, color: '#1a1a1a' }}>{searchResult.username}</div>
                    <div style={{ fontSize: '0.8125rem', color: '#8c8c8c' }}>{searchResult.email}</div>
                  </div>
                  {isFriend(searchResult.id) ? (
                    <span style={{ fontSize: '0.8125rem', color: '#52c41a' }}>已是好友</span>
                  ) : (
                    <button
                      onClick={() => handleAddFriend(searchResult.id)}
                      style={{ padding: '0.375rem 0.875rem', background: '#1677ff', border: 'none', borderRadius: '1rem', color: '#fff', fontSize: '0.8125rem', fontWeight: 600, cursor: 'pointer' }}
                    >
                      添加
                    </button>
                  )}
                </div>
              )}
            </div>

            <div style={{ padding: '0.75rem 1rem 0.375rem', fontSize: '0.8125rem', color: '#8c8c8c', fontWeight: 600, background: '#f7f8fa' }}>
              我的好友 ({friends.length})
            </div>

            {friends.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#bfbfbf', fontSize: '0.875rem' }}>
                还没有好友
              </div>
            ) : (
              friends.map((friend) => (
                <div key={friend.id} style={{ display: 'flex', alignItems: 'center', padding: '0.875rem 1rem', background: '#fff', borderBottom: '1px solid #f5f5f5', gap: '0.75rem' }}>
                  <img src={friend.avatar} alt={friend.username} style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: '#e6f4ff' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 500, color: '#1a1a1a' }}>{friend.username}</div>
                    <div style={{ fontSize: '0.8125rem', color: '#8c8c8c' }}>{friend.email}</div>
                  </div>
                  <button
                    onClick={() => handleRemoveFriend(friend.id)}
                    style={{ padding: '0.375rem 0.75rem', background: 'none', border: '1px solid #ffccc7', borderRadius: '1rem', color: '#ff4d4f', fontSize: '0.8125rem', cursor: 'pointer' }}
                  >
                    删除
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};
