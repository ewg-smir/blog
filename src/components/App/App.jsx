import React from 'react';
import styles from './App.module.scss';
import Header from '../Header/Header';
import Home from '../pages/Home/Home';
import ArticlePage from '../pages/ArticlePage/ArticlePage';
import SignUp from '../pages/SignUp/SignUp';
import SignIn from '../pages/SignIn/SignIn';
import EditPage from '../pages/EditPage/EditPage';
import CreateArticlePage from '../pages/CreateArticlePage/CreateArticlePage';
import EditArticlePage from '../pages/EditArticlePage/EditArticlePage';
import { Routes, Route } from "react-router-dom";
import PrivateRoute from '../pages/PrivateRoute';

function App() {

  return (
    <div className={styles.App}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/articles" element={<Home />} />
        <Route path="/articles/:slug" element={<ArticlePage />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/profile" element={<PrivateRoute><EditPage /></PrivateRoute>} />
        <Route path="/new-article" element={<PrivateRoute><CreateArticlePage /></PrivateRoute>} />
        <Route path="/articles/:slug/edit" element={<PrivateRoute><EditArticlePage /></PrivateRoute>} />
      </Routes>
    </div>
  )
}

export default App;
