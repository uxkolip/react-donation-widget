import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import NonprofitSelector, { type Nonprofit } from './NonprofitSelector';

const euroFormatter = new Intl.NumberFormat('el-GR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatAmount = (value: number) => euroFormatter.format(value);

interface DonationWidgetProps {
  onDonationChange?: (amount: number, nonprofit: Nonprofit) => void;
}

export default function DonationWidget({ onDonationChange }: DonationWidgetProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loadingAmount, setLoadingAmount] = useState<number | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [selectedNonprofit, setSelectedNonprofit] = useState<Nonprofit>({
    id: 'zwes',
    name: 'Ζω.Ε.Σ. (Ζωοφιλικές Ενημερώσεις Σχολείων, Ιδρυμάτων και Οργανισμών)',
    description: 'Δραστηριοποιείται στον τομέα της προστασίας ζώων και της εκπαίδευσης για την ευζωία τους.',
    category: 'animals',
    icon: 'dog'
  });

  const presetAmounts = [0.5, 1, 3];

  const handleAmountClick = (amount: number) => {
    // Don't show spinner if this amount is already selected
    if (selectedAmount === amount) {
      return;
    }
    
    setLoadingAmount(amount);
    
    setTimeout(() => {
      setSelectedAmount(amount);
      setCustomAmount('');
      onDonationChange?.(amount, selectedNonprofit);
      setLoadingAmount(null);
    }, 800);
  };

  const handleCustomAmountChange = (value: string) => {
    // Allow only numbers and comma/dot for decimals
    const sanitized = value.replace(/[^0-9,]/g, '');
    setCustomAmount(sanitized);
    setSelectedAmount(null);
    
    const numValue = parseFloat(sanitized.replace(',', '.'));
    if (!isNaN(numValue)) {
      onDonationChange?.(numValue, selectedNonprofit);
    }
  };

  const handleClearAll = () => {
    setIsClearing(true);
    
    setTimeout(() => {
      setCustomAmount('');
      setSelectedAmount(null);
      onDonationChange?.(0, selectedNonprofit);
      setIsClearing(false);
    }, 800);
  };

  const handleNonprofitSelect = (nonprofit: Nonprofit) => {
    setSelectedNonprofit(nonprofit);
    const currentAmount = selectedAmount || (customAmount ? parseFloat(customAmount.replace(',', '.')) : 0);
    if (currentAmount > 0) {
      onDonationChange?.(currentAmount, nonprofit);
    }
  };

  const getTotalAmount = () => {
    if (selectedAmount) return formatAmount(selectedAmount);
    if (customAmount) {
      const num = parseFloat(customAmount.replace(',', '.'));
      return isNaN(num) ? formatAmount(0) : formatAmount(num);
    }
    return formatAmount(0);
  };

  return (
    <>
      <div className="bg-white relative rounded-[8px] size-full">
        <div className="content-stretch flex flex-col gap-[8px] items-center justify-center overflow-clip relative rounded-[inherit] size-full mt-[0px] mr-[0px] mb-[20px] ml-[0px]">
          {/* Header */}
          <div className="bg-[#eeeeee] relative shrink-0 w-full">
            <div className="flex flex-row items-center size-full">
              <div className="box-border content-stretch flex items-center justify-between p-[8px] relative w-full px-[20px] py-[8px]">
                <div className="basis-0 content-stretch flex font-['Proxima_Nova:Regular',sans-serif] gap-[4px] grow items-center leading-[28px] min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-nowrap">
                  <p className="relative shrink-0 text-[#424242] whitespace-pre">Δωρεά στις</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="[text-underline-position:from-font] [white-space-collapse:collapse] basis-0 decoration-solid grow min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[#0957e8] underline text-left hover:text-[#0745b8] transition-colors"
                  >
                    {selectedNonprofit.name}
                  </button>
                </div>
                <div className="bg-[#212121] box-border content-stretch flex gap-[4px] items-center justify-center p-[4px] relative rounded-[4px] shrink-0">
                  <p className="font-['Proxima_Nova:Semibold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">
                    {getTotalAmount()}€
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Amount Selection */}
          <div className="relative shrink-0 w-full">
            <div className="size-full">
              <div className="box-border content-stretch flex flex-col gap-[12px] items-start p-[8px] relative w-full px-[20px] py-[8px] mt-[0px] mr-[0px] mb-[8px] ml-[0px]">
                <p className="font-['Proxima_Nova:Regular',sans-serif] leading-[normal] not-italic overflow-ellipsis overflow-hidden relative shrink-0 text-[#212121] text-[14px] text-nowrap whitespace-pre">
                  Επιλέξτε το ποσό που θέλετε να δωρήσετε
                </p>
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                  {/* Preset amounts */}
                  {presetAmounts.map((amount) => {
                    const isLoading = loadingAmount === amount;
                    const isSelected = selectedAmount === amount;
                    
                    return (
                      <button
                        key={amount}
                        onClick={() => handleAmountClick(amount)}
                        disabled={isLoading || loadingAmount !== null}
                        className={`basis-0 grow min-h-px min-w-px relative rounded-[8px] shrink-0 transition-all ${
                          isSelected || isLoading
                            ? 'bg-[#212121]'
                            : 'bg-white hover:bg-[#212121] group'
                        } ${loadingAmount !== null && !isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                      >
                        <div
                          aria-hidden="true"
                          className={`absolute border border-solid inset-0 pointer-events-none rounded-[8px] ${
                            isSelected || isLoading ? 'border-[#212121]' : 'border-[#bdbdbd]'
                          }`}
                        />
                        <div className="flex flex-col items-center justify-end size-full">
                          <div className="box-border content-stretch flex flex-col gap-[16px] items-center justify-end px-[5px] py-[14px] relative w-full">
                            <div className="content-stretch flex gap-[12px] items-start relative shrink-0">
                              {isLoading ? (
                                <Loader2 
                                  size={16} 
                                  className="text-white animate-spin" 
                                />
                              ) : (
                                <p
                                  className={`font-['Proxima_Nova:Semibold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[16px] text-nowrap whitespace-pre ${
                                    isSelected ? 'text-white' : 'text-[#212121] group-hover:text-white'
                                  }`}
                                >
                                  {formatAmount(amount)}€
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}

                  {/* Trash icon to clear selection */}
                  <button
                    onClick={handleClearAll}
                    disabled={isClearing || loadingAmount !== null}
                    className={`bg-white box-border content-stretch flex flex-col gap-[16px] items-center justify-end px-[5px] py-[14px] relative rounded-[8px] shrink-0 w-[47px] hover:bg-[#f5f5f5] active:bg-[#eeeeee] transition-colors ${
                      isClearing || loadingAmount !== null ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    aria-label="Καθαρισμός επιλογής"
                  >
                    <div
                      aria-hidden="true"
                      className="absolute border border-[#bdbdbd] border-solid inset-0 pointer-events-none rounded-[8px]"
                    />
                    <div className="h-[19px] relative shrink-0 w-[16.625px] flex items-center justify-center">
                      {isClearing ? (
                        <Loader2 size={16} className="text-[#212121] animate-spin" />
                      ) : (
                        <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M0.666016 3.77774H13.1105M5.33268 6.88885V11.5555M8.44379 6.88885V11.5555M1.44379 3.77774L2.22157 13.1111C2.22157 13.5236 2.38546 13.9193 2.67718 14.211C2.96891 14.5027 3.36457 14.6666 3.77713 14.6666H9.99935C10.4119 14.6666 10.8076 14.5027 11.0993 14.211C11.391 13.9193 11.5549 13.5236 11.5549 13.1111L12.3327 3.77774M4.5549 3.77774V1.4444C4.5549 1.23812 4.63685 1.04029 4.78271 0.894432C4.92857 0.74857 5.1264 0.666626 5.33268 0.666626H8.44379C8.65007 0.666626 8.8479 0.74857 8.99377 0.894432C9.13963 1.04029 9.22157 1.23812 9.22157 1.4444V3.77774" stroke="#212121" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      )}
                    </div>
                  </button>
                </div>

                
              </div>
            </div>
          </div>
        </div>
        <div
          aria-hidden="true"
          className="absolute border border-[#e0e0e0] border-solid inset-[-1px] pointer-events-none rounded-[9px]"
        />
      </div>

      <NonprofitSelector
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleNonprofitSelect}
        selectedId={selectedNonprofit.id}
      />
    </>
  );
}
