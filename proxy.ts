import { NextRequest, NextResponse } from "next/server"
import { trackMonthlyVisitor } from "@/lib/analytics"

function getVisitorId(request: NextRequest) {
  const existingId = request.cookies.get("visitor_id")?.value

  if (existingId) {
    return {
      id: existingId,
      isNew: false,
    }
  }

  const newId = crypto.randomUUID()

  return {
    id: newId,
    isNew: true,
  }
}

export async function proxy(request: NextRequest) {
  if (request.method !== "GET") {
    return NextResponse.next()
  }

  const pathname = request.nextUrl.pathname

  const isPageRequest =
    !pathname.startsWith("/api") &&
    !pathname.startsWith("/_next") &&
    !pathname.includes(".")

  if (!isPageRequest) {
    return NextResponse.next()
  }

  const visitor = getVisitorId(request)
  const response = NextResponse.next()

  if (visitor.isNew) {
    await trackMonthlyVisitor(visitor.id)

    response.cookies.set("visitor_id", visitor.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    })
  }

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}