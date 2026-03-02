# Northern Automation — State (SSOT)

Last updated: 2026-03-02

## Hosting (Cloudflare Pages)
- Pages project: northernautomation-site.pages.dev
- GitHub repo: northernautomation/northernautomation-site
- Branches: main = production, dev = preview
- Build config: Framework = None, Build command = (blank), Output directory = .
- Domains:
  - https://northernautomation.ca (active)
  - https://www.northernautomation.ca (active; 301 → apex via Page Rule)
- Security headers: _headers present + live in production
- robots.txt + sitemap.xml + 404.html: live in production

## Redirects (Cloudflare)
- Page Rule: www.northernautomation.ca/* → https://northernautomation.ca/$1 (301)

## Webhook (Cloudflare Tunnel + Node)
- Public URL: https://webhook.northernautomation.ca
- Tunnel: na-webhook (cloudflared), route: webhook.northernautomation.ca
- DNS: webhook is a Tunnel record pointing to na-webhook (proxied)
- Cache: Page Rule set to Cache Level = Bypass for webhook.northernautomation.ca/*
- Security:
  - Custom rule: Skip all managed rules for Hostname webhook.northernautomation.ca (to allow non-browser automation)
  - Rate limit: 30 requests / 10 seconds / per IP, action = Block (Free-plan constraints)

## Webhook App (Server)
- Location: ~/openclaw/webhook/server.js
- Port: 127.0.0.1:3000
- Express trust proxy: enabled (app.set('trust proxy', true))
- Auth:
  - HMAC signature (x-signature, x-timestamp, x-nonce)
  - Shared secret header required: x-webhook-secret
- Env vars (in ~/openclaw/.env):
  - TELEGRAM_BOT_TOKEN
  - TELEGRAM_CHAT_ID
  - HMAC_SECRET
  - WEBHOOK_SHARED_SECRET

## Operational Commands (Server)
- Check listener:
  - sudo ss -lntp | grep ":3000"
- Tail logs:
  - tail -n 50 ~/openclaw/webhook/webhook.log
- Restart webhook (manual):
  - sudo pkill -f "node .*webhook/server.js"
  - cd ~/openclaw/webhook
  - sudo nohup node server.js >> webhook.log 2>&1 &
  - sudo ss -lntp | grep ":3000"

## Notes
- Mistaken Workers project deleted; only Pages is active for website.
- OpenClaw (or any automation) must include header:
  - x-webhook-secret: <WEBHOOK_SHARED_SECRET>
