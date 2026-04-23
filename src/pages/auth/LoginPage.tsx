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
      setError('请填写用户名和密码 🥺');
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
        background: 'linear-gradient(160deg, #fdf4ff 0%, #fff0fb 50%, #f0f4ff 100%)',
      }}
    >
      <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
        <div
          style={{
            width: '5.5rem',
            height: '5.5rem',
            background: 'linear-gradient(135deg, #e879f9, #a855f7)',
            borderRadius: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow: '0 8px 24px rgba(168, 85, 247, 0.35)',
            fontSize: '2.5rem',
          }}
        >
          🌸
        </div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#7c3aed', marginBottom: '0.375rem' }}>
          小日记
        </h1>
        <p style={{ color: '#c084fc', fontSize: '0.9rem', fontWeight: 600 }}>记录每一个温柔的瞬间 ✨</p>
      </div>

      <div
        style={{
          background: 'rgba(255,255,255,0.85)',
          borderRadius: '1.75rem',
          padding: '1.75rem 1.5rem',
          boxShadow: '0 4px 32px rgba(168, 85, 247, 0.12)',
          border: '2px solid #f3d6ff',
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#9b4dca', marginBottom: '0.4rem', fontWeight: 700 }}>
              🐣 用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="输入你的昵称~"
              style={{
                width: '100%',
                height: '3rem',
                padding: '0 1rem',
                border: '2px solid #f3d6ff',
                borderRadius: '1rem',
                fontSize: '0.9375rem',
                outline: 'none',
                background: '#fdf4ff',
                color: '#5b21b6',
                fontWeight: 600,
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#c084fc'; e.target.style.boxShadow = '0 0 0 3px rgba(192,132,252,0.2)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#f3d6ff'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#9b4dca', marginBottom: '0.4rem', fontWeight: 700 }}>
              🔑 密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入密码~"
              style={{
                width: '100%',
                height: '3rem',
                padding: '0 1rem',
                border: '2px solid #f3d6ff',
                borderRadius: '1rem',
                fontSize: '0.9375rem',
                outline: 'none',
                background: '#fdf4ff',
                color: '#5b21b6',
                fontWeight: 600,
                transition: 'border-color 0.2s, box-shadow 0.2s',
              }}
              onFocus={(e) => { e.target.style.borderColor = '#c084fc'; e.target.style.boxShadow = '0 0 0 3px rgba(192,132,252,0.2)'; }}
              onBlur={(e) => { e.target.style.borderColor = '#f3d6ff'; e.target.style.boxShadow = 'none'; }}
            />
          </div>

          {error && (
            <div
              style={{
                background: '#fff0f6',
                border: '2px solid #ffc8e0',
                borderRadius: '0.875rem',
                padding: '0.625rem 1rem',
                color: '#d4608a',
                fontSize: '0.875rem',
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
              height: '3.125rem',
              background: isLoading
                ? '#e9d5ff'
                : 'linear-gradient(135deg, #e879f9, #a855f7)',
              border: 'none',
              borderRadius: '1.25rem',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '0.25rem',
              boxShadow: isLoading ? 'none' : '0 4px 16px rgba(168, 85, 247, 0.4)',
              transition: 'all 0.2s',
              letterSpacing: '0.05em',
            }}
          >
            {isLoading ? '登录中 🌀' : '登录 🚀'}
          </button>
        </form>
      </div>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#c084fc', fontSize: '0.875rem', fontWeight: 600 }}>
        还没有账号？{' '}
        <Link to="/register" style={{ color: '#9b4dca', fontWeight: 800, textDecoration: 'none' }}>
          立即注册 ✨
        </Link>
      </p>
    </div>
  );
};
