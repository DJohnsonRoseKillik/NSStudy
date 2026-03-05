#!/usr/bin/env python3
"""Extract public Gymdesk components into embed-ready HTML and JSON."""

from __future__ import annotations

import html
import json
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import Request, urlopen

BASE_URL = "https://www.newschoolbjjlondon.co.uk"
SCHEDULE_URL = f"{BASE_URL}/schedule"
PRICING_URL = f"{BASE_URL}/pricing"
USER_AGENT = "Mozilla/5.0 (compatible; gymdesk-component-extractor/1.0)"

OUTPUT_JSON = Path("gymdesk_components.json")
OUTPUT_HTML = Path("gymdesk_embed.html")
OUTPUT_INDEX = Path("index.html")

TAG_RE = re.compile(r"<[^>]+>")
WHITESPACE_RE = re.compile(r"\s+")


def fetch_html(url: str) -> str:
    request = Request(url, headers={"User-Agent": USER_AGENT})
    with urlopen(request, timeout=30) as response:
        return response.read().decode("utf-8", errors="replace")


def clean_text(raw: str | None) -> str:
    if not raw:
        return ""
    text = html.unescape(TAG_RE.sub(" ", raw))
    text = WHITESPACE_RE.sub(" ", text).strip()
    return text.replace("Â£", "£")


def first_match(pattern: str, source: str) -> str:
    match = re.search(pattern, source, flags=re.S | re.I)
    return match.group(1) if match else ""


def absolute_url(url: str) -> str:
    if not url:
        return ""
    if url.startswith("http://") or url.startswith("https://"):
        return url
    if url.startswith("//"):
        return "https:" + url
    if url.startswith("/"):
        return BASE_URL + url
    return f"{BASE_URL}/{url}"


def parse_pricing(pricing_html: str) -> list[dict]:
    list_block = first_match(r'<ul class="pricing-options">(.*?)</ul>', pricing_html)
    item_chunks = re.findall(
        r'<li attr-id="(\d+)" class="pricing-option">(.*?)</li>',
        list_block,
        flags=re.S | re.I,
    )
    pricing = []
    for item_id, chunk in item_chunks:
        title = clean_text(first_match(r"<h3>\s*<span>(.*?)</span>\s*</h3>", chunk))
        amount = clean_text(first_match(r'<span attr-rel="amount">(.*?)</span>', chunk))
        currency = clean_text(first_match(r'<em class="amount">\s*([^<\s]+)', chunk))
        frequency = clean_text(first_match(r'<small class="frequency">(.*?)</small>', chunk))
        props_block = first_match(r'<div class="props">(.*?)</div>', chunk)
        details = [clean_text(p) for p in re.findall(r"<p>(.*?)</p>", props_block, flags=re.S | re.I)]
        details = [entry for entry in details if entry]
        signup_path = first_match(r'<a class="button" href="([^"]+)"', chunk)

        pricing.append(
            {
                "id": item_id,
                "title": title,
                "amount": amount,
                "currency": currency,
                "frequency": frequency,
                "details": details,
                "signup_url": absolute_url(signup_path),
            }
        )
    return pricing


def parse_schedule(schedule_html: str) -> list[dict]:
    encoded_events = re.findall(r'data-event-info="([^"]+)"', schedule_html, flags=re.I)
    events = []
    seen = set()

    for encoded in encoded_events:
        try:
            payload = json.loads(html.unescape(encoded))
        except json.JSONDecodeError:
            continue

        event_date = payload.get("date") or payload.get("scheduled") or ""
        event_start = payload.get("start") or ""
        event_title = clean_text(payload.get("title") or "")
        event_key = (
            payload.get("id"),
            event_date,
            event_start,
            event_title,
        )
        if event_key in seen:
            continue
        seen.add(event_key)

        instructors = []
        if isinstance(payload.get("instructors"), dict):
            for instructor in payload["instructors"].values():
                name = clean_text(str(instructor.get("name", "")))
                if name:
                    instructors.append(name)

        events.append(
            {
                "id": payload.get("id"),
                "title": event_title,
                "date": event_date,
                "start": event_start,
                "duration_minutes": int(payload.get("duration") or 0),
                "booked": int(payload.get("booked") or 0),
                "capacity": int(payload.get("book_limit") or 0),
                "bookable": bool(payload.get("bookable") and payload.get("booking_enabled")),
                "instructors": instructors,
                "booking_url": f"{BASE_URL}/book",
            }
        )

    def sort_key(item: dict) -> tuple:
        return (item.get("date", ""), item.get("start", ""), item.get("title", ""))

    return sorted(events, key=sort_key)


def format_time(hhmmss: str) -> str:
    if not hhmmss:
        return ""
    parts = hhmmss.split(":")
    if len(parts) < 2:
        return hhmmss
    hour = int(parts[0])
    minute = parts[1]
    am_pm = "AM" if hour < 12 else "PM"
    hour_12 = hour % 12 or 12
    return f"{hour_12}:{minute} {am_pm}"


def render_embed_html(data: dict) -> str:
    generated = data["generated_at"]
    pricing_cards = []
    for plan in data["pricing"]:
        details_html = "".join(
            f"<li>{html.escape(detail).replace('£', '&#163;')}</li>"
            for detail in plan["details"]
        )
        frequency = (
            f" <span class=\"freq\">{html.escape(plan['frequency']).replace('£', '&#163;')}</span>"
            if plan["frequency"]
            else ""
        )
        currency = html.escape(plan["currency"]).replace("£", "&#163;")
        amount = html.escape(plan["amount"]).replace("£", "&#163;")
        title = html.escape(plan["title"]).replace("£", "&#163;")
        currency_amount = f"{currency}{amount}"
        pricing_cards.append(
            f"""
            <article class="ns-card">
              <h3>{title}</h3>
              <p class="price">{currency_amount}{frequency}</p>
              <ul>{details_html}</ul>
              <a class="ns-btn" href="{html.escape(plan['signup_url'])}" target="_blank" rel="noopener noreferrer">Sign Up</a>
            </article>
            """
        )

    grouped: dict[str, list[dict]] = {}
    for event in data["schedule"]:
        grouped.setdefault(event["date"], []).append(event)

    schedule_sections = []
    for date in sorted(grouped.keys()):
        cards = []
        for event in grouped[date]:
            instructors = ", ".join(event["instructors"]) if event["instructors"] else "TBA"
            spots = f'{event["booked"]}/{event["capacity"]}' if event["capacity"] else str(event["booked"])
            action = (
                f'<a class="ns-btn secondary" href="{html.escape(event["booking_url"])}" target="_blank" rel="noopener noreferrer">Book</a>'
                if event["bookable"]
                else '<span class="ns-tag">Not bookable</span>'
            )
            cards.append(
                f"""
                <article class="ns-event">
                  <p class="time">{html.escape(format_time(event["start"]))} ({event["duration_minutes"]} min)</p>
                  <h4>{html.escape(event["title"])}</h4>
                  <p class="meta">Coach: {html.escape(instructors)} | Spots: {html.escape(spots)}</p>
                  {action}
                </article>
                """
            )
        schedule_sections.append(
            f"""
            <section class="ns-day">
              <h3>{html.escape(date)}</h3>
              <div class="ns-events">
                {''.join(cards)}
              </div>
            </section>
            """
        )

    return f"""<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Gymdesk Components</title>
  <style>
    :root {{
      --bg: #f6f7fb;
      --card: #ffffff;
      --text: #18202b;
      --muted: #5a6676;
      --line: #dde4ef;
      --brand: #0f2638;
      --brand-alt: #0b8fd8;
    }}
    * {{ box-sizing: border-box; }}
    body {{
      margin: 0;
      font-family: Arial, sans-serif;
      color: var(--text);
      background: var(--bg);
      line-height: 1.45;
    }}
    .ns-wrap {{
      max-width: 1120px;
      margin: 0 auto;
      padding: 24px 16px 48px;
    }}
    h1, h2, h3, h4 {{ margin: 0 0 10px; }}
    .ns-note {{
      background: #eef6ff;
      border: 1px solid #c9defa;
      color: #1f4366;
      border-radius: 10px;
      padding: 12px;
      margin-bottom: 16px;
      font-size: 14px;
    }}
    .ns-grid {{
      display: grid;
      gap: 14px;
      grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    }}
    .ns-card, .ns-event, .ns-day {{
      background: var(--card);
      border: 1px solid var(--line);
      border-radius: 12px;
    }}
    .ns-card {{
      padding: 16px;
    }}
    .price {{
      font-size: 22px;
      font-weight: 700;
      margin: 4px 0 10px;
    }}
    .freq {{
      font-size: 12px;
      color: var(--muted);
      font-weight: 500;
    }}
    .ns-card ul {{
      margin: 0 0 14px;
      padding-left: 18px;
      color: var(--muted);
      font-size: 14px;
    }}
    .ns-btn {{
      display: inline-block;
      text-decoration: none;
      background: var(--brand);
      color: #fff;
      border-radius: 8px;
      padding: 9px 12px;
      font-size: 14px;
      font-weight: 600;
    }}
    .ns-btn.secondary {{
      background: var(--brand-alt);
    }}
    .ns-day {{
      padding: 14px;
      margin-top: 14px;
    }}
    .ns-events {{
      display: grid;
      gap: 10px;
      grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    }}
    .ns-event {{
      padding: 12px;
    }}
    .ns-event .time {{
      margin: 0 0 6px;
      color: var(--muted);
      font-size: 13px;
      font-weight: 600;
    }}
    .ns-event .meta {{
      margin: 0 0 10px;
      color: var(--muted);
      font-size: 13px;
    }}
    .ns-tag {{
      display: inline-block;
      padding: 6px 10px;
      border-radius: 8px;
      background: #f2f4f7;
      color: #5d6675;
      font-size: 12px;
      font-weight: 600;
    }}
  </style>
</head>
<body>
  <main class="ns-wrap">
    <h1>Extracted Gymdesk Components</h1>
    <p class="ns-note">Synced: {html.escape(generated)} UTC. Source: <a href="{BASE_URL}" target="_blank" rel="noopener noreferrer">{BASE_URL}</a>. Direct iframe embedding is blocked by source headers, so these are extracted components.</p>

    <section>
      <h2>Pricing</h2>
      <div class="ns-grid">
        {''.join(pricing_cards)}
      </div>
    </section>

    <section>
      <h2>Schedule</h2>
      {''.join(schedule_sections)}
    </section>
  </main>
</body>
</html>
"""


def build_payload(pricing_html: str, schedule_html: str) -> dict:
    return {
        "source": BASE_URL,
        "generated_at": datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S"),
        "pricing": parse_pricing(pricing_html),
        "schedule": parse_schedule(schedule_html),
    }


def main() -> None:
    pricing_html = fetch_html(PRICING_URL)
    schedule_html = fetch_html(SCHEDULE_URL)
    payload = build_payload(pricing_html, schedule_html)

    OUTPUT_JSON.write_text(json.dumps(payload, indent=2), encoding="utf-8")
    page_html = render_embed_html(payload)
    OUTPUT_HTML.write_text(page_html, encoding="utf-8")
    OUTPUT_INDEX.write_text(page_html, encoding="utf-8")

    print(f"Wrote {OUTPUT_JSON}")
    print(f"Wrote {OUTPUT_HTML}")
    print(f"Wrote {OUTPUT_INDEX}")
    print(f"Pricing plans: {len(payload['pricing'])}")
    print(f"Schedule events: {len(payload['schedule'])}")


if __name__ == "__main__":
    main()
