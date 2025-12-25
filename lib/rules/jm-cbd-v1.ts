/**
 * Jamaica Citizenship by Descent Rules
 * Version: 1.0.0
 *
 * Based on the Jamaican Nationality Act and related regulations.
 * This covers citizenship by descent through Jamaican-born parents or grandparents.
 *
 * Sources:
 * - Jamaican Nationality Act (1962)
 * - Passport, Immigration and Citizenship Agency (PICA) guidelines
 */

import type {
  CountryRules,
  EligibilityResult,
  Question,
  QuestionFlow,
  Rule,
} from "@/lib/eligibility/types";

// ============================================================================
// Questions
// ============================================================================

const questions: Question[] = [
  {
    id: "born_in_jamaica",
    text: "Were you born in Jamaica?",
    helpText:
      "If you were born in Jamaica, you may already be a citizen and don't need citizenship by descent.",
    type: "boolean",
    required: true,
  },
  {
    id: "parent_jamaican_birth",
    text: "Was either of your parents born in Jamaica?",
    helpText:
      "This includes biological parents. Adoptive parents may also qualify under certain conditions.",
    type: "boolean",
    required: true,
  },
  {
    id: "parent_citizen_at_birth",
    text: "Was your Jamaican parent a Jamaican citizen at the time of your birth?",
    helpText:
      "Jamaica became independent on August 6, 1962. Parents born before this date became citizens automatically if they were Jamaican at independence.",
    type: "boolean",
    required: true,
  },
  {
    id: "grandparent_jamaican_birth",
    text: "Was either of your grandparents born in Jamaica?",
    helpText: "This applies if neither parent was born in Jamaica.",
    type: "boolean",
    required: true,
  },
  {
    id: "parent_registered",
    text: "Did your parent register their birth or claim Jamaican citizenship?",
    helpText:
      "If your parent was born outside Jamaica to a Jamaican grandparent, they may have needed to register to be recognized as a citizen.",
    type: "select",
    options: [
      { value: "yes", label: "Yes, they registered/claimed citizenship" },
      { value: "no", label: "No, they did not register" },
      { value: "unsure", label: "I'm not sure" },
    ],
    required: true,
  },
  {
    id: "birth_registered",
    text: "Has your birth been registered at a Jamaican consulate or embassy?",
    helpText:
      "Registering your birth establishes your claim to citizenship by descent.",
    type: "select",
    options: [
      { value: "yes", label: "Yes, it has been registered" },
      { value: "no", label: "No, not yet registered" },
      { value: "unsure", label: "I'm not sure" },
    ],
    required: true,
  },
  {
    id: "can_provide_documents",
    text: "Can you provide documentary evidence of your Jamaican lineage?",
    helpText:
      "This includes birth certificates, passports, or other official documents proving your parent's or grandparent's Jamaican birth/citizenship.",
    type: "boolean",
    required: true,
  },
];

// ============================================================================
// Question Flow
// ============================================================================

const questionFlow: QuestionFlow[] = [
  {
    questionId: "born_in_jamaica",
    branches: [
      {
        conditions: [
          { questionId: "born_in_jamaica", operator: "equals", value: "true" },
        ],
        nextQuestionId: null, // End - already a citizen
      },
    ],
    defaultNext: "parent_jamaican_birth",
  },
  {
    questionId: "parent_jamaican_birth",
    branches: [
      {
        conditions: [
          {
            questionId: "parent_jamaican_birth",
            operator: "equals",
            value: "true",
          },
        ],
        nextQuestionId: "parent_citizen_at_birth",
      },
    ],
    defaultNext: "grandparent_jamaican_birth",
  },
  {
    questionId: "parent_citizen_at_birth",
    branches: [],
    defaultNext: "birth_registered",
  },
  {
    questionId: "grandparent_jamaican_birth",
    branches: [
      {
        conditions: [
          {
            questionId: "grandparent_jamaican_birth",
            operator: "equals",
            value: "true",
          },
        ],
        nextQuestionId: "parent_registered",
      },
    ],
    defaultNext: null, // End - no Jamaican lineage
  },
  {
    questionId: "parent_registered",
    branches: [],
    defaultNext: "birth_registered",
  },
  {
    questionId: "birth_registered",
    branches: [],
    defaultNext: "can_provide_documents",
  },
  {
    questionId: "can_provide_documents",
    branches: [],
    defaultNext: null, // End of questions
  },
];

// ============================================================================
// Result Templates
// ============================================================================

const eligibleParentResult: EligibilityResult = {
  status: "eligible",
  explanation:
    "Based on your answers, you are likely eligible for Jamaican citizenship by descent through your parent.",
  reasoning:
    "Under the Jamaican Nationality Act, a person born outside Jamaica is entitled to citizenship if, at the time of their birth, their parent was a Jamaican citizen. Since your parent was born in Jamaica and was a citizen at your birth, you have a strong claim to citizenship by descent.",
  documents: [
    {
      name: "Your birth certificate",
      description: "Original or certified copy showing your parents' names",
      mandatory: true,
      tips: "Must be a long-form certificate with parental information",
    },
    {
      name: "Parent's Jamaican birth certificate",
      description:
        "Original or certified copy of your Jamaican parent's birth certificate",
      mandatory: true,
      tips: "Can be obtained from the Registrar General's Department in Jamaica",
    },
    {
      name: "Parent's proof of citizenship",
      description:
        "Jamaican passport or citizenship certificate of your parent",
      mandatory: true,
    },
    {
      name: "Valid passport photos",
      description:
        "Recent passport-sized photographs meeting Jamaican requirements",
      mandatory: true,
    },
    {
      name: "Proof of identity",
      description: "Your current valid passport or national ID",
      mandatory: true,
    },
  ],
  nextSteps: [
    {
      order: 1,
      title: "Gather required documents",
      description:
        "Collect all the documents listed above. Ensure certificates are certified copies if not originals.",
    },
    {
      order: 2,
      title: "Complete application form",
      description:
        "Download and complete the Application for Registration as a Citizen of Jamaica by Descent from PICA.",
      link: "https://www.pica.gov.jm",
    },
    {
      order: 3,
      title: "Submit application",
      description:
        "Submit your application at a Jamaican embassy, consulate, or directly to PICA in Jamaica.",
    },
    {
      order: 4,
      title: "Pay fees",
      description:
        "Pay the applicable processing fees. Check current fees with your local Jamaican mission.",
    },
    {
      order: 5,
      title: "Await processing",
      description:
        "Processing times vary. You will be notified once your application is processed.",
    },
  ],
  caveats: [
    "This is an indicative assessment only and does not constitute legal advice.",
    "Final determination is made by the Passport, Immigration and Citizenship Agency (PICA).",
    "Processing times and requirements may vary.",
  ],
};

const eligibleGrandparentResult: EligibilityResult = {
  status: "eligible",
  explanation:
    "Based on your answers, you may be eligible for Jamaican citizenship by descent through your grandparent, but your parent's citizenship status needs to be established first.",
  reasoning:
    "Citizenship by descent through grandparents requires that your parent's citizenship was properly registered or recognized. If your parent did not register, you may need to help establish their citizenship first before claiming your own.",
  documents: [
    {
      name: "Your birth certificate",
      description: "Original or certified copy showing your parents' names",
      mandatory: true,
    },
    {
      name: "Parent's birth certificate",
      description: "Showing your parent's parents (your grandparents)",
      mandatory: true,
    },
    {
      name: "Grandparent's Jamaican birth certificate",
      description: "Proving your grandparent was born in Jamaica",
      mandatory: true,
      tips: "Can be obtained from the Registrar General's Department in Jamaica",
    },
    {
      name: "Parent's citizenship documentation",
      description:
        "Evidence of your parent's Jamaican citizenship registration or passport",
      mandatory: true,
      tips: "If your parent never registered, you may need to help them do so first",
    },
    {
      name: "Valid passport photos",
      description: "Recent passport-sized photographs",
      mandatory: true,
    },
  ],
  nextSteps: [
    {
      order: 1,
      title: "Verify parent's citizenship status",
      description:
        "Confirm whether your parent has registered as a Jamaican citizen. If not, they may need to do so first.",
    },
    {
      order: 2,
      title: "Gather lineage documents",
      description:
        "Collect birth certificates for yourself, your parent, and your Jamaican grandparent.",
    },
    {
      order: 3,
      title: "Contact PICA or a Jamaican mission",
      description:
        "Discuss your specific situation as grandparent cases can be more complex.",
      link: "https://www.pica.gov.jm",
    },
    {
      order: 4,
      title: "Complete application",
      description: "Follow the guidance provided by PICA for your situation.",
    },
  ],
  caveats: [
    "Citizenship through grandparents is more complex than through parents.",
    "Your parent's citizenship status must be established first.",
    "We strongly recommend consulting with PICA or a Jamaican embassy.",
  ],
};

const needsInfoResult: EligibilityResult = {
  status: "needs_info",
  explanation:
    "We need more information to determine your eligibility. Some details about your parent's citizenship status are unclear.",
  reasoning:
    "Your eligibility depends on factors we couldn't fully determine from your answers, such as whether your parent properly registered their citizenship.",
  documents: [],
  nextSteps: [
    {
      order: 1,
      title: "Research your parent's citizenship history",
      description:
        "Find out if your parent ever held a Jamaican passport or registered as a citizen.",
    },
    {
      order: 2,
      title: "Contact PICA",
      description:
        "The Passport, Immigration and Citizenship Agency can help clarify your specific situation.",
      link: "https://www.pica.gov.jm",
    },
    {
      order: 3,
      title: "Consult a Jamaican embassy",
      description:
        "Your local Jamaican embassy or consulate can provide guidance on your eligibility.",
    },
  ],
  caveats: [
    "This assessment is incomplete due to missing information.",
    "Your eligibility cannot be determined without clarifying your parent's status.",
  ],
};

const notEligibleNoLineageResult: EligibilityResult = {
  status: "not_eligible",
  explanation:
    "Based on your answers, you do not appear to be eligible for Jamaican citizenship by descent.",
  reasoning:
    "Citizenship by descent requires having a parent or grandparent who was born in Jamaica or was a Jamaican citizen. Without this lineage, citizenship by descent is not available.",
  documents: [],
  nextSteps: [
    {
      order: 1,
      title: "Explore other pathways",
      description:
        "Jamaica offers other routes to citizenship, such as citizenship by marriage or naturalization.",
    },
    {
      order: 2,
      title: "Verify your family history",
      description:
        "Double-check your family tree—there may be Jamaican ancestry you're not aware of.",
    },
    {
      order: 3,
      title: "Contact PICA for confirmation",
      description:
        "If you believe there may be an error, contact PICA to discuss your situation.",
      link: "https://www.pica.gov.jm",
    },
  ],
  caveats: [
    "This assessment is based on your answers. If your family history is different, results may vary.",
  ],
};

const alreadyCitizenResult: EligibilityResult = {
  status: "eligible",
  explanation:
    "If you were born in Jamaica, you are likely already a Jamaican citizen by birth!",
  reasoning:
    "Under Jamaican law, anyone born in Jamaica is generally entitled to Jamaican citizenship by birth. You do not need to apply for citizenship by descent.",
  documents: [
    {
      name: "Your Jamaican birth certificate",
      description: "Your original birth certificate from Jamaica",
      mandatory: true,
    },
  ],
  nextSteps: [
    {
      order: 1,
      title: "Obtain your birth certificate",
      description:
        "If you don't have it, request a copy from Jamaica's Registrar General's Department.",
    },
    {
      order: 2,
      title: "Apply for a Jamaican passport",
      description:
        "Use your birth certificate to apply for a Jamaican passport through PICA.",
      link: "https://www.pica.gov.jm",
    },
  ],
  caveats: [
    "If you were born before August 6, 1962, different rules may apply.",
    "This assumes standard circumstances. Some exceptions exist.",
  ],
};

// ============================================================================
// Rules
// ============================================================================

const rules: Rule[] = [
  // Rule 1: Born in Jamaica - already a citizen
  {
    id: "born_in_jamaica",
    conditions: [
      { questionId: "born_in_jamaica", operator: "equals", value: "true" },
    ],
    result: alreadyCitizenResult,
    priority: 1,
  },

  // Rule 2: Parent born in Jamaica and was citizen at birth - eligible
  {
    id: "parent_jamaican_citizen",
    conditions: [
      { questionId: "born_in_jamaica", operator: "equals", value: "false" },
      {
        questionId: "parent_jamaican_birth",
        operator: "equals",
        value: "true",
      },
      {
        questionId: "parent_citizen_at_birth",
        operator: "equals",
        value: "true",
      },
    ],
    result: eligibleParentResult,
    priority: 2,
  },

  // Rule 3: Parent born in Jamaica but not citizen at birth - needs more info
  {
    id: "parent_jamaican_not_citizen",
    conditions: [
      { questionId: "born_in_jamaica", operator: "equals", value: "false" },
      {
        questionId: "parent_jamaican_birth",
        operator: "equals",
        value: "true",
      },
      {
        questionId: "parent_citizen_at_birth",
        operator: "equals",
        value: "false",
      },
    ],
    result: needsInfoResult,
    priority: 3,
  },

  // Rule 4: Grandparent Jamaican, parent registered - eligible
  {
    id: "grandparent_jamaican_parent_registered",
    conditions: [
      { questionId: "born_in_jamaica", operator: "equals", value: "false" },
      {
        questionId: "parent_jamaican_birth",
        operator: "equals",
        value: "false",
      },
      {
        questionId: "grandparent_jamaican_birth",
        operator: "equals",
        value: "true",
      },
      { questionId: "parent_registered", operator: "equals", value: "yes" },
    ],
    result: eligibleGrandparentResult,
    priority: 4,
  },

  // Rule 5: Grandparent Jamaican, parent not registered - needs info
  {
    id: "grandparent_jamaican_parent_not_registered",
    conditions: [
      { questionId: "born_in_jamaica", operator: "equals", value: "false" },
      {
        questionId: "parent_jamaican_birth",
        operator: "equals",
        value: "false",
      },
      {
        questionId: "grandparent_jamaican_birth",
        operator: "equals",
        value: "true",
      },
      {
        questionId: "parent_registered",
        operator: "in",
        value: ["no", "unsure"],
      },
    ],
    result: needsInfoResult,
    priority: 5,
  },

  // Rule 6: No Jamaican parent or grandparent - not eligible
  {
    id: "no_jamaican_lineage",
    conditions: [
      { questionId: "born_in_jamaica", operator: "equals", value: "false" },
      {
        questionId: "parent_jamaican_birth",
        operator: "equals",
        value: "false",
      },
      {
        questionId: "grandparent_jamaican_birth",
        operator: "equals",
        value: "false",
      },
    ],
    result: notEligibleNoLineageResult,
    priority: 6,
  },
];

// ============================================================================
// Default Result
// ============================================================================

const defaultResult: EligibilityResult = {
  status: "needs_info",
  explanation:
    "We couldn't determine your eligibility based on the provided information.",
  reasoning:
    "Your answers didn't match any of our predefined eligibility paths. This may indicate an unusual situation that requires individual assessment.",
  documents: [],
  nextSteps: [
    {
      order: 1,
      title: "Contact PICA directly",
      description:
        "Your situation may require individual assessment. Contact the Passport, Immigration and Citizenship Agency.",
      link: "https://www.pica.gov.jm",
    },
  ],
  caveats: [
    "This tool covers common scenarios but cannot account for all situations.",
  ],
};

// ============================================================================
// Export Rules
// ============================================================================

export const jamaicaCitizenshipByDescentRules: CountryRules = {
  countryCode: "jm",
  version: "1.0.0",
  countryName: "Jamaica",
  description:
    "Citizenship by descent for individuals with Jamaican parents or grandparents",
  questions,
  questionFlow,
  rules,
  defaultResult,
  lastUpdated: "2025-01-01",
  sources: [
    "Jamaican Nationality Act (1962)",
    "Passport, Immigration and Citizenship Agency (PICA) - https://www.pica.gov.jm",
  ],
};
