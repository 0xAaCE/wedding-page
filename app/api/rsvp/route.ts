import { NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"

function getOAuthClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_OAUTH_CLIENT_ID,
    process.env.GOOGLE_OAUTH_CLIENT_SECRET
  )

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_OAUTH_REFRESH_TOKEN,
  })

  return oauth2Client
}

export async function POST(request: NextRequest) {
  try {
    const { name, dietaryRestrictions } = await request.json()

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Name is required" },
        { status: 400 }
      )
    }

    const auth = getOAuthClient()
    const sheets = google.sheets({ version: "v4", auth })

    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID
    if (!spreadsheetId) {
      throw new Error("Spreadsheet ID not configured")
    }

    const timestamp = new Date().toISOString()
    
    // Get the first sheet name dynamically
    const spreadsheet = await sheets.spreadsheets.get({
      spreadsheetId,
    })
    const firstSheetName = spreadsheet.data.sheets?.[0]?.properties?.title || "Sheet1"
    
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${firstSheetName}!A:C`,
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[timestamp, name, dietaryRestrictions || "None"]],
      },
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("RSVP submission error:", error)
    return NextResponse.json(
      { error: "Failed to submit RSVP" },
      { status: 500 }
    )
  }
}
