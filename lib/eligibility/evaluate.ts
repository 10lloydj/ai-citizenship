/**
 * Eligibility Evaluation Engine
 *
 * Pure, deterministic functions for evaluating citizenship eligibility.
 * No AI/LLM involvement - rule-based logic only.
 */

import type {
  AnswerRecord,
  Condition,
  CountryRules,
  EligibilityResult,
  Question,
  Rule,
  WizardState,
} from "./types";

// ============================================================================
// Condition Evaluation
// ============================================================================

/**
 * Evaluates a single condition against the answer record
 */
function evaluateCondition(
  condition: Condition,
  answers: AnswerRecord
): boolean {
  const answer = answers[condition.questionId];

  // If no answer exists, condition fails
  if (answer === undefined) {
    return false;
  }

  switch (condition.operator) {
    case "equals":
      return answer === condition.value;

    case "not_equals":
      return answer !== condition.value;

    case "in":
      if (Array.isArray(condition.value)) {
        return condition.value.includes(answer);
      }
      return answer === condition.value;

    case "not_in":
      if (Array.isArray(condition.value)) {
        return !condition.value.includes(answer);
      }
      return answer !== condition.value;

    default:
      return false;
  }
}

/**
 * Evaluates all conditions (AND logic - all must be true)
 */
function evaluateConditions(
  conditions: Condition[],
  answers: AnswerRecord
): boolean {
  return conditions.every((condition) => evaluateCondition(condition, answers));
}

// ============================================================================
// Rule Evaluation
// ============================================================================

/**
 * Finds the first matching rule based on answers
 * Rules are evaluated in priority order (lower priority number = higher priority)
 */
function findMatchingRule(
  rules: Rule[],
  answers: AnswerRecord
): Rule | undefined {
  // Sort rules by priority (ascending)
  const sortedRules = [...rules].sort((a, b) => a.priority - b.priority);

  for (const rule of sortedRules) {
    if (evaluateConditions(rule.conditions, answers)) {
      return rule;
    }
  }

  return;
}

// ============================================================================
// Main Evaluation Function
// ============================================================================

/**
 * Evaluates eligibility based on rules and answers
 *
 * This is the core function - completely deterministic, no AI involved.
 */
export function evaluateEligibility(
  rules: CountryRules,
  answers: AnswerRecord
): EligibilityResult {
  const matchingRule = findMatchingRule(rules.rules, answers);

  if (matchingRule) {
    return matchingRule.result;
  }

  return rules.defaultResult;
}

// ============================================================================
// Question Flow Functions
// ============================================================================

/**
 * Gets the first question to display
 */
export function getFirstQuestion(rules: CountryRules): Question | undefined {
  return rules.questions.at(0);
}

/**
 * Gets the next question based on current answers and flow rules
 */
export function getNextQuestion(
  rules: CountryRules,
  currentQuestionId: string,
  answers: AnswerRecord
): Question | null {
  // Find the flow definition for the current question
  const flow = rules.questionFlow.find(
    (f) => f.questionId === currentQuestionId
  );

  if (!flow) {
    // No flow defined, try to get next question in array order
    const currentIndex = rules.questions.findIndex(
      (q) => q.id === currentQuestionId
    );
    if (currentIndex >= 0 && currentIndex < rules.questions.length - 1) {
      return rules.questions[currentIndex + 1];
    }
    return null;
  }

  // Check branches for conditional flow
  for (const branch of flow.branches) {
    if (evaluateConditions(branch.conditions, answers)) {
      if (branch.nextQuestionId === null) {
        return null; // End of questions
      }
      const nextQuestion = rules.questions.find(
        (q) => q.id === branch.nextQuestionId
      );
      return nextQuestion ?? null;
    }
  }

  // Use default next if no branch matched
  if (flow.defaultNext === null) {
    return null;
  }

  const defaultQuestion = rules.questions.find(
    (q) => q.id === flow.defaultNext
  );
  return defaultQuestion ?? null;
}

/**
 * Gets the previous question from history
 */
export function getPreviousQuestion(
  rules: CountryRules,
  questionHistory: string[]
): Question | null {
  if (questionHistory.length < 2) {
    return null;
  }

  const previousQuestionId = questionHistory.at(-2);
  if (!previousQuestionId) {
    return null;
  }

  const question = rules.questions.find((q) => q.id === previousQuestionId);
  return question ?? null;
}

/**
 * Checks if evaluation is complete (no more questions)
 */
export function isEvaluationComplete(
  rules: CountryRules,
  currentQuestionId: string,
  answers: AnswerRecord
): boolean {
  const nextQuestion = getNextQuestion(rules, currentQuestionId, answers);
  return nextQuestion === null;
}

// ============================================================================
// Wizard State Management
// ============================================================================

/**
 * Creates initial wizard state
 */
export function createWizardState(rules: CountryRules): WizardState {
  const firstQuestion = getFirstQuestion(rules);

  if (!firstQuestion) {
    throw new Error(`No questions defined for country: ${rules.countryCode}`);
  }

  return {
    countryCode: rules.countryCode,
    currentQuestionIndex: 0,
    currentQuestionId: firstQuestion.id,
    answers: {},
    questionHistory: [firstQuestion.id],
    isComplete: false,
  };
}

/**
 * Advances wizard state with an answer
 */
export function advanceWizard(
  rules: CountryRules,
  state: WizardState,
  questionId: string,
  answer: string
): WizardState {
  // Update answers
  const newAnswers = {
    ...state.answers,
    [questionId]: answer,
  };

  // Check if evaluation is complete
  const complete = isEvaluationComplete(rules, questionId, newAnswers);

  if (complete) {
    // Evaluation complete - get result
    const result = evaluateEligibility(rules, newAnswers);
    return {
      ...state,
      answers: newAnswers,
      isComplete: true,
      result,
    };
  }

  // Get next question
  const nextQuestion = getNextQuestion(rules, questionId, newAnswers);

  if (!nextQuestion) {
    // Shouldn't happen if isEvaluationComplete is correct, but handle gracefully
    const result = evaluateEligibility(rules, newAnswers);
    return {
      ...state,
      answers: newAnswers,
      isComplete: true,
      result,
    };
  }

  return {
    ...state,
    currentQuestionIndex: state.currentQuestionIndex + 1,
    currentQuestionId: nextQuestion.id,
    answers: newAnswers,
    questionHistory: [...state.questionHistory, nextQuestion.id],
    isComplete: false,
  };
}

/**
 * Goes back to the previous question
 */
export function goBackInWizard(
  rules: CountryRules,
  state: WizardState
): WizardState {
  if (state.questionHistory.length < 2) {
    return state; // Can't go back from first question
  }

  const previousQuestion = getPreviousQuestion(rules, state.questionHistory);

  if (!previousQuestion) {
    return state;
  }

  // Remove current question from history
  const newHistory = state.questionHistory.slice(0, -1);

  // Remove current question's answer
  const currentQuestionId = state.currentQuestionId;
  const newAnswers = { ...state.answers };
  delete newAnswers[currentQuestionId];

  return {
    ...state,
    currentQuestionIndex: state.currentQuestionIndex - 1,
    currentQuestionId: previousQuestion.id,
    answers: newAnswers,
    questionHistory: newHistory,
    isComplete: false,
    result: undefined,
  };
}

/**
 * Restarts the wizard from the beginning
 */
export function restartWizard(rules: CountryRules): WizardState {
  return createWizardState(rules);
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Gets the current question from wizard state
 */
export function getCurrentQuestion(
  rules: CountryRules,
  state: WizardState
): Question | undefined {
  return rules.questions.find((q) => q.id === state.currentQuestionId);
}

/**
 * Calculates progress percentage
 */
export function getProgress(rules: CountryRules, state: WizardState): number {
  if (state.isComplete) {
    return 100;
  }

  // Estimate based on questions answered vs total questions
  // This is approximate since flow may skip questions
  const totalQuestions = rules.questions.length;
  const answeredQuestions = state.questionHistory.length;

  return Math.min(Math.round((answeredQuestions / totalQuestions) * 100), 99);
}

/**
 * Validates that all required questions have been answered
 */
export function validateAnswers(
  rules: CountryRules,
  answers: AnswerRecord,
  questionHistory: string[]
): { valid: boolean; missingQuestions: string[] } {
  const missingQuestions: string[] = [];

  for (const questionId of questionHistory) {
    const question = rules.questions.find((q) => q.id === questionId);
    if (question?.required && !answers[questionId]) {
      missingQuestions.push(questionId);
    }
  }

  return {
    valid: missingQuestions.length === 0,
    missingQuestions,
  };
}
