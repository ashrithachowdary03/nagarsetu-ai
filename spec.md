# NagarSetu AI
## AI-Powered Civic Grievance Intelligence and Resolution Platform

**Tagline:** Bridging Citizens and Better Governance.

**Hackathon Track:** Civic Pulse – Digital Governance & Public Information

**Problem Statement:** Transparent Civic Grievance & Infrastructure Triage System

---

# 1. Project Overview

NagarSetu AI is an AI-powered civic grievance reporting and management platform that connects citizens with civic authorities.

It helps citizens report public infrastructure problems such as potholes, damaged roads, garbage accumulation, water leakage, drainage blockages and non-working streetlights.

The platform uses Artificial Intelligence through the Groq API to analyse complaint descriptions and uploaded photographs, identify the type of issue, recommend its priority and suggest the responsible department.

Administrators can review complaints, manage assignments and update their status through an admin dashboard.

Citizens can track the progress of their complaints using a unique complaint reference ID.

The main objective is to make civic complaint reporting more transparent, organized and accessible.

# 2. Problem Statement

Citizens frequently experience civic problems such as:

- Damaged roads and potholes.
- Garbage accumulation.
- Water leakage and water supply issues.
- Blocked drainage systems.
- Non-working streetlights.
- Damaged public infrastructure.

However, reporting these problems and tracking their progress can be difficult because:

1. Citizens may not know which department is responsible for a particular issue.
2. Complaints may be submitted to the wrong department.
3. Authorities may find it difficult to identify urgent complaints.
4. Citizens may not receive clear updates about their complaints.
5. Complaint information may be scattered across different channels.
6. There may be limited transparency in complaint management.

There is a need for a centralized platform that simplifies civic complaint submission, prioritization and tracking.

# 3. Proposed Solution

NagarSetu AI provides a centralized platform where citizens can report civic problems using text descriptions, photographs and location details.

The AI engine analyses the submitted information and generates:

- Complaint category.
- Short issue summary.
- Image observations, when a photograph is uploaded.
- Recommended priority level.
- Explanation for the priority recommendation.
- Suggested responsible department.
- Confidence or uncertainty information.

The complaint is saved in the database and displayed on the administrator dashboard.

Administrators can review AI-generated recommendations, assign complaints to the appropriate department and update their status.

Citizens can track complaint progress using their unique reference ID.

The platform also provides a public dashboard displaying aggregated complaint statistics without exposing private citizen information.

**Important:** AI-generated recommendations are suggestions. Administrators remain responsible for reviewing and confirming complaint priority and assignments.

# 4. Project Objectives

1. Make civic complaint reporting simple and accessible.
2. Use AI to analyse complaint descriptions and photographs.
3. Automatically categorize civic issues.
4. Recommend complaint priority levels with explanations.
5. Suggest the appropriate responsible department.
6. Provide transparent complaint tracking.
7. Help administrators manage complaints efficiently.
8. Improve communication between citizens and civic authorities.

# 5. Target Users

## 5.1 Citizens

Citizens can:

- Register and log in.
- Submit civic complaints.
- Upload photographs.
- Provide location information.
- View AI analysis.
- Track complaint progress.

## 5.2 Administrators

Administrators can:

- View all submitted complaints.
- Review AI-generated analysis.
- Filter complaints by category and priority.
- Assign responsible departments.
- Update complaint statuses.
- View complaint statistics.

## 5.3 Public Visitors

Public visitors can:

- View aggregated complaint statistics.
- See complaint categories.
- Understand the progress of reported issues.
- View non-sensitive public information.

# 6. Functional Requirements

## FR-01: Citizen Registration and Login

- Citizens can create accounts.
- Citizens can log in securely.
- Authentication protects personal complaint information.
- User roles distinguish citizens from administrators.

## FR-02: Civic Complaint Submission

Citizens can submit complaints with the following information:

- Complaint title.
- Problem description.
- Issue photograph (optional).
- Location or address.
- Contact details, where necessary.

The application must validate required fields before submission.

## FR-03: AI-Based Image and Text Analysis

The system uses the Groq API with a vision-capable AI model.

It must:

- Analyse uploaded civic issue photographs.
- Understand complaint descriptions.
- Identify the likely civic problem.
- Generate a short summary.
- Provide image observations.
- Indicate uncertainty when the information is insufficient.

The AI must analyse actual user-submitted information. Mock AI responses and hardcoded analysis are not permitted.

## FR-04: Automatic Complaint Categorization

The AI identifies the appropriate complaint category.

Supported categories:

1. Roads and potholes.
2. Water supply and leakage.
3. Garbage and sanitation.
4. Drainage and sewage.
5. Streetlights.
6. Public infrastructure.
7. Other civic issues.

## FR-05: AI-Based Priority Recommendation

The AI recommends one of the following priority levels:

- Critical.
- High.
- Medium.
- Low.

The recommendation must include a clear explanation.

Priority recommendations should consider the reported severity, potential public impact and available evidence.

Administrators can review and modify the suggested priority.

## FR-06: Department Recommendation

The AI suggests the department responsible for handling the complaint.

Examples:

| Complaint | Suggested Department |
|---|---|
| Potholes | Roads Department |
| Water leakage | Water Supply Department |
| Garbage accumulation | Sanitation Department |
| Drainage blockage | Drainage Department |
| Streetlight failure | Electrical Department |
| Damaged public facilities | Public Works Department |

Department names can be configured according to the local administrative structure.

## FR-07: Admin Dashboard

The administrator dashboard must provide:

- Total complaint count.
- Pending complaints.
- In-progress complaints.
- Resolved complaints.
- Complaint category distribution.
- Priority distribution.
- Complaint list and details.
- AI analysis results.
- Department assignment.
- Status management.

Administrators can review complaints and update their status.

## FR-08: Complaint Tracking

Each complaint receives a unique reference ID.

Citizens can use this ID to check the latest complaint status.

Supported statuses:

1. Submitted.
2. Under Review.
3. Assigned.
4. In Progress.
5. Resolved.
6. Closed.

The system must maintain complaint update history.

## FR-09: Similar Complaint Detection

The system can identify potentially similar complaints using complaint descriptions and location information.

- Display possible duplicate complaints to administrators.
- Show similarity information when available.
- Allow administrators to review potential duplicates.
- Never automatically merge complaints.

This is an optional enhancement after the core MVP is working.

## FR-10: Public Dashboard

The public dashboard displays aggregated statistics such as:

- Total complaints.
- Complaints by category.
- Complaints by priority.
- Resolved complaints.
- Pending complaints.
- Complaint status distribution.

Personal information and private complaint details must not be exposed.

# 7. AI System Requirements

## 7.1 AI Provider

**AI Provider:** Groq API

**AI Model:** A currently available Groq vision-capable model, selected and verified during implementation.

Preferred model for evaluation: `qwen/qwen3.8-27b`, subject to availability in the Groq account and API model catalog.

The implementation must verify that the selected model supports image inputs before using it.

## 7.2 AI Capabilities

The AI system must support:

- Image understanding.
- Text understanding.
- Complaint classification.
- Issue summarization.
- Priority recommendations.
- Department recommendations.
- Structured JSON responses.

## 7.3 AI Processing Workflow

1. Citizen submits a complaint with a description and optional photograph.
2. FastAPI backend receives the complaint.
3. Backend prepares the text and image for AI analysis.
4. Groq processes the submitted information using a vision-capable model when an image is present.
5. AI generates structured analysis.
6. Pydantic validates the AI response.
7. Backend stores the complaint and its analysis in Supabase.
8. Frontend displays the results.
9. Administrator reviews the recommendation.

## 7.4 Expected AI Output

The AI should return structured information containing:

- `summary`
- `category`
- `image_observations`
- `priority`
- `priority_reason`
- `suggested_department`
- `confidence`
- `uncertainty_notes`

The backend must validate the output before saving it.

If AI analysis fails, the application should display a clear error or pending-analysis state rather than inventing a result.

## 7.5 AI Reliability Requirements

- Use actual submitted images and descriptions.
- Do not use predefined demo responses.
- Do not fabricate image observations.
- Clearly distinguish user-reported facts from image observations.
- Handle unclear images and incomplete descriptions.
- Handle API failures and timeouts.
- Do not automatically treat AI recommendations as confirmed decisions.
- Allow administrators to review and correct recommendations.

# 8. Technology Stack

## 8.1 Frontend

- React.js
- Vite
- Tailwind CSS
- Lucide React
- Recharts

Purpose:
- Responsive user interface.
- Citizen complaint forms.
- Citizen dashboard.
- Admin dashboard.
- Complaint tracking.
- Data visualization.

## 8.2 Backend

- Python
- FastAPI
- Pydantic
- Groq Python SDK

Purpose:
- API development.
- AI integration.
- Input validation.
- Authentication verification.
- Database communication.
- Complaint management.

## 8.3 Database and Storage

- Supabase PostgreSQL.
- Supabase Storage.

Purpose:
- Store user profiles.
- Store complaints.
- Store AI analysis.
- Store complaint updates.
- Store uploaded photographs.

## 8.4 Artificial Intelligence

- Groq API.
- Vision-capable model for image and text analysis.

Purpose:
- Complaint understanding.
- Image analysis.
- Category classification.
- Priority recommendation.
- Department recommendation.

## 8.5 Maps (Optional)

- Leaflet.
- OpenStreetMap.

Purpose:
- Display complaint locations.
- Help administrators understand the geographical distribution of civic issues.

## 8.6 Deployment

- Vercel – Frontend hosting.
- Render – Backend hosting.
- Supabase – Database and file storage.

# 9. Environment Variables

The backend must use environment variables.

Required variables:

- `GROQ_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_KEY`

Additional authentication configuration can be added when required.

Security requirements:

- Never expose the Groq API key in frontend code.
- Never commit API keys to GitHub.
- Store secrets in backend environment configuration.
- Use a `.env.example` file containing placeholder values only.
- Configure appropriate database Row Level Security policies.

# 10. Database Requirements

## Table 1: Profiles

Stores user information.

Fields:

- `id`
- `full_name`
- `email`
- `role`
- `created_at`

## Table 2: Complaints

Stores submitted complaints and AI analysis.

Fields:

- `id`
- `reference_id`
- `user_id`
- `title`
- `description`
- `image_url`
- `location`
- `category`
- `priority`
- `priority_reason`
- `ai_summary`
- `image_observations`
- `suggested_department`
- `ai_confidence`
- `uncertainty_notes`
- `status`
- `created_at`
- `updated_at`

## Table 3: Complaint Updates

Stores complaint status history.

Fields:

- `id`
- `complaint_id`
- `updated_by`
- `previous_status`
- `new_status`
- `remarks`
- `created_at`

# 11. Application Pages

## Page 1: Landing Page

- Project introduction.
- Project objectives.
- Main features.
- How it works.
- Login and registration links.

## Page 2: Citizen Registration and Login

- User registration.
- Secure login.
- User authentication.

## Page 3: Citizen Dashboard

- Total submitted complaints.
- Pending complaints.
- In-progress complaints.
- Resolved complaints.
- Recent complaints.

## Page 4: Submit Complaint

- Complaint title.
- Description.
- Photograph upload.
- Location input.
- Submit button.

## Page 5: AI Analysis Result

Displays:

- AI summary.
- Detected category.
- Image observations.
- Recommended priority.
- Priority explanation.
- Suggested department.
- Confidence or uncertainty information.

## Page 6: Track Complaint

- Enter complaint reference ID.
- View complaint information.
- View current status.
- View status update history.

## Page 7: Admin Dashboard

- Complaint statistics.
- Complaint management.
- AI analysis review.
- Department assignment.
- Priority management.
- Status updates.

## Page 8: Public Dashboard

- Aggregated complaint statistics.
- Category distribution.
- Priority distribution.
- Complaint resolution statistics.

# 12. Non-Functional Requirements

## 12.1 Performance

- Pages should load quickly.
- AI analysis should show loading indicators.
- Handle slow AI responses gracefully.
- Avoid unnecessary API calls.

## 12.2 Security

- Secure authentication.
- Role-based access.
- Supabase Row Level Security.
- Secure API key management.
- Uploaded file validation.
- Protect private citizen information.
- Validate all backend inputs.

## 12.3 Usability

- Simple and clear interface.
- Responsive desktop and mobile design.
- Easy navigation.
- Understandable AI explanations.
- Clear complaint status indicators.

## 12.4 Reliability

- Validate all submitted information.
- Handle missing photographs.
- Handle unclear descriptions.
- Handle AI API failures.
- Prevent duplicate submissions where practical.
- Do not save fabricated AI results.

# 13. MVP Development Priorities

## Phase 1: Project Setup

- Create React + Vite frontend.
- Create FastAPI backend.
- Configure Tailwind CSS.
- Configure Supabase.
- Establish frontend-backend communication.
- Create project folder structure.

## Phase 2: Citizen Complaint Submission

- Create complaint submission form.
- Implement image upload.
- Implement location input.
- Validate complaint information.

## Phase 3: Real Groq AI Integration

- Configure Groq API.
- Select and verify a vision-capable model.
- Implement image and text analysis.
- Implement complaint categorization.
- Implement priority recommendation.
- Implement department recommendation.
- Validate structured AI responses.

## Phase 4: Database Integration

- Create Supabase tables.
- Configure Storage.
- Save complaints.
- Save AI analysis.
- Implement authentication and access policies.

## Phase 5: Admin Dashboard

- Display actual database records.
- Display complaint statistics.
- Review AI analysis.
- Assign departments.
- Update complaint status.

## Phase 6: Complaint Tracking

- Generate unique complaint reference IDs.
- Implement tracking page.
- Display complaint status history.

## Phase 7: Testing and Deployment

- Test the complete application.
- Fix errors.
- Deploy backend on Render.
- Deploy frontend on Vercel.
- Configure production environment variables.
- Test the deployed application.

# 14. Testing Requirements

Test the application with different actual inputs.

Test cases:

1. Submit a pothole complaint with a photograph.
2. Submit a garbage accumulation complaint with a photograph.
3. Submit a water leakage complaint with a photograph.
4. Submit a drainage complaint.
5. Submit a complaint without a photograph.
6. Submit an unclear description.
7. Test an unsupported or invalid image.
8. Test Groq API failure handling.
9. Verify AI category classification.
10. Verify priority recommendations and explanations.
11. Verify department recommendations.
12. Verify Supabase complaint storage.
13. Verify administrator status updates.
14. Verify complaint tracking.
15. Verify that private citizen information is protected.

# 15. Optional Advanced Features

These features should be implemented only after the essential MVP is complete.

- Multilingual support, including Telugu and English.
- Voice-based complaint submission.
- Interactive complaint map.
- Similar complaint detection.
- Email or in-app notifications.
- Advanced complaint analytics.
- Geographical complaint trend visualization.

# 16. Responsible AI and Transparency

- AI recommendations must be explainable.
- Administrators must be able to review AI decisions.
- AI must not claim to have verified a real-world issue.
- Image observations must be based on the actual uploaded photograph.
- Uncertain predictions must be clearly identified.
- Private citizen information must remain protected.
- Public dashboards must use aggregated information.

# 17. Expected Outcome

NagarSetu AI aims to make civic grievance management more transparent, accessible and organized.

By combining AI-powered image and text analysis, complaint classification, priority recommendations, department suggestions and complaint tracking, the platform helps citizens report civic problems and helps administrators review and manage complaints efficiently.

The system demonstrates how Artificial Intelligence can support digital governance and improve the organization of public grievance information.

# 18. Project Success Criteria

The MVP will be considered successful when:

1. Citizens can submit civic complaints.
2. Groq analyses actual complaint descriptions and photographs.
3. AI recommends complaint categories.
4. AI recommends priority levels with explanations.
5. AI suggests responsible departments.
6. Complaints are stored in Supabase.
7. Administrators can review and update complaints.
8. Citizens can track complaints using reference IDs.
9. Dashboard statistics reflect actual database records.
10. The application works on desktop and mobile.
11. The deployed application is accessible and demonstrable.

---

## PROJECT IDENTITY

**Project Name:** NagarSetu AI

**Full Title:** AI-Powered Civic Grievance Intelligence and Resolution Platform

**Tagline:** Bridging Citizens and Better Governance.

**Hackathon Track:** Civic Pulse – Digital Governance & Public Information

**Core Workflow:**

Report → Analyse → Prioritize → Assign → Track → Resolve.

**AI Provider:** Groq API

**Database:** Supabase PostgreSQL

**Frontend:** React + Vite + Tailwind CSS

**Backend:** Python + FastAPI