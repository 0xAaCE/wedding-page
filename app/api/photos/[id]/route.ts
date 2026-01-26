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

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const auth = getOAuthClient()
    const drive = google.drive({ version: "v3", auth })

    // Get file metadata first to get mime type
    const metadata = await drive.files.get({
      fileId: id,
      fields: "mimeType, name",
    })

    const mimeType = metadata.data.mimeType || "image/jpeg"

    // Download the file content
    const response = await drive.files.get(
      { fileId: id, alt: "media" },
      { responseType: "arraybuffer" }
    )

    const buffer = Buffer.from(response.data as ArrayBuffer)

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "public, max-age=86400, immutable",
      },
    })
  } catch (error) {
    console.error("Photo fetch error:", error)
    return NextResponse.json(
      { error: "Failed to fetch photo" },
      { status: 500 }
    )
  }
}
