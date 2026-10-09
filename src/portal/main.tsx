import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './styles.css';
import { Shell } from './Shell';
import { Overview } from './pages/Overview';
import { Catalog } from './pages/Catalog';
import { ComponentPage } from './pages/ComponentPage';
import { FoundationPage } from './pages/Foundations';
import { NotFound } from './pages/NotFound';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<Overview />} />
          <Route path="foundations/:slug" element={<FoundationPage />} />
          <Route path="components" element={<Catalog />} />
          <Route path="components/:slug" element={<ComponentPage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
