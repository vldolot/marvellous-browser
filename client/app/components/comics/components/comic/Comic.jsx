import React from 'react'
import {gql, graphql} from 'react-apollo'
import pathOr from 'ramda/src/pathOr'
import './Comic.pcss'
import head from 'ramda/src/head'
import length from 'ramda/src/length'
import compose from 'ramda/src/compose'
import propOr from 'ramda/src/propOr'
import {Helmet} from 'react-helmet'
import {Link} from 'react-router'

const getComic = pathOr(false, ['data', 'comic'])
const hasCharacters = compose(length, propOr([], 'characters'))
const hasCreators = compose(length, propOr([], 'creators'))
const getComicImage = compose(head, propOr([], 'images'))

function Characters(props) {
  if (!hasCharacters(props)) {
    return null
  }

  return (
    <div className="comic__characters">
      <h2>Characters</h2>
      <div className="comic__characters__wrapper">
        {props.characters.map((character) => {
          return (
            <Link key={character.id}
                  to={`/characters/${character.id}`}
                  className="comic__characters__wrapper__character">
              <img src={character.thumbnail}/>
              <h3>{character.name} {character.role && `(${character.role})`}</h3>
              {character.description && <p>{character.description}</p>}
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function Creators(props) {
  if (!hasCreators(props)) {
    return null
  }

  return (
    <div className="comic__characters">
      <h2>Creators</h2>
      <div className="comic__characters__wrapper">
        {props.creators.map((creator) => {
          return (
            <Link key={creator.id}
                  to={`/creators/${creator.id}`}
                  className="comic__characters__wrapper__character"
                  onClick={e => e.preventDefault()}>
              <img src={creator.thumbnail}/>
              <h3>{creator.suffix && `(${creator.suffix})`} {creator.fullName}</h3>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

function ComicRenderer(props) {
  const comic = getComic(props)
  if (!comic) {
    return null
  }

  /**
   * I've gone with the least development time approach here
   *
   * @TODO In a project situation the cost / benefit of duplicating HTML to achieve responsiveness would be discussed with the team.
   */
  return (
    <div>
      <Helmet>
        <meta charSet="utf-8"/>
        <title>{`${comic.title} | Comics | Marvellous`}</title>
        <meta property="og:title"
              content={comic.title}/>
        <meta property="og:type"
              content="book"/>
        <meta property="og:url"
              content={window.location.href}/>
        <meta property="og:image"
              content={(getComicImage(comic)) ? getComicImage(comic) : comic.thumbnail}/>
        <meta property="og:description"
              content={comic.description}/>
      </Helmet>
      <div className="comic comic--phone">
        <h1 className="comic__title">{comic.title}</h1>
        <div className="comic__hero">
          <img src={(getComicImage(comic)) ? getComicImage(comic) : comic.thumbnail}/>
        </div>
        <p className="comic__description"
           dangerouslySetInnerHTML={{__html: comic.description}}/>
        <Characters characters={comic.characters}/>
        <Creators creators={comic.creators}/>
      </div>

      <div className="comic comic__portrait-tablet">
        <div className="comic__portrait-tablet__wrapper">
          <div className="comic__hero">
            <img src={(head(comic.images)) ? head(comic.images) : comic.thumbnail}/>
          </div>
          <div className="comic__portrait-tablet__information">
            <h1 className="comic__title">{comic.title}</h1>
            <p className="comic__description"
               dangerouslySetInnerHTML={{__html: comic.description}}/>
          </div>
        </div>
        <Characters characters={comic.characters}/>
        <Creators creators={comic.creators}/>
      </div>
    </div>
  )
}

const COMIC_QUERY = gql`query ($id: Int!) {
  comic(id:$id){
    id
    title
    images
    thumbnail
    description
    characters {
      id
      description
      name
      role
      thumbnail
    }
    creators {
      id
      fullName
      suffix
      thumbnail
    }
  }
}`

const Comic = graphql(COMIC_QUERY, {
  options: {
    notifyOnNetworkStatusChange: true
  }
})(ComicRenderer)

export default Comic
