import React from 'react';
import { MessageSquare, Phone } from 'lucide-react';

const INTRO_MESSAGE = 'Hello, I found your accommodation listing on the Student Portal and I would like to enquire about availability.';

interface HousingContactActionsProps {
  phone?: string;
  listingTitle: string;
  compact?: boolean;
}

const cleanPhoneNumber = (phone: string) => phone.replace(/[^\d+]/g, '');
const whatsappNumber = (phone: string) => phone.replace(/\D/g, '');

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <path fill="currentColor" d="M12 2a9.9 9.9 0 0 0-8.55 14.9L2 22l5.27-1.38A10 10 0 1 0 12 2Z" />
    <path fill="white" d="M8.1 7.05c.2-.2.44-.25.73-.15l1.25.45c.25.1.4.28.47.54l.3 1.2c.06.25 0 .48-.2.67l-.65.64c.58 1.08 1.45 1.95 2.53 2.53l.64-.65c.19-.2.42-.26.67-.2l1.2.3c.26.07.44.22.54.47l.45 1.25c.1.29.05.53-.15.73-.36.36-.78.54-1.26.54-1.5 0-3.15-.75-4.95-2.55S7.12 9.83 7.12 8.33c0-.48.18-.9.54-1.28l.44-.44Z" />
  </svg>
);

export const HousingContactActions: React.FC<HousingContactActionsProps> = ({
  phone,
  listingTitle,
  compact = false,
}) => {
  if (!phone) return null;

  const safePhone = cleanPhoneNumber(phone);
  const message = encodeURIComponent(INTRO_MESSAGE);
  const iconClass = compact ? 'h-3.5 w-3.5' : 'h-4 w-4';
  const actionClass = compact
    ? 'flex h-8 w-8 items-center justify-center rounded-lg transition hover:-translate-y-0.5'
    : 'flex h-9 w-9 items-center justify-center rounded-xl transition hover:-translate-y-0.5';

  return (
    <div className="flex items-center gap-1.5" aria-label={`Contact ${listingTitle}`}>
      <a
        href={`https://wa.me/${whatsappNumber(phone)}?text=${message}`}
        target="_blank"
        rel="noreferrer"
        aria-label={`WhatsApp ${listingTitle}`}
        title="WhatsApp landlord"
        className={`${actionClass} bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:text-emerald-300 dark:hover:bg-emerald-900/60`}
      >
        <WhatsAppIcon className={iconClass} />
      </a>
      <a
        href={`tel:${safePhone}`}
        aria-label={`Call ${listingTitle}`}
        title="Call landlord"
        className={`${actionClass} bg-blue-50 text-[#0B2A6F] hover:bg-blue-100 dark:bg-blue-950/50 dark:text-blue-300 dark:hover:bg-blue-900/60`}
      >
        <Phone className={iconClass} strokeWidth={2.2} />
      </a>
      <a
        href={`sms:${safePhone}?body=${message}`}
        aria-label={`SMS ${listingTitle}`}
        title="Text landlord"
        className={`${actionClass} bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-950/50 dark:text-amber-300 dark:hover:bg-amber-900/60`}
      >
        <MessageSquare className={iconClass} strokeWidth={2.2} />
      </a>
    </div>
  );
};
