import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoginUserMutation } from '../../../store/authApi';
import styles from './SignIn.module.scss';
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
  const [loginUser, { isLoading, isError }] = useLoginUserMutation();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, watch, setError, } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const result = await loginUser({
        email: data.email,
        password: data.password,
      }).unwrap();
      const token = result.user.token;
      localStorage.setItem('token', token);
      navigate('/');
    } catch (err) {
      console.error('Login failed:', err);

      if (err?.data?.errors) {
        const errors = err.data.errors;
        Object.entries(errors).forEach(([field, messages]) => {
          const message = Array.isArray(messages) ? messages[0] : messages;

          if (field === 'email or password') {
            setError('email', { type: 'server', message });
            setError('password', { type: 'server', message });
          } else {
            setError(field, { type: 'server', message });
          }
        });
      } else {
        setError('email', { type: 'server', message: 'Unexpected login error' });
      }
    }
  };

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
        <button className={styles.button} disabled={isLoading}>{isLoading ? 'Login...' : 'Login'}</button>
      </form>
      <div className={styles.signUp}>Don’t have an account? <Link to='/sign-up'> Sign Up.</Link></div>
    </div>
  )
}

export default SignIn;