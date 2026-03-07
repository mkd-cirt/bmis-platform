/**
 * ЗБМИС — Сл. весник на РСМ бр. 135, 4.7.2025
 *
 * Член 8(1) Суштински субјекти:
 *  т.1 → Големи субјекти во Член 4(2)                     [ЗАВИСИ: само големи]
 *  т.2 → Квалификувани доверливи, .mk/.мкд, DNS            [НЕЗАВИСНО]
 *  т.3 → Телеком оператори средни+големи                   [ЗАВИСИ: средни+]
 *  т.4 → Јавни институции Член 4(1)                        [НЕЗАВИСНО]
 *  т.5 → Субјекти Член 4(3) т.2 и т.3                      [НЕЗАВИСНО]
 *  т.6 → Критична инфраструктура                           [НЕЗАВИСНО]
 *  т.7 → Утврдени со национално законодавство              [НЕЗАВИСНО]
 *  т.8 → Утврдени преку проценка на ризик                  [НЕЗАВИСНО]
 *
 * Член 8(2) Важни субјекти:
 *  т.1 → Субјекти од листата со висока критичност кои не се суштински
 *  т.2 → Утврдени преку проценка на ризик
 */

import { sectors } from "@/data/sectors";

export type EntityClassification = "ESSENTIAL" | "IMPORTANT" | "SME" | "NOT_COVERED";
export type EntitySize = "MICRO" | "SMALL" | "MEDIUM" | "LARGE";

export interface ClassificationInput {
  sectorId:            string;
  size:                EntitySize;
  employees:           number;
  annualTurnoverM:     number;
  annualBalanceSheetM: number;
  // Член 4(1) + Член 8(1) т.4 — НЕЗАВИСНО
  isPublicSector?:            boolean;
  // Член 8(1) т.2 — НЕЗАВИСНО
  isQualifiedTrustProvider?:  boolean;
  // Член 8(1) т.2 + Член 4(3) т.3 — НЕЗАВИСНО
  isTldRegistry?:             boolean;
  // Член 8(1) т.2 + Член 4(3) т.4 — НЕЗАВИСНО
  isDnsProvider?:             boolean;
  // Член 8(1) т.5 + Член 4(3) т.2 — НЕЗАВИСНО
  isTrustServiceProvider?:    boolean;
  // Член 8(1) т.3 + Член 4(3) т.1 — ЗАВИСИ: средни+големи
  isPublicElectronicCommsOp?: boolean;
  // Член 8(1) т.6 + Член 4(3) т.9 — НЕЗАВИСНО
  isCriticalInfraOwner?:      boolean;
  // Член 4(3) т.5 — НЕЗАВИСНО
  isUniqueSectorProvider?:    boolean;
  // Член 4(3) т.6 — НЕЗАВИСНО
  isPublicSafetyImpact?:      boolean;
  // Член 4(3) т.7 — НЕЗАВИСНО
  isSystemicRisk?:            boolean;
  // Член 4(3) т.8 — НЕЗАВИСНО
  isCriticalForSector?:       boolean;
  // Член 4(3) т.10 — НЕЗАВИСНО
  isDomainRegistrar?:         boolean;
}

export interface ClassificationResult {
  classification:  EntityClassification;
  isAutoEssential: boolean;
  track:           "BMIS" | "SME" | "NONE";
  sectorName:      string;
  legalBasis:      string;
  reason:          string;
  obligations:     string[];
  sanctions:       string;
  deadlines:       string;
}

export function isLargeEntity(i: ClassificationInput): boolean {
  if (i.size === "LARGE") return true;

  // За објективна класификација според финансиски показатели користиме
  // „најмалку два од три“ критериуми (вработени, приход, биланс).
  const largeSignals = [
    i.employees >= 250,
    i.annualTurnoverM > 50,
    i.annualBalanceSheetM > 43,
  ];

  return largeSignals.filter(Boolean).length >= 2;
}

export function isMediumOrLargeEntity(i: ClassificationInput): boolean {
  if (isLargeEntity(i) || i.size === "MEDIUM") return true;

  const mediumSignals = [
    i.employees >= 50,
    i.annualTurnoverM >= 10,
    i.annualBalanceSheetM >= 10,
  ];

  return mediumSignals.filter(Boolean).length >= 2;
}

/**
 * Проверува дали субјектот е СУШТИНСКИ независно од големина.
 * Само точките кои немаат услов за големина.
 */
export function isAutoEssentialEntity(i: ClassificationInput): {
  yes: boolean; basis: string; name: string;
} {
  if (i.isPublicSector)
    return { yes: true, basis: "Член 8(1) т.4", name: "Институција на јавниот сектор" };
  if (i.isQualifiedTrustProvider)
    return { yes: true, basis: "Член 8(1) т.2", name: "Давател на квалификувани доверливи услуги" };
  if (i.isTldRegistry)
    return { yes: true, basis: "Член 8(1) т.2 + Член 4(3) т.3", name: "Регистар на врвни домени (.mk / .мкд)" };
  if (i.isDnsProvider)
    return { yes: true, basis: "Член 8(1) т.2 + Член 4(3) т.4", name: "Давател на ДНС услуги" };
  if (i.isTrustServiceProvider)
    return { yes: true, basis: "Член 8(1) т.5 + Член 4(3) т.2", name: "Давател на доверливи услуги" };
  if (i.isCriticalInfraOwner)
    return { yes: true, basis: "Член 8(1) т.6 + Член 4(3) т.9", name: "Сопственик/оператор на критична инфраструктура" };
  if (i.isUniqueSectorProvider)
    return { yes: true, basis: "Член 4(3) т.5", name: "Единствен давател на суштинска услуга во РСМ" };
  if (i.isPublicSafetyImpact)
    return { yes: true, basis: "Член 4(3) т.6", name: "Значително влијание врз јавната безбедност/здравје" };
  if (i.isSystemicRisk)
    return { yes: true, basis: "Член 4(3) т.7", name: "Субјект кој предизвикува значителни системски ризици" };
  if (i.isCriticalForSector)
    return { yes: true, basis: "Член 4(3) т.8", name: "Критичен субјект за одредена област или тип услуга" };
  if (i.isDomainRegistrar)
    return { yes: true, basis: "Член 4(3) т.10", name: "Давател на услуги за регистрација на имиња на домени" };
  return { yes: false, basis: "", name: "" };
}

export function classifyEntity(input: ClassificationInput): ClassificationResult {
  // 1. Автоматски суштински — независно од големина
  const auto = isAutoEssentialEntity(input);
  if (auto.yes) {
    return {
      classification: "ESSENTIAL", isAutoEssential: true, track: "BMIS",
      sectorName: auto.name, legalBasis: auto.basis,
      reason: `Вашата организација е СУШТИНСКИ СУБЈЕКТ автоматски и НЕЗАВИСНО ОД НЕЈЗИНАТА ГОЛЕМИНА согласно ${auto.basis} од ЗБМИС.`,
      obligations: essentialObl(!!input.isPublicSector),
      sanctions: input.isPublicSector
        ? "Прекршочни казни и мерки на надзор од Министерството"
        : "До 2% од годишниот приход или до €10.000.000 (поголемата). Можна забрана до 2 години.",
      deadlines: input.isPublicSector ? "31 декември 2027" : "31 декември 2026",
    };
  }

  // 2. Телеком — Член 8(1) т.3: средни+големи = суштински
  if (input.isPublicElectronicCommsOp) {
    if (isMediumOrLargeEntity(input)) {
      return {
        classification: "ESSENTIAL", isAutoEssential: false, track: "BMIS",
        sectorName: "Оператор на јавни електронски комуникациски мрежи/услуги",
        legalBasis: "Член 8(1) т.3 + Член 4(3) т.1",
        reason: "Телеком оператори кои се СРЕДНИ ИЛИ ГОЛЕМИ субјекти се СУШТИНСКИ согласно Член 8(1) т.3.",
        obligations: essentialObl(false),
        sanctions: "До 2% од годишниот приход или до €10.000.000.",
        deadlines: "31 декември 2026",
      };
    }
    // Мал/микро телеком — важен
    return {
      classification: "IMPORTANT", isAutoEssential: false, track: "BMIS",
      sectorName: "Оператор на јавни електронски комуникациски мрежи/услуги (мал/микро)",
      legalBasis: "Член 4(3) т.1 — мал/микро субјект",
      reason: "Телеком оператори кои се МАЛИ или МИКРО не ги исполнуваат условите за суштински (Член 8(1) т.3 бара средни/големи), но се во опфатот на законот.",
      obligations: importantObl(),
      sanctions: "До 1.4% од годишниот приход или до €7.000.000.",
      deadlines: "31 декември 2026",
    };
  }

  // 3. Сектори по Член 4(2)
  const sector = sectors.find((s: any) =>
    s.id === input.sectorId || s.subsectors?.some((sub: any) => sub.id === input.sectorId)
  );

  if (!sector || input.sectorId === "OTHER") {
    const isBiggerEntity = isMediumOrLargeEntity(input);
    return {
      classification: isBiggerEntity ? "NOT_COVERED" : "SME",
      isAutoEssential: false, track: isBiggerEntity ? "NONE" : "SME", sectorName: "Друг сектор",
      legalBasis: "Надвор од Член 4(2) на ЗБМИС",
      reason: "Секторот не е опфатен со Член 4(2) на ЗБМИС. Нема задолжителна обврска.",
      obligations: [
        "Доброволна усогласеност и самопроценка",
        "Следење на ENISA и MKD-CIRT препораки",
        ...(isBiggerEntity ? ["Препорачана внатрешна проценка на ризик поради деловна критичност"] : []),
      ],
      sanctions: "Нема задолжителни санкции", deadlines: "Нема законски рокови",
    };
  }

  if (isLargeEntity(input)) {
    return {
      classification: "ESSENTIAL", isAutoEssential: false, track: "BMIS",
      sectorName: sector.name.mk, legalBasis: "Член 8(1) т.1",
      reason: `ГОЛЕМ субјект во "${sector.name.mk}" (Член 4(2)). Сите големи субјекти во опфатените области се СУШТИНСКИ (Член 8(1) т.1).`,
      obligations: essentialObl(false),
      sanctions: "До 2% од годишниот приход или до €10.000.000. Можна забрана до 2 години.",
      deadlines: "31 декември 2026",
    };
  }

  if (isMediumOrLargeEntity(input)) {
    return {
      classification: "IMPORTANT", isAutoEssential: false, track: "BMIS",
      sectorName: sector.name.mk, legalBasis: "Член 8(2) т.1",
      reason: `СРЕДЕН субјект во "${sector.name.mk}" (Член 4(2)). Средните субјекти во опфатените области кои не се суштински се ВАЖНИ (Член 8(2) т.1).`,
      obligations: importantObl(),
      sanctions: "До 1.4% од годишниот приход или до €7.000.000.",
      deadlines: "31 декември 2026",
    };
  }

  return {
    classification: "SME", isAutoEssential: false, track: "SME",
    sectorName: sector.name.mk, legalBasis: "Член 4(2) — мал/микро субјект",
    reason: `МАЛА или МИКРО организација во "${sector.name.mk}". Член 4(2) важи само за средни и големи. Нема задолжителна обврска.`,
    obligations: ["Доброволна усогласеност", "Препорачана ENISA ММСП проценка"],
    sanctions: "Нема задолжителни санкции", deadlines: "Нема законски рокови",
  };
}

function essentialObl(isPublic: boolean): string[] {
  return [
    "Задолжителна регистрација кај MKD-CIRT",
    ...(isPublic ? [] : ["Именување офицер за сајбер безбедност — Член 8(6)"]),
    "Сеопфатни мерки за безбедност на МИС — Член 29",
    "Управување со ризици и безбедносни политики",
    "Пријавување инциденти: 24 часа почетно, 72 часа финално",
    "Активна сајбер заштита и мониторинг",
    "Безбедност на синџирот на снабдување",
  ];
}

function importantObl(): string[] {
  return [
    "Задолжителна регистрација кај MKD-CIRT",
    "Пропорционални мерки за безбедност на МИС",
    "Управување со ризици — пропорционален пристап",
    "Пријавување на значајни инциденти до MKD-CIRT",
    "Реактивен надзор — само по инцидент или жалба",
  ];
}
