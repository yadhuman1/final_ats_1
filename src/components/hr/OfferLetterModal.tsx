import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { sendOfferLetter, emailTemplates, OfferLetterData } from '@/services/emailService';
import { FileText, Send, Eye } from 'lucide-react';

interface OfferLetterModalProps {
  isOpen: boolean;
  onClose: () => void;
  candidate: {
    id: number;
    filename: string;
    role: string | null;
    score: number | null;
  };
}

export function OfferLetterModal({ isOpen, onClose, candidate }: OfferLetterModalProps) {
  const [formData, setFormData] = useState({
    candidateName: candidate.filename.replace(/\.[^/.]+$/, '').replace(/_/g, ' '),
    candidateEmail: 'candidate@example.com',
    companyName: 'TechCorp Solutions',
    salary: '',
    joiningDate: '',
    message: ''
  });
  const [sending, setSending] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleSubmit = async () => {
    if (!formData.candidateName || !formData.candidateEmail || !formData.companyName) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setSending(true);
    try {
      const offerData: OfferLetterData = {
        candidateName: formData.candidateName,
        candidateEmail: formData.candidateEmail,
        role: candidate.role || 'Software Developer',
        companyName: formData.companyName,
        salary: formData.salary || undefined,
        joiningDate: formData.joiningDate || undefined,
        message: formData.message || undefined
      };

      await sendOfferLetter(offerData);
      
      toast({
        title: "✅ Offer Letter Sent!",
        description: `Offer letter sent to ${formData.candidateEmail}`,
      });
      
      onClose();
    } catch (error) {
      toast({
        title: "Failed to send",
        description: "Could not send offer letter. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const previewHtml = emailTemplates.offerLetter({
    candidateName: formData.candidateName,
    candidateEmail: formData.candidateEmail,
    role: candidate.role || 'Software Developer',
    companyName: formData.companyName,
    salary: formData.salary || undefined,
    joiningDate: formData.joiningDate || undefined,
    message: formData.message || undefined
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-accent" />
            Generate Offer Letter
          </DialogTitle>
          <DialogDescription>
            Create and send an offer letter for {candidate.filename}
          </DialogDescription>
        </DialogHeader>

        {!showPreview ? (
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="candidateName">Candidate Name *</Label>
                <Input
                  id="candidateName"
                  value={formData.candidateName}
                  onChange={(e) => setFormData(prev => ({ ...prev, candidateName: e.target.value }))}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="candidateEmail">Candidate Email *</Label>
                <Input
                  id="candidateEmail"
                  type="email"
                  value={formData.candidateEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, candidateEmail: e.target.value }))}
                  placeholder="candidate@email.com"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name *</Label>
                <Input
                  id="companyName"
                  value={formData.companyName}
                  onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                  placeholder="TechCorp Solutions"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Position</Label>
                <Input
                  id="role"
                  value={candidate.role || 'Software Developer'}
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="salary">Salary Package (Optional)</Label>
                <Input
                  id="salary"
                  value={formData.salary}
                  onChange={(e) => setFormData(prev => ({ ...prev, salary: e.target.value }))}
                  placeholder="$80,000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="joiningDate">Joining Date (Optional)</Label>
                <Input
                  id="joiningDate"
                  type="date"
                  value={formData.joiningDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, joiningDate: e.target.value }))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Additional Message (Optional)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                placeholder="Any additional terms or welcome message..."
                rows={3}
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => setShowPreview(true)}
                className="flex-1"
              >
                <Eye className="w-4 h-4 mr-2" />
                Preview
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={sending}
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Send className="w-4 h-4 mr-2" />
                {sending ? 'Sending...' : 'Send Offer Letter'}
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="border rounded-lg overflow-hidden bg-white">
              <iframe
                srcDoc={previewHtml}
                className="w-full h-[400px]"
                title="Offer Letter Preview"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowPreview(false)}
                className="flex-1"
              >
                Back to Edit
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={sending}
                className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90"
              >
                <Send className="w-4 h-4 mr-2" />
                {sending ? 'Sending...' : 'Send Offer Letter'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
