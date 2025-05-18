import React from 'react';
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './ArticlePage.module.scss';
import { useDeleteArticleMutation, useGetArticleQuery, useFavoriteArticleMutation, useUnfavoriteArticleMutation } from '../../../store/articlesApi';
import _ from 'lodash';
import { format } from "date-fns";
import { enGB } from 'date-fns/locale/en-GB';
import { HeartOutlined, HeartFilled, ExclamationCircleOutlined } from '@ant-design/icons';
import { Tag, Modal } from "antd";

function ArticlePage() {
  const currentUser = useSelector((state) => state.auth.user);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const { slug } = useParams();
  const { data, isLoading, isError } = useGetArticleQuery(slug);
  const [deleteArticle, { isLoading: isDeleting }] = useDeleteArticleMutation();
  const navigate = useNavigate();
  const [favoriteArticle, { isLoading: isLiking }] = useFavoriteArticleMutation();
  const [unfavoriteArticle, { isLoading: isUnliking }] = useUnfavoriteArticleMutation();
  const [searchParams] = useSearchParams();
  const currentPage = parseInt(searchParams.get('page')) || 1;

  const isFavoriting = isLiking || isUnliking;

  if (isLoading) return <div className={styles.loading}>Загрузка...</div>;
  if (isError || !data?.article) {
    return (
      <div className={styles.notFound}>
        <h2>Статья не найдена или произошла ошибка</h2>
        <button onClick={() => navigate('/')}>Вернуться на главную</button>
      </div>
    );
  }

  const article = data.article;

  const handleClickLike = async () => {
    try {
      if (!article.favorited) {
        await favoriteArticle(slug).unwrap();
      } else {
        await unfavoriteArticle(slug).unwrap();
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: 'Are you sure you want to delete this article?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteArticle(slug).unwrap();
          alert('Article deleted');
          navigate(`/?page=${currentPage}`);
        } catch (err) {
          console.error('Delete failed:', err);
        }
      },
    });
  };

  let result = '';
  if (article.createdAt !== "") {
    result = format(new Date(article.createdAt), 'MMMM d, yyyy', { locale: enGB });
  }
  else {
    result = null;
  }

  return (
    <div className={styles.article}>
      <div className={styles.header}>
        <div>
          <div className={styles.name}>
            <span className={styles.title}>{article.title}</span>
            {isAuthenticated ?
              (<div onClick={isFavoriting ? null : handleClickLike}
                style={{
                  cursor: isFavoriting ? 'not-allowed' : 'pointer',
                  marginRight: '3px',
                  opacity: isFavoriting ? 0.5 : 1,
                }}>
                {article.favorited ? <HeartFilled /> : <HeartOutlined />}
                {article.favoritesCount}
              </div>) : ('')}
          </div>
          {article.tagList.map((tag, index) => <Tag key={index}>{tag}</Tag>)}
        </div>
        <div className={styles.autor}>
          <div>
            <div className={styles.name}>{article.author.username}</div>
            <div className={styles.date}>{result}</div>
          </div>
          <div className={styles.img}>
            <img
              src={article.author.image}
              alt="avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://static.productionready.io/images/smiley-cyrus.jpg';
              }}
            />
          </div>
        </div>
      </div>
      <div className={styles.main}>
        {currentUser?.username === article.author.username && (
          <div className={styles.buttonGroup}>
            <button className={styles.delete} onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete Article'}
            </button>
            <button className={styles.edit}>
              <Link to={`/articles/${slug}/edit`}>Edit</Link>
            </button>
          </div>
        )}
        <ReactMarkdown>{article.body}</ReactMarkdown>
      </div>
    </div >
  )
}

export default ArticlePage;