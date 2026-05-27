# MCP Analytics & Search Console Connection Guide

This document outlines the proven process for connecting Google Analytics 4 (GA4) and Google Search Console (GSC) to the Antigravity AI agent using the Model Context Protocol (MCP).

## 1. Authentication Method: Application Default Credentials (ADC)
We use **OAuth-based ADC** because it is more secure and flexible than static service account keys for local development.

### Setup Command:
Run this in your terminal to authenticate and request the necessary scopes:
```bash
gcloud auth application-default login --scopes="https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/webmasters,https://www.googleapis.com/auth/analytics.readonly"
```

### Set Quota Project:
To prevent "Quota Project" errors in Google APIs, set your project ID:
```bash
gcloud auth application-default set-quota-project [YOUR_PROJECT_ID]
```

## May 2026 Critical Fixes

If the GA4 connection is "stuck" or blocked, ensure these three elements are correctly configured:

### 1. Bypass "App Blocked" with Custom Client ID
Google now blocks the default `gcloud` client ID for the `analytics.readonly` scope. To bypass this, you **must** use your own OAuth Client ID from the Google Cloud Console.
- **Command:** 
  ```powershell
  gcloud auth application-default login --scopes="https://www.googleapis.com/auth/cloud-platform,https://www.googleapis.com/auth/analytics.readonly" --client-id-file="client_secret_YOUR_ID.json"
  ```

### 2. Set the Quota Project
Google requires a specific project to be billed for API usage, even for free tiers. 
- **Command:**
  ```powershell
  gcloud auth application-default set-quota-project YOUR_PROJECT_ID
  ```

### 3. Prevent "Silent Hangs" (Python 3.14+)
Windows command stubs and Python buffering can cause the MCP server to hang indefinitely.
- **Config fix:** Use the **absolute path** to your Python executable in `mcp_config.json`.
- **Code fix:** Ensure no `print()` statements reach `stdout`. (Patched in `server.py`).

## May 2026 Critical Fixes (Bypassing Google's Client ID Blocks)

If the GA4 or GSC connection is "stuck" or blocked due to standard Google CLI limitations, ensure these elements are configured:

### 1. The "This App is Blocked" Google CLI Bypass
Google blocks sensitive/restricted scopes (such as Google Ads, Google Analytics, and Search Console) from using the global, default `gcloud` CLI client ID to protect users from phishing. Trying to run `gcloud auth application-default login` with these scopes will result in a **"This app is blocked"** browser error.

#### ➔ The Automated loopback & Sync Fix (Proven):
We bypass this completely by using your own white-labeled Google Developer Application credentials (`client_secret.json`) and a local loopback server:

1. **Generate Fresh Tokens**:
   Run the custom authorizer script in the project root:
   ```bash
   python authenticate_google.py
   ```
   * Choose **Option 3** *(Unified: GA4, GSC & Google Ads)*.
   * Sign in using your authorized email (`naveencg070@gmail.com`) to generate **`tokens_unified.json`**.
   
2. **Synchronize to System Credentials**:
   Once generated, run the sync script to write the custom token directly into the Google Cloud CLI's global credentials path:
   ```bash
   python sync_gcloud_adc.py
   ```
   This writes a fully functional credential file directly to:
   `C:\Users\verti\AppData\Roaming\gcloud\application_default_credentials.json`
   Both MCP tools and background scripts will now run instantly without any blocks!

### 2. Handling the 7-Day Expiration in "Testing" Mode
If your Google Cloud Project is set to "Testing" publishing status, Google expires and revokes all user refresh tokens after exactly **7 days**. When GSC or GA4 fail with an `invalid_grant` error, simply repeat the 2-step process above to renew the tokens in 10 seconds.

### 3. Direct REST Python Fallback (Bypassing Plugin Caching)
Because local IDE plugins (MCP servers) are loaded as permanent processes in memory, they may cache old tokens and fail to reload modified credentials on the fly. In these cases, bypass the caching by running direct, fresh Python REST queries:
- **GA4 direct query:** `python pull_ga4_data.py`
- **GSC direct query:** `python pull_gsc_data.py`
- **Comparison & Analysis query:** `python pull_comparison_data.py`

---

*Last Updated: May 27, 2026*

---

## 2. Configuration (`mcp_config.json`)
The configuration file is located at: `C:\Users\verti\.gemini\antigravity\mcp_config.json`

### Google Analytics 4 (Python Server)
Uses the `analytics_mcp` module.
```json
"google-analytics": {
  "command": "python",
  "args": ["-u", "-W", "ignore", "-m", "analytics_mcp"],
  "env": {
    "GOOGLE_APPLICATION_CREDENTIALS": "[PATH_TO_ADC_JSON]",
    "GOOGLE_CLOUD_PROJECT": "[PROJECT_ID]",
    "GOOGLE_PROJECT_ID": "[PROJECT_ID]"
  }
}
```

### Google Search Console (Node.js Server)
Uses the `mcp-gsc` package. 
**Note:** Ensure `GOOGLE_GSC_CREDENTIALS_PATH` is set to the same ADC path.
```json
"google-search-console": {
  "command": "npx",
  "args": ["-y", "mcp-gsc"],
  "env": {
    "GOOGLE_GSC_CREDENTIALS_PATH": "[PATH_TO_ADC_JSON]",
    "GOOGLE_CLOUD_PROJECT": "[PROJECT_ID]",
    "GOOGLE_PROJECT_ID": "[PROJECT_ID]"
  }
}
```

---

## 3. Common Troubleshooting
- **Insufficient Scopes:** If a tool fails with a 403 error, re-run the `gcloud login` command with the `--scopes` flag.
- **Quota Project Error:** Ensure `GOOGLE_CLOUD_PROJECT` is set in the `env` block of the `mcp_config.json`.
- **Hanging (Python):** Always use the `-u` flag in Python args to prevent output buffering.
- **Permission Denied (GSC):** Verify the site URL format. GSC is case-sensitive and differentiates between `https://www.domain.com/` and `https://domain.com/`.

---

## 4. Useful Python Snippets (Fallback)
If the MCP servers fail due to package incompatibilities, use a direct Python script with `googleapiclient`:
- **GSC:** Use `service.searchanalytics().query()` with the exact site URL.
- **GA4:** Use `BetaAnalyticsDataClient` from `google-analytics-data`.
