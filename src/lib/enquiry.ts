export type EnquiryFields = {
  name?: string;
  company?: string;
  country?: string;
  email?: string;
  phone?: string;
  products?: string[];
  quantity?: string;
  privateLabel?: boolean;
  message?: string;
};

const SUBJECT = 'Export Enquiry - GoodBiz Hygiene';

export function enquiryText(f: EnquiryFields): string {
  const lines: string[] = [];
  const add = (label: string, value?: string) => {
    const v = value?.trim();
    if (v) lines.push(`${label}: ${v}`);
  };
  add('Name', f.name);
  add('Company', f.company);
  add('Country', f.country);
  add('Email', f.email);
  add('Phone', f.phone);
  add('Products', f.products?.map((p) => p.trim()).filter(Boolean).join(', '));
  add('Quantity', f.quantity);
  if (f.privateLabel !== undefined) add('Private label', f.privateLabel ? 'Yes' : 'No');
  add('Message', f.message);
  return lines.join('\n');
}

export function buildWhatsAppUrl(number: string, f: EnquiryFields): string {
  return `https://wa.me/${number}?text=${encodeURIComponent(enquiryText(f))}`;
}

export function buildMailtoUrl(email: string, f: EnquiryFields): string {
  return `mailto:${email}?subject=${encodeURIComponent(SUBJECT)}&body=${encodeURIComponent(enquiryText(f))}`;
}
