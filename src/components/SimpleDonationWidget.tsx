import React, { useState, useRef, useEffect } from 'react';
import { Switch } from './ui/switch';
import { type Nonprofit } from './NonprofitSelector';

interface SimpleDonationWidgetProps {
  onDonationChange?: (amount: number, nonprofit: Nonprofit | null) => void;
}

// Default nonprofit - using the first one from the list
const defaultNonprofit: Nonprofit = {
  id: 'arsis',
  name: 'ΑΡΣΙΣ',
  description: 'Παρέχει κοινωνική υποστήριξη και προστασία σε ευάλωτες ομάδες πληθυσμού.',
  category: 'humans',
  icon: 'heart',
  logo: 'https://youbehero.com/images/cause/265/l/arsis_logo.png'
};

// Default donation amount when switch is enabled
const DEFAULT_DONATION_AMOUNT = 1;

export default function SimpleDonationWidget({ onDonationChange }: SimpleDonationWidgetProps) {
  const [isEnabled, setIsEnabled] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<{ position: { x: number; y: number }; key: number; index: number; animationId: number; size: number; rotation: number; color: string }[]>([]);
  const heartKeyRef = useRef(0);
  const animationIdRef = useRef(0);
  const activeTimeoutsRef = useRef<Map<number, NodeJS.Timeout>>(new Map());
  const switchContainerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const lastHeartTimeRef = useRef(0);
  const EMOJI_DEBOUNCE_MS = 1500; // 1.5 seconds debounce to prevent overload

  // Notify parent of initial state
  useEffect(() => {
    onDonationChange?.(0, defaultNonprofit);
  }, []); // Only run on mount

  // Cleanup all heart animation timeouts on unmount
  useEffect(() => {
    return () => {
      activeTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
      activeTimeoutsRef.current.clear();
    };
  }, []);

  const triggerFloatingHearts = (isSwitchOn: boolean) => {
    if (!isSwitchOn) return; // Only trigger when switch is ON
    
    const now = Date.now();
    const timeSinceLastHeart = now - lastHeartTimeRef.current;
    
    // Debounce to prevent overload
    if (timeSinceLastHeart >= EMOJI_DEBOUNCE_MS) {
      lastHeartTimeRef.current = now;
      
      const switchContainer = switchContainerRef.current;
      if (!switchContainer || !wrapperRef.current) return;
      
      const switchRect = switchContainer.getBoundingClientRect();
      const wrapperRect = wrapperRef.current.getBoundingClientRect();
      
      // Get switch's background color (blue when checked)
      // Find the actual switch button element within the container
      const switchElement = switchContainer.querySelector('button[data-slot="switch"]') as HTMLElement;
      const computedStyle = switchElement ? window.getComputedStyle(switchElement) : null;
      const switchColor = computedStyle?.backgroundColor || '#1c59e5';
      
      // Parse RGB color to get individual values
      const rgbMatch = switchColor.match(/\d+/g);
      let baseR = 28, baseG = 89, baseB = 229; // Default blue (#1c59e5)
      if (rgbMatch && rgbMatch.length >= 3) {
        baseR = parseInt(rgbMatch[0]);
        baseG = parseInt(rgbMatch[1]);
        baseB = parseInt(rgbMatch[2]);
      }
      
      // Calculate position relative to wrapper - right before (to the left of) the switch
      const baseX = switchRect.left - wrapperRect.left + 14 - 40 + 10 + 20; // 14px to the right from switch left edge, then -40px, then +10px, then +20px
      const baseY = switchRect.top - wrapperRect.top + 20 - 40 - 20; // 20px from the top of the switch, then -40px, then -20px more
      
      const heartCount = 6;
      const animationId = animationIdRef.current++;
      
      // Create new hearts with unique animation ID and randomized properties
      const newHearts = Array.from({ length: heartCount }, (_, i) => {
        // Randomize position horizontally - spread them slightly around the base position
        const positionOffsetX = (Math.random() - 0.5) * 10; // ±5px variation
        // Position hearts at 20px from top, they'll float upward
        const positionOffsetY = 0; // Start at the specified top position
        
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
  };

  const handleSwitchChange = (checked: boolean) => {
    setIsEnabled(checked);
    
    if (checked) {
      // Scroll to bottom when toggle is turned ON
      setTimeout(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: 'smooth'
        });
      }, 100);
      
      // Trigger hearts animation when switch is turned ON
      // Use setTimeout to ensure the switch has rendered in its checked state
      setTimeout(() => {
        triggerFloatingHearts(true);
      }, 100);
      
      // Notify parent with default donation amount
      onDonationChange?.(DEFAULT_DONATION_AMOUNT, defaultNonprofit);
    } else {
      // Notify parent that donation is disabled
      onDonationChange?.(0, defaultNonprofit);
    }
  };

  return (
    <div ref={wrapperRef} className="donation-widget-bg rounded-[8px] p-[20px] relative overflow-visible" style={{ backgroundColor: isEnabled ? 'rgba(28, 89, 229, 0.08)' : '#e5e5e5' }}>
      {/* Header with question and switch in one line */}
      <div className="relative overflow-visible">
        {/* Floating hearts */}
        {floatingHearts.map((heart) => {
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
        
        {/* Question and Switch in one line */}
        <label htmlFor="donation-switch" className="flex items-center justify-between cursor-pointer w-full">
          <h3 className="text-[#1c59e5] text-[16px] font-bold">Στηρίζω ενεργά.</h3>
          <div ref={switchContainerRef} className="flex items-center" style={{ zIndex: 1 }}>
            <Switch
              id="donation-switch"
              checked={isEnabled}
              onCheckedChange={handleSwitchChange}
              className="data-[state=checked]:bg-[#1c59e5] data-[state=unchecked]:bg-[#cbced4] [&>span]:bg-white [&>span]:size-5 [&[data-state=checked]>span]:translate-x-[22px] h-6 w-11"
            />
          </div>
        </label>
      </div>
    </div>
  );
}
