# AdjustAid — User Acceptance Test (UAT) Guide

A friendly walkthrough for non-technical testers. No coding required. Just follow each step in order and tell us if anything looks wrong, feels confusing, or doesn't match the **Expected** result.

---

## Before You Start

### 1. What you'll need
- A **computer or tablet** with an up-to-date browser (Chrome, Edge, Safari, or Firefox).
- A **working email address** you can check during the test.
- About **45–60 minutes** for a full pass.
- *(Optional, for the Fast Fill section)* — A sample claim **PDF** file (for example, an NFIP Proof of Loss or Preliminary Report). An **ESX** file from XactAnalysis is helpful but not required.

### 2. Where to test
Open the app at:

> **https://www.adjustaid.com**

> Tip: If the team gave you a different "preview" link (something like `…vercel.app`), use that instead. Everything in this guide works the same way.

### 3. How to report an issue
For each step, jot down:
- The **section number** (e.g., "Section 4, step 3").
- What you **did** (button you clicked, text you typed).
- What you **saw** (a screenshot helps a lot — `Win + Shift + S` on Windows, `Cmd + Shift + 4` on Mac).
- What you **expected** to see.

A simple template you can copy at the end of this guide is provided in **Section 12**.

---

## Section 1 — Landing Page (Marketing)

**Goal:** Make sure the public homepage loads and the call-to-action buttons work.

| Step | Action | Expected result |
|---|---|---|
| 1.1 | Open **https://www.adjustaid.com** in a fresh browser tab. | Page loads within a few seconds. You see a dark hero section with the headline **"Faster Claims Estimating for Insurance Professionals."** |
| 1.2 | Scroll down through the page. | You see four sections: **Two Powerful Workflows** (Fast Fill / Express Estimate), **How It Works**, **Why Choose AdjustAid**, and **Simple Token-Based Pricing**. No broken images. No overlapping text. |
| 1.3 | Click **Get Started** in the top hero section. | The page navigates to a Sign Up form. |
| 1.4 | Click your browser's **Back** button. | You return to the landing page in the same place you left. |
| 1.5 | Click **Learn More**. | The page smoothly scrolls down to the **How It Works** section. |
| 1.6 | Click **Start Using Fast Fill** (or **Start Using Express Estimate**). | You go to the Sign Up form. |

> ✅ Pass criteria: All buttons work, text is readable, no errors flash on screen.

---

## Section 2 — Create an Account (Sign Up)

**Goal:** Confirm a new user can register and receive a confirmation email.

| Step | Action | Expected result |
|---|---|---|
| 2.1 | Go to **https://www.adjustaid.com/signup**. | A "Create your account" form is shown. |
| 2.2 | Fill in: **Full Name** (e.g., `Jane Tester`), **Email** (a real inbox you can open), **Company** (optional, e.g., `Acme Adjusting`), **Password** (at least 8 characters with letters and numbers). | All fields accept your input. The password field hides characters with dots. |
| 2.3 | Tick the **Terms** checkbox if shown, then click **Create Account**. | A success message appears, or you're sent to the Login page with a banner that says *"Check your email to confirm."* |
| 2.4 | Open your email inbox and look for a message from **AdjustAid / Supabase**. | An email arrives within 1–2 minutes. (Check spam if needed.) |
| 2.5 | Click the **confirmation link** in the email. | The link opens the app and takes you to the Login page (or directly into the dashboard). |

> ❌ Common issues to flag: form errors that don't explain what's wrong, no email arriving after 5 minutes, confirmation link gives a "code error" page.

---

## Section 3 — Sign In and Sign Out

**Goal:** Confirm login, logout, and the "forgot password" loop all work.

### 3a. Log in
| Step | Action | Expected result |
|---|---|---|
| 3.1 | Go to **/login**. | Login form is shown. |
| 3.2 | Type the email and password from Section 2 and click **Sign In**. | After a brief loading state, you land on the **Dashboard** page (the URL ends with `/dashboard`). |
| 3.3 | Try logging in with a **wrong password** (use any test email + bad password). | A clear, friendly error appears (e.g., *"Invalid email or password"*). The page does **not** crash. |

### 3b. Forgot password
| Step | Action | Expected result |
|---|---|---|
| 3.4 | From `/login`, click **Forgot password?**. | The Forgot Password page opens. |
| 3.5 | Enter your test email and click the submit button. | A confirmation message says an email is on its way. |
| 3.6 | Open the email and click the **Reset password** link. | You land on a "Set a new password" page. |
| 3.7 | Enter a new password twice and submit. | A success message appears. You can now log in with the new password. |

### 3c. Sign out
| Step | Action | Expected result |
|---|---|---|
| 3.8 | While signed in, look at the **left sidebar** (or open it using the menu icon on mobile). Click **Log Out** at the bottom. | You're signed out and returned to the **/login** page. Trying to visit `/dashboard` directly should bounce you back to login. |

---

## Section 4 — Dashboard Tour

**Goal:** Confirm the dashboard shows your account info and recent activity correctly.

| Step | Action | Expected result |
|---|---|---|
| 4.1 | After signing in, you should be on **/dashboard**. | At the top: *"Welcome back, **{your first name}**"*. |
| 4.2 | Look at the four stat cards at the top. | You see: **Fast Fill Tokens**, **Express Estimate Tokens**, **Processing**, **Needs Review**. New accounts will show **0** or **1** (free trial token). They should **not** show "—" indefinitely after the page settles. |
| 4.3 | Look at the **Quick Actions** card. | Three buttons: **New Fast Fill Project**, **New Express Estimate**, **Buy Tokens**. Each one navigates to the right place when clicked. |
| 4.4 | Look at the **Recent Jobs** card. | If you have no jobs yet, the message says *"No jobs yet."* Switch between the **All Jobs / Fast Fill / Express Estimate** tabs — the tab indicator should move and the URL gets a `?tab=…` parameter. |
| 4.5 | Look at the **Ready for Download** card. | Empty state shows *"No completed downloads yet."* once a job completes, files appear here for 14 days. |
| 4.6 | Look at the **Job Status Summary** card. | Five tiles: **Submitted, Processing, Completed, Failed, Needs Review**. New accounts show **0** in each. |

### 4a. Sidebar navigation
| Step | Action | Expected result |
|---|---|---|
| 4.7 | Click each item in the left sidebar one by one: **Dashboard, Fast Fill, Express Estimate, Tokens, Job History, Account Settings**. | Each page loads cleanly with its own title. The active item is highlighted in the sidebar. |
| 4.8 | On a desktop, click the small chevron on the sidebar's edge. | The sidebar **collapses** to icons only. Click it again to expand. |
| 4.9 | On a phone or narrow window, click the **hamburger menu** icon in the header. | The sidebar slides in. Tapping a link or the dimmed background closes it. |

---

## Section 5 — Buy Tokens (Free Top-Up)

**Goal:** Add tokens to your test account so you can run real Fast Fill / Express Estimate jobs.

> 🟡 Note: During the UAT phase, **purchases are simulated** (no real charge). Selecting a package instantly credits your balance.

| Step | Action | Expected result |
|---|---|---|
| 5.1 | From the sidebar, click **Tokens**. | The **Token Wallet** page opens. You see two big balance cards (Fast Fill / Express Estimate) and a **Purchase Tokens** section. |
| 5.2 | Under **Purchase Tokens**, make sure the **Fast Fill** tab is selected. Click **Select** on the smallest package (e.g., **5 tokens**). | A short loading spinner appears, then a green toast says *"Credited 5 FF token(s)…"*. The Fast Fill balance at the top of the page goes up by 5. |
| 5.3 | Switch to the **Express Estimate** tab and click **Select** on the **10 tokens** package. | Same behavior — a toast confirms, and the EE balance increases by 10. |
| 5.4 | Scroll down to **Purchase History**. | Both purchases appear in the table with the correct **date, type, status (Completed), quantity, and amount**. |
| 5.5 | Scroll to **Token Usage Summary**. | Shows total FF/EE tokens **purchased** and **used** so far. |

---

## Section 6 — Fast Fill Workflow (PDF + ESX)

**Goal:** Upload a claim PDF (and optional ESX), submit it, and see processing run end-to-end.

| Step | Action | Expected result |
|---|---|---|
| 6.1 | From the sidebar, click **Fast Fill**, then click **+ New Fast Fill Project**. | The **New Fast Fill Project** wizard opens. A 4-step indicator shows at the top: **Upload Files → Confirm → Processing → Complete**. |
| 6.2 | Look at the supported formats banner. | It lists: *NFIP Proof of Loss, Preliminary Report, XactContents Export, Flood Damage Assessment.* |
| 6.3 | In **Job 1**, click the left dashed box and pick a **PDF** file (a sample claim PDF). | The PDF's filename appears, and a green check shows *"Ready for processing (new ESX will be generated)"*. |
| 6.4 | *(Optional)* Click the right dashed box and pick an **ESX** file. | The ESX name shows. The note about *"new ESX will be generated"* disappears. |
| 6.5 | Click **+ Add Another File Pair**. | A **Job 2** card appears. Repeat step 6.3 for another PDF. |
| 6.6 | Click the small **X** on Job 2. | Job 2 is removed. Only Job 1 remains. |
| 6.7 | In the right-side **Summary** panel, check the numbers. | **Total file pairs:** 1, **Valid pairs:** 1, **Token cost:** 1 FF, **Your balance:** matches Section 5. |
| 6.8 | Click **Continue**. | The wizard advances to the **Confirm** step with a list of your files and a checkbox per row. |
| 6.9 | Untick a row's checkbox, then re-tick it. | The row dims/undims. The **Selected jobs** count and **After processing** balance in the sidebar update accordingly. |
| 6.10 | Click **Process**. | The button shows a spinner. Files upload in the background, then the wizard moves to **Processing**. |
| 6.11 | Watch the progress bars. | An overall progress bar climbs to **100%**. Each row shows its own bar and a spinner that becomes a green check when done. |
| 6.12 | When processing finishes, the wizard moves to **Complete**. | A green check icon and *"Processing Complete"* message appear. Your file is listed as ready, with a download icon. |
| 6.13 | Click **Start New Project**. | The wizard resets to the **Upload** step with one empty Job 1. |
| 6.14 | Go back to the **Dashboard**. | Your new job appears in **Recent Jobs**. The **Fast Fill Tokens** count is one lower than before. |

### 6a. "Don't see your format?" sample upload
| Step | Action | Expected result |
|---|---|---|
| 6.15 | Open `/fast-fill/new` again. In the supported-formats banner, click **Upload a sample PDF**. | A dialog opens. |
| 6.16 | Pick a PDF and click **Upload**. | A success toast confirms the sample was uploaded. The dialog closes. |

---

## Section 7 — Express Estimate Workflow (Form-Driven)

**Goal:** Fill in inspection details across three tabs, preview, and submit. *Autosave* should keep your work safe.

> Tip: This is the longest section. You don't have to fill **everything** — focus on the fields listed in each step.

### 7a. Project Details
| Step | Action | Expected result |
|---|---|---|
| 7.1 | Sidebar → **Express Estimate** → **+ New Express Estimate**. | The wizard opens with three top sections: **Project Details**, the tabbed **Damage Details** (Exterior / Foundation / Interior), and a sticky **Estimate Summary** sidebar. |
| 7.2 | At the top right, look for the small **Auto-saved** badge. | After you start typing, the badge briefly switches to **Saving…** and back to **Auto-saved**. |
| 7.3 | Fill in: **Project Name** = `Smith Residence`, **Claim Number** = `CLM-UAT-001`, **Date of Inspection** = today's date. | All values are accepted. Required fields show a red asterisk. |
| 7.4 | Try clicking **Continue to preview** with **Project Name** blank. | The form scrolls to the empty field and a red error message appears. The button does **not** advance. |
| 7.5 | Choose a **Property Type** from the dropdown (e.g., **Dwelling**). Type a **Property Address**. Toggle **Pre-FIRM Property** on and off. | The dropdown closes after selecting. The toggle visibly switches. |

### 7b. Exterior tab
| Step | Action | Expected result |
|---|---|---|
| 7.6 | In the **Exterior** tab, click **Pressure Wash / Cleaning** to expand it. Toggle **Enable Pressure Wash** on. | Extra fields appear: **Perimeter Feet**, **Regular PWash**, **Clean with Steam**. A **Saved** chip appears next to the section title. |
| 7.7 | Enter `120` in **Perimeter Feet** and turn **Regular PWash** on. | `120` is accepted; only one of the two switches can be on at a time. |
| 7.8 | Expand **Dumpster / Debris Removal** and add 1 dumpster, size **20 Yards**. Expand **HVAC** and click **Add Unit**. | A unit row appears with dropdowns for Tonnage, SEER, etc. |
| 7.9 | Expand and try a few other Exterior accordions briefly to confirm none of them throw an error. | All sections expand/collapse smoothly. |

### 7c. Foundation tab
| Step | Action | Expected result |
|---|---|---|
| 7.10 | Click the **Foundation** tab. | The view changes to foundation-related sections without losing your Exterior data. |
| 7.11 | Enable any one option (e.g., a foundation-cleaning toggle) and enter a value. Then click back to **Exterior**. | Your Exterior data is still there. Click back to **Foundation** — your data is still there too. |

### 7d. Interior tab and rooms
| Step | Action | Expected result |
|---|---|---|
| 7.12 | Click the **Interior** tab. At the bottom, click **+ Room**. | A new room card appears, defaulting to a generic "room" type. |
| 7.13 | Click the room title to expand it. Set a name (e.g., `Living Room`), a **Type**, and **Sqft**. | Fields accept input. |
| 7.14 | Toggle on **Flooring** and **Trim**. | Each section expands its own options. |
| 7.15 | Click **+ Bathroom** and **+ Kitchen** to add specialized rooms. | Bathroom shows **Vanity / Toilet / Shower** options. Kitchen shows **Cabinets / Countertop / Plumbing**. |
| 7.16 | Delete a room with its trash icon. | The room is removed; remaining rooms keep their values. |

### 7e. Autosave reliability
| Step | Action | Expected result |
|---|---|---|
| 7.17 | After making changes, **refresh the browser tab**. | When the form reloads, your **Project Details** and any room/section data you entered should still be filled in (autosave works). |

### 7f. Preview and submit
| Step | Action | Expected result |
|---|---|---|
| 7.18 | In the right sidebar, look at **Token cost** (`1 EE`) and **Your balance**. Click **Continue to preview**. | If a required field is missing, an error toast appears and the form scrolls there. Otherwise, the **Review Express Estimate** page opens. |
| 7.19 | On the preview page, scan the summary. | Project details, rooms, exterior, foundation, and interior data are all listed in plain language. |
| 7.20 | Click **Back to edit**. | You return to the wizard with all your data intact. Click **Continue to preview** again. |
| 7.21 | On the preview, click the **Submit** button. | A spinner runs, then a success toast appears: *"Express Estimate created."* You're redirected back to the **Express Estimate** list. |
| 7.22 | On the dashboard, the **Express Estimate Tokens** count is reduced by 1, and the new job appears in **Recent Jobs**. | ✅ |

---

## Section 8 — Job History (Search and Filter)

**Goal:** Find past jobs quickly.

| Step | Action | Expected result |
|---|---|---|
| 8.1 | Sidebar → **Job History**. | A page titled **History** with a search bar, **All / Fast Fill / Express Estimate** tabs, a **Filter** button, and a job table. |
| 8.2 | Type part of a claim number (e.g., `CLM-UAT`) in the search box. | After a brief debounce, the table filters. The URL updates with `?q=…`. |
| 8.3 | Click the **X** in the search box. | Search clears, the table shows all jobs again. |
| 8.4 | Click **Filter**. In the side sheet, select **Status: Completed**, set a **Created from** date, and click **Apply**. | The filter sheet closes; the table updates. The URL contains the filter values. |
| 8.5 | Refresh the page. | Filters and search persist (they live in the URL). |
| 8.6 | At the bottom of the table, change the page size or click **Next**. | The table re-paginates. |
| 8.7 | Click a **Download** icon on a completed row. | A file download starts (or your browser asks where to save it). |
| 8.8 | Click an **Eye / View** icon on a row that says *"Needs review"* (if any). | You're taken to a detail view for that job. |

---

## Section 9 — Account Settings

**Goal:** Confirm profile editing and password changes work.

| Step | Action | Expected result |
|---|---|---|
| 9.1 | Sidebar → **Account Settings**. | A page with **Profile Information**, **Change Password**, **Account Summary**, **Account Type**, and **Danger Zone**. |
| 9.2 | Edit your **Full Name** and **Company**, then click **Save Changes**. | A success indication appears. Refresh the page — your changes are still there. |
| 9.3 | Under **Change Password**, enter your **current password**, then a **new password** twice. Click **Update Password**. | Success toast: *"Password updated."* The form clears. |
| 9.4 | Sign out (sidebar → Log Out). Sign back in with the **new password**. | Login works; old password no longer works. |
| 9.5 | *(Do not click)* Look at the **Danger Zone** card. | A red **Delete Account** button is visible with a clear warning. **Skip clicking** during UAT unless told otherwise. |

---

## Section 10 — Errors, Empty States, Edge Cases

**Goal:** Make sure error messages are clear and friendly.

| Step | Action | Expected result |
|---|---|---|
| 10.1 | Try uploading a non-PDF (e.g., a `.docx`) into the Fast Fill PDF slot. | The browser file picker filters out non-PDFs, or the app rejects the file with a clear message. |
| 10.2 | Drain your Fast Fill balance to **0** (use up all FF tokens). Try to submit a new Fast Fill job. | The Continue / Process button is **disabled**, and a red note says *"Not enough Fast Fill tokens."* |
| 10.3 | Same test for Express Estimate at `0` EE balance. | Same behavior on the EE preview/submit screen. |
| 10.4 | Briefly disconnect your Wi-Fi, then click around the dashboard. | Errors are shown gracefully (e.g., *"Couldn't load jobs"*) with a **Retry** button — no white screen. Reconnect and click Retry. |
| 10.5 | Sign out, then try to visit **https://www.adjustaid.com/dashboard** directly. | You're redirected to **/login**. |

---

## Section 11 — Cross-Browser & Mobile Smoke Test

Repeat these quick checks at least once on each environment:

- **Chrome** on a desktop / laptop
- **Safari** on a Mac (if available)
- **Mobile Safari** on iPhone or **Chrome** on Android (use a phone — not a shrunken desktop window)

| Step | Action | Expected result |
|---|---|---|
| 11.1 | Sign in. | Works the same. |
| 11.2 | Open the sidebar (hamburger menu on mobile). | Slides in cleanly; tapping outside or on a link closes it. |
| 11.3 | Open **Fast Fill → New** and tap an upload box. | The native file picker opens. |
| 11.4 | Open **Express Estimate → New** and switch tabs. | Tabs work; sticky **Estimate Summary** is reachable (may scroll under content on small screens). |
| 11.5 | Submit a tiny test job. | Job appears under **Recent Jobs** when you go back to the dashboard. |

---

## Section 12 — Issue Report Template

Copy / paste this for every issue you find. One issue per report keeps things easy:

```text
Section / Step:        e.g., Section 6, step 6.10
Browser & device:      e.g., Chrome 124 on Windows 11 / Safari on iPhone 14
What I did:            e.g., Clicked "Process" with two valid PDFs.
What I expected:       e.g., Progress bar should advance to 100%.
What I saw:            e.g., Bar stuck at 35%, red toast: "Network error".
Screenshot or video:   (attach)
Reproducible?          Yes / No / Sometimes
Severity:              Blocker / High / Medium / Low / Cosmetic
Notes:                 Any extra info (account email, claim number, etc.)
```

### Severity quick-guide
- **Blocker** — stops the test entirely (can't sign up, dashboard won't load).
- **High** — major flow broken (Fast Fill won't process, tokens not deducting).
- **Medium** — works but with a wrong number, label, or layout.
- **Low** — small visual or wording problem.
- **Cosmetic** — typos, alignment, color polish.

---

## Section 13 — Sign-Off Checklist

Once every section above is done, fill in this short summary:

- [ ] Section 1 — Landing page
- [ ] Section 2 — Sign up (incl. email confirmation)
- [ ] Section 3 — Login / Forgot password / Logout
- [ ] Section 4 — Dashboard tour & sidebar
- [ ] Section 5 — Buy tokens (FF + EE)
- [ ] Section 6 — Fast Fill (upload → confirm → process → complete)
- [ ] Section 7 — Express Estimate (form → preview → submit)
- [ ] Section 8 — Job History (search, filter, download)
- [ ] Section 9 — Account Settings (profile + password)
- [ ] Section 10 — Errors and edge cases
- [ ] Section 11 — Cross-browser & mobile smoke test

**Tester name:** ______________________
**Date completed:** ___________________
**Browser(s) used:** __________________
**Overall status:** ☐ Pass  ☐ Pass with minor issues  ☐ Fail (see report)

---

Thank you for taking the time to test AdjustAid! Your feedback directly shapes what ships next.
