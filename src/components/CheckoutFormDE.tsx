export default function CheckoutFormDE() {
  return (
    <div className="bg-white rounded-[8px] p-[24px] border border-[#e0e0e0]">
      <h2 className="text-[#212121] mb-[24px]">Bestelldaten</h2>
      
      <form className="flex flex-col gap-[16px]">
        {/* Contact Information */}
        <div>
          <label htmlFor="name" className="block text-[#424242] mb-[8px]">
            Vollständiger Name
          </label>
          <input
            type="text"
            id="name"
            className="w-full px-[12px] py-[10px] border border-[#bdbdbd] rounded-[4px] focus:outline-none focus:border-[#0957e8]"
            placeholder="Geben Sie Ihren Namen ein"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-[#424242] mb-[8px]">
            E-Mail
          </label>
          <input
            type="email"
            id="email"
            className="w-full px-[12px] py-[10px] border border-[#bdbdbd] rounded-[4px] focus:outline-none focus:border-[#0957e8]"
            placeholder="beispiel@email.com"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-[#424242] mb-[8px]">
            Telefon
          </label>
          <input
            type="tel"
            id="phone"
            className="w-full px-[12px] py-[10px] border border-[#bdbdbd] rounded-[4px] focus:outline-none focus:border-[#0957e8]"
            placeholder="+49 123 456789"
          />
        </div>

        {/* Shipping Address */}
        <div className="mt-[8px]">
          <h3 className="text-[#212121] mb-[16px]">Lieferadresse</h3>
          
          <div className="flex flex-col gap-[16px]">
            <div>
              <label htmlFor="address" className="block text-[#424242] mb-[8px]">
                Adresse
              </label>
              <input
                type="text"
                id="address"
                className="w-full px-[12px] py-[10px] border border-[#bdbdbd] rounded-[4px] focus:outline-none focus:border-[#0957e8]"
                placeholder="Straße und Hausnummer"
              />
            </div>

            <div className="grid grid-cols-2 gap-[16px]">
              <div>
                <label htmlFor="city" className="block text-[#424242] mb-[8px]">
                  Stadt
                </label>
                <input
                  type="text"
                  id="city"
                  className="w-full px-[12px] py-[10px] border border-[#bdbdbd] rounded-[4px] focus:outline-none focus:border-[#0957e8]"
                  placeholder="Berlin"
                />
              </div>

              <div>
                <label htmlFor="postal" className="block text-[#424242] mb-[8px]">
                  PLZ
                </label>
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

        {/* Payment Method */}
        <div className="mt-[8px]">
          <h3 className="text-[#212121] mb-[16px]">Zahlungsmethode</h3>
          
          <div className="flex flex-col gap-[12px]">
            <label className="flex items-center gap-[12px] p-[12px] border border-[#bdbdbd] rounded-[4px] cursor-pointer hover:border-[#0957e8]">
              <input type="radio" name="payment" defaultChecked className="w-[16px] h-[16px]" />
              <span className="text-[#212121]">Kredit-/Debitkarte</span>
            </label>
            
            <label className="flex items-center gap-[12px] p-[12px] border border-[#bdbdbd] rounded-[4px] cursor-pointer hover:border-[#0957e8]">
              <input type="radio" name="payment" className="w-[16px] h-[16px]" />
              <span className="text-[#212121]">Nachnahme</span>
            </label>
          </div>
        </div>
      </form>
    </div>
  );
}

