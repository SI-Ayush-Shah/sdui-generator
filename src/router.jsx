import React from 'react';
import { createBrowserRouter } from 'react-router-dom';
import JsonBuilder from './components/JsonBuilder';
import AppLayout from './components/layouts/AppLayout';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <JsonBuilder />,
      },
      {
        path: '/pages/:pageId',
        element: <JsonBuilder defaultSection="pages" />,
      },
      {
        path: '/templates/:templateId',
        element: <JsonBuilder defaultSection="templates" />,
      },
      {
        path: '/organisms/:organismId',
        element: <JsonBuilder defaultSection="organisms" />,
      },
      {
        path: '/molecules/:moleculeId',
        element: <JsonBuilder defaultSection="molecules" />,
      },
      {
        path: '/atoms/:atomId',
        element: <JsonBuilder defaultSection="atoms" />,
      },
    ],
  },
]); 