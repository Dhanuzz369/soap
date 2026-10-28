# Enquiry form → Google Sheet: setup

The contact page's step-by-step enquiry form saves each buyer as **one row** in a Google Sheet, and fills the row in as they answer. A buyer's name and email or WhatsApp are saved the moment they finish step 1, even if they stop there. You get an email when someone finishes step 1 and again when they press **Send enquiry**.

Until this is set up, the form still works: it ends by offering "Send on WhatsApp" and "Send by email" with the whole enquiry written out. Nothing is lost, but nothing reaches the sheet either.

It takes about ten minutes. You need a Google account (the one whose Gmail should receive the alerts is easiest).

## 1. Create the sheet

1. Open <https://sheets.new>. Name it, for example, **GoodBiz enquiries**.
2. Leave it empty. The script creates a **Leads** tab with the column headers the first time an enquiry arrives:
   `leadId, firstSeen, updated, stage, language, page, name, company, email, phone, group, product, productOther, quantity, quantityOther, country, countryCode, port, terms, privateLabel, notes, variety, source`.

`stage` shows how far the buyer got: `contact`, `group`, `product`, `quantity`, `destination`, `terms`, and `submitted` once they pressed Send. A row that stops at `contact` is still a lead: you have their name and a way to reach them.

## 2. Paste the script

1. In the sheet: **Extensions → Apps Script**.
2. Delete everything in `Code.gs` and paste the whole of `scripts/apps-script/enquiry.gs` from this repository.
3. Click **Save** (the disk icon).

## 3. The alert email (optional)

Alerts go to **hygiene@goodbizglobal.com** (`ALERT_TO` at the top of the script), so you can skip this step. To send them somewhere else without editing the script:

1. In the Apps Script editor: **Project Settings** (the gear) → **Script Properties** → **Add script property**.
2. Property: `ALERT_EMAIL`. Value: the address that should get the alerts.
3. **Save script properties.**

## 4. Deploy as a web app

1. **Deploy → New deployment**. Click the gear next to "Select type" and choose **Web app**.
2. Description: `Enquiry form`. **Execute as: Me**. **Who has access: Anyone**.
   ("Anyone" lets the website post to it without a Google login. Visitors cannot read the sheet.)
3. Click **Deploy**, then **Authorize access** and allow the script to use your sheet and send email as you. Google warns that the app is unverified because you wrote it yourself: choose **Advanced → Go to … (unsafe)**.
4. Copy the **Web app URL**. It looks like `https://script.google.com/macros/s/AKfy…/exec`.

## 5. Put the URL in the site

In `src/config/site.ts`:

```ts
enquiry: {
  endpoint: 'https://script.google.com/macros/s/AKfy…/exec',
},
```

Then `npm run build` and deploy. `npm run check:placeholders` stops listing `enquiry.endpoint`. The form only accepts a URL of exactly this shape (`https://script.google.com/macros/s/<id>/exec`).

## 6. Test it

From a terminal (replace the URL):

```bash
curl -L -H 'Content-Type: text/plain;charset=utf-8' \
  -d '{"leadId":"test-0001-setup","stage":"contact","lang":"en","page":"/contact/","ts":"2026-01-01T00:00:00Z","fields":{"name":"Setup test","email":"you@example.com"}}' \
  'https://script.google.com/macros/s/AKfy…/exec'
```

It should print `{"ok":true}`, a **Leads** row should appear, and an alert should arrive. Then open the live contact page, fill in step 1 with your own details and press Next: a second row appears within a few seconds. Finish the form and the same row reaches `submitted`. Delete the test rows afterwards.

## Changing the script later (redeploy)

Edit `scripts/apps-script/enquiry.gs` in the repository (and run `npx vitest run tests/unit/apps-script.test.ts`), paste it into the editor again, then **Deploy → Manage deployments → (pencil) Edit → Version: New version → Deploy**. Editing the existing deployment keeps the same `/exec` URL, so the site needs no change. ("New deployment" would make a new URL.)

## How it behaves

- One row per visitor: the site sends a random `leadId` with every step, and the script finds the row by it. A reload continues the same row.
- A filled cell is never emptied by a later step, and a row that reached `submitted` stays there.
- Any value that starts with `=`, `+`, `-` or `@` is stored with a leading `'` so the sheet shows it as text and never runs it as a formula (this is why phone numbers like `+971…` show a `'` in the cell editor).
- The site waits 15 seconds for the final send. The script saves the row before it sends the email, so on a very slow day a send can be saved even though the site gave up and offered WhatsApp or email instead: the same enquiry may then rarely reach you twice (in the sheet and on WhatsApp).
- Without JavaScript the form posts straight to the script, which answers with a short "Thank you" page and a link back to the site.
- A hidden "website_confirm" box catches simple spam bots: anything with it ticked is thrown away.
