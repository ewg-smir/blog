import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const editApi = createApi({
  reducerPath: 'editApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://blog-platform.kata.academy/api/',
    prepareHeaders: (headers) => {
      const token = localStorage.getItem('token');
      if (token) {
        headers.set('Authorization', `Token ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Article', 'User'],
  endpoints: (builder) => ({
    editUser: builder.mutation({
      query: (userData) => {
        const { email, username, bio, image, password } = userData;
        if (!email && !username && !bio && !image) {
          throw new Error('At least one field is required for update');
        }

        return {
          url: 'user',
          method: 'PUT',
          body: {
            user: {
              email: email || undefined,
              username: username || undefined,
              bio: bio || '',
              image: image || null,
              password: password || undefined,
            },
          },
        };
      },
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useEditUserMutation } = editApi;
