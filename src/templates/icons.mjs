// Inline SVG icons used across the site.
const S = (inner, opts = {}) =>
  `<svg width="${opts.w || 27}" height="${opts.h || opts.w || 27}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${opts.sw || 1.6}" stroke-linecap="round" stroke-linejoin="round">${inner}</svg>`;

export const icons = {
  smile: S('<circle cx="12" cy="12" r="9.2"></circle><path d="M7.8 14.2c1.1 1.5 2.6 2.3 4.2 2.3s3.1-.8 4.2-2.3"></path><circle cx="9" cy="10" r="0.9" fill="currentColor" stroke="none"></circle><circle cx="15" cy="10" r="0.9" fill="currentColor" stroke="none"></circle>'),
  veneer: S('<path d="M12 3.2c-1.7 0-2.8 1.4-5 1.4C4.6 4.6 3 5.8 3 8.6c0 2.3.9 3.7 1.5 6 .6 2.3.7 6.4 2.3 6.4 1.4 0 1.2-3.7 1.9-5.6.4-1.1.7-1.7 1.3-1.7s.9.6 1.3 1.7c.7 1.9.5 5.6 1.9 5.6 1.6 0 1.7-4.1 2.3-6.4.6-2.3 1.5-3.7 1.5-6 0-2.8-1.6-4-4-4-2.2 0-3.3-1.4-5-1.4Z"></path>'),
  shield: S('<path d="M12 3l7 2.4v5c0 4.3-2.9 7.7-7 9-4.1-1.3-7-4.7-7-9v-5z"></path><path d="M9 12l2 2 4-4"></path>'),
  implant: S('<path d="M8 6.2c0-1.9 1.8-3 4-3s4 1.1 4 3c0 1.6-1.1 2.6-4 2.6S8 7.8 8 6.2Z"></path><path d="M12 8.8V21"></path><path d="M9.6 12h4.8M9.6 14.4h4.8M10 16.8h4"></path>'),
  sparkle: S('<path d="M12 2.6l1.9 5.4 5.5.2-4.4 3.3 1.6 5.3L12 18.9 7 20l1.6-5.3-4.4-3.3 5.5-.2z" fill="currentColor" stroke="none"></path><path d="M18.6 15.4l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z" fill="currentColor" stroke="none"></path>'),
  allon: S('<path d="M4 9.5c0 6 3.7 10.5 8 10.5s8-4.5 8-10.5"></path><circle cx="6.8" cy="11.4" r="1.05" fill="currentColor" stroke="none"></circle><circle cx="10.1" cy="16.2" r="1.05" fill="currentColor" stroke="none"></circle><circle cx="13.9" cy="16.2" r="1.05" fill="currentColor" stroke="none"></circle><circle cx="17.2" cy="11.4" r="1.05" fill="currentColor" stroke="none"></circle>'),
  align: S('<path d="M4 9.5c2.4-2.6 13.6-2.6 16 0"></path><path d="M5.4 12.6c1.9-2 11.3-2 13.2 0"></path><path d="M6.4 9.6v3.6M17.6 9.6v3.6M12 10v3.6"></path>'),
  surgery: S('<path d="M4 13l8-8 3 3-8 8H4z"></path><path d="M14 6l3-3 1.5 1.5-3 3z"></path><path d="M4 20h16"></path>'),
  joint: S('<circle cx="8" cy="9" r="3"></circle><circle cx="16" cy="15" r="3"></circle><path d="M10.5 11l3 2"></path>'),
  gum: S('<path d="M4 8c2-2 14-2 16 0v4c0 4-4 8-8 8s-8-4-8-8z"></path><path d="M9 12v3M15 12v3"></path>'),
  child: S('<circle cx="12" cy="7" r="3"></circle><path d="M6 21c0-3.3 2.7-6 6-6s6 2.7 6 6"></path>'),
  care: S('<path d="M12 20s-7-4.5-7-10a4 4 0 018-1 4 4 0 018 1c0 5.5-7 10-9 10z"></path>'),
  breath: S('<path d="M12 3v6"></path><circle cx="12" cy="14" r="6"></circle><path d="M12 11v3l2 2"></path>'),
  sleep: S('<path d="M20 12.5A8 8 0 1111.5 4a6 6 0 008.5 8.5z"></path>'),
  root: S('<path d="M9 3h6l-1 6c1 3 1 8-2 12-3-4-3-9-2-12z"></path>'),
  check: (o = {}) => S('<path d="M20 6L9 17l-5-5"></path>', { w: o.w || 18, sw: 2.2 }),
  arrow: (o = {}) => S('<path d="M5 12h14M13 6l6 6-6 6"></path>', { w: o.w || 17, sw: 2 }),
  arrowSm: S('<path d="M5 12h14M13 6l6 6-6 6"></path>', { w: 15, sw: 2.2 }),
  wa: `<svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2a10 10 0 00-8.6 15L2 22l5.2-1.4A10 10 0 1012 2Zm5.4 14.2c-.2.6-1.2 1.1-1.7 1.2-.5.1-1 .1-1.7-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1-1.4-1-2.6 0-1.3.6-1.9.9-2.1.2-.2.5-.3.7-.3h.5c.2 0 .4.1.6.5l.7 1.7c0 .2.1.3 0 .5l-.4.5c-.1.2-.3.3-.1.6.1.3.7 1.1 1.3 1.6.9.8 1.6 1 1.8 1.1.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.6-.1l1.6.8c.2.1.4.2.4.3.1.1.1.5-.1 1Z"></path></svg>`,
  phone: S('<path d="M22 16.9v3a2 2 0 01-2.2 2 19.8 19.8 0 01-8.6-3.1 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.1-8.7A2 2 0 014.1 2h3a2 2 0 012 1.7c.1 1 .4 1.9.7 2.8a2 2 0 01-.5 2.1L8.1 9.9a16 16 0 006 6l1.3-1.3a2 2 0 012.1-.4c.9.3 1.8.6 2.8.7a2 2 0 011.7 2Z"></path>', { w: 21, sw: 1.8 }),
  mail: S('<rect x="2" y="4" width="20" height="16" rx="2"></rect><path d="M3 6l9 7 9-7"></path>', { w: 21, sw: 1.8 }),
  pin: S('<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0116 0Z"></path><circle cx="12" cy="10" r="3"></circle>', { w: 21, sw: 1.8 }),
  clock: S('<circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path>', { w: 21, sw: 1.8 }),
  instagram: `<svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="5"></rect><circle cx="12" cy="12" r="4"></circle><circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" stroke="none"></circle></svg>`,
  facebook: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M14.5 8.5H17V5.6h-2.6c-2.1 0-3.4 1.4-3.4 3.4v1.6H8.4v2.9H11V21h3v-7.5h2.4l.5-2.9H14v-1.3c0-.5.2-.8.5-.8Z"></path></svg>`,
  youtube: `<svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor"><path d="M22 8.2a3 3 0 00-2.1-2.1C18 5.5 12 5.5 12 5.5s-6 0-7.9.6A3 3 0 002 8.2 31 31 0 001.9 12 31 31 0 002 15.8a3 3 0 002.1 2.1c1.9.6 7.9.6 7.9.6s6 0 7.9-.6a3 3 0 002.1-2.1A31 31 0 0022 12a31 31 0 00-.1-3.8ZM10 15V9l5.2 3Z"></path></svg>`,
};
