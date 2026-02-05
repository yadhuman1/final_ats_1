import { useState, useRef } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload, FileText, Sparkles, CheckCircle2, Target, Brain, Zap, Lightbulb, GraduationCap, Briefcase, AlertCircle, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { toast } from '@/hooks/use-toast';
import { sendUploadConfirmation, sendHRNotification } from '@/services/emailService';

interface AnalysisResult {
  role: string;
  score: number;
  skillScore: number;
  experienceScore: number;
  educationScore: number;
  experienceLevel: string;
  educationLevel: string;
  matchedSkills: string[];
  missingSkills: string[];
  reasoning: string[];
  recommendations: string[];
}

// Realistic analysis scenarios with varied scores
const analysisScenarios: AnalysisResult[] = [
  {
    role: 'Frontend Developer',
    score: 45,
    skillScore: 42,
    experienceScore: 50,
    educationScore: 60,
    experienceLevel: 'junior',
    educationLevel: 'bachelors',
    matchedSkills: ['React', 'JavaScript', 'HTML', 'CSS'],
    missingSkills: ['Python', 'Node.js', 'Docker', 'AWS', 'TypeScript'],
    reasoning: [
      'Limited backend experience detected',
      'Good frontend fundamentals present',
      'Entry level professional experience',
      'Bachelor\'s degree qualification'
    ],
    recommendations: [
      'Focus on building backend skills with Node.js or Python',
      'Complete practical full-stack projects to strengthen portfolio',
      'Learn containerization basics with Docker'
    ]
  },
  {
    role: 'Full Stack Developer',
    score: 68,
    skillScore: 72,
    experienceScore: 65,
    educationScore: 80,
    experienceLevel: 'mid',
    educationLevel: 'bachelors',
    matchedSkills: ['React', 'Node.js', 'JavaScript', 'MongoDB', 'Git', 'TypeScript'],
    missingSkills: ['Docker', 'Kubernetes', 'AWS'],
    reasoning: [
      'Solid full-stack skill alignment',
      'Mid-level professional experience (3-5 years)',
      'Good education background',
      'Missing DevOps and cloud knowledge'
    ],
    recommendations: [
      'Build expertise in cloud platforms (AWS/GCP/Azure)',
      'Gain hands-on experience with containerization',
      'Consider DevOps certifications to boost profile'
    ]
  },
  {
    role: 'Full Stack Developer',
    score: 82,
    skillScore: 88,
    experienceScore: 85,
    educationScore: 80,
    experienceLevel: 'senior',
    educationLevel: 'bachelors',
    matchedSkills: ['React', 'Node.js', 'Python', 'PostgreSQL', 'Docker', 'AWS', 'Git', 'TypeScript', 'Redis'],
    missingSkills: ['Kubernetes'],
    reasoning: [
      'Strong full-stack expertise across technologies',
      'Senior level experience detected (5+ years)',
      'Cloud deployment knowledge present',
      'Diverse skill set with 9+ technologies'
    ],
    recommendations: [
      'Consider advanced Kubernetes orchestration training',
      'Mentor junior developers to build leadership skills',
      'Explore system design and architecture patterns'
    ]
  },
  {
    role: 'Backend Developer',
    score: 35,
    skillScore: 28,
    experienceScore: 40,
    educationScore: 60,
    experienceLevel: 'junior',
    educationLevel: 'bachelors',
    matchedSkills: ['HTML', 'CSS', 'JavaScript'],
    missingSkills: ['Python', 'Java', 'Node.js', 'SQL', 'Docker', 'API Design'],
    reasoning: [
      'Only frontend skills present',
      'No backend experience detected',
      'Limited technical depth for backend role',
      'Entry-level experience'
    ],
    recommendations: [
      'Start with Python or Java for backend fundamentals',
      'Learn SQL and database design principles',
      'Build REST API projects to gain practical experience'
    ]
  },
  {
    role: 'DevOps Engineer',
    score: 72,
    skillScore: 75,
    experienceScore: 70,
    educationScore: 80,
    experienceLevel: 'mid',
    educationLevel: 'bachelors',
    matchedSkills: ['Docker', 'AWS', 'Linux', 'Git', 'Jenkins', 'Python', 'Terraform'],
    missingSkills: ['Kubernetes', 'Helm'],
    reasoning: [
      'Strong infrastructure automation skills',
      'Good cloud platform experience',
      'Mid-level DevOps experience',
      'Missing container orchestration knowledge'
    ],
    recommendations: [
      'Deep dive into Kubernetes and Helm charts',
      'Practice GitOps workflows with ArgoCD',
      'Get AWS Solutions Architect certification'
    ]
  }
];

export function CandidateUpload() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [uploadedId, setUploadedId] = useState<number | null>(null);
  const [error, setError] = useState<string>('');
  const { user, addHistoryEntry, updateHistoryStatus } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validFormats = ['pdf', 'doc', 'docx', 'txt'];
      const ext = file.name.split('.').pop()?.toLowerCase() || '';
      
      if (!validFormats.includes(ext)) {
        setError('Invalid format. Please use PDF, DOC, DOCX, or TXT');
        return;
      }
      
      setError('');
      setResumeFile(file);
      setAnalysis(null);
      setUploadedId(null);
    }
  };

  const handleUpload = () => {
    if (!resumeFile || !user) {
      setError('Please select a file first');
      return;
    }
    
    setError('');
    const id = addHistoryEntry({
      userId: user.id,
      filename: resumeFile.name,
      role: null,
      score: null,
      status: 'uploaded',
      uploadedAt: Date.now()
    });
    setUploadedId(id);
  };

  const analyzeResume = async () => {
    if (!uploadedId) {
      setError('Please upload the file first');
      return;
    }
    
    setAnalyzing(true);
    setError('');
    
    // Simulate AI analysis with realistic delay
    setTimeout(async () => {
      const result = analysisScenarios[Math.floor(Math.random() * analysisScenarios.length)];
      
      setAnalysis(result);
      updateHistoryStatus(uploadedId, 'analyzed', {
        role: result.role,
        score: result.score,
        skillScore: result.skillScore,
        experienceScore: result.experienceScore,
        educationScore: result.educationScore,
        experienceLevel: result.experienceLevel,
        educationLevel: result.educationLevel,
        matchedSkills: result.matchedSkills,
        missingSkills: result.missingSkills,
        reasoning: result.reasoning,
        analyzedAt: Date.now()
      });
      
      // Send email notifications (simulated)
      if (user && resumeFile) {
        // Send confirmation to candidate
        await sendUploadConfirmation(
          user.email,
          user.name,
          resumeFile.name,
          result.score
        );
        
        // Send notification to HR
        await sendHRNotification(
          'hr@example.com',
          user.name,
          resumeFile.name,
          result.role,
          result.score
        );
        
        toast({
          title: "📧 Emails Sent",
          description: "Confirmation sent to you & HR notified of your application",
        });
      }
      
      setAnalyzing(false);
    }, 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 70) return 'text-success';
    if (score >= 50) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 70) return 'gradient-success';
    if (score >= 50) return 'gradient-warning';
    return 'bg-gradient-to-br from-destructive/80 to-destructive';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold">Upload Resume</h1>
        <p className="text-muted-foreground">Submit your resume for AI-powered analysis</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="shadow-card">
        <CardContent className="p-6 space-y-6">
          <input 
            type="file" 
            ref={fileRef} 
            accept=".pdf,.doc,.docx,.txt" 
            className="hidden" 
            onChange={handleFileChange} 
          />
          
          <div 
            onClick={() => fileRef.current?.click()} 
            className={cn(
              "cursor-pointer border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200",
              resumeFile 
                ? "border-success bg-success/5" 
                : "border-muted-foreground/30 hover:border-accent hover:bg-accent/5"
            )}
          >
            {resumeFile ? (
              <>
                <CheckCircle2 className="w-12 h-12 mx-auto text-success mb-3" />
                <p className="font-semibold text-success">{resumeFile.name}</p>
                <p className="text-sm text-muted-foreground mt-1">Click to change file</p>
              </>
            ) : (
              <>
                <FileText className="w-12 h-12 mx-auto text-muted-foreground mb-3" />
                <p className="font-semibold">Drop your resume here or click to browse</p>
                <p className="text-sm text-muted-foreground mt-1">Supports PDF, DOC, DOCX, TXT (Max 16MB)</p>
              </>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button 
              onClick={handleUpload} 
              disabled={!resumeFile || !!uploadedId}
              variant="outline"
              className="h-12"
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploadedId ? 'Uploaded ✓' : 'Upload File'}
            </Button>
            <Button 
              onClick={analyzeResume} 
              disabled={analyzing || !uploadedId}
              className="h-12 gradient-accent text-primary hover:opacity-90"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              {analyzing ? 'Analyzing...' : 'AI Analyze'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {analysis && (
        <Card className="shadow-card animate-fade-in">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              AI Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Score Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={cn(getScoreGradient(analysis.score), "text-white rounded-xl p-4 text-center")}>
                <p className="text-xs opacity-80 font-medium">Overall Score</p>
                <p className="text-3xl font-bold mt-1">{analysis.score}%</p>
              </div>
              <div className="gradient-primary text-primary-foreground rounded-xl p-4 text-center">
                <p className="text-xs opacity-80 font-medium">Matched Role</p>
                <p className="text-sm font-bold mt-2">{analysis.role}</p>
              </div>
              <div className="bg-muted rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <Briefcase className="w-3 h-3" />
                  <p className="text-xs font-medium">Experience</p>
                </div>
                <p className="text-lg font-bold capitalize">{analysis.experienceLevel}</p>
              </div>
              <div className="bg-muted rounded-xl p-4 text-center">
                <div className="flex items-center justify-center gap-1 mb-1">
                  <GraduationCap className="w-3 h-3" />
                  <p className="text-xs font-medium">Education</p>
                </div>
                <p className="text-lg font-bold capitalize">{analysis.educationLevel}</p>
              </div>
            </div>

            {/* Detailed Scores */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Skill Match</span>
                  <span className={cn("font-bold", getScoreColor(analysis.skillScore))}>{analysis.skillScore}%</span>
                </div>
                <Progress value={analysis.skillScore} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Experience</span>
                  <span className={cn("font-bold", getScoreColor(analysis.experienceScore))}>{analysis.experienceScore}%</span>
                </div>
                <Progress value={analysis.experienceScore} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Education</span>
                  <span className={cn("font-bold", getScoreColor(analysis.educationScore))}>{analysis.educationScore}%</span>
                </div>
                <Progress value={analysis.educationScore} className="h-2" />
              </div>
            </div>

            {/* Skills */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-success/5 border border-success/20 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Target className="w-4 h-4 text-success" />
                  <p className="font-semibold text-success">Detected Skills ({analysis.matchedSkills.length})</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.matchedSkills.map((skill, i) => (
                    <Badge key={i} variant="outline" className="bg-success/10 text-success border-success/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div className="bg-destructive/5 border border-destructive/20 p-4 rounded-xl">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-destructive" />
                  <p className="font-semibold text-destructive">Missing Skills ({analysis.missingSkills.length})</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {analysis.missingSkills.map((skill, i) => (
                    <Badge key={i} variant="outline" className="bg-destructive/10 text-destructive border-destructive/30">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Reasoning */}
            <div className="bg-muted/50 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Brain className="w-4 h-4 text-accent" />
                <p className="font-semibold">AI Analysis & Reasoning</p>
              </div>
              <ul className="space-y-2">
                {analysis.reasoning.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations */}
            <div className="bg-accent/5 border border-accent/20 p-4 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-accent" />
                <p className="font-semibold text-accent">Recommendations</p>
              </div>
              <ul className="space-y-2">
                {analysis.recommendations.map((rec, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm">
                    <span className="text-accent font-bold">•</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}