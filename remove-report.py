#!/usr/bin/env python3
"""Remove Report page and View Details button from yami-user/index.html"""
import re

with open('yami-user/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove all "Report" nav links from topnav-links
# Pattern: <a href="#" ...onclick="...showPage('page-dashboard-report')">Report</a>
content = re.sub(
    r'\s*<a href="#"[^>]*onclick="event\.preventDefault\(\);showPage\(\'page-dashboard-report\'\)"[^>]*>Report</a>',
    '',
    content
)

# 2. Remove Report link from mobile nav
content = re.sub(
    r'\s*<a href="#"[^>]*onclick="event\.preventDefault\(\);closeMobileNav\(\);showPage\(\'page-dashboard-report\'\)"[^>]*>Report</a>',
    '',
    content
)

# 3. Remove the "View Details" button that links to report page
content = re.sub(
    r'\s*<div style="display:flex;justify-content:flex-end;margin-top:-16px;margin-bottom:24px;">\s*\n\s*<a href="#"[^>]*onclick="event\.preventDefault\(\);showPage\(\'page-dashboard-report\'\)"[^>]*>View Details →</a>\s*\n\s*</div>',
    '',
    content
)

# 4. Remove the entire DASHBOARD REPORT page section
content = re.sub(
    r'\n<!-- ==================== PAGE: DASHBOARD REPORT ==================== -->\n<div class="page dashboard-page" id="page-dashboard-report">.*?</footer>\n</div>\n',
    '\n',
    content,
    flags=re.DOTALL
)

with open('yami-user/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done! Report page and View Details button removed.")
