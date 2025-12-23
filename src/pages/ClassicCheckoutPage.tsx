import React, { useState } from 'react';
import CheckoutForm from '../components/CheckoutForm';
import DonationWidget from '../components/DonationWidget';
import type { Nonprofit } from '../components/NonprofitSelector';
import { formatCurrency } from '../lib/currency';

const ORDER_TOTAL = 149.99;

export default function ClassicCheckoutPage() {
  const [donationAmount, setDonationAmount] = useState(0);
  const [selectedNonprofit, setSelectedNonprofit] = useState<Nonprofit | null>(null);

  const finalTotal = ORDER_TOTAL + donationAmount;

  const handleDonationChange = (amount: number, nonprofit: Nonprofit) => {
    setDonationAmount(amount);
    setSelectedNonprofit(nonprofit);
  };

  return (
    <div className="max-w-[800px] mx-auto">
      <header>
        <h1 className="text-[#212121] text-[24px] font-semibold" style={{ marginBottom: '8px' }}>Ολοκλήρωση Παραγγελίας</h1>
        <p className="text-[#757575]">
          Συμπληρώστε τα στοιχεία σας για να ολοκληρώσετε την παραγγελία
        </p>
      </header>

      <section className="mt-[32px]">
        <CheckoutForm />
      </section>

      <div style={{ marginTop: '32px' }}>
        <DonationWidget onDonationChange={handleDonationChange} />
      </div>

      <section className="bg-white rounded-[8px] p-[24px] border border-[#e0e0e0]" style={{ marginTop: '32px' }}>
        <h2 className="text-[#212121] text-[18px]" style={{ marginBottom: '16px' }}>Περίληψη Παραγγελίας</h2>
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
            <div className="flex justify-between items-center text-[#0957e8]">
              <span>Δωρεά</span>
              <span>+{formatCurrency(donationAmount)}</span>
            </div>
          )}
          <div className="border-t border-[#e0e0e0]" style={{ paddingTop: '12px', marginTop: '4px' }}>
            <div className="flex justify-between items-center">
              <span className="text-[#212121]">Σύνολο</span>
              <span className="text-[#212121]">{formatCurrency(finalTotal)}</span>
            </div>
          </div>
        </div>
      </section>

      <button className="w-full bg-[#0957e8] text-white py-[14px] px-[24px] rounded-[8px] hover:bg-[#0745b8] transition-colors" style={{ marginTop: '32px' }}>
        Ολοκλήρωση Παραγγελίας
      </button>
      <p className="text-center text-[#757575]" style={{ marginTop: '16px' }}>
        Οι συναλλαγές σας είναι ασφαλείς και κρυπτογραφημένες
      </p>
      {selectedNonprofit && (
        <p className="text-center text-[#9e9e9e] text-[12px]" style={{ marginTop: '8px' }}>
          Επιλεγμένη οργάνωση: {selectedNonprofit.name}
        </p>
      )}
    </div>
  );
}

