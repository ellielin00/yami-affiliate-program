#!/usr/bin/env python3
"""Remove all Notifications functionality from yami-user/index.html"""
import re

with open('yami-user/index.html', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Remove multi-line notification bell buttons (3-line format)
# Pattern: <button class="topnav-icon-btn" title="Notifications" onclick="toggleNotifDropdown(this)">
#            <svg ...bell...</svg>
#            <span class="badge"></span>
#          </button>
content = re.sub(
    r'\s*<button class="topnav-icon-btn"[^>]*onclick="toggleNotifDropdown\(this\)"[^>]*>\s*\n\s*<svg[^<]*<path[^/]*/><path[^/]*/></svg>\s*\n\s*<span class="badge"></span>\s*\n\s*</button>',
    '',
    content
)

# 2. Remove single-line notification bell buttons (with badge)
# <button class="topnav-icon-btn" ...onclick="toggleNotifDropdown(this)"><svg...></svg><span class="badge"></span></button>
content = re.sub(
    r'\s*<button class="topnav-icon-btn"[^>]*onclick="toggleNotifDropdown\(this\)"[^>]*><svg[^<]*(?:<[^<]*)*?</svg><span class="badge"></span></button>',
    '',
    content
)

# 3. Remove single-line notification bell buttons (without badge)
# <button class="topnav-icon-btn" onclick="toggleNotifDropdown(this)"><svg...></svg></button>
content = re.sub(
    r'\s*<button class="topnav-icon-btn"[^>]*onclick="toggleNotifDropdown\(this\)"[^>]*><svg[^<]*(?:<[^<]*)*?</svg></button>',
    '',
    content
)

# 4. Remove the entire NOTIFICATION DROPDOWN section
content = re.sub(
    r'\n<!-- ==================== NOTIFICATION DROPDOWN ==================== -->\n<div class="dropdown-overlay"[^>]*></div>\n<div class="nav-dropdown notif-dropdown"[^>]*>.*?</div>\n</div>\n',
    '\n<!-- Dropdown overlay -->\n<div class="dropdown-overlay" id="dropdown-overlay" onclick="closeAllDropdowns()"></div>\n',
    content,
    flags=re.DOTALL
)

# 5. Remove notification CSS styles
# .notif-dropdown styles
content = re.sub(
    r'/\* Notification dropdown \*/\n.*?\.notif-content \.notif-time \{[^}]*\}',
    '',
    content,
    flags=re.DOTALL
)

# .nav-dropdown.notif-dropdown.active line
content = re.sub(
    r'\.nav-dropdown\.notif-dropdown\.active \{[^}]*\}\n?',
    '',
    content
)

# 6. Remove notification JS functions
# toggleNotifDropdown
content = re.sub(
    r'window\.toggleNotifDropdown = function\(btn\) \{.*?\};\n',
    '',
    content,
    flags=re.DOTALL
)

# notifClick
content = re.sub(
    r'window\.notifClick = function\(item, pageId\) \{.*?\};\n',
    '',
    content,
    flags=re.DOTALL
)

# markAllRead
content = re.sub(
    r'window\.markAllRead = function\(\) \{.*?\};\n',
    '',
    content,
    flags=re.DOTALL
)

# 7. Clean up toggleUserDropdown - remove notif references
content = re.sub(
    r"  var notifDd = document\.getElementById\('notif-dropdown'\);\n",
    '',
    content
)
content = re.sub(
    r"  notifDd\.classList\.remove\('active'\);\n",
    '',
    content
)

# 8. Clean up closeAllDropdowns - remove notif reference
content = re.sub(
    r"  document\.getElementById\('notif-dropdown'\)\.classList\.remove\('active'\);\n",
    '',
    content
)

with open('yami-user/index.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Done! Notifications removed.")
