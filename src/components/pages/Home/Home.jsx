import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import styles from './Home.module.scss';
import { useFetchArticlesQuery } from '../../../store/articlesApi';
import Article from '../../Article/Article';
import { Pagination, Spin } from "antd";

function Home() {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page')) || 1;

  const { data, error, isLoading, isSuccess } = useFetchArticlesQuery(currentPage);

  const handlePageChange = (page) => {
    setSearchParams({ page: page.toString() });
  };

  const articles = data?.articles?.map((obj) => (
    <Article
      key={obj.slug}
      slug={obj.slug}
      following={obj.author.following}
      image={obj.author.image}
      username={obj.author.username}
      main={obj.body}
      date={obj.createdAt}
      title={obj.title}
      favorited={obj.favorited}
      favoritesCount={obj.favoritesCount}
      tagList={obj.tagList}
      updatedAt={obj.updatedAt}
      currentPage={currentPage}
    />
  ))

  return (
    <div className={styles.list}>
      {
        error ? (<div>
          <h2>Произошла ошибка при загрузке статей 😢</h2>
        </div>) : articles}
      {isLoading && <Spin className={styles.spin} size='large' />}
      {isSuccess && <Pagination className={styles.pagination} align="center" onChange={handlePageChange}
        showSizeChanger={false} current={currentPage} total={data?.articlesCount || 0} pageSize={5} />}
    </div>
  )
}

export default Home;
