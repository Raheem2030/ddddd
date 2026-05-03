import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { WelcomePage } from './pages/WelcomePage';
import { SelectionPage } from './pages/SelectionPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { SubjectDashboard } from './pages/SubjectDashboard';
import { ChapterPage } from './pages/ChapterPage';
import { BiochemSimulatorPage } from './pages/BiochemSimulatorPage';

import { BiochemUnknownLabPage } from './pages/BiochemUnknownLabPage';

export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<WelcomePage />} />
          <Route path="select" element={<SelectionPage />} />
          <Route path="subjects" element={<SubjectsPage />} />
          <Route path="subject/:id" element={<SubjectDashboard />} />
          <Route path="subject/:id/chapter/:chapterId" element={<ChapterPage />} />
          <Route path="simulator/biochem-tests" element={<BiochemSimulatorPage />} />
          <Route path="simulator/biochem-unknown" element={<BiochemUnknownLabPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </HashRouter>
  );
}
