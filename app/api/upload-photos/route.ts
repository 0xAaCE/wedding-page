import { NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"
import { Readable } from "stream"

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
    const formData = await request.formData()
    const photos = formData.getAll("photos") as File[]
    const guestName = formData.get("guestName") as string || "Anonymous"

    if (!photos || photos.length === 0) {
      return NextResponse.json(
        { error: "No photos provided" },
        { status: 400 }
      )
    }

    const auth = getOAuthClient()
    const drive = google.drive({ version: "v3", auth })

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID
    if (!folderId) {
      throw new Error("Drive folder ID not configured")
    }

    const uploadedFiles = []

    for (const photo of photos) {
      const buffer = Buffer.from(await photo.arrayBuffer())
      const stream = Readable.from(buffer)

      const timestamp = Date.now()
      const sanitizedName = guestName.replace(/[^a-zA-Z0-9]/g, "_")
      const fileName = `${sanitizedName}_${timestamp}_${photo.name}`

      const response = await drive.files.create({
        requestBody: {
          name: fileName,
          parents: [folderId],
        },
        media: {
          mimeType: photo.type,
          body: stream,
        },
        fields: "id, name",
      })

      uploadedFiles.push({
        id: response.data.id,
        name: response.data.name,
      })
    }

    return NextResponse.json({ 
      success: true, 
      uploadedCount: uploadedFiles.length 
    })
  } catch (error) {
    console.error("Photo upload error:", error)
    return NextResponse.json(
      { error: "Failed to upload photos" },
      { status: 500 }
    )
  }
}
