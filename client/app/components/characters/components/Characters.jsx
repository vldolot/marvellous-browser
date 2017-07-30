import React from 'react'
import CharactersTile from './CharactersTile.jsx'
import path from 'ramda/src/path'
import pathOr from 'ramda/src/pathOr'
import './Characters.pcss'
import { connect } from 'react-redux'
import { loadCharacters, loadMoreCharacters } from '../actions'
import compose from 'ramda/src/compose'
import pick from 'ramda/src/pick'
import { Helmet } from 'react-helmet'

import {
  CHARACTERS_LOAD_MORE_LIMIT
} from '../constants'

const getCharacters = pathOr([], ['characters', 'data'])
const viewingCharacterId = pathOr(false, ['params', 'id'])

export const getCharactersQueryOptions = compose(pick([
  'orderBy',
  'start',
  'limit',
  'nameStartsWith'
]), pathOr({}, ['characters']))

const getNumberOfComics = pathOr(0, ['characters', 'data', 'length'])
const getOrderBy = path(['characters', 'orderBy'])
const getNameStartsWith = path(['characters', 'nameStartsWith'])

const getLoadMoreCharactersQueryOptions = (props) => {
  return {
    nameStartsWith: getNameStartsWith(props),
    start: getNumberOfComics(props),
    limit: CHARACTERS_LOAD_MORE_LIMIT,
    orderBy: getOrderBy(props)
  }
}

class CharactersRenderer extends React.Component {

  componentDidMount () {
    this.props.dispatch(loadCharacters(getCharactersQueryOptions(this.props)))
  }

  render () {
    if (viewingCharacterId(this.props)) {
      return this.props.children
    }

    const characters = getCharacters(this.props)

    const loadMoreButton = <button className="character__load-more"
        onClick={() => this.props.dispatch(loadMoreCharacters(getLoadMoreCharactersQueryOptions(this.props)))}>Load More ...</button>

    return (
      <div className="characters">
        <Helmet>
          <title>Characters | Marvellous</title>
        </Helmet>
        <div className="characters__list">
        {characters.map((character) => <CharactersTile key={character.id}
                                                   character={character}/>)}          
        </div>
        {(characters.length > 0) && loadMoreButton}
      </div>
    )
  }
}

export default connect((state) => {
  return {
    characters: state.characters
  }
})(CharactersRenderer)
