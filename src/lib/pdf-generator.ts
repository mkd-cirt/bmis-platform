import jsPDF from "jspdf";

export interface ReportData {
  orgName: string;
  entityType: string;
  track: string;
  date: string;
  percentage: number;
  maturityLevel: string;
  implemented: number;
  partial: number;
  missing: number;
  domainScores: { name: string; percentage: number }[];
  gaps: { title: string; domain: string; severity: string }[];
}

export function generatePDFReport(data: ReportData) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const W = 210; const H = 297;
  const margin = 20;
  let y = margin;

  const addPage = () => { doc.addPage(); y = margin; };
  const checkPage = (needed: number) => { if (y + needed > H - margin) addPage(); };

  // ── Color helpers ──────────────────────────────────────────
  const hex2rgb = (hex: string) => {
    const r = parseInt(hex.slice(1,3),16);
    const g = parseInt(hex.slice(3,5),16);
    const b = parseInt(hex.slice(5,7),16);
    return { r, g, b };
  };
  const setFill = (hex: string) => { const {r,g,b} = hex2rgb(hex); doc.setFillColor(r,g,b); };
  const setDraw = (hex: string) => { const {r,g,b} = hex2rgb(hex); doc.setDrawColor(r,g,b); };
  const setTxt  = (hex: string) => { const {r,g,b} = hex2rgb(hex); doc.setTextColor(r,g,b); };

  // ── COVER PAGE ─────────────────────────────────────────────
  // Background
  setFill("#080f1e"); doc.rect(0,0,W,H,"F");
  // Top accent bar
  setFill("#2563eb"); doc.rect(0,0,W,2,"F");
  // Side accent
  setFill("#1d4ed8"); doc.rect(0,0,8,H,"F");

  // Logo box
  setFill("#2563eb"); doc.roundedRect(margin+2, 30, 20, 20, 3, 3, "F");
  setTxt("#ffffff"); doc.setFontSize(9); doc.setFont("helvetica","bold");
  doc.text("MK", margin+7, 43);

  // Title
  setTxt("#ffffff"); doc.setFontSize(28); doc.setFont("helvetica","bold");
  doc.text("BMIS", margin+2, 80);
  setTxt("#3b82f6"); doc.setFontSize(16);
  doc.text("Извештај за самооценување", margin+2, 92);

  // Divider
  setFill("#1e3a6e"); doc.rect(margin+2, 98, W-margin*2-4, 0.5, "F");

  // Meta info
  setTxt("#94a3b8"); doc.setFontSize(10); doc.setFont("helvetica","normal");
  doc.text(`Организација: ${data.orgName}`, margin+2, 110);
  doc.text(`Тип на субјект: ${data.entityType}`, margin+2, 118);
  doc.text(`Патека: ${data.track === "bmis" ? "BMIS / NIS2" : "ММСП (ENISA)"}`, margin+2, 126);
  doc.text(`Датум: ${data.date}`, margin+2, 134);

  // Score circle (simulated)
  const cx = W - 55; const cy = 110; const r = 25;
  setFill("#0d1a35"); doc.circle(cx, cy, r, "F");
  setDraw(data.percentage >= 80 ? "#10b981" : data.percentage >= 50 ? "#f59e0b" : "#ef4444");
  doc.setLineWidth(3); doc.circle(cx, cy, r, "D");
  setTxt("#ffffff"); doc.setFontSize(18); doc.setFont("helvetica","bold");
  doc.text(`${data.percentage}%`, cx - 9, cy + 4);
  setTxt("#94a3b8"); doc.setFontSize(8); doc.setFont("helvetica","normal");
  doc.text("резултат", cx - 7, cy + 10);

  // Maturity badge
  setFill("#1e3a6e"); doc.roundedRect(cx-20, cy+16, 40, 10, 2, 2, "F");
  setTxt("#93c5fd"); doc.setFontSize(8); doc.setFont("helvetica","bold");
  doc.text(data.maturityLevel, cx - 14, cy + 23);

  // Summary stats
  const stats = [
    { label:"Имплементирано", value: data.implemented, color:"#10b981" },
    { label:"Делумно",        value: data.partial,      color:"#f59e0b" },
    { label:"Недостига",      value: data.missing,      color:"#ef4444" },
  ];
  stats.forEach((s, i) => {
    const sx = margin + 2 + i * 58;
    setFill("#0d1a35"); doc.roundedRect(sx, 155, 52, 28, 3, 3, "F");
    const col = hex2rgb(s.color);
    doc.setTextColor(col.r, col.g, col.b);
    doc.setFontSize(18); doc.setFont("helvetica","bold");
    doc.text(String(s.value), sx + 8, 169);
    setTxt("#64748b"); doc.setFontSize(7); doc.setFont("helvetica","normal");
    doc.text(s.label, sx + 4, 177);
  });

  // Footer
  setFill("#0d1a35"); doc.rect(0, H-20, W, 20, "F");
  setTxt("#334155"); doc.setFontSize(8);
  doc.text("MKD-CIRT · Оваа алатка не претставува правен совет", margin, H-8);
  doc.text("bmis-platform.vercel.app", W-60, H-8);

  // ── PAGE 2 — DOMAIN SCORES ─────────────────────────────────
  addPage();
  setFill("#080f1e"); doc.rect(0,0,W,H,"F");
  setFill("#2563eb"); doc.rect(0,0,W,2,"F");
  setFill("#1d4ed8"); doc.rect(0,0,8,H,"F");

  setTxt("#ffffff"); doc.setFontSize(18); doc.setFont("helvetica","bold");
  doc.text("Резултати по домени", margin+2, y+10); y += 20;

  setFill("#1e3a6e"); doc.rect(margin+2, y, W-margin*2-4, 0.5, "F"); y += 8;

  data.domainScores.forEach((ds, i) => {
    checkPage(14);
    const pct = ds.percentage;
    const barColor = pct >= 80 ? "#10b981" : pct >= 50 ? "#f59e0b" : "#ef4444";
    const barW = W - margin*2 - 50;

    setTxt("#e2e8f0"); doc.setFontSize(9); doc.setFont("helvetica","normal");
    doc.text(`D${String(i+1).padStart(2,"0")} ${ds.name}`, margin+2, y+5);

    // Bar track
    setFill("#1e3a6e"); doc.roundedRect(margin+2, y+7, barW, 4, 1, 1, "F");
    // Bar fill
    const bw = (pct/100) * barW;
    if (bw > 0) { setFill(barColor); doc.roundedRect(margin+2, y+7, bw, 4, 1, 1, "F"); }

    // Percentage text
    const col = hex2rgb(barColor);
    doc.setTextColor(col.r, col.g, col.b);
    doc.setFontSize(9); doc.setFont("helvetica","bold");
    doc.text(`${pct}%`, W-margin-16, y+11);

    y += 14;
  });

  // ── PAGE 3 — IMPROVEMENT PLAN ──────────────────────────────
  addPage();
  setFill("#080f1e"); doc.rect(0,0,W,H,"F");
  setFill("#2563eb"); doc.rect(0,0,W,2,"F");
  setFill("#1d4ed8"); doc.rect(0,0,8,H,"F");

  setTxt("#ffffff"); doc.setFontSize(18); doc.setFont("helvetica","bold");
  doc.text("План за подобрување", margin+2, y+10); y += 20;
  setTxt("#64748b"); doc.setFontSize(9); doc.setFont("helvetica","normal");
  doc.text("Приоритетни недостатоци — подредени по критичност", margin+2, y); y += 10;
  setFill("#1e3a6e"); doc.rect(margin+2, y, W-margin*2-4, 0.5, "F"); y += 8;

  data.gaps.forEach((g, i) => {
    checkPage(18);
    const sev = g.severity;
    const sevColor = sev === "critical" || sev === "expert" ? "#ef4444" :
                     sev === "high"     || sev === "advanced" ? "#f97316" : "#f59e0b";

    setFill("#0d1a35"); doc.roundedRect(margin+2, y, W-margin*2-4, 14, 2, 2, "F");

    // Number
    setFill("#1e3a6e"); doc.circle(margin+10, y+7, 4, "F");
    setTxt("#93c5fd"); doc.setFontSize(8); doc.setFont("helvetica","bold");
    doc.text(String(i+1), margin+8, y+9);

    // Title
    setTxt("#e2e8f0"); doc.setFontSize(9); doc.setFont("helvetica","normal");
    const title = g.title.length > 55 ? g.title.substring(0,55)+"..." : g.title;
    doc.text(title, margin+18, y+6);
    setTxt("#64748b"); doc.setFontSize(7);
    doc.text(g.domain, margin+18, y+11);

    // Severity badge
    const sc = hex2rgb(sevColor);
    doc.setTextColor(sc.r, sc.g, sc.b);
    doc.setFontSize(7); doc.setFont("helvetica","bold");
    doc.text(sev.toUpperCase(), W-margin-20, y+8);

    y += 17;
  });

  // ── Footer on last page ────────────────────────────────────
  setFill("#0d1a35"); doc.rect(0, H-20, W, 20, "F");
  setTxt("#334155"); doc.setFontSize(8); doc.setFont("helvetica","normal");
  doc.text("MKD-CIRT · BMIS Self-Assessment Platform · bmis-platform.vercel.app", margin, H-8);

  // Save
  doc.save(`BMIS-Report-${data.orgName.replace(/\s+/g,"-")}-${Date.now()}.pdf`);
}
