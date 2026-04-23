import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password || !confirmPassword) {
      setError('请填写所有字段');
      return;
    }
    if (password !== confirmPassword) {
      setError('两次密码输入不一致');
      return;
    }
    if (password.length < 6) {
      setError('密码至少需要6位');
      return;
    }
    setIsLoading(true);
    setError('');
    try {
      await register(username, email, password);
      navigate('/journals', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : '注册失败');
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    height: '2.75rem',
    padding: '0 0.875rem',
    border: '1.5px solid #e5e6eb',
    borderRadius: '0.625rem',
    fontSize: '0.9375rem',
    outline: 'none',
    background: '#fafafa',
    transition: 'border-color 0.2s',
  };

  return (
    <div className="page-container" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '100vh', padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <div style={{ width: '4rem', height: '4rem', background: 'linear-gradient(135deg, #1677ff, #69b1ff)', borderRadius: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
          </svg>
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1a1a1a', marginBottom: '0.25rem' }}>创建账号</h1>
        <p style={{ color: '#8c8c8c', fontSize: '0.875rem' }}>开始记录你的生活</p>
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {[
          { label: '用户名', value: username, setter: setUsername, type: 'text', placeholder: '请输入用户名' },
          { label: '邮箱', value: email, setter: setEmail, type: 'email', placeholder: '请输入邮箱' },
          { label: '密码', value: password, setter: setPassword, type: 'password', placeholder: '至少6位密码' },
          { label: '确认密码', value: confirmPassword, setter: setConfirmPassword, type: 'password', placeholder: '再次输入密码' },
        ].map((field) => (
          <div key={field.label}>
            <label style={{ display: 'block', fontSize: '0.875rem', color: '#595959', marginBottom: '0.375rem', fontWeight: 500 }}>
              {field.label}
            </label>
            <input
              type={field.type}
              value={field.value}
              onChange={(e) => field.setter(e.target.value)}
              placeholder={field.placeholder}
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = '#1677ff')}
              onBlur={(e) => (e.target.style.borderColor = '#e5e6eb')}
            />
          </div>
        ))}

        {error && (
          <div style={{ background: '#fff1f0', border: '1px solid #ffccc7', borderRadius: '0.5rem', padding: '0.625rem 0.875rem', color: '#ff4d4f', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          style={{ height: '2.875rem', background: isLoading ? '#91caff' : 'linear-gradient(135deg, #1677ff, #4096ff)', border: 'none', borderRadius: '0.75rem', color: '#fff', fontSize: '1rem', fontWeight: 600, cursor: isLoading ? 'not-allowed' : 'pointer', marginTop: '0.25rem', transition: 'all 0.2s' }}
        >
          {isLoading ? '注册中...' : '注册'}
        </button>
      </form>

      <p style={{ textAlign: 'center', marginTop: '1.5rem', color: '#8c8c8c', fontSize: '0.875rem' }}>
        已有账号？{' '}
        <Link to="/login" style={{ color: '#1677ff', fontWeight: 500, textDecoration: 'none' }}>
          立即登录
        </Link>
      </p>
    </div>
  );
};
