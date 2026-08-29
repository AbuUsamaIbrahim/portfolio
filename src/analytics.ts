/**
 * Umami Cloud — pageviews plus a handful of named events.
 *
 * The website ID is not a secret. It ships in the page source of every built page, so
 * hiding it behind a build-time environment variable buys nothing and costs something
 * real: if the variable is ever unset on Cloudflare the script silently disappears and
 * the numbers quietly stop, with no failing build to say so. A value you can read with
 * View Source belongs in the repo.
 *
 * Leave this empty and no script tag is emitted at all — the site returns to zero
 * external requests and the footer goes back to saying so. That is the kill switch.
 */
export const UMAMI_WEBSITE_ID = '98aaf6f5-922b-41b0-9ec8-9e15b02ec4c7';

/** US cloud. Swap for `https://eu.umami.is/script.js` to keep the data inside the EU. */
export const UMAMI_SRC = 'https://cloud.umami.is/script.js';

/**
 * Umami drops hits from any host not listed here, which keeps `astro preview` on
 * localhost and Cloudflare's per-commit preview deployments out of the real numbers.
 */
export const UMAMI_DOMAINS = 'mahadi-hasan.pages.dev';
