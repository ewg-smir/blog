import React from 'react';
import { useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import { useRegisterUserMutation } from '../../../store/registerApi';
import { clearRegisterState } from '../../../store/registerSlice';
import styles from './SignUp.module.scss';
import { Link, useNavigate } from "react-router-dom";

function SignUp() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.register);
  const [registerUser] = useRegisterUserMutation();

  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    if (data.password !== data.repeat) return;
    try {
      const result = await registerUser({
        username: data.username,
        email: data.email,
        password: data.password,
      }).unwrap();
      if (result.user) {
        const token = result.token;
        localStorage.setItem('token', token);
        dispatch(clearRegisterState());
        navigate('/');
      }
    }
    catch (err) {
      console.error("Register failed", err);
    }
  };

  return (
    <div className={styles.signUp}>
      <div className={styles.title}>Create new account</div>
      <form onSubmit={handleSubmit(onSubmit)} >
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
          <label htmlFor="Password">Password</label>
          <input
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
            type="password"
            placeholder="Password"
          />
          {errors.password && <div className={styles.errorMessage}>{errors.password.message}</div>}
        </div>
        <div className={styles.field}>
          <label htmlFor="Repeat">Repeat Password</label>
          <input
            {...register('repeat', {
              required: 'Repeat password is required',
              validate: value => value === password || 'Passwords do not match'
            })}
            type="password"
            placeholder="Repeat Password"
          />
          {errors.repeat && <div className={styles.errorMessage}>{errors.repeat.message}</div>}
        </div>
        <div className={styles.chek}>
          <label htmlFor='agree'>
            <input
              {...register('agree', { required: 'You must agree to the terms' })}
              type="checkbox"
            />
            <span>I agree to the processing of my personal information</span>
          </label>
          {errors.agree && <div className={styles.errorMessage}>{errors.agree.message}</div>}
        </div>
        {error && (
          <div className={styles.error}>
            {Array.isArray(error)
              ? error.map((msg, i) => <div key={i}>{msg}</div>)
              : <div>{error}</div>}
          </div>
        )}
        {user && <div className={styles.success}>Registration successful!</div>}
        <button className={styles.button}> {loading ? 'Creating...' : 'Create'}</button>
      </form>
      <div className={styles.signIn}>Already have an account? <Link to='/sign-in'>Sign In.</Link></div>
    </div >
  )
}

export default SignUp;