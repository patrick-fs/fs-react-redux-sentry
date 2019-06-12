import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Button } from './Button';
import { doFetchStoriesAsync } from '../actions/story';
import { doLoadQuery, doSaveQuery } from '../actions/query';
import { createBrowserHistory } from 'history';

const history = createBrowserHistory();

const SearchStories = ({ onFetchStories, onLoadQuery, onSaveQuery, query }) => {
  const [q, setQ] = useState(query);

  useEffect(() => {
    // when page is loaded, get query from data store, set query prop
    onLoadQuery();

    // update the UI when query prop changes
    if (query && query !== '') {
      setQ(query);
      onFetchStories(query);
    }

    // handle browser backwards and forwards navigation
    const unListen = history.listen(() => {
      onLoadQuery();
    });

    // detach history state listener when component unmounts
    return () => { unListen(); };
  }, [query]);

  const onSubmit = e => {
    // check to make sure the query has changed
    if (q !== query) {
      // change the query prop and trigger the UI update in useEffect
      onSaveQuery(q);
    }
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
          onChange={e => setQ(e.target.value)}
          value={q}
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