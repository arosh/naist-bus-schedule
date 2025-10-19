import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './containers/App';
import './assets/css/theme.css';

const pageTitle =
  typeof document !== 'undefined' && document.title
    ? document.title
    : 'NAIST Bus Schedule';

const rootElement =
  typeof document !== 'undefined'
    ? document.getElementById('react-root')
    : null;

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <App pageTitle={pageTitle} />
    </StrictMode>
  );
}
