import React from 'react';
import './App.css';
import SearchStories from './SearchStories';
import Stories from './Stories';
import Error from './Error';
import ErrorBoundary from './ErrorBoundry';

const App = () => (
  <div className="app">
    <Error></Error>
    <ErrorBoundary>
      <div className="interactions">
        <SearchStories />
      </div>
      <Stories />
    </ErrorBoundary>
  </div>
);

export default App;
