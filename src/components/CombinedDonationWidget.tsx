import React, { useState, useRef, useEffect } from 'react';
import { Loader2, Heart, Dog, Users, TreePine, Stethoscope, ChevronDown } from 'lucide-react';
import { type Nonprofit } from './NonprofitSelector';
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
  const [selectedNonprofit, setSelectedNonprofit] = useState<Nonprofit | null>(nonprofits[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [floatingHearts, setFloatingHearts] = useState<{ amount: number; position: { x: number; y: number }; key: number; index: number; animationId: number; size: number; rotation: number; color: string }[]>([]);
  const heartKeyRef = useRef(0);
  const animationIdRef = useRef(0);
  const activeTimeoutsRef = useRef<Map<number, NodeJS.Timeout>>(new Map());
  const lastHeartTimeRef = useRef<Map<number, number>>(new Map()); // Track last trigger time per amount
  const EMOJI_DEBOUNCE_MS = 1500; // 1.5 seconds debounce to prevent overload
  const amountButtonRefs = useRef<Map<number, HTMLButtonElement>>(new Map());

  const presetAmounts = [1, 2, 4];

  // Notify parent of initial state with first nonprofit preselected
  useEffect(() => {
    if (selectedNonprofit) {
      onDonationChange?.(0, selectedNonprofit);
    }
  }, []); // Only run on mount

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Cleanup all heart animation timeouts on unmount
  useEffect(() => {
    return () => {
      activeTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      activeTimeoutsRef.current.clear();
    };
  }, []);

  const triggerFloatingHearts = (amount: number) => {
    if (selectedNonprofit && amount > 0) {
      const now = Date.now();
      const lastTimeForThisAmount = lastHeartTimeRef.current.get(amount) || 0;
      const timeSinceLastHeart = now - lastTimeForThisAmount;
      
      // Debounce: only prevent the same amount from being triggered rapidly
      if (timeSinceLastHeart >= EMOJI_DEBOUNCE_MS) {
        lastHeartTimeRef.current.set(amount, now);
        
        const buttonRef = amountButtonRefs.current.get(amount);
        if (!buttonRef) return;
        
        const buttonRect = buttonRef.getBoundingClientRect();
        const buttonWrapper = buttonRef.parentElement;
        if (!buttonWrapper) return;
        
        const wrapperRect = buttonWrapper.getBoundingClientRect();
        
        // Get button's background color
        const computedStyle = window.getComputedStyle(buttonRef);
        const buttonColor = computedStyle.backgroundColor || '#8320bd';
        
        // Parse RGB color to get individual values
        const rgbMatch = buttonColor.match(/\d+/g);
        let baseR = 131, baseG = 32, baseB = 189; // Default purple (#8320bd)
        if (rgbMatch && rgbMatch.length >= 3) {
          baseR = parseInt(rgbMatch[0]);
          baseG = parseInt(rgbMatch[1]);
          baseB = parseInt(rgbMatch[2]);
        }
        
        // Calculate position relative to button wrapper (which contains the button)
        const baseX = buttonRect.left + buttonRect.width / 2 - wrapperRect.left;
        const baseY = buttonRect.top + buttonRect.height / 2 - wrapperRect.top;
        
        const heartCount = 6;
        const animationId = animationIdRef.current++;
        
        // Create new hearts with unique animation ID and randomized properties
        const newHearts = Array.from({ length: heartCount }, (_, i) => {
          // Randomize position horizontally within ±10px of button center
          const positionOffsetX = (Math.random() - 0.5) * 20; // -10px to +10px
          // Position hearts only from the top of the button (negative Y offset)
          const positionOffsetY = -buttonRect.height / 2 - Math.random() * 10; // Start from top, random 0-10px above
          
          // Random size between 12px and 24px
          const size = 12 + Math.random() * 12;
          
          // Random rotation between -45deg and 45deg
          const rotation = (Math.random() - 0.5) * 90;
          
          // Add slight color variation (±25 for each RGB channel)
          const colorVariation = 25;
          const r = Math.max(0, Math.min(255, baseR + (Math.random() - 0.5) * colorVariation * 2));
          const g = Math.max(0, Math.min(255, baseG + (Math.random() - 0.5) * colorVariation * 2));
          const b = Math.max(0, Math.min(255, baseB + (Math.random() - 0.5) * colorVariation * 2));
          const heartColor = `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
          
          return {
            amount,
            position: {
              x: baseX + positionOffsetX,
              y: baseY + positionOffsetY,
            },
            key: heartKeyRef.current + i,
            index: i,
            animationId,
            size,
            rotation,
            color: heartColor,
          };
        });
        heartKeyRef.current += heartCount;
        
        // Append new hearts to existing ones (allow multiple animations)
        setFloatingHearts(prev => [...prev, ...newHearts]);
        
        // Set timeout to remove only this animation's hearts
        const timeout = setTimeout(() => {
          setFloatingHearts(prev => prev.filter(heart => heart.animationId !== animationId));
          activeTimeoutsRef.current.delete(animationId);
        }, 3500);
        
        // Store timeout reference for cleanup
        activeTimeoutsRef.current.set(animationId, timeout);
      }
    }
  };

  const handleAmountClick = (amount: number) => {
    // Don't show spinner if this amount is already selected
    if (selectedAmount === amount) {
      return;
    }
    
    // Trigger floating hearts animation immediately
    triggerFloatingHearts(amount);
    
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
      // Keep nonprofit selected - never clear it
      onDonationChange?.(0, selectedNonprofit);
      setIsClearing(false);
    }, 800);
  };

  const handleNonprofitSelect = (nonprofit: Nonprofit) => {
    setSelectedNonprofit(nonprofit);
    setIsDropdownOpen(false);
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
    <div className="donation-widget-bg rounded-[8px] border border-[#e0e0e0] p-[20px] relative">
      {/* Header with question and amount button */}
      <div className="flex items-center mb-[16px]">
        <h3 className="text-[#212121] text-[16px] font-bold">Θα θέλατε να κάνετε μια δωρεά;</h3>
          <button
            type="button"
            className="donation-widget-badge text-white box-border content-stretch flex gap-[4px] items-center justify-center p-[4px] px-2 relative rounded-[4px] shrink-0 ml-[8px] bg-[#8320bd]"
          >
          <span
            aria-hidden="true"
            style={{
              width: '12px',
              height: '12px',
              display: 'inline-flex'              
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

      {/* Organization Dropdown */}
      <div ref={dropdownRef} className="relative flex items-center gap-[16px] mb-[16px]">
        <div className="w-full relative">
          {/* Selected Item / Trigger Button */}
          <button
            type="button"
            onClick={() => {
              setIsDropdownOpen(!isDropdownOpen);
            }}
            className={`w-full border border-[#e0e0e0] rounded-[8px] bg-white text-[14px] text-[#212121] shadow-sm focus:outline-none focus:border-[#0957e8] appearance-none flex items-center justify-between cursor-pointer hover:border-[#0957e8] transition-colors gap-[12px] ${
              selectedNonprofit ? 'bg-[#f5f5f5]' : ''
            }`}
            style={{ padding: '12px' }}
          >
            <div className="flex items-center gap-[12px] flex-1 min-w-0">
              {selectedNonprofit ? (() => {
                return (
                  <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                    {selectedNonprofit.logo ? (
                      <ImageWithFallback
                        src={selectedNonprofit.logo}
                        alt={selectedNonprofit.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (() => {
                      const Icon = getIcon(selectedNonprofit.icon);
                      return <Icon size={18} className="text-[#0957e8]" />;
                    })()}
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
                {selectedNonprofit ? selectedNonprofit.name : 'Επιλογή φορέα'}
              </span>
            </div>
            <ChevronDown 
              size={20} 
              className={`text-[#757575] shrink-0 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} 
            />
          </button>

          {/* Dropdown List */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-[4px] bg-white border border-[#e0e0e0] rounded-[8px] shadow-lg z-50 max-h-[400px] overflow-y-auto">
              {nonprofits.map((nonprofit) => {
                const isSelected = selectedNonprofit?.id === nonprofit.id;
                return (
                  <button
                    key={nonprofit.id}
                    type="button"
                    onClick={() => handleNonprofitSelect(nonprofit)}
                    className={`w-full flex items-center gap-[12px] px-[16px] py-[12px] text-left transition-colors hover:bg-[#f5f5f5] ${
                      isSelected ? 'bg-[#f5f5f5]' : ''
                    }`}
                  >
                    {/* Logo/Icon */}
                    <div className="w-[32px] h-[32px] rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                      {nonprofit.logo ? (
                        <ImageWithFallback
                          src={nonprofit.logo}
                          alt={nonprofit.name}
                          className="w-full h-full object-contain"
                        />
                      ) : (() => {
                        const Icon = getIcon(nonprofit.icon);
                        return <Icon size={18} className="text-[#0957e8]" />;
                      })()}
                    </div>

                    {/* Name */}
                    <span className="text-[#212121] text-[16px] flex-1 truncate">
                      {nonprofit.name}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Amount Selection - from version 2 (buttons + trash can) */}
      <div className="relative shrink-0 w-full overflow-visible">
        <div className="size-full overflow-visible">
          <div className="box-border content-stretch flex flex-col gap-[12px] items-start relative w-full py-[8px] mt-[0px] mr-[0px] mb-[8px] ml-[0px] overflow-visible">
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full overflow-visible">
                {/* Preset amounts */}
                {presetAmounts.map((amount) => {
                  const isLoading = loadingAmount === amount;
                  const isSelected = selectedAmount === amount && selectedNonprofit !== null;
                  
                  return (
                    <div key={amount} className="relative basis-0 grow min-h-px min-w-px shrink-0 overflow-visible" style={{ zIndex: 1 }}>
                      {/* Floating hearts for this button */}
                      {floatingHearts
                        .filter(heart => heart.amount === amount)
                        .map((heart) => {
                          return (
                            <div
                              key={heart.key}
                              className={`heart-float heart-float-${heart.index}`}
                              style={{
                                left: `${heart.position.x}px`,
                                top: `${heart.position.y}px`,
                                transform: `translate(-50%, -50%) rotate(${heart.rotation}deg)`,
                                zIndex: 0,
                                '--heart-rotate': `${heart.rotation}deg`,
                              } as React.CSSProperties & {
                                '--heart-rotate': string;
                              }}
                            >
                              <svg
                                width={heart.size}
                                height={heart.size * 0.9}
                                viewBox="0 0 20 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M0 5.85223C0 10.7152 4.02 13.3062 6.962 15.6262C8 16.4442 9 17.2152 10 17.2152C11 17.2152 12 16.4452 13.038 15.6252C15.981 13.3072 20 10.7152 20 5.85323C20 0.991225 14.5 -2.45977 10 2.21623C5.5 -2.45977 0 0.989226 0 5.85223Z"
                                  fill={heart.color}
                                />
                              </svg>
                            </div>
                          );
                        })}
                      <button
                        ref={(el) => {
                          if (el) amountButtonRefs.current.set(amount, el);
                          else amountButtonRefs.current.delete(amount);
                        }}
                        type="button"
                        onClick={() => handleAmountClick(amount)}
                        disabled={isLoading || loadingAmount !== null}
                        className={`w-full h-full relative rounded-[8px] shrink-0 transition-all ${
                          isSelected || isLoading
                            ? 'donation-widget-button-selected'
                            : 'donation-widget-button-default'
                        } ${loadingAmount !== null && !isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${!selectedNonprofit ? 'opacity-60' : ''}`}
                        style={{ zIndex: 1 }}
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
                    </div>
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
                  } ${!selectedNonprofit ? 'opacity-60' : ''}`}
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
  );
}

