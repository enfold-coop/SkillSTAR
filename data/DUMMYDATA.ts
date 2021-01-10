/**
 Intensity -- Prompt Type
 1  --  No Prompt (Independent)
 2  --  Shadow Prompt (approximately one inch)
 3  --  Partial Physical Prompt (thumb and index finger)
 4  --  Full Physical Prompt (hand-over-hand)
 */

export const PREP_MATS = [
  { id: 0, title: 'Tooth brush', img: '../' },
  { id: 1, title: 'Tooth paste', img: '../' },
  { id: 2, title: 'Towel', img: '../' },
  { id: 3, title: 'Cabinet', img: '../' },
  { id: 4, title: 'Cup of water', img: '../' },
];

export const DUMMY_SKILLS_v2 = [
  {
    name: 'Brushing Teeth',
    skills: [
      {
        id: 'A',
        title: 'Prepare Materials',
        score: 0,
        steps: [
          {
            id: 0,
            stepDuration: 5,
            isFocusStep: true,
            instructions: 'Get your toothbrush',
            video: '../',
            challBehaviorReport: [
              { id: 0, question: '...?', response: false },
              { id: 1, question: '...?', response: false },
            ],
          },
          {
            id: 1,
            stepDuration: 5,
            isFocusStep: true,
            instructions: 'Open toothpaste',
            video: '../',
            challBehaviorReport: [
              { id: 0, question: '...?', response: false },
              { id: 1, question: '...?', response: false },
            ],
          },
          {
            id: 2,
            stepDuration: 5,
            isFocusStep: true,
            instructions: 'Press toothpaste',
            video: '../',
            challBehaviorReport: [
              { id: 0, question: '...?', response: false },
              { id: 1, question: '...?', response: false },
            ],
          },
          {
            id: 3,
            stepDuration: 5,
            isFocusStep: true,
            instructions: 'Put toothpaste on toothbrush',
            video: '../',
            challBehaviorReport: [
              { id: 0, question: '...?', response: false },
              { id: 1, question: '...?', response: false },
            ],
          },
          {
            id: 4,
            stepDuration: 5,
            isFocusStep: true,
            instructions: 'Place cap on toothpaste',
            video: '../',
            challBehaviorReport: [
              { id: 0, question: '...?', response: false },
              { id: 1, question: '...?', response: false },
            ],
          },
        ],
      },
      {
        id: 'B',
        title: 'Brush Top',
        score: 1,
        steps: [
          {
            id: 0,
            stepDuration: 10,
            isFocusStep: true,
            instructions: 'Brush top surface of bottom teeth on right side.',
            video: '../',
            challBehaviorReport: [
              { id: 0, question: '...?', response: false },
              { id: 1, question: '...?', response: false },
            ],
          },
          {
            id: 1,
            stepDuration: 10,
            isFocusStep: true,
            instructions: 'Brush top surface of bottom teeth on left side..',
            video: '../',
            challBehaviorReport: [
              { id: 0, question: '...?', response: false },
              { id: 1, question: '...?', response: false },
            ],
          },
          {
            id: 2,
            stepDuration: 10,
            isFocusStep: true,
            instructions: 'Brush top surface of top teeth on right side.',
            video: '../',
            challBehaviorReport: [
              { id: 0, question: '...?', response: false },
              { id: 1, question: '...?', response: false },
            ],
          },
          {
            id: 3,
            stepDuration: 10,
            isFocusStep: true,
            instructions: 'Brush top surface of top teeth on left side.',
            video: '../',
            challBehaviorReport: [
              { id: 0, question: '...?', response: false },
              { id: 1, question: '...?', response: false },
            ],
          },
        ],
      },
      {
        id: 'C',
        title: 'Brush Outside',
        score: 0,
        video: '../',
        challBehaviorReport: [
          { id: 0, question: '...?', response: false },
          { id: 1, question: '...?', response: false },
        ],
      },
      {
        id: 'D',
        title: 'Brush Inside',
        score: 1,
        video: '../',
        challBehaviorReport: [
          { id: 0, question: '...?', response: false },
          { id: 1, question: '...?', response: false },
        ],
      },
      {
        id: 'E',
        title: 'Spit & Rinse',
        score: 2,
        video: '../',
        challBehaviorReport: [
          { id: 0, question: '...?', response: false },
          { id: 1, question: '...?', response: false },
        ],
      },
      {
        id: 'F',
        title: 'Clean Up',
        score: 1,
        video: '../',
        challBehaviorReport: [
          { id: 0, question: '...?', response: false },
          { id: 1, question: '...?', response: false },
        ],
      },
    ],
  },
];

export const DUMMY_SKILLS_ARR = [
  {
    name: 'Brushing Teeth',
    subItems: [
      { id: 'A', title: 'Prepare Materials', score: 0 },
      { id: 'B', title: 'Brush Top', score: 2 },
      { id: 'C', title: 'Brush Outside', score: 0 },
      { id: 'D', title: 'Brush Inside', score: 1 },
      { id: 'E', title: 'Spit & Rinse', score: 2 },
      { id: 'F', title: 'Clean Up', score: 1 },
    ],
  },
  {
    name: 'Flossing Teeth',
    subItems: [
      { id: 'A', title: 'Prepare Materials', score: 0 },
      { id: 'B', title: 'Floss Top', score: 2 },
      { id: 'C', title: 'Floss Outside', score: 0 },
      { id: 'D', title: 'Floss Inside', score: 1 },
      { id: 'E', title: 'Toss the Floss', score: 2 },
      { id: 'F', title: 'Eat Candy', score: 1 },
    ],
  },
  {
    name: 'Brushing Hair',
    subItems: [
      { id: 'A', title: 'Prepare Materials', score: 2 },
      { id: 'B', title: 'Brush Top', score: 1 },
      { id: 'C', title: 'Brush Outside', score: 1 },
      { id: 'D', title: 'Brush Inside', score: 0 },
      { id: 'E', title: 'Toss the Brush', score: 0 },
      { id: 'F', title: 'Eat More Candy', score: 2 },
    ],
  },
];
