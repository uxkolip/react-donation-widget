import { useMemo, useState } from 'react';
import { ChevronDown, Globe2, Trash2 } from 'lucide-react';
import CheckoutForm from './CheckoutForm';
import NonprofitSelector, { type Nonprofit } from './NonprofitSelector';

const presetOptions = [0.5, 1, 3];

const euroFormatter = new Intl.NumberFormat('el-GR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const formatAmount = (value: number) => euroFormatter.format(value);

interface AlternativeCheckoutPageProps {
  orderTotal: number;
  itemsCount?: number;
}

export default function AlternativeCheckoutPage({
  orderTotal,
  itemsCount = 3,
}: AlternativeCheckoutPageProps) {
  const [selectedAmount, setSelectedAmount] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNonprofit, setSelectedNonprofit] = useState<Nonprofit>({
    id: 'save-your-hood',
    name: 'Save Your Hood',
    description:
      'Εθελοντική πρωτοβουλία που φροντίζει γειτονιές και κοινόχρηστους χώρους μέσα από δράσεις καθαρισμού.',
    category: 'environment',
    icon: 'tree',
  });

  const finalTotal = useMemo(() => orderTotal + selectedAmount, [orderTotal, selectedAmount]);

  const handleClearSelection = () => setSelectedAmount(0);

  return (
    <section className="bg-[#f0f2f5] rounded-[32px] border border-[#e0e0e0] p-[24px] md:p-[40px] shadow-[0_25px_65px_rgba(33,47,41,0.08)]">
      <div className="space-y-[32px]">
        <header className="flex flex-wrap items-center justify-between gap-[16px]">
          <div>
            <p className="text-[#1b1b1b] text-[28px] font-semibold leading-tight">
              Θέλετε να κάνετε μια δωρεά;
            </p>
            <p className="text-[#757575]">
              Επιλέξτε έναν φορέα και στρογγυλοποιήστε το ποσό της παραγγελίας σας.
            </p>
          </div>
          <span className="bg-[#0b8652] text-white px-[28px] py-[12px] rounded-full text-[20px] font-semibold min-w-[120px] text-center">
            {formatAmount(selectedAmount)}€
          </span>
        </header>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="w-full bg-white border border-[#dfe4e0] rounded-[20px] p-[20px] flex items-center gap-[16px] shadow-[0_10px_35px_rgba(22,37,27,0.06)] hover:border-[#0b8652] transition-colors"
        >
          <div className="w-[64px] h-[64px] rounded-[16px] bg-[#e7f4e8] text-[#0b8652] flex items-center justify-center shrink-0">
            <Globe2 size={36} />
          </div>
          <div className="text-left flex-1">
            <p className="text-[#1b1b1b] text-[20px] font-semibold">{selectedNonprofit.name}</p>
            <p className="text-[#757575] text-[14px]">Πατήστε για να αλλάξετε φορέα</p>
          </div>
          <ChevronDown className="text-[#2f2f2f]" size={28} />
        </button>

        <div>
          <p className="text-[#4f4f4f] mb-[12px]">Επιλέξτε ποσό δωρεάς</p>
          <div className="grid grid-cols-4 gap-[12px]">
            {presetOptions.map((amount) => {
              const isActive = amount === selectedAmount;
              return (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setSelectedAmount(amount)}
                  className={`rounded-[18px] border px-[16px] py-[14px] text-[18px] font-semibold transition-all ${
                    isActive
                      ? 'bg-[#07753f] border-[#07753f] text-white shadow-[0_12px_30px_rgba(7,117,63,0.25)]'
                      : 'bg-white border-[#dfe4e0] text-[#1b1b1b] hover:border-[#07753f]'
                  }`}
                >
                  {formatAmount(amount)}€
                </button>
              );
            })}

            <button
              type="button"
              aria-label="Καθαρισμός επιλογής"
              onClick={handleClearSelection}
              className="rounded-[18px] border border-[#dfe4e0] bg-white flex items-center justify-center hover:border-[#b71c1c] transition-colors"
            >
              <Trash2 className="text-[#424242]" />
            </button>
          </div>
        </div>

        <div className="grid gap-[24px] lg:grid-cols-[1.7fr_1fr]">
          <CheckoutForm />

          <div className="space-y-[16px]">
            <div className="bg-white border border-[#dfe4e0] rounded-[20px] p-[24px] shadow-[0_10px_35px_rgba(22,37,27,0.05)]">
              <div className="flex flex-col gap-[12px]">
                <div className="flex items-center justify-between">
                  <span className="text-[#424242]">Προϊόντα ({itemsCount} τεμ.)</span>
                  <span className="font-semibold text-[#1b1b1b]">{formatAmount(orderTotal)}€</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#424242]">Μεταφορικά</span>
                  <span className="text-[#0b8652] font-medium">Δωρεάν</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#424242]">
                    Δωρεά {selectedAmount > 0 ? `(${selectedNonprofit.name})` : ''}
                  </span>
                  <span
                    className={`font-semibold ${
                      selectedAmount > 0 ? 'text-[#0b8652]' : 'text-[#9e9e9e]'
                    }`}
                  >
                    {selectedAmount > 0 ? '+' : ''}
                    {formatAmount(selectedAmount)}€
                  </span>
                </div>
                <div className="border-t border-dashed border-[#dfe4e0] pt-[12px] mt-[12px]">
                  <div className="flex items-center justify-between text-[18px] font-semibold text-[#1b1b1b]">
                    <span>Σύνολο</span>
                    <span>{formatAmount(finalTotal)}€</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full bg-[#07753f] hover:bg-[#066836] text-white font-semibold py-[16px] rounded-[18px] text-[18px] transition-colors">
              Ολοκλήρωση με δωρεά {formatAmount(selectedAmount)}€
            </button>
            <p className="text-center text-[#757575] text-[14px]">
              Η συναλλαγή σας είναι ασφαλής και κρυπτογραφημένη.
            </p>
          </div>
        </div>
      </div>

      <NonprofitSelector
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelect={(nonprofit) => {
          setSelectedNonprofit(nonprofit);
          setIsModalOpen(false);
        }}
        selectedId={selectedNonprofit.id}
      />
    </section>
  );
}


