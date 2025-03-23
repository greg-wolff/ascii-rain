// Google Sheets API integration using fetch
const SPREADSHEET_ID = "1ZhxPLpf45NL9DrPdE0l7eJivIetBJM5NY6_Fglgz-Ak";
const SHEET_NAME = "Sheet1";
const SERVICE_ACCOUNT_EMAIL =
  "glassflorist@glassflorist.iam.gserviceaccount.com";

// Service account private key
const PRIVATE_KEY = `-----BEGIN PRIVATE KEY-----
MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCfXpdZL4I7XK0s
NhQQZH5/qLp/yT8w2U2jXR49FkmCAui4jpgvecjogc6rraPAdP6GRDUk0NSFNpfb
fiYM6JcJBxsb4x0UI+dlTcmZ4Ifrn9vhzKK/XBBxdLyYAMXM/gpK8C7NrbFS11t0
lkrcSueMwZ74YNDqDeO9M4s94a1A3Tw83KPLiYK5cDaB6e46bOMPZYVyHC0RiS6v
X1gp78MFDHhUowP8cxay5NF1OY3tqLxB5y+mJ/t330U5rE0UTmMC7GlkC3cLCLYF
f8abJ8w/tgSjK9fTanr1jiZAE/NV4/6PUxiswXxvDQzPnUi4tXtBddI3voKnqBqE
6n+AiwldAgMBAAECggEAEGAZ0RIuoYbeTGKqIR0SWm+t6h91nMFXVufkiYZWu0Mt
Qnl0bbxnxmxAHifTYZ0j4gv0IfpLO/zmEameo0jq7ASM5oqpnD4sMp6RjnwhuzZL
06HBP0RodB/4mO3LZUrdJ+ISDRRB2i9CuHIQ8x3HORFUElVwYfxXYEOBlTQxJy7q
zBCuL+lcZaSLG3galHGQdTDKJaUC/5BjzekUX4iUB0STDjiK+q15g7i8tWte8P+r
vjUxXFb9toBlkbEeOqI8AbC3PDjJeQMuzAvqeD2SBfDmFvTfhAcfrJ5vgYWRD+5r
Stwvmd3QYzqjf2H+7IIwTJhK93pXVIn1Vlx/VOB4wQKBgQDSjQHKcdJ9NlL+r1a8
MzlKJ6W/l9cBnEmXyYD2VRh6RPqGt2hMDkI18GhoA96q/QYCjn1cyxEbA49hR/wC
91igbxFD/s1sUc2QaOtaHx8SKvDnOLbauvvAU0A6si7e3rwIPF2DHEQHit6sXa0F
eVBcjwpZu0UkEVao++6xeDwlSQKBgQDBxVDXWeJZG/qYTomJmKU7IQel+ooutJs7
a3/dDlxu2SNETo0q66okTocKPqN7wBqZizuc0JVkY6gpNLkJRGcs8wVPBoFq/N/q
aXWI/ZdaYBUs7pBrFGDnC+ikAny94k4VctYqW3EhN2WzUbheEVpx2KQ1DfMkY6G8
8l7PbMEHdQKBgDSJjNXYGv61bHYyiEEDwxrW08v/9l1ngxGF7VEKIMZ5qc2tvC+m
Ky1MZLD3rjsaUcKXjX53CTilZcSPcrnGwG2f6T3/OYD61IFhPMDLHTSqVFxN0Yq4
t5Lg8xjyVzGzgFXJwkex6OO86h02brL792pxItMLIJCEZwxZeND9wHxJAoGAIr2j
vtiIsn1HsqLyGc9aYH2Nh36h47nR0xd090cp313i6s5ClR1nhdbmcznDyd4pZroF
2Bm1jygm8CxZuIWhEfgITaDW9z2bT8XUotkEl9l+Mm4bSnd+4C3MagtgHhNC+Kl8
KF/4qoHqI/pU2di2pI648iIsI6wRRXUW9o2DFjkCgYEAsl3fDmphu9GlkXnixODm
9yWFsD0QVhCx4+6Xj9bAPNhFRp4UD5Qb37XTzR1yvc8Zye3jSVwnjwXSNHfkbjI1
6e+Fv2n/Rsqf+495SQXYrH0O6IWlm8yNsIJv5W0J5flox6AQsDRcnIwAZulqK3Fn
6IzqHrY2AKdYTz056bwQpTI=
-----END PRIVATE KEY-----`;

// Helper function to base64url encode
function base64urlEncode(str) {
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

// Helper function to convert string to ArrayBuffer
function str2ab(str) {
  const buf = new ArrayBuffer(str.length);
  const bufView = new Uint8Array(buf);
  for (let i = 0; i < str.length; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

// Import private key and create a signing key
async function importPrivateKey() {
  const pemHeader = "-----BEGIN PRIVATE KEY-----";
  const pemFooter = "-----END PRIVATE KEY-----";
  const pemContents = PRIVATE_KEY.substring(
    PRIVATE_KEY.indexOf(pemHeader) + pemHeader.length,
    PRIVATE_KEY.indexOf(pemFooter)
  ).replace(/\s/g, "");

  const binaryDer = atob(pemContents);
  const binaryDerBuffer = str2ab(binaryDer);

  return await window.crypto.subtle.importKey(
    "pkcs8",
    binaryDerBuffer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: { name: "SHA-256" },
    },
    true,
    ["sign"]
  );
}

// Create and sign JWT
async function createSignedJWT() {
  const now = Math.floor(Date.now() / 1000);

  const header = {
    alg: "RS256",
    typ: "JWT",
  };

  const payload = {
    iss: SERVICE_ACCOUNT_EMAIL,
    sub: SERVICE_ACCOUNT_EMAIL,
    scope:
      "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  };

  console.log("Creating JWT with payload:", payload);

  const encodedHeader = base64urlEncode(JSON.stringify(header));
  const encodedPayload = base64urlEncode(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;

  console.log("JWT before signature:", signingInput);

  const key = await importPrivateKey();
  const signature = await window.crypto.subtle.sign(
    { name: "RSASSA-PKCS1-v1_5" },
    key,
    new TextEncoder().encode(signingInput)
  );

  const encodedSignature = base64urlEncode(
    String.fromCharCode(...new Uint8Array(signature))
  );
  const finalJWT = `${signingInput}.${encodedSignature}`;
  console.log("Final JWT:", finalJWT);
  return finalJWT;
}

async function getAccessToken() {
  const jwt = await createSignedJWT();

  console.log("Requesting access token with JWT...");
  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=${jwt}`,
  });

  const data = await response.json();
  console.log("Token response:", data);

  if (!data.access_token) {
    throw new Error(`Failed to get access token: ${JSON.stringify(data)}`);
  }
  return data.access_token;
}

export const logToSheet = async (message) => {
  try {
    console.log("Getting access token...");
    const accessToken = await getAccessToken();
    console.log("Got access token:", accessToken.substring(0, 10) + "...");

    const timestamp = new Date()
      .toLocaleString("en-US", {
        timeZone: "America/Los_Angeles",
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "numeric",
        hour12: true,
      })
      .toLowerCase();
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${SHEET_NAME}:append?valueInputOption=RAW`;
    console.log("Making request to:", url);

    const requestBody = {
      values: [[timestamp, message]],
    };
    console.log("Request body:", requestBody);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
        Accept: "application/json",
        "X-Goog-User-Project": "glassflorist",
      },
      body: JSON.stringify(requestBody),
    });

    console.log("Response status:", response.status);
    const responseData = await response.json();
    console.log("Response data:", responseData);

    if (!response.ok) {
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${JSON.stringify(
          responseData
        )}`
      );
    }

    return {
      success: true,
      message: "Message logged successfully",
      spreadsheetId: SPREADSHEET_ID,
    };
  } catch (err) {
    console.error("Error in logToSheet:", err);
    throw new Error(`Failed to log message: ${err.message}`);
  }
};
