/**
 * Eligibility Engine Types
 *
 * These types define the structure of the deterministic eligibility checking system.
 * No AI/LLM involvement - purely rule-based evaluation.
 */

// ============================================================================
// Question & Answer Types
// ============================================================================

/**
 * Supported answer types for questions
 */
export type AnswerType = "boolean" | "select" | "text";

/**
 * A single answer option for select-type questions
 */
export type AnswerOption = {
  value: string;
  label: string;
  /** Optional description shown below the option */
  description?: string;
};

/**
 * A question in the eligibility wizard
 */
export type Question = {
  /** Unique identifier for the question */
  id: string;
  /** The question text displayed to the user */
  text: string;
  /** Optional help text or clarification */
  helpText?: string;
  /** Type of answer expected */
  type: AnswerType;
  /** Options for select-type questions */
  options?: AnswerOption[];
  /** Whether this question is required */
  required: boolean;
};

/**
 * User's answer to a question
 */
export type Answer = {
  questionId: string;
  value: string;
};

/**
 * Map of question IDs to answer values
 */
export type AnswerRecord = Record<string, string>;

// ============================================================================
// Eligibility Result Types
// ============================================================================

/**
 * Possible eligibility statuses
 */
export type EligibilityStatus = "eligible" | "not_eligible" | "needs_info";

/**
 * A document required for the citizenship application
 */
export type RequiredDocument = {
  /** Name of the document */
  name: string;
  /** Description of what's needed */
  description: string;
  /** Whether this document is mandatory */
  mandatory: boolean;
  /** Tips for obtaining this document */
  tips?: string;
};

/**
 * A next step the user should take
 */
export type NextStep = {
  /** Step number/order */
  order: number;
  /** Title of the step */
  title: string;
  /** Description of what to do */
  description: string;
  /** Optional link for more info */
  link?: string;
};

/**
 * The result of an eligibility evaluation
 */
export type EligibilityResult = {
  /** The eligibility status */
  status: EligibilityStatus;
  /** Human-readable explanation of the result */
  explanation: string;
  /** Detailed reasoning (shown in expanded view) */
  reasoning?: string;
  /** Documents required for application */
  documents: RequiredDocument[];
  /** Next steps for the user */
  nextSteps: NextStep[];
  /** Confidence notes or caveats */
  caveats?: string[];
};

// ============================================================================
// Rules Engine Types
// ============================================================================

/**
 * A condition that evaluates answers to determine flow or result
 */
export type Condition = {
  /** Question ID to check */
  questionId: string;
  /** Operator for comparison */
  operator: "equals" | "not_equals" | "in" | "not_in";
  /** Value(s) to compare against */
  value: string | string[];
};

/**
 * A rule that determines what happens based on conditions
 */
export type Rule = {
  /** Unique identifier for the rule */
  id: string;
  /** Conditions that must ALL be true for this rule to apply */
  conditions: Condition[];
  /** The result if conditions are met */
  result: EligibilityResult;
  /** Priority (lower = higher priority, evaluated first) */
  priority: number;
};

/**
 * Question flow control - determines which question comes next
 */
export type QuestionFlow = {
  /** Current question ID */
  questionId: string;
  /** Conditions and their target questions */
  branches: Array<{
    /** Conditions that determine this branch */
    conditions: Condition[];
    /** Next question ID (null = end of questions) */
    nextQuestionId: string | null;
  }>;
  /** Default next question if no conditions match */
  defaultNext: string | null;
};

/**
 * Complete rules definition for a country
 */
export type CountryRules = {
  /** Country code (e.g., 'jm' for Jamaica) */
  countryCode: string;
  /** Version of the rules (for auditing) */
  version: string;
  /** Human-readable name */
  countryName: string;
  /** Description of this citizenship path */
  description: string;
  /** The ordered list of questions */
  questions: Question[];
  /** Flow control for question ordering */
  questionFlow: QuestionFlow[];
  /** Rules for determining eligibility */
  rules: Rule[];
  /** Default result if no rules match */
  defaultResult: EligibilityResult;
  /** Last updated date */
  lastUpdated: string;
  /** Source references */
  sources?: string[];
};

// ============================================================================
// Wizard State Types
// ============================================================================

/**
 * Current state of the eligibility wizard
 */
export type WizardState = {
  /** Country being checked */
  countryCode: string;
  /** Current question index */
  currentQuestionIndex: number;
  /** Current question ID */
  currentQuestionId: string;
  /** All answers so far */
  answers: AnswerRecord;
  /** Questions that have been shown (for back navigation) */
  questionHistory: string[];
  /** Whether the wizard is complete */
  isComplete: boolean;
  /** The final result (if complete) */
  result?: EligibilityResult;
};

// ============================================================================
// API Types
// ============================================================================

/**
 * Request body for eligibility evaluation
 */
export type EvaluateRequest = {
  countryCode: string;
  answers: AnswerRecord;
};

/**
 * Response from eligibility evaluation
 */
export type EvaluateResponse = {
  result: EligibilityResult;
  rulesVersion: string;
};

/**
 * Request to save an eligibility run (requires auth)
 */
export type SaveRunRequest = {
  countryCode: string;
  rulesVersion: string;
  answers: AnswerRecord;
  result: EligibilityResult;
};

/**
 * A saved eligibility run record
 */
export type EligibilityRun = {
  id: string;
  userId: string;
  countryCode: string;
  rulesVersion: string;
  answers: AnswerRecord;
  result: EligibilityResult;
  createdAt: Date;
};

/**
 * Summary of an eligibility run (for history list)
 */
export type EligibilityRunSummary = {
  id: string;
  countryCode: string;
  countryName: string;
  status: EligibilityStatus;
  createdAt: Date;
};
