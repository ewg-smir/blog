import { createSlice } from '@reduxjs/toolkit';
import { articlesApi } from './articlesApi';

const initialState = {
  items: [],
  status: null,
  page: 1,
  stop: false,
  liked: {},
};

const articlesSlice = createSlice({
  name: 'articles',
  initialState,
  reducers: {
    toggleLiked(state, action) {
      const slug = action.payload;
      state.liked[slug] = !state.liked[slug];
    },
  },
  extraReducers: (builder) => {
    builder
      .addMatcher(articlesApi.endpoints.fetchArticles.matchFulfilled, (state, action) => {
        if (action.payload.articles.length < 5) {
          state.stop = true;
        }
        state.items = [...state.items, ...action.payload.articles];
        state.status = 'success';
      })
      .addMatcher(articlesApi.endpoints.fetchArticles.matchPending, (state) => {
        state.status = 'loading';
      })
      .addMatcher(articlesApi.endpoints.fetchArticles.matchRejected, (state) => {
        state.status = 'error';
      });
  },
});

export const { toggleLiked } = articlesSlice.actions;
export default articlesSlice.reducer;
