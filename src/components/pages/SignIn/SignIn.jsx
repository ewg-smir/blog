import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoginUserMutation } from '../../../store/authApi';
import { useSelector, useDispatch } from 'react-redux';
import styles from './SignIn.module.scss';
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
  const [loginUser, { isError }] = useLoginUserMutation();
  const { loading, error, user } = useSelector((state) => state.register);
  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch, setError, } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const result = await loginUser({
        email: data.email,
        password: data.password,
      }).unwrap();
      console.log(result);
      const token = result.user.token;
      localStorage.setItem('token', token);
      setSuccessMessage(true);
      navigate('/');
    } catch (err) {
      if (err?.data?.errors) {
        const errors = result.error?.data?.errors;
        Object.entries(errors).forEach(([field, messages]) => {
          setError(field, {
            type: 'server',
            message: Array.isArray(messages) ? messages[0] : messages,
          });
        });
      }
      else {
        console.error('Login failed', err);
      }
      setSuccessMessage(false);
    }
  };

  useEffect(() => {
    if (isError) {
      setSuccessMessage(false);
    }
  }, [isError]);

  return (
    <div className={styles.signIn}>
      <div className={styles.title}>Sign In</div>
      <form onSubmit={handleSubmit(onSubmit)} >
        <div className={styles.field}>
          <label htmlFor="Email">Email address</label>
          <input
            {...register('email', { required: 'Email is required', pattern: { value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, message: 'Invalid email format' } })}
            type="email" placeholder='Email address' className={`${styles.input} ${errors.email ? styles.errorInput : ''}`} />
          {errors.email && <div className={styles.errorMessage}>{errors.email.message}</div>}
        </div>
        <div className={styles.field}>
          <label htmlFor="Password">Password</label>
          <input
            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
            type="password"
            placeholder="Password"
            className={`${styles.input} ${errors.password ? styles.errorInput : ''}`}
          />
          {errors.password && <div className={styles.errorMessage}>{errors.password.message}</div>}
        </div>
        {successMessage && <div className={styles.success}>Login successful!</div>}
        <button className={styles.button} disabled={loading}>{loading ? 'Login...' : 'Login'}</button>
      </form>
      <div className={styles.signUp}>Don’t have an account? <Link to='/sign-up'> Sign Up.</Link></div>
    </div>
  )
}

export default SignIn;