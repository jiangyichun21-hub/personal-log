import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { storageService } from '@/services/storage';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import type { User, Journal, FriendRequest } from '@/types';

interface FriendWithJournals extends User {
  visibleJournals: Journal[];
}

type ActiveTab = 'journals' | 'requests' | 'manage';

export const FriendsPage = () => {
  const { currentUser, updateCurrentUser } = useAuth();
  const [friends, setFriends] = useState<FriendWithJournals[]>([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResult, setSearchResult] = useState<User | null | 'not-found'>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('journals');
  const [expandedFriendId, setExpandedFriendId] = useState<string | null>(null);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequest[]>([]);

  const loadData = useCallback(() => {
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
    setIncomingRequests(storageService.getPendingRequestsForUser(currentUser.id));
    setSentRequests(storageService.getSentPendingRequests(currentUser.id));
  }, [currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = () => {
    if (!searchUsername.trim() || !currentUser) return;
    const found = storageService.getUserByUsername(searchUsername.trim());
    if (!found || found.id === currentUser.id) {
      setSearchResult('not-found');
    } else {
      setSearchResult(found);
    }
  };

  const handleSendRequest = (toUserId: string) => {
    if (!currentUser) return;
    const alreadySent = storageService.getFriendRequestsBetween(currentUser.id, toUserId);
    if (alreadySent) return;
    const newRequest: FriendRequest = {
      id: storageService.generateId(),
      fromUserId: currentUser.id,
      toUserId,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    storageService.createFriendRequest(newRequest);
    setSearchUsername('');
    setSearchResult(null);
    setSentRequests((prev) => [...prev, newRequest]);
  };

  const handleAcceptRequest = (request: FriendRequest) => {
    if (!currentUser) return;
    storageService.updateFriendRequest(request.id, 'accepted');
    const updatedMe = { ...currentUser, friendIds: [...currentUser.friendIds, request.fromUserId] };
    updateCurrentUser(updatedMe);
    const sender = storageService.getUserById(request.fromUserId);
    if (sender) {
      const updatedSender = { ...sender, friendIds: [...sender.friendIds, currentUser.id] };
      storageService.updateUser(updatedSender);
    }
    setIncomingRequests((prev) => prev.filter((r) => r.id !== request.id));
  };

  const handleRejectRequest = (request: FriendRequest) => {
    storageService.updateFriendRequest(request.id, 'rejected');
    setIncomingRequests((prev) => prev.filter((r) => r.id !== request.id));
  };

  const handleRemoveFriend = (friendId: string) => {
    if (!currentUser) return;
    const updated = { ...currentUser, friendIds: currentUser.friendIds.filter((id) => id !== friendId) };
    updateCurrentUser(updated);
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
  };

  const isFriend = (userId: string) => currentUser?.friendIds.includes(userId) ?? false;
  const hasSentRequest = (toUserId: string) => sentRequests.some((r) => r.toUserId === toUserId);

  const tabs: { key: ActiveTab; label: string; badge?: number }[] = [
    { key: 'journals', label: '好友日记' },
    { key: 'requests', label: '好友申请', badge: incomingRequests.length },
    { key: 'manage', label: '管理好友' },
  ];

  const tabStyle = (isActive: boolean): React.CSSProperties => ({
    flex: 1,
    padding: '0.875rem 0',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.8125rem',
    fontWeight: isActive ? 800 : 600,
    color: isActive ? 'var(--color-primary)' : 'var(--color-text-muted)',
    borderBottom: isActive ? '2px solid var(--color-primary)' : '2px solid transparent',
    transition: 'all 0.2s',
    position: 'relative',
    letterSpacing: '0.01em',
  });

  return (
    <div className="page-container">
      <AppHeader title="好友" />

      <div
        style={{
          display: 'flex',
          background: 'var(--color-surface)',
          borderBottom: '1px solid var(--color-border)',
          padding: '0 0.25rem',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={tabStyle(activeTab === tab.key)}
          >
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.375rem',
                  background: 'var(--color-primary)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '1.125rem',
                  height: '1.125rem',
                  fontSize: '0.625rem',
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {tab.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      <div style={{ paddingBottom: '5rem' }}>
        {activeTab === 'journals' && (
          <div>
            {friends.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem 1rem', gap: '0.875rem' }}>
                <div style={{ width: '3.5rem', height: '3.5rem', background: 'var(--color-primary-pale)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="var(--color-primary)"/>
                  </svg>
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 600, textAlign: 'center' }}>
                  还没有好友，去添加吧
                </p>
              </div>
            ) : (
              <div style={{ padding: '0.75rem 0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {friends.map((friend) => (
                  <div
                    key={friend.id}
                    style={{
                      background: 'var(--color-surface)',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid var(--color-border)',
                      overflow: 'hidden',
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  >
                    <div
                      onClick={() => setExpandedFriendId(expandedFriendId === friend.id ? null : friend.id)}
                      style={{ display: 'flex', alignItems: 'center', padding: '0.875rem 1rem', cursor: 'pointer', gap: '0.75rem' }}
                    >
                      <img
                        src={friend.avatar}
                        alt={friend.username}
                        style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'var(--color-surface-2)', border: '2px solid var(--color-border)', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.125rem' }}>
                          {friend.username}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                          {friend.visibleJournals.length > 0
                            ? `${friend.visibleJournals.length} 篇可见日记`
                            : '暂无可见日记'}
                        </div>
                      </div>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        style={{ transform: expandedFriendId === friend.id ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}
                      >
                        <path d="M6 9l6 6 6-6" stroke="var(--color-text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>

                    {expandedFriendId === friend.id && (
                      <div style={{ borderTop: '1px solid var(--color-border)' }}>
                        {friend.visibleJournals.length === 0 ? (
                          <p style={{ padding: '1rem', color: 'var(--color-text-placeholder)', fontSize: '0.875rem', textAlign: 'center', fontWeight: 600 }}>
                            暂无可见日记
                          </p>
                        ) : (
                          friend.visibleJournals.slice(0, 5).map((journal) => (
                            <div
                              key={journal.id}
                              style={{ padding: '0.75rem 1rem 0.75rem 4.25rem', borderBottom: '1px solid var(--color-border)' }}
                            >
                              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {journal.title || '无标题'}
                              </div>
                              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
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

        {activeTab === 'requests' && (
          <div>
            <div style={{ padding: '0.875rem 1rem 0.375rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              收到的申请 ({incomingRequests.length})
            </div>
            {incomingRequests.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-placeholder)', fontSize: '0.875rem', fontWeight: 600 }}>
                暂无好友申请
              </div>
            ) : (
              <div style={{ padding: '0 0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {incomingRequests.map((req) => {
                  const sender = storageService.getUserById(req.fromUserId);
                  if (!sender) return null;
                  return (
                    <div
                      key={req.id}
                      style={{ display: 'flex', alignItems: 'center', padding: '0.875rem 1rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', gap: '0.75rem', boxShadow: 'var(--shadow-sm)' }}
                    >
                      <img src={sender.avatar} alt={sender.username} style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'var(--color-surface-2)', border: '2px solid var(--color-border)', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.125rem' }}>{sender.username}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                          {new Date(req.createdAt).toLocaleDateString('zh-CN')} 申请加你为好友
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                        <button
                          onClick={() => handleRejectRequest(req)}
                          style={{ padding: '0.375rem 0.625rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', color: '#dc2626', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 700 }}
                        >
                          拒绝
                        </button>
                        <button
                          onClick={() => handleAcceptRequest(req)}
                          style={{ padding: '0.375rem 0.75rem', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', border: 'none', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', boxShadow: 'var(--shadow-btn)' }}
                        >
                          同意
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div style={{ padding: '0.875rem 1rem 0.375rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase', marginTop: '0.5rem' }}>
              已发出的申请 ({sentRequests.length})
            </div>
            {sentRequests.length === 0 ? (
              <div style={{ padding: '1.5rem 1rem', textAlign: 'center', color: 'var(--color-text-placeholder)', fontSize: '0.875rem', fontWeight: 600 }}>
                暂无待处理的申请
              </div>
            ) : (
              <div style={{ padding: '0 0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {sentRequests.map((req) => {
                  const receiver = storageService.getUserById(req.toUserId);
                  if (!receiver) return null;
                  return (
                    <div key={req.id} style={{ display: 'flex', alignItems: 'center', padding: '0.875rem 1rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', gap: '0.75rem' }}>
                      <img src={receiver.avatar} alt={receiver.username} style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'var(--color-surface-2)', border: '2px solid var(--color-border)', flexShrink: 0 }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.125rem' }}>{receiver.username}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>等待对方同意</div>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, background: 'var(--color-surface-2)', padding: '0.25rem 0.625rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', flexShrink: 0 }}>
                        待确认
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'manage' && (
          <div>
            <div style={{ padding: '0.875rem', background: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}>
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', fontWeight: 600 }}>
                通过用户名搜索并发送好友申请
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  value={searchUsername}
                  onChange={(e) => { setSearchUsername(e.target.value); setSearchResult(null); }}
                  placeholder="输入对方用户名"
                  type="text"
                  style={{ flex: 1, height: '2.75rem', padding: '0 0.875rem', border: '1.5px solid var(--color-border)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', outline: 'none', background: 'var(--color-surface-2)', color: 'var(--color-text-primary)', fontWeight: 600, transition: 'border-color 0.2s' }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  style={{ height: '2.75rem', padding: '0 1rem', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', border: 'none', borderRadius: 'var(--radius-md)', color: '#fff', fontSize: '0.875rem', fontWeight: 800, cursor: 'pointer', whiteSpace: 'nowrap', boxShadow: 'var(--shadow-btn)' }}
                >
                  搜索
                </button>
              </div>

              {searchResult === 'not-found' && (
                <p style={{ marginTop: '0.75rem', color: '#dc2626', fontSize: '0.8125rem', fontWeight: 600 }}>未找到该用户</p>
              )}

              {searchResult && searchResult !== 'not-found' && (
                <div style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.875rem', background: 'var(--color-surface-2)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                  <img src={searchResult.avatar} alt={searchResult.username} style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'var(--color-surface-2)', border: '2px solid var(--color-border)', flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{searchResult.username}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>日记本成员</div>
                  </div>
                  {isFriend(searchResult.id) ? (
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 700, flexShrink: 0 }}>已是好友</span>
                  ) : hasSentRequest(searchResult.id) ? (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, background: 'var(--color-surface)', padding: '0.25rem 0.625rem', borderRadius: 'var(--radius-sm)', border: '1px solid var(--color-border)', flexShrink: 0 }}>
                      待确认
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSendRequest((searchResult as User).id)}
                      style={{ padding: '0.375rem 0.875rem', background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))', border: 'none', borderRadius: 'var(--radius-sm)', color: '#fff', fontSize: '0.8125rem', fontWeight: 800, cursor: 'pointer', boxShadow: 'var(--shadow-btn)', flexShrink: 0 }}
                    >
                      申请
                    </button>
                  )}
                </div>
              )}
            </div>

            <div style={{ padding: '0.875rem 1rem 0.375rem', fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
              我的好友 ({friends.length})
            </div>

            {friends.length === 0 ? (
              <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--color-text-placeholder)', fontSize: '0.875rem', fontWeight: 600 }}>
                还没有好友
              </div>
            ) : (
              <div style={{ padding: '0 0.875rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {friends.map((friend) => (
                  <div key={friend.id} style={{ display: 'flex', alignItems: 'center', padding: '0.875rem 1rem', background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-border)', gap: '0.75rem' }}>
                    <img src={friend.avatar} alt={friend.username} style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'var(--color-surface-2)', border: '2px solid var(--color-border)', flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.9375rem', fontWeight: 800, color: 'var(--color-text-primary)' }}>{friend.username}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>日记本成员</div>
                    </div>
                    <button
                      onClick={() => handleRemoveFriend(friend.id)}
                      style={{ padding: '0.375rem 0.75rem', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 'var(--radius-sm)', color: '#dc2626', fontSize: '0.8125rem', cursor: 'pointer', fontWeight: 700, flexShrink: 0 }}
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
