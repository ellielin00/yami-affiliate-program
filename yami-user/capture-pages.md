# Figma Capture Plan — V4 Pages (Excluding Landing Page)

## Pages to Capture (16 pages × 3 widths = 48 captures)

| # | Page ID | Page Name | Widths |
|---|---------|-----------|--------|
| 1 | page-onboard-1 | Onboarding Step 1 | 1920, 1024, 402 |
| 2 | page-onboard-2 | Onboarding Step 2 | 1920, 1024, 402 |
| 3 | page-status-review | Status: Under Review | 1920, 1024, 402 |
| 4 | page-status-declined | Status: Declined | 1920, 1024, 402 |
| 5 | page-status-approved | Status: Approved / Welcome | 1920, 1024, 402 |
| 6 | page-dashboard-home | Dashboard Home | 1920, 1024, 402 |
| 7 | page-dashboard-share | Dashboard Share | 1920, 1024, 402 |
| 8 | page-dashboard-wallet | Dashboard Wallet | 1920, 1024, 402 |
| 9 | page-collection-detail | Collection Detail | 1920, 1024, 402 |
| 10 | page-collection-create | Create Collection | 1920, 1024, 402 |
| 11 | page-billing-detail | Billing Detail | 1920, 1024, 402 |
| 12 | page-dashboard-profile | Dashboard Profile | 1920, 1024, 402 |
| 13 | page-profile-tax | Tax Form | 1920, 1024, 402 |
| 14 | page-profile-social | Social Accounts | 1920, 1024, 402 |
| 15 | page-profile-categories | Category Preferences | 1920, 1024, 402 |
| 16 | page-profile-notifications | Notification Settings | 1920, 1024, 402 |

(page-profile-terms and page-profile-help are simple text pages, included if needed)

## How to Execute

For each page + width combo:

1. I request a new `captureId` from Figma MCP
2. Open URL: `http://localhost:8080/yami-affiliate-v4.html?page={pageId}#figmacapture={captureId}&figmaendpoint=...&figmadelay=2000`
   - Browser window should be resized to target width before capture
3. Poll until capture completes
4. Repeat for next width / next page

## Execution Command Template

```
open "http://localhost:8080/yami-affiliate-v4.html?page={PAGE_ID}#figmacapture={CAPTURE_ID}&figmaendpoint=https%3A%2F%2Fmcp.figma.com%2Fmcp%2Fcapture%2F{CAPTURE_ID}%2Fsubmit&figmadelay=2000"
```

Note: For width control, we use `&figmaselector=#page-{id}` to capture only the active page div, and the browser window width determines the responsive layout.
