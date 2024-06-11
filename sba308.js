function getLearnerData(courseInfo, assignmentGroup, learnerSubmissions) {
    // Validate input data
    if (!isValidCourse(courseInfo) || !isValidAssignmentGroup(assignmentGroup) || !isValidLearnerSubmissions(learnerSubmissions)) {
        throw new Error("Invalid input data.");
    }

    // Process data
    const learnerData = [];
    for (const submission of learnerSubmissions) {
        const learnerId = submission.learner_id;
        const learnerAssignmentScores = {};

        for (const assignment of assignmentGroup.assignments) {
            const assignmentId = assignment.id;
            const pointsPossible = assignment.points_possible;
            const dueDate = new Date(assignment.due_at);
            const submittedDate = new Date(submission.submission.submitted_at);

            if (submittedDate > dueDate) {
                // Deduct 10% if submitted late
                const latePenalty = pointsPossible * 0.1;
                const score = Math.max(0, submission.submission.score - latePenalty);
                learnerAssignmentScores[assignmentId] = score / pointsPossible;
            } else {
                // Score without penalty
                learnerAssignmentScores[assignmentId] = submission.submission.score / pointsPossible;
            }
        }

        learnerData.push({
            id: learnerId,
            avg: calculateWeightedAverage(assignmentGroup, submission, learnerAssignmentScores),
            ...learnerAssignmentScores
        });
    }

    return learnerData;
}

// Helper function to calculate weighted average
function calculateWeightedAverage(assignmentGroup, submission, learnerAssignmentScores) {
    let totalScore = 0;
    let totalWeight = 0;

    for (const assignment of assignmentGroup.assignments) {
        const assignmentId = assignment.id;
        const assignmentScore = learnerAssignmentScores[assignmentId];
        const weight = assignment.points_possible * (assignment.group_weight / 100);
        totalScore += assignmentScore * weight;
        totalWeight += weight;
    }

    return totalScore / totalWeight;
}

// Validation functions
function isValidCourse(courseInfo) {
    return courseInfo && typeof courseInfo === 'object' && 'id' in courseInfo && 'name' in courseInfo;
}

function isValidAssignmentGroup(assignmentGroup) {
    return assignmentGroup && typeof assignmentGroup === 'object' && 'id' in assignmentGroup && 'name' in assignmentGroup &&
        'course_id' in assignmentGroup && 'group_weight' in assignmentGroup && 'assignments' in assignmentGroup &&
        Array.isArray(assignmentGroup.assignments);
}

function isValidLearnerSubmissions(learnerSubmissions) {
    return Array.isArray(learnerSubmissions) && learnerSubmissions.every(submission =>
        typeof submission === 'object' && 'learner_id' in submission && 'assignment_id' in submission &&
        'submission' in submission && typeof submission.submission === 'object' &&
        'submitted_at' in submission.submission && 'score' in submission.submission
    );
}
// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
  // The provided assignment group.
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,
    group_weight: 25,
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",
        points_possible: 50
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500
      }
    ]
  };
  
  // The provided learner submission data.
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    }
  ];
  
//   function getLearnerData(course, ag, submissions) {
//     // here, we would process this data to achieve the desired result.
//     const result = [
//       {
//         id: 125,
//         avg: 0.985, // (47 + 150) / (50 + 150)
//         1: 0.94, // 47 / 50
//         2: 1.0 // 150 / 150
//       },
//       {
//         id: 132,
//         avg: 0.82, // (39 + 125) / (50 + 150)
//         1: 0.78, // 39 / 50
//         2: 0.833 // late: (140 - 15) / 150
//       }
//     ];
  
//     return result;
//   }
  
  const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);
  
  console.log(result);
  