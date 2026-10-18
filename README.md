# NFC Review Cards

A small, static redirect manager for 20 Google review NFC cards. Each physical card stores one permanent GitHub Pages URL. The matching page reads `redirects.json` and sends the visitor to the current Google review destination.

There is no backend, account, database, tracking, custom domain, build step, or external dependency.

## Permanent NFC URLs

Repository: `vukhanh732/nfc`

Site: `https://vukhanh732.github.io/nfc/`

Workflow guide: `https://vukhanh732.github.io/nfc/guide/`

Each card uses a permanent URL from `https://vukhanh732.github.io/nfc/01/` through `https://vukhanh732.github.io/nfc/20/`. Program this short URL onto the physical NFC card, not the longer Google review URL. You can later change the destination in `redirects.json` without rewriting the tag.

## Enable GitHub Pages

1. Open the `vukhanh732/nfc` repository on GitHub.
2. Go to **Settings**.
3. Select **Pages**.
4. Under **Build and deployment**, choose **Deploy from a branch**.
5. Choose the `main` branch and `/ (root)` folder.
6. Select **Save**.
7. Wait for GitHub Pages to publish `https://vukhanh732.github.io/nfc/`.

No `CNAME` file is needed.

## Edit redirects manually

Open `redirects.json` in GitHub, select the edit button, and replace a card's value with its complete `https://` review URL. Leave unused cards as empty strings. Keep every key from `01` through `20`, then commit the change.

Example:

```json
{
  "01": "https://www.google.com/maps/place//data=!4m3!3m2!1s0x6b1297d8d56d66ab:0xfce9f5a856c26b28!12e1",
  "02": "https://example.com/review",
  "03": ""
}
```

The real file must retain all 20 entries.

## Use the phone admin page

Open `https://vukhanh732.github.io/nfc/admin/` on the phone:

1. Choose a card.
2. Enter its destination URL.
3. Select **Save Locally**.
4. Use **Test** to open the destination in a new tab.
5. Repeat for other cards.
6. Select **Download JSON** to save `redirects.json`, or **Copy JSON** to copy its full contents.

Local changes remain only in that browser on that phone. The admin page cannot write to GitHub.

## Publish changes made on the phone

1. Download `redirects.json` from the admin page.
2. Open the `vukhanh732/nfc` repository on GitHub.
3. Open the existing `redirects.json` file.
4. Choose **Upload files**, or edit the file and paste the copied JSON.
5. Replace the existing file and commit the change to `main`.
6. Wait for GitHub Pages to deploy, then test the card URL again.

The redirect pages request `redirects.json` without browser caching, but GitHub Pages deployment and CDN updates can still take a few minutes.

## Program the NFC cards

Open `https://vukhanh732.github.io/nfc/setup/` and copy the URL for the physical card number. In Android NFC Tools:

1. Open **Write**.
2. Add a URL/URI record.
3. Paste the permanent card URL.
4. Tap **Write**.
5. Hold the phone against the NFC card.
6. Label the card with the same number.

Do not make a tag read-only until its URL has been fully tested.

## Test and update a card

Scan the tag or open its permanent URL in a private browser tab. Card 01 should open its current Google review link. A blank card should show `Not configured yet.`

To change a business later, update only that card's destination in `redirects.json` and commit it. The NFC tag keeps the same permanent URL and does not need to be rewritten.

## Troubleshooting

- **Not configured yet:** The card has an empty value in the live `redirects.json`.
- **Invalid destination URL:** Use a complete `https://` or `http://` URL. Other URL schemes are rejected.
- **Unable to load redirect:** Check that `redirects.json` is valid JSON and GitHub Pages has finished deploying.
- **Phone edits are missing on another device:** Local admin changes stay in that browser until the exported file is committed to GitHub.
- **Old destination still opens:** Wait a few minutes for deployment, then reopen the card URL or test in a private tab.
- **Page is not found:** Confirm Pages uses the `main` branch and `/ (root)`, and confirm the URL includes `/nfc/`.

## NTAG213 capacity

An NTAG213 has about 137 usable NDEF bytes. `https://vukhanh732.github.io/nfc/01/` is 36 ASCII characters. A URL NDEF record adds a small amount of metadata and can use URI prefix compression, so this permanent URL fits comfortably. Store only the permanent GitHub Pages URL on the tag. Do not store the long Google review destination URL on it.
