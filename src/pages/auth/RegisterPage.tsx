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
      setError('请填写所有字段 🥺');
      return;
    }
    if (password !== confirmPassword) {
      setError('两次密码输入不一致 😅');
      return;
    }
    if (password.length < 6) {
      setError('密码至少需要6位哦 🔐');
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

  const fields = [
    { label: '🐣 用户名', value: username, setter: setUsername, type: 'text', placeholder: '给自己起个可爱的名字~' },
    { label: '🔑 密码', value: password, setter: setPassword, type: 'password', placeholder: '至少6位密码~' },
    { label: '🔑 确认密码', value: confirmPassword, setter: setConfirmPassword, type: 'password', placeholder: '再输一次密码~' },
  ];

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
      <div style={{ marginBottom: '1.75rem', textAlign: 'center' }}>
        <div
          style={{
            width: '5rem',
            height: '5rem',
            background: 'linear-gradient(135deg, #f472b6, #a855f7)',
            borderRadius: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem',
            boxShadow: '0 8px 24px rgba(244, 114, 182, 0.35)',
            fontSize: '2.25rem',
          }}
        >
          🌷
        </div>
        <h1 style={{ fontSize: '1.625rem', fontWeight: 800, color: '#7c3aed', marginBottom: '0.25rem' }}>
          加入小日记
        </h1>
        <p style={{ color: '#c084fc', fontSize: '0.875rem', fontWeight: 600 }}>开始记录你的美好生活 🌈</p>
      </div>

      <div
        style={{
          background: 'rgba(255,255,255,0.85)',
          borderRadius: '1.75rem',
          padding: '1.5rem',
          boxShadow: '0 4px 32px rgba(168, 85, 247, 0.12)',
          border: '2px solid #f3d6ff',
        }}
      >
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {fields.map((field) => (
            <div key={field.label}>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: '#9b4dca', marginBottom: '0.35rem', fontWeight: 700 }}>
                {field.label}
              </label>
              <input
                type={field.type}
                value={field.value}
                onChange={(e) => field.setter(e.target.value)}
                placeholder={field.placeholder}
                style={{
                  width: '100%',
                  height: '2.875rem',
                  padding: '0 1rem',
                  border: '2px solid #f3d6ff',
                  borderRadius: '1rem',
                  fontSize: '0.9rem',
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
          ))}

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
              height: '3rem',
              background: isLoading ? '#e9d5ff' : 'linear-gradient(135deg, #f472b6, #a855f7)',
              border: 'none',
              borderRadius: '1.25rem',
              color: '#fff',
              fontSize: '1rem',
              fontWeight: 800,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              marginTop: '0.25rem',
              boxShadow: isLoading ? 'none' : '0 4px 16px rgba(244, 114, 182, 0.4)',
              letterSpacing: '0.05em',
            }}
          >
            {isLoading ? '注册中 🌀' : '注册 🎉'}
          </button>
        </form>
      </div>

      <p style={{ textAlign: 'center', marginTop: '1.25rem', color: '#c084fc', fontSize: '0.875rem', fontWeight: 600 }}>
        已有账号？{' '}
        <Link to="/login" style={{ color: '#9b4dca', fontWeight: 800, textDecoration: 'none' }}>
          去登录 ✨
        </Link>
      </p>
    </div>
  );
};
