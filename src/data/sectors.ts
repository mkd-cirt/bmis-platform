export interface Subsector {
  id: string;
  name: { mk: string; en: string; sq: string };
}

export interface Sector {
  id: string;
  annex: "I" | "II";
  name: { mk: string; en: string; sq: string };
  subsectors: Subsector[];
}

export const sectors: Sector[] = [
  // ── ANNEX I — ESSENTIAL ────────────────────────────────────────
  {
    id: "energy",
    annex: "I",
    name: { mk: "Енергетика", en: "Energy", sq: "Energjia" },
    subsectors: [
      { id:"energy-electricity", name:{mk:"Електрична енергија",en:"Electricity",sq:"Energjia elektrike"} },
      { id:"energy-oil",         name:{mk:"Нафта и нафтени деривати",en:"Oil",sq:"Nafta"} },
      { id:"energy-gas",         name:{mk:"Природен гас",en:"Natural gas",sq:"Gazi natyror"} },
      { id:"energy-heat",        name:{mk:"Производство/дистрибуција на топлина",en:"District heating/cooling",sq:"Ngrohja komunale"} },
      { id:"energy-hydrogen",    name:{mk:"Водород",en:"Hydrogen",sq:"Hidrogjeni"} },
    ]
  },
  {
    id: "transport",
    annex: "I",
    name: { mk: "Транспорт", en: "Transport", sq: "Transporti" },
    subsectors: [
      { id:"transport-air",    name:{mk:"Воздушен транспорт",en:"Air transport",sq:"Transporti ajror"} },
      { id:"transport-rail",   name:{mk:"Железнички транспорт",en:"Rail transport",sq:"Transporti hekurudhor"} },
      { id:"transport-water",  name:{mk:"Воден транспорт",en:"Water transport",sq:"Transporti ujor"} },
      { id:"transport-road",   name:{mk:"Патен транспорт",en:"Road transport",sq:"Transporti rrugor"} },
    ]
  },
  {
    id: "banking",
    annex: "I",
    name: { mk: "Банкарство", en: "Banking", sq: "Bankingu" },
    subsectors: [
      { id:"banking-banks",   name:{mk:"Кредитни институции / Банки",en:"Credit institutions",sq:"Institucionet e kreditit"} },
    ]
  },
  {
    id: "financial",
    annex: "I",
    name: { mk: "Финансиски пазарни инфраструктури", en: "Financial market infrastructures", sq: "Infrastrukturat e tregut financiar" },
    subsectors: [
      { id:"financial-trading",    name:{mk:"Места за тргување",en:"Trading venues",sq:"Vendet e tregtimit"} },
      { id:"financial-ccp",        name:{mk:"Централни договорни страни",en:"Central counterparties",sq:"Palët qendrore"} },
    ]
  },
  {
    id: "health",
    annex: "I",
    name: { mk: "Здравство", en: "Health", sq: "Shëndetësia" },
    subsectors: [
      { id:"health-providers",  name:{mk:"Давателите на здравствени услуги",en:"Healthcare providers",sq:"Ofruesit e shëndetësisë"} },
      { id:"health-labs",       name:{mk:"Лаборатории за референтни тестови",en:"Reference laboratories",sq:"Laboratorët referues"} },
      { id:"health-pharma",     name:{mk:"Фармацевтска индустрија",en:"Pharmaceutical companies",sq:"Kompanitë farmaceutike"} },
      { id:"health-devices",    name:{mk:"Производители на медицинска опрема",en:"Medical device manufacturers",sq:"Prodhuesit e pajisjeve mjekësore"} },
    ]
  },
  {
    id: "water",
    annex: "I",
    name: { mk: "Водоснабдување", en: "Drinking water", sq: "Ujësjellësi" },
    subsectors: [
      { id:"water-supply", name:{mk:"Снабдување со вода за пиење",en:"Drinking water supply",sq:"Furnizimi me ujë të pijshëm"} },
    ]
  },
  {
    id: "wastewater",
    annex: "I",
    name: { mk: "Отпадни води", en: "Wastewater", sq: "Ujërat e ndotura" },
    subsectors: [
      { id:"wastewater-treatment", name:{mk:"Управување со отпадни води",en:"Wastewater management",sq:"Menaxhimi i ujërave të ndotura"} },
    ]
  },
  {
    id: "digital",
    annex: "I",
    name: { mk: "Дигитална инфраструктура", en: "Digital infrastructure", sq: "Infrastruktura dixhitale" },
    subsectors: [
      { id:"digital-isp",       name:{mk:"Интернет провајдери (ISP)",en:"Internet Exchange Points / ISPs",sq:"Ofruesit e internetit"} },
      { id:"digital-dns",       name:{mk:"DNS провајдери",en:"DNS service providers",sq:"Ofruesit e DNS"} },
      { id:"digital-tld",       name:{mk:"Регистри за TLD домени",en:"TLD name registries",sq:"Regjistrat TLD"} },
      { id:"digital-cloud",     name:{mk:"Облак провајдери",en:"Cloud computing service providers",sq:"Ofruesit e cloud"} },
      { id:"digital-datacenter",name:{mk:"Даta центри",en:"Data centre service providers",sq:"Ofruesit e qendrave të të dhënave"} },
      { id:"digital-cdn",       name:{mk:"CDN мрежи",en:"Content delivery networks",sq:"Rrjetet CDN"} },
      { id:"digital-trust",     name:{mk:"Давателите на доверливи услуги",en:"Trust service providers",sq:"Ofruesit e shërbimeve të besuara"} },
      { id:"digital-telecom",   name:{mk:"Телекомуникациски мрежи",en:"Electronic communications networks",sq:"Rrjetet e komunikimit elektronik"} },
    ]
  },
  {
    id: "ict-services",
    annex: "I",
    name: { mk: "ИКТ услуги за управување (B2B)", en: "ICT service management (B2B)", sq: "Menaxhimi i shërbimeve TIK (B2B)" },
    subsectors: [
      { id:"ict-msp",   name:{mk:"Давателите на управувани услуги (MSP)",en:"Managed service providers",sq:"Ofruesit e shërbimeve të menaxhuara"} },
      { id:"ict-mssp",  name:{mk:"Давателите на управувани безбедносни услуги (MSSP)",en:"Managed security service providers",sq:"Ofruesit e sigurisë së menaxhuar"} },
    ]
  },
  {
    id: "government",
    annex: "I",
    name: { mk: "Јавна администрација", en: "Public administration", sq: "Administrata publike" },
    subsectors: [
      { id:"gov-central", name:{mk:"Централна влада",en:"Central government entities",sq:"Entitetet qeveritare qendrore"} },
      { id:"gov-regional",name:{mk:"Регионална / Локална самоуправа",en:"Regional/local government",sq:"Qeverisja rajonale/lokale"} },
    ]
  },
  {
    id: "space",
    annex: "I",
    name: { mk: "Вселенска индустрија", en: "Space", sq: "Hapësira" },
    subsectors: [
      { id:"space-operators", name:{mk:"Оператори на вселенска инфраструктура",en:"Space infrastructure operators",sq:"Operatorët e infrastrukturës hapësinore"} },
    ]
  },
  // ── ANNEX II — IMPORTANT ───────────────────────────────────────
  {
    id: "postal",
    annex: "II",
    name: { mk: "Поштенски и курирски услуги", en: "Postal and courier services", sq: "Shërbimet postare dhe të korrierëve" },
    subsectors: [
      { id:"postal-services", name:{mk:"Поштенски оператори",en:"Postal operators",sq:"Operatorët postarë"} },
    ]
  },
  {
    id: "waste",
    annex: "II",
    name: { mk: "Управување со отпад", en: "Waste management", sq: "Menaxhimi i mbetjeve" },
    subsectors: [
      { id:"waste-management", name:{mk:"Оператори за управување со отпад",en:"Waste management operators",sq:"Operatorët e menaxhimit të mbetjeve"} },
    ]
  },
  {
    id: "chemicals",
    annex: "II",
    name: { mk: "Производство, производство и дистрибуција на хемиски производи", en: "Manufacture, production and distribution of chemicals", sq: "Prodhimi i kimikateve" },
    subsectors: [
      { id:"chemicals-mfg", name:{mk:"Производители на хемикалии",en:"Chemical manufacturers",sq:"Prodhuesit e kimikateve"} },
    ]
  },
  {
    id: "food",
    annex: "II",
    name: { mk: "Производство, преработка и дистрибуција на храна", en: "Production, processing and distribution of food", sq: "Prodhimi i ushqimit" },
    subsectors: [
      { id:"food-production", name:{mk:"Производители и дистрибутери на храна",en:"Food producers and distributors",sq:"Prodhuesit dhe shpërndarësit e ushqimit"} },
    ]
  },
  {
    id: "manufacturing",
    annex: "II",
    name: { mk: "Производство", en: "Manufacturing", sq: "Prodhimi" },
    subsectors: [
      { id:"mfg-medical",  name:{mk:"Медицински уреди",en:"Medical devices",sq:"Pajisjet mjekësore"} },
      { id:"mfg-computer", name:{mk:"Компјутери и електроника",en:"Computer and electronic products",sq:"Kompjuterët dhe elektronika"} },
      { id:"mfg-machinery",name:{mk:"Машини и опрема",en:"Machinery and equipment",sq:"Makineritë dhe pajisjet"} },
      { id:"mfg-vehicles", name:{mk:"Возила",en:"Motor vehicles",sq:"Automjetet"} },
    ]
  },
  {
    id: "digital-providers",
    annex: "II",
    name: { mk: "Дигитални провајдери", en: "Digital providers", sq: "Ofruesit dixhitalë" },
    subsectors: [
      { id:"dp-marketplace", name:{mk:"Онлајн пазари",en:"Online marketplaces",sq:"Tregjet online"} },
      { id:"dp-search",      name:{mk:"Онлајн пребарувачи",en:"Online search engines",sq:"Motorët e kërkimit"} },
      { id:"dp-social",      name:{mk:"Социјални медиуми",en:"Social networking platforms",sq:"Platformat e mediave sociale"} },
    ]
  },
  {
    id: "research",
    annex: "II",
    name: { mk: "Истражување", en: "Research", sq: "Hulumtimi" },
    subsectors: [
      { id:"research-orgs", name:{mk:"Истражувачки организации",en:"Research organisations",sq:"Organizatat hulumtuese"} },
    ]
  },
];
