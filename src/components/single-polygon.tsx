import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { Polygon } from '../App'
import { SingleDot } from './single-dot'

interface Props extends Polygon {
  setPolygons: Dispatch<SetStateAction<Polygon[]>>
}

export function SinglePolygon({ coordinates, id, setPolygons }: Props) {
  const isDrawing =
    coordinates.length === 1 ||
    coordinates[0].x !== coordinates[coordinates.length - 1].x ||
    coordinates[0].y !== coordinates[coordinates.length - 1].y

  const direction = coordinates.reduce((prev, curr, i) => {
    if (i === 0) return prev + `M${curr.x} ${curr.y}`
    else return prev + ` L${curr.x} ${curr.y}`
  }, '')

  const lastCoordinate = coordinates[coordinates.length - 1]
  const [pointer, setPointer] = useState({
    x: lastCoordinate.x,
    y: lastCoordinate.y,
  })

  useEffect(() => {
    if (!window) return
    const onMouseMove = (e: globalThis.MouseEvent) => {
      setPointer({ x: e.clientX, y: e.clientY })
    }
    if (isDrawing) {
      window.addEventListener('mousemove', onMouseMove)
    } else {
      window.removeEventListener('mousemove', onMouseMove)
    }
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
    }
  }, [isDrawing])

  return (
    <>
      {coordinates.map((c) => (
        <SingleDot
          key={c.id}
          {...c}
          dot_id={c.id}
          polygon_id={id}
          isDrawing={isDrawing}
          setPolygons={setPolygons}
        />
      ))}
      {isDrawing && (
        <path
          d={`M${lastCoordinate.x} ${lastCoordinate.y} L${pointer.x} ${pointer.y}`}
          stroke="#696969"
          strokeDasharray="4"
          fill="none"
          strokeWidth="2"
        />
      )}
      <path
        className="pointer-events-none"
        d={direction}
        strokeWidth={2}
        stroke="#696969"
        fill={
          coordinates.length > 0 &&
          coordinates[0].x === coordinates[coordinates.length - 1].x &&
          coordinates[0].y === coordinates[coordinates.length - 1].y
            ? 'rgb(100, 100, 250, 0.3)'
            : 'none'
        }
      />
    </>
  )
}
