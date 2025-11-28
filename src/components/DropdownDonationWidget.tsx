import React, { useState } from 'react';
import { Loader2, Heart, Dog, Users, TreePine, Stethoscope } from 'lucide-react';
import svgPaths from "../imports/svg-rlj4j84hj5";
import type { Nonprofit } from './NonprofitSelector';

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
  onDonationChange?: (amount: number, nonprofit: Nonprofit) => void;
}

// Nonprofits list - matching the one from NonprofitSelector
const nonprofits: Nonprofit[] = [
  {
    id: '1',
    name: 'Ζω.Ε.Σ. (Ζωοφιλικές Ενημερώσεις Σχολείων, Ιδρυμάτων και Οργανισμών)',
    description: 'Δραστηριοποιείται στον τομέα της προστασίας ζώων...',
    category: 'animals',
    icon: 'dog'
  },
  {
    id: '2',
    name: 'Αρκτούρος',
    description: 'Προστασία και περίθαλψη άγριων ζώων, με έμφαση σε αρκούδες και λύκους.',
    category: 'animals',
    icon: 'dog'
  },
  {
    id: '3',
    name: 'Το Χαμόγελο του Παιδιού',
    description: 'Υποστήριξη και προστασία παιδιών που βρίσκονται σε κίνδυνο.',
    category: 'humans',
    icon: 'heart'
  },
  {
    id: '4',
    name: 'Κιβωτός του Κόσμου',
    description: 'Δίνει την ευκαιρία σε αδέσποτα ζώα συντροφιάς...',
    category: 'humans',
    icon: 'users'
  },
  {
    id: '5',
    name: 'Γιατροί του Κόσμου',
    description: 'Παροχή ιατρικής περίθαλψης σε ευάλωτες ομάδες πληθυσμού.',
    category: 'humans',
    icon: 'stethoscope'
  },
  {
    id: '6',
    name: 'WWF Ελλάς',
    description: 'Είναι ιδιωτικό ζωολογικό καταφύγιο και φιλανθρωπική οργάνωση...',
    category: 'environment',
    icon: 'tree'
  },
  {
    id: 'save-your-hood',
    name: 'Save Your Hood',
    description: 'Εθελοντική πρωτοβουλία που φροντίζει γειτονιές και κοινόχρηστους χώρους μέσα από δράσεις καθαρισμού.',
    category: 'environment',
    icon: 'tree'
  },
  {
    id: '7',
    name: 'Προστασία Αδέσποτων Ζώων Η Αγάπη',
    description: 'Είναι ο μεγάλος δεσμευτής των αδέσποτων ζώων συντροφιάς...',
    category: 'animals',
    icon: 'dog'
  }
];

export default function DropdownDonationWidget({ onDonationChange }: DropdownDonationWidgetProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(1);
  const [loadingAmount, setLoadingAmount] = useState<number | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [selectedNonprofit, setSelectedNonprofit] = useState<Nonprofit>(nonprofits.find(n => n.id === 'save-your-hood') || nonprofits[0]);

  const presetAmounts = [0.5, 1, 3];

  const handleAmountClick = (amount: number) => {
    setLoadingAmount(amount);
    
    setTimeout(() => {
      setSelectedAmount(amount);
      onDonationChange?.(amount, selectedNonprofit);
      setLoadingAmount(null);
    }, 800);
  };

  const handleClearAll = () => {
    setIsClearing(true);
    
    setTimeout(() => {
      setSelectedAmount(null);
      onDonationChange?.(0, selectedNonprofit);
      setIsClearing(false);
    }, 800);
  };

  const handleNonprofitSelect = (nonprofitId: string) => {
    const nonprofit = nonprofits.find(n => n.id === nonprofitId) || nonprofits[0];
    setSelectedNonprofit(nonprofit);
    const currentAmount = selectedAmount || 0;
    if (currentAmount > 0) {
      onDonationChange?.(currentAmount, nonprofit);
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
    <div className="bg-white rounded-[8px] border border-[#e0e0e0] p-[20px]">
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
      <div className="flex items-center gap-[4px]">
        {(() => {
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
            <div className={`w-[32px] h-[32px] rounded-full ${getIconBg(selectedNonprofit.category)} flex items-center justify-center shrink-0 flex-shrink-0`}>
              <Icon size={18} className="text-[#e53935]" />
            </div>
          );
        })()}
          <select
            value={selectedNonprofit.id}
            onChange={(event) => handleNonprofitSelect(event.target.value)}
            className="w-full border border-[#e0e0e0] rounded-[8px] bg-white px-[16px] py-0 text-[14px] text-[#212121] shadow-sm focus:outline-none focus:border-[#0957e8] appearance-none"
            style={{ height: '45px' }}
          >
          {nonprofits.map((nonprofit) => (
            <option key={nonprofit.id} value={nonprofit.id}>
              {nonprofit.name}
            </option>
          ))}
        </select>
      </div>

      {/* Amount Selection */}
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
                              {amount}€
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
                    <div className="absolute inset-[-5.26%_-6.02%]">
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 19 21">
                        <g id="Frame 4389">
                          <path d={svgPaths.p28692500} id="Vector" stroke="var(--stroke-0, #212121)" />
                        </g>
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

