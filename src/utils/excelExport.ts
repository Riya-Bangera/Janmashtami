import * as XLSX from 'xlsx';
import type { AppData, Registration, Score, Result, Competition, User } from '@/types/types';

export function exportAllDataToExcel(data: AppData) {
  const workbook = XLSX.utils.book_new();

  // --- Sheet 1: All Registrations ---
  // Find maximum number of competitions any single participant registered for
  const maxComps = Math.max(...data.registrations.map(r => r.competitions.length), 1);

  const registrationsData = data.registrations.map(reg => {
    const row: any = {
      'Registration ID': reg.registrationId,
      'Name': reg.name,
      'Age': reg.age,
      'Category': reg.ageGroup,
      "Parent's Name": reg.parentName,
      "Parent Contact No": reg.parentPhone,
      'Fee': `₹${reg.totalFee}`,
      'Payment': reg.paymentMethod === 'online' ? 'Online' : 'Cash'
    };

    // Add each competition in its own cell
    for (let i = 0; i < maxComps; i++) {
      const compId = reg.competitions[i];
      const compName = compId ? (data.competitions.find(c => c.id === compId)?.name || compId) : '';
      row[`Competition ${i + 1}`] = compName;
    }

    return row;
  });

  const registrationsSheet = XLSX.utils.json_to_sheet(registrationsData);
  XLSX.utils.book_append_sheet(workbook, registrationsSheet, 'All Registrations');

  // --- Sheet 2 onwards: Sheet per Competition & Category combination ---
  const usedSheetNames = new Set<string>();
  
  // Helper to generate unique, safe sheet names (Excel limit is 31 chars)
  const getSafeSheetName = (category: string, compName: string): string => {
    let name = `${category} - ${compName}`;
    if (name.length > 31) {
      name = `${category.substring(0, 5)} - ${compName.substring(0, 22)}`;
    }
    name = name.substring(0, 31).trim();
    
    let finalName = name;
    let counter = 1;
    while (usedSheetNames.has(finalName.toLowerCase())) {
      const suffix = ` (${counter})`;
      finalName = name.substring(0, 31 - suffix.length) + suffix;
      counter++;
    }
    usedSheetNames.add(finalName.toLowerCase());
    return finalName;
  };

  // For each competition
  data.competitions.forEach(comp => {
    // For each age group in this competition
    comp.ageGroups.forEach(category => {
      // Find registrations that are in this age group AND registered for this competition
      const matchingRegs = data.registrations.filter(reg => 
        reg.ageGroup === category && reg.competitions.includes(comp.id)
      );

      const sheetName = getSafeSheetName(category, comp.name);
      
      const rows = [
        ['Category:', category, 'Competition:', comp.name],
        ['Timings:', comp.time || 'N/A'],
        [], // empty spacer row
        ['Registration ID', 'Name', 'Age', "Parent's Name", "Parent's Contact No"]
      ];

      matchingRegs.forEach(reg => {
        rows.push([
          reg.registrationId,
          reg.name,
          reg.age.toString(),
          reg.parentName,
          reg.parentPhone
        ]);
      });

      const worksheet = XLSX.utils.aoa_to_sheet(rows);
      XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);
    });
  });

  // Generate filename with event year and date
  const eventYear = data.settings.eventYear || new Date().getFullYear();
  const eventDate = data.settings.eventDate || new Date().toISOString().split('T')[0];
  const filename = `Janmashtami_Competition_${eventYear}_${eventDate}.xlsx`;

  // Write and download
  XLSX.writeFile(workbook, filename);
}

export function exportRegistrationsToExcel(registrations: Registration[], competitions: Competition[]) {
  const data = registrations.map(reg => ({
    'Registration ID': reg.registrationId,
    'Name': reg.name,
    'Date of Birth': reg.dateOfBirth,
    'Age': reg.age,
    'Age Group': reg.ageGroup,
    'Parent Name': reg.parentName,
    'Parent Phone': reg.parentPhone,
    'Competitions': reg.competitions.map(id => {
      const comp = competitions.find(c => c.id === id);
      return comp?.name || id;
    }).join(', '),
    'Payment Method': reg.paymentMethod,
    'Payment Amount': reg.paymentAmount,
    'Payment Timestamp': reg.paymentTimestamp,
    'Status': reg.status,
    'Called to Stage': reg.calledToStage ? 'Yes' : 'No',
    'Created At': new Date(reg.createdAt).toLocaleString()
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Registrations');
  
  const filename = `Registrations_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, filename);
}

export function exportScoresToExcel(scores: Score[], registrations: Registration[], competitions: Competition[], users: User[]) {
  const data = scores.map(score => {
    const registration = registrations.find(r => r.id === score.registrationId);
    const competition = competitions.find(c => c.id === score.competitionId);
    const judge = users.find(u => u.id === score.judgeId);
    
    const scoreBreakdown: any = {};
    if (competition) {
      competition.rubrics.forEach(rubric => {
        scoreBreakdown[rubric.name] = score.scores[rubric.id] || 0;
      });
    }

    return {
      'Participant Name': registration?.name || 'Unknown',
      'Registration ID': registration?.registrationId || 'Unknown',
      'Competition': competition?.name || 'Unknown',
      'Judge': judge?.username || 'Unknown',
      ...scoreBreakdown,
      'Total Score': score.totalScore,
      'Created At': new Date(score.createdAt).toLocaleString()
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Scores');
  
  const filename = `Scores_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, filename);
}

export function exportResultsToExcel(results: Result[], registrations: Registration[], competitions: Competition[]) {
  const data = results.map(result => {
    const competition = competitions.find(c => c.id === result.competitionId);
    const rank1Reg = registrations.find(r => r.id === result.rank1);
    const rank2Reg = registrations.find(r => r.id === result.rank2);
    const rank3Reg = registrations.find(r => r.id === result.rank3);

    return {
      'Competition': competition?.name || 'Unknown',
      'Age Group': competition?.ageGroups.join(', ') || 'Unknown',
      'Rank 1': rank1Reg?.name || 'Not Assigned',
      'Rank 1 Registration ID': rank1Reg?.registrationId || '-',
      'Rank 2': rank2Reg?.name || 'Not Assigned',
      'Rank 2 Registration ID': rank2Reg?.registrationId || '-',
      'Rank 3': rank3Reg?.name || 'Not Assigned',
      'Rank 3 Registration ID': rank3Reg?.registrationId || '-',
      'Published': result.published ? 'Yes' : 'No',
      'Published At': result.publishedAt ? new Date(result.publishedAt).toLocaleString() : '-'
    };
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Results');
  
  const filename = `Results_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, filename);
}
