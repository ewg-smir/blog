import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useEditArticleMutation } from '../../../store/editApi';
import { useGetArticleQuery } from '../../../store/articlesApi';
import styles from './EditArticlePage.module.scss';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate, useParams } from "react-router-dom";

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

  const [editArticle, { isLoading, isSuccess, error }] = useEditArticleMutation();

  useEffect(() => {
    if (isSuccess) {
      navigate(`/articles/${slug}`);
      window.location.reload();
    }
  }, [isSuccess, slug, navigate]);

  useEffect(() => {
    if (data?.article) {
      console.log({ data })
      reset({
        title: data.article.title,
        description: data.article.description,
        body: data.article.body,
        tags: data.article.tagList.map(tag => ({ name: tag }))
      });
    }
  }, [data, reset]);


  const onSubmit = async (formData) => {
    try {
      await editArticle({
        slug,
        title: formData.title,
        description: formData.description,
        body: formData.body,
        tagList: formData.tags.map(tag => tag.name)
      }).unwrap();
    } catch (err) {
      console.error('Update failed:', err);
    }
  };


  const handleAddTag = () => {
    const newTag = watch("newTag");
    if (newTag?.trim()) {
      append({ name: newTag.trim() });
      resetField("newTag");
    }
  };


  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  if (isArticleLoading) {
    return <div className={styles.loading}>Loading article...</div>;
  }

  if (articleError) {
    return <div className={styles.error}>Failed to load article. Try again later.</div>;
  }


  return (
    <div className={styles.newArticle}>
      <div className={styles.title}>Edit article</div>
      <form key={slug} onSubmit={handleSubmit(onSubmit)} >
        <div className={styles.field}>
          <label htmlFor="Title">Title</label>
          <input
            {...register('title', { required: 'Title is required', minLength: { value: 3, message: 'Title must be at least 3 characters' }, maxLength: { value: 50, message: 'Title cannot exceed 50 characters' } })}
            type="text" placeholder='Title' id="Title" />
          {errors.title && <div className={styles.errorMessage}>{errors.title.message}</div>}
        </div>
        <div className={styles.field}>
          <label htmlFor="Description">Short description</label>
          <input
            {...register('description', { required: 'Description is required', minLength: { value: 3, message: 'Description must be at least 3 characters' }, maxLength: { value: 50, message: 'Description cannot exceed 50 characters' } })}
            type="text" placeholder='Short description' />
          {errors.description && <div className={styles.errorMessage}>{errors.description.message}</div>}
        </div>
        <div className={styles.fieldText}>
          <label htmlFor="body">Text</label>
          <textarea
            id="body"
            {...register('body', { required: 'Text is required', minLength: { value: 3, message: 'Text must be at least 3 characters' } })}
            type="text"
            placeholder="Text"
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
        {error?.data?.errors && typeof error.data.errors === 'object' && (
          <div className={styles.error}>
            {Object.entries(error.data.errors).map(([field, messages], idx) =>
              Array.isArray(messages)
                ? messages.map((msg, i) => (
                  <div key={`${idx}-${i}`}>{`${field} ${msg}`}</div>
                ))
                : <div key={idx}>{`${field} ${messages}`}</div>
            )}
          </div>
        )}
        {isSuccess && <div className={styles.success}>Creating successful!</div>}
        <button className={styles.button} disabled={isLoading}> {isLoading ? 'Sending...' : 'Send'}</button>
      </form>
    </div >
  )
}

export default EditArticlePage;