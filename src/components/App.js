import React from 'react';
import './App.css';
import SearchStories from './SearchStories';
import Stories from './Stories';
import Error from './Error';

const App = () => (
  <div className="app">
    <Error></Error>
    <div className="interactions">
      <SearchStories />
    </div>
    <Stories />
  </div>
);

export default App;
