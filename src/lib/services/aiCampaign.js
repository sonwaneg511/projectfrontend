const DUMMY_HEADLINES = [
  'Best Deals Near You',
  'Top Quality Products',
  'Shop Now & Save Big',
  'Trusted by Thousands',
  'Fast & Free Delivery',
  'Exclusive Offers Today',
  'Your Perfect Solution',
  'Premium Quality Guaranteed',
  'Unbeatable Prices Here',
  'Get Started Today',
  'Award-Winning Service',
  'Limited Time Offer',
  'Customer First Always',
  'Discover New Arrivals',
  'Experience the Difference',
  'Shop Smart Save More',
  'Quality You Can Trust',
];

const DUMMY_DESCRIPTIONS = [
  'Discover our wide range of high-quality products at competitive prices. Shop now and enjoy free delivery on all orders.',
  'We offer unbeatable deals on top brands. Browse our collection today and find exactly what you need at the best price.',
  'Experience premium quality and exceptional service. Our team is here to help you every step of the way to success.',
  'Looking for the best value? We have you covered with exclusive offers and discounts available daily for our members.',
  'Join thousands of satisfied customers who trust us for their needs. Order today and see the difference we make.',
  'Get the best products at the lowest prices. Our commitment to quality ensures your complete satisfaction always.',
  'Fast delivery, easy returns, and outstanding customer support. Shop with confidence and save more with us today.',
  'Your satisfaction is our priority. Explore our vast selection and enjoy exclusive member-only discounts every day.',
  'Find everything you need in one place. Premium products, unbeatable prices, and stellar service guaranteed always.',
  'Transform your experience with our innovative solutions. Trusted by professionals worldwide for over a decade.',
  'Upgrade your lifestyle with our curated collection. Competitive pricing meets exceptional quality every single day.',
  'Explore our latest arrivals and seasonal offers. Quality craftsmanship and value you can count on year-round.',
  "Don't miss out on limited-time offers. Shop now for the best deals and exclusive savings available just for you.",
  'We bring you the finest selection at prices that fit your budget. Customer satisfaction is our top guarantee.',
  'Experience the future of shopping with us. Top-rated products, fast shipping, and hassle-free returns always.',
  'Your go-to destination for quality and value. Thousands of products, one trusted source for all your needs.',
];

export const getAICampaignSuggestions = () =>
  new Promise((resolve) =>
    setTimeout(
      () =>
        resolve({
          headlines: DUMMY_HEADLINES,
          descriptions: DUMMY_DESCRIPTIONS,
        }),
      1500
    )
  );
