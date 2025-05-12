import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({ baseUrl: 'https://blog-platform.kata.academy/api/' }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    loginUser: builder.mutation({
      query: (userData) => ({
        url: 'users/login',
        method: 'POST',
        body: { user: { email: userData.email, password: userData.password } },
      }),
      invalidatesTags: ['User'],
    }),
    getCurrentLoginUser: builder.query({
      query: () => {
        const token = localStorage.getItem('token');
        return {
          url: 'user',
          method: 'GET',
          headers: token ? { Authorization: `Token ${token}` } : {},
        };
      },
      providesTags: ['User'],
    }),
  }),
});

export const { useLoginUserMutation, useGetCurrentLoginUserQuery } = authApi;
