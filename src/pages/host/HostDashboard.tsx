import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useApp } from '@/contexts/AppContext';
import { UserRole } from '@/types/types';
import { useToast } from '@/hooks/use-toast';

export default function HostDashboard() {
  const navigate = useNavigate();
  const { currentUser, data, updateRegistration, getResultByCompetition, logout } = useApp();
  const { toast } = useToast();
  const [selectedCompetition, setSelectedCompetition] = useState<string>('');
  const [showWinners, setShowWinners] = useState(false);

  useEffect(() => {
    if (!currentUser || currentUser.role !== UserRole.Host) {
      navigate('/host/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const selectedComp = data.competitions.find(c => c.id === selectedCompetition);
  
  const participants = selectedCompetition
    ? data.registrations.filter(reg => reg.competitions.includes(selectedCompetition))
    : [];

  const result = selectedCompetition ? getResultByCompetition(selectedCompetition) : undefined;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCallToStage = (registrationId: string) => {
    const registration = data.registrations.find(r => r.registrationId === registrationId);
    if (registration) {
      updateRegistration(registration.id, { calledToStage: true });
      toast({
        title: 'Success',
        description: `${registration.name} has been called to stage`
      });
    }
  };

  const getParticipantName = (registrationId: string) => {
    const registration = data.registrations.find(r => r.registrationId === registrationId);
    return registration?.name || 'Unknown';
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <i className="fas fa-microphone text-3xl text-primary" />
            <h1 className="text-2xl font-bold">Host Dashboard</h1>
          </div>
          <Button onClick={handleLogout} variant="outline" className="rounded-[3rem]">
            <i className="fas fa-sign-out-alt mr-2" />
            Logout
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <Card className="rounded-[3rem] mb-6">
          <CardHeader>
            <CardTitle>Select Competition</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedCompetition} onValueChange={setSelectedCompetition}>
              <SelectTrigger className="rounded-[3rem]">
                <SelectValue placeholder="Choose a competition" />
              </SelectTrigger>
              <SelectContent>
                {data.competitions.map(comp => (
                  <SelectItem key={comp.id} value={comp.id}>{comp.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedCompetition && !showWinners && (
          <Card className="rounded-[3rem]">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>Participant Queue - {selectedComp?.name}</CardTitle>
                {result?.published && (
                  <Button onClick={() => setShowWinners(true)} className="rounded-[3rem]">
                    <i className="fas fa-trophy mr-2" />
                    Show Winners
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between p-4 border rounded-[3rem] hover:bg-accent/50"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-lg">{participant.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {participant.registrationId} | Age: {participant.age} | {participant.ageGroup}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {participant.calledToStage ? (
                        <Badge variant="secondary" className="rounded-[3rem]">
                          <i className="fas fa-check mr-2" />
                          Called
                        </Badge>
                      ) : (
                        <Button
                          onClick={() => handleCallToStage(participant.registrationId)}
                          className="rounded-[3rem]"
                        >
                          <i className="fas fa-bullhorn mr-2" />
                          Call to Stage
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {selectedCompetition && showWinners && result?.published && (
          <Card className="rounded-[3rem] bg-gradient-to-br from-primary/20 to-secondary/20">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <i className="fas fa-trophy text-6xl text-primary" />
              </div>
              <CardTitle className="text-4xl">Divine Ranks</CardTitle>
              <p className="text-xl text-muted-foreground">{selectedComp?.name}</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div className="text-center p-8 bg-primary/30 rounded-[3rem]">
                  <div className="flex justify-center mb-4">
                    <i className="fas fa-crown text-6xl text-primary" />
                  </div>
                  <Badge className="mb-4 text-lg px-6 py-2 rounded-[3rem]" variant="default">
                    1st Place
                  </Badge>
                  <p className="text-4xl font-bold">{getParticipantName(result.rank1)}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="text-center p-6 bg-secondary/30 rounded-[3rem]">
                    <div className="flex justify-center mb-4">
                      <i className="fas fa-medal text-5xl text-secondary" />
                    </div>
                    <Badge className="mb-3 text-base px-4 py-1 rounded-[3rem]" variant="secondary">
                      2nd Place
                    </Badge>
                    <p className="text-3xl font-bold">{getParticipantName(result.rank2)}</p>
                  </div>

                  <div className="text-center p-6 bg-muted/50 rounded-[3rem]">
                    <div className="flex justify-center mb-4">
                      <i className="fas fa-award text-5xl text-muted-foreground" />
                    </div>
                    <Badge className="mb-3 text-base px-4 py-1 rounded-[3rem]" variant="outline">
                      3rd Place
                    </Badge>
                    <p className="text-3xl font-bold">{getParticipantName(result.rank3)}</p>
                  </div>
                </div>
              </div>

              <div className="text-center mt-8">
                <Button onClick={() => setShowWinners(false)} variant="outline" className="rounded-[3rem]" size="lg">
                  <i className="fas fa-arrow-left mr-2" />
                  Back to Queue
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {selectedCompetition && showWinners && !result?.published && (
          <Card className="rounded-[3rem] text-center">
            <CardContent className="py-12">
              <i className="fas fa-hourglass-half text-5xl text-muted-foreground mb-4" />
              <p className="text-xl text-muted-foreground mb-6">
                Results have not been published yet
              </p>
              <Button onClick={() => setShowWinners(false)} variant="outline" className="rounded-[3rem]">
                Back to Queue
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
