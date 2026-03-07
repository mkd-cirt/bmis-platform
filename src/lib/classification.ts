import { sectors } from "@/data/sectors";

export type EntityClassification = "ESSENTIAL" | "IMPORTANT" | "SME" | "NOT_COVERED";

export interface ClassificationInput {
  sectorId: string;
  size: "MICRO" | "SMALL" | "MEDIUM" | "LARGE";
  employees: number;
  annualTurnoverM: number;
  annualBalanceSheetM: number;
}

export interface ClassificationResult {
  classification: EntityClassification;
  track: "BMIS" | "SME" | "NONE";
  reason: string;
  reasonEn: string;
  obligations: string[];
  sectorName: string;
  annex: "I" | "II" | null;
}

export function classifyEntity(input: ClassificationInput): ClassificationResult {
  const sector = sectors.find(s =>
    s.id === input.sectorId ||
    s.subsectors.some(sub => sub.id === input.sectorId)
  );

  if (!sector || input.sectorId === "OTHER") {
    const isMediumOrLarger = input.size === "MEDIUM" || input.size === "LARGE" ||
      input.employees >= 50 || input.annualTurnoverM >= 10;
    return {
      classification: isMediumOrLarger ? "NOT_COVERED" : "SME",
      track: "SME",
      annex: null,
      sectorName: "Друг сектор",
      reason: isMediumOrLarger
        ? "Вашата организација не е директно опфатена со ЗБМИС/NIS2 врз основа на секторот. Сепак, се препорачува проценка на основните сајбер-безбедносни мерки."
        : "Вашата организација спаѓа во категоријата ММСП. Препорачуваме употреба на поедноставената ММСП проценка базирана на ENISA препораки.",
      reasonEn: "Your organization is not directly covered by NIS2/ZBMIS based on sector.",
      obligations: [
        "Доброволна проценка на основни безбедносни мерки",
        "Следење на ENISA препораки за ММСП",
        "Разгледување на ISO 27001 стандардот",
      ],
    };
  }

  const isLarge  = input.size === "LARGE"  || input.employees >= 250 || input.annualTurnoverM >= 50 || input.annualBalanceSheetM >= 43;
  const isMedium = input.size === "MEDIUM" || input.employees >= 50  || input.annualTurnoverM >= 10;

  if (sector.annex === "I") {
    if (isLarge || isMedium) {
      return {
        classification: "ESSENTIAL",
        track: "BMIS",
        annex: "I",
        sectorName: sector.name.mk,
        reason: `Вашата организација е класифицирана како СУШТИНСКИ СУБЈЕКТ — работи во секторот "${sector.name.mk}" (Анекс I) и ги исполнува прaговите за средна/голема организација. Законот за БМИС/NIS2 применува строги барања.`,
        reasonEn: `Your organization is classified as an ESSENTIAL ENTITY operating in ${sector.name.en} (Annex I).`,
        obligations: [
          "Задолжителна регистрација во регистарот на субјекти кај MKD-CIRT",
          "Имплементација на сите 12 BMIS безбедносни домени",
          "Пријавување на значајни инциденти до MKD-CIRT во рок од 24/72 часа",
          "Редовни безбедносни проценки и ревизии",
          "Одговорност на раководството за усогласеност",
          "Можни санкции до 10.000.000 EUR или 2% од годишниот промет",
        ],
      };
    }
  }

  if (sector.annex === "II") {
    if (isLarge || isMedium) {
      return {
        classification: "IMPORTANT",
        track: "BMIS",
        annex: "II",
        sectorName: sector.name.mk,
        reason: `Вашата организација е класифицирана како ВАЖЕН СУБЈЕКТ — работи во секторот "${sector.name.mk}" (Анекс II) и ги исполнува прaговите за средна/голема организација. Применуваат пропорционални барања.`,
        reasonEn: `Your organization is classified as an IMPORTANT ENTITY operating in ${sector.name.en} (Annex II).`,
        obligations: [
          "Задолжителна регистрација во регистарот на субјекти кај MKD-CIRT",
          "Имплементација на пропорционални безбедносни мерки",
          "Пријавување на значајни инциденти до MKD-CIRT",
          "Реактивна надзорна рамка (надзор само по инцидент)",
          "Можни санкции до 7.000.000 EUR или 1.4% од годишниот промет",
        ],
      };
    }
  }

  return {
    classification: "SME",
    track: "SME",
    annex: sector.annex,
    sectorName: sector.name.mk,
    reason: `Вашата организација работи во секторот "${sector.name.mk}" но не ги исполнува прaговите за средна/голема организација. Не е директно обврзана со ЗБМИС, но се препорачува употреба на ММСП проценката.`,
    reasonEn: "Your organization does not meet the size thresholds for mandatory NIS2 compliance.",
    obligations: [
      "Доброволна усогласеност со NIS2/ZBMIS",
      "Следење на ENISA препораки за ММСП",
      "Препорачана ММСП проценка за подобрување на безбедноста",
    ],
  };
}
