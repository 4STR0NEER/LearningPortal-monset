import { useParams } from 'react-router'
import { getCourse } from '../data/courses'

// Temporary stand-in so every nav link works in Phase 1. Deleted as real pages land.
export default function Placeholder({ title, phase }) {
  const { courseId } = useParams()
  return (
    <div>
      <h1 className="text-3xl font-extrabold text-primary">{courseId ? getCourse(courseId)?.title ?? title : title}</h1>
      <p className="mt-1 text-muted">Arrives in Phase {phase}.</p>
    </div>
  )
}
