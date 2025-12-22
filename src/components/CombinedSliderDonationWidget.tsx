import React, { useState, useEffect, useRef } from 'react';
import { Heart, Dog, Users, TreePine, Stethoscope, ChevronDown } from 'lucide-react';
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

interface CombinedSliderDonationWidgetProps {
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

// Slider steps - 0, 1,00, 2,00, 4,00 €
const sliderSteps: readonly number[] = [0, 1, 2, 4];

export default function CombinedSliderDonationWidget({ onDonationChange }: CombinedSliderDonationWidgetProps) {
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [selectedNonprofit, setSelectedNonprofit] = useState<Nonprofit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldAnimateDropdown, setShouldAnimateDropdown] = useState(false);
  const [visualPosition, setVisualPosition] = useState<number | null>(null);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSliderChange = (value: number, isVisualOnly = false) => {
    // Ensure value is always a valid step value
    const validValue = sliderSteps.includes(value) ? value : sliderSteps[0];
    
    // If no nonprofit is selected and trying to move forward
    if (!selectedNonprofit && validValue > 0) {
      // Trigger animation
      if (!shouldAnimateDropdown) {
        setShouldAnimateDropdown(true);
        setTimeout(() => {
          setShouldAnimateDropdown(false);
        }, 1400);
      }
      
      // Show visual movement temporarily
      setVisualPosition(validValue);
      
      // If not visual only (click on amount), snap back after brief delay
      if (!isVisualOnly) {
        setTimeout(() => {
          setVisualPosition(null);
          setSelectedAmount(0);
          onDonationChange?.(0, null);
        }, 300); // Brief visual feedback before snapping back
      }
      
      return;
    }
    
    // Normal update (org is selected or value is 0)
    setVisualPosition(null);
    setSelectedAmount(validValue);
    
    if (selectedNonprofit) {
      onDonationChange?.(validValue, selectedNonprofit);
    } else {
      onDonationChange?.(0, null);
    }
  };

  const handleNonprofitSelect = (nonprofit: Nonprofit) => {
    setSelectedNonprofit(nonprofit);
    setShouldAnimateDropdown(false);
    if (selectedAmount > 0) {
      onDonationChange?.(selectedAmount, nonprofit);
    } else {
      onDonationChange?.(0, nonprofit);
    }
  };

  // Reset amount to 0 when nonprofit is cleared
  useEffect(() => {
    if (!selectedNonprofit && selectedAmount > 0) {
      setSelectedAmount(0);
      onDonationChange?.(0, null);
    }
  }, [selectedNonprofit]);

  // Reset organization dropdown when donation is 0 for more than 3 seconds
  useEffect(() => {
    // Clear any existing timeout
    if (resetTimeoutRef.current) {
      clearTimeout(resetTimeoutRef.current);
      resetTimeoutRef.current = null;
    }

    // If amount is 0 and an org is selected, start the 3-second timer
    if (selectedAmount === 0 && selectedNonprofit) {
      resetTimeoutRef.current = setTimeout(() => {
        // Check current state - if still 0 and org still selected, reset
        setSelectedNonprofit((currentNonprofit) => {
          if (currentNonprofit) {
            onDonationChange?.(0, null);
            return null;
          }
          return currentNonprofit;
        });
        resetTimeoutRef.current = null;
      }, 3000);
    }

    // Cleanup timeout on unmount or when dependencies change
    return () => {
      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
        resetTimeoutRef.current = null;
      }
    };
  }, [selectedAmount, selectedNonprofit, onDonationChange]);

  const getTotalAmount = () => formatAmount(selectedAmount);

  // Convert range input value (0-3 index) to actual step value
  const getStepValueFromIndex = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(Math.round(index), sliderSteps.length - 1));
    return sliderSteps[clampedIndex];
  };
  
  // Convert actual step value to range input index (0-3)
  const getIndexFromStepValue = (value: number) => {
    const index = sliderSteps.indexOf(value);
    return index === -1 ? 0 : index;
  };

  // Ensure selectedAmount is always a valid step value
  const validSelectedAmount = sliderSteps.includes(selectedAmount) 
    ? selectedAmount 
    : sliderSteps[0];

  const getPositionPercent = (value: number) => {
    // Find the index of the value in sliderSteps
    const index = sliderSteps.indexOf(value);
    if (index === -1) return 0;
    // Calculate position based on index
    return (index / (sliderSteps.length - 1)) * 100;
  };

  // Use visual position for temporary movement, otherwise use actual selected amount
  const displayValue = visualPosition !== null ? visualPosition : validSelectedAmount;
  const progressPercent = getPositionPercent(displayValue);

  return (
    <div className="donation-widget-bg rounded-[8px] border border-[#e0e0e0] p-[20px]" style={{ backgroundColor: 'white' }}>
      {/* Header with question and amount button */}
      <div className="flex items-center mb-[16px]">
        <h3 className="text-[#212121] text-[16px] mr-2" style={{ fontWeight: 'bold' }}>Θα θέλατε να κάνετε μια δωρεά;</h3>
          <button
            type="button"
            className="donation-widget-badge text-white box-border content-stretch flex gap-[4px] items-center justify-center relative rounded-[4px] shrink-0"
            style={{ marginLeft: '8px', paddingLeft: '4px', paddingRight: '4px', paddingTop: '4px', paddingBottom: '4px', backgroundColor: '#212121' }}
          >
          <p className="font-['Proxima_Nova:Semibold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">
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
            {selectedNonprofit ? (
              (() => {
                const Icon = getIcon(selectedNonprofit.icon);
                const iconBgMap: Record<string, string> = {
                  animals: 'bg-[#fee5e5]',
                  humans: 'bg-[#e3f2fd]',
                  environment: 'bg-[#e8f5e9]',
                };
                const iconBg = iconBgMap[selectedNonprofit.category] ?? 'bg-[#fee5e5]';
                
                return (
                  <div className={`w-[32px] h-[32px] rounded-full ${iconBg} flex items-center justify-center shrink-0 overflow-hidden`}>
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
              })()
            ) : (
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
              {selectedNonprofit ? selectedNonprofit.name : 'Επιλογή φορέα'}
            </span>
          </div>
          <ChevronDown size={20} className="text-[#757575] shrink-0" />
        </button>
      </div>

      {/* Slider - Enhanced fancy version */}
      <div className="relative py-[24px]">
          <div className="rounded-[20px] px-[16px] py-[32px] shadow-sm h-fit w-full">
            <div className="relative w-full" style={{ height: '60px', zIndex: 1, display: 'flex', alignItems: 'center' }}>
              {/* Full-width gradient - always in place */}
              <div 
                className="absolute left-0 w-full rounded-full"
                style={{
                  height: '20px',
                  top: '30px',
                  transform: 'translateY(-50%)',
                  background: 'linear-gradient(to right, hsl(3,90%,55%) 0%, hsl(63,90%,55%) 50%, hsl(123,90%,55%) 100%)',
                  zIndex: 1,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              />
              {/* Light gray overlay - masks the unprogressed portion */}
              <div 
                className="absolute rounded-full"
                style={{
                  height: '20px',
                  top: '30px',
                  transform: 'translateY(-50%)',
                  left: `${progressPercent}%`,
                  width: `${100 - progressPercent}%`,
                  background: '#4a4a4a',
                  zIndex: 2,
                  transition: 'left 0.2s ease, width 0.2s ease',
                }}
              />

              {/* Step markers - hidden but functionality preserved via range input step */}
              {sliderSteps.map((step, index) => {
                const position = getPositionPercent(step);
                const isActive = validSelectedAmount >= step;
                
                return (
                  <div
                    key={`marker-${step}`}
                    className={`absolute top-1/2 -translate-y-1/2 rounded-full transition-colors ${
                      isActive ? 'bg-white' : 'bg-transparent'
                    }`}
                    style={{
                      left: `${position}%`,
                      transform: 'translate(-50%, -50%)',
                      width: '6px',
                      height: '6px',
                      border: isActive ? '2px solid #4bc67d' : '2px solid rgba(255, 255, 255, 0.5)',
                      zIndex: 3,
                      opacity: 0,
                      pointerEvents: 'none',
                    }}
                  />
                );
              })}

              {/* Handle - large with emoji inside and colored border */}
              {(() => {
                const emojiMap: Record<number, string> = { 0: '🙁', 1: '😊', 2: '😄', 4: '😍' };
                const getEmoji = (value: number) => emojiMap[value] ?? '🙁';
                
                const getHandleColor = (value: number) => {
                  if (value === 2) return '#f1c40f';
                  if (value === 4) return '#b94a48';
                  return '#4bc67d';
                };
                
                return (
                  <div
                    className="absolute rounded-full bg-white transition-all flex items-center justify-center font-bold shadow-lg cursor-pointer"
                    style={{
                      left: `${progressPercent}%`,
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '48px',
                      height: '48px',
                      border: `4px solid ${getHandleColor(displayValue)}`,
                      zIndex: 4,
                      color: '#404040',
                      fontSize: '28px',
                      lineHeight: '1',
                      userSelect: 'none',
                      WebkitUserSelect: 'none',
                      pointerEvents: 'none',
                    }}
                  >
                    {getEmoji(displayValue)}
                  </div>
                );
              })()}
              
              {/* Range input for interaction - completely hidden */}
              <input
                type="range"
                min={0}
                max={sliderSteps.length - 1}
                step={1}
                value={getIndexFromStepValue(validSelectedAmount)}
                onInput={(e) => {
                  // Visual movement during dragging
                  const index = Number((e.target as HTMLInputElement).value);
                  const stepValue = getStepValueFromIndex(index);
                  handleSliderChange(stepValue, true); // isVisualOnly = true
                }}
                onChange={(e) => {
                  const index = Number(e.target.value);
                  const stepValue = getStepValueFromIndex(index);
                  handleSliderChange(stepValue);
                }}
                onMouseUp={(e) => {
                  if (!selectedNonprofit) {
                    const input = e.target as HTMLInputElement;
                    input.value = '0';
                    setVisualPosition(null);
                    handleSliderChange(0);
                  }
                }}
                onTouchEnd={(e) => {
                  if (!selectedNonprofit) {
                    const input = e.target as HTMLInputElement;
                    input.value = '0';
                    setVisualPosition(null);
                    handleSliderChange(0);
                  }
                }}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '100%',
                  height: '60px',
                  cursor: 'pointer',
                  opacity: 0,
                  zIndex: 5,
                  margin: 0,
                  padding: 0,
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  background: 'transparent',
                }}
              />
            </div>
          </div>

          {/* Amount labels */}
          <div className="mt-[24px] flex justify-between" style={{ fontWeight: 'bold', fontSize: '14px' }}>
            {sliderSteps.map((label) => {
              const isSelected = validSelectedAmount === label;
              return (
                <span
                  key={`label-${label}`}
                  onClick={() => handleSliderChange(label)}
                  style={{ color: isSelected ? '#4bc67d' : '#212121' }}
                  className="transition-colors cursor-pointer hover:opacity-80"
                >
                  {label === 0 ? '0' : formatAmount(label)}€
                </span>
              );
            })}
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

