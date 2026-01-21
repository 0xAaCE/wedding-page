import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const code = searchParams.get("code")
  const error = searchParams.get("error")

  if (error) {
    return NextResponse.json({ error: `Authorization failed: ${error}` }, { status: 400 })
  }

  if (!code) {
    return NextResponse.json({ error: "No authorization code received" }, { status: 400 })
  }

  const clientId = process.env.GOOGLE_OAUTH_CLIENT_ID
  const clientSecret = process.env.GOOGLE_OAUTH_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    return NextResponse.json({ error: "OAuth credentials not configured" }, { status: 500 })
  }

  // Get the base URL from the actual request
  const url = new URL(request.url)
  const baseUrl = `${url.protocol}//${url.host}`
  const redirectUri = `${baseUrl}/api/auth/google/callback`
  
  console.log("[v0] Callback redirect URI:", redirectUri)

  try {
    // Exchange code for tokens
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    })

    const tokens = await tokenResponse.json()

    if (tokens.error) {
      return NextResponse.json({ error: tokens.error_description || tokens.error }, { status: 400 })
    }

    // Display the refresh token for the user to save
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authorization Successful</title>
          <style>
            body {
              font-family: system-ui, sans-serif;
              max-width: 600px;
              margin: 100px auto;
              padding: 20px;
              background: #f9f7f4;
              color: #3d3424;
            }
            h1 { color: #8b7355; }
            .token-box {
              background: #fff;
              border: 1px solid #d4c9b8;
              border-radius: 8px;
              padding: 16px;
              margin: 20px 0;
              word-break: break-all;
              font-family: monospace;
              font-size: 14px;
            }
            .steps {
              background: #fff;
              border-radius: 8px;
              padding: 20px;
              margin-top: 20px;
            }
            .steps li { margin: 10px 0; }
            .warning {
              background: #fef3c7;
              border: 1px solid #f59e0b;
              border-radius: 8px;
              padding: 12px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <h1>Authorization Successful!</h1>
          <p>Copy this refresh token and save it as <strong>GOOGLE_OAUTH_REFRESH_TOKEN</strong> in your environment variables:</p>
          <div class="token-box">${tokens.refresh_token || "No refresh token received - you may have already authorized. Try revoking access at myaccount.google.com/permissions and try again."}</div>
          <div class="warning">
            <strong>Important:</strong> Keep this token secret! Anyone with this token can upload files to your Google Drive.
          </div>
          <div class="steps">
            <h3>Next Steps:</h3>
            <ol>
              <li>Copy the refresh token above</li>
              <li>Go to your v0 project settings</li>
              <li>Add it as <code>GOOGLE_OAUTH_REFRESH_TOKEN</code></li>
              <li>Delete or restrict access to <code>/api/auth/google</code> route (optional but recommended)</li>
            </ol>
          </div>
        </body>
      </html>
    `

    return new NextResponse(html, {
      headers: { "Content-Type": "text/html" },
    })
  } catch (err) {
    console.error("Token exchange error:", err)
    return NextResponse.json({ error: "Failed to exchange authorization code" }, { status: 500 })
  }
}
