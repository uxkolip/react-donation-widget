# YouBeHero Add Donation to Cart

A React-based donation widget system that allows customers to add charitable donations to their cart during checkout. This project showcases multiple donation widget implementations with different UX patterns, designed for integration into e-commerce checkout flows.

**WordPress Plugin:** This React widget is part of the [YouBeHero Add Donation to Cart WordPress plugin](https://wordpress.org/plugins/youbehero/), which integrates seamlessly with WooCommerce to enable donation functionality at checkout.

## Overview

This project provides a flexible donation widget solution that enables customers to:
- Select a donation amount (preset amounts or custom slider)
- Choose from a curated list of nonprofit organizations
- Add the donation to their cart alongside their purchase
- See real-time updates to their order total

### WordPress Plugin Integration

This React widget is designed for use with the **[YouBeHero Add Donation to Cart WordPress plugin](https://wordpress.org/plugins/youbehero/)**, which provides:

- **WooCommerce Integration** - Seamless checkout integration with flexible positioning options
- **Multiple Integration Methods** - Gutenberg block, Elementor widget, WP Bakery integration, and shortcodes
- **Admin Dashboard** - Real-time statistics and transaction history
- **Customization** - Full control over styling, appearance, and organization selection
- **Multi-Organization Support** - Support for up to 7 nonprofit organizations
- **Thank You Page Widget** - Post-purchase donation widget and email integration
- **Translation Ready** - Greek and English language support

The WordPress plugin is available for free on the [WordPress Plugin Directory](https://wordpress.org/plugins/youbehero/) and integrates with over 150 verified nonprofit organizations across Greece.

## Features

### Donation Widget Variants

The project includes four different checkout page implementations, each showcasing a different donation widget approach:

1. **Version 2 (Classic)** - `/classic`
   - Classic donation widget with preset amount buttons
   - Traditional checkbox-based enable/disable

2. **Version 3 (Template)** - `/template`
   - Template-based donation widget
   - Inline nonprofit selection with checkbox toggle

3. **Version 5 (Combined)** - `/combined`
   - Combined donation widget with preset amount buttons
   - Badge showing total donation amount
   - Nonprofit selector dropdown

4. **Version 6 (Combined Slider)** - `/combined-slider` (Default)
   - Enhanced slider-based donation widget
   - Visual emoji feedback (🙁 😊 😄 😍)
   - Animated floating emojis on selection
   - Gradient-colored slider track
   - Step markers with visual indicators
   - Badge with heart icon showing donation total

### Core Components

- **DonationWidget** - Base donation widget component
- **CombinedDonationWidget** - Preset button-based donation selector
- **CombinedSliderDonationWidget** - Slider-based donation selector with animations
- **TemplateDonationWidget** - Template-style donation widget
- **NonprofitSelector** - Modal/drawer for selecting nonprofit organizations
- **AmountSelector** - Modal for selecting custom donation amounts
- **CheckoutForm** - Form component for checkout information

### Key Features

- **Nonprofit Selection**: Choose from multiple Greek nonprofit organizations including:
  - ΑΡΣΙΣ (Social support for vulnerable populations)
  - Animal welfare organizations
  - Cultural and community organizations
  - Autism support organizations

- **Amount Selection**: 
  - Preset amounts (0.50€, 1€, 3€)
  - Slider-based selection (0-3€)
  - Custom amount selection via modal

- **Visual Feedback**:
  - Loading states during amount selection
  - Animated emoji reactions
  - Color-coded slider handles
  - Real-time order total updates

- **Responsive Design**: 
  - Mobile-first approach
  - Touch-friendly interactions
  - Adaptive layouts for different screen sizes

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first styling
- **React Router** - Client-side routing
- **Lucide React** - Icon library
- **Radix UI** - Accessible component primitives

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

```bash
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The dev server runs on `http://localhost:5173/` by default. Navigate between different widget versions using the navigation links at the top of the page.

### Building for Production

Create a production build:

```bash
npm run build
```

The production-ready bundle will be created in the `dist/` directory.

## Project Structure

```
src/
├── components/
│   ├── CombinedDonationWidget.tsx      # Preset button widget
│   ├── CombinedSliderDonationWidget.tsx # Slider-based widget
│   ├── TemplateDonationWidget.tsx      # Template widget
│   ├── DonationWidget.tsx              # Base widget
│   ├── NonprofitSelector.tsx           # Nonprofit selection modal
│   ├── AmountSelector.tsx              # Amount selection modal
│   ├── CheckoutForm.tsx                # Checkout form
│   └── ui/                             # Reusable UI components
├── pages/
│   ├── ClassicCheckoutPage.tsx        # Version 2
│   ├── TemplateCheckoutPage.tsx       # Version 3
│   ├── CombinedCheckoutPage.tsx      # Version 5
│   └── CombinedSliderCheckoutPage.tsx # Version 6
├── lib/
│   └── currency.ts                     # Currency formatting utilities
└── App.tsx                             # Main app with routing
```

## Usage

### Basic Integration

```tsx
import CombinedSliderDonationWidget from './components/CombinedSliderDonationWidget';

function CheckoutPage() {
  const handleDonationChange = (amount: number, nonprofit: Nonprofit | null) => {
    // Update cart with donation amount
    console.log(`Donation: ${amount}€ to ${nonprofit?.name}`);
  };

  return (
    <CombinedSliderDonationWidget onDonationChange={handleDonationChange} />
  );
}
```

### Widget Props

All donation widgets accept an `onDonationChange` callback:

```typescript
onDonationChange?: (amount: number, nonprofit: Nonprofit | null) => void
```

## Deployment

The project is configured for GitHub Pages deployment. Changes pushed to `main` trigger the deployment workflow (`.github/workflows/deploy.yml`), which builds the app and publishes `dist/` to the `gh-pages` branch.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Ensure `npm run build` succeeds
5. Submit a pull request

## License

This project is private and proprietary.

## Notes

- The project uses Greek language (Ελληνικά) for UI text
- Currency formatting follows Greek locale (el-GR)
- Default nonprofit is set to ΑΡΣΙΣ
- Donation widget checkbox is disabled by default
