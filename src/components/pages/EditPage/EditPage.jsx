import { useEditUserMutation } from '../../../store/editApi';
import styles from './EditPage.module.scss';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from "react-router-dom";

function EditPage() {
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [editUser, { isLoading, isSuccess, error }] = useEditUserMutation();

  const onSubmit = async (formData) => {
    const userData = {
      ...formData,
      image: formData.avatar,
    };
    delete userData.avatar;
    try {
      await editUser(userData).unwrap();
      navigate('/');
      alert('Profile updated successfully!');
    }
    catch (err) {
      console.error('Error updating profile:', err);
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
            type="text" placeholder='Username' />
          {errors.username && <div className={styles.errorMessage}>{errors.username.message}</div>}
        </div>
        <div className={styles.field}>
          <label htmlFor="Email">Email address</label>
          <input
            {...register('email', { required: 'Email is required', pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Invalid email format' } })}
            type="email" placeholder='Email address' />
          {errors.email && <div className={styles.errorMessage}>{errors.email.message}</div>}
        </div>
        <div className={styles.field}>
          <label htmlFor="Password">New password</label>
          <input
            {...register('password', { minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
            type="password"
            placeholder="New password"
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
          />
          {errors.avatar && <div className={styles.errorMessage}>{errors.avatar.message}</div>}
        </div>
        {error?.data?.errors && typeof error.data.errors === 'object' && (
          <div className={styles.error}>
            {Object.entries(error.data.errors).map(([field, messages], idx) =>
              Array.isArray(messages)
                ? messages.map((msg, i) => (
                  <div key={`${idx}-${i}`}>{`${field} ${msg}`}</div>
                ))
                : <div key={idx}>{`${field} ${messages}`}</div>
            )}
          </div>
        )}
        {isSuccess && <div className={styles.success}>Editing successful!</div>}
        <button className={styles.button}> {isLoading ? 'Saving...' : 'Save'}</button>
      </form>
    </div >
  )
}

export default EditPage;