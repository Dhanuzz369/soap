# Backlinks kit: listings that point buyers and search engines to goodbizhygiene.com

Links from other websites are the biggest ranking signal the site cannot create by itself. Each listing below takes 10–20 minutes. Copy the text exactly: **the same name, description, address and phone everywhere** is what lets Google and AI assistants recognise all these profiles as one company.

After you create a profile, send its address (for example `https://www.indiamart.com/goodbiz-hygiene/`) so it can go into `profiles` in `src/config/site.ts`. That adds it to the site's structured data (`sameAs`), which connects the profile and the website for search engines.

**Be accurate.** GoodBiz Hygiene is a **merchant exporter**: it sources from Indian manufacturers and does not manufacture. Where a directory asks for the business type, choose **Exporter**, **Merchant Exporter** or **Trader**, never **Manufacturer**. A wrong label there contradicts the website and costs trust with buyers and search engines.

---

## 1. Copy these details exactly

| Field | Value |
| --- | --- |
| Company name | GoodBiz Hygiene |
| Parent company | GoodBiz Global |
| Website | https://www.goodbizhygiene.com/ |
| Email | hygiene@goodbizglobal.com |
| Phone and WhatsApp | +91 88847 99369 |
| City | Bengaluru, Karnataka, India |
| Business type | Merchant exporter (exporter / trader) |
| Registrations | FIEO member exporter · MSME (Udyam) · CHEMEXCIL (RCMC) · DGFT (IEC) |
| Export terms | FOB, CIF and CFR; T/T or LC agreed per order |
| Lead time | Typically 3–5 weeks after order confirmation |
| HSN codes | 3401 (soaps), 3402 (detergents and cleaning preparations) |

**Short description** (up to 160 characters):

> Merchant exporter of soaps, detergents, dish wash, home cleaners and soap raw materials from India. Private label, mixed containers, FOB/CIF.

**Long description** (for "About us" boxes):

> GoodBiz Hygiene, a unit of GoodBiz Global (Bengaluru, India), is a merchant exporter of soaps and home-care products. We source from vetted Indian manufacturers and export bath and toilet soaps, herbal and hotel soaps, liquid hand wash, laundry soap bars, detergent powder and liquid detergent, dish wash liquid and bars, floor, toilet, glass and multi-surface cleaners, and soap raw materials such as soap noodles, LABSA and SLES.
>
> We quote trial orders, part loads and mixed containers, offer private label on most products, and ship FOB, CIF or CFR from major Indian ports, typically 3–5 weeks after order confirmation. Enquiries are answered in 12 languages at https://www.goodbizhygiene.com/

**Product categories** (when a directory asks you to pick or type them):

Toilet Soap · Bath Soap · Herbal Soap · Ayurvedic Soap · Glycerin Soap · Transparent Soap · Antibacterial Soap · Hotel Soap · Liquid Hand Wash · Body Wash · Laundry Soap · Detergent Bar · Detergent Powder · Liquid Detergent · Fabric Softener · Dish Wash Liquid · Dish Wash Bar · Floor Cleaner · Phenyl · Glass Cleaner · Toilet Cleaner · Bathroom Cleaner · Multi-Surface Cleaner · Soap Noodles · LABSA · SLES · Institutional Cleaning Chemicals

**Which page to link.** Link the home page by default. Where a directory lets you link each product, link its own page, for example:

- Detergent powder → https://www.goodbizhygiene.com/products/detergent-powder/
- Dish wash liquid → https://www.goodbizhygiene.com/products/dish-wash-liquid/
- Toilet soap → https://www.goodbizhygiene.com/products/toilet-bath-soap/
- Soap noodles → https://www.goodbizhygiene.com/products/soap-noodles/
- LABSA → https://www.goodbizhygiene.com/products/labsa/
- Private label → https://www.goodbizhygiene.com/private-label/

The full list of product pages is in https://www.goodbizhygiene.com/llms.txt.

---

## 2. Where to list, in order of value

### First: your own websites (strongest, and free)

1. **goodbizglobal.com. The links are already there** (checked 29 October 2026): the home page links to https://www.goodbizhygiene.com/ three times, and its hygiene page links to individual product pages. Two small fixes remain on that site:
   - **Its structured data says the companies are the same.** The home page's Organization lists goodbizhygiene.com (and goodbizagro, goodbizpower, goodbizchemicals) under `sameAs`, which means "this is the same organisation". For units, the right property is `subOrganization`: replace the `sameAs` list with `"subOrganization": [{"@id": "https://www.goodbizhygiene.com/#organization"}, …]` (one entry per unit). This site already declares GoodBiz Global as its `parentOrganization`, so the two then agree.
   - **Link text.** The links read only "goodbizhygiene.com". Where it reads naturally, use words that say what the unit does, for example **"GoodBiz Hygiene: soaps and home care exporter"**.
2. **The sister companies' websites** (goodbizagro.com, goodbizchemicals.com, goodbizpower.com). A plain "Group companies" mention with a link is enough. Keep it natural: a heavy site-wide footer exchange between all group sites can look like a link scheme. Send GoodBiz Agro's address so it can go into `facts.agroUrl`.

### Second: B2B marketplaces where importers search

3. **IndiaMART** (https://seller.indiamart.com). Free listing. Add each product with its own photo, its HSN code and a link to its product page.
4. **TradeIndia** (https://www.tradeindia.com). Free listing; same product set.
5. **ExportersIndia** (https://www.exportersindia.com). Free listing.
6. **Alibaba.com** (https://seller.alibaba.com). Paid (Gold Supplier), but it is where many overseas importers start. Worth it once enquiries flow.
7. **go4WorldBusiness** (https://www.go4worldbusiness.com) and **Tradekey** (https://www.tradekey.com). Free tiers; aimed at importers in Africa, the Middle East and Asia.

### Third: trust listings (few, but highly trusted)

8. **FIEO** member directory, **CHEMEXCIL** member list and your local **chamber of commerce** (for example FKCCI in Bengaluru). Ask each to show your website address next to your membership.
9. **LinkedIn company page** (https://www.linkedin.com/company/setup/new/). Use the long description and the website. Share each new buyer guide from the site there.
10. **Google Business Profile** (https://business.google.com). Only with an address that can receive Google's verification. Without a walk-in office, set it up as a **service-area business** (the address is hidden). Use exactly the name and phone above.

### Avoid

- **Paid link packages, link exchanges, "1,000 backlinks for $50" offers, private blog networks.** Google's spam policies treat bought links as manipulation. They can get the whole site pushed down. Every link above is a real listing a buyer could use, and that is the kind Google rewards.
- **Directories unrelated to trade or to India** (generic "web directories"). They add nothing.

---

## 3. After listing

- Send the profile addresses to add to `profiles` in `src/config/site.ts`.
- Reply to directory enquiries quickly: IndiaMART and TradeIndia rank responsive sellers higher in their own search.
- Ask your first satisfied buyers for a review on Google Business Profile or the marketplace they found you on.
- In Search Console, **Links** shows which sites link to you. Expect the first ones to appear within a few weeks of listing.
