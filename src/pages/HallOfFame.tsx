import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { AgeGroup } from '@/types/types';

export default function HallOfFame() {
  const navigate = useNavigate();
  const { data } = useApp();

  // Get only published results
  const publishedResults = data.results.filter(r => r.published);

  // Group results by age group
  const resultsByAgeGroup = {
    [AgeGroup.Kids]: [] as typeof publishedResults,
    [AgeGroup.Juniors]: [] as typeof publishedResults,
    [AgeGroup.Teens]: [] as typeof publishedResults
  };

  publishedResults.forEach(result => {
    const competition = data.competitions.find(c => c.id === result.competitionId);
    if (competition && competition.ageGroups.length > 0) {
      const ageGroup = competition.ageGroups[0];
      resultsByAgeGroup[ageGroup].push(result);
    }
  });

  const getParticipantName = (registrationId: string) => {
    const registration = data.registrations.find(r => r.registrationId === registrationId);
    return registration?.name || 'Unknown';
  };

  const getCompetitionName = (competitionId: string) => {
    const competition = data.competitions.find(c => c.id === competitionId);
    return competition?.name || 'Unknown Competition';
  };

  const ageGroupLabels = {
    [AgeGroup.Kids]: 'Krishna Kids (up to 5 years)',
    [AgeGroup.Juniors]: 'Krishna Juniors (6 to 9 years)',
    [AgeGroup.Teens]: 'Krishna Teens (10 to 15 years)'
  };

  return (
    <div className="min-h-screen bg-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-12">
          <i className="fas fa-trophy text-6xl text-primary mb-4" />
          <h1 className="text-5xl font-bold mb-4">Hall of Fame</h1>
          <p className="text-lg text-muted-foreground">Celebrating our divine winners</p>
        </div>

        {publishedResults.length === 0 ? (
          <Card className="rounded-[3rem] text-center">
            <CardContent className="py-12">
              <i className="fas fa-award text-5xl text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground mb-6">
                No results have been published yet. Check back soon!
              </p>
              <Button onClick={() => navigate('/')} className="rounded-[3rem]">
                Back to Home
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-12">
            {Object.entries(resultsByAgeGroup).map(([ageGroup, results]) => {
              if (results.length === 0) return null;

              return (
                <div key={ageGroup}>
                  {/* Age Group Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <i className="fas fa-users text-4xl text-primary" />
                    <h2 className="text-4xl font-bold">{ageGroupLabels[ageGroup as AgeGroup]}</h2>
                  </div>

                  {/* Competitions in this age group */}
                  <div className="space-y-6">
                    {results.map((result) => (
                      <Card key={result.id} className="rounded-[3rem] border-2 hover:shadow-lg transition-shadow">
                        <CardHeader className="bg-primary/5">
                          <div className="flex items-center justify-between flex-wrap gap-3">
                            <CardTitle className="text-2xl flex items-center gap-3">
                              <i className="fas fa-star text-primary" />
                              {getCompetitionName(result.competitionId)}
                            </CardTitle>
                            <Badge className="bg-green-600 text-white">
                              <i className="fas fa-check-circle mr-1" />
                              Published
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6">
                          <div className="grid md:grid-cols-3 gap-6">
                            {/* 1st Place */}
                            <div className="text-center p-6 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-[2rem] border-2 border-yellow-400">
                              <div className="text-5xl mb-3">🥇</div>
                              <Badge className="mb-2 bg-yellow-600 text-white">
                                1st Place
                              </Badge>
                              <p className="text-xl font-bold text-yellow-900 mt-2">
                                {getParticipantName(result.rank1)}
                              </p>
                            </div>

                            {/* 2nd Place */}
                            <div className="text-center p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-[2rem] border-2 border-gray-400">
                              <div className="text-5xl mb-3">🥈</div>
                              <Badge className="mb-2 bg-gray-600 text-white">
                                2nd Place
                              </Badge>
                              <p className="text-xl font-bold text-gray-900 mt-2">
                                {getParticipantName(result.rank2)}
                              </p>
                            </div>

                            {/* 3rd Place */}
                            <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-[2rem] border-2 border-orange-400">
                              <div className="text-5xl mb-3">🥉</div>
                              <Badge className="mb-2 bg-orange-600 text-white">
                                3rd Place
                              </Badge>
                              <p className="text-xl font-bold text-orange-900 mt-2">
                                {getParticipantName(result.rank3)}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-12">
          <Button onClick={() => navigate('/')} variant="outline" className="rounded-[3rem]" size="lg">
            <i className="fas fa-home mr-2" />
            Back to Home
          </Button>
        </div>

        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>2025 Sri Krishna Janmashtami Competitions</p>
        </div>
      </div>
    </div>
  );
}
