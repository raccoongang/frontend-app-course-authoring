module.exports = {
  graders: [{
    type: 'Homework', minCount: 0, dropCount: 0, shortLabel: null, weight: 15, id: 0,
  }, {
    type: 'Lab', minCount: 0, dropCount: 0, shortLabel: null, weight: 15, id: 1,
  }, {
    type: 'Midterm Exam', minCount: 0, dropCount: 0, shortLabel: null, weight: 30, id: 2,
  }, {
    type: 'Final Exam', minCount: 0, dropCount: 0, shortLabel: null, weight: 40, id: 3,
  }],
  grade_cutoffs: {
    a: 0.85, b: 0.72, c: 0.55, d: 0.32,
  },
  grace_period: null,
  minimum_grade_credit: 0.8,
};
