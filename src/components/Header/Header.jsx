import { useDispatch, useSelector } from 'react-redux';
import { authApi } from '../../store/authApi';
import styles from './Header.module.scss';
import { Link, useNavigate } from 'react-router-dom';
import { useGetCurrentLoginUserQuery } from '../../store/authApi';
import { clearLoginState } from '../../store/authSlice';

function Header() {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state) => state.auth)
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const skip = !token;
  const { data, isError, isLoading } = useGetCurrentLoginUserQuery(undefined, { skip });

  const handleLogout = () => {
    localStorage.removeItem('token');
    dispatch(clearLoginState());
    dispatch(authApi.util.resetApiState()); 
    navigate('/');
    console.log(token)
  };
  if (isLoading) return <div>Loading...</div>;

  if (isError && localStorage.getItem('token')) {
    localStorage.removeItem('token');
    dispatch(clearLoginState());
  }

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
              src={data.user.image || 'https://static.productionready.io/images/smiley-cyrus.jpg'}
              alt='User avatar'
              className={styles.avatar}
            />
          </Link>
          <button type='submit' className={styles.logout} onClick={handleLogout}>
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