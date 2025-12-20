import React, { useState } from 'react';
import { Loader2, Heart, Dog, Users, TreePine, Stethoscope, ChevronDown } from 'lucide-react';
import NonprofitSelector, { type Nonprofit } from './NonprofitSelector';
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

interface CombinedDonationWidgetProps {
  onDonationChange?: (amount: number, nonprofit: Nonprofit | null) => void;
}

// Nonprofits list - matching the one from NonprofitSelector
const nonprofits: Nonprofit[] = [
  {
    id: 'arsis',
    name: 'ΑΡΣΙΣ',
    description: 'Παρέχει κοινωνική υποστήριξη και προστασία σε ευάλωτες ομάδες πληθυσμού.',
    category: 'humans',
    icon: 'heart',
    logo: 'https://youbehero.com/images/cause/265/l/arsis_logo.png'
  },
  {
    id: 'selianitika-ilios',
    name: 'Πολιτιστικός Σύλλογος Σελιανιτίκων Ήλιος',
    description: 'Προωθεί τον πολιτισμό, τις παραδόσεις και την ανάπτυξη της τοπικής κοινότητας.',
    category: 'humans',
    icon: 'users',
    logo: 'https://youbehero.com/images/cause/389/l/politistikos-sillogos-selianitikon-logo.jpg'
  },
  {
    id: 'kids-fair-collection',
    name: 'Kids Fair Collection',
    description: 'Ο κόσμος γίνεται πιο φωτεινός, όταν τα παιδιά δημιουργούν και προσφέρουν – με αγάπη, με χρώμα, με σκοπό.',
    category: 'humans',
    icon: 'users',
    logo: 'https://youbehero.com/images/cause/394/l/kids-fair-collection-logo.png'
  },
  {
    id: 'anagennisi',
    name: 'Σύλλογος Γονέων και Φίλων Αυτιστικών Ατόμων Αναγέννηση',
    description: 'Υποστηρίζει άτομα με αυτισμό και τις οικογένειές τους, προσφέροντας εκπαίδευση, υποστήριξη και προστασία.',
    category: 'humans',
    icon: 'heart',
    logo: 'https://youbehero.com/images/cause/176/l/anagennisi_logo_tn.png'
  },
  {
    id: 'espi',
    name: 'Ελληνικός Σύλλογος Προστασίας Ιπποειδών',
    description: 'Αφοσιωμένη στην προστασία και ευζωία των ιπποειδών (άλογα, γαϊδούρια, μουλάρια).',
    category: 'animals',
    icon: 'dog',
    logo: 'https://youbehero.com/images/cause/183/l/espi_logo.jpg'
  },
  {
    id: 'moiazw',
    name: 'ΜΟΙΑΖΩ',
    description: 'Υποστηρίζει άτομα με αυτισμό και τις οικογένειές τους, προωθώντας την ένταξη και την ποιότητα ζωής.',
    category: 'humans',
    icon: 'heart',
    logo: 'https://youbehero.com/images/cause/221/l/moiazw_logo.png'
  },
  {
    id: 'ariel',
    name: '«Ariel» Φιλοζωϊκό-Πολιτιστικό Σωματείο',
    description: 'Συνδυάζει την προστασία και φροντίδα ζώων με πολιτιστικές δραστηριότητες.',
    category: 'animals',
    icon: 'dog',
    logo: 'https://youbehero.com/images/cause/197/l/logoariel.jpeg'
  }
];

export default function CombinedDonationWidget({ onDonationChange }: CombinedDonationWidgetProps) {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [loadingAmount, setLoadingAmount] = useState<number | null>(null);
  const [isClearing, setIsClearing] = useState(false);
  const [selectedNonprofit, setSelectedNonprofit] = useState<Nonprofit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldAnimateDropdown, setShouldAnimateDropdown] = useState(false);

  const presetAmounts = [0.5, 1, 3];

  const handleAmountClick = (amount: number) => {
    // Prevent selection if no nonprofit is selected
    if (!selectedNonprofit) {
      // Trigger animation if no nonprofit is selected
      setShouldAnimateDropdown(true);
      // Clear animation after it completes (1.4s for fade animation)
      setTimeout(() => {
        setShouldAnimateDropdown(false);
      }, 1400);
      return;
    }
    
    // Don't show spinner if this amount is already selected
    if (selectedAmount === amount) {
      return;
    }
    
    setLoadingAmount(amount);
    
    setTimeout(() => {
      setSelectedAmount(amount);
      onDonationChange?.(amount, selectedNonprofit);
      setShouldAnimateDropdown(false);
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

  const handleNonprofitSelect = (nonprofit: Nonprofit) => {
    setSelectedNonprofit(nonprofit);
    setShouldAnimateDropdown(false);
    if (selectedAmount) {
      onDonationChange?.(selectedAmount, nonprofit);
    } else {
      onDonationChange?.(0, nonprofit);
    }
  };

  const getTotalAmount = () => {
    if (selectedAmount) return formatAmount(selectedAmount);
    return formatAmount(0);
  };

  return (
    <div className="donation-widget-bg rounded-[8px] border border-[#e0e0e0] p-[20px]">
      {/* Header with question and amount button */}
      <div className="flex items-center mb-[16px]">
        <h3 className="text-[#212121] text-[16px]" style={{ fontWeight: 'bold', marginRight: '8px' }}>Θα θέλατε να κάνετε μια δωρεά;</h3>
          <button
            type="button"
            className="donation-widget-badge text-white box-border content-stretch flex gap-[4px] items-center justify-center p-[4px] relative rounded-[4px] shrink-0"
          >
          <p className="font-['Proxima_Nova:Semibold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[14px] text-nowrap text-white whitespace-pre">
            {getTotalAmount()}€
          </p>
        </button>
      </div>

      {/* Organization Dropdown - styled like dropdown but opens modal */}
      <div className="flex items-center gap-[16px] mb-[16px]">
        <button
          type="button"
          onClick={() => {
            setIsModalOpen(true);
            setShouldAnimateDropdown(false);
          }}
          className={`w-full border border-[#e0e0e0] rounded-[8px] bg-white px-[16px] text-[14px] text-[#212121] shadow-sm focus:outline-none focus:border-[#0957e8] appearance-none flex items-center justify-between cursor-pointer hover:border-[#0957e8] transition-colors gap-[12px] ${
            shouldAnimateDropdown ? 'animate-rainbow-glow' : ''
          }`}
          style={{ padding: '12px' }}
        >
          <div className="flex items-center gap-[12px] flex-1 min-w-0">
            {selectedNonprofit ? (() => {
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
                <div className={`w-[32px] h-[32px] rounded-full ${getIconBg(selectedNonprofit.category)} flex items-center justify-center shrink-0 overflow-hidden`}>
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
            })() : (
              <div className="w-[32px] h-[32px] flex items-center justify-center shrink-0">
                <svg width="24" height="25" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="0.498535" y="0.606262" width="15" height="15" rx="1.5" fill="#212121"/>
                  <rect x="0.498535" y="0.606262" width="15" height="15" rx="1.5" stroke="#212121"/>
                  <path d="M11.9983 4.10626H9.70627V6.34446H11.9983V4.10626Z" fill="white"/>
                  <path d="M6.29055 4.10626H3.99854V6.34446H6.29055V4.10626Z" fill="white"/>
                  <path d="M9.70652 7.45257V7.76282C9.70652 9.13677 8.97925 9.9567 7.98752 9.9567C6.86355 9.9567 6.29055 8.95948 6.29055 7.76282V7.45257H3.99854V7.91795C3.99854 10.6215 5.60736 12.1063 7.98752 12.1063C10.566 12.1063 11.9985 10.4442 11.9985 7.91795V7.45257H9.70652Z" fill="white"/>
                </svg>
              </div>
            )}
            <span className="text-left truncate" style={{ fontSize: '16px', fontWeight: 'bold' }}>
              {selectedNonprofit ? selectedNonprofit.name : 'Επιλογή δράσης / φορέα'}
            </span>
          </div>
          <ChevronDown size={20} className="text-[#757575] shrink-0" />
        </button>
      </div>

      {/* Amount Selection - from version 2 (buttons + trash can) */}
      <div className="relative shrink-0 w-full">
        <div className="size-full">
          <div className="box-border content-stretch flex flex-col gap-[12px] items-start relative w-full py-[8px] mt-[0px] mr-[0px] mb-[8px] ml-[0px]">
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full">
                {/* Preset amounts */}
                {presetAmounts.map((amount) => {
                  const isLoading = loadingAmount === amount;
                  const isSelected = selectedAmount === amount && selectedNonprofit !== null;
                  
                  return (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => handleAmountClick(amount)}
                      disabled={isLoading || loadingAmount !== null}
                      className={`basis-0 grow min-h-px min-w-px relative rounded-[8px] shrink-0 transition-all ${
                        isSelected || isLoading
                          ? 'donation-widget-button-selected'
                          : 'donation-widget-button-default'
                      } ${loadingAmount !== null && !isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${!selectedNonprofit ? 'opacity-60' : ''}`}
                    >
                      <div
                        aria-hidden="true"
                        className={`absolute border border-solid inset-0 pointer-events-none rounded-[8px] ${
                          isSelected || isLoading ? 'border-[#8320bd]' : 'border-[#bdbdbd] group-hover:border-[#8320bd]'
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
                  style={{ width: '100px' }}
                  className={`donation-widget-button-default trash-button box-border content-stretch flex flex-col gap-[16px] items-center justify-end px-[5px] py-[14px] relative rounded-[8px] shrink-0 transition-colors ${
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

      <NonprofitSelector
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={handleNonprofitSelect}
        selectedId={selectedNonprofit?.id}
      />
    </div>
  );
}

