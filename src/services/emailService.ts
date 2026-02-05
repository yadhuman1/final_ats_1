// Email Service - Prototype Implementation
// In production, this would connect to SMTP/Resend via backend

export interface EmailData {
  to: string;
  subject: string;
  html: string;
  type: 'upload_confirmation' | 'shortlist_notification' | 'hr_notification' | 'offer_letter';
}

export interface OfferLetterData {
  candidateName: string;
  candidateEmail: string;
  role: string;
  companyName: string;
  salary?: string;
  joiningDate?: string;
  message?: string;
}

// Email Templates
export const emailTemplates = {
  uploadConfirmation: (candidateName: string, filename: string, score: number) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .score-badge { display: inline-block; background: ${score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'}; color: white; padding: 10px 20px; border-radius: 20px; font-size: 24px; font-weight: bold; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🤖 Smart ATS</h1>
          <p>Resume Analysis Complete</p>
        </div>
        <div class="content">
          <h2>Hello ${candidateName},</h2>
          <p>Thank you for uploading your resume to Smart ATS. Our AI system has analyzed your application.</p>
          
          <h3>📄 Resume: ${filename}</h3>
          
          <p><strong>Your AI Match Score:</strong></p>
          <p><span class="score-badge">${score}%</span></p>
          
          <p>${score >= 70 ? '🎉 Excellent! Your profile is a strong match.' : score >= 50 ? '👍 Good match! Consider improving skills in recommended areas.' : '📚 We recommend building more skills for better opportunities.'}</p>
          
          <p>Our HR team will review your application and contact you if shortlisted.</p>
          
          <p>Best regards,<br>Smart ATS Team</p>
        </div>
        <div class="footer">
          <p>This is an automated message from Smart ATS - Enterprise AI Recruitment</p>
        </div>
      </div>
    </body>
    </html>
  `,

  shortlistNotification: (candidateName: string, role: string) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .highlight { background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Congratulations!</h1>
          <p>You've Been Shortlisted</p>
        </div>
        <div class="content">
          <h2>Dear ${candidateName},</h2>
          
          <div class="highlight">
            <p><strong>Great news!</strong> Your application for <strong>${role}</strong> has been shortlisted by our HR team.</p>
          </div>
          
          <p>This means your profile stood out among other candidates. Our team will contact you soon with next steps, which may include:</p>
          
          <ul>
            <li>📞 Phone screening interview</li>
            <li>💻 Technical assessment</li>
            <li>🤝 HR interview</li>
          </ul>
          
          <p>Please ensure your contact information is up to date and be ready to respond to our communications.</p>
          
          <p>Best of luck!<br>Smart ATS HR Team</p>
        </div>
        <div class="footer">
          <p>Smart ATS - Enterprise AI Recruitment Platform</p>
        </div>
      </div>
    </body>
    </html>
  `,

  hrNewResumeNotification: (candidateName: string, filename: string, role: string, score: number) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
        .stats { display: flex; justify-content: space-around; margin: 20px 0; }
        .stat-box { background: white; padding: 15px 25px; border-radius: 10px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .score { font-size: 28px; font-weight: bold; color: ${score >= 70 ? '#10b981' : score >= 50 ? '#f59e0b' : '#ef4444'}; }
        .footer { text-align: center; padding: 20px; color: #6b7280; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📄 New Resume Uploaded</h1>
          <p>AI Analysis Complete</p>
        </div>
        <div class="content">
          <h2>Hello HR Team,</h2>
          
          <p>A new resume has been uploaded and analyzed by our AI system:</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <tr style="background: #f3f4f6;">
              <td style="padding: 12px; border: 1px solid #e5e7eb;"><strong>Candidate</strong></td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${candidateName}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e5e7eb;"><strong>File</strong></td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${filename}</td>
            </tr>
            <tr style="background: #f3f4f6;">
              <td style="padding: 12px; border: 1px solid #e5e7eb;"><strong>Detected Role</strong></td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;">${role}</td>
            </tr>
            <tr>
              <td style="padding: 12px; border: 1px solid #e5e7eb;"><strong>AI Score</strong></td>
              <td style="padding: 12px; border: 1px solid #e5e7eb;"><span class="score">${score}%</span></td>
            </tr>
          </table>
          
          <p>${score >= 70 ? '⭐ High potential candidate - recommended for immediate review' : score >= 50 ? '👍 Moderate match - worth reviewing' : '📋 Low match - review if needed'}</p>
          
          <p>Login to Smart ATS to review this candidate and take action.</p>
        </div>
        <div class="footer">
          <p>Smart ATS - Automated HR Notification</p>
        </div>
      </div>
    </body>
    </html>
  `,

  offerLetter: (data: OfferLetterData) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Times New Roman', serif; line-height: 1.8; color: #1f2937; }
        .container { max-width: 700px; margin: 0 auto; padding: 40px; background: white; }
        .letterhead { text-align: center; border-bottom: 3px solid #3b82f6; padding-bottom: 20px; margin-bottom: 30px; }
        .company-name { font-size: 28px; font-weight: bold; color: #1e40af; margin: 0; }
        .company-tagline { color: #6b7280; font-style: italic; }
        .date { text-align: right; margin-bottom: 30px; }
        .subject { font-weight: bold; text-align: center; margin: 30px 0; font-size: 18px; text-decoration: underline; }
        .signature { margin-top: 50px; }
        .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 12px; color: #6b7280; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="letterhead">
          <p class="company-name">${data.companyName}</p>
          <p class="company-tagline">Excellence in Innovation</p>
        </div>
        
        <p class="date">Date: ${data.joiningDate || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        
        <p><strong>To,</strong><br>
        ${data.candidateName}<br>
        ${data.candidateEmail}</p>
        
        <p class="subject">OFFER OF EMPLOYMENT</p>
        
        <p>Dear <strong>${data.candidateName}</strong>,</p>
        
        <p>We are pleased to inform you that after careful consideration of your application and interview performance, we have decided to offer you the position of <strong>${data.role}</strong> at ${data.companyName}.</p>
        
        <p>We were impressed by your skills, experience, and enthusiasm during the selection process. We believe you will be a valuable addition to our team.</p>
        
        <p><strong>Position Details:</strong></p>
        <ul>
          <li><strong>Designation:</strong> ${data.role}</li>
          ${data.salary ? `<li><strong>Compensation:</strong> ${data.salary} per annum</li>` : ''}
          ${data.joiningDate ? `<li><strong>Expected Joining Date:</strong> ${data.joiningDate}</li>` : ''}
          <li><strong>Location:</strong> As per company requirement</li>
        </ul>
        
        ${data.message ? `<p><strong>Additional Notes:</strong><br>${data.message}</p>` : ''}
        
        <p>Please confirm your acceptance of this offer by replying to this email within 7 working days.</p>
        
        <p>We look forward to welcoming you to the ${data.companyName} family!</p>
        
        <div class="signature">
          <p>Warm Regards,</p>
          <p><strong>HR Department</strong><br>
          ${data.companyName}</p>
        </div>
        
        <div class="footer">
          <p>This is an official offer letter generated by Smart ATS</p>
          <p>For any queries, please contact hr@${data.companyName.toLowerCase().replace(/\s+/g, '')}.com</p>
        </div>
      </div>
    </body>
    </html>
  `
};

// Simulated email sending (prototype)
export const sendEmail = async (emailData: EmailData): Promise<{ success: boolean; message: string }> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In production, this would call the backend API
  console.log('📧 Email sent (simulated):', {
    to: emailData.to,
    subject: emailData.subject,
    type: emailData.type
  });
  
  return {
    success: true,
    message: `Email sent successfully to ${emailData.to}`
  };
};

// Send upload confirmation email
export const sendUploadConfirmation = async (
  candidateEmail: string,
  candidateName: string,
  filename: string,
  score: number
) => {
  return sendEmail({
    to: candidateEmail,
    subject: `Smart ATS - Resume Analysis Complete (Score: ${score}%)`,
    html: emailTemplates.uploadConfirmation(candidateName, filename, score),
    type: 'upload_confirmation'
  });
};

// Send shortlist notification to candidate
export const sendShortlistNotification = async (
  candidateEmail: string,
  candidateName: string,
  role: string
) => {
  return sendEmail({
    to: candidateEmail,
    subject: `🎉 Congratulations! You've been shortlisted for ${role}`,
    html: emailTemplates.shortlistNotification(candidateName, role),
    type: 'shortlist_notification'
  });
};

// Send HR notification for new resume
export const sendHRNotification = async (
  hrEmail: string,
  candidateName: string,
  filename: string,
  role: string,
  score: number
) => {
  return sendEmail({
    to: hrEmail,
    subject: `New Resume: ${candidateName} - ${role} (Score: ${score}%)`,
    html: emailTemplates.hrNewResumeNotification(candidateName, filename, role, score),
    type: 'hr_notification'
  });
};

// Send offer letter
export const sendOfferLetter = async (data: OfferLetterData) => {
  return sendEmail({
    to: data.candidateEmail,
    subject: `Offer Letter - ${data.role} at ${data.companyName}`,
    html: emailTemplates.offerLetter(data),
    type: 'offer_letter'
  });
};
