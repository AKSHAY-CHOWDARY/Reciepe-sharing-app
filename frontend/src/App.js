import React, { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import RouteLayout from './RouteLayout';
import Home from './components/Home';
import Login from './components/Login';
import Register from './components/Register';
import UserProfile from './components/UserProfile';
import AuthorProfile from './components/AuthorProfile';
import Articlesbyauthor from './components/Articlesbyauthor';
import Article from './components/Article';
import Articles from './components/Articles';
import AdminProfile from './components/AdminProfile';
import UserList from './components/UserList';
import AuthorList from './components/AuthorList';
import ArticlesOfAuthor from './components/ArticlesOfAuthor';
import User from './components/User';
const AddArticles = lazy(() => import('./components/AddArticles'));

function App() {
  let browserRouter = createBrowserRouter([
    {
      path: '',
      element: <RouteLayout />,
      children: [
        {
          path: '',
          element: <Home />,
        },
        {
          path: '/register',
          element: <Register />,
        },
        {
          path: '/login',
          element: <Login />,
        },
        {
          path: '/user-profile',
          element: <UserProfile />,
          children: [
            {
              path: 'articles',
              element: <Articles />,
            },
            {
              path: 'article/:articleId',
              element: <Article />,
            },
            {
              path: '',
              element: <Navigate to="articles" />,
            },
          ],
        },
        {
          path: '/author-profile',
          element: <AuthorProfile />,
          children: [
            {
              path: 'add-articles',
              element: (
                <Suspense fallback={<div>Loading...</div>}>
                  <AddArticles />
                </Suspense>
              ),
            },
            {
              path: 'articles-by-author/:author',
              element: <Articlesbyauthor />,
            },
            {
              path: 'article/:articleId',
              element: <Article />,
            },
            {
              path: '',
              element: <Navigate to="articles-by-author/:author" />,
            },
          ],
        },
        {
          path:'/admin-profile',
          element:<AdminProfile/>,
          children:[
            {
              path:'user-list',
              element:<UserList/>,
            },
            {
              path:'author-list',
              element:<AuthorList/>,
            },
            {
              path:'articles',
              element:<Articles/>,
            },
            {
              path:'article/:articleId',
              element:<Article/>,
            },
            {
              path:'user/:username',
              element:<User/>,
            },
            {
              path: 'articles-of-author/:author',
              element: <ArticlesOfAuthor />,
            },
            {
              path: '',
              element: <Navigate to="author-list" />,
            },
          ],
        },
      ],
    },
  ]);

  return (
    <div>
      <RouterProvider router={browserRouter}></RouterProvider>
    </div>
  );
}

export default App;
