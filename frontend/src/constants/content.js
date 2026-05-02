export const content = {
  navLinks: [
    { title: "Home", path: "/" },
    { title: "Docs", path: "/docs" }, // Changed from Dashboard to Docs
    { title: "About", path: "/about" },
    { title: "Contact", path: "/contact" },
  ],
  footerLinks: [
    { title: "Privacy Policy", path: "/privacy-policy" },
    { title: "Terms & Conditions", path: "/terms-and-conditions" },
  ],
};

export const areaOptions = [
  { code: "AREA001", address: "Central District" },
  { code: "AREA002", address: "North Sector" },
  { code: "AREA003", address: "South Sector" },
  { code: "AREA004", address: "West Zone" },
  { code: "AREA005", address: "East Zone" },
];

// Helper to get Label from Code
export const getRegionLabel = (code) => areaOptions[code] || "Unassigned Zone";