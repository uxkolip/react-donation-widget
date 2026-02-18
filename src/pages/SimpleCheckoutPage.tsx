import React, { useState } from 'react';
import CheckoutForm from '../components/CheckoutForm';
import SimpleDonationWidget from '../components/SimpleDonationWidget';
import type { Nonprofit } from '../components/NonprofitSelector';
import { formatCurrency } from '../lib/currency';

const ORDER_TOTAL = 149.99;

export default function SimpleCheckoutPage() {
  const [donationAmount, setDonationAmount] = useState(0);
  const [selectedNonprofit, setSelectedNonprofit] = useState<Nonprofit | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const finalTotal = ORDER_TOTAL + donationAmount;

  const handleDonationChange = (amount: number, nonprofit: Nonprofit | null) => {
    if (amount > 0 && nonprofit) {
      setDonationAmount(amount);
      setSelectedNonprofit(nonprofit);
    } else {
      setDonationAmount(0);
      setSelectedNonprofit(nonprofit);
    }
  };

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1000);
  };

  return (
    <div className="max-w-[800px] mx-auto relative">
      {isSubmitted && (
        <div className="success-overlay">
          <div className="success-checkmark">
            <svg className="checkmark-circle" width="120" height="120" viewBox="0 0 120 120">
              <circle
                className="circle-bg"
                cx="60"
                cy="60"
                r="55"
                fill="none"
                stroke="#0957e8"
                strokeWidth="3"
              />
              <path
                className="checkmark-path"
                d="M35 60 L52 77 L85 44"
                fill="none"
                stroke="#0957e8"
                strokeWidth="5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      )}
      <div className={`checkout-content ${isSubmitted ? 'fade-out' : ''}`}>
      <header className="mb-[32px]">
        <h1 className="text-[#212121] mb-[8px] text-[24px] font-semibold">Ολοκλήρωση Παραγγελίας</h1>
        <p className="text-[#757575]">
          Συμπληρώστε τα στοιχεία σας για να ολοκληρώσετε την παραγγελία
        </p>
      </header>

      <section className="mb-[24px]">
        <CheckoutForm />
      </section>

      <div className="mb-[24px]">
        <SimpleDonationWidget onDonationChange={handleDonationChange} />
      </div>

      <section className="bg-white rounded-[8px] p-[24px] border border-[#e0e0e0] mb-[24px]">
        <h2 className="skeleton-text text-[#212121] mb-[16px] text-[18px]">Περίληψη Παραγγελίας</h2>
        <div className="flex flex-col gap-[12px]">
          <div className="flex justify-between items-center">
            <span className="skeleton-text text-[#424242]">Προϊόντα (3 τεμ.)</span>
            <span className="skeleton-text text-[#212121]">{formatCurrency(ORDER_TOTAL)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="skeleton-text text-[#424242]">Μεταφορικά</span>
            <span className="skeleton-text text-[#00c853]">Δωρεάν</span>
          </div>
          {donationAmount > 0 && (
            <div className="flex justify-between items-center text-[#0957e8]">
              <span className="skeleton-text-blue">Δωρεά</span>
              <span className="flex items-center gap-[4px] bg-[#1c59e5] text-white text-[12px] px-[8px] py-[4px] rounded-[4px]">
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.125 1C7.35 1 6.599 1.267 6 1.758C5.4 1.268 4.65 0.999003 3.875 1C2.98 1 2.121 1.356 1.489 1.989C0.856 2.62 0.5 3.479 0.5 4.375C0.5 6.624 1.892 8.283 3.104 9.31C3.844 9.93 4.655 10.458 5.523 10.881L5.571 10.903L5.586 10.91L5.59 10.913H5.592L6 10L5.593 10.914L6 11.094L6.406 10.914L6 10C6.134 10.305 6.27 10.61 6.407 10.913L6.409 10.912L6.414 10.91L6.428 10.903L6.476 10.88C7.344 10.458 8.156 9.93 8.896 9.31C10.107 8.283 11.5 6.624 11.5 4.375C11.5 3.48 11.144 2.621 10.511 1.989C9.88 1.356 9.021 1 8.125 1ZM6 3.25C6.133 3.25 6.26 3.303 6.354 3.396C6.447 3.49 6.5 3.617 6.5 3.75V4.077C6.784 4.164 7.04 4.324 7.244 4.541L7.252 4.55L7.255 4.554L7.256 4.557C7.334 4.659 7.37 4.787 7.356 4.914C7.342 5.042 7.279 5.159 7.181 5.241C7.082 5.324 6.956 5.365 6.828 5.356C6.7 5.347 6.58 5.289 6.494 5.194L6.496 5.198L6.479 5.182C6.349 5.062 6.177 4.996 5.999 4.997C5.8 4.997 5.684 5.049 5.629 5.093C5.586 5.127 5.559 5.171 5.559 5.25C5.559 5.265 5.561 5.28 5.564 5.296L5.566 5.3L5.574 5.309C5.587 5.319 5.602 5.329 5.618 5.337C5.731 5.397 5.905 5.435 6.189 5.49C6.426 5.537 6.771 5.601 7.049 5.759C7.199 5.844 7.349 5.966 7.459 6.144C7.571 6.324 7.622 6.53 7.622 6.75C7.622 7.371 7.145 7.798 6.5 7.942V8.25C6.5 8.383 6.447 8.51 6.354 8.604C6.26 8.697 6.133 8.75 6 8.75C5.867 8.75 5.74 8.697 5.646 8.604C5.553 8.51 5.5 8.383 5.5 8.25V7.944C5.228 7.892 4.974 7.774 4.761 7.597C4.622 7.478 4.51 7.332 4.431 7.167L4.414 7.124L4.407 7.107L4.405 7.101L4.403 7.097V7.095C4.363 6.971 4.373 6.835 4.431 6.719C4.49 6.602 4.591 6.512 4.715 6.47C4.839 6.428 4.975 6.437 5.092 6.494C5.21 6.551 5.3 6.652 5.344 6.775L5.343 6.771L5.338 6.757C5.357 6.789 5.381 6.817 5.41 6.841C5.476 6.897 5.64 7.003 6 7.003C6.295 7.003 6.463 6.928 6.545 6.867C6.623 6.809 6.628 6.762 6.628 6.75C6.628 6.689 6.613 6.67 6.613 6.669C6.61 6.665 6.599 6.647 6.556 6.623C6.448 6.561 6.275 6.521 5.998 6.466C5.766 6.421 5.424 6.361 5.151 6.216C4.984 6.131 4.841 6.005 4.736 5.849C4.621 5.671 4.561 5.462 4.565 5.25C4.562 5.07 4.601 4.892 4.678 4.73C4.755 4.568 4.868 4.425 5.01 4.314C5.155 4.2 5.321 4.12 5.5 4.07V3.75C5.5 3.617 5.553 3.49 5.646 3.396C5.74 3.303 5.867 3.25 6 3.25Z" fill="white"/>
                </svg>
                {formatCurrency(donationAmount)}
              </span>
            </div>
          )}
          <div className="border-t border-[#e0e0e0] pt-[12px] mt-[4px]">
            <div className="flex justify-between items-center">
              <span className="skeleton-text text-[#212121]">Σύνολο</span>
              <span className="skeleton-text text-[#212121]">{formatCurrency(finalTotal)}</span>
            </div>
          </div>
        </div>
      </section>

      <button 
        onClick={handleSubmit}
        disabled={isLoading}
        className="w-full bg-[#212121] text-white py-[14px] px-[24px] rounded-[8px] hover:bg-[#1a1a1a] transition-colors disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-[8px]"
      >
        {isLoading ? (
          <svg className="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="spinner-circle" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
          </svg>
        ) : (
          'Αποστολή παραγγελίας'
        )}
      </button>
      
      </div>
    </div>
  );
}
