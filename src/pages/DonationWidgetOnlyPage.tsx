import React, { useState } from 'react';
import CombinedDonationWidget from '../components/CombinedDonationWidget';
import type { Nonprofit } from '../components/NonprofitSelector';

export default function DonationWidgetOnlyPage() {
  const [, setDonationAmount] = useState(0);
  const [, setSelectedNonprofit] = useState<Nonprofit | null>(null);

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
      <div className="mb-[24px]">
        <CombinedDonationWidget onDonationChange={handleDonationChange} singleOrg />
      </div>
    </div>
  );
}
