import React from 'react';
import './App.css';
import SearchStories from './SearchStories';
import Stories from './Stories';
import ErrorToast from './ErrorToast';
import ErrorBoundary from './ErrorBoundry';

const App = () => (
  <div className="app">
    <ErrorBoundary>
      <ErrorToast></ErrorToast>
      <div className="interactions">
        <SearchStories />
      </div>
      <Stories />
    </ErrorBoundary>
  </div>
);

export default App;
