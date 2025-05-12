import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLoginUserMutation } from '../../../store/authApi';
import styles from './SignIn.module.scss';
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
  const [loginUser, { isLoading, isError, error, isSuccess }] = useLoginUserMutation();
  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm();

  const password = watch('password');

  const onSubmit = async (data) => {
    try {
      const result = await loginUser({
        email: data.email,
        password: data.password,
      }).unwrap();
      const token = result.user.token;
      localStorage.setItem('token', token);
      setSuccessMessage(true);
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  useEffect(() => {
    if (isError) {
      setSuccessMessage(false);
    }
  }, [error]);

  return (
    <div className={styles.signIn}>
      <div className={styles.title}>Sign In</div>
      <form onSubmit={handleSubmit(onSubmit)} >
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
        {error && (
          <div className={styles.error}>
            {typeof error?.data === 'object' && error.data.errors
              ? Object.entries(error.data.errors).map(([key, messages], index) => (
                <div key={index}>
                  {key} {Array.isArray(messages) ? messages.join(', ') : messages}
                </div>
              ))
              : <div>An unexpected error occurred</div>}
          </div>
        )}

        {successMessage && <div className={styles.success}>Login successful!</div>}
        <button className={styles.button}>Login</button>
      </form>
      <div className={styles.signUp}>Don’t have an account? <Link to='/sign-up'> Sign Up.</Link></div>
    </div>
  )
}

export default SignIn;