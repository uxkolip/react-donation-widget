import React, { useState, useEffect, useRef } from 'react';
import { Heart, Dog, Users, TreePine, Stethoscope, ChevronDown } from 'lucide-react';
import NonprofitSelector, { type Nonprofit } from './NonprofitSelector';
import { ImageWithFallback } from './figma/ImageWithFallback';
import confetti from 'canvas-confetti';

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
  const [floatingEmojis, setFloatingEmojis] = useState<{ value: number; position: number; key: number; index: number; animationId: number }[]>([]);
  const emojiKeyRef = useRef(0);
  const animationIdRef = useRef(0);
  const activeTimeoutsRef = useRef<Map<number, NodeJS.Timeout>>(new Map());
  const handleRef = useRef<HTMLDivElement>(null);
  const [isHandlePressed, setIsHandlePressed] = useState(false);

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

  // Cleanup all emoji animation timeouts on unmount
  useEffect(() => {
    return () => {
      activeTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      activeTimeoutsRef.current.clear();
    };
  }, []);

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

  const getAdjustedPositionPercent = (value: number) => {
    const index = sliderSteps.indexOf(value);
    if (index === -1) return 0;
    let position = getPositionPercent(value);
    
    // Move first and last dots away from edges (same as step markers)
    if (index === 0) {
      position += 4; // Move first 4% to the right
    } else if (index === sliderSteps.length - 1) {
      position -= 4; // Move last 4% to the left
    }
    
    return position;
  };

  const triggerFloatingEmojis = (value: number) => {
    if (selectedNonprofit && value > 0) {
      const basePosition = getAdjustedPositionPercent(value);
      const emojiCount = 12;
      const animationId = animationIdRef.current++;
      
      // Create new emojis with unique animation ID and randomized positions
      const newEmojis = Array.from({ length: emojiCount }, (_, i) => {
        // Randomize position within ±3% of handle position (not too far)
        const positionOffset = (Math.random() - 0.5) * 6; // -3% to +3%
        const position = Math.max(0, Math.min(100, basePosition + positionOffset));
        
        return {
          value,
          position,
          key: emojiKeyRef.current + i,
          index: i,
          animationId,
        };
      });
      emojiKeyRef.current += emojiCount;
      
      // Append new emojis to existing ones (allow multiple animations)
      setFloatingEmojis(prev => [...prev, ...newEmojis]);
      
      // Set timeout to remove only this animation's emojis
      const timeout = setTimeout(() => {
        setFloatingEmojis(prev => prev.filter(emoji => emoji.animationId !== animationId));
        activeTimeoutsRef.current.delete(animationId);
      }, 5000);
      
      // Store timeout reference for cleanup
      activeTimeoutsRef.current.set(animationId, timeout);

      // Trigger confetti if max donation (4) with a small delay (after handle stops and particles start)
      if (value === 4 && handleRef.current) {
        // First confetti pop
        setTimeout(() => {
          const handleRect = handleRef.current?.getBoundingClientRect();
          if (handleRect) {
            const handleX = handleRect.left + handleRect.width / 2;
            const handleY = handleRect.top + handleRect.height / 2;
            
            confetti({
              particleCount: 120 + Math.random() * 60, // Random between 120-180
              spread: 50 + Math.random() * 20, // Random between 50-70
              origin: {
                x: handleX / window.innerWidth,
                y: handleY / window.innerHeight,
              },
            });
          }
        }, 200); // Small delay after particles start (200ms)
        
        // Second confetti pop (closer to first)
        setTimeout(() => {
          const handleRect = handleRef.current?.getBoundingClientRect();
          if (handleRect) {
            const handleX = handleRect.left + handleRect.width / 2;
            const handleY = handleRect.top + handleRect.height / 2;
            
            confetti({
              particleCount: 120 + Math.random() * 60, // Random between 120-180
              spread: 50 + Math.random() * 20, // Random between 50-70
              origin: {
                x: handleX / window.innerWidth,
                y: handleY / window.innerHeight,
              },
            });
          }
        }, 350); // 150ms after first pop (closer together)
        
        // Third confetti pop (slightly delayed)
        setTimeout(() => {
          const handleRect = handleRef.current?.getBoundingClientRect();
          if (handleRect) {
            const handleX = handleRect.left + handleRect.width / 2;
            const handleY = handleRect.top + handleRect.height / 2;
            
            confetti({
              particleCount: 120 + Math.random() * 60, // Random between 120-180
              spread: 50 + Math.random() * 20, // Random between 50-70
              origin: {
                x: handleX / window.innerWidth,
                y: handleY / window.innerHeight,
              },
            });
          }
        }, 800); // 450ms after second pop (slightly delayed)
      }
    }
  };

  // Use visual position for temporary movement, otherwise use actual selected amount
  const displayValue = visualPosition !== null ? visualPosition : validSelectedAmount;
  const progressPercent = getPositionPercent(displayValue);
  const adjustedProgressPercent = getAdjustedPositionPercent(displayValue);

  return (
    <div className="donation-widget-bg rounded-[8px] border border-[#e0e0e0] p-[20px]" style={{ backgroundColor: 'white' }}>
      {/* Header with question and amount button */}
      <div className="flex items-center mb-[16px]">
        <h3 className="text-[#212121] text-[16px] font-bold">Θα θέλατε να κάνετε μια δωρεά;</h3>
        <button
          type="button"
          className="donation-widget-badge text-white box-border content-stretch flex items-center justify-center relative rounded-[4px] shrink-0 ml-[8px] p-[4px] bg-[#212121]"
        >
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
              <path
                fill="white"
                d="M8.125 1C7.35 1 6.599 1.267 6 1.758 5.4 1.268 4.65.999 3.875 1c-.895 0-1.754.356-2.386.989C.856 2.62.5 3.479.5 4.375c0 2.249 1.392 3.908 2.604 4.935.74.62 1.551 1.148 2.419 1.571l.048.022.015.007.004.003h.002L6 10l-.407.914.407.18.406-.18L6 10c.134.305.27.61.407.913l.002-.001.005-.002.014-.007.048-.023c.868-.422 1.68-.95 2.42-1.57C10.107 8.283 11.5 6.624 11.5 4.375c0-.895-.356-1.754-.989-2.386C9.88 1.356 9.021 1 8.125 1ZM6 3.25c.133 0 .26.053.354.146.093.094.146.221.146.354v.327c.284.087.54.247.744.464l.008.009.003.004.001.003c.078.102.114.23.1.357-.014.128-.077.245-.175.327-.099.083-.225.124-.353.115-.128-.009-.248-.067-.334-.162l.002.004-.017-.016c-.13-.12-.302-.186-.48-.185-.199 0-.315.052-.37.096-.043.034-.07.078-.07.157 0 .015.002.03.005.046l.002.004.008.009c.013.01.028.02.044.028.113.06.287.098.571.153.237.047.582.111.86.269.15.085.3.207.41.385.112.18.163.386.163.606 0 .621-.477 1.048-1.122 1.192v.308c0 .133-.053.26-.146.354-.094.093-.221.146-.354.146-.133 0-.26-.053-.354-.146-.093-.094-.146-.221-.146-.354v-.306c-.272-.052-.526-.17-.739-.347-.139-.119-.251-.265-.33-.43l-.017-.043-.007-.017-.002-.006-.002-.004v-.002c-.04-.124-.03-.26.028-.376.059-.117.16-.207.284-.249.124-.042.26-.033.377.024.118.057.208.158.252.281l-.001-.004-.005-.014c.019.032.043.06.072.084.066.056.23.162.59.162.295 0 .463-.075.545-.136.078-.058.083-.105.083-.117 0-.061-.015-.08-.015-.081-.003-.004-.014-.022-.057-.046-.108-.062-.281-.102-.558-.157-.232-.045-.574-.105-.847-.25-.167-.085-.31-.211-.415-.367-.115-.178-.175-.387-.171-.599-.003-.18.036-.358.113-.52.077-.162.19-.305.332-.416.145-.114.311-.194.49-.244v-.32c0-.133.053-.26.146-.354.094-.093.221-.146.354-.146Z"
              />
            </svg>
          </span>
          <p className="font-['Proxima_Nova:Semibold',sans-serif] leading-[normal] not-italic relative shrink-0 text-[12px] text-nowrap text-white whitespace-pre">
            {getTotalAmount()}€
          </p>
        </button>
      </div>

      {/* Organization Dropdown - styled like dropdown but opens modal */}
      <div className="flex items-center gap-[16px] mb-[8px]">
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
                
                return (
                  <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0 overflow-hidden">
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
      <div className="relative">
          <div className="h-fit w-full">
            <div className="relative w-full" style={{ height: '60px', zIndex: 1, display: 'flex', alignItems: 'center', touchAction: 'pan-x' }}>
              {/* Full-width gradient - always in place */}
              <div 
                className="absolute left-0 w-full rounded-full"
                style={{
                  height: '20px',
                  top: '30px',
                  transform: 'translateY(-50%)',
                  background: 'linear-gradient(270deg, rgb(230, 33, 23), rgb(230, 33, 23), rgb(230, 33, 23), rgb(230, 33, 23), rgb(214, 61, 101), rgb(214, 61, 101), rgb(230, 130, 49), rgb(230, 130, 49), rgb(247, 202, 80), rgb(247, 202, 80), rgb(29, 233, 182), rgb(0, 229, 255))',
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
                  background: 'rgb(236, 236, 236)',
                  zIndex: 2,
                  transition: 'left 0.2s ease, width 0.2s ease',
                }}
              />

              {/* Step markers - visible white dots on each step */}
              {sliderSteps.map((step) => {
                const position = getAdjustedPositionPercent(step);
                const isActive = validSelectedAmount >= step;
                
                return (
                  <div
                    key={`marker-${step}`}
                    className={`absolute rounded-full transition-colors ${
                      isActive ? 'bg-white' : 'bg-transparent'
                    }`}
                    style={{
                      left: `${position}%`,
                      // Vertically center markers on the track (same as track top)
                      top: '30px',
                      transform: 'translate(-50%, -50%)',
                      // Slightly larger, more prominent dots
                      width: '10px',
                      height: '10px',
                      border: '1px solid #212121',
                      zIndex: 3,
                      pointerEvents: 'none',
                    }}
                  />
                );
              })}

              {/* Handle - large with emoji inside and colored border */}
              {(() => {
                const emojiMap: Record<number, string> = { 0: '🙂', 1: '😊', 2: '😄', 4: '😍' };
                const getEmoji = (value: number) => emojiMap[value] ?? '🙂';
                
                const getHandleColor = (value: number) => {
                  if (value === 0) return '#212121';
                  if (value === 2) return '#f1c40f';
                  if (value === 4) return '#b94a48';
                  return '#4caf50';
                };
                
                return (
                  <div
                    ref={handleRef}
                    className="absolute rounded-full bg-white transition-all flex items-center justify-center font-bold shadow-lg cursor-pointer"
                    style={{
                      left: `${adjustedProgressPercent}%`,
                      top: '50%',
                      transform: `translate(-50%, -50%) scale(${isHandlePressed ? 1.2 : 1})`,
                      width: '48px',
                      height: '48px',
                      border: `4px solid ${getHandleColor(displayValue)}`,
                      zIndex: 10000,
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

              {/* Floating emoji animation */}
              {floatingEmojis.map((emoji) => {
                const emojiMap: Record<number, string> = { 0: '🙂', 1: '😊', 2: '😄', 4: '😍' };
                const emojiChar = emojiMap[emoji.value] ?? '🙂';
                return (
                  <div
                    key={emoji.key}
                    className={`emoji-float emoji-float-${emoji.index}`}
                    style={{
                      left: `${emoji.position}%`,
                    }}
                  >
                    <span className="emoji-float-inner">{emojiChar}</span>
                  </div>
                );
              })}

              
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
                onMouseDown={() => setIsHandlePressed(true)}
                onMouseUp={(e) => {
                  setIsHandlePressed(false);
                  if (!selectedNonprofit) {
                    const input = e.target as HTMLInputElement;
                    input.value = '0';
                    setVisualPosition(null);
                    handleSliderChange(0);
                  } else if (selectedAmount > 0) {
                    triggerFloatingEmojis(selectedAmount);
                  }
                }}
                onMouseLeave={() => setIsHandlePressed(false)}
                onTouchStart={() => setIsHandlePressed(true)}
                onTouchEnd={(e) => {
                  setIsHandlePressed(false);
                  if (!selectedNonprofit) {
                    const input = e.target as HTMLInputElement;
                    input.value = '0';
                    setVisualPosition(null);
                    handleSliderChange(0);
                  } else if (selectedAmount > 0) {
                    triggerFloatingEmojis(selectedAmount);
                  }
                }}
                onTouchCancel={() => setIsHandlePressed(false)}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: '100%',
                  // Make the invisible hit area taller so the handle is easy to grab
                  height: '100px',
                  cursor: 'pointer',
                  opacity: 0,
                  zIndex: 5,
                  margin: 0,
                  padding: 0,
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  background: 'transparent',
                  touchAction: 'pan-x', // Allow horizontal panning, prevent vertical scrolling
                  WebkitTapHighlightColor: 'transparent', // Remove iOS tap highlight
                }}
              />
            </div>
          </div>

          {/* Amount labels */}
          <div className="mt-[8px] relative px-[20px] h-[20px] font-semibold text-[14px]">
            {sliderSteps.map((label) => {
              const isSelected = validSelectedAmount === label;
              const position = getAdjustedPositionPercent(label);
              return (
                <span
                  key={`label-${label}`}
                  onClick={() => {
                    handleSliderChange(label);
                    if (selectedNonprofit && label > 0) {
                      triggerFloatingEmojis(label);
                    }
                  }}
                  style={{ 
                    color: isSelected && label > 0 ? '#4caf50' : '#212121',
                    position: 'absolute',
                    left: `${position}%`,
                    transform: 'translateX(-50%)',
                  }}
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

