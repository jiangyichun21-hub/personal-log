import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

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

  const inputStyle: React.CSSProperties = {
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
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--color-primary)';
    e.target.style.boxShadow = '0 0 0 3px rgba(240, 112, 64, 0.15)';
    e.target.style.background = '#fff';
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.style.borderColor = 'var(--color-border)';
    e.target.style.boxShadow = 'none';
    e.target.style.background = 'var(--color-surface-2)';
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
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div
          style={{
            width: '4.5rem',
            height: '4.5rem',
            background: 'linear-gradient(135deg, var(--color-accent), var(--color-primary))',
            borderRadius: '1.25rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: 'var(--shadow-btn)',
          }}
        >
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
            <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="white"/>
          </svg>
        </div>
        <h1
          style={{
            fontSize: '1.75rem',
            fontWeight: 900,
            color: 'var(--color-text-primary)',
            marginBottom: '0.25rem',
            letterSpacing: '-0.02em',
          }}
        >
          创建账号
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', fontWeight: 600 }}>
          开始记录你的美好生活
        </p>
      </div>

      <div
        style={{
          background: 'rgba(255, 255, 255, 0.88)',
          borderRadius: 'var(--radius-2xl)',
          padding: '1.5rem',
          boxShadow: '0 8px 40px rgba(180, 100, 40, 0.12)',
          border: '1px solid var(--color-border)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem', fontWeight: 700, letterSpacing: '0.02em' }}>
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="给自己起个名字"
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem', fontWeight: 700, letterSpacing: '0.02em' }}>
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="至少 6 位"
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem', fontWeight: 700, letterSpacing: '0.02em' }}>
              确认密码
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="再输一次"
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
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
                : 'linear-gradient(135deg, var(--color-accent), var(--color-primary))',
              border: 'none',
              borderRadius: 'var(--radius-md)',
              color: isLoading ? 'var(--color-text-muted)' : '#fff',
              fontSize: '0.9375rem',
              fontWeight: 800,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '0.25rem',
              boxShadow: isLoading ? 'none' : 'var(--shadow-btn)',
              letterSpacing: '0.04em',
            }}
          >
            {isLoading ? '注册中...' : '注册'}
          </button>
        </form>
      </div>

      <p
        style={{
          textAlign: 'center',
          marginTop: '1.25rem',
          color: 'var(--color-text-muted)',
          fontSize: '0.875rem',
          fontWeight: 600,
        }}
      >
        已有账号？{' '}
        <Link to="/login" style={{ color: 'var(--color-primary)', fontWeight: 800, textDecoration: 'none' }}>
          去登录
        </Link>
      </p>
    </div>
  );
};
