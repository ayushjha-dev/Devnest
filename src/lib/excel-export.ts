import * as XLSX from "xlsx-js-style";

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
  slotsCount?: number; // Number of slots. If not set, dynamically matches teams.length. For blank templates, pass desired count (e.g. 30).
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
 * - Row 4 (Headers A4:J4): ["Sr No.", "Team Name", "Team Size", "Name", "Roll No.", "Course with Section Name", "Sem", "Phone NO.", "Email", "Sign"]
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

  // Border definitions matching standard university attendance format (C:\Users\itz_Ansh\Downloads\format)
  const borderMedium = { style: "medium", color: { rgb: "000000" } };
  const borderThin = { style: "thin", color: { rgb: "000000" } };

  // Row 1 (index 0, Merged A1:J1): University Header - Arial 15pt Bold Centered
  for (let c = 0; c < 10; c++) {
    ws[XLSX.utils.encode_cell({ r: 0, c })] = {
      t: "s",
      v: c === 0 ? institutionName : "",
      s: {
        font: { name: "Arial", sz: 15, bold: true },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: borderMedium,
          bottom: borderMedium,
          left: c === 0 ? borderMedium : undefined,
          right: c === 9 ? borderMedium : undefined,
        },
      },
    };
  }

  // Row 2 (index 1, Merged A2:J2): Dynamic Event Header - Arial 14pt Bold Centered
  const cleanEvent = (eventName || "Prarambh").trim();
  let eventHeading: string;
  if (/^devnest\s+technical\s+event/i.test(cleanEvent)) {
    eventHeading = cleanEvent;
  } else if (/^devnest/i.test(cleanEvent)) {
    eventHeading = cleanEvent;
  } else {
    eventHeading = `Devnest Technical Event ${cleanEvent}`;
  }
  for (let c = 0; c < 10; c++) {
    ws[XLSX.utils.encode_cell({ r: 1, c })] = {
      t: "s",
      v: c === 0 ? eventHeading : "",
      s: {
        font: { name: "Arial", sz: 14, bold: true },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: borderMedium,
          bottom: borderMedium,
          left: c === 0 ? borderMedium : undefined,
          right: c === 9 ? borderMedium : undefined,
        },
      },
    };
  }

  // Row 3 (index 2): Track Title (Merged A3:G3, Left) and Date (Merged H3:J3, Right) - Arial 12pt Bold
  const cleanTrack = (trackTitle || "Tech Quiz").trim();
  const trackHeader = /registration$/i.test(cleanTrack) ? cleanTrack : `${cleanTrack} Registration`;
  for (let c = 0; c < 7; c++) {
    ws[XLSX.utils.encode_cell({ r: 2, c })] = {
      t: "s",
      v: c === 0 ? trackHeader : "",
      s: {
        font: { name: "Arial", sz: 12, bold: true },
        alignment: { horizontal: "left", vertical: "center" },
        border: {
          top: borderMedium,
          bottom: borderMedium,
          left: c === 0 ? borderMedium : undefined,
          right: c === 6 ? borderThin : undefined,
        },
      },
    };
  }

  const cleanDate = (date || "23rd September 2026").trim();
  const dateHeader = /^dated/i.test(cleanDate) ? cleanDate : `Dated : ${cleanDate}`;
  for (let c = 7; c < 10; c++) {
    ws[XLSX.utils.encode_cell({ r: 2, c })] = {
      t: "s",
      v: c === 7 ? dateHeader : "",
      s: {
        font: { name: "Arial", sz: 12, bold: true },
        alignment: { horizontal: "right", vertical: "center" },
        border: {
          top: borderMedium,
          bottom: borderMedium,
          left: c === 7 ? borderThin : undefined,
          right: c === 9 ? borderMedium : undefined,
        },
      },
    };
  }

  // Row 4 (index 3, A4:J4): Standard Columns - Arial 11pt Bold Centered with wrapText
  const headers = [
    "Sr No.",
    "Team Name",
    "Team Size",
    "Name",
    "Roll No.",
    "Course with Section Name",
    "Sem",
    "Phone NO.",
    "Email",
    "Sign",
  ];
  for (let c = 0; c < 10; c++) {
    ws[XLSX.utils.encode_cell({ r: 3, c })] = {
      t: "s",
      v: headers[c],
      s: {
        font: { name: "Arial", sz: 11, bold: true },
        alignment: { horizontal: "center", vertical: "center", wrapText: true },
        border: {
          top: borderMedium,
          bottom: borderMedium,
          left: c === 0 ? borderMedium : borderThin,
          right: c === 9 ? borderMedium : borderThin,
        },
      },
    };
  }

  // Calculate dynamic capacity without size limits:
  // If slotsCount or minRows is explicitly specified (e.g. for blank templates), use that capacity (or teams count if greater).
  // Otherwise, dynamically fit the exact number of teams (e.g. 20 teams -> 20 slots; expands when > 30, decreases when < 30).
  // If no teams are present and slotsCount is not provided, default to 1 slot.
  const explicitCapacity = slotsCount !== undefined ? slotsCount : minRows;
  const totalSlots =
    explicitCapacity !== undefined
      ? Math.max(explicitCapacity, resolvedTeams.length)
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

    merges.push({ s: { c: 0, r: startR }, e: { c: 0, r: endR } });
    merges.push({ s: { c: 1, r: startR }, e: { c: 1, r: endR } });
    merges.push({ s: { c: 2, r: startR }, e: { c: 2, r: endR } });

    // Sr No. (col 0) - Arial 11pt Bold Centered
    const displaySr = typeof team?.srNo === "number" ? team.srNo : slot;
    for (let r = startR; r <= endR; r++) {
      ws[XLSX.utils.encode_cell({ r, c: 0 })] = {
        t: r === startR ? (typeof displaySr === "number" ? "n" : "s") : "s",
        v: r === startR ? displaySr : "",
        s: {
          font: { name: "Arial", sz: 11, bold: true },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            left: borderMedium,
            right: borderThin,
            top: r === startR ? borderMedium : undefined,
            bottom: r === endR ? borderMedium : undefined,
          },
        },
      };
    }

    // Team Name (col 1) - Arial 11pt Centered
    const teamNameVal = team?.teamName ? String(team.teamName) : "";
    for (let r = startR; r <= endR; r++) {
      ws[XLSX.utils.encode_cell({ r, c: 1 })] = {
        t: "s",
        v: r === startR ? teamNameVal : "",
        s: {
          font: { name: "Arial", sz: 11 },
          alignment: { horizontal: "center", vertical: "center", wrapText: true },
          border: {
            left: borderThin,
            right: borderThin,
            top: r === startR ? borderMedium : undefined,
            bottom: r === endR ? borderMedium : undefined,
          },
        },
      };
    }

    // Team Size (col 2) - Arial 11pt Centered
    let sizeVal: string | number = "";
    let sizeType: "s" | "n" = "s";
    if (team?.teamSize !== undefined && team?.teamSize !== null && team?.teamSize !== "") {
      const numSize = Number(team.teamSize);
      if (!isNaN(numSize)) {
        sizeVal = numSize;
        sizeType = "n";
      } else {
        sizeVal = String(team.teamSize);
      }
    }
    for (let r = startR; r <= endR; r++) {
      ws[XLSX.utils.encode_cell({ r, c: 2 })] = {
        t: r === startR ? sizeType : "s",
        v: r === startR ? sizeVal : "",
        s: {
          font: { name: "Arial", sz: 11 },
          alignment: { horizontal: "center", vertical: "center" },
          border: {
            left: borderThin,
            right: borderThin,
            top: r === startR ? borderMedium : undefined,
            bottom: r === endR ? borderMedium : undefined,
          },
        },
      };
    }

    // Members (cols 3 to 9) across 4 rows
    const members = team?.members || [];
    for (let mIdx = 0; mIdx < 4; mIdx++) {
      const r = startR + mIdx;
      rows.push({ hpt: 24, hpx: 24 });
      const m = members[mIdx] || null;

      const topBorder = mIdx === 0 ? borderMedium : borderThin;
      const bottomBorder = mIdx === 3 ? borderMedium : borderThin;

      // Col 3: Name (Left aligned)
      ws[XLSX.utils.encode_cell({ r, c: 3 })] = {
        t: "s",
        v: m?.name ? String(m.name) : "",
        s: {
          font: { name: "Arial", sz: 11 },
          alignment: { horizontal: "left", vertical: "center" },
          border: { left: borderThin, right: borderThin, top: topBorder, bottom: bottomBorder },
        },
      };

      // Col 4: Roll No. (Center aligned)
      let rollVal: string | number = "";
      let rollType: "s" | "n" = "s";
      if (m?.rollNo !== undefined && m?.rollNo !== null && m?.rollNo !== "") {
        const numRoll = Number(m.rollNo);
        if (!isNaN(numRoll) && String(m.rollNo).length <= 15) {
          rollVal = numRoll;
          rollType = "n";
        } else {
          rollVal = String(m.rollNo);
        }
      }
      ws[XLSX.utils.encode_cell({ r, c: 4 })] = {
        t: rollType,
        v: rollVal,
        s: {
          font: { name: "Arial", sz: 11 },
          alignment: { horizontal: "center", vertical: "center" },
          border: { left: borderThin, right: borderThin, top: topBorder, bottom: bottomBorder },
        },
      };

      // Col 5: Branch (Center aligned)
      ws[XLSX.utils.encode_cell({ r, c: 5 })] = {
        t: "s",
        v: m?.branch ? String(m.branch) : "",
        s: {
          font: { name: "Arial", sz: 11 },
          alignment: { horizontal: "center", vertical: "center" },
          border: { left: borderThin, right: borderThin, top: topBorder, bottom: bottomBorder },
        },
      };

      // Col 6: Sem (Center aligned)
      ws[XLSX.utils.encode_cell({ r, c: 6 })] = {
        t: "s",
        v: m?.sem ? String(m.sem) : "",
        s: {
          font: { name: "Arial", sz: 11 },
          alignment: { horizontal: "center", vertical: "center" },
          border: { left: borderThin, right: borderThin, top: topBorder, bottom: bottomBorder },
        },
      };

      // Col 7: Phone NO. (Center aligned)
      let phoneVal: string | number = "";
      let phoneType: "s" | "n" = "s";
      if (m?.phone !== undefined && m?.phone !== null && m?.phone !== "") {
        const numPhone = Number(m.phone);
        if (!isNaN(numPhone) && String(m.phone).length <= 15) {
          phoneVal = numPhone;
          phoneType = "n";
        } else {
          phoneVal = String(m.phone);
        }
      }
      ws[XLSX.utils.encode_cell({ r, c: 7 })] = {
        t: phoneType,
        v: phoneVal,
        s: {
          font: { name: "Arial", sz: 11 },
          alignment: { horizontal: "center", vertical: "center" },
          border: { left: borderThin, right: borderThin, top: topBorder, bottom: bottomBorder },
        },
      };

      // Col 8: Email (Left aligned)
      ws[XLSX.utils.encode_cell({ r, c: 8 })] = {
        t: "s",
        v: m?.email ? String(m.email) : "",
        s: {
          font: { name: "Arial", sz: 11 },
          alignment: { horizontal: "left", vertical: "center" },
          border: { left: borderThin, right: borderThin, top: topBorder, bottom: bottomBorder },
        },
      };

      // Col 9: Sign (Center aligned)
      ws[XLSX.utils.encode_cell({ r, c: 9 })] = {
        t: "s",
        v: m?.sign ? String(m.sign) : "",
        s: {
          font: { name: "Arial", sz: 11 },
          alignment: { horizontal: "center", vertical: "center" },
          border: { left: borderThin, right: borderMedium, top: topBorder, bottom: bottomBorder },
        },
      };
    }
    currRow += 4;
  }

  // Blank spacing row before signatures
  rows.push({ hpt: 24, hpx: 24 });
  currRow += 1;

  // Footer Row 1: Student Coordinator (A to D) & Faculty Coordinator (G to J)
  const f1 = currRow;
  for (let c = 0; c < 4; c++) {
    ws[XLSX.utils.encode_cell({ r: f1, c })] = {
      t: "s",
      v: c === 0 ? "Student Coordinator Name and signature : " : "",
      s: {
        font: { name: "Arial", sz: 11, bold: true },
        alignment: { horizontal: "left", vertical: "center" },
      },
    };
  }
  for (let c = 6; c < 10; c++) {
    ws[XLSX.utils.encode_cell({ r: f1, c })] = {
      t: "s",
      v: c === 6 ? "Faculty Coordinator Name & Signature : " : "",
      s: {
        font: { name: "Arial", sz: 11, bold: true },
        alignment: { horizontal: "left", vertical: "center" },
      },
    };
  }
  merges.push({ s: { c: 0, r: f1 }, e: { c: 3, r: f1 } });
  merges.push({ s: { c: 6, r: f1 }, e: { c: 9, r: f1 } });
  rows.push({ hpt: 24, hpx: 24 });
  currRow += 1;

  // Footer Row 2: Faculty Co-Coordinator (G to J)
  const f2 = currRow;
  for (let c = 6; c < 10; c++) {
    ws[XLSX.utils.encode_cell({ r: f2, c })] = {
      t: "s",
      v: c === 6 ? "Faculty Co-Coordinator Name & Signature : " : "",
      s: {
        font: { name: "Arial", sz: 11, bold: true },
        alignment: { horizontal: "left", vertical: "center" },
      },
    };
  }
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
    { width: 25, wpx: 150, wch: 25 },   // Course with Section Name
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
