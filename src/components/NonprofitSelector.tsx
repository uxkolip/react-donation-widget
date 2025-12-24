import React, { useEffect, useState } from 'react';
import { X, Search, Check, Heart, Dog, Users, TreePine, Stethoscope } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Nonprofit {
  id: string;
  name: string;
  description: string;
  category: 'animals' | 'humans' | 'environment';
  icon: string;
  logo?: string;
}

interface NonprofitSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (nonprofit: Nonprofit) => void;
  selectedId?: string;
  nonprofits?: Nonprofit[];
  hideDescription?: boolean;
}

const defaultNonprofits: Nonprofit[] = [
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

const categories = [
  {
    id: 'animals',
    label: 'Ζώα',
    image: 'https://images.unsplash.com/photo-1639655147175-737b3f3b9333?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkb2dzJTIwcHVwcGllcyUyMHRvZ2V0aGVyfGVufDF8fHx8MTc2NDI4MDAyMXww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'humans',
    label: 'Άνθρωπος',
    image: 'https://images.unsplash.com/photo-1622632405663-f43782a098b5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHx3b21hbiUyMHBvcnRyYWl0JTIwdm9sdW50ZWVyfGVufDF8fHx8MTc2NDI4MDAyMXww&ixlib=rb-4.1.0&q=80&w=1080'
  },
  {
    id: 'environment',
    label: 'Περιβάλλον',
    image: 'https://images.unsplash.com/photo-1567790484933-44b83527e991?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncmVlbiUyMGZvcmVzdCUyMG5hdHVyZXxlbnwxfHx8fDE3NjQyMDc3OTF8MA&ixlib=rb-4.1.0&q=80&w=1080'
  }
];

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

export default function NonprofitSelector({ isOpen, onClose, onSelect, selectedId, nonprofits = defaultNonprofits, hideDescription = false }: NonprofitSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
      // Reset filters when closing
      setSearchQuery('');
      setSelectedCategory(null);
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const filteredNonprofits = nonprofits.filter((nonprofit) => {
    const matchesSearch = nonprofit.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         nonprofit.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || nonprofit.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Modal - Desktop / Drawer - Mobile */}
      <div className="fixed inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center z-50 pointer-events-none">
        <div 
          className={`bg-white rounded-t-[24px] md:rounded-[16px] max-h-[85vh] md:max-h-[600px] w-full md:max-w-[600px] flex flex-col shadow-2xl transition-transform duration-300 ease-out ${
            isOpen 
              ? 'translate-y-0 md:scale-100 md:opacity-100 pointer-events-auto' 
              : 'translate-y-full md:translate-y-0 md:scale-95 md:opacity-0 pointer-events-none'
          }`}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-[20px] border-b border-[#e0e0e0] shrink-0">
            <h2 className="text-[#212121]" style={{ fontWeight: 'bold', fontSize: '16px' }}>Επιλογή φορέα</h2>
            <button
              onClick={onClose}
              className="p-[8px] hover:bg-[#f5f5f5] rounded-full transition-colors"
              aria-label="Κλείσιμο"
            >
              <X size={24} className="text-[#424242]" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto flex-1">
            <div className="p-[20px] flex flex-col gap-[20px]">

              {/* Nonprofit List */}
              <div className="flex flex-col gap-[12px]">
                {filteredNonprofits.map((nonprofit) => {
                  const isSelected = selectedId === nonprofit.id;
                  const Icon = getIcon(nonprofit.icon);
                  
                  return (
                    <button
                      key={nonprofit.id}
                      onClick={() => {
                        onSelect(nonprofit);
                        onClose();
                      }}
                      className="flex items-center gap-[16px] p-[16px] bg-white border border-[#e0e0e0] rounded-[12px] transition-all hover:shadow-md text-left"
                    >
                      {/* Logo/Icon */}
                      <div className="w-[48px] h-[48px] rounded-full flex items-center justify-center shrink-0 overflow-hidden">
                        {nonprofit.logo ? (
                          <ImageWithFallback
                            src={nonprofit.logo}
                            alt={nonprofit.name}
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <Icon size={24} className="text-[#0957e8]" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="text-[#212121] mb-[4px]">
                          {nonprofit.name}
                        </div>
                        {!hideDescription && (
                          <div className="text-[#757575] text-[14px] truncate">
                            {nonprofit.description}
                          </div>
                        )}
                      </div>

                      {/* Action Icon */}
                      <div className="shrink-0">
                        {isSelected ? (
                          <div className="w-[32px] h-[32px] rounded-full bg-[#4caf50] flex items-center justify-center">
                            <Check size={20} className="text-white" />
                          </div>
                        ) : (
                          <div className="w-[32px] h-[32px] rounded-full border-2 border-[#e0e0e0] flex items-center justify-center hover:border-[#0957e8] transition-colors">
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export type { Nonprofit };
