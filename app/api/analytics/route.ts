import { NextResponse } from "next/server"
import { getMonthlyVisitors } from "@/lib/analytics"

export async function GET() {
  try {
    const monthlyVisitors = await getMonthlyVisitors()

    return NextResponse.json({
      monthlyVisitors,
    })
  } catch (error) {
    console.error("[analytics] Failed to read visitors", error)

    return NextResponse.json(
      {
        monthlyVisitors: null,
      },
      { status: 500 },
    )
  }
}