import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { apiService, type FriendRequestWithUser } from '@/services/api';
import { AppHeader } from '@/components/AppHeader';
import { BottomNav } from '@/components/BottomNav';
import type { User, Journal } from '@/types';

interface FriendWithJournals extends User {
  visibleJournals: Journal[];
}

type ActiveTab = 'journals' | 'requests' | 'manage';

export const FriendsPage = () => {
  const { currentUser } = useAuth();
  const [friends, setFriends] = useState<FriendWithJournals[]>([]);
  const [searchUsername, setSearchUsername] = useState('');
  const [searchResult, setSearchResult] = useState<User | null | 'not-found'>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('journals');
  const [expandedFriendId, setExpandedFriendId] = useState<string | null>(null);
  const [incomingRequests, setIncomingRequests] = useState<FriendRequestWithUser[]>([]);
  const [sentRequests, setSentRequests] = useState<FriendRequestWithUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const [friendList, pending, sent] = await Promise.all([
        apiService.getFriends(),
        apiService.getPendingRequests(),
        apiService.getSentRequests(),
      ]);

      const friendsWithJournals = await Promise.all(
        friendList.map(async (friend) => {
          const journals = await apiService.getUserJournals(friend.id);
          return { ...friend, visibleJournals: journals };
        })
      );

      setFriends(friendsWithJournals);
      setIncomingRequests(pending);
      setSentRequests(sent);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleSearch = async () => {
    if (!searchUsername.trim() || !currentUser) return;
    try {
      const found = await apiService.getUserByUsername(searchUsername.trim());
      if (found.id === currentUser.id) {
        setSearchResult('not-found');
      } else {
        setSearchResult(found);
      }
    } catch {
      setSearchResult('not-found');
    }
  };

  const handleSendRequest = async (toUserId: string) => {
    try {
      const newRequest = await apiService.sendFriendRequest(toUserId);
      setSearchUsername('');
      setSearchResult(null);
      setSentRequests((prev) => [...prev, newRequest]);
    } catch {
    }
  };

  const handleAcceptRequest = async (request: FriendRequestWithUser) => {
    await apiService.acceptFriendRequest(request.id);
    setIncomingRequests((prev) => prev.filter((r) => r.id !== request.id));
    loadData();
  };

  const handleRejectRequest = async (request: FriendRequestWithUser) => {
    await apiService.rejectFriendRequest(request.id);
    setIncomingRequests((prev) => prev.filter((r) => r.id !== request.id));
  };

  const handleRemoveFriend = async (friendId: string) => {
    await apiService.removeFriend(friendId);
    setFriends((prev) => prev.filter((f) => f.id !== friendId));
  };

  const isFriend = (userId: string) => friends.some((f) => f.id === userId);
  const hasSentRequest = (toUserId: string) => sentRequests.some((r) => r.toUserId === toUserId);

  const tabs: { key: ActiveTab; label: string; badge?: number }[] = [
    { key: 'journals', label: '好友日记' },
    { key: 'requests', label: '好友申请', badge: incomingRequests.length },
    { key: 'manage', label: '管理好友' },
  ];

  const clayCardStyle: React.CSSProperties = {
    background: 'linear-gradient(145deg, #ffffff, #fff8f2)',
    borderRadius: '20px',
    border: '2px solid rgba(245, 220, 200, 0.7)',
    overflow: 'hidden',
    boxShadow: '0 6px 20px rgba(180, 100, 40, 0.12), 0 2px 8px rgba(180, 100, 40, 0.08), inset 0 2px 0 rgba(255,255,255,0.90)',
  };

  return (
    <div className="page-container">
      <AppHeader title="好友" />

      <div
        style={{
          display: 'flex',
          background: 'linear-gradient(145deg, #ffffff, #fff8f2)',
          borderBottom: '2px solid rgba(245, 220, 200, 0.6)',
          padding: '0 0.5rem',
          boxShadow: '0 4px 12px rgba(180,100,40,0.08)',
        }}
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              flex: 1,
              padding: '0.875rem 0',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.8125rem',
              fontWeight: activeTab === tab.key ? 900 : 600,
              color: activeTab === tab.key ? 'var(--color-primary)' : 'var(--color-text-muted)',
              borderBottom: activeTab === tab.key ? '2.5px solid var(--color-primary)' : '2.5px solid transparent',
              transition: 'all 0.2s',
              position: 'relative',
              letterSpacing: '0.01em',
            }}
          >
            {tab.label}
            {tab.badge !== undefined && tab.badge > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.375rem',
                  background: 'linear-gradient(145deg, #f59060, #f07040)',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '1.125rem',
                  height: '1.125rem',
                  fontSize: '0.625rem',
                  fontWeight: 900,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 2px 6px rgba(240,112,64,0.40)',
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
            {isLoading ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem 1rem' }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  border: '3px solid rgba(245,220,200,0.8)',
                  borderTop: '3px solid var(--color-primary)',
                  borderRadius: '50%',
                  animation: 'spin 0.8s linear infinite',
                }} />
              </div>
            ) : friends.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '5rem 1rem', gap: '1rem' }}>
                <div style={{
                  width: '4.5rem',
                  height: '4.5rem',
                  background: 'linear-gradient(145deg, #fdecd8, #fbd8b8)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(180,100,40,0.15), inset 0 2px 0 rgba(255,255,255,0.8)',
                  animation: 'clay-float 3s ease-in-out infinite',
                }}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                    <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" fill="var(--color-primary)" />
                  </svg>
                </div>
                <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 700, textAlign: 'center' }}>
                  还没有好友，去添加吧
                </p>
              </div>
            ) : (
              <div style={{ padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {friends.map((friend) => (
                  <div key={friend.id} style={clayCardStyle}>
                    <div
                      onClick={() => setExpandedFriendId(expandedFriendId === friend.id ? null : friend.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.875rem 1rem',
                        cursor: 'pointer',
                        gap: '0.75rem',
                      }}
                    >
                      <img
                        src={friend.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.username}`}
                        alt={friend.username}
                        style={{
                          width: '2.75rem',
                          height: '2.75rem',
                          borderRadius: '50%',
                          border: '2.5px solid rgba(245,220,200,0.8)',
                          flexShrink: 0,
                          boxShadow: '0 3px 8px rgba(180,100,40,0.12)',
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.9375rem', fontWeight: 900, color: 'var(--color-text-primary)', marginBottom: '0.125rem' }}>
                          {friend.username}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                          {friend.visibleJournals.length > 0
                            ? `${friend.visibleJournals.length} 篇可见日记`
                            : '暂无可见日记'}
                        </div>
                      </div>
                      <div
                        style={{
                          width: '1.75rem',
                          height: '1.75rem',
                          background: 'linear-gradient(145deg, #fdecd8, #fbd8b8)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                          boxShadow: '0 2px 6px rgba(180,100,40,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
                          transition: 'transform 0.2s',
                          transform: expandedFriendId === friend.id ? 'rotate(180deg)' : 'none',
                        }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                          <path d="M6 9l6 6 6-6" stroke="var(--color-primary)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </div>

                    {expandedFriendId === friend.id && (
                      <div style={{ borderTop: '2px solid rgba(245,220,200,0.5)' }}>
                        {friend.visibleJournals.length === 0 ? (
                          <p style={{ padding: '1rem', color: 'var(--color-text-placeholder)', fontSize: '0.875rem', textAlign: 'center', fontWeight: 600 }}>
                            暂无可见日记
                          </p>
                        ) : (
                          friend.visibleJournals.slice(0, 5).map((journal, idx) => (
                            <div
                              key={journal.id}
                              style={{
                                padding: '0.75rem 1rem 0.75rem 4.5rem',
                                borderBottom: idx < Math.min(friend.visibleJournals.length, 5) - 1 ? '1px solid rgba(245,220,200,0.4)' : 'none',
                                background: 'linear-gradient(145deg, #fff8f2, #fff5ee)',
                              }}
                            >
                              <div style={{ fontSize: '0.875rem', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
          <div style={{ padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 800, letterSpacing: '0.06em', marginBottom: '0.625rem', paddingLeft: '0.25rem' }}>
                收到的申请 ({incomingRequests.length})
              </div>
              {incomingRequests.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-text-placeholder)', fontSize: '0.875rem', fontWeight: 600, background: 'linear-gradient(145deg, #ffffff, #fff8f2)', borderRadius: '20px', border: '2px solid rgba(245,220,200,0.6)' }}>
                  暂无好友申请
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {incomingRequests.map((req) => {
                    const sender = req.fromUser;
                    if (!sender) return null;
                    return (
                      <div
                        key={req.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0.875rem 1rem',
                          ...clayCardStyle,
                          gap: '0.75rem',
                        }}
                      >
                        <img
                          src={sender.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${sender.username}`}
                          alt={sender.username}
                          style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', border: '2.5px solid rgba(245,220,200,0.8)', flexShrink: 0, boxShadow: '0 3px 8px rgba(180,100,40,0.12)' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.9375rem', fontWeight: 900, color: 'var(--color-text-primary)', marginBottom: '0.125rem' }}>
                            {sender.username}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                            {new Date(req.createdAt).toLocaleDateString('zh-CN')} 申请加你为好友
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '0.375rem', flexShrink: 0 }}>
                          <button
                            onClick={() => handleRejectRequest(req)}
                            style={{
                              padding: '0.375rem 0.625rem',
                              background: 'linear-gradient(145deg, #fff0f0, #ffe8e8)',
                              border: '2px solid #fecaca',
                              borderRadius: '12px',
                              color: '#dc2626',
                              fontSize: '0.75rem',
                              cursor: 'pointer',
                              fontWeight: 800,
                              boxShadow: '0 3px 8px rgba(220,38,38,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
                            }}
                          >
                            拒绝
                          </button>
                          <button
                            onClick={() => handleAcceptRequest(req)}
                            style={{
                              padding: '0.375rem 0.75rem',
                              background: 'linear-gradient(145deg, #f59060, #f07040)',
                              border: 'none',
                              borderRadius: '12px',
                              color: '#fff',
                              fontSize: '0.75rem',
                              fontWeight: 900,
                              cursor: 'pointer',
                              boxShadow: '0 4px 12px rgba(240,112,64,0.40), inset 0 1px 0 rgba(255,255,255,0.25)',
                            }}
                          >
                            同意
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 800, letterSpacing: '0.06em', marginBottom: '0.625rem', paddingLeft: '0.25rem' }}>
                已发出的申请 ({sentRequests.length})
              </div>
              {sentRequests.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-text-placeholder)', fontSize: '0.875rem', fontWeight: 600, background: 'linear-gradient(145deg, #ffffff, #fff8f2)', borderRadius: '20px', border: '2px solid rgba(245,220,200,0.6)' }}>
                  暂无待处理的申请
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {sentRequests.map((req) => {
                    const receiver = req.toUser;
                    if (!receiver) return null;
                    return (
                      <div
                        key={req.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          padding: '0.875rem 1rem',
                          ...clayCardStyle,
                          gap: '0.75rem',
                        }}
                      >
                        <img
                          src={receiver.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${receiver.username}`}
                          alt={receiver.username}
                          style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', border: '2.5px solid rgba(245,220,200,0.8)', flexShrink: 0, boxShadow: '0 3px 8px rgba(180,100,40,0.12)' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: '0.9375rem', fontWeight: 900, color: 'var(--color-text-primary)', marginBottom: '0.125rem' }}>
                            {receiver.username}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                            等待对方同意
                          </div>
                        </div>
                        <span style={{
                          fontSize: '0.75rem',
                          color: 'var(--color-text-muted)',
                          fontWeight: 800,
                          background: 'linear-gradient(145deg, #fdecd8, #fbd8b8)',
                          padding: '0.25rem 0.625rem',
                          borderRadius: '999px',
                          border: '1.5px solid rgba(240,200,152,0.8)',
                          flexShrink: 0,
                          boxShadow: '0 2px 6px rgba(180,100,40,0.12)',
                        }}>
                          待确认
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'manage' && (
          <div style={{ padding: '0.875rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                background: 'linear-gradient(145deg, #ffffff, #fff8f2)',
                borderRadius: '22px',
                padding: '1.125rem',
                border: '2px solid rgba(245, 220, 200, 0.7)',
                boxShadow: '0 6px 20px rgba(180, 100, 40, 0.12), inset 0 2px 0 rgba(255,255,255,0.90)',
              }}
            >
              <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-muted)', marginBottom: '0.75rem', fontWeight: 700 }}>
                通过用户名搜索并发送好友申请
              </p>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input
                  value={searchUsername}
                  onChange={(e) => { setSearchUsername(e.target.value); setSearchResult(null); }}
                  placeholder="输入对方用户名"
                  type="text"
                  style={{
                    flex: 1,
                    height: '2.875rem',
                    padding: '0 1rem',
                    border: '2px solid rgba(245, 220, 200, 0.8)',
                    borderRadius: '14px',
                    fontSize: '0.875rem',
                    outline: 'none',
                    background: 'linear-gradient(145deg, #fff8f2, #ffffff)',
                    color: 'var(--color-text-primary)',
                    fontWeight: 600,
                    boxShadow: 'inset 0 3px 8px rgba(180,100,40,0.08)',
                    transition: 'all 0.2s',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = 'var(--color-primary-light)'; e.target.style.boxShadow = 'inset 0 3px 8px rgba(180,100,40,0.10), 0 0 0 3px rgba(240,112,64,0.10)'; }}
                  onBlur={(e) => { e.target.style.borderColor = 'rgba(245,220,200,0.8)'; e.target.style.boxShadow = 'inset 0 3px 8px rgba(180,100,40,0.08)'; }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <button
                  onClick={handleSearch}
                  style={{
                    height: '2.875rem',
                    padding: '0 1.125rem',
                    background: 'linear-gradient(145deg, #f59060, #f07040)',
                    border: 'none',
                    borderRadius: '14px',
                    color: '#fff',
                    fontSize: '0.875rem',
                    fontWeight: 900,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 6px 18px rgba(240,112,64,0.40), inset 0 2px 0 rgba(255,255,255,0.25)',
                  }}
                >
                  搜索
                </button>
              </div>

              {searchResult === 'not-found' && (
                <div style={{ marginTop: '0.75rem', padding: '0.625rem 0.875rem', background: 'linear-gradient(145deg, #fff0f0, #ffe8e8)', border: '2px solid #fecaca', borderRadius: '12px', color: '#dc2626', fontSize: '0.8125rem', fontWeight: 700 }}>
                  未找到该用户
                </div>
              )}

              {searchResult && searchResult !== 'not-found' && (
                <div
                  style={{
                    marginTop: '0.75rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.875rem',
                    background: 'linear-gradient(145deg, #fdecd8, #fbd8b8)',
                    borderRadius: '16px',
                    border: '2px solid rgba(240,200,152,0.8)',
                    boxShadow: '0 4px 12px rgba(180,100,40,0.12), inset 0 1px 0 rgba(255,255,255,0.8)',
                  }}
                >
                  <img
                    src={searchResult.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${searchResult.username}`}
                    alt={searchResult.username}
                    style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', border: '2.5px solid rgba(245,220,200,0.8)', flexShrink: 0, boxShadow: '0 3px 8px rgba(180,100,40,0.12)' }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.9375rem', fontWeight: 900, color: 'var(--color-text-primary)' }}>
                      {searchResult.username}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                      日记本成员
                    </div>
                  </div>
                  {isFriend(searchResult.id) ? (
                    <span style={{ fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 800, flexShrink: 0 }}>
                      已是好友
                    </span>
                  ) : hasSentRequest(searchResult.id) ? (
                    <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 800, background: 'rgba(255,255,255,0.7)', padding: '0.25rem 0.625rem', borderRadius: '999px', border: '1.5px solid rgba(240,200,152,0.8)', flexShrink: 0 }}>
                      待确认
                    </span>
                  ) : (
                    <button
                      onClick={() => handleSendRequest((searchResult as User).id)}
                      style={{
                        padding: '0.375rem 0.875rem',
                        background: 'linear-gradient(145deg, #f59060, #f07040)',
                        border: 'none',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '0.8125rem',
                        fontWeight: 900,
                        cursor: 'pointer',
                        boxShadow: '0 4px 12px rgba(240,112,64,0.40), inset 0 1px 0 rgba(255,255,255,0.25)',
                        flexShrink: 0,
                      }}
                    >
                      申请
                    </button>
                  )}
                </div>
              )}
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 800, letterSpacing: '0.06em', marginBottom: '0.625rem', paddingLeft: '0.25rem' }}>
                我的好友 ({friends.length})
              </div>
              {friends.length === 0 ? (
                <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--color-text-placeholder)', fontSize: '0.875rem', fontWeight: 600, background: 'linear-gradient(145deg, #ffffff, #fff8f2)', borderRadius: '20px', border: '2px solid rgba(245,220,200,0.6)' }}>
                  还没有好友
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
                  {friends.map((friend) => (
                    <div
                      key={friend.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        padding: '0.875rem 1rem',
                        ...clayCardStyle,
                        gap: '0.75rem',
                      }}
                    >
                      <img
                        src={friend.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${friend.username}`}
                        alt={friend.username}
                        style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', border: '2.5px solid rgba(245,220,200,0.8)', flexShrink: 0, boxShadow: '0 3px 8px rgba(180,100,40,0.12)' }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.9375rem', fontWeight: 900, color: 'var(--color-text-primary)' }}>
                          {friend.username}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
                          日记本成员
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveFriend(friend.id)}
                        style={{
                          padding: '0.375rem 0.75rem',
                          background: 'linear-gradient(145deg, #fff0f0, #ffe8e8)',
                          border: '2px solid #fecaca',
                          borderRadius: '12px',
                          color: '#dc2626',
                          fontSize: '0.8125rem',
                          cursor: 'pointer',
                          fontWeight: 800,
                          flexShrink: 0,
                          boxShadow: '0 3px 8px rgba(220,38,38,0.15), inset 0 1px 0 rgba(255,255,255,0.8)',
                        }}
                      >
                        删除
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
};
