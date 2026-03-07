/**
 * ЗБМИС — Сл. весник бр. 135, 4.7.2025
 * Класификација строго по Член 4, Член 7, Член 8
 */

import { sectors } from "@/data/sectors";

export type EntityClassification = "ESSENTIAL" | "IMPORTANT" | "SME" | "NOT_COVERED";
export type EntitySize = "MICRO" | "SMALL" | "MEDIUM" | "LARGE";

export interface ClassificationInput {
  // Сектор и големина
  sectorId:             string;
  size:                 EntitySize;
  employees:            number;
  annualTurnoverM:      number;
  annualBalanceSheetM:  number;
  // Автоматски суштински — независно од големина (Член 8(1) т.2,4,5,6,7,8)
  isPublicSector?:            boolean; // Член 8(1) т.4 + Член 4(1)
  isQualifiedTrustProvider?:  boolean; // Член 8(1) т.2
  isDnsProvider?:             boolean; // Член 8(1) т.2
  isTldRegistry?:             boolean; // Член 8(1) т.2
  isTrustServiceProvider?:    boolean; // Член 8(1) т.5 = Член 4(3) т.2
  isCriticalInfraOwner?:      boolean; // Член 8(1) т.6
  isUniqueSectorProvider?:    boolean; // Член 4(3) т.5
  isPublicElectronicCommsOp?: boolean; // Член 8(1) т.3 — средни+големи
}

export interface ClassificationResult {
  classification:   EntityClassification;
  isAutoEssential:  boolean;  // true = суштински без разлика на големина
  track:            "BMIS" | "SME" | "NONE";
  sectorName:       string;
  legalBasis:       string;
  reason:           string;
  obligations:      string[];
  sanctions:        string;
  deadlines:        string;
}

// ── Прагови за големина (Закон за трговски друштва) ──────────────────────────
export function isLarge(i: ClassificationInput): boolean {
  return i.size === "LARGE" || i.employees > 250 || i.annualTurnoverM > 50 || i.annualBalanceSheetM > 43;
}
export function isMediumOrLarge(i: ClassificationInput): boolean {
  return isLarge(i) || i.size === "MEDIUM" || i.employees >= 50 || i.annualTurnoverM >= 10 || i.annualBalanceSheetM >= 10;
}

// ── Дали субјектот е автоматски суштински БЕЗ разлика на големина ─────────────
export function isAutoEssentialEntity(i: ClassificationInput): { yes: boolean; basis: string; name: string } {

  if (i.isPublicSector)
    return { yes: true, basis: "Член 8(1) т.4 и Член 4(1)", name: "Институција на јавниот сектор" };

  if (i.isQualifiedTrustProvider)
    return { yes: true, basis: "Член 8(1) т.2", name: "Давател на квалификувани доверливи услуги" };

  if (i.isTldRegistry)
    return { yes: true, basis: "Член 8(1) т.2", name: "Регистар на врвни домени (.mk / .мкд)" };

  if (i.isDnsProvider)
    return { yes: true, basis: "Член 8(1) т.2", name: "Давател на ДНС услуги" };

  if (i.isTrustServiceProvider)
    return { yes: true, basis: "Член 8(1) т.5 — Член 4(3) т.2", name: "Давател на доверливи услуги" };

  if (i.isCriticalInfraOwner)
    return { yes: true, basis: "Член 8(1) т.6", name: "Сопственик/оператор на критична инфраструктура" };

  if (i.isUniqueSectorProvider)
    return { yes: true, basis: "Член 4(3) т.5", name: "Единствен давател на суштинска услуга во РСМ" };

  return { yes: false, basis: "", name: "" };
}

export function classifyEntity(input: ClassificationInput): ClassificationResult {

  // ── ПРИОРИТЕТ 1: Автоматски суштински (независно од големина) ───────────────
  const auto = isAutoEssentialEntity(input);
  if (auto.yes) {
    return {
      classification: "ESSENTIAL",
      isAutoEssential: true,
      track: "BMIS",
      sectorName: auto.name,
      legalBasis: auto.basis,
      reason: `Вашата организација е класифицирана како СУШТИНСКИ СУБЈЕКТ автоматски и НЕЗАВИСНО ОД НЕЈЗИНАТА ГОЛЕМИНА согласно ${auto.basis} од ЗБМИС. Оваа категорија не бара проверка на број на вработени, приход или биланс.`,
      obligations: essentialObligations(input.isPublicSector),
      sanctions: input.isPublicSector
        ? "Прекршочни казни и мерки на надзор од Министерството за дигитална трансформација"
        : "До 2% од годишниот вкупен приход на светско ниво ИЛИ до €10.000.000 (која е поголема). Можна забрана за вршење дејност до 2 години.",
      deadlines: input.isPublicSector
        ? "Рок за усогласување: 31 декември 2027 година"
        : "Рок за усогласување: 31 декември 2026 година",
    };
  }

  // ── ПРИОРИТЕТ 2: Телеком — среден + голем = суштински (Член 8(1) т.3) ────────
  if (input.isPublicElectronicCommsOp && isMediumOrLarge(input)) {
    return {
      classification: "ESSENTIAL",
      isAutoEssential: false,
      track: "BMIS",
      sectorName: "Оператор/давател на јавни електронски комуникациски мрежи/услуги",
      legalBasis: "Член 8(1) т.3 — средни и големи телеком субјекти",
      reason: "Операторите/давателите на јавни електронски комуникациски мрежи и услуги кои се СРЕДНИ И ГОЛЕМИ субјекти автоматски се СУШТИНСКИ СУБЈЕКТИ согласно Член 8(1) т.3 од ЗБМИС.",
      obligations: essentialObligations(false),
      sanctions: "До 2% од годишниот вкупен приход на светско ниво ИЛИ до €10.000.000.",
      deadlines: "Рок за усогласување: 31 декември 2026 година",
    };
  }

  // ── ПРИОРИТЕТ 3: Сектори по Член 4(2) — само средни и големи ────────────────
  const sector = sectors.find(s =>
    s.id === input.sectorId || s.subsectors?.some(sub => sub.id === input.sectorId)
  );

  if (!sector || input.sectorId === "OTHER") {
    return {
      classification: isMediumOrLarge(input) ? "NOT_COVERED" : "SME",
      isAutoEssential: false,
      track: "SME",
      sectorName: "Друг сектор",
      legalBasis: "Надвор од Член 4(2) на ЗБМИС",
      reason: isMediumOrLarge(input)
        ? "Вашата организација работи во сектор кој не е директно опфатен со Член 4(2) на ЗБМИС. Не постои законска обврска за усогласување, но се препорачуваат основни сајбер-безбедносни мерки."
        : "Вашата организација е ММСП во сектор кој не е опфатен со ЗБМИС. Препорачуваме ENISA ММСП проценката.",
      obligations: ["Доброволна усогласеност — нема законска обврска", "Следење на ENISA препораки", "Доброволна ММСП самопроценка"],
      sanctions: "Нема задолжителни санкции",
      deadlines: "Нема законски рокови",
    };
  }

  // Голем субјект во опфатена област → СУШТИНСКИ (Член 8(1) т.1)
  if (isLarge(input)) {
    return {
      classification: "ESSENTIAL",
      isAutoEssential: false,
      track: "BMIS",
      sectorName: sector.name.mk,
      legalBasis: "Член 8(1) т.1 — голем субјект во опфатена област",
      reason: `Вашата организација е ГОЛЕМ СУБЈЕКТ во областа "${sector.name.mk}" опфатена со Член 4(2) на ЗБМИС. Сите ГОЛЕМИ субјекти во опфатените области автоматски се СУШТИНСКИ СУБЈЕКТИ (Член 8(1) т.1). Голем = над 250 вработени ИЛИ над €50М приход ИЛИ над €43М биланс.`,
      obligations: essentialObligations(false),
      sanctions: "До 2% од годишниот вкупен приход на светско ниво ИЛИ до €10.000.000. Можна забрана за вршење дејност до 2 години.",
      deadlines: "Рок за усогласување: 31 декември 2026 година",
    };
  }

  // Среден субјект во опфатена област → ВАЖЕН (Член 8(2) т.1)
  if (isMediumOrLarge(input)) {
    return {
      classification: "IMPORTANT",
      isAutoEssential: false,
      track: "BMIS",
      sectorName: sector.name.mk,
      legalBasis: "Член 8(2) т.1 — среден субјект во опфатена област",
      reason: `Вашата организација е СРЕДЕН СУБЈЕКТ во областа "${sector.name.mk}" опфатена со Член 4(2) на ЗБМИС. Средните субјекти во опфатените области кои не се суштински се ВАЖНИ СУБЈЕКТИ (Член 8(2) т.1). Среден = 50–249 вработени ИЛИ €10–50М приход.`,
      obligations: [
        "Задолжителна регистрација во регистарот на важни субјекти кај MKD-CIRT",
        "Воспоставување пропорционални мерки за безбедност на МИС",
        "Управување со ризици — пропорционален пристап",
        "Пријавување на значајни инциденти до MKD-CIRT",
        "Реактивен надзор (само по инцидент или жалба)",
        "Рок за усогласување: 31 декември 2026 година",
      ],
      sanctions: "До 1.4% од годишниот вкупен приход на светско ниво ИЛИ до €7.000.000.",
      deadlines: "Рок за усогласување: 31 декември 2026 година",
    };
  }

  // Мал/микро субјект → ММСП (не е задолжително опфатен)
  return {
    classification: "SME",
    isAutoEssential: false,
    track: "SME",
    sectorName: sector.name.mk,
    legalBasis: "Мал/микро субјект — Член 4(2) не се применува",
    reason: `Вашата организација работи во областа "${sector.name.mk}" но е МАЛА или МИКРО организација. Член 4(2) на ЗБМИС се применува само на СРЕДНИ и ГОЛЕМИ субјекти. Не постои задолжителна обврска, но се препорачува ENISA ММСП проценката.`,
    obligations: ["Доброволна усогласеност — нема законска обврска", "Препорачана ENISA ММСП проценка", "Доброволна регистрација кај MKD-CIRT"],
    sanctions: "Нема задолжителни санкции",
    deadlines: "Нема законски рокови",
  };
}

function essentialObligations(isPublic: boolean = false): string[] {
  return [
    "Задолжителна регистрација во регистарот на суштински субјекти кај MKD-CIRT",
    ...(isPublic ? [] : ["Именување на офицер за сајбер безбедност (задолжително — Член 8(6))"]),
    "Воспоставување сеопфатни мерки за безбедност на МИС (Член 29)",
    "Управување со ризици, безбедносни политики и контроли",
    "Пријавување на значајни инциденти: почетно во 24 часа, финално во 72 часа до MKD-CIRT",
    "Активна сајбер заштита и континуиран мониторинг",
    "Безбедност на синџирот на снабдување",
    ...(isPublic ? ["Пријавување до Министерство за дигитална трансформација (МДТ)"] : []),
  ];
}
