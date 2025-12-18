import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';

export default function HallOfFame() {
  const navigate = useNavigate();
  const { data } = useApp();

  const publishedResults = data.results.filter(r => r.published);

  const getParticipantName = (registrationId: string) => {
    const registration = data.registrations.find(r => r.registrationId === registrationId);
    return registration?.name || 'Unknown';
  };

  const getCompetitionName = (competitionId: string) => {
    const competition = data.competitions.find(c => c.id === competitionId);
    return competition?.name || 'Unknown Competition';
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
          <div className="space-y-8">
            {publishedResults.map((result) => (
              <Card key={result.id} className="rounded-[3rem] border-2">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-3">
                    <i className="fas fa-star text-primary" />
                    {getCompetitionName(result.competitionId)}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-primary/20 rounded-[3rem]">
                      <div className="flex justify-center mb-4">
                        <i className="fas fa-trophy text-5xl text-primary" />
                      </div>
                      <Badge className="mb-2 rounded-[3rem]" variant="default">
                        1st Place
                      </Badge>
                      <p className="text-xl font-bold">{getParticipantName(result.rank1)}</p>
                    </div>

                    <div className="text-center p-6 bg-secondary/20 rounded-[3rem]">
                      <div className="flex justify-center mb-4">
                        <i className="fas fa-medal text-5xl text-secondary" />
                      </div>
                      <Badge className="mb-2 rounded-[3rem]" variant="secondary">
                        2nd Place
                      </Badge>
                      <p className="text-xl font-bold">{getParticipantName(result.rank2)}</p>
                    </div>

                    <div className="text-center p-6 bg-muted/50 rounded-[3rem]">
                      <div className="flex justify-center mb-4">
                        <i className="fas fa-award text-5xl text-muted-foreground" />
                      </div>
                      <Badge className="mb-2 rounded-[3rem]" variant="outline">
                        3rd Place
                      </Badge>
                      <p className="text-xl font-bold">{getParticipantName(result.rank3)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <div className="text-center mt-8">
          <Button onClick={() => navigate('/')} variant="outline" className="rounded-[3rem]" size="lg">
            <i className="fas fa-home mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
}
