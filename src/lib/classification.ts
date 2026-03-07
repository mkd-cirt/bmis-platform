/**
 * Classification logic based on:
 * ЗАКОН ЗА БЕЗБЕДНОСТ НА МРЕЖНИ И ИНФОРМАЦИСКИ СИСТЕМИ
 * Службен весник на РСМ, бр. 135 од 4.7.2025 година
 * Член 4, Член 7, Член 8
 */

import { sectors } from "@/data/sectors";

export type EntityClassification =
  | "ESSENTIAL"
  | "IMPORTANT"
  | "PUBLIC_SECTOR"
  | "SPECIAL"
  | "SME"
  | "NOT_COVERED";

export type EntitySize = "MICRO" | "SMALL" | "MEDIUM" | "LARGE";

export interface ClassificationInput {
  sectorId:                    string;
  size:                        EntitySize;
  employees:                   number;
  annualTurnoverM:             number;
  annualBalanceSheetM:         number;
  isPublicSector?:             boolean;
  isQualifiedTrustProvider?:   boolean;
  isDnsProvider?:              boolean;
  isTldRegistry?:              boolean;
  isPublicElectronicCommsOp?:  boolean;
  isCriticalInfraOwner?:       boolean;
  isUniqueSectorProvider?:     boolean;
}

export interface ClassificationResult {
  classification: EntityClassification;
  track:          "BMIS" | "SME" | "NONE";
  annexBase:      string | null;
  sectorName:     string;
  legalBasis:     string;
  reason:         string;
  obligations:    string[];
  sanctions:      string;
  deadlines:      string;
}

function isLargeEntity(i: ClassificationInput): boolean {
  if (i.size === "LARGE") return true;
  if (i.employees > 250) return true;
  if (i.annualTurnoverM > 50) return true;
  if (i.annualBalanceSheetM > 43) return true;
  return false;
}

function isMediumOrLarge(i: ClassificationInput): boolean {
  if (isLargeEntity(i)) return true;
  if (i.size === "MEDIUM") return true;
  if (i.employees >= 50) return true;
  if (i.annualTurnoverM >= 10) return true;
  if (i.annualBalanceSheetM >= 10) return true;
  return false;
}

function buildEssential(sectorName: string, legalBasis: string, reason: string): ClassificationResult {
  return {
    classification: "ESSENTIAL",
    track: "BMIS",
    annexBase: "SPECIAL",
    sectorName,
    legalBasis,
    reason,
    obligations: [
      "Задолжителна регистрација во регистарот на суштински субјекти кај MKD-CIRT",
      "Именување на офицер за сајбер безбедност (задолжително)",
      "Воспоставување сеопфатни мерки за безбедност на МИС (Член 29)",
      "Пријавување на значајни инциденти: почетно во 24 часа, финално во 72 часа",
      "Активна сајбер заштита и мониторинг",
      "Рок за усогласување: 31 декември 2026 година",
    ],
    sanctions: "До 2% од годишниот вкупен приход на светско ниво ИЛИ до €10.000.000",
    deadlines: "Рок за усогласување: 31 декември 2026 година",
  };
}

export function classifyEntity(input: ClassificationInput): ClassificationResult {

  // 1. ЈАВЕН СЕКТОР — Член 4(1), Член 8(1) т.4
  if (input.isPublicSector) {
    return {
      classification: "ESSENTIAL",
      track: "BMIS",
      annexBase: "PUBLIC",
      sectorName: "Јавен сектор",
      legalBasis: "Член 4(1) и Член 8(1) т.4 од ЗБМИС",
      reason: "Институциите на јавниот сектор (Собранието, Владата, министерствата, општини, судови) автоматски се СУШТИНСКИ СУБЈЕКТИ согласно Член 8(1) т.4, без оглед на нивната големина.",
      obligations: [
        "Задолжителна регистрација во регистарот на суштински субјекти",
        "Именување на офицер за сајбер безбедност",
        "Воспоставување мерки за безбедност на МИС (Член 29)",
        "Пријавување на значајни инциденти до МДТ во рок 24/72 часа",
        "Рок за усогласување: 31 декември 2027 година",
      ],
      sanctions: "Прекршочни казни и мерки на надзор од Министерството",
      deadlines: "Рок за усогласување: 31 декември 2027 година",
    };
  }

  // 2. КВАЛИФИКУВАНИ ДОВЕРЛИВИ УСЛУГИ — Член 8(1) т.2
  if (input.isQualifiedTrustProvider) {
    return buildEssential(
      "Давател на квалификувани доверливи услуги",
      "Член 8(1) т.2 — независно од големина",
      "Давателите на квалификувани доверливи услуги се СУШТИНСКИ СУБЈЕКТИ НЕЗАВИСНО ОД НИВНАТА ГОЛЕМИНА согласно Член 8(1) т.2 од ЗБМИС."
    );
  }

  // 3. TLD РЕГИСТАР (.mk/.мкд) — Член 8(1) т.2
  if (input.isTldRegistry) {
    return buildEssential(
      "Регистар на врвни домени (.mk / .мкд)",
      "Член 8(1) т.2 — независно од големина",
      "Субјектот кој го води Единствениот регистар на врвни домени (.mk и .мкд) е СУШТИНСКИ СУБЈЕКТ НЕЗАВИСНО ОД НЕГОВАТА ГОЛЕМИНА согласно Член 8(1) т.2 од ЗБМИС."
    );
  }

  // 4. DNS ПРОВАЈДЕР — Член 8(1) т.2
  if (input.isDnsProvider) {
    return buildEssential(
      "Давател на ДНС услуги",
      "Член 8(1) т.2 — независно од големина",
      "Давателите на ДНС услуги се СУШТИНСКИ СУБЈЕКТИ НЕЗАВИСНО ОД НИВНАТА ГОЛЕМИНА согласно Член 8(1) т.2 од ЗБМИС."
    );
  }

  // 5. КРИТИЧНА ИНФРАСТРУКТУРА — Член 8(1) т.6
  if (input.isCriticalInfraOwner) {
    return buildEssential(
      "Сопственик/оператор на критична инфраструктура",
      "Член 8(1) т.6 — независно од големина",
      "Субјектите утврдени со закон како сопственици/оператори на критична инфраструктура се СУШТИНСКИ СУБЈЕКТИ согласно Член 8(1) т.6 од ЗБМИС, независно од нивната големина."
    );
  }

  // 6. ЕДИНСТВЕН ДАВАТЕЛ — Член 4(3) т.5
  if (input.isUniqueSectorProvider) {
    return buildEssential(
      "Единствен давател на суштинска услуга во РСМ",
      "Член 4(3) т.5 и Член 8(1) т.5 — независно од големина",
      "Субјектот кој е единствен давател на услуга во Републиката суштинска за општествени или економски активности е СУШТИНСКИ СУБЈЕКТ независно од неговата големина, согласно Член 4(3) т.5 од ЗБМИС."
    );
  }

  // 7. SECTOR-BASED — Член 4(2) + Член 8
  const sector = sectors.find(s =>
    s.id === input.sectorId ||
    s.subsectors.some(sub => sub.id === input.sectorId)
  );

  if (!sector || input.sectorId === "OTHER") {
    return {
      classification: isMediumOrLarge(input) ? "NOT_COVERED" : "SME",
      track: "SME",
      annexBase: null,
      sectorName: "Друг сектор",
      legalBasis: "Надвор од Член 4(2) на ЗБМИС",
      reason: isMediumOrLarge(input)
        ? "Вашата организација работи во сектор кој не е опфатен со Член 4(2) на ЗБМИС. Не е задолжително усогласување, но се препорачуваат основни сајбер-безбедносни мерки."
        : "Вашата организација е ММСП во сектор кој не е опфатен со ЗБМИС. Препорачуваме ENISA ММСП проценката.",
      obligations: [
        "Доброволна усогласеност — нема законска обврска",
        "Следење на ENISA препораки за ММСП",
        "Препорачана ММСП самопроценка",
      ],
      sanctions: "Нема задолжителни санкции",
      deadlines: "Нема законски рокови",
    };
  }

  const isLarge  = isLargeEntity(input);
  const isMedLrg = isMediumOrLarge(input);

  // Телеком оператор — среден е исто суштински (Член 8(1) т.3)
  if (input.isPublicElectronicCommsOp && isMedLrg) {
    return buildEssential(
      "Оператор/давател на јавни електронски комуникациски мрежи/услуги",
      "Член 8(1) т.3 — средни и големи телеком субјекти",
      "Операторите/давателите на јавни електронски комуникациски мрежи и услуги кои се СРЕДНИ И ГОЛЕМИ субјекти се СУШТИНСКИ СУБЈЕКТИ согласно Член 8(1) т.3 од ЗБМИС."
    );
  }

  // ГОЛЕМ субјект во опфатена област — СУШТИНСКИ (Член 8(1) т.1)
  if (isLarge) {
    return {
      classification: "ESSENTIAL",
      track: "BMIS",
      annexBase: "I",
      sectorName: sector.name.mk,
      legalBasis: "Член 8(1) т.1 — голем субјект во опфатена област",
      reason: `Вашата организација е ГОЛЕМ СУБЈЕКТ кој работи во областа "${sector.name.mk}" опфатена со Член 4(2) на ЗБМИС. Согласно Член 8(1) т.1, сите ГОЛЕМИ субјекти во опфатените области автоматски се СУШТИНСКИ СУБЈЕКТИ. Голем субјект = над 250 вработени ИЛИ над €50М приход ИЛИ над €43М биланс.`,
      obligations: [
        "Задолжителна регистрација во регистарот на суштински субјекти кај MKD-CIRT",
        "Именување на офицер за сајбер безбедност (задолжително)",
        "Воспоставување сеопфатни мерки за безбедност на МИС (Член 29 од ЗБМИС)",
        "Управување со ризици и безбедносни политики",
        "Пријавување на значајни инциденти: почетно во 24 часа, финално во 72 часа",
        "Безбедност на синџирот на снабдување",
        "Рок за усогласување: 31 декември 2026 година",
      ],
      sanctions: "До 2% од годишниот вкупен приход на светско ниво ИЛИ до €10.000.000 (која е поголема). Можна забрана за вршење дејност до 2 години.",
      deadlines: "Рок за усогласување: 31 декември 2026 година",
    };
  }

  // СРЕДЕН субјект во опфатена област — ВАЖЕН (Член 8(2) т.1)
  if (isMedLrg) {
    return {
      classification: "IMPORTANT",
      track: "BMIS",
      annexBase: "II",
      sectorName: sector.name.mk,
      legalBasis: "Член 8(2) т.1 — среден субјект во опфатена област",
      reason: `Вашата организација е СРЕДЕН СУБЈЕКТ кој работи во областа "${sector.name.mk}" опфатена со Член 4(2) на ЗБМИС. Согласно Член 8(2) т.1, средните субјекти во опфатените области кои не се суштински се ВАЖНИ СУБЈЕКТИ. Среден субјект = 50-250 вработени ИЛИ €10-50М приход.`,
      obligations: [
        "Задолжителна регистрација во регистарот на важни субјекти кај MKD-CIRT",
        "Воспоставување пропорционални мерки за безбедност на МИС",
        "Управување со ризици — пропорционален пристап",
        "Пријавување на значајни инциденти до MKD-CIRT",
        "Реактивен надзор (само по инцидент или жалба)",
        "Рок за усогласување: 31 декември 2026 година",
      ],
      sanctions: "До 1.4% од годишниот вкупен приход на светско ниво ИЛИ до €7.000.000 (која е поголема).",
      deadlines: "Рок за усогласување: 31 декември 2026 година",
    };
  }

  // МАЛО/МИКРО во опфатена област — не е задолжително опфатен
  return {
    classification: "SME",
    track: "SME",
    annexBase: null,
    sectorName: sector.name.mk,
    legalBasis: "Надвор од задолжителниот опфат — мал/микро субјект (Член 4(2))",
    reason: `Вашата организација работи во областа "${sector.name.mk}" но е МАЛА или МИКРО организација. Член 4(2) на ЗБМИС се применува само на СРЕДНИ и ГОЛЕМИ субјекти. Препорачуваме ENISA ММСП проценката.`,
    obligations: [
      "Доброволна усогласеност — нема законска обврска",
      "Препорачана ENISA ММСП проценка",
      "Следење на основни сајбер-безбедносни практики",
      "Доброволна регистрација кај MKD-CIRT",
    ],
    sanctions: "Нема задолжителни санкции",
    deadlines: "Нема законски рокови",
  };
}
