import React from 'react';
import { X, Check } from 'lucide-react';
import { useEffect } from 'react';

interface AmountSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (amount: number) => void;
  selectedAmount: number;
  presetOptions: number[];
}

const euroFormatter = new Intl.NumberFormat('el-GR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatAmount = (value: number) => euroFormatter.format(value);

// Extended amounts based on the template image
const extendedAmounts = [0.5, 1, 3];

export default function AmountSelector({
  isOpen,
  onClose,
  onSelect,
  selectedAmount,
  presetOptions,
}: AmountSelectorProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      console.log('AmountSelector opened with selectedAmount:', selectedAmount);
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, selectedAmount]);

  // Combine preset options with extended amounts, removing duplicates
  const allAmounts = Array.from(
    new Set([...presetOptions, ...extendedAmounts].sort((a, b) => a - b))
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Modal - Desktop / Drawer - Mobile */}
      <div className="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-50 pointer-events-none">
        <div
          className={`bg-white rounded-t-[24px] md:rounded-[16px] max-h-[85vh] md:max-h-[600px] w-full md:max-w-[600px] flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
            isOpen
              ? 'translate-y-0 md:scale-100 md:opacity-100 pointer-events-auto'
              : 'translate-y-full md:translate-y-0 md:scale-95 md:opacity-0 pointer-events-none'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-[20px] border-b border-[#e0e0e0] shrink-0">
            <h2 className="text-[#212121]">Επιλογή ποσού</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-[8px] hover:bg-[#f5f5f5] rounded-full transition-colors"
              aria-label="Κλείσιμο"
            >
              <X size={24} className="text-[#424242]" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1">
            <div className="p-[20px] flex flex-col gap-[12px]">
              {/* Amount List */}
              {allAmounts.map((amount) => {
                const isSelected = Math.abs(selectedAmount - amount) < 0.01;
                console.log('Amount:', amount, 'SelectedAmount:', selectedAmount, 'IsSelected:', isSelected);
                return (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => {
                      onSelect(amount);
                      onClose();
                    }}
                    className={`flex items-center justify-between w-full p-[16px] bg-white border rounded-[12px] transition-all hover:shadow-md text-left ${
                      isSelected ? 'border-[#0957e8]' : 'border-[#e0e0e0]'
                    }`}
                  >
                    <span className="text-[#212121] text-[16px]">
                      {formatAmount(amount)} €
                    </span>
                    <div className="flex items-center justify-center shrink-0">
                      {isSelected ? (
                        <div className="w-[32px] h-[32px] rounded-full bg-[#4caf50] flex items-center justify-center">
                          <Check size={20} className="text-white" />
                        </div>
                      ) : (
                        <div className="w-[32px] h-[32px] rounded-full border-2 border-[#e0e0e0] flex items-center justify-center hover:border-[#0957e8] transition-colors" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

