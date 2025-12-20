import React, { useState, useEffect } from 'react';
import { Heart, Dog, Users, TreePine, Stethoscope } from 'lucide-react';
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

interface SliderDonationWidgetProps {
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

// Slider steps - using preset amounts: 0.5, 1, 3
const sliderSteps = [0, 1, 2, 3, 4, 5];
const sliderLabels = [0, 1, 2, 3, 4, 5]; // Labels to show below

const minValue = sliderSteps[0];
const maxValue = sliderSteps[sliderSteps.length - 1];

export default function SliderDonationWidget({ onDonationChange }: SliderDonationWidgetProps) {
  const [selectedAmount, setSelectedAmount] = useState(1);
  const [selectedNonprofit, setSelectedNonprofit] = useState<Nonprofit | null>(null);

  // Find the closest step index for a given value
  const handleSliderChange = (value: number) => {
    setSelectedAmount(value);
    if (selectedNonprofit) {
      onDonationChange?.(value, selectedNonprofit);
    } else {
      onDonationChange?.(0, null);
    }
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
      setSelectedAmount(1);
      onDonationChange?.(1, nonprofit);
    }
  };

  useEffect(() => {
    if (selectedNonprofit) {
      onDonationChange?.(selectedAmount, selectedNonprofit);
    } else {
      onDonationChange?.(0, null);
    }
  }, [selectedNonprofit, selectedAmount]);

  const getPositionPercent = (value: number) => {
    return ((value - minValue) / (maxValue - minValue)) * 100;
  };

  const progressPercent = getPositionPercent(selectedAmount);

  return (
    <div className="bg-white rounded-[8px] border border-[#e0e0e0] p-[20px]">
      {/* Header */}
      <div className="flex items-center justify-between mb-[16px]">
        <h3 className="text-[#212121] text-[16px] font-medium">Θέλετε να κάνετε μια δωρεά;</h3>
        <button
          type="button"
          className="bg-[#212121] text-white box-border content-stretch flex gap-[4px] items-center justify-center p-[4px] relative rounded-[4px] shrink-0"
        >
          <p className="font-['Proxima_Nova:Semibold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">
            {formatAmount(selectedAmount)}€
          </p>
        </button>
      </div>

      {/* Organization Dropdown - matching Version 1 */}
      <div className="flex items-center gap-[16px] mb-[32px]">
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

      {/* Slider - styled to match the design exactly */}
      {selectedNonprofit && (
        <div className="relative py-[16px]">
          <div className="rounded-[20px] border border-[#e4e7ec] bg-white px-[18px] py-[22px] shadow-sm">
            <div className="relative h-[10px] w-full" style={{ zIndex: 1 }}>
              {/* Background track - light gray for inactive portion */}
              <div className="absolute left-0 top-0 h-full w-full rounded-full bg-[#e4e4e4]" style={{ zIndex: 1 }} />
              
              {/* Active blue segments */}
              {selectedAmount > 0 && (
                <>
                  {/* Light blue fading segment from position 0 to position 1 */}
                  <div
                    className="absolute left-0 top-0 h-full rounded-full transition-all"
                    style={{
                      width: `${getPositionPercent(1)}%`,
                      background: 'linear-gradient(90deg, #9dd9ff 0%, rgba(157, 217, 255, 0.4) 100%)',
                      zIndex: 2,
                    }}
                  />
                  
                  {/* Solid vibrant blue segment from position 1 to handle */}
                  {selectedAmount >= 1 && progressPercent > getPositionPercent(1) && (
                    <div
                      className="absolute left-0 top-0 h-full rounded-full transition-all"
                      style={{
                        left: `${getPositionPercent(1)}%`,
                        width: `${Math.max(0, progressPercent - getPositionPercent(1))}%`,
                        background: '#1a73e8',
                        zIndex: 2,
                      }}
                    />
                  )}
                </>
              )}

              {/* Step markers - always visible, different shapes for different positions */}
              {sliderSteps.map((step, index) => {
                const position = getPositionPercent(step);
                const isLast = index === sliderSteps.length - 1;
                const isFirst = index === 0;
                const isSecond = index === 1;
                const isActive = selectedAmount >= step;
                
                // Circular markers at positions 0 and 1 - blue when active
                if (isFirst || isSecond) {
                  return (
                    <div
                      key={`marker-${step}`}
                      className={`absolute top-1/2 -translate-y-1/2 rounded-full transition-colors ${
                        isActive ? 'bg-[#1a73e8]' : 'bg-[#c7c7c7]'
                      }`}
                      style={{
                        left: `${position}%`,
                        transform: 'translate(-50%, -50%)',
                        width: '8px',
                        height: '8px',
                        zIndex: 3,
                      }}
                    />
                  );
                }
                
                // Rounded rectangular markers for positions 2+ - gray (only blue if active, but typically gray)
                return (
                  <div
                    key={`marker-${step}`}
                    className={`absolute top-1/2 -translate-y-1/2 rounded-[2px] transition-colors ${
                      isActive ? 'bg-[#1a73e8]' : 'bg-[#c7c7c7]'
                    }`}
                    style={{
                      left: `${position}%`,
                      transform: 'translate(-50%, -50%)',
                      width: isLast ? '12px' : '6px',
                      height: isLast ? '8px' : '6px',
                      zIndex: 3,
                    }}
                  />
                );
              })}

              {/* Handle - white circle with blue outline */}
              <div
                className="absolute top-1/2 -translate-y-1/2 rounded-full border-2 border-[#1a73e8] bg-white transition-transform"
                style={{
                  left: `${progressPercent}%`,
                  transform: 'translate(-50%, -50%)',
                  width: '24px',
                  height: '24px',
                  zIndex: 4,
                }}
              />
              
              {/* Range input for interaction - completely hidden */}
              <input
                type="range"
                min={minValue}
                max={maxValue}
                step={1}
                value={selectedAmount}
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: '100%',
                  height: '30px',
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
          <div className="mt-[16px] flex justify-between text-[12px] font-semibold">
            {sliderLabels.map((label) => {
              const isSelected = selectedAmount === label;
              return (
                <span
                  key={`label-${label}`}
                  className={isSelected ? 'text-[#1a73e8]' : 'text-[#8e8e93]'}
                >
                  {formatAmount(label)}€
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
