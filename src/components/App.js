import React from 'react';
import './App.css';
import SearchStories from './SearchStories';
import Stories from './Stories';
import ErrorToast from './ErrorToast';
import ErrorBoundary from './ErrorBoundry';

const App = () => (
  <ErrorBoundary>
    <div className="app">
      <ErrorToast></ErrorToast>
      <div className="interactions">
        <SearchStories />
      </div>
      <Stories />
    </div>
  </ErrorBoundary>
);

export default App;
