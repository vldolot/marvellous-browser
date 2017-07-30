import React from 'react'
import './CreatorControls.pcss'
import { loadMoreCreators, updateCreatorsQuery } from '../../../creators/actions'
import path from 'ramda/src/path'
import pathOr from 'ramda/src/pathOr'
import compose from 'ramda/src/compose'
import {
  CREATORS_LOAD_MORE_LIMIT,
  CREATORS_ORDER_ISSUE_NUMBER_DESC,
  CREATORS_ORDER_ON_SALE_DATE_DESC,
  CREATORS_ORDER_FIRSTNAME_ASC
} from '../../../creators/constants'
import { toggleToolbarSearch } from '../../actions'

const getNumberOfComics = pathOr(0, ['creators', 'data', 'length'])
// const getOrderBy = path(['creators', 'orderBy'])
const getNameStartsWith = path(['creators', 'nameStartsWith'])

// const getLoadMoreCreatorsQueryOptions = (props) => {
//   return {
//     nameStartsWith: getNameStartsWith(props),
//     start: getNumberOfComics(props),
//     limit: CREATORS_LOAD_MORE_LIMIT,
//     orderBy: getOrderBy(props)
//   }
// }

const orderByVariable = (
  orderBy,
  props
) => {
  return {
    orderBy,
    nameStartsWith: getNameStartsWith(props),
    start: getNumberOfComics(props),
    limit: CREATORS_LOAD_MORE_LIMIT
  }
}
const updateCreatorsQueryWithVariable = compose(updateCreatorsQuery, orderByVariable)

export function CreatorControls (props) {
  const {
    creators,
    dispatch
  } = props

  return (
    <div className="creator__controls">
      <div className="creator__controls__sorting">
        <label>
          Name
          <input type="radio"
                 name="orderBy"
                 checked={creators.orderBy === CREATORS_ORDER_FIRSTNAME_ASC}
                 onChange={() => dispatch(updateCreatorsQueryWithVariable(CREATORS_ORDER_FIRSTNAME_ASC, props))}
          />
        </label>
      </div>

      <button className="creator__controls__search"
              onClick={() => props.dispatch(toggleToolbarSearch())}>
        <i className="icon-search"/>
      </button>

      {/* <button className="creator__controls__load-more"
              onClick={() => props.dispatch(loadMoreCreators(getLoadMoreCreatorsQueryOptions(props)))}>
        Load More
      </button> */}
    </div>
  )
}
