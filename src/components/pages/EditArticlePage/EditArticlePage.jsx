import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useGetArticleQuery, useEditArticleMutation } from '../../../store/articlesApi';
import styles from './EditArticlePage.module.scss';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from "react-router-dom";
import { message } from 'antd';

function EditArticlePage() {
  const navigate = useNavigate();
  const { slug } = useParams();

  const currentUser = useSelector((state) => state.auth.user);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    resetField,
    reset,
    setError,
  } = useForm({
    defaultValues: {
      tags: [],
      newTag: ''
    }
  });

  const { data, isLoading: isArticleLoading, error: articleError } = useGetArticleQuery(slug);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags"
  });

  const [editArticle, { data: dataArticle, isLoading, isSuccess, error }] = useEditArticleMutation();

  useEffect(() => {
    if (data?.article && !isArticleLoading) {
      reset({
        title: data.article.title,
        description: data.article.description,
        body: data.article.body,
        tags: data.article.tagList.map(tag => ({ name: tag })),
        newTag: ''
      });
    }
  }, [data, reset, isArticleLoading]);

  const onSubmit = async (formData) => {
    try {
      const result = await editArticle({
        slug,
        title: formData.title,
        description: formData.description,
        body: formData.body,
        tagList: formData.tags.map(tag => tag.name),
      }).unwrap();

      message.success('Article updated successfully!');
      navigate(`/articles/${result.article.slug}`);

    } catch (error) {
      if (error.data?.errors) {
        const errors = error.data.errors;
        Object.entries(errors).forEach(([field, messages]) => {
          setError(field, {
            type: 'server',
            message: Array.isArray(messages) ? messages[0] : messages,
          });
        });
      } else {
        message.error('Something went wrong');
        console.error('Edit article error:', error);
      }
    }
  };

  const handleAddTag = () => {
    const newTag = watch("newTag")?.trim();
    if (newTag && !fields.some(tag => tag.name === newTag)) {
      append({ name: newTag });
      resetField("newTag");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  useEffect(() => {
    if (data?.article && currentUser?.username) {
      const author = data?.article?.author?.username;
      if (author !== currentUser?.username) {
        navigate(`/articles/${slug}`, { replace: true });
      }
    }
  }, [data, currentUser, slug, navigate]);

  if (isArticleLoading) {
    return <div className={styles.loading}>Loading article...</div>;
  }

  if (articleError) {
    return <div className={styles.error}>Failed to load article. Try again later.</div>;
  }

  return (
    <div className={styles.newArticle}>
      <div className={styles.title}>Edit article</div>
      <form onSubmit={handleSubmit(onSubmit)} >
        <div className={styles.field}>
          <label htmlFor="Title">Title</label>
          <input
            {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'Title must be at least 3 characters' }, maxLength: { value: 50, message: 'Title cannot exceed 50 characters' } })}
            type="text" placeholder='Title' id="Title" className={`${styles.input} ${errors.title ? styles.errorInput : ''}`} />
          {errors.title && <div className={styles.errorMessage}>{errors.title.message}</div>}
        </div>
        <div className={styles.field}>
          <label htmlFor="Description">Short description</label>
          <input
            {...register('description', { required: 'Description is required', minLength: { value: 3, message: 'Description must be at least 3 characters' }, maxLength: { value: 50, message: 'Description cannot exceed 50 characters' } })}
            type="text" id="Description" placeholder='Short description' className={`${styles.input} ${errors.description ? styles.errorInput : ''}`} />
          {errors.description && <div className={styles.errorMessage}>{errors.description.message}</div>}
        </div>
        <div className={styles.fieldText}>
          <label htmlFor="body">Text</label>
          <textarea
            id="body"
            {...register('body', { required: 'Text is required', minLength: { value: 3, message: 'Text must be at least 3 characters' } })}
            type="text"
            placeholder="Text"
            className={`${styles.input} ${errors.body ? styles.errorInput : ''}`}
          />
          {errors.body && <div className={styles.errorMessage}>{errors.body.message}</div>}
        </div>
        <div className={styles.tagsContainer}>
          <label>Tags</label>
          <div className={styles.tagList}>
            {fields.map((field, index) => (
              <div key={field.id} className={styles.tagItem}>
                <span className={styles.tagLabel}>{field.name}</span>
                <button
                  type="button"
                  className={styles.tagDelete}
                  onClick={() => remove(index)}
                >
                  Delete
                </button>
              </div>
            ))}
            <div className={styles.tagInputWrapper}>
              <input
                {...register('newTag')}
                type="text"
                placeholder="Tag"
                className={styles.tagInput}
                onKeyDown={handleKeyDown}
              />
              <button type="button" onClick={() => setValue("newTag", "")} className={styles.tagDelete}>Delete</button>
              <button type="button" onClick={handleAddTag} className={styles.tagAdd}>Add tag</button>
            </div>
          </div>
        </div>
        {isSuccess && <div className={styles.success}>Article updated successfully!</div>}
        <button className={styles.button} disabled={isLoading}> {isLoading ? 'Sending...' : 'Send'}</button>
      </form>
    </div >
  )
}

export default EditArticlePage;