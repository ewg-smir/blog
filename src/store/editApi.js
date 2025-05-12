import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const editApi = createApi({
  reducerPath: 'editApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://blog-platform.kata.academy/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.user.token;
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
      providesTags: ['User'],
    }),
    editArticle: builder.mutation({
      query: ({ slug, title, description, body, tagList }) => ({
        url: `articles/${slug}`,
        method: 'PUT',
        body: {
          article: {
            title,
            description,
            body,
            tagList,
          },
        },
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'Article', id: arg.slug },
        { type: 'Article', id: 'LIST' },
      ],
    }),
  }),
});

export const { useEditUserMutation, useEditArticleMutation } = editApi;
