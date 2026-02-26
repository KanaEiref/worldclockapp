export interface City {
  name: string;
  state: string;
  country: string;
  timezone: string;
}

// Map timezone identifiers to human-readable country names for 2-part timezones
const TZ_COUNTRY_MAP: Record<string, string> = {
  "Europe/London": "United Kingdom",
  "Europe/Paris": "France",
  "Europe/Berlin": "Germany",
  "Europe/Madrid": "Spain",
  "Europe/Rome": "Italy",
  "Europe/Amsterdam": "Netherlands",
  "Europe/Brussels": "Belgium",
  "Europe/Vienna": "Austria",
  "Europe/Zurich": "Switzerland",
  "Europe/Stockholm": "Sweden",
  "Europe/Oslo": "Norway",
  "Europe/Helsinki": "Finland",
  "Europe/Copenhagen": "Denmark",
  "Europe/Dublin": "Ireland",
  "Europe/Lisbon": "Portugal",
  "Europe/Athens": "Greece",
  "Europe/Warsaw": "Poland",
  "Europe/Prague": "Czech Republic",
  "Europe/Budapest": "Hungary",
  "Europe/Bucharest": "Romania",
  "Europe/Sofia": "Bulgaria",
  "Europe/Belgrade": "Serbia",
  "Europe/Zagreb": "Croatia",
  "Europe/Istanbul": "Turkey",
  "Europe/Moscow": "Russia",
  "Europe/Kyiv": "Ukraine",
  "Europe/Minsk": "Belarus",
  "Asia/Tokyo": "Japan",
  "Asia/Shanghai": "China",
  "Asia/Hong_Kong": "Hong Kong",
  "Asia/Seoul": "South Korea",
  "Asia/Singapore": "Singapore",
  "Asia/Bangkok": "Thailand",
  "Asia/Kuala_Lumpur": "Malaysia",
  "Asia/Jakarta": "Indonesia",
  "Asia/Manila": "Philippines",
  "Asia/Ho_Chi_Minh": "Vietnam",
  "Asia/Kolkata": "India",
  "Asia/Dubai": "UAE",
  "Asia/Riyadh": "Saudi Arabia",
  "Asia/Jerusalem": "Israel",
  "Asia/Tehran": "Iran",
  "Asia/Karachi": "Pakistan",
  "Asia/Dhaka": "Bangladesh",
  "Asia/Colombo": "Sri Lanka",
  "Asia/Kathmandu": "Nepal",
  "Asia/Yangon": "Myanmar",
  "Asia/Phnom_Penh": "Cambodia",
  "Asia/Taipei": "Taiwan",
  "Asia/Macau": "Macau",
  "Australia/Sydney": "Australia",
  "Australia/Melbourne": "Australia",
  "Australia/Brisbane": "Australia",
  "Australia/Perth": "Australia",
  "Australia/Adelaide": "Australia",
  "Pacific/Auckland": "New Zealand",
  "Pacific/Honolulu": "USA",
  "Pacific/Fiji": "Fiji",
  "Pacific/Guam": "Guam",
  "America/New_York": "USA",
  "America/Los_Angeles": "USA",
  "America/Chicago": "USA",
  "America/Denver": "USA",
  "America/Phoenix": "USA",
  "America/Anchorage": "USA",
  "America/Toronto": "Canada",
  "America/Vancouver": "Canada",
  "America/Mexico_City": "Mexico",
  "America/Sao_Paulo": "Brazil",
  "America/Argentina/Buenos_Aires": "Argentina",
  "America/Santiago": "Chile",
  "America/Bogota": "Colombia",
  "America/Lima": "Peru",
  "Africa/Cairo": "Egypt",
  "Africa/Johannesburg": "South Africa",
  "Africa/Lagos": "Nigeria",
  "Africa/Nairobi": "Kenya",
  "Africa/Casablanca": "Morocco",
};

function formatPart(part: string): string {
  return part.replace(/_/g, " ");
}

function getCitiesFromTimezones(): City[] {
  if (typeof Intl === "undefined" || !("supportedValuesOf" in Intl)) {
    return [];
  }
  try {
    const timezones = (Intl as unknown as { supportedValuesOf(key: string): string[] }).supportedValuesOf("timeZone");
    return timezones.map((tz) => {
      const parts = tz.split("/");
      const cityPart = formatPart(parts[parts.length - 1]);
      let country: string;

      if (TZ_COUNTRY_MAP[tz]) {
        country = TZ_COUNTRY_MAP[tz];
      } else if (parts.length >= 3) {
        country = formatPart(parts[1]);
      } else {
        country = formatPart(parts[0]);
      }

      return {
        name: cityPart,
        state: "",
        country,
        timezone: tz,
      };
    });
  } catch {
    return [];
  }
}

// Fallback list if Intl.supportedValuesOf is unavailable (older browsers/Node)
const FALLBACK_CITIES: City[] = [
  { name: "New York", state: "", country: "USA", timezone: "America/New_York" },
  { name: "London", state: "", country: "UK", timezone: "Europe/London" },
  { name: "Tokyo", state: "", country: "Japan", timezone: "Asia/Tokyo" },
  { name: "Paris", state: "", country: "France", timezone: "Europe/Paris" },
  { name: "Sydney", state: "", country: "Australia", timezone: "Australia/Sydney" },
  { name: "Dubai", state: "", country: "UAE", timezone: "Asia/Dubai" },
  { name: "Mumbai", state: "", country: "India", timezone: "Asia/Kolkata" },
  { name: "Singapore", state: "", country: "Singapore", timezone: "Asia/Singapore" },
  { name: "São Paulo", state: "", country: "Brazil", timezone: "America/Sao_Paulo" },
  { name: "Cairo", state: "", country: "Egypt", timezone: "Africa/Cairo" },
];

// Additional cities that share timezones with IANA entries (no separate timezone)
const ADDITIONAL_CITIES: City[] = [
  { name: "Hartford", state: "Connecticut", country: "USA", timezone: "America/New_York" },
  { name: "Boston", state: "Massachusetts", country: "USA", timezone: "America/New_York" },
  { name: "Philadelphia", state: "Pennsylvania", country: "USA", timezone: "America/New_York" },
  { name: "Atlanta", state: "Georgia", country: "USA", timezone: "America/New_York" },
  { name: "Miami", state: "Florida", country: "USA", timezone: "America/New_York" },
  { name: "Baltimore", state: "Maryland", country: "USA", timezone: "America/New_York" },
  { name: "Pittsburgh", state: "Pennsylvania", country: "USA", timezone: "America/New_York" },
  { name: "Houston", state: "Texas", country: "USA", timezone: "America/Chicago" },
  { name: "Dallas", state: "Texas", country: "USA", timezone: "America/Chicago" },
  { name: "San Antonio", state: "Texas", country: "USA", timezone: "America/Chicago" },
  { name: "Austin", state: "Texas", country: "USA", timezone: "America/Chicago" },
  { name: "Minneapolis", state: "Minnesota", country: "USA", timezone: "America/Chicago" },
  { name: "San Francisco", state: "California", country: "USA", timezone: "America/Los_Angeles" },
  { name: "San Diego", state: "California", country: "USA", timezone: "America/Los_Angeles" },
  { name: "Seattle", state: "Washington", country: "USA", timezone: "America/Los_Angeles" },
  { name: "Portland", state: "Oregon", country: "USA", timezone: "America/Los_Angeles" },
  { name: "Montreal", state: "Quebec", country: "Canada", timezone: "America/Toronto" },
  { name: "Ottawa", state: "Ontario", country: "Canada", timezone: "America/Toronto" },
  { name: "Calgary", state: "Alberta", country: "Canada", timezone: "America/Edmonton" },
  { name: "Edmonton", state: "Alberta", country: "Canada", timezone: "America/Edmonton" },
  { name: "Birmingham", state: "England", country: "UK", timezone: "Europe/London" },
  { name: "Manchester", state: "England", country: "UK", timezone: "Europe/London" },
  { name: "Edinburgh", state: "Scotland", country: "UK", timezone: "Europe/London" },
  { name: "Munich", state: "Bavaria", country: "Germany", timezone: "Europe/Berlin" },
  { name: "Barcelona", state: "Catalonia", country: "Spain", timezone: "Europe/Madrid" },
  { name: "Milan", state: "Lombardy", country: "Italy", timezone: "Europe/Rome" },
  { name: "Rio de Janeiro", state: "Rio de Janeiro", country: "Brazil", timezone: "America/Sao_Paulo" },
  { name: "Brasília", state: "Distrito Federal", country: "Brazil", timezone: "America/Sao_Paulo" },
  { name: "Delhi", state: "Delhi", country: "India", timezone: "Asia/Kolkata" },
  { name: "Bangalore", state: "Karnataka", country: "India", timezone: "Asia/Kolkata" },
  { name: "Chennai", state: "Tamil Nadu", country: "India", timezone: "Asia/Kolkata" },
  { name: "Beijing", state: "Beijing", country: "China", timezone: "Asia/Shanghai" },
  { name: "Guangzhou", state: "Guangdong", country: "China", timezone: "Asia/Shanghai" },
  { name: "Shenzhen", state: "Guangdong", country: "China", timezone: "Asia/Shanghai" },
  { name: "Osaka", state: "Osaka", country: "Japan", timezone: "Asia/Tokyo" },
  { name: "Yokohama", state: "Kanagawa", country: "Japan", timezone: "Asia/Tokyo" },
  { name: "Nagoya", state: "Aichi", country: "Japan", timezone: "Asia/Tokyo" },
  { name: "Sapporo", state: "Hokkaido", country: "Japan", timezone: "Asia/Tokyo" },
  { name: "Busan", state: "Busan", country: "South Korea", timezone: "Asia/Seoul" },
  { name: "Cape Town", state: "Western Cape", country: "South Africa", timezone: "Africa/Johannesburg" },
];

// Build comprehensive city list: IANA timezones + additional cities
const tzCities = getCitiesFromTimezones();
const baseCities = [...(tzCities.length > 0 ? tzCities : FALLBACK_CITIES)];
// Deduplicate: add additional cities only if not already present (same name + timezone)
const seen = new Set(baseCities.map((c) => `${c.name}|${c.timezone}`));
for (const city of ADDITIONAL_CITIES) {
  const key = `${city.name}|${city.timezone}`;
  if (!seen.has(key)) {
    seen.add(key);
    baseCities.push(city);
  }
}
export const CITIES: City[] = baseCities;
