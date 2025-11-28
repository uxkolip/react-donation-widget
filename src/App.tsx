import React from 'react';
import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import DropdownCheckoutPage from './pages/DropdownCheckoutPage';
import ClassicCheckoutPage from './pages/ClassicCheckoutPage';
import TemplateCheckoutPage from './pages/TemplateCheckoutPage';

const navLinkClasses =
  'px-[16px] py-[8px] rounded-[999px] text-[14px] font-medium border transition-all';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#f5f5f5] py-[40px] px-[16px] md:px-[24px]">
        <div className="max-w-[800px] mx-auto">
          <header className="mb-[24px]">
            
            <nav className="mt-[20px] flex flex-wrap gap-[12px]">
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `${navLinkClasses} ${
                    isActive
                      ? 'bg-[#4caf50] border-[#4caf50] text-white'
                      : 'bg-white border-[#e0e0e0] text-[#212121] hover:border-[#4caf50]'
                  }`
                }
              >
                Dropdown
              </NavLink>
              <NavLink
                to="/classic"
                className={({ isActive }) =>
                  `${navLinkClasses} ${
                    isActive
                      ? 'bg-[#0957e8] border-[#0957e8] text-white'
                      : 'bg-white border-[#e0e0e0] text-[#212121] hover:border-[#0957e8]'
                  }`
                }
              >
                Drawer
              </NavLink>
              <NavLink
                to="/template"
                className={({ isActive }) =>
                  `${navLinkClasses} ${
                    isActive
                      ? 'bg-[#212121] border-[#212121] text-white'
                      : 'bg-white border-[#e0e0e0] text-[#212121] hover:border-[#212121]'
                  }`
                }
              >
                Roundup
              </NavLink>
            </nav>
          </header>

          <main className="bg-white/0">
            <Routes>
              <Route path="/" element={<DropdownCheckoutPage />} />
              <Route path="/classic" element={<ClassicCheckoutPage />} />
              <Route path="/template" element={<TemplateCheckoutPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </div>
    </BrowserRouter>
  );
}
