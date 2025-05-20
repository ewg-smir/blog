import { useEditUserMutation } from '../../../store/editApi';
import styles from './EditPage.module.scss';
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useGetCurrentLoginUserQuery } from '../../../store/authApi';
import { message } from 'antd';
import { setUser } from '../../../store/authSlice';

function EditPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { refetch } = useGetCurrentLoginUserQuery();

  const { register, handleSubmit, formState: { errors }, setError } = useForm();
  const [editUser, { isLoading, isSuccess, error }] = useEditUserMutation();

  const onSubmit = async (formData) => {
    const userData = {
      ...formData,
      image: formData.avatar,
    };
    delete userData.avatar;
    try {
      const result = await editUser(userData).unwrap();
      if (result.user?.token) {
        localStorage.setItem('token', result.user.token);
        dispatch(setUser({ token: result.user.token }));
      } else {
        await refetch();
      }

      navigate('/');
      message.success('Profile updated successfully!');
    }
    catch (e) {
      if (e?.data?.errors) {
        const errors = e.data.errors;
        Object.entries(errors).forEach(([field, messages]) => {
          setError(field, {
            type: 'server',
            message: Array.isArray(messages) ? messages[0] : messages,
          });
        });
      }
      message.error('Something went wrong');
      console.error('Error updating article:', e);
    }
  };

  return (
    <div className={styles.edit}>
      <div className={styles.title}>Edit Profile</div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.field}>
          <label htmlFor="Username">Username</label>
          <input
            {...register('username', { required: 'Username is required', minLength: { value: 3, message: 'Username must be at least 3 characters' }, maxLength: { value: 20, message: 'Username cannot exceed 20 characters' } })}
            type="text" placeholder='Username' className={`${styles.input} ${errors.username ? styles.errorInput : ''}`} />
          {errors.username && <div className={styles.errorMessage}>{errors.username.message}</div>}
        </div>
        <div className={styles.field}>
          <label htmlFor="Email">Email address</label>
          <input
            {...register('email', { required: 'Email is required', pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Invalid email format' } })}
            type="email" placeholder='Email address' className={`${styles.input} ${errors.email ? styles.errorInput : ''}`} />
          {errors.email && <div className={styles.errorMessage}>{errors.email.message}</div>}
        </div>
        <div className={styles.field}>
          <label htmlFor="Password">New password</label>
          <input
            {...register('password', { minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
            type="password"
            placeholder="New password"
            className={`${styles.input} ${errors.password ? styles.errorInput : ''}`}
          />
          {errors.password && <div className={styles.errorMessage}>{errors.password.message}</div>}
        </div>
        <div className={styles.field}>
          <label htmlFor="avatar">Avatar image (url)</label>
          <input
            {...register('avatar', {
              pattern: {
                value: /^(https?|ftp):\/\/([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[\w\-\.]+)*\/?(\?[a-zA-Z0-9&=_\-]*)?(#[\w\-]*)?\.(jpg|jpeg|png|gif)$/i,
                message: 'Please enter a valid image URL (jpg, jpeg, png, gif)'
              }
            })}
            type="url"
            placeholder="Avatar image"
            className={`${styles.input} ${errors.avatar ? styles.errorInput : ''}`}
          />
          {errors.avatar && <div className={styles.errorMessage}>{errors.avatar.message}</div>}
        </div>
        {isSuccess && <div className={styles.success}>Editing successful!</div>}
        <button className={styles.button} disabled={isLoading}> {isLoading ? 'Saving...' : 'Save'}</button>
      </form>
    </div >
  )
}

export default EditPage;