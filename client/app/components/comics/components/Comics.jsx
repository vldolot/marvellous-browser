import React from 'react'
import ComicsTile from './ComicsTile.jsx'
import path from 'ramda/src/path'
import pathOr from 'ramda/src/pathOr'
import './Comics.pcss'
import { connect } from 'react-redux'
import { loadComics, loadMoreComics } from '../actions'
import compose from 'ramda/src/compose'
import pick from 'ramda/src/pick'
import { Helmet } from 'react-helmet'

import {
  COMICS_LOAD_MORE_LIMIT
} from '../constants'

const getComics = pathOr([], ['comics', 'data'])
const viewingComicId = pathOr(false, ['params', 'id'])

const getNumberOfComics = pathOr(0, ['comics', 'data', 'length'])
const getOrderBy = path(['comics', 'orderBy'])
const getTitleStartsWith = path(['comics', 'titleStartsWith'])
const getCharacterIds = path(['comics', 'characterIds'])

export const getComicsQueryOptions = compose(pick([
  'orderBy',
  'start',
  'limit',
  'titleStartsWith',
  'characterIds'
]), pathOr({}, ['comics']))

const getLoadMoreComicsQueryOptions = (props) => {
  return {
    titleStartsWith: getTitleStartsWith(props),
    characterIds: getCharacterIds(props),
    start: getNumberOfComics(props),
    limit: COMICS_LOAD_MORE_LIMIT,
    orderBy: getOrderBy(props)
  }
}

class ComicsRenderer extends React.Component {

  componentDidMount () {
    this.props.dispatch(loadComics(getComicsQueryOptions(this.props)))
  }

  render () {
    if (viewingComicId(this.props)) {
      return this.props.children
    }

    const comics = getComics(this.props)

    const loadMoreButton = <button className="comic__load-more" onClick={() => this.props.dispatch(loadMoreComics(getLoadMoreComicsQueryOptions(this.props)))}>Load More ...</button>;

    return (
      <div className="comics">
        <Helmet>
          <title>Comics | Marvellous</title>
        </Helmet>
        <div className="comics__list">
        {comics.map((comic) => <ComicsTile key={comic.id}
                                           comic={comic}/>)}
        </div>
        {(comics.length > 0) && loadMoreButton}
      </div>
    )
  }
}

export default connect((state) => {
  return {
    comics: state.comics
  }
})(ComicsRenderer)
