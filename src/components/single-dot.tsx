import { Dispatch, MouseEvent, SetStateAction } from 'react'
import { Polygon } from '../App'

export function SingleDot({
  x,
  y,
  isDrawing,
  setPolygons,
  polygon_id,
  dot_id,
}: {
  x: number
  y: number
  isDrawing: boolean
  setPolygons: Dispatch<SetStateAction<Polygon[]>>
  polygon_id: number
  dot_id: number
}) {
  const onMouseMove = (e: globalThis.MouseEvent) => {
    setPolygons((pre) => {
      return pre.map((p) => {
        if (p.id === polygon_id) {
          const index = p.coordinates.findIndex((item) => item.id === dot_id)
          const isMoveable = index === 0 || index === p.coordinates.length - 1
          return {
            ...p,
            coordinates: p.coordinates.map((c, i) => {
              if (
                c.id === dot_id ||
                (isMoveable && (i === 0 || i === p.coordinates.length - 1))
              ) {
                return { ...c, x: e.clientX, y: e.clientY }
              } else return c
            }),
          }
        } else return p
      })
    })
  }

  const onMouseDown = (e: MouseEvent) => {
    if (isDrawing) return
    e.stopPropagation()
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
  }

  const onMouseUp = () => {
    if (!window) return
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)
  }

  return (
    <circle
      className={isDrawing ? '' : 'cursor-move'}
      onMouseDown={onMouseDown}
      cx={x}
      cy={y}
      r={6}
      fill="#696969"
    />
  )
}
