import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const clayInputStyle: React.CSSProperties = {
  width: '100%',
  height: '3.25rem',
  padding: '0 1.125rem',
  border: '2px solid rgba(245, 220, 200, 0.9)',
  borderRadius: '18px',
  fontSize: '0.9375rem',
  outline: 'none',
  background: 'linear-gradient(145deg, #fff8f2, #ffffff)',
  color: 'var(--color-text-primary)',
  fontWeight: 600,
  transition: 'all 0.2s ease',
  boxShadow:
    'inset 0 3px 8px rgba(180, 100, 40, 0.10), inset 0 1px 3px rgba(180, 100, 40, 0.06), 0 1px 0 rgba(255,255,255,0.9)',
};

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password || !confirmPassword) {
      setError('请填写所有字段');
      return;
    }
    if (password !== confirmPassword) {
      setError('两次密码输入不一致');
      return;
    }
    if (password.length < 6) {
      setError('密码至少需要 6 位');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await register(username, password);
      navigate('/journals', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--color-primary-light)';
    e.target.style.boxShadow =
      'inset 0 3px 8px rgba(180, 100, 40, 0.12), inset 0 1px 3px rgba(180, 100, 40, 0.08), 0 0 0 3px rgba(240, 112, 64, 0.12)';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'rgba(245, 220, 200, 0.9)';
    e.target.style.boxShadow =
      'inset 0 3px 8px rgba(180, 100, 40, 0.10), inset 0 1px 3px rgba(180, 100, 40, 0.06), 0 1px 0 rgba(255,255,255,0.9)';
  };

  return (
    <div
      className="page-container"
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: '2rem 1.5rem',
        background: 'linear-gradient(160deg, #fff5ec 0%, #fde8d0 50%, #fcd0a8 100%)',
      }}
    >
      {/* 装饰气泡 */}
      <div style={{ position: 'absolute', top: '6%', right: '10%', width: '4rem', height: '4rem', background: 'linear-gradient(145deg, #fde8d8, #fbd0b0)', borderRadius: '50%', boxShadow: '0 8px 24px rgba(240,112,64,0.20), inset 0 2px 0 rgba(255,255,255,0.7)', opacity: 0.7 }} />
      <div style={{ position: 'absolute', top: '14%', left: '6%', width: '2.5rem', height: '2.5rem', background: 'linear-gradient(145deg, #e8f5ee, #c8ecd8)', borderRadius: '50%', boxShadow: '0 6px 16px rgba(45,122,74,0.15), inset 0 2px 0 rgba(255,255,255,0.7)', opacity: 0.6 }} />
      <div style={{ position: 'absolute', bottom: '15%', right: '8%', width: '3.5rem', height: '3.5rem', background: 'linear-gradient(145deg, #fef3e8, #fde0c0)', borderRadius: '50%', boxShadow: '0 6px 16px rgba(240,112,64,0.15), inset 0 2px 0 rgba(255,255,255,0.7)', opacity: 0.5 }} />

      <div style={{ marginBottom: '2rem', textAlign: 'center', position: 'relative' }}>
        <div
          style={{
            width: '5rem',
            height: '5rem',
            background: 'linear-gradient(145deg, #f0a882, #e8956d)',
            borderRadius: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow:
              '0 12px 32px rgba(232, 149, 109, 0.45), 0 4px 12px rgba(232, 149, 109, 0.30), inset 0 3px 0 rgba(255,255,255,0.35), inset 0 -3px 0 rgba(160,80,40,0.20)',
            animation: 'clay-float 3.5s ease-in-out infinite',
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"
              fill="white"
            />
          </svg>
        </div>
        <h1
          style={{
            fontSize: '1.875rem',
            fontWeight: 900,
            color: 'var(--color-text-primary)',
            marginBottom: '0.25rem',
            letterSpacing: '-0.02em',
          }}
        >
          创建账号
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
          开始记录你的美好生活 ✨
        </p>
      </div>

      <div
        style={{
          background: 'linear-gradient(145deg, #ffffff, #fff8f2)',
          borderRadius: '32px',
          padding: '1.75rem 1.5rem',
          boxShadow:
            '0 16px 48px rgba(180, 100, 40, 0.16), 0 4px 16px rgba(180, 100, 40, 0.10), inset 0 2px 0 rgba(255,255,255,0.95), inset 0 -2px 0 rgba(180,100,40,0.06)',
          border: '2px solid rgba(245, 220, 200, 0.6)',
          position: 'relative',
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem', fontWeight: 800, letterSpacing: '0.03em' }}>
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="给自己起个名字"
              style={clayInputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem', fontWeight: 800, letterSpacing: '0.03em' }}>
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少 6 位"
              style={clayInputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem', fontWeight: 800, letterSpacing: '0.03em' }}>
              确认密码
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="再输一次"
              style={clayInputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          {error && (
            <div
              style={{
                background: 'linear-gradient(145deg, #fff0f0, #ffe8e8)',
                border: '2px solid #fecaca',
                borderRadius: '16px',
                padding: '0.75rem 1rem',
                color: '#dc2626',
                fontSize: '0.8125rem',
                fontWeight: 700,
                boxShadow: 'inset 0 2px 6px rgba(220,38,38,0.08)',
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              height: '3.25rem',
              background: isLoading
                ? 'linear-gradient(145deg, #fde8d8, #fbd0b8)'
                : 'linear-gradient(145deg, #f0a882, #e8956d)',
              border: 'none',
              borderRadius: '18px',
              color: isLoading ? 'var(--color-text-muted)' : '#fff',
              fontSize: '1rem',
              fontWeight: 900,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '0.25rem',
              boxShadow: isLoading
                ? 'inset 0 2px 6px rgba(180,100,40,0.12)'
                : '0 8px 24px rgba(232, 149, 109, 0.45), 0 3px 8px rgba(232, 149, 109, 0.30), inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(160,80,40,0.20)',
              letterSpacing: '0.04em',
              transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {isLoading ? '注册中...' : '注 册'}
          </button>
        </form>
      </div>

      <p
        style={{
          textAlign: 'center',
          marginTop: '1.5rem',
          color: 'var(--color-text-muted)',
          fontSize: '0.875rem',
          fontWeight: 600,
          position: 'relative',
        }}
      >
        已有账号？{' '}
        <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 900, textDecoration: 'none' }}>
          去登录 →
        </Link>
      </p>
    </div>
  );
};
