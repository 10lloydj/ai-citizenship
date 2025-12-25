import { NextResponse } from "next/server";
import { z } from "zod";
import { getCountryRules, isCountryActive } from "@/lib/eligibility/countries";
import { evaluateEligibility } from "@/lib/eligibility/evaluate";

/**
 * POST /api/eligibility/evaluate
 *
 * Evaluates eligibility based on country and answers.
 * No authentication required - anyone can check eligibility.
 */

const requestSchema = z.object({
  countryCode: z.string().min(2).max(10),
  answers: z.record(z.string(), z.string()),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Validate request body
    const parseResult = requestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parseResult.error.errors },
        { status: 400 }
      );
    }

    const { countryCode, answers } = parseResult.data;

    // Check if country is active
    if (!isCountryActive(countryCode)) {
      return NextResponse.json(
        {
          error: `Country '${countryCode}' is not available for eligibility checks`,
        },
        { status: 400 }
      );
    }

    // Get country rules
    const rules = getCountryRules(countryCode);
    if (!rules) {
      return NextResponse.json(
        { error: `Rules not found for country '${countryCode}'` },
        { status: 404 }
      );
    }

    // Evaluate eligibility
    const result = evaluateEligibility(rules, answers);

    return NextResponse.json({
      result,
      rulesVersion: rules.version,
    });
  } catch (error) {
    console.error("Error evaluating eligibility:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
