/** Interactive aquaculture farmer education course (illustrative demo content). */

export const EDUCATION_STORAGE_KEY = 'aquavision-edu-progress-v1';

export const educationCourse = {
  id: 'farmer-foundations',
  title: 'Pond Sense Foundations',
  subtitle: 'Graphic, hands-on units for everyday farm decisions',
  badge: 'Farmer education',
  units: [
    {
      id: 'do-basics',
      title: 'Dissolved oxygen',
      icon: 'droplets',
      color: '#44A7D2',
      minutes: 8,
      blurb: 'Why mornings are the danger window, and how to read DO like a farmer.',
      lessons: [
        {
          id: 'do-1',
          type: 'story',
          title: 'The night breath of a pond',
          body: 'Algae make oxygen in daylight and consume it after dark. By dawn, DO often hits its lowest point. That is when gasping fish usually appear.',
          visual: 'diel',
        },
        {
          id: 'do-2',
          type: 'interact',
          title: 'Slide the clock',
          body: 'Drag the hour. Watch how surface DO typically moves across a warm tropical day.',
          visual: 'clock',
        },
        {
          id: 'do-3',
          type: 'quiz',
          title: 'Quick check',
          question: 'When is dissolved oxygen usually lowest?',
          choices: [
            { id: 'a', label: 'Mid-afternoon on a sunny day', correct: false },
            { id: 'b', label: 'Just before sunrise', correct: true },
            { id: 'c', label: 'Right after a heavy feeding at noon', correct: false },
          ],
          explain: 'Overnight respiration pulls oxygen down. Sunrise is the classic risk window.',
        },
      ],
    },
    {
      id: 'pond-colour',
      title: 'Pond colour & clarity',
      icon: 'palette',
      color: '#0B608F',
      minutes: 6,
      blurb: 'Match water colour to what it usually means on a working pond.',
      lessons: [
        {
          id: 'pc-1',
          type: 'story',
          title: 'Colour is a clue, not a lab',
          body: 'Green often means algae. Brown can mean soil or plankton mix. Clear water is not always “good”; it can mean low productivity.',
          visual: 'swatches',
        },
        {
          id: 'pc-2',
          type: 'interact',
          title: 'Pick the match',
          body: 'Tap the colour that best matches each farm clue.',
          visual: 'match',
        },
        {
          id: 'pc-3',
          type: 'quiz',
          title: 'Quick check',
          question: 'Very green water overnight most often risks…',
          choices: [
            { id: 'a', label: 'High salt', correct: false },
            { id: 'b', label: 'Low dissolved oxygen before dawn', correct: true },
            { id: 'c', label: 'Too much hardness', correct: false },
          ],
          explain: 'Dense algae blooms can crash oxygen overnight.',
        },
      ],
    },
    {
      id: 'feeding-sense',
      title: 'Feeding without fouling',
      icon: 'utensils',
      color: '#2E9E6B',
      minutes: 10,
      blurb: 'Feed enough for growth, not so much that leftover pellets steal tomorrow’s oxygen.',
      lessons: [
        {
          id: 'fd-1',
          type: 'story',
          title: 'Leftovers breathe too',
          body: 'Uneaten feed and waste feed bacteria. Bacteria use oxygen. Overfeeding can quietly set up a morning DO crash.',
          visual: 'feed',
        },
        {
          id: 'fd-2',
          type: 'interact',
          title: 'Balance the scoop',
          body: 'Adjust ration. See how leftover risk and growth pressure trade off.',
          visual: 'scoop',
        },
        {
          id: 'fd-3',
          type: 'quiz',
          title: 'Quick check',
          question: 'Best first response when fish leave feed floating?',
          choices: [
            { id: 'a', label: 'Double the next ration', correct: false },
            { id: 'b', label: 'Reduce or split feeds and check water', correct: true },
            { id: 'c', label: 'Stop aeration', correct: false },
          ],
          explain: 'Leftover feed is a signal. Ease off and check conditions before pushing harder.',
        },
      ],
    },
    {
      id: 'early-disease',
      title: 'Spotting trouble early',
      icon: 'stethoscope',
      color: '#E2721F',
      minutes: 12,
      blurb: 'Behaviour and pattern first. Photos help triage. Humans confirm.',
      lessons: [
        {
          id: 'dz-1',
          type: 'story',
          title: 'Watch the school, not one fish',
          body: 'Gasping, flashing, hanging at edges, or sudden appetite drop often show up before you can name a pathogen.',
          visual: 'school',
        },
        {
          id: 'dz-2',
          type: 'interact',
          title: 'Triage board',
          body: 'Sort each sign into “act today” or “monitor”.',
          visual: 'triage',
        },
        {
          id: 'dz-3',
          type: 'quiz',
          title: 'Quick check',
          question: 'An app photo suggestion with 60% confidence means…',
          choices: [
            { id: 'a', label: 'A confirmed diagnosis', correct: false },
            { id: 'b', label: 'A triage hint that still needs human judgment', correct: true },
            { id: 'c', label: 'Safe to ignore water quality', correct: false },
          ],
          explain: 'Image tools suggest. They do not diagnose. Keep a path to a vet or extension officer.',
        },
      ],
    },
  ],
};

export function emptyProgress() {
  return { completedLessons: {}, quizCorrect: {}, interactDone: {} };
}

export function loadProgress() {
  try {
    const raw = localStorage.getItem(EDUCATION_STORAGE_KEY);
    if (!raw) return emptyProgress();
    return { ...emptyProgress(), ...JSON.parse(raw) };
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress) {
  try {
    localStorage.setItem(EDUCATION_STORAGE_KEY, JSON.stringify(progress));
  } catch {
    /* ignore */
  }
}

export function unitProgress(unit, progress) {
  const total = unit.lessons.length;
  const done = unit.lessons.filter((l) => progress.completedLessons[l.id]).length;
  return { done, total, ratio: total ? done / total : 0 };
}

export function courseProgress(course, progress) {
  const lessons = course.units.flatMap((u) => u.lessons);
  const done = lessons.filter((l) => progress.completedLessons[l.id]).length;
  return { done, total: lessons.length, ratio: lessons.length ? done / lessons.length : 0 };
}
