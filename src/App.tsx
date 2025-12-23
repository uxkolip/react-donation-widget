import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import ClassicCheckoutPage from './pages/ClassicCheckoutPage';
import TemplateCheckoutPage from './pages/TemplateCheckoutPage';
import CombinedCheckoutPage from './pages/CombinedCheckoutPage';
import CombinedSliderCheckoutPage from './pages/CombinedSliderCheckoutPage';
import CombinedSliderCheckoutPageDE from './pages/CombinedSliderCheckoutPageDE';

const navLinkClasses =
  'px-[16px] py-[8px] rounded-[999px] text-[14px] font-medium border transition-all truncate';

export default function App() {
  // Set basename based on deployment
  const basename = window.location.hostname === 'localhost' ? '/' : '/react-donation-widget/';
  
  return (
    <BrowserRouter basename={basename}>
      <div className="min-h-screen bg-[#f5f5f5] py-[40px] px-[16px] md:px-[24px]">
        <div className="max-w-[800px] mx-auto">
          <header className="mb-[24px]">
            
            <nav className="mt-[20px] flex flex-wrap gap-[12px]">
              <NavLink
                to="/classic"
                className={({ isActive }) =>
                  `${navLinkClasses} ${
                    isActive
                      ? 'bg-[#4caf50] border-[#4caf50] text-white'
                      : 'bg-white border-[#e0e0e0] text-[#212121] hover:border-[#4caf50]'
                  }`
                }
              >
                Ver. 2
              </NavLink>
              <NavLink
                to="/template"
                className={({ isActive }) =>
                  `${navLinkClasses} ${
                    isActive
                      ? 'bg-[#4caf50] border-[#4caf50] text-white'
                      : 'bg-white border-[#e0e0e0] text-[#212121] hover:border-[#4caf50]'
                  }`
                }
              >
                Ver. 3
              </NavLink>
              <NavLink
                to="/combined"
                className={({ isActive }) =>
                  `${navLinkClasses} ${
                    isActive
                      ? 'bg-[#4caf50] border-[#4caf50] text-white'
                      : 'bg-white border-[#e0e0e0] text-[#212121] hover:border-[#4caf50]'
                  }`
                }
              >
                Ver. 5
              </NavLink>
              <NavLink
                to="/combined-slider"
                className={({ isActive }) =>
                  `${navLinkClasses} ${
                    isActive
                      ? 'bg-[#4caf50] border-[#4caf50] text-white'
                      : 'bg-white border-[#e0e0e0] text-[#212121] hover:border-[#4caf50]'
                  }`
                }
              >
                Ver. 6
              </NavLink>
              <NavLink
                to="/combined-slider-de"
                className={({ isActive }) =>
                  `${navLinkClasses} ${
                    isActive
                      ? 'bg-[#4caf50] border-[#4caf50] text-white'
                      : 'bg-white border-[#e0e0e0] text-[#212121] hover:border-[#4caf50]'
                  }`
                }
              >
                Ver. 6 DE
              </NavLink>
            </nav>
          </header>

          <main className="bg-white/0">
            <Routes>
              {/* Start app on Version 6 */}
              <Route path="/" element={<Navigate to="/combined-slider" replace />} />
              <Route path="/classic" element={<ClassicCheckoutPage />} />
              <Route path="/template" element={<TemplateCheckoutPage />} />
              <Route path="/combined" element={<CombinedCheckoutPage />} />
              <Route path="/combined-slider" element={<CombinedSliderCheckoutPage />} />
              <Route path="/combined-slider-de" element={<CombinedSliderCheckoutPageDE />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
