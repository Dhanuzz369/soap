/**
 * Progressive enhancement for EnquiryForm.astro.
 * - Pre-selects products named in ?product=<slug> (comma-separated or repeated).
 * - Prefills the message from ?message=<text> (sent by the home page's quote card).
 * - On submit, validates natively, then reveals "Send via WhatsApp" / "Send via Email"
 *   links built with the same pure helpers the tests cover.
 * Without this script the form posts to mailto: as normal.
 */
import { buildMailtoUrl, buildWhatsAppUrl, fieldsFromEntries, parseEnquiryParams } from '../lib/enquiry';

export function initEnquiryForms(root: ParentNode = document): void {
  const { products, message } = parseEnquiryParams(location.search);
  const wanted = new Set(products);

  root.querySelectorAll<HTMLFormElement>('form[data-enquiry]').forEach((form) => {
    const email = form.dataset.email ?? '';
    const whatsapp = form.dataset.whatsapp ?? '';
    const panel = form.querySelector<HTMLElement>('[data-enquiry-send]');
    const wa = form.querySelector<HTMLAnchorElement>('[data-send-whatsapp]');
    const mail = form.querySelector<HTMLAnchorElement>('[data-send-email]');
    const hint = form.querySelector<HTMLElement>('[data-enquiry-hint]');

    let first: HTMLInputElement | null = null;
    form.querySelectorAll<HTMLInputElement>('input[data-slug]').forEach((box) => {
      if (wanted.has(box.dataset.slug ?? '')) {
        box.checked = true;
        first ??= box;
      }
    });
    if (first) (first as HTMLInputElement).closest('.enq-range')?.setAttribute('data-preselected', '');

    const msg = form.querySelector<HTMLTextAreaElement>('textarea[data-message]');
    if (msg && message && !msg.value) msg.value = message;

    if (!panel || !wa || !mail) return;
    if (hint) hint.textContent = 'Next, choose to send it by WhatsApp or by email.';

    const update = () => {
      const fields = fieldsFromEntries(new FormData(form) as unknown as Iterable<[string, FormDataEntryValue]>);
      wa.href = buildWhatsAppUrl(whatsapp, fields);
      mail.href = buildMailtoUrl(email, fields);
    };

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      update();
      const wasHidden = panel.hidden;
      panel.hidden = false;
      if (wasHidden) panel.focus({ preventScroll: true });
      panel.scrollIntoView({ block: 'nearest', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
    });
    // Keep the links in step if the buyer edits after revealing them.
    form.addEventListener('input', () => {
      if (!panel.hidden) update();
    });
  });
}
