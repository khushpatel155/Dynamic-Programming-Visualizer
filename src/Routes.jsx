import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
// Add your imports here
import AlgorithmVisualizationDashboard from "pages/algorithm-visualization-dashboard";
import ProblemSelectionDashboard from "pages/problem-selection-dashboard";
import HouseRobberVisualizationDashboard from "pages/house-robber-visualization-dashboard";
import FrogJumpVisualizationDashboard from "pages/frog-jump-visualization-dashboard";
import NotFound from "pages/NotFound";

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your routes here */}
        <Route path="/" element={<ProblemSelectionDashboard />} />
        <Route path="/problem-selection-dashboard" element={<ProblemSelectionDashboard />} />
        <Route path="/algorithm-visualization-dashboard" element={<AlgorithmVisualizationDashboard />} />
        <Route path="/house-robber-visualization-dashboard" element={<HouseRobberVisualizationDashboard />} />
        <Route path="/frog-jump-visualization-dashboard" element={<FrogJumpVisualizationDashboard />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;