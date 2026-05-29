Yami Affiliate Program HTML 文件包
===================================

文件夹说明：
- admin/          后台管理系统
- user-with-report/   前台（含 Report 页面）
- user-no-report/     前台（不含 Report 页面）

使用说明：

【前台】
直接双击 index.html 即可在浏览器中打开

【后台】
后台是 React 单页应用，需要通过本地服务器打开：

方法1：使用 Python（推荐）
  打开终端，进入 admin 文件夹，运行：
  python3 -m http.server 8080
  然后浏览器访问 http://localhost:8080

方法2：使用 VS Code Live Server 插件
  用 VS Code 打开 admin 文件夹，右键 index.html 选择 "Open with Live Server"

方法3：直接访问线上版本
  https://yami-affiliate-admin.pages.dev/
