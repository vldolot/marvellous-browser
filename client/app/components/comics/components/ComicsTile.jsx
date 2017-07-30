import React from 'react'
import './ComicsTile.pcss'
import {Link} from 'react-router'
import classNames from 'classnames'
import {getColourForKey} from '../../../random-colours'
import ifElse from 'ramda/src/ifElse'
import assoc from 'ramda/src/assoc'
import prop from 'ramda/src/prop'

const styleForComic = ifElse(
  prop('hasImages'),
  (comic) => assoc('backgroundImage', `url(${prop('thumbnail', comic)})`, {}),
  (comic) => assoc('backgroundColor', getColourForKey(`comic-${prop('id', comic)}`), {})
)

export default function ComicTile(props) {
  const comic = props.comic

  const comicClass = classNames({
    'comic-tile': true,
    'comic-tile--no-images': !comic.hasImages
  })

  return (
    <Link to={`/comics/${comic.id}`}
          className={comicClass}
          style={styleForComic(comic)}>
      {/* comic.hasImages && <img src={comic.thumbnail}/> */}
      <img src={comic.thumbnail}/>
      <div className="comic-tile__detail">
        <h3 className="text top-left">{comic.title}</h3>
      </div>
    </Link>
  )
}

