import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { apiService } from '@/services/api';
import { BottomNav } from '@/components/BottomNav';
import { VisibilityBadge } from '@/components/VisibilityBadge';
import type { Journal } from '@/types';
import dayjs from 'dayjs';

export const ProfilePage = () => {
  const navigate = useNavigate();
  const { currentUser, updateCurrentUser } = useAuth();
  const [journals, setJournals] = useState<Journal[]>([]);
  const [showEditSheet, setShowEditSheet] = useState(false);
  const [editBio, setEditBio] = useState('');
  const [editUsername, setEditUsername] = useState('');
  const [editAvatarPreview, setEditAvatarPreview] = useState('');
  const [editAvatarBase64, setEditAvatarBase64] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      setEditBio(currentUser.bio);
      setEditUsername(currentUser.username);
      setEditAvatarPreview(currentUser.avatar || '');
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
  const publicCount = journals.filter((j) => j.visibility === 'public').length;

  const avatarUrl =
    currentUser.avatar ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`;

  const handleOpenEdit = () => {
    setEditBio(currentUser.bio);
    setEditUsername(currentUser.username);
    setEditAvatarPreview(currentUser.avatar || '');
    setEditAvatarBase64('');
    setSaveError('');
    setShowEditSheet(true);
  };

  const handleCloseEdit = () => {
    setShowEditSheet(false);
    setSaveError('');
  };

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) {
      setSaveError('图片大小不能超过 2MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      setEditAvatarPreview(base64);
      setEditAvatarBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setSaveError('');
    setIsSaving(true);
    try {
      const updated = await apiService.updateMe({
        avatar: editAvatarBase64 || currentUser.avatar,
        bio: editBio,
        username: editUsername,
      });
      updateCurrentUser(updated);
      setShowEditSheet(false);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : '保存失败');
    } finally {
      setIsSaving(false);
    }
  };

  const statItems = [
    { label: '日记', value: journals.length },
    { label: '好友', value: currentUser.friendIds.length },
    { label: '私密', value: privateCount },
    { label: '公开', value: publicCount },
  ];

  const clayCardStyle: React.CSSProperties = {
    background: 'linear-gradient(145deg, #ffffff, #fff8f2)',
    borderRadius: '22px',
    padding: '1rem 1.125rem',
    border: '2px solid rgba(245, 220, 200, 0.7)',
    cursor: 'pointer',
    boxShadow:
      '0 6px 20px rgba(180, 100, 40, 0.12), 0 2px 8px rgba(180, 100, 40, 0.08), inset 0 2px 0 rgba(255,255,255,0.90), inset 0 -2px 0 rgba(180,100,40,0.06)',
    transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
    position: 'relative',
    overflow: 'hidden',
  };

  return (
    <div className="page-container" style={{ background: 'linear-gradient(160deg, #fff5ec 0%, #fde8d0 30%, #f5f5f5 60%)' }}>
      <div style={{ paddingBottom: '6rem', paddingTop: '0.75rem' }}>
        <div
          style={{
            margin: '0 1rem 1rem',
            background: 'linear-gradient(145deg, #ffffff, #fff8f2)',
            borderRadius: '28px',
            padding: '1.25rem',
            border: '2px solid rgba(245, 220, 200, 0.7)',
            boxShadow: '0 10px 32px rgba(180,100,40,0.14), 0 4px 12px rgba(180,100,40,0.08), inset 0 2px 0 rgba(255,255,255,0.95)',
            cursor: 'pointer',
            position: 'relative',
            overflow: 'hidden',
          }}
          onClick={handleOpenEdit}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '6px',
              background: 'linear-gradient(90deg, var(--color-primary), var(--color-accent), #f0c060)',
              borderRadius: '28px 28px 0 0',
            }}
          />

          <button
            onClick={(e) => { e.stopPropagation(); navigate('/settings'); }}
            style={{
              position: 'absolute',
              top: '0.875rem',
              right: '0.875rem',
              background: 'linear-gradient(145deg, #fdecd8, #fbd8b8)',
              border: '2px solid rgba(245, 220, 200, 0.8)',
              borderRadius: '50%',
              width: '2rem',
              height: '2rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 3px 8px rgba(180,100,40,0.15), inset 0 1px 0 rgba(255,255,255,0.9)',
              zIndex: 1,
            }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="var(--color-primary)" />
            </svg>
          </button>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.125rem' }}>
            <div style={{ position: 'relative', flexShrink: 0 }}>
              <img
                src={avatarUrl}
                alt={currentUser.username}
                style={{
                  width: '5rem',
                  height: '5rem',
                  borderRadius: '50%',
                  border: '3px solid rgba(245,220,200,0.8)',
                  background: 'var(--color-surface-2)',
                  display: 'block',
                  objectFit: 'cover',
                  boxShadow: '0 6px 18px rgba(180,100,40,0.18), inset 0 2px 0 rgba(255,255,255,0.5)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '1.5rem',
                  height: '1.5rem',
                  background: 'linear-gradient(145deg, #f59060, #f07040)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #fff',
                  boxShadow: '0 3px 8px rgba(240,112,64,0.40)',
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
                  <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" fill="#fff" />
                </svg>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: 0, paddingTop: '0.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.375rem' }}>
                <h2 style={{
                  fontSize: '1.125rem',
                  fontWeight: 900,
                  color: 'var(--color-text-primary)',
                  letterSpacing: '-0.01em',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  maxWidth: '8rem',
                }}>
                  {currentUser.username}
                </h2>
                <span style={{
                  fontSize: '0.6875rem',
                  color: 'var(--color-primary)',
                  fontWeight: 800,
                  background: 'linear-gradient(145deg, #fdecd8, #fbd8b8)',
                  borderRadius: '999px',
                  padding: '0.15rem 0.5rem',
                  flexShrink: 0,
                  boxShadow: '0 2px 6px rgba(240,112,64,0.20), inset 0 1px 0 rgba(255,255,255,0.8)',
                  border: '1.5px solid rgba(240,200,152,0.8)',
                }}>
                  编辑资料
                </span>
              </div>
              <p style={{
                fontSize: '0.8125rem',
                color: 'var(--color-text-muted)',
                fontWeight: 500,
                marginBottom: '0.375rem',
                lineHeight: 1.5,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
                {currentUser.bio || (
                  <span style={{ color: 'var(--color-text-placeholder)', fontStyle: 'italic' }}>
                    点击添加个人简介
                  </span>
                )}
              </p>
              <span style={{ fontSize: '0.6875rem', color: 'var(--color-text-placeholder)', fontWeight: 600 }}>
                注册于 {dayjs(currentUser.createdAt).format('YYYY年MM月')}
              </span>
            </div>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0',
            background: 'linear-gradient(145deg, #fdecd8, #fbd8b8)',
            borderRadius: '18px',
            padding: '0.75rem 0',
            border: '2px solid rgba(245,220,200,0.8)',
            boxShadow: '0 4px 12px rgba(180,100,40,0.12), inset 0 1px 0 rgba(255,255,255,0.8)',
          }}>
            {statItems.map((item, index) => (
              <div key={item.label} style={{ flex: 1, textAlign: 'center', borderRight: index < statItems.length - 1 ? '1.5px solid rgba(240,200,152,0.6)' : 'none' }}>
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
                  fontWeight: 700,
                  marginTop: '0.2rem',
                }}>
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ padding: '0 1rem 0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{
              fontSize: '0.875rem',
              fontWeight: 900,
              color: 'var(--color-text-primary)',
              letterSpacing: '-0.01em',
            }}>
              全部日记
            </span>
            <span style={{
              background: 'linear-gradient(145deg, #fdecd8, #fbd8b8)',
              color: 'var(--color-primary)',
              borderRadius: '999px',
              padding: '0.1rem 0.5rem',
              fontSize: '0.6875rem',
              fontWeight: 900,
              boxShadow: '0 2px 6px rgba(240,112,64,0.20), inset 0 1px 0 rgba(255,255,255,0.8)',
            }}>
              {journals.length}
            </span>
          </div>

          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 1rem' }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                border: '3px solid rgba(245,220,200,0.8)',
                borderTop: '3px solid var(--color-primary)',
                borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }} />
            </div>
          ) : journals.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '3rem 1rem', gap: '0.875rem' }}>
              <div style={{
                width: '4rem',
                height: '4rem',
                background: 'linear-gradient(145deg, #fdecd8, #fbd8b8)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 6px 18px rgba(180,100,40,0.15), inset 0 2px 0 rgba(255,255,255,0.8)',
                animation: 'clay-float 3s ease-in-out infinite',
              }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="var(--color-primary)" />
                </svg>
              </div>
              <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 700, textAlign: 'center' }}>
                还没有日记，点击下方按钮开始记录
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {journals.map((journal) => (
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
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.375rem', gap: '0.5rem', marginTop: '0.25rem' }}>
                    <h3 style={{ fontSize: '0.9375rem', fontWeight: 900, color: 'var(--color-text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {journal.title || '无标题'}
                    </h3>
                    <VisibilityBadge visibility={journal.visibility} />
                  </div>
                  <p style={{ fontSize: '0.8125rem', color: 'var(--color-text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', lineHeight: 1.65, marginBottom: '0.5rem', fontWeight: 500 }}>
                    {journal.content || '暂无内容'}
                  </p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                    {dayjs(journal.createdAt).format('MM月DD日 HH:mm')}
                  </span>
                </div>
              ))}
              <div style={{ height: '0.5rem' }} />
            </div>
          )}
        </div>
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
          background: 'linear-gradient(145deg, #f59060, #f07040)',
          border: 'none',
          boxShadow: '0 10px 28px rgba(240, 112, 64, 0.50), inset 0 3px 0 rgba(255,255,255,0.30), inset 0 -3px 0 rgba(180,60,20,0.20)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99,
          transition: 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
        }}
        onTouchStart={(e) => { e.currentTarget.style.transform = 'translateX(-50%) scale(0.90)'; }}
        onTouchEnd={(e) => { e.currentTarget.style.transform = 'translateX(-50%) scale(1)'; }}
      >
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" />
        </svg>
      </button>

      <BottomNav />

      {showEditSheet && (
        <>
          <div
            onClick={handleCloseEdit}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(45, 31, 14, 0.45)',
              zIndex: 200,
              backdropFilter: 'blur(8px)',
            }}
          />
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: '100%',
              maxWidth: '480px',
              background: 'linear-gradient(145deg, #ffffff, #fff8f2)',
              borderRadius: '32px 32px 0 0',
              zIndex: 201,
              padding: '0 1.25rem 2rem',
              boxShadow: '0 -8px 32px rgba(180,100,40,0.18), inset 0 2px 0 rgba(255,255,255,0.9)',
              border: '2px solid rgba(245,220,200,0.6)',
              borderBottom: 'none',
              maxHeight: '85vh',
              overflowY: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', padding: '0.875rem 0 0.5rem' }}>
              <div style={{ width: '2.5rem', height: '4px', background: 'rgba(245,220,200,0.9)', borderRadius: '2px', boxShadow: 'inset 0 1px 2px rgba(180,100,40,0.15)' }} />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
              <button
                onClick={handleCloseEdit}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9375rem', color: 'var(--color-text-muted)', fontWeight: 700, padding: '0.25rem 0' }}
              >
                取消
              </button>
              <span style={{ fontSize: '1rem', fontWeight: 900, color: 'var(--color-text-primary)' }}>编辑资料</span>
              <button
                onClick={handleSaveProfile}
                disabled={isSaving}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontSize: '0.9375rem',
                  color: isSaving ? 'var(--color-text-muted)' : 'var(--color-primary)',
                  fontWeight: 900,
                  padding: '0.25rem 0',
                }}
              >
                {isSaving ? '保存中' : '保存'}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.75rem' }}>
              <div
                style={{ position: 'relative', cursor: 'pointer' }}
                onClick={() => fileInputRef.current?.click()}
              >
                <img
                  src={editAvatarPreview || `https://api.dicebear.com/7.x/avataaars/svg?seed=${currentUser.username}`}
                  alt="头像"
                  style={{
                    width: '5.5rem',
                    height: '5.5rem',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '3px solid rgba(245,220,200,0.8)',
                    display: 'block',
                    boxShadow: '0 6px 18px rgba(180,100,40,0.18)',
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: '1.75rem',
                  height: '1.75rem',
                  background: 'linear-gradient(145deg, #f59060, #f07040)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid #fff',
                  boxShadow: '0 3px 10px rgba(240,112,64,0.45)',
                }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path d="M12 15.2A3.2 3.2 0 1 0 12 8.8a3.2 3.2 0 0 0 0 6.4z" fill="#fff" />
                    <path d="M9 2L7.17 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2h-3.17L15 2H9zm3 15c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z" fill="#fff" />
                  </svg>
                </div>
              </div>
              <span style={{ marginTop: '0.625rem', fontSize: '0.8125rem', color: 'var(--color-primary)', fontWeight: 700 }}>
                点击更换头像
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handleAvatarFileChange}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: 'linear-gradient(145deg, #ffffff, #fff8f2)',
                borderRadius: '18px 18px 0 0',
                border: '2px solid rgba(245,220,200,0.7)',
                borderBottom: '1px solid rgba(245,220,200,0.5)',
                padding: '0.875rem 1rem',
                boxShadow: 'inset 0 2px 6px rgba(180,100,40,0.06)',
              }}>
                <label style={{ width: '4rem', fontSize: '0.9375rem', color: 'var(--color-text-muted)', fontWeight: 700, flexShrink: 0 }}>
                  昵称
                </label>
                <input
                  value={editUsername}
                  onChange={(e) => setEditUsername(e.target.value)}
                  placeholder="请输入昵称（2-20字符）"
                  maxLength={20}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.9375rem',
                    color: 'var(--color-text-primary)',
                    fontWeight: 700,
                    background: 'transparent',
                    textAlign: 'right',
                  }}
                />
              </div>

              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                background: 'linear-gradient(145deg, #ffffff, #fff8f2)',
                borderRadius: '0 0 18px 18px',
                border: '2px solid rgba(245,220,200,0.7)',
                borderTop: 'none',
                padding: '0.875rem 1rem',
                boxShadow: 'inset 0 2px 6px rgba(180,100,40,0.06)',
              }}>
                <label style={{ width: '4rem', fontSize: '0.9375rem', color: 'var(--color-text-muted)', fontWeight: 700, flexShrink: 0, paddingTop: '0.125rem' }}>
                  简介
                </label>
                <textarea
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="介绍一下自己吧..."
                  maxLength={100}
                  style={{
                    flex: 1,
                    border: 'none',
                    outline: 'none',
                    fontSize: '0.9375rem',
                    color: 'var(--color-text-primary)',
                    fontWeight: 500,
                    background: 'transparent',
                    resize: 'none',
                    height: '4rem',
                    fontFamily: 'inherit',
                    textAlign: 'right',
                    lineHeight: 1.6,
                  }}
                />
              </div>
            </div>

            {saveError && (
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem 1rem',
                background: 'linear-gradient(145deg, #fff0f0, #ffe8e8)',
                border: '2px solid #fecaca',
                borderRadius: '16px',
                color: '#dc2626',
                fontSize: '0.8125rem',
                fontWeight: 700,
                boxShadow: 'inset 0 2px 6px rgba(220,38,38,0.08)',
              }}>
                {saveError}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};
