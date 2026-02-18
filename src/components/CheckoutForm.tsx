import { useEffect } from 'react';

export default function CheckoutForm() {
  useEffect(() => {
    const handleInput = (e: Event) => {
      const input = e.target as HTMLInputElement;
      const wrapper = input.closest('.skeleton-placeholder-wrapper');
      if (wrapper) {
        if (input.value) {
          wrapper.classList.add('has-value');
        } else {
          wrapper.classList.remove('has-value');
        }
      }
    };

    const inputs = document.querySelectorAll('.skeleton-placeholder-wrapper input');
    inputs.forEach(input => {
      input.addEventListener('input', handleInput);
      // Check initial state
      handleInput({ target: input } as Event);
    });

    return () => {
      inputs.forEach(input => {
        input.removeEventListener('input', handleInput);
      });
    };
  }, []);

  return (
    <div className="bg-white rounded-[8px] p-[24px] border border-[#e0e0e0]">
      <h2 className="skeleton-text text-[#212121] mb-[24px]">Στοιχεία Παραγγελίας</h2>
      
      <form className="flex flex-col gap-[16px]">
        {/* Contact Information */}
        <div>
          <label htmlFor="name" className="skeleton-text block text-[#424242] mb-[8px]">
            Ονοματεπώνυμο
          </label>
          <div className="skeleton-placeholder-wrapper relative">
            <input
              type="text"
              id="name"
              className="w-full px-[12px] py-[10px] border border-[#bdbdbd] rounded-[4px] focus:outline-none focus:border-[#0957e8]"
              placeholder="Εισάγετε το όνομά σας"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="skeleton-text block text-[#424242] mb-[8px]">
            Email
          </label>
          <div className="skeleton-placeholder-wrapper relative">
            <input
              type="email"
              id="email"
              className="w-full px-[12px] py-[10px] border border-[#bdbdbd] rounded-[4px] focus:outline-none focus:border-[#0957e8]"
              placeholder="example@email.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="skeleton-text block text-[#424242] mb-[8px]">
            Τηλέφωνο
          </label>
          <div className="skeleton-placeholder-wrapper relative">
            <input
              type="tel"
              id="phone"
              className="w-full px-[12px] py-[10px] border border-[#bdbdbd] rounded-[4px] focus:outline-none focus:border-[#0957e8]"
              placeholder="+30 123 456 7890"
            />
          </div>
        </div>

        {/* Shipping Address */}
        <div className="mt-[8px]">
          <h3 className="skeleton-text text-[#212121] mb-[16px]">Διεύθυνση Αποστολής</h3>
          
          <div className="flex flex-col gap-[16px]">
            <div>
              <label htmlFor="address" className="skeleton-text block text-[#424242] mb-[8px]">
                Διεύθυνση
              </label>
              <div className="skeleton-placeholder-wrapper relative">
                <input
                  type="text"
                  id="address"
                  className="w-full px-[12px] py-[10px] border border-[#bdbdbd] rounded-[4px] focus:outline-none focus:border-[#0957e8]"
                  placeholder="Οδός και αριθμός"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-[16px]">
              <div>
                <label htmlFor="city" className="skeleton-text block text-[#424242] mb-[8px]">
                  Πόλη
                </label>
                <div className="skeleton-placeholder-wrapper relative">
                  <input
                    type="text"
                    id="city"
                    className="w-full px-[12px] py-[10px] border border-[#bdbdbd] rounded-[4px] focus:outline-none focus:border-[#0957e8]"
                    placeholder="Αθήνα"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="postal" className="skeleton-text block text-[#424242] mb-[8px]">
                  Τ.Κ.
                </label>
                <div className="skeleton-placeholder-wrapper relative">
                  <input
                    type="text"
                    id="postal"
                    className="w-full px-[12px] py-[10px] border border-[#bdbdbd] rounded-[4px] focus:outline-none focus:border-[#0957e8]"
                    placeholder="12345"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mt-[8px]">
          <h3 className="skeleton-text text-[#212121] mb-[16px]">Τρόπος Πληρωμής</h3>
          
          <div className="flex flex-col gap-[12px]">
            <label className="flex items-center gap-[12px] p-[12px] border border-[#bdbdbd] rounded-[4px] cursor-pointer hover:border-[#0957e8]">
              <input type="radio" name="payment" defaultChecked className="w-[16px] h-[16px]" />
              <span className="skeleton-text text-[#212121]">Πιστωτική/Χρεωστική Κάρτα</span>
            </label>
            
            <label className="flex items-center gap-[12px] p-[12px] border border-[#bdbdbd] rounded-[4px] cursor-pointer hover:border-[#0957e8]">
              <input type="radio" name="payment" className="w-[16px] h-[16px]" />
              <span className="skeleton-text text-[#212121]">Αντικαταβολή</span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}
