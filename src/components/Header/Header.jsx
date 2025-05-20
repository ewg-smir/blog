import { useEffect } from 'react';
import styles from './Header.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useGetCurrentLoginUserQuery, authApi } from '../../store/authApi';

function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const skip = !token;
  const { data, isError, isLoading, refetch } = useGetCurrentLoginUserQuery(undefined, { skip });

  useEffect(() => {
    if (isError && token) {
      localStorage.removeItem('token');
      authApi.util.resetApiState();
      navigate('/');
    }
  }, [isError, token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    authApi.util.resetApiState();
    navigate('/');
  };
  if (isLoading) return <div>Loading...</div>;

  const username = data?.user?.username || '';
  const avatar = data?.user?.image || 'https://static.productionready.io/images/smiley-cyrus.jpg';
  const isAuthenticated = Boolean(token && username);

  return (
    <div className={styles.header}>
      <div className={styles.title}>
        <Link to='/'>Realworld Blog</Link>
      </div>
      {isAuthenticated ? (
        <div className={styles.profile}>
          <button className={styles.create}>
            <Link to='/new-article'>
              Create article
            </Link>
          </button>
          <Link to='/profile' className={styles.username}>{data.user.username}</Link>
          <Link to='/profile'>
            <img
              src={avatar}
              alt='User avatar'
              className={styles.avatar}
            />
          </Link>
          <button className={styles.logout} onClick={handleLogout}>
            Log Out
          </button>
        </div>
      ) : (
        <div className={styles.sign}>
          <div className={styles.signIn}>
            <Link to='/sign-in'>Sign In</Link>
          </div>
          <div className={styles.signUp}>
            <Link to='/sign-up'>Sign Up</Link>
          </div>
        </div>
      )}
    </div>
  )
}

export default Header;