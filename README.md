# cloudflare-workers-async-google-analytics

[![Author Sukka](https://img.shields.io/badge/author-Sukka-b68469.svg?style=flat-square)](https://skk.moe)
[![License MIT](https://img.shields.io/github/license/sukkaw/cloudflare-workers-async-google-analytics.svg?style=flat-square)](./LICENSE)
![NPM Version](https://img.shields.io/npm/v/cfga?style=flat-square)
[![Build with Cloudflare Workers](https://img.shields.io/badge/build%20with-cloudflare%20workers-f38020.svg?style=flat-square)](https://workers.cloudflare.com/)
![Gzip size of cfga.min.js](https://img.badgesize.io/sukkaw/cloudflare-workers-async-google-analytics/master/cfga.min.js.svg?compression=gzip&style=flat-square)
[![](https://data.jsdelivr.com/v1/package/npm/cfga/badge)](https://www.jsdelivr.com/package/npm/cfga)


The Cloudflare Workers implementation of an async Google Analytics

## Introduction

This project is based on [Google Analytics Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/v1/), using [Cloudflare Workers](https://workers.cloudflare.com/) with a less than 1KB gzipped tiny `cfga.min.js` to accelerate the Google Analytics, rather than a heavy (45KB gzipped) `analytics.js` from Google.

## Get Start

### 1. Import into Cloudflare Workers

Login into Cloudflare Dashboard and enter `Workers` App. Create a new script, delete default code in the editor, and then copy [the `woker.js` content](https://github.com/SukkaW/cloudflare-workers-async-google-analytics/blob/master/worker.js) into the editor. After saving the workers script, do not forget to register a route for the scripts.

Now you can test your workers with a simple HTTP request. You should able to see `403 Forbidden`. Then you can deploy the scripts.

### 2. Insert the `cfga.min.js` into your website

Just add those few lines of the code to your website, right before `</body>`. Do not forget to replace the default configuration with your own!

```html
<script>
window.ga_tid = "UA-XXXXX-Y"; // {String} The trackerID of your site.
window.ga_url = "https://example.com/xxx/"; // {String} The route of your cloudflare workers you just registered before.
</script>
<script src="https://cdn.jsdelivr.net/npm/cfga@1.0.0" async></script>
```

### 3. Watch this repo with `Releases Only`.

Click the `watch` button at the top of the repo and choose `Releases Only`, so you can get notice of release update in time.

## Advanced

### Data type the `cfga.min.js` collected and sent

Currently, `cloudflare-workers-async-google-analytics` and `cfga.min.js` only support collect those types of data listed below. If you want to collect more, you should use Google Analytics official track code.

- [`dl`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dl): Document location URL
- [`uip`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#uip): User real IP
- [`ua`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ua): User Agent
- [`dt`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dt): Document Title
- [`de`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#de): Document Encoding
- [`dr`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dr): Document Referrer
- [`ul`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#ul): User Language
- [`sd`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#sd): Screen Colors Depth
- [`sr`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#sr): Screen Resolution
- [`plt`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#plt): Page Load Time
- [`dns`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dns): DNS Time
- [`pdt`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#pdt): Page Downloaad Time
- [`rrt`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#rrt): Redirect Response Time
- [`tcp`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#tcp): TCP Connect Time
- [`srt`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#srt): Server Response Time
- [`dit`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#dit): DOM Interactive Time
- [`clt`](https://developers.google.com/analytics/devguides/collection/protocol/v1/parameters#clt): Content Load Time

### Security

`cloudflare-workers-async-google-analytics` blocks those types of request by default:

- No `User-Agent` in request headers
- No `Referer` in request headers
- No Tracker ID given in request headers
- Use some other measurements from Cloudflare WAF

And if you want to restrict your workers only for your website, all you need to do is to edit a few lines of your workers:

- Launch Cloudflare Workers Editor again.
- You can see some commented out code at the first line like this:

```javascript
//const AllowedReferrer = 'skk.moe';
```

- replace your domain with `skk.moe`, then remove `//`.

> **Notice**: set `AllowedReferrer` value to `skk.moe` means all the subdomains of `skk.moe` will be allowed as well.

## Author

**cloudflare-workers-async-google-analytics** © [Sukka](https://github.com/SukkaW), Released under the [MIT](./LICENSE) License.<br>
Authored and maintained by Sukka with help from contributors ([list](https://github.com/SukkaW/cloudflare-workers-async-google-analytics/graphs/contributors)).

> [Personal Website](https://skk.moe) · [Blog](https://blog.skk.moe) · GitHub [@SukkaW](https://github.com/SukkaW) · Telegram Channel [@SukkaChannel](https://t.me/SukkaChannel) · Twitter [@isukkaw](https://twitter.com/isukkaw) · Keybase [@sukka](https://keybase.io/sukka)
