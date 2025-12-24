import React, { useState } from 'react';
import CheckoutFormDE from '../components/CheckoutFormDE';
import CombinedSliderDonationWidgetDE from '../components/CombinedSliderDonationWidgetDE';
import type { Nonprofit } from '../components/NonprofitSelector';
import { formatCurrency } from '../lib/currency';

const ORDER_TOTAL = 149.99;

export default function CombinedSliderCheckoutPageDE() {
  const [donationAmount, setDonationAmount] = useState(0);
  const [selectedNonprofit, setSelectedNonprofit] = useState<Nonprofit | null>(null);

  const finalTotal = ORDER_TOTAL + donationAmount;

  const handleDonationChange = (amount: number, nonprofit: Nonprofit | null) => {
    if (amount > 0 && nonprofit) {
      setDonationAmount(amount);
      setSelectedNonprofit(nonprofit);
    } else {
      setDonationAmount(0);
      setSelectedNonprofit(nonprofit);
    }
  };

  return (
    <div className="max-w-[800px] mx-auto">
      <header className="mb-[32px]">
        <h1 className="text-[#212121] mb-[8px] text-[24px] font-semibold">Bestellung abschließen</h1>
        <p className="text-[#757575]">
          Bitte füllen Sie Ihre Daten aus, um die Bestellung abzuschließen
        </p>
      </header>

      <section className="mb-[24px]">
        <CheckoutFormDE />
      </section>

      <div className="mb-[24px]">
        <CombinedSliderDonationWidgetDE onDonationChange={handleDonationChange} />
      </div>

      <section className="bg-white rounded-[8px] p-[24px] border border-[#e0e0e0] mb-[24px]">
        <h2 className="text-[#212121] mb-[16px] text-[18px]">Bestellübersicht</h2>
        <div className="flex flex-col gap-[12px]">
          <div className="flex justify-between items-center">
            <span className="text-[#424242]">Produkte (3 Stk.)</span>
            <span className="text-[#212121]">{formatCurrency(ORDER_TOTAL)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-[#424242]">Versand</span>
            <span className="text-[#00c853]">Kostenlos</span>
          </div>
          {donationAmount > 0 && (
            <div className="flex justify-between items-center text-[#0957e8]">
              <span>Spende für {selectedNonprofit?.name || ''}</span>
              <span>+{formatCurrency(donationAmount)}</span>
            </div>
          )}
          <div className="border-t border-[#e0e0e0] pt-[12px] mt-[4px]">
            <div className="flex justify-between items-center">
              <span className="text-[#212121]">Gesamt</span>
              <span className="text-[#212121]">{formatCurrency(finalTotal)}</span>
            </div>
          </div>
        </div>
      </section>

      <button className="w-full bg-[#212121] text-white py-[14px] px-[24px] rounded-[8px] hover:bg-[#1a1a1a] transition-colors">
        Bestellung absenden
      </button>
      <p className="text-center text-[#757575] mt-[16px]">
        Ihre Transaktionen sind sicher und verschlüsselt
      </p>
      {selectedNonprofit && (
        <p className="text-center text-[#9e9e9e] text-[12px] mt-[8px]">
          Ausgewählte Organisation: {selectedNonprofit.name}
        </p>
      )}
    </div>
  );
}

