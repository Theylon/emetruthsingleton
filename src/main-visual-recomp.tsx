import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import AppVisualRecomp from './AppVisualRecomp.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppVisualRecomp />
  </StrictMode>,
);
