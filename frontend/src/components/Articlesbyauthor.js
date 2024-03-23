import React from 'react';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';
import axios from 'axios';

function Articlesbyauthor() {
  const [articleList, setArticleList] = useState([]);
  const navigate = useNavigate();
  const { currentUser } = useSelector(state => state.userLogin);

  const token = sessionStorage.getItem('token');
  const axiosWithToken = axios.create({
    headers: { Authorization: `Bearer ${token}` }
  });

  const getArticlesOfCurrentAuthor = async () => {
    try {
      const res = await axiosWithToken.get(`http://localhost:4000/author-api/articles/${currentUser.username}`);
      if (res.data.message === 'YOUR ARTICLES ARE') {
        setArticleList(res.data.payload);
      } else {
        console.error('Error fetching articles:', res.data.message);
      }
    } catch (error) {
      console.error('Error fetching articles:', error);
    }
  };

  const readArticleById = (article) => {
    navigate(`../article/${article.articleId}`,{state:article});
  };

  useEffect(() => {
    getArticlesOfCurrentAuthor();
  }, []);

  return (
    <div>
      {
        
      articleList.length === 0 ? (
        <h2 className='text-danger'>No articles found</h2>
      ) : (
        <div className='row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 mt-5'>
          {articleList.map((article) => (
            <div className='col' key={article.articleId}>
              <div className='card card-body h-100'>
                <h5 className='card-title'>{article.title}</h5>
                <p className='card-text'>{article.content.substr(0, 150) + "..."}</p>
                <button className='btn btn-info' onClick={() => readArticleById(article)}>Read more</button>
              </div>
              <div className='card-footer'>
                <small>Last Modified: {article.dateOfModification}</small>
              </div>
            </div>
          ))}
        </div>
      )}

      <Outlet />
    </div>
  );
}

export default Articlesbyauthor;
