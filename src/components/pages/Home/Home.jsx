import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import styles from './Home.module.scss';
import { useFetchArticlesQuery } from '../../../store/articlesApi';
import Article from '../../Article/Article';
import { Pagination, Spin } from "antd";

function Home() {
  const [page, setPage] = useState(1);
  const { data, error, isLoading, isSuccess } = useFetchArticlesQuery(page);

  const dispatch = useDispatch();

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
    />
  ))

  console.log({ data })
  return (
    <div className={styles.list}>
      {
        error ? (<div>
          <h2>Произошла ошибка при загрузке статей 😢</h2>
        </div>) : articles}
      {isLoading && <Spin className={styles.spin} size='large' />}
      {isSuccess && <Pagination className={styles.pagination} align="center" onChange={(page) => dispatch(setPage(page))}
        showSizeChanger={false} current={page} total={data?.articlesCount || 0} pageSize={5} />}
    </div>
  )
}

export default Home;
