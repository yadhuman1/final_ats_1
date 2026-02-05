import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { FileText, Code, Database, Mail, Award, Users, BarChart3 } from 'lucide-react';

export function ProjectDocumentation() {
  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-accent" />
          Academic Documentation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="overview">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                Project Overview
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p><strong>Title:</strong> Smart ATS - AI-Powered Applicant Tracking System</p>
              <p><strong>Technology Stack:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Frontend: React 18, TypeScript, Tailwind CSS, Vite</li>
                <li>Backend: Flask, SQLAlchemy, JWT Authentication</li>
                <li>AI Engine: Rule-based NLP for skill extraction and scoring</li>
                <li>Database: SQLite/PostgreSQL</li>
              </ul>
              <p><strong>Objective:</strong> Develop an intelligent recruitment system that automates resume screening, provides AI-based candidate scoring, and streamlines the HR workflow.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="features">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Key Features
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-3">
              <div>
                <p className="font-semibold">1. AI Resume Analysis</p>
                <p>- Extracts skills from PDF/DOCX/TXT resumes using pattern matching</p>
                <p>- Detects experience level (Junior/Mid/Senior)</p>
                <p>- Identifies education qualification</p>
                <p>- Calculates weighted score: Skills (60%) + Experience (25%) + Education (15%)</p>
              </div>
              <div>
                <p className="font-semibold">2. Role-Based Access Control</p>
                <p>- Candidate: Upload resumes, view analysis history</p>
                <p>- HR: Review candidates, shortlist/reject, generate offer letters</p>
                <p>- Admin: Analytics dashboard, user management, system monitoring</p>
              </div>
              <div>
                <p className="font-semibold">3. Email Notification System</p>
                <p>- Upload confirmation with AI score</p>
                <p>- Shortlist notification to candidates</p>
                <p>- HR alerts for new applications</p>
                <p>- Automated offer letter generation</p>
              </div>
              <div>
                <p className="font-semibold">4. HR Pipeline Management</p>
                <p>- Kanban-style candidate tracking</p>
                <p>- Status progression: Uploaded → Analyzed → Shortlisted/Rejected</p>
                <p>- Batch actions and filtering</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="email">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email System Architecture
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p><strong>Email Triggers:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>POST /api/resume/analyze → Sends upload confirmation to candidate</li>
                <li>POST /api/resume/hr_action (shortlist) → Sends shortlist notification</li>
                <li>POST /api/resume/upload → Sends HR notification</li>
                <li>POST /api/offer-letter/send → Sends offer letter</li>
              </ul>
              <p className="mt-2"><strong>Template Engine:</strong> HTML templates with dynamic placeholders for candidate name, score, role, and company details.</p>
              <p><strong>Prototype Note:</strong> Current implementation simulates email sending. In production, integrate with SMTP (Gmail) or email API (Resend, SendGrid).</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="offer">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Offer Letter Generation
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p><strong>Trigger:</strong> HR clicks "Send Offer" on shortlisted candidate</p>
              <p><strong>Template Fields:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Company Name (customizable)</li>
                <li>Candidate Name & Email</li>
                <li>Position/Role (auto-filled from AI)</li>
                <li>Salary Package (optional)</li>
                <li>Joining Date (optional)</li>
                <li>Custom Message (optional)</li>
              </ul>
              <p className="mt-2"><strong>Output:</strong> Professional HTML email with formal letter formatting. PDF generation can be added using html2pdf or similar library.</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="integration">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                Code Integration Points
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-3">
              <div>
                <p className="font-semibold">Frontend Triggers (React):</p>
                <code className="block bg-muted p-2 rounded text-xs mt-1">
                  src/components/candidate/CandidateUpload.tsx → analyzeResume()<br/>
                  src/components/hr/HRDashboard.tsx → handleAction('shortlisted')<br/>
                  src/components/hr/OfferLetterModal.tsx → handleSubmit()
                </code>
              </div>
              <div>
                <p className="font-semibold">Backend Routes (Flask):</p>
                <code className="block bg-muted p-2 rounded text-xs mt-1">
                  POST /api/resume/analyze/{'<id>'} → Trigger email after analysis<br/>
                  POST /api/resume/hr_action/{'<id>'} → Trigger shortlist email<br/>
                  POST /api/offer-letter/send → Generate and send offer
                </code>
              </div>
              <div>
                <p className="font-semibold">Email Service Layer:</p>
                <code className="block bg-muted p-2 rounded text-xs mt-1">
                  src/services/emailService.ts → sendUploadConfirmation()<br/>
                  src/services/emailService.ts → sendShortlistNotification()<br/>
                  src/services/emailService.ts → sendOfferLetter()
                </code>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="prototype">
            <AccordionTrigger className="text-left">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Prototype Explanation
              </div>
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground space-y-2">
              <p><strong>AI Placeholder Justification:</strong></p>
              <p>The current AI analysis uses rule-based pattern matching for skill detection. This approach was chosen for the prototype because:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>No external API dependencies or costs</li>
                <li>Deterministic and explainable results</li>
                <li>Easy to extend with new skills/roles</li>
                <li>Suitable for academic demonstration</li>
              </ul>
              <p className="mt-2"><strong>Production Enhancement:</strong> Replace with ML-based NER (Named Entity Recognition) or integrate with OpenAI GPT for semantic understanding.</p>
              <p className="mt-2"><strong>Email Simulation:</strong> Emails are logged to console. Production would use SMTP configuration or email service API integration.</p>
              <p className="mt-2"><strong>Data Persistence:</strong> Currently uses in-memory state. Production would persist to SQLite/PostgreSQL database.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
}
