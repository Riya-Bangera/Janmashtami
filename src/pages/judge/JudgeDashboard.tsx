import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useApp } from '@/contexts/AppContext';
import { UserRole } from '@/types/types';
import { useToast } from '@/hooks/use-toast';

export default function JudgeDashboard() {
  const navigate = useNavigate();
  const { currentUser, data, addScore, updateScore, addResult, updateResult, getResultByCompetition, logout } = useApp();
  const { toast } = useToast();
  const [selectedCompetition, setSelectedCompetition] = useState<string>('');
  const [scoringDialogOpen, setScoringDialogOpen] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<string>('');
  const [scores, setScores] = useState<{ [rubricId: string]: number }>({});
  const [resultsDialogOpen, setResultsDialogOpen] = useState(false);
  const [selectedRanks, setSelectedRanks] = useState({ rank1: '', rank2: '', rank3: '' });

  useEffect(() => {
    if (!currentUser || currentUser.role !== UserRole.Judge) {
      navigate('/judge/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const assignedCompetitions = data.competitions.filter(comp =>
    currentUser.assignedCompetitions?.includes(comp.id)
  );

  const selectedComp = data.competitions.find(c => c.id === selectedCompetition);
  
  const participants = selectedCompetition
    ? data.registrations.filter(reg => reg.competitions.includes(selectedCompetition))
    : [];

  const competitionScores = selectedCompetition
    ? data.scores.filter(s => s.competitionId === selectedCompetition)
    : [];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleScoreParticipant = (registrationId: string) => {
    setSelectedParticipant(registrationId);
    
    const existingScore = competitionScores.find(
      s => s.registrationId === registrationId && s.judgeId === currentUser.id
    );

    if (existingScore) {
      setScores(existingScore.scores);
    } else {
      const initialScores: { [rubricId: string]: number } = {};
      selectedComp?.rubrics.forEach(rubric => {
        initialScores[rubric.id] = 0;
      });
      setScores(initialScores);
    }
    
    setScoringDialogOpen(true);
  };

  const handleScoreChange = (rubricId: string, value: number) => {
    setScores(prev => ({ ...prev, [rubricId]: value }));
  };

  const handleSubmitScore = () => {
    if (!selectedComp) return;

    const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

    const existingScore = competitionScores.find(
      s => s.registrationId === selectedParticipant && s.judgeId === currentUser.id
    );

    if (existingScore) {
      updateScore(existingScore.id, { scores, totalScore });
      toast({
        title: 'Success',
        description: 'Score updated successfully'
      });
    } else {
      addScore({
        registrationId: selectedParticipant,
        competitionId: selectedCompetition,
        judgeId: currentUser.id,
        scores,
        totalScore
      });
      toast({
        title: 'Success',
        description: 'Score submitted successfully'
      });
    }

    setScoringDialogOpen(false);
  };

  const getParticipantScores = (registrationId: string) => {
    const participantScores = competitionScores.filter(s => s.registrationId === registrationId);
    if (participantScores.length === 0) return 'Not scored';
    
    const totalScore = participantScores.reduce((sum, s) => sum + s.totalScore, 0);
    const avgScore = (totalScore / participantScores.length).toFixed(2);
    return `${avgScore} (${participantScores.length} judges)`;
  };

  const getAverageScore = (registrationId: string): number => {
    const participantScores = competitionScores.filter(s => s.registrationId === registrationId);
    if (participantScores.length === 0) return 0;
    
    const totalScore = participantScores.reduce((sum, s) => sum + s.totalScore, 0);
    return totalScore / participantScores.length;
  };

  const handlePublishResults = () => {
    if (!selectedRanks.rank1 || !selectedRanks.rank2 || !selectedRanks.rank3) {
      toast({
        title: 'Error',
        description: 'Please select all three ranks',
        variant: 'destructive'
      });
      return;
    }

    const existingResult = getResultByCompetition(selectedCompetition);

    if (existingResult) {
      updateResult(existingResult.id, {
        rank1: selectedRanks.rank1,
        rank2: selectedRanks.rank2,
        rank3: selectedRanks.rank3,
        published: true,
        publishedAt: new Date().toISOString()
      });
    } else {
      addResult({
        competitionId: selectedCompetition,
        rank1: selectedRanks.rank1,
        rank2: selectedRanks.rank2,
        rank3: selectedRanks.rank3,
        published: true,
        publishedAt: new Date().toISOString()
      });
    }

    toast({
      title: 'Success',
      description: 'Results published successfully'
    });

    setResultsDialogOpen(false);
  };

  const rankedParticipants = [...participants].sort((a, b) => {
    return getAverageScore(b.registrationId) - getAverageScore(a.registrationId);
  });

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <i className="fas fa-gavel text-3xl text-primary" />
            <h1 className="text-2xl font-bold">Judge Dashboard</h1>
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
                {assignedCompetitions.map(comp => (
                  <SelectItem key={comp.id} value={comp.id}>{comp.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {selectedCompetition && (
          <Tabs defaultValue="scoring" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="scoring">Scoring</TabsTrigger>
              <TabsTrigger value="results">Results & Publishing</TabsTrigger>
            </TabsList>

            <TabsContent value="scoring">
              <Card className="rounded-[3rem]">
                <CardHeader>
                  <CardTitle>Participants - {selectedComp?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Registration ID</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Age</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Scores</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {participants.map((participant) => (
                          <TableRow key={participant.id}>
                            <TableCell className="font-mono text-sm">{participant.registrationId}</TableCell>
                            <TableCell className="font-semibold">{participant.name}</TableCell>
                            <TableCell>{participant.age}</TableCell>
                            <TableCell>{participant.ageGroup}</TableCell>
                            <TableCell>{getParticipantScores(participant.registrationId)}</TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                onClick={() => handleScoreParticipant(participant.registrationId)}
                                className="rounded-[3rem]"
                              >
                                <i className="fas fa-edit mr-2" />
                                Score
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="results">
              <Card className="rounded-[3rem]">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Score Matrix & Results</CardTitle>
                    <Button onClick={() => setResultsDialogOpen(true)} className="rounded-[3rem]">
                      <i className="fas fa-trophy mr-2" />
                      Publish Results
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Rank</TableHead>
                          <TableHead>Name</TableHead>
                          <TableHead>Average Score</TableHead>
                          <TableHead>Judges Scored</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {rankedParticipants.map((participant, index) => (
                          <TableRow key={participant.id}>
                            <TableCell className="font-bold">#{index + 1}</TableCell>
                            <TableCell className="font-semibold">{participant.name}</TableCell>
                            <TableCell>{getAverageScore(participant.registrationId).toFixed(2)}</TableCell>
                            <TableCell>
                              {competitionScores.filter(s => s.registrationId === participant.registrationId).length}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}

        <Dialog open={scoringDialogOpen} onOpenChange={setScoringDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Score Participant</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {selectedComp?.rubrics.map((rubric) => (
                <div key={rubric.id}>
                  <Label htmlFor={`rubric-${rubric.id}`}>
                    {rubric.name} (Max: {rubric.maxScore})
                  </Label>
                  <Input
                    id={`rubric-${rubric.id}`}
                    type="number"
                    min="0"
                    max={rubric.maxScore}
                    value={scores[rubric.id] || 0}
                    onChange={(e) => handleScoreChange(rubric.id, Number(e.target.value))}
                    className="rounded-[3rem]"
                  />
                </div>
              ))}
              <div className="flex gap-4">
                <Button onClick={handleSubmitScore} className="flex-1 rounded-[3rem]">
                  Submit Score
                </Button>
                <Button variant="outline" onClick={() => setScoringDialogOpen(false)} className="flex-1 rounded-[3rem]">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={resultsDialogOpen} onOpenChange={setResultsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Select Winners</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              <div>
                <Label>1st Place</Label>
                <Select value={selectedRanks.rank1} onValueChange={(value) => setSelectedRanks(prev => ({ ...prev, rank1: value }))}>
                  <SelectTrigger className="rounded-[3rem]">
                    <SelectValue placeholder="Select winner" />
                  </SelectTrigger>
                  <SelectContent>
                    {rankedParticipants.map(p => (
                      <SelectItem key={p.registrationId} value={p.registrationId}>
                        {p.name} - {getAverageScore(p.registrationId).toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>2nd Place</Label>
                <Select value={selectedRanks.rank2} onValueChange={(value) => setSelectedRanks(prev => ({ ...prev, rank2: value }))}>
                  <SelectTrigger className="rounded-[3rem]">
                    <SelectValue placeholder="Select winner" />
                  </SelectTrigger>
                  <SelectContent>
                    {rankedParticipants.map(p => (
                      <SelectItem key={p.registrationId} value={p.registrationId}>
                        {p.name} - {getAverageScore(p.registrationId).toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>3rd Place</Label>
                <Select value={selectedRanks.rank3} onValueChange={(value) => setSelectedRanks(prev => ({ ...prev, rank3: value }))}>
                  <SelectTrigger className="rounded-[3rem]">
                    <SelectValue placeholder="Select winner" />
                  </SelectTrigger>
                  <SelectContent>
                    {rankedParticipants.map(p => (
                      <SelectItem key={p.registrationId} value={p.registrationId}>
                        {p.name} - {getAverageScore(p.registrationId).toFixed(2)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-4">
                <Button onClick={handlePublishResults} className="flex-1 rounded-[3rem]">
                  Publish Results
                </Button>
                <Button variant="outline" onClick={() => setResultsDialogOpen(false)} className="flex-1 rounded-[3rem]">
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
