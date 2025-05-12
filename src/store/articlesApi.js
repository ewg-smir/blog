import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const articlesApi = createApi({
  reducerPath: 'articlesApi',
  baseQuery: fetchBaseQuery({
    baseUrl: 'https://blog-platform.kata.academy/api/',
    prepareHeaders: (headers, { getState }) => {
      const token = getState()?.auth?.user?.token;
      if (token) {
        headers.set('Authorization', `Token ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Article'],
  endpoints: (builder) => ({
    favoriteArticle: builder.mutation({
      query: (slug) => ({
        url: `articles/${slug}/favorite`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, slug) => [{ type: 'Article', id: slug }],
    }),
    unfavoriteArticle: builder.mutation({
      query: (slug) => ({
        url: `articles/${slug}/favorite`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, slug) => [{ type: 'Article', id: slug }],
    }),
    deleteArticle: builder.mutation({
      query: (slug) => ({
        url: `articles/${slug}`,
        method: 'DELETE',
      }),
      invalidatesTags: [{ type: 'Article', id: 'LIST' }],
    }),
    getArticle: builder.query({
      query: (slug) => `articles/${slug}`,
      providesTags: (result, arg) => {
        return result?.article ? [{ type: 'Article', id: result.article.slug }] : [{ type: 'Article', id: arg }];
      },
    }),

    fetchArticles: builder.query({
      query: (page = 1) => {
        const limit = 5;
        const offset = (page - 1) * limit;
        return `articles?limit=${limit}&offset=${offset}`;
      },
      providesTags: (result) => {
        return result?.articles
          ? [...result.articles.map(({ slug }) => ({ type: 'Article', id: slug })), { type: 'Article', id: 'LIST' }]
          : [{ type: 'Article', id: 'LIST' }];
      },
    }),
    createArticle: builder.mutation({
      query: (articleData) => {
        const { title, description, body, tagList } = articleData;
        return {
          url: 'articles',
          method: 'POST',
          body: {
            article: { title, description, body, tagList },
          },
        };
      },
      invalidatesTags: ['Article'],
    }),
  }),
});

export const {
  useFetchArticlesQuery,
  useCreateArticleMutation,
  useGetArticleQuery,
  useDeleteArticleMutation,
  useFavoriteArticleMutation,
  useUnfavoriteArticleMutation,
} = articlesApi;
