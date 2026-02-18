import React, { useState, useRef } from 'react';
import CombinedDonationWidget from '../components/CombinedDonationWidget';
import type { Nonprofit } from '../components/NonprofitSelector';
import { CreditCard, Banknote, Building2, Monitor } from 'lucide-react';

const CART_TOTAL = 11;
const formatEur = (n: number) => new Intl.NumberFormat('el-GR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n) + '€';

export default function HomestoreCheckoutPage() {
  const [donationAmount, setDonationAmount] = useState(3);
  const [selectedNonprofit, setSelectedNonprofit] = useState<Nonprofit | null>(null);
  const finalTotal = CART_TOTAL + donationAmount;
  const paginationContainerRef = useRef<HTMLDivElement | null>(null);

  const handleDonationChange = (amount: number, nonprofit: Nonprofit | null) => {
    setDonationAmount(amount);
    setSelectedNonprofit(nonprofit);
  };

  return (
    <div className="min-h-screen bg-white">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-[#0051ba] text-white px-3 py-2 rounded z-50">
        Skip to main content
      </a>

      {/* Header */}
      <header className="border-b border-[#e0e0e0] bg-white sticky top-0 z-40">
        <div className="max-w-[1200px] mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#0051ba] flex items-center justify-center shrink-0">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="font-bold text-[#212121] text-lg">Homestore</span>
          </div>
          <div className="flex items-center gap-2 text-[#212121] text-sm">
            <span>Ελληνικά</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </div>
        </div>
      </header>

      <main id="main" className="max-w-[1200px] mx-auto px-4 py-6 md:py-8 w-full">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-8 md:gap-10 lg:gap-12 md:items-start">
          {/* Left column: Checkout steps */}
          <div className="min-w-0 space-y-6">
            {/* Step 1 */}
            <section className="bg-white border border-[#e0e0e0] rounded-lg p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#212121] text-white flex items-center justify-center font-bold shrink-0">1</div>
                <div className="min-w-0">
                  <h2 className="text-[#212121] font-bold text-base mb-2">Πληροφορίες Καταστήματος Homestore</h2>
                  <p className="text-[#424242] text-sm">Homestore The Mall Athens</p>
                  <p className="text-[#424242] text-sm">Ανδρέα Παπανδρέου 35, 15122</p>
                  <p className="text-[#424242] text-sm">Μαρούσι</p>
                </div>
              </div>
            </section>

            {/* Step 2 */}
            <section className="bg-white border border-[#e0e0e0] rounded-lg p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#212121] text-white flex items-center justify-center font-bold shrink-0">2</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <h2 className="text-[#212121] font-bold text-base">Διεύθυνση Τιμολόγησης</h2>
                    <a href="#" className="text-[#0051ba] text-sm hover:underline">Επεξεργασία</a>
                  </div>
                  <p className="text-[#424242] text-sm font-medium mb-1">Στοιχεία</p>
                  <p className="text-[#424242] text-sm">Μαρία Παπαδοπούλου</p>
                  <p className="text-[#424242] text-sm">Λεωφόρος Κηφισίας 33, 15122</p>
                  <p className="text-[#424242] text-sm">ΜΑΡΟΥΣΙ , ΑΤΤΙΚΗΣ</p>
                  <p className="text-[#424242] text-sm">mariapap@gmail.com</p>
                  <p className="text-[#424242] text-sm">6988753482</p>
                  <p className="text-[#424242] text-sm">Απόδειξη</p>
                </div>
              </div>
            </section>

            {/* Step 3: Payment + Donation widget */}
            <section className="bg-white border border-[#e0e0e0] rounded-lg p-5">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#212121] text-white flex items-center justify-center font-bold shrink-0">3</div>
                <div className="min-w-0 flex-1 space-y-5">
                  <h2 className="text-[#212121] font-bold text-base">Τρόπος πληρωμής</h2>

                  

                  <p className="text-[#212121] font-medium text-sm">Τρόποι πληρωμής</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="border-2 border-[#0051ba] rounded-lg p-4 flex flex-col items-center gap-2 bg-[#f0f7ff]">
                      <CreditCard className="w-8 h-8 text-[#0051ba]" />
                      <span className="text-[#212121] text-sm font-medium text-center">Πιστωτική/Χρεωστική Κάρτα</span>
                    </div>
                    
                    <div className="border border-[#e0e0e0] rounded-lg p-4 flex flex-col items-center gap-2 hover:border-[#0051ba] transition-colors">
                      <Building2 className="w-8 h-8 text-[#212121]" />
                      <span className="text-[#212121] text-sm text-center">Τραπεζική κατάθεση</span>
                    </div>
                    <div className="border border-[#e0e0e0] rounded-lg p-4 flex flex-col items-center gap-2 hover:border-[#0051ba] transition-colors">
                      <img src="https://ikeagreece.akamaized.net/images/30x30/files/PaymentIcons/paypal.png" alt="" className="w-8 h-8 object-contain" />
                      <span className="text-[#003087] font-bold text-sm">PayPal</span>
                    </div>
                    <div className="border border-[#e0e0e0] rounded-lg p-4 flex flex-col items-center gap-2 hover:border-[#0051ba] transition-colors">
                      <img src="https://ikeagreece.akamaized.net/images/30x30/files/PaymentIcons/iris.png" alt="IRIS" className="w-8 h-8 object-contain" />
                      <span className="text-[#212121] text-sm text-center">IRIS</span>
                    </div>
                    
                  </div>

                  {/* Donation widget */}
                  <div className="pt-2">
                    <CombinedDonationWidget onDonationChange={handleDonationChange} singleOrg paginationContainerRef={paginationContainerRef} />
                  </div>

                  <button type="button" className="w-full md:w-auto bg-[#212121] text-white py-3 px-8 rounded-lg font-medium hover:bg-[#1a1a1a] transition-colors">
                    Αποθήκευση
                  </button>
                </div>
              </div>
            </section>

            {/* Step 4 */}
            <section className="bg-white border border-[#e0e0e0] rounded-lg p-5 opacity-80">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-[#9e9e9e] text-white flex items-center justify-center font-bold shrink-0">4</div>
                <div className="min-w-0">
                  <h2 className="text-[#757575] font-bold text-base">Ημέρα & Ώρα παράδοσης</h2>
                </div>
              </div>
            </section>
          </div>

          {/* Right column: Cart summary (Το καλάθι μου) – self-stretch so sticky has room to stick */}
          <aside className="min-w-0 md:min-w-[380px] md:self-stretch">
            <div className="bg-white border border-[#e0e0e0] rounded-lg p-5 sticky top-[105px]">
              <div className="flex items-center justify-between gap-2 mb-4">
                <h2 className="text-[#212121] font-bold text-lg m-0">Το καλάθι μου</h2>
                <a href="#" className="text-[#0051ba] text-sm hover:underline shrink-0">Επιστροφή στο καλάθι</a>
              </div>

              <div className="flex gap-3 py-3 border-b border-[#e0e0e0]">
                <img
                  src="https://ikeagreece.akamaized.net/images/1860x1860/4/variantimages/50355395/0.jpg"
                  alt="Φωτιστικό γραφείου Billy"
                  className="w-20 h-20 rounded object-cover shrink-0"
                />
                <div className="min-w-0 flex-1 flex items-center justify-between gap-2">
                  <p className="text-[#424242] text-sm line-clamp-2">Φωτιστικό γραφείου Billy</p>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
                </div>
              </div>

              <div className="py-4 space-y-2 text-sm">
                <div className="flex justify-between text-[#424242]">
                  <span>Σύνολο (με Φ.Π.Α)</span>
                  <span className="text-[#212121]">{formatEur(CART_TOTAL)}</span>
                </div>
                <div className="flex justify-between text-[#424242]">
                  <span className="truncate pr-2">Δωρεά: {selectedNonprofit?.name || '—'}</span>
                  <span className="text-[#212121] shrink-0">{formatEur(donationAmount)}</span>
                </div>
                <div className="flex justify-between text-[#424242]">
                  <span>Έξοδα αποστολής</span>
                  <span className="text-green-600">Χωρίς μεταφορικά</span>
                </div>
              </div>

              <div className="border-t border-[#e0e0e0] pt-4 flex justify-between items-center">
                <span className="text-[#212121] font-bold">Τελικό σύνολο</span>
                <span className="text-[#212121] font-bold text-lg">{formatEur(finalTotal)}</span>
              </div>

              <div className="mt-4 flex items-center gap-2 py-2 px-3 rounded-lg bg-gradient-to-r from-[#0051ba] to-[#0072ce] text-white text-sm">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                <span>Πόντοι ανταμοιβής αγοράς για Homestore Family μέλη</span>
                <span className="ml-auto font-semibold">395</span>
              </div>
            </div>
          </aside>
        </div>

        {/* Pagination for donation widget (single-org mode) – rendered here at bottom of page */}
        <div ref={paginationContainerRef} className="mt-8 flex items-center justify-between gap-[12px]" />
      </main>
    </div>
  );
}
