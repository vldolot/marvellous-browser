import React from 'react'
import CreatorsTile from './CreatorsTile.jsx'
import path from 'ramda/src/path'
import pathOr from 'ramda/src/pathOr'
import './Creators.pcss'
import { connect } from 'react-redux'
import { loadCreators, loadMoreCreators } from '../actions'
import compose from 'ramda/src/compose'
import pick from 'ramda/src/pick'
import { Helmet } from 'react-helmet'

import {
  CREATORS_LOAD_MORE_LIMIT
} from '../constants'

const getCreators = pathOr([], ['creators', 'data'])
const viewingCreatorId = pathOr(false, ['params', 'id'])

const getNumberOfComics = pathOr(0, ['creators', 'data', 'length'])
const getOrderBy = path(['creators', 'orderBy'])
const getNameStartsWith = path(['creators', 'nameStartsWith'])

export const getCreatorsQueryOptions = compose(pick([
  'orderBy',
  'start',
  'limit',
  'nameStartsWith'
]), pathOr({}, ['creators']))

const getLoadMoreCreatorsQueryOptions = (props) => {
  return {
    nameStartsWith: getNameStartsWith(props),
    start: getNumberOfComics(props),
    limit: CREATORS_LOAD_MORE_LIMIT,
    orderBy: getOrderBy(props)
  }
}


class CreatorsRenderer extends React.Component {

  componentDidMount () {
    this.props.dispatch(loadCreators(getCreatorsQueryOptions(this.props)))
  }

  render () {
    if (viewingCreatorId(this.props)) {
      return this.props.children
    }

    const creators = getCreators(this.props)

    const loadMoreButton = <button className="creator__load-more" 
        onClick={() => this.props.dispatch(loadMoreCreators(getLoadMoreCreatorsQueryOptions(this.props)))}>Load More ...</button>

    return (
      <div className="creators">
        <Helmet>
          <title>Creators | Marvellous</title>
        </Helmet>
        <div className="creators__list">
        {creators.map((creator) => <CreatorsTile key={creator.id}
                                           creator={creator}/>)}          
        </div>
        {(creators.length > 0) && loadMoreButton}
      </div>
    )
  }
}

export default connect((state) => {
  return {
    creators: state.creators
  }
})(CreatorsRenderer)
