# 🗝️ Armored Cookie JWT Session Authentication Sandbox

A production-grade, standalone **HTTP-Only Cookie Session Authentication** application framework. It secures user credentials using high-entropy asynchronous password hashing algorithms and locks active authentication tokens inside browser-managed cookie layers to mitigate Cross-Site Scripting (XSS) session hijacking exploits.

---

## 🛡️ Technical Implementation Shield Layers
1. **Asynchronous Pre-Save Password Salting (`bcryptjs`):** Inbound user passphrases are automatically run through a 10-round salt generation cycle and converted to a irreversible hash value directly before database entry insertion.
2. **Armored HTTP-Only Cookie Delivery:** Session tokens are transmitted back to the browser packed inside a strict `httpOnly: true` secure cookie envelope block. Frontend JavaScript runtime scripts are entirely blocked from reaching into or reading this data block.
3. **Automated Session State Recovery Hooks:** Integrates an active on-demand client lifecycle checkpoint router (`/me`) that pulls back identity states from the cookie drawer automatically during page reloads (**F5 persistence**).
4. **Anti-CSRF Cross-Origin Guarding:** Uses strict SameSite parameters along with credential parsing headers to allow cookies to travel safely across cross-origin environments without opening up endpoint lines to cross-site request request forgery.
