import { bmis_domains } from "@/data/domains/bmis-domains";

export type ControlStatus = "NOT_STARTED" | "PARTIAL" | "IMPLEMENTED" | "NOT_APPLICABLE";

interface ControlAnswer { controlId: string; status: ControlStatus; }

const WEIGHTS = { critical: 4, high: 3, medium: 2, low: 1 };
const SCORES  = { IMPLEMENTED: 1, PARTIAL: 0.5, NOT_APPLICABLE: null, NOT_STARTED: 0 };

const MATURITY = [
  { level:1, label:"Initial",     labelMk:"Почетно",       minPct:0,  maxPct:20,  description:"Безбедносните процеси се неформални, непредвидливи и реактивни.", color:"#ef4444" },
  { level:2, label:"Developing",  labelMk:"Развивање",     minPct:20, maxPct:40,  description:"Основни процеси постојат, но применувањето е нецелосно.", color:"#f97316" },
  { level:3, label:"Defined",     labelMk:"Дефинирано",    minPct:40, maxPct:60,  description:"Процесите се документирани и конзистентно применуваат.", color:"#f59e0b" },
  { level:4, label:"Managed",     labelMk:"Управувано",    minPct:60, maxPct:80,  description:"Процесите се мерат и контролираат со квантитативни цели.", color:"#3b82f6" },
  { level:5, label:"Optimizing",  labelMk:"Оптимизирање",  minPct:80, maxPct:101, description:"Постои фокус на континуирано подобрување и иновации.", color:"#10b981" },
];

export interface AssessmentScore {
  percentage: number;
  rawScore: number;
  maxScore: number;
  maturityLevel: typeof MATURITY[0];
  domainScores: { domainId:string; domainName:string; percentage:number; implemented:number; partial:number; missing:number; total:number }[];
  implemented: number;
  partial: number;
  missing: number;
  notApplicable: number;
  total: number;
}

export function calculateAssessmentScore(answers: ControlAnswer[]): AssessmentScore {
  const answerMap = new Map(answers.map(a => [a.controlId, a.status]));
  let totalRaw = 0, totalMax = 0;
  let implCount = 0, partCount = 0, missCount = 0, naCount = 0;

  const domainScores = bmis_domains.map(domain => {
    let domainRaw = 0, domainMax = 0;
    let di = 0, dp = 0, dm = 0;

    domain.controls.forEach(ctrl => {
      const weight = WEIGHTS[ctrl.severity];
      const status = answerMap.get(ctrl.id) || "NOT_STARTED";
      const score  = SCORES[status];
      if (score === null) { naCount++; return; }
      domainMax  += weight;
      domainRaw  += weight * score;
      totalMax   += weight;
      totalRaw   += weight * score;
      if (status === "IMPLEMENTED")  { di++; implCount++; }
      else if (status === "PARTIAL") { dp++; partCount++; }
      else                           { dm++; missCount++; }
    });

    return {
      domainId:    domain.id,
      domainName:  domain.titleEn,
      percentage:  domainMax > 0 ? Math.round((domainRaw / domainMax) * 100) : 0,
      implemented: di, partial: dp, missing: dm,
      total: domain.controls.length,
    };
  });

  const percentage = totalMax > 0 ? Math.round((totalRaw / totalMax) * 100) : 0;
  const maturityLevel = MATURITY.find(m => percentage >= m.minPct && percentage < m.maxPct) || MATURITY[0];

  return { percentage, rawScore: totalRaw, maxScore: totalMax, maturityLevel, domainScores, implemented: implCount, partial: partCount, missing: missCount, notApplicable: naCount, total: implCount + partCount + missCount + naCount };
}

export function getTopGaps(answers: ControlAnswer[], limit = 15) {
  const answerMap = new Map(answers.map(a => [a.controlId, a.status]));
  const gaps: any[] = [];

  bmis_domains.forEach(domain => {
    domain.controls.forEach(ctrl => {
      const status = answerMap.get(ctrl.id) || "NOT_STARTED";
      if (status === "NOT_STARTED" || status === "PARTIAL") {
        gaps.push({
          controlId: ctrl.id,
          title:     ctrl.title,
          severity:  ctrl.severity,
          domain:    domain.titleEn,
          domainMk:  domain.title,
          weight:    WEIGHTS[ctrl.severity],
          isPartial: status === "PARTIAL",
          references: ctrl.references,
          guidance:  ctrl.guidance,
        });
      }
    });
  });

  return gaps
    .sort((a, b) => b.weight - a.weight || (a.isPartial ? 1 : -1))
    .slice(0, limit);
}
