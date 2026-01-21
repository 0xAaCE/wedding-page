import { NextRequest, NextResponse } from "next/server"

// This endpoint initiates the OAuth flow - visit this URL to authorize
export async function GET(request: NextRequest) {
  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
  
  if (!clientId) {
    return NextResponse.json({ error: "GOOGLE_OAUTH_CLIENT_ID not configured" }, { status: 500 })
  }

  // Get the base URL from the actual request
  const url = new URL(request.url)
  const baseUrl = `${url.protocol}//${url.host}`
  
  const redirectUri = `${baseUrl}/api/auth/google/callback`
  
  console.log("[v0] Redirect URI being used:", redirectUri)
  
  const authUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth")
  authUrl.searchParams.set("client_id", clientId)
  authUrl.searchParams.set("redirect_uri", redirectUri)
  authUrl.searchParams.set("response_type", "code")
  authUrl.searchParams.set("scope", "https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/spreadsheets")
  authUrl.searchParams.set("access_type", "offline")
  authUrl.searchParams.set("prompt", "consent")

  return NextResponse.redirect(authUrl.toString())
}
