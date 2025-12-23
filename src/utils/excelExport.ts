import * as XLSX from 'xlsx';
import type { AppData, Registration, Score, Result, Competition, User } from '@/types/types';

export function exportAllDataToExcel(data: AppData) {
  const workbook = XLSX.utils.book_new();

  // Sheet 1: Registrations
  const registrationsData = data.registrations.map(reg => ({
    'Registration ID': reg.registrationId,
    'Name': reg.name,
    'Date of Birth': reg.dateOfBirth,
    'Age': reg.age,
    'Age Group': reg.ageGroup,
    'Parent Name': reg.parentName,
    'Parent Phone': reg.parentPhone,
    'Competitions': reg.competitions.map(id => {
      const comp = data.competitions.find(c => c.id === id);
      return comp?.name || id;
    }).join(', '),
    'Payment Method': reg.paymentMethod,
    'Payment Amount': reg.paymentAmount,
    'Payment Timestamp': reg.paymentTimestamp,
    'Status': reg.status,
    'Called to Stage': reg.calledToStage ? 'Yes' : 'No',
    'Created At': new Date(reg.createdAt).toLocaleString()
  }));
  const registrationsSheet = XLSX.utils.json_to_sheet(registrationsData);
  XLSX.utils.book_append_sheet(workbook, registrationsSheet, 'Registrations');

  // Sheet 2: Scores
  const scoresData = data.scores.map(score => {
    const registration = data.registrations.find(r => r.id === score.registrationId);
    const competition = data.competitions.find(c => c.id === score.competitionId);
    const judge = data.users.find(u => u.id === score.judgeId);
    
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
  const scoresSheet = XLSX.utils.json_to_sheet(scoresData);
  XLSX.utils.book_append_sheet(workbook, scoresSheet, 'Scores');

  // Sheet 3: Results
  const resultsData = data.results.map(result => {
    const competition = data.competitions.find(c => c.id === result.competitionId);
    const rank1Reg = data.registrations.find(r => r.id === result.rank1);
    const rank2Reg = data.registrations.find(r => r.id === result.rank2);
    const rank3Reg = data.registrations.find(r => r.id === result.rank3);

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
  const resultsSheet = XLSX.utils.json_to_sheet(resultsData);
  XLSX.utils.book_append_sheet(workbook, resultsSheet, 'Results');

  // Sheet 4: Competitions
  const competitionsData = data.competitions.map(comp => ({
    'Competition ID': comp.id,
    'Name': comp.name,
    'Age Groups': comp.ageGroups.join(', '),
    'Time': comp.time || '-',
    'Date': comp.date || '-',
    'Rubrics': comp.rubrics.map(r => `${r.name} (${r.maxScore})`).join(', ')
  }));
  const competitionsSheet = XLSX.utils.json_to_sheet(competitionsData);
  XLSX.utils.book_append_sheet(workbook, competitionsSheet, 'Competitions');

  // Sheet 5: Staff
  const staffData = data.users.map(user => ({
    'Username': user.username,
    'Role': user.role,
    'Assigned Competitions': (user.assignedCompetitions || []).map(id => {
      const comp = data.competitions.find(c => c.id === id);
      return comp?.name || id;
    }).join(', ')
  }));
  const staffSheet = XLSX.utils.json_to_sheet(staffData);
  XLSX.utils.book_append_sheet(workbook, staffSheet, 'Staff');

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
