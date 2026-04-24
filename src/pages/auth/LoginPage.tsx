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
      navigate('/profile', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败');
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
      <div style={{ position: 'absolute', top: '8%', right: '12%', width: '5rem', height: '5rem', background: 'linear-gradient(145deg, #fde8d8, #fbd0b0)', borderRadius: '50%', boxShadow: '0 8px 24px rgba(240,112,64,0.20), inset 0 2px 0 rgba(255,255,255,0.7)', opacity: 0.7 }} />
      <div style={{ position: 'absolute', top: '18%', left: '8%', width: '3rem', height: '3rem', background: 'linear-gradient(145deg, #fef3e8, #fde0c0)', borderRadius: '50%', boxShadow: '0 6px 16px rgba(240,112,64,0.15), inset 0 2px 0 rgba(255,255,255,0.7)', opacity: 0.6 }} />
      <div style={{ position: 'absolute', bottom: '20%', left: '6%', width: '4rem', height: '4rem', background: 'linear-gradient(145deg, #e8f5ee, #c8ecd8)', borderRadius: '50%', boxShadow: '0 6px 16px rgba(45,122,74,0.15), inset 0 2px 0 rgba(255,255,255,0.7)', opacity: 0.5 }} />

      <div style={{ marginBottom: '2.5rem', textAlign: 'center', position: 'relative' }}>
        <div
          style={{
            width: '5.5rem',
            height: '5.5rem',
            background: 'linear-gradient(145deg, #f59060, #f07040)',
            borderRadius: '2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
            boxShadow:
              '0 12px 32px rgba(240, 112, 64, 0.45), 0 4px 12px rgba(240, 112, 64, 0.30), inset 0 3px 0 rgba(255,255,255,0.35), inset 0 -3px 0 rgba(180,60,20,0.20)',
            animation: 'clay-float 3s ease-in-out infinite',
          }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
            <path
              d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"
              fill="white"
            />
          </svg>
        </div>
        <h1
          style={{
            fontSize: '2.25rem',
            fontWeight: 900,
            color: 'var(--color-text-primary)',
            marginBottom: '0.375rem',
            letterSpacing: '-0.02em',
          }}
        >
          小日记
        </h1>
        <p style={{ color: 'var(--color-text-muted)', fontSize: '0.9rem', fontWeight: 600 }}>
          记录每一个温柔的瞬间 🌸
        </p>
      </div>

      <div
        style={{
          background: 'linear-gradient(145deg, #ffffff, #fff8f2)',
          borderRadius: '32px',
          padding: '2rem 1.5rem',
          boxShadow:
            '0 16px 48px rgba(180, 100, 40, 0.16), 0 4px 16px rgba(180, 100, 40, 0.10), inset 0 2px 0 rgba(255,255,255,0.95), inset 0 -2px 0 rgba(180,100,40,0.06)',
          border: '2px solid rgba(245, 220, 200, 0.6)',
          position: 'relative',
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.125rem' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                color: 'var(--color-text-secondary)',
                marginBottom: '0.5rem',
                fontWeight: 800,
                letterSpacing: '0.03em',
              }}
            >
              用户名
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="输入你的昵称"
              style={clayInputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.8125rem',
                color: 'var(--color-text-secondary)',
                marginBottom: '0.5rem',
                fontWeight: 800,
                letterSpacing: '0.03em',
              }}
            >
              密码
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="输入密码"
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
                : 'linear-gradient(145deg, #f59060, #f07040)',
              border: 'none',
              borderRadius: '18px',
              color: isLoading ? 'var(--color-text-muted)' : '#fff',
              fontSize: '1rem',
              fontWeight: 900,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '0.25rem',
              boxShadow: isLoading
                ? 'inset 0 2px 6px rgba(180,100,40,0.12)'
                : '0 8px 24px rgba(240, 112, 64, 0.45), 0 3px 8px rgba(240, 112, 64, 0.30), inset 0 2px 0 rgba(255,255,255,0.35), inset 0 -2px 0 rgba(180,60,20,0.20)',
              letterSpacing: '0.04em',
              transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          >
            {isLoading ? '登录中...' : '登 录'}
          </button>
        </form>
      </div>

      <p
        style={{
          textAlign: 'center',
          marginTop: '1.75rem',
          color: 'var(--color-text-muted)',
          fontSize: '0.875rem',
          fontWeight: 600,
          position: 'relative',
        }}
      >
        还没有账号？{' '}
        <Link
          to="/register"
          style={{ color: 'var(--color-primary)', fontWeight: 900, textDecoration: 'none' }}
        >
          立即注册 →
        </Link>
      </p>
    </div>
  );
};
