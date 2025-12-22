import React, { useState } from 'react';
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
const sliderSteps = [0, 1, 2, 4];
const sliderLabels = [0, 1, 2, 4];

const minValue = sliderSteps[0];
const maxValue = sliderSteps[sliderSteps.length - 1];

export default function CombinedSliderDonationWidget({ onDonationChange }: CombinedSliderDonationWidgetProps) {
  const [selectedAmount, setSelectedAmount] = useState(0);
  const [selectedNonprofit, setSelectedNonprofit] = useState<Nonprofit | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [shouldAnimateDropdown, setShouldAnimateDropdown] = useState(false);

  const handleSliderChange = (value: number) => {
    // Ensure value is always a valid step value
    const validValue = sliderSteps.includes(value) ? value : sliderSteps[0];
    setSelectedAmount(validValue);
    // If user selects an amount without a nonprofit, trigger animation
    if (validValue > 0 && !selectedNonprofit) {
      setShouldAnimateDropdown(true);
      setTimeout(() => {
        setShouldAnimateDropdown(false);
      }, 1400);
    }
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

  const getTotalAmount = () => {
    if (selectedAmount > 0) return formatAmount(selectedAmount);
    return formatAmount(0);
  };

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

  const progressPercent = getPositionPercent(validSelectedAmount);

  return (
    <div className="donation-widget-bg rounded-[8px] border border-[#e0e0e0] p-[20px]">
      {/* Header with question and amount button */}
      <div className="flex items-center mb-[16px]">
        <h3 className="text-[#212121] text-[16px] mr-2" style={{ fontWeight: 'bold' }}>Θα θέλατε να κάνετε μια δωρεά;</h3>
          <button
            type="button"
            className="donation-widget-badge text-white box-border content-stretch flex gap-[4px] items-center justify-center p-[4px] relative rounded-[4px] shrink-0"
            style={{ marginLeft: '8px' }}
          >
          <p className="font-['Proxima_Nova:Semibold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre" style={{ marginLeft: '12px' }}>
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

      {/* Slider - Enhanced fancy version */}
      <div className="relative py-[24px]">
          <div className="rounded-[20px] px-[16px] py-[32px] shadow-sm h-fit w-full">
            <div className="relative w-full" style={{ height: '60px', zIndex: 1, display: 'flex', alignItems: 'center' }}>
              {/* Full-width gradient - always in place */}
              <div 
                className="absolute left-0 w-full rounded-full"
                style={{
                  height: '28px',
                  top: '30px',
                  transform: 'translateY(-50%)',
                  background: 'linear-gradient(to right, hsl(3,90%,55%) 0%, hsl(63,90%,55%) 50%, hsl(123,90%,55%) 100%)',
                  zIndex: 1,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                }}
              />
              {/* Dark gray overlay - masks the unprogressed portion */}
              <div 
                className="absolute rounded-full"
                style={{
                  height: '28px',
                  top: '30px',
                  transform: 'translateY(-50%)',
                  left: `${progressPercent}%`,
                  width: `${100 - progressPercent}%`,
                  background: '#4a4a4a',
                  zIndex: 2,
                  transition: 'left 0.2s ease, width 0.2s ease',
                }}
              />

              {/* Step markers - always visible */}
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
                    }}
                  />
                );
              })}

              {/* Handle - large with value inside and colored border */}
              {(() => {
                // Determine handle color based on value
                let handleBorderColor = '#4bc67d'; // green for low (0-1)
                if (validSelectedAmount === 2) {
                  handleBorderColor = '#f1c40f'; // yellow for medium (2)
                } else if (validSelectedAmount === 4) {
                  handleBorderColor = '#b94a48'; // red for high (4)
                }
                
                return (
                  <div
                    className="absolute rounded-full bg-white transition-all flex items-center justify-center font-bold text-[14px] shadow-lg cursor-pointer"
                    style={{
                      left: `${progressPercent}%`,
                      top: '50%',
                      transform: 'translate(-50%, -50%)',
                      width: '40px',
                      height: '40px',
                      border: `6px solid ${handleBorderColor}`,
                      zIndex: 4,
                      color: '#404040',
                    }}
                  >
                    {validSelectedAmount}
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
                onChange={(e) => {
                  const index = Number(e.target.value);
                  const stepValue = getStepValueFromIndex(index);
                  handleSliderChange(stepValue);
                }}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '100%',
                  height: '50px',
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
          <div className="mt-[24px] flex justify-between text-[13px]" style={{ fontWeight: 'bold' }}>
            {sliderLabels.map((label) => {
              const isSelected = validSelectedAmount === label;
              // Color labels based on position
              let labelColor = '#212121';
              if (isSelected) {
                if (label <= 1) labelColor = '#4bc67d';
                else if (label === 2) labelColor = '#f1c40f';
                else if (label === 4) labelColor = '#b94a48';
              }
              return (
                <span
                  key={`label-${label}`}
                  onClick={() => handleSliderChange(label)}
                  style={{ color: labelColor }}
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

