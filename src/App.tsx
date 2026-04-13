import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { WelcomePage } from './pages/WelcomePage';
import { SelectionPage } from './pages/SelectionPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { SubjectDashboard } from './pages/SubjectDashboard';
import { ChapterPage } from './pages/ChapterPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<WelcomePage />} />
          <Route path="select" element={<SelectionPage />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="subject/:id" element={<SubjectDashboard />} />
          <Route path="subject/:id/chapter/:chapterId" element={<ChapterPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
