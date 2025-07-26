import React from 'react';
import { createRoot } from 'react-dom/client';
import AnimateSvg from './components/AnimateSvg';

const shape1Container = document.getElementById('shape-1');
if (shape1Container) {
  const root = createRoot(shape1Container);
  const path1 = "M10 0 L20 10 L10 20 L0 10 Z"; // Diamond shape
  root.render(
    <React.StrictMode>
      <AnimateSvg path={path1} viewBox="0 0 20 20" width="0.6em" height="0.6em" fill="url(#gradient1)" initialAnimation={false} />
    </React.StrictMode>
  );
}

const shape2Container = document.getElementById('shape-2');
if (shape2Container) {
  const root = createRoot(shape2Container);
  const path2 = "M0 0 L20 0 L10 20 Z"; // Downward arrow
  root.render(
    <React.StrictMode>
      <AnimateSvg path={path2} viewBox="0 0 20 20" width="2em" height="2em" fill="url(#gradient2)" initialAnimation={false} />
    </React.StrictMode>
  );
} 