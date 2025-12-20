import React, { useState } from 'react';
import { Loader2, Heart, Dog, Users, TreePine, Stethoscope } from 'lucide-react';
import type { Nonprofit } from './NonprofitSelector';
import { ImageWithFallback } from './figma/ImageWithFallback';

const getIcon = (iconType: string) => {
  switch (iconType) {
    case 'dog':
      return Dog;
    case 'heart':
      return Heart;
    case 'users':
      return Users;
    case 'tree':
      return TreePine;
    case 'stethoscope':
      return Stethoscope;
    default:
      return Heart;
  }
};

const euroFormatter = new Intl.NumberFormat('el-GR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatAmount = (value: number) => euroFormatter.format(value);

interface DropdownDonationWidgetProps {
  onDonationChange?: (amount: number, nonprofit: Nonprofit | null) => void;
}

// Nonprofits list - matching the one from NonprofitSelector
const nonprofits: Nonprofit[] = [
  {
    id: 'proskopoi',
    name: 'Σώμα Ελλήνων Προσκόπων',
    description: 'Οργάνωση προσκόπων που προωθεί την εκπαίδευση, την κοινωνική ευθύνη και την προστασία του περιβάλλοντος.',
    category: 'humans',
    icon: 'users',
    logo: 'https://youbehero.com/images/cause/85/l/proskopoi-logo.png'
  },
  {
    id: 'edny',
    name: 'Εθελοντική Δασοπροστασία Νοτίου Υμηττού (Ε.Δ.Ν.Υ.)',
    description: 'Οργάνωση που ασχολείται με την προστασία και διατήρηση των δασικών οικοσυστημάτων.',
    category: 'environment',
    icon: 'tree',
    logo: 'https://youbehero.com/images/cause/206/l/edny_logo.png'
  },
  {
    id: 'zwes',
    name: 'Ζω.Ε.Σ. (Ζωοφιλικές Ενημερώσεις Σχολείων, Ιδρυμάτων και Οργανισμών)',
    description: 'Δραστηριοποιείται στον τομέα της προστασίας ζώων και της εκπαίδευσης για την ευζωία τους.',
    category: 'animals',
    icon: 'dog',
    logo: 'https://youbehero.com/images/cause/113/l/zwes-logo.jpg'
  },
  {
    id: 'tripolis',
    name: 'Πολιτιστικός Φιλοζωικός Σύλλογος Τρίπολης',
    description: 'Σύλλογος που συνδυάζει πολιτιστικές δραστηριότητες με την προστασία και φροντίδα ζώων.',
    category: 'animals',
    icon: 'dog',
    logo: 'https://youbehero.com/images/cause/98/l/politistikos-filozoikos-sillogos-tripolis-logo.png'
  },
  {
    id: 'espi',
    name: 'Ελληνικός Σύλλογος Προστασίας Ιπποειδών',
    description: 'Οργάνωση αφοσιωμένη στην προστασία και ευζωία των ιπποειδών (άλογα, γαϊδούρια, μουλάρια).',
    category: 'animals',
    icon: 'dog',
    logo: 'https://youbehero.com/images/cause/183/l/espi_logo.jpg'
  },
  {
    id: 'agkalia',
    name: 'ΑμKE Ψυχοκοινωνικών Παρεμβάσεων «Αγκαλιά»',
    description: 'Οργάνωση που παρέχει ψυχοκοινωνική υποστήριξη και παρεμβάσεις σε ευάλωτες ομάδες πληθυσμού.',
    category: 'humans',
    icon: 'heart',
    logo: 'https://youbehero.com/images/cause/312/l/amke_agkalia_logo.png'
  },
  {
    id: 'sege',
    name: 'ΣΥΝΔΕΣΜΟΣ ΕΠΙΧΕΙΡΗΜΑΤΙΩΝ ΓΥΝΑΙΚΩΝ ΕΛΛΑΔΟΣ - Σ.Ε.Γ.Ε.',
    description: 'Σύνδεσμος που υποστηρίζει και προωθεί την επιχειρηματικότητα των γυναικών στην Ελλάδα.',
    category: 'humans',
    icon: 'users',
    logo: 'https://youbehero.com/images/cause/212/l/sege_logo.jpeg'
  }
];

export default function DropdownDonationWidget({ onDonationChange }: DropdownDonationWidgetProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [loadingAmount, setLoadingAmount] = useState<number | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [selectedNonprofit, setSelectedNonprofit] = useState<Nonprofit | null>(null);

  const presetAmounts = [0.5, 1, 3];

  const handleAmountClick = (amount: number) => {
    // Don't show spinner if this amount is already selected
    if (selectedAmount === amount) {
      return;
    }
    
    setLoadingAmount(amount);
    
    setTimeout(() => {
      setSelectedAmount(amount);
      if (selectedNonprofit) {
        onDonationChange?.(amount, selectedNonprofit);
      } else {
        onDonationChange?.(0, null);
      }
      setLoadingAmount(null);
    }, 800);
  };

  const handleClearAll = () => {
    setIsClearing(true);
    
    setTimeout(() => {
      setSelectedAmount(null);
      setSelectedNonprofit(null);
      onDonationChange?.(0, null);
      setIsClearing(false);
    }, 800);
  };

  const handleNonprofitSelect = (nonprofitId: string) => {
    if (nonprofitId === '') {
      setSelectedNonprofit(null);
      onDonationChange?.(0, null);
      return;
    }
    const nonprofit = nonprofits.find(n => n.id === nonprofitId);
    if (nonprofit) {
      setSelectedNonprofit(nonprofit);
      if (selectedAmount) {
        onDonationChange?.(selectedAmount, nonprofit);
      } else {
        onDonationChange?.(0, nonprofit);
      }
    }
  };

  const getTotalAmount = () => {
    if (selectedAmount) return formatAmount(selectedAmount);
    return formatAmount(0);
  };

  const handleDropdownWheel = (event: React.WheelEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    const scrollTop = target.scrollTop;
    const maxScroll = target.scrollHeight - target.clientHeight;
    const atTop = event.deltaY < 0 && scrollTop <= 0;
    const atBottom = event.deltaY > 0 && scrollTop >= maxScroll;

    if (target === event.target && (atTop || atBottom)) {
      event.preventDefault();
      const container = document.scrollingElement || document.documentElement;
      container.scrollBy({ top: event.deltaY, behavior: 'auto' });
    }
  };

  return (
    <div className="bg-white rounded-[8px] border border-[#e0e0e0] p-[20px] mb-[20px]">
      {/* Header with question and amount button */}
        <div className="flex items-center justify-between mb-[16px]">
          <h3 className="text-[#212121] text-[16px] font-medium">Θέλετε να κάνετε μια δωρεά;</h3>
          <button
            type="button"
            className="bg-[#212121] text-white box-border content-stretch flex gap-[4px] items-center justify-center p-[4px] relative rounded-[4px] shrink-0"
          >
            <p className="font-['Proxima_Nova:Semibold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">
              {getTotalAmount()}€
            </p>
          </button>
        </div>

      {/* Organization Dropdown */}
      <div className="flex items-center gap-[16px] mb-[16px]">
        {selectedNonprofit && (() => {
          const Icon = getIcon(selectedNonprofit.icon);
          const getIconBg = (category: string) => {
            switch (category) {
              case 'animals':
                return 'bg-[#fee5e5]';
              case 'humans':
                return 'bg-[#e3f2fd]';
              case 'environment':
                return 'bg-[#e8f5e9]';
              default:
                return 'bg-[#fee5e5]';
            }
          };
          return (
            <div className={`w-[32px] h-[32px] rounded-full ${getIconBg(selectedNonprofit.category)} flex items-center justify-center shrink-0 flex-shrink-0 overflow-hidden`}>
              {selectedNonprofit.logo ? (
                <ImageWithFallback
                  src={selectedNonprofit.logo}
                  alt={selectedNonprofit.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Icon size={18} className="text-[#0957e8]" />
              )}
            </div>
          );
        })()}
          <select
            value={selectedNonprofit?.id || ''}
            onChange={(event) => handleNonprofitSelect(event.target.value)}
            className="w-full border border-[#e0e0e0] rounded-[8px] bg-white px-[16px] py-0 text-[14px] text-[#212121] shadow-sm focus:outline-none focus:border-[#0957e8] appearance-none"
            style={{ height: '45px' }}
          >
          {!selectedNonprofit && <option value="">Επιλογή φορέα</option>}
          {nonprofits.map((nonprofit) => (
            <option key={nonprofit.id} value={nonprofit.id}>
              {nonprofit.name}
            </option>
          ))}
        </select>
      </div>

      {/* Amount Selection */}
      {selectedNonprofit && (
        <div className="relative shrink-0 w-full">
          <div className="size-full">
            <div className="box-border content-stretch flex flex-col gap-[12px] items-start relative w-full py-[8px] mt-[0px] mr-[0px] mb-[8px] ml-[0px]">
              <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                {/* Preset amounts */}
                {presetAmounts.map((amount) => {
                const isLoading = loadingAmount === amount;
                const isSelected = selectedAmount === amount;
                
                return (
                  <button
                    key={amount}
                    type="button"
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
                type="button"
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
      )}
    </div>
  );
}

