// Tables: courses, course_weeks, materials.
// Rows are plain objects with ids and foreign keys (week.course_id, material.week_id),
// so each array maps 1:1 to a future Supabase table. `icon` is a string key mapped to a
// lucide icon in src/components/CourseIcon.jsx.

export const courses = [
  { id: 'industrial-arts', title: 'Industrial Arts', description: 'Welding, carpentry, and technical skills', icon: 'wrench', sort_order: 1 },
  { id: 'agri-fishery', title: 'Agriculture and Fishery Arts', description: 'Farming, livestock, and sustainable practices', icon: 'sprout', sort_order: 2 },
  { id: 'home-economics', title: 'Home Economics', description: 'Cooking, nutrition, and household management skills', icon: 'chef-hat', sort_order: 3 },
  { id: 'ict', title: 'ICT', description: 'Web development, hardware servicing, and technology', icon: 'monitor', sort_order: 4 },
  { id: 'tvted', title: 'TVTED Competencies', description: 'Foundational cross disciplinary skills across all technical vocational tracks', icon: 'hammer', sort_order: 5 },
  { id: 'gen-ed', title: 'General Education', description: 'Core academic disciplines including humanities, sciences, and mathematics', icon: 'book-open', sort_order: 6 },
  { id: 'prof-ed', title: 'Professional Education', description: 'Pedagogical theories, teaching strategies, and classroom management', icon: 'id-card', sort_order: 7 },
  { id: 'entrepreneurship', title: 'Entrepreneurship', description: 'Business planning, marketing, and small enterprise management', icon: 'store', sort_order: 8 },
]

// Per course: five week topics, the short topic used in quiz titles, and how many quizzes
// the later weeks carry. Only used below to generate the table rows.
const outline = {
  'industrial-arts': { quizTopic: 'Shop Safety', laterQuizzes: 3, weeks: ['Shop Safety and Tool Handling', 'Measuring and Layout', 'Basic Carpentry Joints', 'Shielded Metal Arc Welding Basics', 'Electrical Wiring Fundamentals'] },
  'agri-fishery': { quizTopic: 'Crop Production', laterQuizzes: 4, weeks: ['Introduction to Crop Production', 'Soil Preparation and Fertility', 'Plant Propagation', 'Livestock Raising Basics', 'Aquaculture and Fish Culture'] },
  'home-economics': { quizTopic: 'Kitchen Safety', laterQuizzes: 3, weeks: ['Kitchen Safety and Sanitation', 'Basic Food Preparation', 'Nutrition and Meal Planning', 'Household Resource Management', 'Garment Care and Basic Sewing'] },
  ict: { quizTopic: 'Computer Hardware', laterQuizzes: 3, weeks: ['Computer Hardware Basics', 'Operating System Installation', 'Networking Fundamentals', 'HTML and CSS Foundations', 'Troubleshooting and Maintenance'] },
  tvted: { quizTopic: 'Occupational Safety', laterQuizzes: 3, weeks: ['Occupational Health and Safety', 'Workplace Communication', 'Teamwork and Productivity', 'Technical Drafting Basics', 'Quality and Environmental Standards'] },
  'gen-ed': { quizTopic: 'Purposive Communication', laterQuizzes: 3, weeks: ['Purposive Communication', 'Mathematics in the Modern World', 'Understanding the Self', 'Science, Technology, and Society', 'Readings in History'] },
  'prof-ed': { quizTopic: 'Teaching Profession', laterQuizzes: 3, weeks: ['The Teaching Profession', 'Learner-Centered Teaching', 'Assessment of Learning', 'Classroom Management', 'Curriculum Development'] },
  entrepreneurship: { quizTopic: 'Entrepreneurial Mindset', laterQuizzes: 3, weeks: ['The Entrepreneurial Mindset', 'Spotting Business Opportunities', 'Market Research', 'Writing a Business Plan', 'Money Basics for Small Business'] },
}

export const course_weeks = courses.flatMap((c) =>
  outline[c.id].weeks.map((title, i) => ({
    id: `${c.id}-w${i + 1}`,
    course_id: c.id,
    week_no: i + 1,
    title,
    is_locked: i > 0,
  })),
)

// Reading materials (one per week). Quizzes live in quizzes.js.
export const materials = course_weeks.map((w) => ({
  id: `${w.id}-reading`,
  week_id: w.id,
  kind: 'reading',
  title: `Reading: ${w.title}`,
  meta: 'PDF · 12 min read',
  sort_order: 0,
}))

export const quizPlan = (courseId) => outline[courseId] // used by quizzes.js to generate rows

export const getCourse = (id) => courses.find((c) => c.id === id)
export const weeksFor = (courseId) => course_weeks.filter((w) => w.course_id === courseId)
export const materialsForWeek = (weekId) => materials.filter((m) => m.week_id === weekId)
