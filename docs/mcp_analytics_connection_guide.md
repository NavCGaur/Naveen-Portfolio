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

```json
"google-analytics": {
  "command": "C:\\Users\\verti\\AppData\\Local\\Python\\pythoncore-3.14-64\\python.exe",
  "args": ["-u", "-W", "ignore", "-m", "analytics_mcp"],
  "env": {
    "GOOGLE_APPLICATION_CREDENTIALS": "C:\\Users\\verti\\AppData\\Roaming\\gcloud\\application_default_credentials.json",
    "GOOGLE_CLOUD_PROJECT": "your-project-id"
  }
}
```

---

*Last Updated: May 11, 2026*

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
