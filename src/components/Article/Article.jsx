import { Link } from "react-router-dom";
import styles from './Article.module.scss';
import _ from 'lodash';
import { useFavoriteArticleMutation, useUnfavoriteArticleMutation } from '../../store/articlesApi';
import { format } from "date-fns";
import { enGB } from 'date-fns/locale/en-GB';
import { HeartOutlined, HeartFilled } from '@ant-design/icons';
import { Tag } from "antd";

function Article({ image, username, main, title, tagList, date, slug, favoritesCount, favorited, currentPage }) {
  const token = localStorage.getItem('token');
  const isAuthenticated = Boolean(token);
  const [favoriteArticle, { isLoading: isLiking }] = useFavoriteArticleMutation();
  const [unfavoriteArticle, { isLoading: isUnliking }] = useUnfavoriteArticleMutation();

  const isFavoriting = isLiking || isUnliking;

  const handleClickLike = async () => {
    try {
      if (!favorited) {
        await favoriteArticle(slug).unwrap();
      } else {
        await unfavoriteArticle(slug).unwrap();
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };

  let result = '';
  if (date !== "") {
    result = format(new Date(date), 'MMMM d, yyyy', { locale: enGB });
  }
  else {
    result = null;
  }

  const truncatedText = _.truncate(main, {
    'length': 50,
    'separator': ',',
    'omission': '...',
  });

  return (
    <div className={styles.article}>
      <div className={styles.header}>
        <div>
          <div className={styles.name}>
            <Link to={`/articles/${slug}?page=${currentPage}`}>{title}</Link>
            {isAuthenticated ?
              (<div onClick={isFavoriting ? null : handleClickLike}
                style={{
                  cursor: isFavoriting ? 'not-allowed' : 'pointer',
                  marginRight: '3px',
                  opacity: isFavoriting ? 0.5 : 1,
                }}>
                {favorited ? <HeartFilled /> : <HeartOutlined />}
                {favoritesCount}
              </div>) :
              ('')}
          </div>
          {tagList.map((tag, index) => <Tag key={index}>{tag}</Tag>)}
        </div>
        <div className={styles.autor}>
          <div>
            <div className={styles.name}>{username}</div>
            <div className={styles.date}>{result} </div>
          </div>
          <div className={styles.img}>
            <img
              src={image}
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
        {truncatedText}
      </div>
    </div >
  )
}

export default Article;