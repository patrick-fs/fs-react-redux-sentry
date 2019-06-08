import React, { useRef, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button } from './Button';
import { doFetchStoriesAsync } from '../actions/story';
import { doLoadQuery, doSaveQuery } from '../actions/query';

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
    onSaveQuery(q); //this triggers the fetch in useEffect
    e.preventDefault();
  };

  // NOTE: I like Florida, just being cheeky
  const verboten = 'Florida'
  if (query && query.toLowerCase().indexOf(verboten.toLowerCase()) > -1) {
    throw Error(`You may not read news about ${verboten}`);
  }

  return (
    <form onSubmit={onSubmit}>
      <span>Search Hacker News</span>
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

const mapStateToProps = ({ queryState }) => ({
  query: queryState,
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