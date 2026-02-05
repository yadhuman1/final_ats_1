import { useState } from 'react';
import { useAuth, HistoryEntry } from '@/contexts/AuthContext';
import { KPICard } from '@/components/ui/KPICard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Upload, FileCheck, CheckCircle2, XCircle, ThumbsUp, ThumbsDown, Mail, FileText } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { sendShortlistNotification } from '@/services/emailService';
import { OfferLetterModal } from './OfferLetterModal';

export function HRDashboard() {
  const { history, updateHistoryStatus } = useAuth();
  const [selectedCandidate, setSelectedCandidate] = useState<HistoryEntry | null>(null);
  const [offerModalOpen, setOfferModalOpen] = useState(false);

  const stats = {
    uploaded: history.filter(c => c.status === 'uploaded').length,
    analyzed: history.filter(c => c.status === 'analyzed').length,
    shortlisted: history.filter(c => c.status === 'shortlisted').length,
    rejected: history.filter(c => c.status === 'rejected').length
  };

  const analyzedCandidates = history.filter(c => c.status === 'analyzed');
  const shortlistedCandidates = history.filter(c => c.status === 'shortlisted');

  const handleAction = async (id: number, action: 'shortlisted' | 'rejected') => {
    const candidate = history.find(c => c.id === id);
    updateHistoryStatus(id, action, { hrActionAt: Date.now() });
    
    // Send shortlist email notification
    if (action === 'shortlisted' && candidate) {
      await sendShortlistNotification(
        'candidate@example.com',
        candidate.filename.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
        candidate.role || 'Software Developer'
      );
      
      toast({
        title: "✅ Candidate Shortlisted",
        description: "Shortlist notification email sent to candidate",
      });
    } else if (action === 'rejected') {
      toast({
        title: "Candidate Rejected",
        description: "Application has been marked as rejected",
        variant: "destructive"
      });
    }
  };

  const openOfferModal = (candidate: HistoryEntry) => {
    setSelectedCandidate(candidate);
    setOfferModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">HR Dashboard</h1>
        <p className="text-muted-foreground">Review and manage candidate applications</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Uploaded" value={stats.uploaded} icon={Upload} variant="default" />
        <KPICard title="Analyzed" value={stats.analyzed} icon={FileCheck} variant="accent" />
        <KPICard title="Shortlisted" value={stats.shortlisted} icon={CheckCircle2} variant="success" />
        <KPICard title="Rejected" value={stats.rejected} icon={XCircle} variant="destructive" />
      </div>

      <Tabs defaultValue="review" className="space-y-4">
        <TabsList>
          <TabsTrigger value="review" className="flex items-center gap-2">
            <FileCheck className="w-4 h-4" />
            Review Candidates ({stats.analyzed})
          </TabsTrigger>
          <TabsTrigger value="shortlisted" className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Shortlisted ({stats.shortlisted})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="review">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Candidates to Review</CardTitle>
            </CardHeader>
            <CardContent>
              {analyzedCandidates.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <FileCheck className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No candidates pending review</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resume</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-center">Score</TableHead>
                      <TableHead className="text-center">Skill Match</TableHead>
                      <TableHead className="text-center">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {analyzedCandidates.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.filename}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{c.role}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className={`font-bold ${(c.score || 0) >= 70 ? 'text-success' : (c.score || 0) >= 50 ? 'text-warning' : 'text-destructive'}`}>
                            {c.score}%
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-bold text-accent">{c.skillScore || c.score || 0}%</span>
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-center gap-2">
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="text-success hover:text-success hover:bg-success/10"
                              onClick={() => handleAction(c.id, 'shortlisted')}
                            >
                              <ThumbsUp className="w-4 h-4 mr-1" />
                              Shortlist
                            </Button>
                            <Button 
                              size="sm" 
                              variant="ghost"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10"
                              onClick={() => handleAction(c.id, 'rejected')}
                            >
                              <ThumbsDown className="w-4 h-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shortlisted">
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Shortlisted Candidates
              </CardTitle>
            </CardHeader>
            <CardContent>
              {shortlistedCandidates.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No shortlisted candidates yet</p>
                  <p className="text-sm mt-1">Shortlist candidates from the Review tab</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Resume</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead className="text-center">Score</TableHead>
                      <TableHead className="text-center">Status</TableHead>
                      <TableHead className="text-center">Offer Letter</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shortlistedCandidates.map((c) => (
                      <TableRow key={c.id}>
                        <TableCell className="font-medium">{c.filename}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{c.role}</Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-bold text-success">{c.score}%</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge className="bg-success/10 text-success border-success/30">
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Shortlisted
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button 
                            size="sm" 
                            className="bg-accent text-accent-foreground hover:bg-accent/90"
                            onClick={() => openOfferModal(c)}
                          >
                            <Mail className="w-4 h-4 mr-1" />
                            Send Offer
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {selectedCandidate && (
        <OfferLetterModal
          isOpen={offerModalOpen}
          onClose={() => {
            setOfferModalOpen(false);
            setSelectedCandidate(null);
          }}
          candidate={selectedCandidate}
        />
      )}
    </div>
  );
}
