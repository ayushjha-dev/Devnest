import * as XLSX from "xlsx";

export interface ExcelColumn<T> {
  header: string;
  accessor: (item: T) => string | number | boolean | null | undefined;
  width?: number;
}

export interface ExportToExcelOptions<T> {
  filename: string;
  sheetName?: string;
  data: T[];
  columns: ExcelColumn<T>[];
}

export interface ExcelSheetDef<T = any> {
  sheetName: string;
  data: T[];
  columns: ExcelColumn<T>[];
}

export interface ExportMultiSheetOptions {
  filename: string;
  sheets: ExcelSheetDef<any>[];
}

/**
 * Creates an XLSX worksheet with auto-computed or custom column widths.
 */
function createWorksheet<T>(data: T[], columns: ExcelColumn<T>[]): XLSX.WorkSheet {
  const headers = columns.map((col) => col.header);
  const rows = data.map((item) =>
    columns.map((col) => {
      const val = col.accessor(item);
      if (val === null || val === undefined) return "";
      return val;
    })
  );

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // Set intelligent column widths
  worksheet["!cols"] = columns.map((col, colIndex) => {
    if (col.width) return { wch: col.width };

    let maxLen = col.header.length;
    const sampleLimit = Math.min(rows.length, 50);
    for (let r = 0; r < sampleLimit; r++) {
      const cellVal = String(rows[r][colIndex] || "");
      if (cellVal.length > maxLen) {
        maxLen = cellVal.length;
      }
    }
    return { wch: Math.min(Math.max(maxLen + 4, 12), 45) };
  });

  return worksheet;
}

/**
 * Exports data directly to an Excel (.xlsx) file with styled column widths and automatic download.
 */
export function exportToExcel<T>({
  filename,
  sheetName = "Sheet1",
  data,
  columns,
}: ExportToExcelOptions<T>): boolean {
  if (!data || data.length === 0) {
    return false;
  }

  const worksheet = createWorksheet(data, columns);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

  const finalFilename = filename.toLowerCase().endsWith(".xlsx")
    ? filename
    : `${filename}.xlsx`;

  XLSX.writeFile(workbook, finalFilename, { compression: true });
  return true;
}

/**
 * Exports multiple sheets into a single structured Excel (.xlsx) workbook.
 */
export function exportMultiSheetExcel({
  filename,
  sheets,
}: ExportMultiSheetOptions): boolean {
  const validSheets = sheets.filter((s) => s.data && s.data.length > 0);
  if (validSheets.length === 0) {
    return false;
  }

  const workbook = XLSX.utils.book_new();

  for (const sheet of validSheets) {
    const worksheet = createWorksheet(sheet.data, sheet.columns);
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.sheetName);
  }

  const finalFilename = filename.toLowerCase().endsWith(".xlsx")
    ? filename
    : `${filename}.xlsx`;

  XLSX.writeFile(workbook, finalFilename, { compression: true });
  return true;
}

// ============================================================================
// Standard University Event Attendance Format (Matches C:\Users\itz_Ansh\Downloads\format)
// ============================================================================

export interface AttendanceTeamMember {
  name?: string;
  rollNo?: string | number;
  branch?: string;
  sem?: string;
  phone?: string | number;
  email?: string;
  sign?: string;
}

export interface AttendanceTeamSlot {
  srNo?: number | string;
  teamName?: string;
  teamSize?: number | string;
  members?: AttendanceTeamMember[];
}

export interface OfficialAttendanceParticipant {
  srNo?: number | string;
  teamCode?: string;
  participantName: string;
  school?: string;
  rollNumber: string | number;
  branch: string;
  sem: string;
  contactNo: string | number;
  email: string;
  signature?: string;
}

export interface OfficialAttendanceSheet {
  sheetName: string; // e.g. "CTF 3rd Year", "CTF 2nd Year", "Tech Quiz"
  trackTitle?: string; // e.g. "CTF 3rd Year", "CTF 2nd Year", "Tech Quiz"
  date?: string; // e.g. "23rd September 2026"
  teams?: AttendanceTeamSlot[];
  participants?: OfficialAttendanceParticipant[]; // Backward-compatibility
  slotsCount?: number; // Unlimited! If not set, defaults to max(30, teams.length)
  minRows?: number; // Legacy alias for slotsCount
}

export interface ExportOfficialAttendanceOptions {
  filename: string;
  eventName: string; // Dynamic event name e.g. "Prarambh" -> "Devnest Technical Event Prarambh"
  institutionName?: string; // Defaults to "University School of Engineering & Technology, LTSU Punjab"
  defaultDate?: string; // Defaults to "23rd September 2026"
  slotsCount?: number; // Optional global default slots count
  sheets: OfficialAttendanceSheet[];
}

/**
 * Creates a single worksheet matching the exact format of C:\Users\itz_Ansh\Downloads\format:
 * - Row 1 (Merged A1:J1): "University School of Engineering & Technology, LTSU Punjab"
 * - Row 2 (Merged A2:J2): "Devnest Technical Event <EventName>"
 * - Row 3 (Merged A3:G3): "<TrackTitle> Registration"
 * - Row 3 (Merged H3:J3): "Dated : <Date>"
 * - Row 4 (Headers A4:J4): ["Sr No.", "Team Name", "Team Size", "Name", "Roll No.", "Branch", "Sem", "Phone NO.", "Email", "Sign"]
 * - Rows 5+: Team slots (4 rows per slot, Sr No. / Team Name / Team Size merged across rows, up to 4 members)
 * - Footers: Spacing row + Student Coordinator & Faculty Coordinator + Faculty Co-Coordinator
 * - NOT limited to 30: Dynamically scales to any number of teams/serial numbers
 */
export function createOfficialAttendanceWorksheet({
  eventName = "Prarambh",
  institutionName = "University School of Engineering & Technology, LTSU Punjab",
  trackTitle = "Tech Quiz",
  date = "23rd September 2026",
  teams,
  participants = [],
  slotsCount,
  minRows,
}: {
  eventName?: string;
  institutionName?: string;
  trackTitle?: string;
  date?: string;
  teams?: AttendanceTeamSlot[];
  participants?: OfficialAttendanceParticipant[];
  slotsCount?: number;
  minRows?: number;
}): XLSX.WorkSheet {
  const ws: XLSX.WorkSheet = {};

  // Resolve teams list from teams or fallback participants
  let resolvedTeams: AttendanceTeamSlot[] = [];
  if (teams && teams.length > 0) {
    resolvedTeams = [...teams];
  } else if (participants && participants.length > 0) {
    const teamMap = new Map<string, AttendanceTeamSlot>();
    let autoCounter = 1;
    for (const p of participants) {
      const key = p.teamCode ? p.teamCode.trim() : `solo_${autoCounter++}`;
      if (!teamMap.has(key)) {
        teamMap.set(key, {
          srNo: teamMap.size + 1,
          teamName: p.teamCode || "",
          teamSize: 1,
          members: [],
        });
      }
      const slot = teamMap.get(key)!;
      slot.members!.push({
        name: p.participantName,
        rollNo: p.rollNumber,
        branch: p.branch,
        sem: p.sem,
        phone: p.contactNo,
        email: p.email,
        sign: p.signature || "",
      });
      slot.teamSize = slot.members!.length;
    }
    resolvedTeams = Array.from(teamMap.values());
  }

  // Row 1 (index 0, A1): University Header
  ws["A1"] = { t: "s", v: institutionName };

  // Row 2 (index 1, A2): Dynamic Event Header
  const cleanEvent = (eventName || "Prarambh").trim();
  let eventHeading: string;
  if (/^devnest\s+technical\s+event/i.test(cleanEvent)) {
    eventHeading = cleanEvent;
  } else if (/^devnest/i.test(cleanEvent)) {
    eventHeading = cleanEvent;
  } else {
    eventHeading = `Devnest Technical Event ${cleanEvent}`;
  }
  ws["A2"] = { t: "s", v: eventHeading };

  // Row 3 (index 2): Track Title (A3:G3) and Date (H3:J3)
  const cleanTrack = (trackTitle || "Tech Quiz").trim();
  const trackHeader = /registration$/i.test(cleanTrack) ? cleanTrack : `${cleanTrack} Registration`;
  ws["A3"] = { t: "s", v: trackHeader };

  const cleanDate = (date || "23rd September 2026").trim();
  const dateHeader = /^dated/i.test(cleanDate) ? cleanDate : `Dated : ${cleanDate}`;
  ws["H3"] = { t: "s", v: dateHeader };

  // Row 4 (index 3, A4:J4): Standard Columns
  const headers = [
    "Sr No.",
    "Team Name",
    "Team Size",
    "Name",
    "Roll No.",
    "Branch",
    "Sem",
    "Phone NO.",
    "Email",
    "Sign",
  ];
  headers.forEach((h, c) => {
    ws[XLSX.utils.encode_cell({ r: 3, c })] = { t: "s", v: h };
  });

  // Calculate dynamic capacity without size limits
  // If slotsCount is 0, fit exact registrations (min 1). Otherwise pad up to slotsCount or resolvedTeams.length
  const requestedCapacity =
    slotsCount !== undefined ? slotsCount : minRows !== undefined ? minRows : 30;
  const totalSlots =
    requestedCapacity > 0
      ? Math.max(requestedCapacity, resolvedTeams.length)
      : Math.max(1, resolvedTeams.length);

  const merges: XLSX.Range[] = [
    { s: { c: 0, r: 0 }, e: { c: 9, r: 0 } }, // A1:J1 University
    { s: { c: 0, r: 1 }, e: { c: 9, r: 1 } }, // A2:J2 Event
    { s: { c: 0, r: 2 }, e: { c: 6, r: 2 } }, // A3:G3 Track Registration
    { s: { c: 7, r: 2 }, e: { c: 9, r: 2 } }, // H3:J3 Dated
  ];

  const rows: XLSX.RowInfo[] = [
    { hpt: 28, hpx: 28 }, // Row 1
    { hpt: 26, hpx: 26 }, // Row 2
    { hpt: 25, hpx: 25 }, // Row 3
    { hpt: 30, hpx: 30 }, // Row 4
  ];

  let currRow = 4;
  for (let slot = 1; slot <= totalSlots; slot++) {
    const team = resolvedTeams[slot - 1] || null;
    const startR = currRow;
    const endR = currRow + 3; // 4 rows per team slot

    // Sr No. (col 0)
    const displaySr = typeof team?.srNo === "number" ? team.srNo : slot;
    ws[XLSX.utils.encode_cell({ r: startR, c: 0 })] = {
      t: typeof displaySr === "number" ? "n" : "s",
      v: displaySr,
    };
    merges.push({ s: { c: 0, r: startR }, e: { c: 0, r: endR } });

    // Team Name (col 1)
    if (team?.teamName) {
      ws[XLSX.utils.encode_cell({ r: startR, c: 1 })] = { t: "s", v: String(team.teamName) };
    }
    merges.push({ s: { c: 1, r: startR }, e: { c: 1, r: endR } });

    // Team Size (col 2)
    if (team?.teamSize !== undefined && team?.teamSize !== null && team?.teamSize !== "") {
      const numSize = Number(team.teamSize);
      ws[XLSX.utils.encode_cell({ r: startR, c: 2 })] = isNaN(numSize)
        ? { t: "s", v: String(team.teamSize) }
        : { t: "n", v: numSize };
    }
    merges.push({ s: { c: 2, r: startR }, e: { c: 2, r: endR } });

    // Members (cols 3 to 9) across 4 rows
    const members = team?.members || [];
    for (let mIdx = 0; mIdx < 4; mIdx++) {
      const r = startR + mIdx;
      rows.push({ hpt: 24, hpx: 24 });
      const m = members[mIdx];
      if (m) {
        if (m.name) ws[XLSX.utils.encode_cell({ r, c: 3 })] = { t: "s", v: String(m.name) };
        if (m.rollNo !== undefined && m.rollNo !== null && m.rollNo !== "") {
          const numRoll = Number(m.rollNo);
          ws[XLSX.utils.encode_cell({ r, c: 4 })] =
            !isNaN(numRoll) && String(m.rollNo).length <= 15
              ? { t: "n", v: numRoll }
              : { t: "s", v: String(m.rollNo) };
        }
        if (m.branch) ws[XLSX.utils.encode_cell({ r, c: 5 })] = { t: "s", v: String(m.branch) };
        if (m.sem) ws[XLSX.utils.encode_cell({ r, c: 6 })] = { t: "s", v: String(m.sem) };
        if (m.phone !== undefined && m.phone !== null && m.phone !== "") {
          const numPhone = Number(m.phone);
          ws[XLSX.utils.encode_cell({ r, c: 7 })] =
            !isNaN(numPhone) && String(m.phone).length <= 15
              ? { t: "n", v: numPhone }
              : { t: "s", v: String(m.phone) };
        }
        if (m.email) ws[XLSX.utils.encode_cell({ r, c: 8 })] = { t: "s", v: String(m.email) };
        if (m.sign) ws[XLSX.utils.encode_cell({ r, c: 9 })] = { t: "s", v: String(m.sign) };
      }
    }
    currRow += 4;
  }

  // Blank spacing row before signatures
  rows.push({ hpt: 24, hpx: 24 });
  currRow += 1;

  // Footer Row 1: Student Coordinator (A to D) & Faculty Coordinator (G to J)
  const f1 = currRow;
  ws[XLSX.utils.encode_cell({ r: f1, c: 0 })] = {
    t: "s",
    v: "Student Coordinator Name and signature : ",
  };
  ws[XLSX.utils.encode_cell({ r: f1, c: 6 })] = {
    t: "s",
    v: "Faculty Coordinator Name & Signature : ",
  };
  merges.push({ s: { c: 0, r: f1 }, e: { c: 3, r: f1 } });
  merges.push({ s: { c: 6, r: f1 }, e: { c: 9, r: f1 } });
  rows.push({ hpt: 24, hpx: 24 });
  currRow += 1;

  // Footer Row 2: Faculty Co-Coordinator (G to J)
  const f2 = currRow;
  ws[XLSX.utils.encode_cell({ r: f2, c: 6 })] = {
    t: "s",
    v: "Faculty Co-Coordinator Name & Signature : ",
  };
  merges.push({ s: { c: 6, r: f2 }, e: { c: 9, r: f2 } });
  rows.push({ hpt: 24, hpx: 24 });

  ws["!ref"] = XLSX.utils.encode_range({ s: { r: 0, c: 0 }, e: { r: currRow, c: 9 } });
  ws["!merges"] = merges;
  ws["!rows"] = rows;
  ws["!cols"] = [
    { width: 8.5, wpx: 51, wch: 8 },    // Sr No.
    { width: 20, wpx: 120, wch: 20 },   // Team Name
    { width: 12, wpx: 72, wch: 12 },    // Team Size
    { width: 25, wpx: 150, wch: 25 },   // Name
    { width: 16, wpx: 96, wch: 16 },    // Roll No.
    { width: 14, wpx: 84, wch: 14 },    // Branch
    { width: 8.5, wpx: 51, wch: 8 },    // Sem
    { width: 16, wpx: 96, wch: 16 },    // Phone NO.
    { width: 26, wpx: 156, wch: 26 },   // Email
    { width: 14, wpx: 84, wch: 14 },    // Sign
  ];
  ws["!margins"] = {
    left: 0.4,
    right: 0.4,
    top: 0.4,
    bottom: 0.4,
    header: 0.5,
    footer: 0.5,
  };

  return ws;
}

/**
 * Exports official university event registrations to Excel matching C:\Users\itz_Ansh\Downloads\format
 */
export function exportOfficialAttendanceExcel({
  filename,
  eventName,
  institutionName = "University School of Engineering & Technology, LTSU Punjab",
  defaultDate = "23rd September 2026",
  slotsCount,
  sheets,
}: ExportOfficialAttendanceOptions): boolean {
  if (!sheets || sheets.length === 0) {
    return false;
  }

  const workbook = XLSX.utils.book_new();

  for (const sheet of sheets) {
    const worksheet = createOfficialAttendanceWorksheet({
      eventName,
      institutionName,
      trackTitle: sheet.trackTitle || sheet.sheetName,
      date: sheet.date || defaultDate,
      teams: sheet.teams,
      participants: sheet.participants,
      slotsCount: sheet.slotsCount !== undefined ? sheet.slotsCount : slotsCount,
      minRows: sheet.minRows,
    });
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet.sheetName.slice(0, 31));
  }

  const finalFilename = filename.toLowerCase().endsWith(".xlsx")
    ? filename
    : `${filename}.xlsx`;

  XLSX.writeFile(workbook, finalFilename, { compression: true });
  return true;
}

/**
 * Exports a blank official university event attendance template of any size (not limited to 30)
 */
export function exportBlankAttendanceFormat({
  filename,
  eventName = "Prarambh",
  institutionName = "University School of Engineering & Technology, LTSU Punjab",
  date = "23rd September 2026",
  trackTitle = "Tech Quiz",
  slotsCount = 30,
}: {
  filename?: string;
  eventName?: string;
  institutionName?: string;
  date?: string;
  trackTitle?: string;
  slotsCount?: number;
}): boolean {
  const workbook = XLSX.utils.book_new();
  const cleanEvent = (eventName || "Prarambh").trim();
  const safeName = cleanEvent.toLowerCase().replace(/[^a-z0-9_-]+/g, "_");
  const count = Math.max(1, slotsCount || 30);

  const worksheet = createOfficialAttendanceWorksheet({
    eventName: cleanEvent,
    institutionName,
    trackTitle,
    date,
    slotsCount: count,
    teams: [],
  });

  const sheetTitle = `${trackTitle} Registration`.slice(0, 31);
  XLSX.utils.book_append_sheet(workbook, worksheet, sheetTitle);

  const finalFilename = filename
    ? filename.toLowerCase().endsWith(".xlsx")
      ? filename
      : `${filename}.xlsx`
    : `devnest_${safeName}_attendance_format_${count}slots.xlsx`;

  XLSX.writeFile(workbook, finalFilename, { compression: true });
  return true;
}
