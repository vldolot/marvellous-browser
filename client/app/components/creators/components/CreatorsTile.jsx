import React from 'react'
import './CreatorsTile.pcss'
import {Link} from 'react-router'
import classNames from 'classnames'
import {getColourForKey} from '../../../random-colours'
import ifElse from 'ramda/src/ifElse'
import assoc from 'ramda/src/assoc'
import prop from 'ramda/src/prop'

const styleForCreator = ifElse(
  prop('hasImages'),
  (creator) => assoc('backgroundImage', `url(${prop('thumbnail', creator)})`, {}),
  (creator) => assoc('backgroundColor', getColourForKey(`creator-${prop('id', creator)}`), {})
)

export default function ComicTile(props) {
  const creator = props.creator

  const comicClass = classNames({
    'creator-tile': true,
    'creator-tile--no-images': !creator.hasImages
  })

  return (
    <Link to={`/creators/${creator.id}`}
          className={comicClass}
          style={styleForCreator(creator)}
          onClick={e => e.preventDefault()}>
      <img src={creator.thumbnail}/>
      <div className="creator-tile__detail">
        <h3 className="text top-left">{creator.suffix && `(${creator.suffix})`} {creator.fullName}</h3>
      </div>
    </Link>
  )
}

