import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { emailTemplates } from '@/services/emailService';
import { Mail, FileText, Bell, Award } from 'lucide-react';

export function EmailTemplatePreview() {
  const [activeTab, setActiveTab] = useState('upload');

  const templates = {
    upload: {
      title: 'Upload Confirmation',
      icon: Mail,
      html: emailTemplates.uploadConfirmation('John Candidate', 'resume.pdf', 78)
    },
    shortlist: {
      title: 'Shortlist Notification',
      icon: Award,
      html: emailTemplates.shortlistNotification('John Candidate', 'Full Stack Developer')
    },
    hr: {
      title: 'HR Notification',
      icon: Bell,
      html: emailTemplates.hrNewResumeNotification('John Candidate', 'resume.pdf', 'Full Stack Developer', 82)
    },
    offer: {
      title: 'Offer Letter',
      icon: FileText,
      html: emailTemplates.offerLetter({
        candidateName: 'John Candidate',
        candidateEmail: 'john@example.com',
        role: 'Senior Full Stack Developer',
        companyName: 'TechCorp Solutions',
        salary: '$95,000',
        joiningDate: 'March 1, 2026',
        message: 'We are excited to have you join our engineering team!'
      })
    }
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-accent" />
          Email Templates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-4">
            {Object.entries(templates).map(([key, { title, icon: Icon }]) => (
              <TabsTrigger key={key} value={key} className="flex items-center gap-2 text-xs">
                <Icon className="w-3 h-3" />
                <span className="hidden sm:inline">{title}</span>
              </TabsTrigger>
            ))}
          </TabsList>
          
          {Object.entries(templates).map(([key, { html }]) => (
            <TabsContent key={key} value={key}>
              <div className="border rounded-lg overflow-hidden bg-white">
                <iframe
                  srcDoc={html}
                  className="w-full h-[500px]"
                  title={`${key} template preview`}
                />
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </CardContent>
    </Card>
  );
}
