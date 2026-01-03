import { NextResponse } from "next/server";
import { auth } from "@/app/(auth)/auth";
import { getEligibilityRunsByUserId } from "@/lib/db/queries";
import { getCountryFlag, getCountryName } from "@/lib/eligibility/countries";
import type { EligibilityResult } from "@/lib/eligibility/types";

// Force dynamic to prevent static prerendering (auth requires headers)
export const dynamic = "force-dynamic";

/**
 * GET /api/eligibility/history
 *
 * Returns the user's eligibility check history.
 * Requires authentication.
 */

export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    // Fetch user's eligibility runs
    const runs = await getEligibilityRunsByUserId({
      userId: session.user.id,
      limit: 50,
    });

    // Transform to summary format
    const history = runs.map((run) => {
      const result = run.result as EligibilityResult;
      return {
        id: run.id,
        countryCode: run.countryCode,
        countryName: getCountryName(run.countryCode),
        countryFlag: getCountryFlag(run.countryCode),
        status: result.status,
        rulesVersion: run.rulesVersion,
        createdAt: run.createdAt,
      };
    });

    return NextResponse.json({ history });
  } catch (error) {
    console.error("Error fetching eligibility history:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
