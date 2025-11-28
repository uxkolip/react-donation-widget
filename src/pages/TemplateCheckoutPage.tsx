import React, { useState } from 'react';
import CheckoutForm from '../components/CheckoutForm';
import TemplateDonationWidget from '../components/TemplateDonationWidget';
import type { Nonprofit } from '../components/NonprofitSelector';
import { formatCurrency } from '../lib/currency';

const ORDER_TOTAL = 149.99;

export default function TemplateCheckoutPage() {
  const [donationAmount, setDonationAmount] = useState(0);
  const [selectedNonprofit, setSelectedNonprofit] = useState<Nonprofit | null>(null);

  const finalTotal = ORDER_TOTAL + donationAmount;

  const handleDonationChange = (amount: number, nonprofit: Nonprofit) => {
    setDonationAmount(amount);
    setSelectedNonprofit(nonprofit);
  };

  return (
    <div className="max-w-[800px] mx-auto">
      <header className="mb-[32px]">
        <h1 className="text-[#212121] mb-[8px] text-[24px] font-semibold">Template Checkout</h1>
        <p className="text-[#757575]">
          Η σελίδα ολοκλήρωσης παραγγελίας που βασίζεται στο template που μοιράστηκες.
        </p>
      </header>

      <section className="mb-[24px]">
        <CheckoutForm />
      </section>

      <section className="bg-white rounded-[8px] p-[24px] border border-[#e0e0e0] mb-[24px]">
        <h2 className="text-[#212121] mb-[16px] text-[18px]">Περίληψη Παραγγελίας</h2>
        <div className="flex flex-col gap-[12px]">
          <div className="flex justify-between items-center">
            <span className="text-[#424242]">Προϊόντα (3 τεμ.)</span>
            <span className="text-[#212121]">{formatCurrency(ORDER_TOTAL)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#424242]">Μεταφορικά</span>
            <span className="text-[#00c853]">Δωρεάν</span>
          </div>
          {donationAmount > 0 && (
            <div className="flex justify-between items-center text-[#e53935]">
              <span>Δωρεά</span>
              <span>+{formatCurrency(donationAmount)}</span>
            </div>
          )}
          <div className="border-t border-[#e0e0e0] pt-[12px] mt-[4px]">
            <div className="flex justify-between items-center">
              <span className="text-[#212121]">Σύνολο</span>
              <span className="text-[#212121]">{formatCurrency(finalTotal)}</span>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-[24px]">
        <TemplateDonationWidget
          onDonationChange={handleDonationChange}
          orderTotal={ORDER_TOTAL}
        />
      </section>

      <p className="text-center text-[#9e9e9e] text-[12px]">
        Επιλεγμένη οργάνωση: {selectedNonprofit?.name ?? 'Καμία'}
      </p>
    </div>
  );
}

