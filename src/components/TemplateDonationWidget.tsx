import React, { useEffect, useMemo, useState } from 'react';
import { Heart } from 'lucide-react';
import NonprofitSelector, { type Nonprofit } from './NonprofitSelector';
import AmountSelector from './AmountSelector';

const euroFormatter = new Intl.NumberFormat('el-GR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatAmount = (value: number) => euroFormatter.format(value);

interface TemplateDonationWidgetProps {
  onDonationChange?: (amount: number, nonprofit: Nonprofit) => void;
  orderTotal: number;
  itemsCount?: number;
}

const presetOptions = [0.5, 1, 3];

export default function TemplateDonationWidget({
  onDonationChange,
  orderTotal,
  itemsCount = 3,
}: TemplateDonationWidgetProps) {
  const [selectedNonprofit, setSelectedNonprofit] = useState<Nonprofit>({
    id: '2',
    name: 'Αρκτούρος',
    description: 'Προστασία άγριων ζώων και του φυσικού τους περιβάλλοντος.',
    category: 'animals',
    icon: 'dog',
  });
  const [selectedAmount, setSelectedAmount] = useState(0.5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAmountSelectorOpen, setIsAmountSelectorOpen] = useState(false);
  const [isEnabled, setIsEnabled] = useState(true);

  useEffect(() => {
    if (isEnabled) {
      onDonationChange?.(selectedAmount, selectedNonprofit);
    } else {
      onDonationChange?.(0, selectedNonprofit);
    }
  }, [isEnabled, selectedAmount, selectedNonprofit, onDonationChange]);

  const finalTotal = useMemo(
    () => orderTotal + (isEnabled ? selectedAmount : 0),
    [orderTotal, selectedAmount, isEnabled],
  );

  return (
    <>
      <div className="bg-white rounded-[8px] border border-[#feeaea] mb-[24px] p-[20px] shadow-sm">
        <div className="flex items-start gap-[12px]">
          <div className="h-[48px] w-[48px] rounded-[12px] bg-[#fee5e5] flex items-center justify-center shrink-0">
            <Heart size={28} className="text-[#e53935]" />
          </div>
          <div className="flex-1">
            <p className="text-[#212121] font-medium mb-[4px]">Θέλετε να κάνετε μια δωρεά;</p>
            <p className={`text-[#757575] text-[14px] transition-opacity ${!isEnabled ? 'opacity-50' : 'opacity-100'}`}>
              +<button
                type="button"
                onClick={() => setIsAmountSelectorOpen(true)}
                className="underline decoration-[#212121] decoration-2 underline-offset-2 text-[#212121] font-semibold hover:text-[#0957e8] transition-colors"
                disabled={!isEnabled}
              >
                {formatAmount(selectedAmount)}€
              </button>{' '}
              στην οργάνωση{' '}
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="underline decoration-[#212121] decoration-2 underline-offset-2 text-[#212121] font-semibold hover:text-[#0957e8] transition-colors"
                disabled={!isEnabled}
              >
                {selectedNonprofit.name}
              </button>
              .
            </p>
          </div>
          <label className="relative shrink-0 cursor-pointer">
            <input
              type="checkbox"
              checked={isEnabled}
              onChange={(e) => setIsEnabled(e.target.checked)}
              className="sr-only"
              style={{ position: 'absolute', opacity: 0, width: 0, height: 0, pointerEvents: 'none' }}
              aria-label="Ενεργοποίηση δωρεάς"
            />
            <div
              className="flex items-center justify-center"
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '12px',
                border: isEnabled ? '2px solid #4caf50' : '2px solid #bdbdbd',
                backgroundColor: isEnabled ? 'rgba(76, 175, 80, 0.1)' : 'white',
              }}
            >
              {isEnabled && (
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20 6L9 17L4 12"
                    stroke="#4caf50"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </div>
          </label>
        </div>

        
      </div>

      <button className="w-full bg-[#0957e8] text-white py-[14px] px-[24px] rounded-[8px] hover:bg-[#0745b8] transition-colors">
        Ολοκλήρωση Παραγγελίας
      </button>
      
      <NonprofitSelector
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(nonprofit) => {
          setSelectedNonprofit(nonprofit);
          if (isEnabled) {
            onDonationChange?.(selectedAmount, nonprofit);
          } else {
            onDonationChange?.(0, nonprofit);
          }
        }}
        selectedId={selectedNonprofit.id}
      />

      <AmountSelector
        isOpen={isAmountSelectorOpen}
        onClose={() => setIsAmountSelectorOpen(false)}
        onSelect={(amount) => {
          setSelectedAmount(amount);
          setIsEnabled(true);
        }}
        selectedAmount={selectedAmount}
        presetOptions={presetOptions}
      />
    </>
  );
}

