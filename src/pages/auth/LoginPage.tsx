import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('请填写用户名和密码');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await login(username, password);
      navigate('/journals', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
    } finally {
      setIsLoading(false);
    }
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
        background: 'linear-gradient(160deg, #fdf6ee 0%, #fce8d5 60%, #fbd5b5 100%)',
      }}
    >
      <div style={{ marginBottom: '2.75rem', textAlign: 'center' }}>
        <div
          style={{
            width: '5rem',
            height: '5rem',
            background: 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
            borderRadius: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: 'var(--shadow-btn)',
          }}
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" fill="white"/>
          </svg>
        </div>
        <h1
          style={{
            fontSize: '2rem',
            fontWeight: 900,
            color: 'var(--color-text-primary)',
            marginBottom: '0.375rem',
            letterSpacing: '-0.02em',
          }}
        >
          小日记
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
          记录每一个温柔的瞬间
        </p>
      </div>

      <div
        style={{
          background: 'rgba(255, 255, 255, 0.88)',
          borderRadius: 'var(--radius-2xl)',
          padding: '1.75rem 1.5rem',
          boxShadow: '0 8px 40px rgba(180, 100, 40, 0.12)',
          border: '1px solid var(--color-border)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                color: 'var(--color-text-secondary)',
                marginBottom: '0.5rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
              }}
            >
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="输入你的昵称"
              style={{
                width: '100%',
                height: '3rem',
                padding: '0 1rem',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9375rem',
                outline: 'none',
                background: 'var(--color-surface-2)',
                color: 'var(--color-text-primary)',
                fontWeight: 600,
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(240, 112, 64, 0.15)';
                e.target.style.background = '#fff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = 'var(--color-surface-2)';
              }}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                color: 'var(--color-text-secondary)',
                marginBottom: '0.5rem',
                fontWeight: 700,
                letterSpacing: '0.02em',
              }}
            >
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入密码"
              style={{
                width: '100%',
                height: '3rem',
                padding: '0 1rem',
                border: '1.5px solid var(--color-border)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9375rem',
                outline: 'none',
                background: 'var(--color-surface-2)',
                color: 'var(--color-text-primary)',
                fontWeight: 600,
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--color-primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(240, 112, 64, 0.15)';
                e.target.style.background = '#fff';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--color-border)';
                e.target.style.boxShadow = 'none';
                e.target.style.background = 'var(--color-surface-2)';
              }}
            />
          </div>

          {error && (
            <div
              style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 'var(--radius-sm)',
                padding: '0.625rem 0.875rem',
                color: '#dc2626',
                fontSize: '0.8125rem',
                fontWeight: 600,
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            style={{
              height: '3rem',
              background: isLoading
                ? 'var(--color-primary-pale)'
                : 'linear-gradient(135deg, var(--color-primary), var(--color-accent))',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: isLoading ? 'var(--color-text-muted)' : '#fff',
              fontSize: '0.9375rem',
              fontWeight: 800,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '0.25rem',
              boxShadow: isLoading ? 'none' : 'var(--shadow-btn)',
              letterSpacing: '0.04em',
              transition: 'all 0.2s',
            }}
          >
            {isLoading ? '登录中...' : '登录'}
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
        }}
      >
        还没有账号？{' '}
        <Link
          to="/register"
          style={{ color: 'var(--color-primary)', fontWeight: 800, textDecoration: 'none' }}
        >
          立即注册
        </Link>
      </p>
    </div>
  );
};
