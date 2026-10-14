// Tables: quizzes, quiz_questions. Attempts are per student, so they live in students.js.
import { course_weeks, quizPlan } from './courses.js'

export const POINTS_PER_QUESTION = 2 // 5 questions x 2 = "Total: 10"
export const MAX_ATTEMPTS = 5
export const PASSING_RATIO = 0.7

// Week 1 has 5 quiz parts; later weeks have `laterQuizzes`.
export const quizzes = course_weeks.flatMap((w) => {
  const plan = quizPlan(w.course_id)
  const count = w.week_no === 1 ? 5 : plan.laterQuizzes
  const topic = w.week_no === 1 ? plan.quizTopic : w.title
  return Array.from({ length: count }, (_, i) => ({
    id: `${w.id}-q${i + 1}`,
    week_id: w.id,
    title: `Week ${w.week_no} Quiz ${topic} Part ${i + 1}`,
    total_points: 10,
    max_attempts: MAX_ATTEMPTS,
    sort_order: i + 1,
  }))
})

// Five questions per course. [prompt, choices, index of the correct choice]
const bank = {
  'industrial-arts': [
    ['What should you check first before using a power tool?', ['Its brand', 'The cord, guard, and switch', 'The price tag', 'Its color'], 1],
    ['Which PPE protects your eyes from flying chips?', ['Ear muffs', 'Safety goggles', 'Apron', 'Gloves'], 1],
    ['A try square is mainly used to…', ['Cut curves', 'Check 90° angles', 'Drive nails', 'Smooth surfaces'], 1],
    ['Where should tools go after use?', ['On the floor', 'In a classmate’s bag', 'Back in their proper storage', 'On the workbench edge'], 2],
    ['Which fire extinguisher class is used for electrical fires?', ['Class A', 'Class C', 'Class K', 'Water only'], 1],
  ],
  'agri-fishery': [
    ['What is the first step in crop production?', ['Harvesting', 'Land preparation', 'Marketing', 'Irrigation'], 1],
    ['Which nutrient mainly promotes leafy green growth?', ['Nitrogen', 'Phosphorus', 'Potassium', 'Calcium'], 0],
    ['Crop rotation helps to…', ['Use more pesticide', 'Reduce soil pests and keep fertility', 'Speed up harvest only', 'Avoid weeding'], 1],
    ['Seedlings grown in a nursery are later…', ['Sold as feed', 'Transplanted to the field', 'Dried for storage', 'Burned'], 1],
    ['The best time to water most crops is…', ['Midday', 'Early morning', 'Midnight', 'Only when wilted'], 1],
  ],
  'home-economics': [
    ['What is the safe minimum time for washing hands?', ['5 seconds', '20 seconds', '1 minute', 'No minimum'], 1],
    ['Raw meat should be stored…', ['Above ready-to-eat food', 'On the lowest fridge shelf', 'On the counter', 'Next to bread'], 1],
    ['The “danger zone” for bacteria growth is between…', ['0–5 °C', '5–60 °C', '60–100 °C', 'Below 0 °C'], 1],
    ['A grease fire should be put out with…', ['Water', 'A lid or baking soda', 'Flour', 'A wet towel waved over it'], 1],
    ['Color-coded chopping boards help prevent…', ['Dull knives', 'Cross-contamination', 'Overcooking', 'Food waste'], 1],
  ],
  ict: [
    ['Which component is the “brain” of the computer?', ['RAM', 'CPU', 'PSU', 'GPU'], 1],
    ['RAM is best described as…', ['Permanent storage', 'Temporary working memory', 'A cooling part', 'An input device'], 1],
    ['Before opening a system unit you should…', ['Keep it plugged in', 'Unplug it and ground yourself', 'Spray water to cool it', 'Remove the monitor only'], 1],
    ['Which port is most common for keyboards today?', ['VGA', 'USB', 'HDMI', 'RJ-45'], 1],
    ['An SSD differs from an HDD because it…', ['Has spinning platters', 'Has no moving parts', 'Cannot store files', 'Is always larger'], 1],
  ],
  tvted: [
    ['OHS stands for…', ['Office Hours Schedule', 'Occupational Health and Safety', 'Operational Hazard System', 'Onsite Help Service'], 1],
    ['A hazard is…', ['An injury that happened', 'Anything with potential to cause harm', 'A safety sign', 'A first aid kit'], 1],
    ['The first thing to do when you see a spill is…', ['Ignore it', 'Warn others and contain it', 'Walk around it', 'Take a photo'], 1],
    ['Which sign color usually means mandatory action?', ['Red', 'Blue', 'Yellow', 'Green'], 1],
    ['Who is responsible for workplace safety?', ['Only the manager', 'Everyone', 'Only the safety officer', 'Only visitors'], 1],
  ],
  'gen-ed': [
    ['Purposive communication focuses on…', ['Speaking as fast as possible', 'Communicating with a clear goal and audience', 'Using big words', 'Writing only formal letters'], 1],
    ['Which is a barrier to communication?', ['Active listening', 'Noise', 'Feedback', 'Clarity'], 1],
    ['Feedback in communication is…', ['The sender’s message', 'The receiver’s response', 'The channel', 'The noise'], 1],
    ['An email to a principal should be…', ['Casual with slang', 'Clear, polite, and concise', 'All caps', 'Very long'], 1],
    ['Code-switching means…', ['Changing passwords', 'Alternating between languages or registers', 'Writing code', 'Switching topics'], 1],
  ],
  'prof-ed': [
    ['A professional teacher is expected to…', ['Teach only from memory', 'Keep learning and follow a code of ethics', 'Avoid parents', 'Grade without criteria'], 1],
    ['Learner-centered teaching puts focus on…', ['The textbook', 'The student’s needs and activity', 'The teacher’s lecture', 'Tests only'], 1],
    ['A lesson objective should be…', ['Vague', 'Specific and measurable', 'Secret', 'Optional'], 1],
    ['Formative assessment is used to…', ['Rank schools', 'Check learning during instruction', 'Replace teaching', 'Grade the final exam'], 1],
    ['Classroom routines mainly help…', ['Fill time', 'Reduce disruptions and save time', 'Punish students', 'Avoid planning'], 1],
  ],
  entrepreneurship: [
    ['An entrepreneur is someone who…', ['Only works for others', 'Starts and runs a venture, taking on risk', 'Avoids all risk', 'Only invests money'], 1],
    ['A business opportunity starts from…', ['A customer problem or need', 'A logo', 'A loan', 'A store name'], 0],
    ['Market research helps you understand…', ['Your favorite color', 'Your customers and competitors', 'Tax law only', 'Employee schedules'], 1],
    ['Profit equals…', ['Sales + costs', 'Sales − costs', 'Costs − sales', 'Sales × costs'], 1],
    ['Which is a fixed cost?', ['Raw materials per unit', 'Monthly rent', 'Packaging per item', 'Sales commission'], 1],
  ],
}

// Every quiz in a course draws from that course's bank, rotated so each part starts differently.
export const quiz_questions = quizzes.flatMap((q) => {
  const courseId = course_weeks.find((w) => w.id === q.week_id).course_id
  const items = bank[courseId]
  return items.map((_, i) => {
    const [prompt, choices, answer_index] = items[(i + q.sort_order - 1) % items.length]
    return { id: `${q.id}-${i + 1}`, quiz_id: q.id, prompt, choices, answer_index, sort_order: i + 1 }
  })
})

export const quizzesForWeek = (weekId) => quizzes.filter((q) => q.week_id === weekId)
export const questionsFor = (quizId) => quiz_questions.filter((x) => x.quiz_id === quizId)
