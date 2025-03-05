import { createBrowserRouter } from 'react-router-dom';
import Layout from '../components/Layout';
import JsonBuilder from '../components/JsonBuilder';
import PageBuilder from '../components/builders/PageBuilder';
import TemplateBuilder from '../components/builders/TemplateBuilder';
import OrganismBuilder from '../components/builders/OrganismBuilder';
import MoleculeBuilder from '../components/builders/MoleculeBuilder';
import AtomBuilder from '../components/builders/AtomBuilder';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      {
        path: '/',
        element: <JsonBuilder defaultSection="pages" />,
      },
      {
        path: '/pages',
        children: [
          {
            path: '',
            element: <JsonBuilder defaultSection="pages" />,
          },
          {
            path: 'new',
            element: <PageBuilder />,
          },
          {
            path: ':pageId',
            element: <PageBuilder />,
          },
        ],
      },
      {
        path: '/templates',
        children: [
          {
            path: '',
            element: <JsonBuilder defaultSection="templates" />,
          },
          {
            path: 'new',
            element: <TemplateBuilder />,
          },
          {
            path: ':templateId',
            element: <TemplateBuilder />,
          },
        ],
      },
      {
        path: '/organisms',
        children: [
          {
            path: '',
            element: <JsonBuilder defaultSection="organisms" />,
          },
          {
            path: 'new',
            element: <OrganismBuilder />,
          },
          {
            path: ':organismId',
            element: <OrganismBuilder />,
          },
        ],
      },
      {
        path: '/molecules',
        children: [
          {
            path: '',
            element: <JsonBuilder defaultSection="molecules" />,
          },
          {
            path: 'new',
            element: <MoleculeBuilder />,
          },
          {
            path: ':moleculeId',
            element: <MoleculeBuilder />,
          },
        ],
      },
      {
        path: '/atoms',
        children: [
          {
            path: '',
            element: <JsonBuilder defaultSection="atoms" />,
          },
          {
            path: 'new',
            element: <AtomBuilder />,
          },
          {
            path: ':atomId',
            element: <AtomBuilder />,
          },
        ],
      },
    ],
  },
]); 