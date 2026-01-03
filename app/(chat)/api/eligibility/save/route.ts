import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/app/(auth)/auth";
import { saveEligibilityRun } from "@/lib/db/queries";
import { getCountryRules, isCountryActive } from "@/lib/eligibility/countries";

// Force dynamic to prevent static prerendering (auth requires headers)
export const dynamic = "force-dynamic";

/**
 * POST /api/eligibility/save
 *
 * Saves an eligibility run for the authenticated user.
 * Requires authentication.
 */

const requestSchema = z.object({
  countryCode: z.string().min(2).max(10),
  rulesVersion: z.string().min(1).max(50),
  answers: z.record(z.string(), z.string()),
  result: z.object({
    status: z.enum(["eligible", "not_eligible", "needs_info"]),
    explanation: z.string(),
    reasoning: z.string().optional(),
    documents: z.array(
      z.object({
        name: z.string(),
        description: z.string(),
        mandatory: z.boolean(),
        tips: z.string().optional(),
      })
    ),
    nextSteps: z.array(
      z.object({
        order: z.number(),
        title: z.string(),
        description: z.string(),
        link: z.string().optional(),
      })
    ),
    caveats: z.array(z.string()).optional(),
  }),
});

export async function POST(request: Request) {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate request body
    const parseResult = requestSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid request body", details: parseResult.error.errors },
        { status: 400 }
      );
    }

    const { countryCode, rulesVersion, answers, result } = parseResult.data;

    // Verify country is valid
    if (!isCountryActive(countryCode)) {
      return NextResponse.json(
        { error: `Country '${countryCode}' is not valid` },
        { status: 400 }
      );
    }

    // Verify rules version matches current rules
    const rules = getCountryRules(countryCode);
    if (rules && rules.version !== rulesVersion) {
      // Log warning but still save - rules may have updated
      console.warn(
        `Rules version mismatch for ${countryCode}: expected ${rules.version}, got ${rulesVersion}`
      );
    }

    // Save to database
    const savedRun = await saveEligibilityRun({
      userId: session.user.id,
      countryCode,
      rulesVersion,
      answers,
      result,
    });

    return NextResponse.json({
      success: true,
      id: savedRun.id,
    });
  } catch (error) {
    console.error("Error saving eligibility run:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
