# Design Guidelines for Watch Store Landing Page

## Design Approach
**Reference-Based Approach**: Drawing inspiration from premium e-commerce sites like luxury watch retailers (Rolex, Omega) combined with modern Shopify stores for clean product showcases and smooth user experience.

## Core Design Elements

### Typography
- **Primary Font**: ChadCN (Google Fonts) for modern, sophisticated look
- **Hierarchy**: 
  - Hero headline: text-4xl to text-6xl, font-bold
  - Section headings: text-2xl to text-3xl, font-bold
  - Product names: text-xl, font-semibold
  - Body text: text-base, font-normal
  - CTA buttons: text-lg, font-semibold

### Layout System
**Tailwind Spacing Units**: Consistent use of 4, 8, 12, 16, 20, 24 (p-4, p-8, m-12, py-20, etc.)
- Section padding: py-16 to py-24 on desktop, py-12 on mobile
- Component spacing: gap-8 between cards, gap-4 within components
- Container max-width: max-w-7xl for content sections

### Component Library

**Navigation Bar**
- Sticky header (sticky top-0) with backdrop blur
- Logo on left, navigation links centered/right
- Links: Home, About, Best Sellers, New Arrivals, Contact
- Floating cart icon in top-right with item counter badge
- Responsive hamburger menu for mobile

**Hero Section**
- Full-screen height (h-screen or min-h-screen)
- Full-width background image/video of luxury watches
- Centered content with:
  - Main headline: "Timeless Watches for Every Moment"
  - Subtitle describing brand essence
  - "Shop Now" CTA button with blurred background (backdrop-blur-md bg-white/20)
- Framer Motion: Fade-in animation (opacity 0 to 1, duration 1s)

**About Section**
- Two-column layout on desktop (grid-cols-1 md:grid-cols-2)
- Left: Brand story text with max-w-prose
- Right: High-quality watch detail image or brand imagery
- Scroll-triggered animation: Slide up and fade in

**Best Sellers Section**
- Section heading with "View All" link
- Product grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
- Product cards with:
  - Square product image with hover zoom effect
  - Watch name and brief description
  - Price prominently displayed
  - "Add to Cart" button
- Hover animations: Scale transform (scale-105), shadow elevation

**New Arrivals Section**
- Similar grid layout to Best Sellers
- "NEW" badge on product cards (top-right corner)
- Product image, name, price
- "View All" button at section bottom
- Scroll-triggered stagger animation for cards

**Customer Testimonials Section**
- 3-column layout on desktop (grid-cols-1 md:grid-cols-3)
- Testimonial cards with:
  - Customer photo (circular, small)
  - Quote text in italics
  - Customer name and location
  - 5-star rating display
- Subtle card elevation (shadow-md)

**Newsletter Signup**
- Centered section with compelling headline
- Single-line form: Email input + Subscribe button (flex layout)
- Benefit text: "Get updates about new collections and discounts"
- Minimal, clean design

**Contact Section**
- Two-column split (grid-cols-1 md:grid-cols-2)
- Left: Contact form with fields for Name, Email, Message
- Right: Store details (address, phone, hours), embedded map placeholder
- Form field animations: Focus state transitions, error states
- Submit button with loading state

**Footer**
- Multi-column layout (grid-cols-1 md:grid-cols-4)
- Columns: Company Info, Quick Links, Customer Service, Social Media
- Links: Privacy Policy, Terms of Service, Return Policy
- Social icons: Instagram, Facebook, Twitter (consistent sizing)
- Copyright notice at bottom center

**Floating Elements**
- Back to Top button: Fixed bottom-right (bottom-8 right-8), appears after scrolling 500px
- Cart icon: Fixed top-right in navigation with item counter badge

### Animations
**Framer Motion Implementation**:
- Hero: Fade-in on load (initial opacity: 0, animate opacity: 1)
- Scroll-triggered sections: Slide up + fade (translateY: 50px to 0, opacity: 0 to 1)
- Product cards: Stagger animation when entering viewport (staggerChildren: 0.1)
- Hover states: Scale transforms, shadow changes
- Form fields: Focus animations, smooth error state transitions
- Smooth scroll behavior for navigation links

### Images
**Hero Section**: Full-width, full-height luxury watch photograph - ideally a close-up of premium timepiece with dramatic lighting, showcasing craftsmanship and detail

**About Section**: High-resolution image of watchmaking process or brand heritage imagery

**Product Images**: Clean white background product photos, square aspect ratio (1:1), high resolution for zoom functionality

**Testimonials**: Circular customer photos (avatars)

**Contact Section**: Map image or illustration of store location

### Interactive Elements
- Smooth scroll navigation (behavior: smooth)
- Product card hover effects (scale, shadow)
- CTA button states with transitions
- Form validation with real-time feedback
- Cart counter updates with animation
- Responsive navigation menu with slide-in animation

### Responsive Breakpoints
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Single column on mobile, multi-column grids on tablet/desktop
- Hamburger menu below md breakpoint
- Adjusted typography scale for mobile

This design creates a luxurious, modern e-commerce experience with smooth animations, clear product showcases, and seamless user interactions throughout the journey.