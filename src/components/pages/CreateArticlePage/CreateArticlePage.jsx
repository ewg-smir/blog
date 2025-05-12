import React from 'react';
import { useCreateArticleMutation } from '../../../store/articlesApi';
import styles from './CreateArticlePage.module.scss';
import { useForm, useFieldArray } from 'react-hook-form';
import { useNavigate } from "react-router-dom";

function CreateArticlePage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    watch,
    setValue,
    resetField
  } = useForm({
    defaultValues: {
      tags: [],
      newTag: '' 
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tags"
  });

  const [createArticle, { isLoading, isSuccess, error }] = useCreateArticleMutation();

  const onSubmit = async (articleData) => {
    const tagList = articleData.tags.map(tag => tag.name).filter(name => name.trim());
    const payload = {
      title: articleData.title,
      description: articleData.description,
      body: articleData.body,
      tagList
    };
    try {
      await createArticle(payload).unwrap();
      navigate('/');
    }
    catch (err) {
      console.error('Error creating article:', err);
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

  return (
    <div className={styles.newArticle}>
      <div className={styles.title}>Create new article</div>
      <form onSubmit={handleSubmit(onSubmit)} >
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
        <button className={styles.button}> {isLoading ? 'Sending...' : 'Send'}</button>
      </form>
    </div >
  )
}

export default CreateArticlePage;