SMA Welfare Local - Electron + SQLite Starter

How to run:
1. Install Node.js (v16+ recommended).
2. Open a terminal in this folder.
3. Run: npm install
4. Initialize DB and default admin:
   npm run init-db
5. Start the app:
   npm start

Default admin credentials:
  email: smawelfare@admin
  password: changeme
On first login you'll be forced to change password.

Notes:
- Member photos are stored under data/images/members/
- Database file: data/welfare.db
- Use DB Browser for SQLite to inspect the database.


Added features:
- Finances reporting and backup/restore UI
- Settings page to set secret key and create admin users
- Password reset via secret key (reset-password.html)

To use settings: after login, open renderer/settings.html from the app navigation (or open directly).


Phase 3 updates:
- Generated PDFs now open automatically for print preview after creation.
- The system will auto-carryover the previous closing balance as the opening balance for a new month (auto-opening entry).
- Installer app name will be: 'SMA Welfare System' when packaging.

To package the app into a Windows installer (suggested):
- Install electron-packager or electron-builder and follow their docs. Example:
  npm install -g electron-packager
  electron-packager . "SMA Welfare System" --platform=win32 --arch=x64 --icon=assets/logo.ico



Phase 3 additions:
- Local modal & toast system (simple replacement for SweetAlert2/Toastify) in renderer/js/ui.js
- Member List PDF export with table layout and page numbers
- Contributions PDF & CSV exports by date range
- Packaging script example in package.json (run `npm run package-win` after installing electron-packager)

To make a proper Windows installer with icon, provide a .ico file in assets/logo.ico and use electron-builder or electron-packager with an icon argument.


Phase 4: UI polish
- Switched to white + gold theme (modern professional look).
- Bundled offline Swal & Toastify-like wrappers in renderer/libs/ for nicer dialogs & toasts.
- UI updated to use these libraries across pages.

Note: For exact SweetAlert2 and Toastify behavior, you can replace the wrapper files in renderer/libs/ with the official minified files.
