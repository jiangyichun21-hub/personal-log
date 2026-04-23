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
    const found = storageService.getUserByUsername(searchEmail.trim());
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
      <AppHeader title="🌸 好友" />

      <div style={{ display: 'flex', background: '#fff', borderBottom: '2px solid #f3d6ff', padding: '0 0.5rem' }}>
        {[{ key: 'journals', label: '好友日记', emoji: '📖' }, { key: 'manage', label: '管理好友', emoji: '👫' }].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as 'journals' | 'manage')}
            style={{
              flex: 1,
              padding: '0.875rem 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.9rem',
              fontWeight: activeTab === tab.key ? 800 : 600,
              color: activeTab === tab.key ? '#9b4dca' : '#c084fc',
              borderBottom: activeTab === tab.key ? '3px solid #a855f7' : '3px solid transparent',
              transition: 'all 0.2s',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.375rem',
            }}
          >
            <span>{tab.emoji}</span> {tab.label}
          </button>
        ))}
      </div>

      <div style={{ paddingBottom: '5rem' }}>
        {activeTab === 'journals' && (
          <div>
            {friends.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 1rem' }}>
                <span style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>🌸</span>
                <p style={{ color: '#c084fc', fontSize: '0.9375rem', fontWeight: 600, textAlign: 'center' }}>还没有好友，去添加吧~</p>
              </div>
            ) : (
              <div style={{ padding: '0.75rem 0.875rem', display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    style={{ background: '#fff', borderRadius: '1.25rem', border: '2px solid #f3d6ff', overflow: 'hidden', boxShadow: '0 2px 12px rgba(168,85,247,0.08)' }}
                  >
                    <div
                      onClick={() => setExpandedFriendId(expandedFriendId === friend.id ? null : friend.id)}
                      style={{ display: 'flex', alignItems: 'center', padding: '0.875rem 1rem', cursor: 'pointer', gap: '0.75rem' }}
                    >
                      <img src={friend.avatar} alt={friend.username} style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', background: '#f5eeff', border: '2px solid #f3d6ff' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#5b21b6' }}>{friend.username}</div>
                        <div style={{ fontSize: '0.8125rem', color: '#c084fc', fontWeight: 600 }}>
                          {friend.visibleJournals.length > 0 ? `📖 ${friend.visibleJournals.length} 篇可见日记` : '暂无可见日记'}
                        </div>
                      </div>
                      <span style={{ fontSize: '1rem', transition: 'transform 0.2s', display: 'inline-block', transform: expandedFriendId === friend.id ? 'rotate(180deg)' : 'none' }}>
                        🔽
                      </span>
                    </div>

                    {expandedFriendId === friend.id && (
                      <div style={{ borderTop: '2px solid #f9f0ff' }}>
                        {friend.visibleJournals.length === 0 ? (
                          <p style={{ padding: '1rem', color: '#d8b4fe', fontSize: '0.875rem', textAlign: 'center', fontWeight: 600 }}>暂无可见日记 🥺</p>
                        ) : (
                          friend.visibleJournals.slice(0, 5).map((journal) => (
                            <div key={journal.id} style={{ padding: '0.75rem 1rem 0.75rem 4.5rem', borderBottom: '1px solid #f9f0ff' }}>
                              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: '#5b21b6', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {journal.title || '无标题'}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: '#9b7ec8', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                                {journal.content || '暂无内容'}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'manage' && (
          <div>
            <div style={{ padding: '1rem', background: '#fff', borderBottom: '2px solid #f3d6ff' }}>
              <p style={{ fontSize: '0.8125rem', color: '#c084fc', marginBottom: '0.75rem', fontWeight: 600 }}>
                🔍 通过用户名搜索并添加好友
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  value={searchEmail}
                  onChange={(e) => { setSearchEmail(e.target.value); setSearchResult(null); }}
                  placeholder="输入对方用户名~"
                  type="text"
                  style={{ flex: 1, height: '2.75rem', padding: '0 0.875rem', border: '2px solid #f3d6ff', borderRadius: '1rem', fontSize: '0.875rem', outline: 'none', background: '#fdf4ff', color: '#5b21b6', fontWeight: 600 }}
                  onFocus={(e) => (e.target.style.borderColor = '#c084fc')}
                  onBlur={(e) => (e.target.style.borderColor = '#f3d6ff')}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  style={{ height: '2.75rem', padding: '0 1rem', background: 'linear-gradient(135deg, #e879f9, #a855f7)', border: 'none', borderRadius: '1rem', color: '#fff', fontSize: '0.875rem', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: '0 3px 10px rgba(168,85,247,0.35)' }}
                >
                  搜索
                </button>
              </div>

              {searchResult === 'not-found' && (
                <p style={{ marginTop: '0.75rem', color: '#f472b6', fontSize: '0.8125rem', fontWeight: 700 }}>🥺 未找到该用户</p>
              )}

              {searchResult && searchResult !== 'not-found' && (
                <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem', background: '#f5eeff', borderRadius: '1rem', border: '2px solid #e0c8ff' }}>
                  <img src={searchResult.avatar} alt={searchResult.username} style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', background: '#f5eeff', border: '2px solid #f3d6ff' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#5b21b6' }}>{searchResult.username}</div>
                    <div style={{ fontSize: '0.8125rem', color: '#c084fc', fontWeight: 600 }}>🌸 日记本成员</div>
                  </div>
                  {isFriend(searchResult.id) ? (
                    <span style={{ fontSize: '0.8125rem', color: '#a855f7', fontWeight: 700 }}>✅ 已是好友</span>
                  ) : (
                    <button
                      onClick={() => handleAddFriend(searchResult.id)}
                      style={{ padding: '0.375rem 0.875rem', background: 'linear-gradient(135deg, #e879f9, #a855f7)', border: 'none', borderRadius: '1rem', color: '#fff', fontSize: '0.8125rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 8px rgba(168,85,247,0.35)' }}
                    >
                      添加 🌸
                    </button>
                  )}
                </div>
              )}
            </div>

            <div style={{ padding: '0.625rem 1rem 0.375rem', fontSize: '0.8125rem', color: '#a855f7', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <span>👫</span> 我的好友 ({friends.length})
            </div>

            {friends.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#d8b4fe', fontSize: '0.875rem', fontWeight: 600 }}>
                还没有好友 🥺
              </div>
            ) : (
              <div style={{ padding: '0 0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {friends.map((friend) => (
                  <div key={friend.id} style={{ display: 'flex', alignItems: 'center', padding: '0.875rem 1rem', background: '#fff', borderRadius: '1.25rem', border: '2px solid #f3d6ff', gap: '0.75rem' }}>
                    <img src={friend.avatar} alt={friend.username} style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', background: '#f5eeff', border: '2px solid #f3d6ff' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: '#5b21b6' }}>{friend.username}</div>
                      <div style={{ fontSize: '0.8125rem', color: '#c084fc', fontWeight: 600 }}>🌸 日记本成员</div>
                    </div>
                    <button
                      onClick={() => handleRemoveFriend(friend.id)}
                      style={{ padding: '0.375rem 0.75rem', background: '#fff0f6', border: '2px solid #ffc8e0', borderRadius: '1rem', color: '#f472b6', fontSize: '0.8125rem', cursor: 'pointer', fontWeight: 700 }}
                    >
                      删除
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};
