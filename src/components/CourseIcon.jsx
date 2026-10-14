import { BookOpen, ChefHat, Hammer, IdCard, Monitor, Sprout, Store, Wrench } from 'lucide-react'

const icons = { wrench: Wrench, sprout: Sprout, 'chef-hat': ChefHat, monitor: Monitor, hammer: Hammer, 'book-open': BookOpen, 'id-card': IdCard, store: Store }

export default function CourseIcon({ name, ...props }) {
  const Icon = icons[name] ?? BookOpen
  return <Icon aria-hidden="true" {...props} />
}
