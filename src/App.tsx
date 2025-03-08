import { MouseEvent, useState } from 'react'
import { SinglePolygon } from './components/single-polygon'

export interface Polygon {
  id: number
  coordinates: { id: number; x: number; y: number }[]
}

export default function App() {
  const [polygons, setPolygons] = useState<Polygon[]>([])
  const [status, setStatus] = useState<'drawing' | 'idle'>('idle')

  const onMouseDown = (e: MouseEvent) => {
    if (status === 'idle') {
      setStatus('drawing')
      setPolygons((pre) => {
        const newId = pre.length > 0 ? pre[pre.length - 1].id + 1 : 0
        return [
          ...pre,
          { id: newId, coordinates: [{ id: 0, x: e.clientX, y: e.clientY }] },
        ]
      })
    } else {
      setPolygons((pre) => {
        const polygon = pre[pre.length - 1]
        if (polygon.coordinates.length > 2) {
          const isInside =
            Math.sqrt(
              (e.clientX - polygon.coordinates[0].x) ** 2 +
                (e.clientY - polygon.coordinates[0].y) ** 2
            ) <= 6
          if (isInside) {
            setStatus('idle')
            return pre.map((polygon, i) => {
              if (i === pre.length - 1) {
                const newId =
                  polygon.coordinates.length > 0
                    ? polygon.coordinates[polygon.coordinates.length - 1].id + 1
                    : 0
                return {
                  ...polygon,
                  coordinates: [
                    ...polygon.coordinates,
                    {
                      id: newId,
                      x: polygon.coordinates[0].x,
                      y: polygon.coordinates[0].y,
                    },
                  ],
                }
              } else return polygon
            })
          } else {
            return pre.map((polygon, i) => {
              if (i === pre.length - 1) {
                const newId =
                  polygon.coordinates.length > 0
                    ? polygon.coordinates[polygon.coordinates.length - 1].id + 1
                    : 0
                return {
                  ...polygon,
                  coordinates: [
                    ...polygon.coordinates,
                    { id: newId, x: e.clientX, y: e.clientY },
                  ],
                }
              } else return polygon
            })
          }
        } else
          return pre.map((polygon, i) => {
            if (i === pre.length - 1) {
              const newId =
                polygon.coordinates.length > 0
                  ? polygon.coordinates[polygon.coordinates.length - 1].id + 1
                  : 0
              return {
                ...polygon,
                coordinates: [
                  ...polygon.coordinates,
                  { id: newId, x: e.clientX, y: e.clientY },
                ],
              }
            } else return polygon
          })
      })
    }
  }

  return (
    <main>
      <svg onMouseDown={onMouseDown} className="w-full h-screen">
        {polygons.map((polygon) => (
          <SinglePolygon
            key={polygon.id}
            {...polygon}
            setPolygons={setPolygons}
          />
        ))}
      </svg>
    </main>
  )
}
