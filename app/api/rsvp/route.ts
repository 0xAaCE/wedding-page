import { NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"

async function getAuthClient() {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    },
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  })
  return auth
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

    const auth = await getAuthClient()
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
