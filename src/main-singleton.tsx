import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import Singleton from './Singleton';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Singleton />
  </StrictMode>,
);
