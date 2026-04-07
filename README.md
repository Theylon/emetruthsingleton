# EmeTruth Website

Marketing site for EmeTruth, focused on prediction-market operators and selective capital partners.

## Local Development

1. Install dependencies with `npm install`
2. Start the dev server with `npm run dev`
3. Build production assets with `npm run build`

## Contact Flow Configuration

- Set `VITE_CONTACT_FORM_ENDPOINT` to a form backend endpoint if you want submissions sent directly from the website.
- Set `VITE_CALENDLY_URL` to enable the scheduling CTA.

If those variables are not set, the site falls back to prefilled email workflows to `partners@emetruth.capital`.
