import { NextRequest, NextResponse } from "next/server"
import { google } from "googleapis"

// Weighted selection: newer photos (lower index) have higher probability
function weightedRandomSelection<T>(items: T[], count: number, decay = 0.92): T[] {
  if (items.length <= count) return items

  const weights = items.map((_, i) => Math.pow(decay, i))
  const selected: T[] = []
  const available = [...items.keys()]

  while (selected.length < count && available.length > 0) {
    const totalWeight = available.reduce((sum, idx) => sum + weights[idx], 0)
    let random = Math.random() * totalWeight

    for (let i = 0; i < available.length; i++) {
      random -= weights[available[i]]
      if (random <= 0) {
        selected.push(items[available[i]])
        available.splice(i, 1)
        break
      }
    }
  }

  return selected
}

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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get("limit") || "20", 10)
    const pageToken = searchParams.get("pageToken") || undefined
    const useRandom = searchParams.get("random") === "true"

    const auth = getOAuthClient()
    const drive = google.drive({ version: "v3", auth })

    const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID
    if (!folderId) {
      throw new Error("Drive folder ID not configured")
    }

    // If random selection requested (limited mode), fetch all and apply weighted selection
    if (useRandom && !pageToken) {
      const response = await drive.files.list({
        q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
        fields: "files(id, name, createdTime)",
        orderBy: "createdTime desc",
        pageSize: 1000,
      })

      const allFiles = response.data.files || []
      const selectedFiles = weightedRandomSelection(allFiles, limit)

      const photos = selectedFiles.map((file) => ({
        id: file.id,
        name: file.name,
        url: `/api/photos/${file.id}`,
        createdTime: file.createdTime,
      }))

      return NextResponse.json({ photos, nextPageToken: null })
    }

    // Otherwise, use pagination for batch loading all photos
    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/' and trashed = false`,
      fields: "files(id, name, createdTime), nextPageToken",
      orderBy: "createdTime desc",
      pageSize: limit,
      pageToken: pageToken,
    })

    const files = response.data.files || []

    const photos = files.map((file) => ({
      id: file.id,
      name: file.name,
      url: `/api/photos/${file.id}`,
      createdTime: file.createdTime,
    }))

    return NextResponse.json({
      photos,
      nextPageToken: response.data.nextPageToken || null,
    })
  } catch (error) {
    console.error("Photo list error:", error)
    return NextResponse.json(
      { error: "Failed to list photos" },
      { status: 500 }
    )
  }
}
