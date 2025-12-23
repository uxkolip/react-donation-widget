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
    id: 'arsis',
    name: 'ΑΡΣΙΣ',
    description: 'Παρέχει κοινωνική υποστήριξη και προστασία σε ευάλωτες ομάδες πληθυσμού.',
    category: 'humans',
    icon: 'heart',
    logo: 'https://youbehero.com/images/cause/265/l/arsis_logo.png'
  });

  const presetAmounts = [1, 2, 4];

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
        <div className="content-stretch flex flex-col gap-[8px] items-center justify-center overflow-clip relative rounded-[inherit] size-full">
          {/* Header */}
          <div className="bg-[#fcf5ff] relative shrink-0 w-full">
            <div className="flex flex-row items-center size-full">
              <div className="box-border content-stretch flex items-center justify-between p-[8px] relative w-full px-[20px] py-[8px]">
                <div className="basis-0 content-stretch flex font-['Proxima_Nova:Regular',sans-serif] gap-[4px] grow items-center leading-[28px] min-h-px min-w-px not-italic relative shrink-0 text-[16px] text-nowrap">
                  <p className="relative shrink-0 text-[#424242] whitespace-pre font-bold">Δωρεά στον φορέα:</p>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="[text-underline-position:from-font] font-bold [white-space-collapse:collapse] basis-0 decoration-solid grow min-h-px min-w-px overflow-ellipsis overflow-hidden relative shrink-0 text-[#0957e8] underline text-left hover:text-[#0745b8] transition-colors cursor-pointer"
                  >
                    {selectedNonprofit.name}
                  </button>
                </div>
                <div className="bg-[#8320bd] box-border content-stretch flex gap-[4px] items-center justify-center p-[4px] relative rounded-[4px] shrink-0">
                  <span
                    aria-hidden="true"
                    style={{
                      width: '12px',
                      height: '12px',
                      display: 'inline-flex',
                      marginRight: '4px',
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      height="12"
                      viewBox="0 0 12 12"
                      width="12"
                      focusable="false"
                      aria-hidden="true"
                      style={{ pointerEvents: 'none', display: 'inherit', width: '100%', height: '100%' }}
                    >
                      <path d="M8.125 1C7.35 1 6.599 1.267 6 1.758 5.4 1.268 4.65.999 3.875 1c-.895 0-1.754.356-2.386.989C.856 2.62.5 3.479.5 4.375c0 2.249 1.392 3.908 2.604 4.935.74.62 1.551 1.148 2.419 1.571l.048.022.015.007.004.003h.002L6 10l-.407.914.407.18.406-.18L6 10c.134.305.27.61.407.913l.002-.001.005-.002.014-.007.048-.023c.868-.422 1.68-.95 2.42-1.57C10.107 8.283 11.5 6.624 11.5 4.375c0-.895-.356-1.754-.989-2.386C9.88 1.356 9.021 1 8.125 1ZM6 3.25c.133 0 .26.053.354.146.093.094.146.221.146.354v.327c.284.087.54.247.744.464l.008.009.003.004.001.003c.078.102.114.23.1.357-.014.128-.077.245-.175.327-.099.083-.225.124-.353.115-.128-.009-.248-.067-.334-.162l.002.004-.017-.016c-.13-.12-.302-.186-.48-.185-.199 0-.315.052-.37.096-.043.034-.07.078-.07.157 0 .015.002.03.005.046l.002.004.008.009c.013.01.028.02.044.028.113.06.287.098.571.153.237.047.582.111.86.269.15.085.3.207.41.385.112.18.163.386.163.606 0 .621-.477 1.048-1.122 1.192v.308c0 .133-.053.26-.146.354-.094.093-.221.146-.354.146-.133 0-.26-.053-.354-.146-.093-.094-.146-.221-.146-.354v-.306c-.272-.052-.526-.17-.739-.347-.139-.119-.251-.265-.33-.43l-.017-.043-.007-.017-.002-.006-.002-.004v-.002c-.04-.124-.03-.26.028-.376.059-.117.16-.207.284-.249.124-.042.26-.033.377.024.118.057.208.158.252.281l-.001-.004-.005-.014c.019.032.043.06.072.084.066.056.23.162.59.162.295 0 .463-.075.545-.136.078-.058.083-.105.083-.117 0-.061-.015-.08-.015-.081-.003-.004-.014-.022-.057-.046-.108-.062-.281-.102-.558-.157-.232-.045-.574-.105-.847-.25-.167-.085-.31-.211-.415-.367-.115-.178-.175-.387-.171-.599-.003-.18.036-.358.113-.52.077-.162.19-.305.332-.416.145-.114.311-.194.49-.244v-.32c0-.133.053-.26.146-.354.094-.093.221-.146.354-.146Z" fill="white" />
                    </svg>
                  </span>
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
                  Επιλογή ποσού
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
                            ? 'bg-[#8320bd]'
                            : 'bg-white hover:bg-[#8320bd] group'
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
        nonprofits={undefined}
      />
    </>
  );
}
