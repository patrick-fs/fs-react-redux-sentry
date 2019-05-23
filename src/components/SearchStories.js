import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button } from './Button';
import { doFetchStoriesAsync } from '../actions/story';
import { doLoadQuery, doSaveQuery } from '../actions/localStorage';

const SearchStories = ({ onFetchStories, onLoadQuery, onSaveQuery, query }) => {
  useEffect(() => {
    onLoadQuery();
  });

  useEffect(() => {
    if (query && query !== '') {
      onFetchStories(query);
    }
  }, [query]);
  
  const inputEl = useRef(null);
  const onSubmit = e => {
    const q = inputEl.current.value;
    onSaveQuery(q); //this trigger the fetch in useEffect
    e.preventDefault();
  };

  return (
    <form onSubmit={onSubmit}>
      <input
          type="text"
          ref={inputEl}
          defaultValue={query}
        />
      <Button type="submit">
        Search
      </Button>
    </form>
  );
}

const mapStateToProps = ({ localStorageState }) => ({
  query: localStorageState,
});

const mapDispatchToProps = dispatch => ({
  onFetchStories: query => dispatch(doFetchStoriesAsync(query)),
  onLoadQuery: () => dispatch(doLoadQuery()),
  onSaveQuery: query => dispatch(doSaveQuery(query)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SearchStories);