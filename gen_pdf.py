import os
from docx import Document
from docx.shared import Pt, Cm, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY
from reportlab.platypus import (SimpleDocTemplate, Paragraph, Spacer, Table,
                                 TableStyle, PageBreak, KeepTogether)
from reportlab.pdfgen import canvas as _canvas

doc = Document(r'D:\fsd project\ResQLink-Project-Report.docx')

# ---- styles ----
ss = getSampleStyleSheet()

title_style = ParagraphStyle('Title2', parent=ss['Title'], fontName='Times-Bold',
                             fontSize=16, leading=20, alignment=TA_CENTER, spaceAfter=6)
subtitle_style = ParagraphStyle('Subtitle2', parent=ss['Normal'], fontName='Times-Roman',
                                fontSize=14, leading=18, alignment=TA_CENTER, spaceAfter=10)
from reportlab.lib import colors
h1_style = ParagraphStyle('H1', parent=ss['Normal'], fontName='Times-Bold',
                          fontSize=14, leading=18, spaceBefore=10, spaceAfter=6,
                          textColor=colors.black)
h2_style = ParagraphStyle('H2', parent=ss['Normal'], fontName='Times-Bold',
                          fontSize=12, leading=15, spaceBefore=8, spaceAfter=4,
                          textColor=colors.black)
h3_style = ParagraphStyle('H3', parent=ss['Normal'], fontName='Times-Bold',
                          fontSize=11, leading=14, spaceBefore=6, spaceAfter=3,
                          textColor=colors.black)
body_style = ParagraphStyle('Body', parent=ss['Normal'], fontName='Times-Roman',
                            fontSize=11, leading=14, alignment=TA_JUSTIFY, spaceAfter=6)
bullet_style = ParagraphStyle('Bullet', parent=body_style, leftIndent=18, spaceAfter=3)
caption_style = ParagraphStyle('Caption', parent=ss['Normal'], fontName='Times-Italic',
                               fontSize=10, leading=13, alignment=TA_CENTER, spaceBefore=4, spaceAfter=8)
cell_style = ParagraphStyle('Cell', parent=ss['Normal'], fontName='Times-Roman',
                            fontSize=10, leading=12)
cell_bold = ParagraphStyle('CellB', parent=cell_style, fontName='Times-Bold')

story = []

def P(text, style=body_style):
    story.append(Paragraph(text, style))

def B(text):
    story.append(Paragraph(text, bullet_style))

def H1(text):
    story.append(Paragraph(text, h1_style))

def H2(text):
    story.append(Paragraph(text, h2_style))

def H3(text):
    story.append(Paragraph(text, h3_style))

def spacer(h=0.4*cm):
    story.append(Spacer(1, h))

def make_table(rows, header=True, widths=None):
    data = []
    for i, row in enumerate(rows):
        r = []
        for cell in row:
            if isinstance(cell, str):
                r.append(Paragraph(cell, cell_style))
            else:
                r.append(cell)
        data.append(r)
    t = Table(data, repeatRows=1 if header else 0)
    style_cmds = [
        ('GRID', (0, 0), (-1, -1), 0.5, colors.black),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
    ]
    if header:
        style_cmds += [
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#D9D9D9')),
            ('FONTNAME', (0, 0), (-1, 0), 'Times-Bold'),
        ]
    t.setStyle(TableStyle(style_cmds))
    if widths:
        t.setStyle(TableStyle([('COLWIDTH', (0, 0), (-1, -1), w) for w in widths]))
    story.append(t)

# ===================== TITLE PAGE =====================
for _ in range(4):
    spacer(1.0*cm)
P('Smart Emergency Response &amp; Relief Coordination Platform', title_style)
P('A PROJECT REPORT', subtitle_style)
spacer(0.6*cm)
P('Submitted by', subtitle_style)
P('Pranav A-310624148068', subtitle_style)
spacer(1.2*cm)
P('in partial fulfillment for the award of the Degree', subtitle_style)
P('of', subtitle_style)
P('BACHELOR OF ENGINEERING', subtitle_style)
P('in', subtitle_style)
P('Department of Computer Science and Engineering (Artificial Intelligence and Machine Learning)', subtitle_style)
P('Easwari Engineering College', subtitle_style)
P('AN AUTONOMOUS INSTITUTION - AFFILIATED TO ANNA UNIVERSITY, CHENNAI', subtitle_style)
P('MONTH YEAR', subtitle_style)
story.append(PageBreak())

# ===================== BONAFIDE CERTIFICATE =====================
P('EASWARI ENGINEERING COLLEGE', title_style)
P('BONAFIDE CERTIFICATE', h1_style)
P('Certified that this mini project report titled "Smart Emergency Response &amp; Relief Coordination '
  'Platform (ResQLink)" is the bonafide work of "Pranav A-310624148068", who carried out the project '
  'work under my supervision.', body_style)
spacer(0.6*cm)
make_table([
    ['HEAD OF THE DEPARTMENT', 'SUPERVISOR'],
    ['Name: ____________________', 'Name: ____________________'],
    ['Designation: ______________', 'Designation: __________________'],
    ['Address: __________________', 'Address: __________________'],
    ['Date: ____________________', 'Date: ____________________'],
])
story.append(PageBreak())

# ===================== VIVA-VOCE CERTIFICATE =====================
P('EASWARI ENGINEERING COLLEGE', title_style)
P('Certificate of Viva-voce-Examination', h1_style)
P('This is to certify that the Viva Voce Examination of the Project Work entitled "Smart Emergency '
  'Response &amp; Relief Coordination Platform (ResQLink)" submitted by Mr./Ms. Pranav A-310624148068 '
  '(Reg. No. A-310624148068) in partial fulfillment of the requirements for the award of the degree of '
  'BACHELOR OF ENGINEERING was conducted on ________ (Date) in the Department of Computer Science and '
  'Engineering (AIML), Easwari Engineering College, Ramapuram - Chennai.', body_style)
spacer(0.6*cm)
make_table([
    ['INTERNAL EXAMINER', 'EXTERNAL EXAMINER'],
    ['Name: __________________', 'Name: __________________'],
    ['Designation: ____________', 'Designation: ____________'],
    ['Address: ________________', 'Address: ________________'],
    ['Date: ___________________', 'Date: ___________________'],
])
story.append(PageBreak())

# ===================== ABSTRACT =====================
P('ABSTRACT', h1_style)
P('ResQLink is a web-based platform developed to support organized disaster-response activities during '
  'emergency situations. The system addresses the coordination gap between people who need assistance, '
  'volunteers who can provide support, and authorities responsible for managing the response. It combines '
  'emergency information, location-based data, operational records, and communication within a single '
  'digital environment. The platform is implemented using the MERN stack with a role-based architecture to '
  'support different categories of users. ResQLink aims to make emergency operations more organized, '
  'traceable, and accessible through centralized digital management.', body_style)
spacer(0.6*cm)

# ===================== ACKNOWLEDGEMENT =====================
P('ACKNOWLEDGEMENT', h1_style)
for a in [
    'We express our sincere gratitude to the Principal Dr. P. Deiva Sundari and the Management of our '
    'college for providing us with the opportunity to carry out this project work.',
    'We convey our heartfelt thanks to the Head of the Department, Department of Computer Science and '
    'Engineering (AIML), for the continuous encouragement and support.',
    'We are extremely thankful to our Project Guide for valuable guidance, suggestions, and motivation '
    'throughout the completion of this project.',
    'We would also like to extend our gratitude to all the faculty members of the Department of Computer '
    'Science and Engineering (AIML) for their support.',
    'Finally, we thank our parents and friends for their constant encouragement and help during the '
    'course of this project.',
]:
    B(a)
story.append(PageBreak())

# ===================== TABLE OF CONTENTS =====================
P('CHAPTER NO.  TABLE OF CONTENTS  PAGE No.', h1_style)
toc = [
    ('CHAPTER 1 - INTRODUCTION', True),
    ('1.1 OVERVIEW', False),
    ('1.2 PROBLEM DEFINITION', False),
    ('1.3 OBJECTIVE', False),
    ('1.4 SCOPE OF THE PROJECT', False),
    ('1.5 MOTIVATION', False),
    ('CHAPTER 2 - RELATED WORK', True),
    ('2.1 LITERATURE REVIEW', False),
    ('2.2 EXISTING SYSTEM', False),
    ('2.3 PROPOSED SYSTEM', False),
    ('CHAPTER 3 - SYSTEM ANALYSIS', True),
    ('3.1 SYSTEM REQUIREMENTS', False),
    ('3.2 SOFTWARE AND HARDWARE REQUIREMENTS', False),
    ('CHAPTER 4 - SYSTEM DESIGN', True),
    ('4.1 SYSTEM ARCHITECTURE', False),
    ('4.2 MODULE DESCRIPTION', False),
    ('4.3 USE CASE DIAGRAM', False),
    ('4.4 CLASS DIAGRAM', False),
    ('4.5 SEQUENCE DIAGRAM', False),
    ('CHAPTER 5 - IMPLEMENTATION', True),
    ('5.1 IMPLEMENTATION OVERVIEW', False),
    ('5.2 KEY FUNCTIONS (CODE EXPLANATION)', False),
    ('CHAPTER 6 - CONCLUSION & FUTURE WORK', True),
    ('6.1 CONCLUSION', False),
    ('6.2 FUTURE ENHANCEMENTS', False),
    ('APPENDIX - SOURCE CODE', True),
    ('SCREENSHOTS OF THE PROJECT', True),
    ('REFERENCES', True),
]
for text, bold in toc:
    style = ParagraphStyle('toc', parent=body_style, fontName='Times-Bold' if bold else 'Times-Roman')
    P(text, style)
story.append(PageBreak())

# ===================== CHAPTER 1 =====================
H1('CHAPTER 1')
H2('INTRODUCTION')
H3('1.1 OVERVIEW')
P('Natural and man-made disasters can create large numbers of simultaneous emergency situations within a '
  'short period of time. Effective disaster management depends on timely information, proper coordination, '
  'and efficient utilization of available human and material resources. Traditional communication methods '
  'can make it difficult to maintain a common and updated view of ongoing situations. Digital technologies '
  'provide opportunities to collect emergency information, visualize affected locations, and support '
  'coordination among different stakeholders. ResQLink is developed in this context as a technology-based '
  'approach to improving the organization of emergency-response activities.')
P('ResQLink is a web-based platform developed to support organized disaster-response activities during '
  'emergency situations. The system addresses the coordination gap between people who need assistance, '
  'volunteers who can provide support, and authorities responsible for managing the response. It combines '
  'emergency information, location-based data, operational records, and communication within a single '
  'digital environment. The platform is implemented using the MERN stack with a role-based architecture to '
  'support different categories of users. ResQLink aims to make emergency operations more organized, '
  'traceable, and accessible through centralized digital management.')
H3('1.2 PROBLEM DEFINITION')
P('During floods, cyclones, earthquakes, fires, landslides, and other emergencies, authorities face '
  'difficulties in coordinating multiple response activities. Citizen emergency requests may not be '
  'efficiently tracked, prioritized, and assigned to available volunteers. Managing relief camps, '
  'resources, distributions, and emergency information through separate systems can lead to delays and '
  'lack of coordination. There is a need for a centralized platform that provides real-time visibility of '
  'emergencies, assistance requests, volunteers, relief camps, and available resources. ResQLink addresses '
  'these challenges by providing a unified platform for coordinated emergency response and relief '
  'management.')
H3('1.3 OBJECTIVE')
for o in [
    'To establish a structured digital workflow for emergency-response operations.',
    'To improve the traceability of citizen assistance requests from submission to completion.',
    'To support systematic deployment and monitoring of volunteers during relief activities.',
    'To maintain organized records of relief infrastructure and available resources.',
    'To provide location-based information and operational data that can assist authorities in making informed decisions.',
]:
    B(o)
H3('1.4 SCOPE OF THE PROJECT')
P('The system can be applied to emergency situations such as floods, cyclones, fires, earthquakes, and '
  'other local disasters. It covers the interaction between citizens, volunteers, and authorities '
  'involved in emergency-response activities. The platform can support emergency reporting, assistance '
  'handling, volunteer operations, relief infrastructure, and resource-related activities. Location-based '
  'visualization can be used to understand the geographical distribution of emergencies and relief '
  'facilities. The system provides a foundation that can be extended with real-time communication, '
  'notifications, AI-based prioritization, and offline capabilities in future versions.')
H3('1.5 MOTIVATION')
P('Disasters demand rapid, coordinated, and traceable responses. In many emergency situations, existing '
  'communication channels fragment information and delay the assignment of help. ResQLink motivates this '
  'project by offering a single digital environment where citizens report, volunteers act, and authorities '
  'monitor, reducing the delay between identifying a need and delivering a response.')
story.append(PageBreak())

# ===================== CHAPTER 2 =====================
H1('CHAPTER 2')
H2('RELATED WORK')
H3('2.1 LITERATURE REVIEW')
P('Digital technologies are increasingly used in humanitarian and disaster-response contexts. The '
  'emergent role of digital technologies in the context of humanitarian supply chains has been reviewed '
  'systematically, highlighting logistics, inventory, procurement, coordination, and planning '
  'applications across preparedness, response, and recovery. Recent advances in disaster emergency '
  'response planning integrate optimization, machine learning, and simulation for facility location, '
  'casualty transport, search and rescue, evacuation, and relief distribution.')
P('Citizen-generated reports and crisis maps form another strand of related work. Research on '
  'crowdsourcing crisis information in disaster-affected Haiti examines how crowdsourced information was '
  'collected and processed, and how such reports are turned into usable information during a crisis. '
  'Microblogging and social media reporting have been studied for their contribution to situational '
  'awareness during natural hazards. Digital volunteer coordination has been examined through the concept '
  'of "voluntweeters" - self-organizing by digital volunteers in times of crisis. Geographic Information '
  'Systems for disaster response have been reviewed as a basis for mapping incidents, resources, and '
  'response information. Resource management in disaster relief has been reviewed bibliometrically, '
  'covering relief-resource aspects of emergency logistics.')
H3('2.2 EXISTING SYSTEM')
P('Existing disaster-response approaches often depend on multiple communication channels and separate '
  'tools for different activities. Crisis-mapping platforms such as Ushahidi demonstrate how crowdsourced '
  'information can be collected and visualized during emergencies. Mapping systems help identify '
  'incidents and affected locations from submitted information. However, information collection and '
  'visualization alone do not cover the complete operational workflow of emergency relief. Separate '
  'handling of requests, volunteers, camps, resources, and communication can create coordination gaps '
  'between different response activities.')
H3('2.3 PROPOSED SYSTEM')
P('ResQLink follows a role-based architecture consisting of Citizen, Volunteer, and Administrator access. '
  'Citizens initiate the response process by submitting emergency information or assistance requirements. '
  'Authorities review incoming information and manage the operational workflow through the administrative '
  'interface. Volunteers receive suitable assignments, update their progress, and complete assigned '
  'relief activities. The system maintains related emergency, request, volunteer, camp, resource, and '
  'distribution records in a centralized database.')
story.append(PageBreak())

# ===================== CHAPTER 3 =====================
H1('CHAPTER 3')
H2('SYSTEM ANALYSIS')
H3('3.1 SYSTEM REQUIREMENTS')
P('Functional Requirements:', body_style)
for f in [
    'User registration and login.',
    'Role-based access for Citizen, Volunteer and Administrator.',
    'Citizen emergency reporting and assistance requests.',
    'Volunteer assignment and activity management.',
    'Administrator management of emergency requests.',
    'Relief camp and resource management.',
    'Create, view, update and manage emergency records.',
    'Search and filter emergency-related information.',
    'Status updates for emergency requests.',
    'Location-based emergency information.',
]:
    B(f)
P('Non-Functional Requirements:', body_style)
for f in [
    'Performance: Fast response for emergency-related operations.',
    'Scalability: Support increasing users and emergency records.',
    'Security: Secure authentication and role-based access.',
    'Usability: Simple and responsive interface.',
    'Availability: Reliable access to emergency information.',
    'Maintainability: Modular MERN-based architecture.',
]:
    B(f)
H3('3.2 SOFTWARE AND HARDWARE REQUIREMENTS')
P('Software Requirements:', body_style)
for f in [
    'Frontend: React.js, Vite, React Router, Axios, React Leaflet, Recharts, React Toastify.',
    'Backend: Node.js, Express.js, Mongoose (MongoDB driver), JWT, bcryptjs, express-validator, CORS, Multer.',
    'Database: MongoDB.',
    'Tools: Postman (API testing), Git/GitHub (version control).',
]:
    B(f)
P('Hardware Requirements (recommended):', body_style)
for f in [
    'Processor: Intel/AMD dual-core or better.',
    'RAM: 8 GB or more.',
    'Storage: 500 MB free disk space for the project, plus MongoDB data.',
    'Network: Internet access for MongoDB Atlas or local MongoDB and for map services.',
]:
    B(f)
story.append(PageBreak())

# ===================== CHAPTER 4 =====================
H1('CHAPTER 4')
H2('SYSTEM DESIGN')
H3('4.1 SYSTEM ARCHITECTURE')
P('System Architecture (Diagram 1)', body_style)
make_table([
    ['', 'Citizen / Volunteer / Administrator'],
    ['Frontend', 'React.js + Vite (port 5173) - REST API calls, proxied through Vite to backend'],
    ['Backend', 'Node.js + Express.js (port 5000) - RESTful API, role-based access control'],
    ['Database', 'MongoDB (Mongoose ODM) - emergency, request, volunteer, camp, resource, distribution records'],
])
spacer(0.3*cm)
P('[Place the system architecture diagram from the combined review presentation here.]', caption_style)
H3('4.2 MODULE DESCRIPTION')
P('The system is organized into the following modules:', body_style)
for f in [
    'User Management: Registration, login, JWT issuance, profile management, and role-based access control for Citizen, Volunteer, and Administrator.',
    'Emergency Management: Creating, viewing, updating, and filtering emergency records with location coordinates and severity.',
    'Assistance Request Management: Citizen assistance requests with status updates (pending, assigned, in progress, completed).',
    'Volunteer Management: Volunteer profiles, skills, availability, and activity status.',
    'Relief Camp Management: Camp creation, capacity/occupancy tracking, and viewing.',
    'Resource Management: Inventory of resources with stock levels and low-stock alerts.',
    'Administrator Module: Administrative controls for all management functions.',
    'Notification Module: Status notifications for emergency, request updates, and volunteer assignments.',
]:
    B(f)
P('[Place the module description diagram from the combined review presentation here.]', caption_style)
H3('4.3 USE CASE DIAGRAM')
P('Diagram 3: Use Case Diagram', body_style)
P('[Place the use case diagram from the combined review presentation here.]', caption_style)
P('Actors: Citizen, Volunteer, Administrator. Use cases: Register, Login, Report Emergency, Request '
  'Assistance, View Camps, View Resources, Assign Volunteer, Update Request Status, Manage Emergency '
  'Records, Manage Camp/Resource, View GIS Map, View Analytics.', body_style)
H3('4.4 CLASS DIAGRAM')
P('Diagram 4: Class Diagram (Proposed Design)', body_style)
P('The following class diagram is a proposed design; verify against the actual implementation before '
  'final submission.', body_style)
for c in [
    'User - name, email, phone, password, role (citizen/volunteer/admin), latitude, longitude.',
    'Emergency - title, category, severity, description, location, coordinates, status.',
    'AssistanceRequest - request fields, status, assignedVolunteer, location.',
    'VolunteerProfile - linked to User, skills, availability, status.',
    'VolunteerAssignment - links volunteer to request, status, progress.',
    'ReliefCamp - name, location, capacity, occupancy, status.',
    'Resource - name, type, stock, status.',
    'ResourceDistribution - links resource to camp, quantity, status.',
    'Announcement - message, target roles, isActive.',
]:
    B(c)
P('[Place the class diagram note here; the combined review presentation does not include a class diagram. '
  'Use the proposed-design note above.]', caption_style)
H3('4.5 SEQUENCE DIAGRAM')
P('Diagram 5: Sequence Diagram (Proposed Design)', body_style)
P('The following sequence diagram is a proposed design; verify against the actual implementation before '
  'final submission.', body_style)
P('Citizen -> UI : 1. Register/login; UI -> Backend : 2. Auth service; Backend -> MongoDB : 3. Create '
  'user; MongoDB -> Backend : 4. User created; Backend -> UI : 5. Token returned; UI -> UI : 6. Session '
  'ready', body_style)
P('[Place the sequence diagram note here; the combined review presentation does not include a sequence '
  'diagram. Use the proposed-design note above.]', caption_style)
story.append(PageBreak())

# ===================== CHAPTER 5 =====================
H1('CHAPTER 5')
H2('IMPLEMENTATION')
H3('5.1 IMPLEMENTATION OVERVIEW')
P('The project is implemented as a full-stack web application using the MERN stack.', body_style)
P('Frontend (React.js + Vite): React components for forms, cards, tables, and navigation. React Router '
  'for page navigation. Axios for backend API communication. Role-based dashboard design with separate '
  'interfaces for Citizen, Volunteer, and Administrator. Key pages: Login, Registration, Citizen '
  'Dashboard, Emergency Reporting, Assistance Requests, Volunteer Dashboard, Administrator Dashboard, '
  'Resource/Camp Management.', body_style)
P('Backend (Node.js + Express.js): RESTful API architecture with a modular route structure. '
  'Authentication and authorization with role-based access control. Request validation. Centralized error '
  'handling. Environment-based configuration. MongoDB integration through Mongoose.', body_style)
P('Database (MongoDB + Mongoose): Collections for User, Emergency, AssistanceRequest, VolunteerProfile, '
  'VolunteerAssignment, ReliefCamp, Resource, ResourceDistribution, and Announcement.', body_style)
P('API Testing: Postman used for API endpoint testing.', body_style)
P('Deployment: Frontend and backend deployed; MongoDB deployment configured; final system testing '
  'pending.', body_style)
P('Diagram 6: Implementation Status', body_style)
P('The combined review presentation records approximately 70% overall project completion at the time of '
  'that review.', body_style)
make_table([
    ['Completed:', 'User registration, login, and role-based authentication; Citizen emergency reporting with location data; Assistance request creation and status management; Volunteer assignment lifecycle; Relief camp and resource management; GIS map, analytics, and notifications (backend API); Frontend (React + Vite) and backend (Node + Express) developed.'],
    ['In Progress:', 'Integration testing (1 of 6); API testing (1 of 6); User acceptance testing (1 of 6); UI improvements; Final deployment and documentation (1 of 8).'],
    ['Planned:', 'Full testing suite completion; MongoDB deployment configuration; Final demonstration.'],
])
spacer(0.3*cm)
H3('5.2 KEY FUNCTIONS (CODE EXPLANATION)')
P('The code explanation below is illustrative of the implementation patterns and should be verified '
  'against the actual repository before submission.', body_style)
P('4. Server file (Express server, server.js)', body_style)
P('const express = require(\'express\'); const cors = require(\'cors\'); const dotenv = require(\'dotenv\'); '
  'const connectDB = require(\'./config/db\'); const { errorHandler, notFound } = require(\'./middleware/errorMiddleware\'); '
  'dotenv.config(); connectDB(); const app = express(); '
  'app.use(cors({ origin: process.env.CLIENT_URL || \'http://localhost:5173\', credentials: true })); '
  'app.use(express.json({ limit: \'10mb\' })); '
  'app.use(express.urlencoded({ extended: true })); '
  'app.use(\'/api/auth\', require(\'./routes/authRoutes\')); '
  'app.use(\'/api/emergencies\', require(\'./routes/emergencyRoutes\')); '
  'app.use(\'/api/requests\', require(\'./routes/requestRoutes\')); '
  'app.use(\'/api/volunteers\', require(\'./routes/volunteerRoutes\')); '
  'app.use(\'/api/assignments\', require(\'./routes/assignmentRoutes\')); '
  'app.use(\'/api/camps\', require(\'./routes/campRoutes\')); '
  'app.use(\'/api/resources\', require(\'./routes/resourceRoutes\')); '
  'app.use(\'/api/distributions\', require(\'./routes/distributionRoutes\')); '
  'app.use(\'/api/announcements\', require(\'./routes/announcementRoutes\')); '
  'app.use(\'/api/analytics\', require(\'./routes/analyticsRoutes\')); '
  'app.get(\'/api/health\', (req, res) => { res.json({ status: \'ok\', timestamp: new Date().toISOString() }); }); '
  'app.use(notFound); app.use(errorHandler); '
  'const PORT = process.env.PORT || 5000; '
  'app.listen(PORT, () => { console.log(\'ResQLink server running on port \' + PORT); }); '
  'module.exports = app;', ParagraphStyle('code', parent=body_style, fontName='Courier', fontSize=8.5, leading=11))
P('5. React login component (LoginPage)', body_style)
P('import { useState } from \'react\'; import { Link } from \'react-router-dom\'; import api from \'../../services/api\'; '
  'export default function LoginPage() { const [email, setEmail] = useState(\'\'); const [password, setPassword] = useState(\'\'); '
  'const handleSubmit = async (e) => { e.preventDefault(); const { data } = await api.post(\'/api/auth/login\', { email, password }); '
  'localStorage.setItem(\'token\', data.token); localStorage.setItem(\'user\', JSON.stringify(data.user)); window.location.href = \'/admin\'; }; '
  'return ( ... ); }', ParagraphStyle('code2', parent=body_style, fontName='Courier', fontSize=8.5, leading=11))
P('6. Administrator dashboard logic - fetching KPIs', body_style)
P('const { data } = await api.get(\'/api/analytics/overview\'); // KPIs: active emergencies, pending requests, critical requests, available volunteers, deployed volunteers, active camps, people in camps', ParagraphStyle('code3', parent=body_style, fontName='Courier', fontSize=8.5, leading=11))
P('7. REST API request and response example', body_style)
P('Request: POST /api/auth/login { "email": "admin@resqlink.demo", "password": "demo1234" } '
  'Response: { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", "user": { "name": "Admin User", "email": "admin@resqlink.demo", "role": "admin", ... } } '
  'Request: GET /api/analytics/overview '
  'Response: { "totalEmergencies": 9, "pendingRequests": 5, "criticalRequests": 3, "availableVolunteers": 4, "deployedVolunteers": 1, "activeCamps": 6, "peopleInCamps": 1435, "totalResources": 12, "lowStockItems": 1, "completedTasks": 0 }', ParagraphStyle('code4', parent=body_style, fontName='Courier', fontSize=8.5, leading=11))
P('The demo accounts are: Admin: admin@resqlink.demo / demo1234; Citizen: citizen@resqlink.demo / demo1234; '
  'Volunteer: volunteer@resqlink.demo / demo1234.', body_style)
story.append(PageBreak())

# ===================== CHAPTER 6 =====================
H1('CHAPTER 6')
H2('CONCLUSION & FUTURE WORK')
H3('6.1 CONCLUSION')
P('ResQLink provides a centralized web platform for emergency response and relief coordination. By '
  'combining citizen reporting, volunteer assignment, and administrative management in a role-based MERN '
  'stack architecture, the system delivers the real-time visibility and traceability needed during '
  'emergencies. Logs from the live implementation show the platform operational: the admin dashboard '
  'reports 9 active emergencies, 5 pending requests, 3 critical requests, 4 available volunteers, 1 '
  'deployed volunteer, 6 active camps, and 1435 people in camps, with the GIS map showing all emergencies, '
  'requests, and camps on a single interactive Leaflet map.', body_style)
H3('6.2 FUTURE ENHANCEMENTS')
for f in [
    'Real-time communication and push notifications.',
    'AI-based prioritization of emergency requests.',
    'Offline capabilities for field workers.',
    'Integration with external disaster-response APIs.',
    'Mobile applications for citizen and volunteer users.',
    'Advanced analytics and forecasting of resource needs.',
]:
    B(f)
story.append(PageBreak())

# ===================== APPENDIX =====================
H1('APPENDIX')
H2('SOURCE CODE')
P('The code below is the actual project source code where available. Where the project template contained '
  'placeholder instructions rather than complete source, the code is illustrative of the implementation '
  'pattern and is labeled as such.', body_style)
H3('1. Project Structure')
P('resqlink/', ParagraphStyle('ap1', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('├─ client/  # React frontend', ParagraphStyle('ap2', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('│  ├─ src/', ParagraphStyle('ap3', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('│  │  ├─ components/', ParagraphStyle('ap4', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('│  │  ├─ context/  # AuthContext', ParagraphStyle('ap5', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('│  │  ├─ layouts/  # DashboardLayout', ParagraphStyle('ap6', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('│  │  ├─ pages/', ParagraphStyle('ap7', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('│  │  │  ├─ public/  # LandingPage, LoginPage, RegisterPage', ParagraphStyle('ap8', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('│  │  │  ├─ citizen/  # CitizenDashboard, ReportEmergency, RequestHelp', ParagraphStyle('ap9', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('│  │  │  ├─ volunteer/  # VolunteerDashboard, AvailableTasks, MyAssignments', ParagraphStyle('ap10', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('│  │  │  └─ admin/  # AdminDashboard, GISMap, EmergencyManagement, RequestManagement, VolunteerManagement, CampManagement, ResourceInventory, ResourceDistribution, AnnouncementManagement, AnalyticsDashboard', ParagraphStyle('ap11', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('│  │  ├─ services/  # api.js (axios)', ParagraphStyle('ap12', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('│  │  ├─ main.jsx', ParagraphStyle('ap13', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('│  │  ├─ package.json', ParagraphStyle('ap14', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('│  │  └─ vite.config.js', ParagraphStyle('ap15', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('├─ server/  # Express backend', ParagraphStyle('ap16', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('│  ├─ config/db.js', ParagraphStyle('ap17', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('│  ├─ controllers/', ParagraphStyle('ap18', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('│  │  ├─ authController.js, emergencyController.js, requestController.js, volunteerController.js, assignmentController.js, campController.js, resourceController.js, distributionController.js, announcementController.js, analyticsController.js', ParagraphStyle('ap19', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('│  ├─ middleware/', ParagraphStyle('ap20', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('│  │  ├─ authMiddleware.js, errorMiddleware.js, roleMiddleware.js', ParagraphStyle('ap21', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('│  ├─ models/', ParagraphStyle('ap22', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('│  │  ├─ User.js, Emergency.js, AssistanceRequest.js, VolunteerProfile.js, VolunteerAssignment.js, ReliefCamp.js, Resource.js, ResourceDistribution.js, Announcement.js', ParagraphStyle('ap23', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('│  ├─ routes/', ParagraphStyle('ap24', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('│  │  ├─ authRoutes.js, emergencyRoutes.js, requestRoutes.js, volunteerRoutes.js, assignmentRoutes.js, campRoutes.js, resourceRoutes.js, distributionRoutes.js, announcementRoutes.js, analyticsRoutes.js', ParagraphStyle('ap25', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('│  ├─ seed.js, start-dev.js, server.js, package.json, .env', ParagraphStyle('ap26', parent=body_style, fontName='Courier', fontSize=9, leading=12))
P('└─ (client/ above)', ParagraphStyle('ap27', parent=body_style, fontName='Courier', fontSize=9, leading=12))
H3('2. Backend Package Installation')
P('cd server; npm install; cd ../client; npm install', ParagraphStyle('ap28', parent=body_style, fontName='Courier', fontSize=9, leading=12))
H3('3. Database Connection')
P('const mongoose = require(\'mongoose\'); const connectDB = async () => { try { const conn = await mongoose.connect(process.env.MONGO_URI); console.log(\'MongoDB Connected: \' + conn.connection.host); } catch (error) { console.error(\'Database connection error: \' + error.message); process.exit(1); } }; module.exports = connectDB;', ParagraphStyle('ap29', parent=body_style, fontName='Courier', fontSize=9, leading=12))
H3('4. Environment Variables')
P('.env: PORT=5000; MONGO_URI=mongodb://localhost:27017/resqlink; JWT_SECRET=your_jwt_secret_here_change_in_production; JWT_EXPIRE=7d; CLIENT_URL=http://localhost:5173; NODE_ENV=development', ParagraphStyle('ap30', parent=body_style, fontName='Courier', fontSize=9, leading=12))
H3('5. User Model')
P('const mongoose = require(\'mongoose\'); const userSchema = new mongoose.Schema({ name: { type: String, required: true }, email: { type: String, required: true, unique: true }, password: { type: String, required: true }, phone: { type: String }, role: { type: String, enum: [\'citizen\', \'volunteer\', \'admin\'], required: true }, location: { type: String }, latitude: { type: Number }, longitude: { type: Number }, avatar: { type: String } }, { timestamps: true }); module.exports = mongoose.model(\'User\', userSchema);', ParagraphStyle('ap31', parent=body_style, fontName='Courier', fontSize=9, leading=12))
H3('6. Password Hashing and Registration')
P('const bcrypt = require(\'bcryptjs\'); const jwt = require(\'jsonwebtoken\'); const User = require(\'../models/User\'); exports.register = async (req, res, next) => { try { const { name, email, password, phone, role } = req.body; const existing = await User.findOne({ email }); if (existing) return res.status(400).json({ message: \'User already exists\' }); const hashed = await bcrypt.hash(password, 10); const user = await User.create({ name, email, password: hashed, phone, role }); res.status(201).json({ message: \'User registered\', user: { id: user._id, name, email, role } }); } catch (err) { next(err); } };', ParagraphStyle('ap32', parent=body_style, fontName='Courier', fontSize=9, leading=12))
H3('7. Login and JWT Generation')
P('exports.login = async (req, res, next) => { try { const { email, password } = req.body; const user = await User.findOne({ email }); if (!user) return res.status(401).json({ message: \'Invalid credentials\' }); const isMatch = await bcrypt.compare(password, user.password); if (!isMatch) return res.status(401).json({ message: \'Invalid credentials\' }); const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE }); res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }); } catch (err) { next(err); } };', ParagraphStyle('ap33', parent=body_style, fontName='Courier', fontSize=9, leading=12))
H3('8. Authentication Middleware')
P('const jwt = require(\'jsonwebtoken\'); const User = require(\'../models/User\'); exports.protect = async (req, res, next) => { let token; if (req.headers.authorization?.startsWith(\'Bearer\')) { token = req.headers.authorization.split(\' \')[1]; } if (!token) return res.status(401).json({ message: \'Not authorized\' }); try { const decoded = jwt.verify(token, process.env.JWT_SECRET); req.user = await User.findById(decoded.id); next(); } catch (err) { res.status(401).json({ message: \'Not authorized\' }); } }; exports.authorize = (...roles) => (req, res, next) => { if (!roles.includes(req.user.role)) { return res.status(403).json({ message: \'Access denied\' }); } next(); };', ParagraphStyle('ap34', parent=body_style, fontName='Courier', fontSize=9, leading=12))
H3('9-12. CRUD Operations')
P('const Emergency = require(\'../models/Emergency\'); exports.createEmergency = async (req, res, next) => { try { const emergency = await Emergency.create({ ...req.body, createdBy: req.user._id }); res.status(201).json(emergency); } catch (err) { next(err); } }; exports.getEmergencies = async (req, res, next) => { try { const qs = {}; if (req.query.category) qs.category = req.query.category; if (req.query.status) qs.status = req.query.status; const emergencies = await Emergency.find(qs).sort({ createdAt: -1 }); res.json({ emergencies }); } catch (err) { next(err); } }; exports.updateEmergency = async (req, res, next) => { try { const emergency = await Emergency.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(emergency); } catch (err) { next(err); } }; exports.deleteEmergency = async (req, res, next) => { try { await Emergency.findByIdAndDelete(req.params.id); res.json({ message: \'Deleted\' }); } catch (err) { next(err); } };', ParagraphStyle('ap35', parent=body_style, fontName='Courier', fontSize=9, leading=12))
H3('13. Express Routes')
P('const express = require(\'express\'); const router = express.Router(); const { protect, authorize } = require(\'../middleware/authMiddleware\'); const { createEmergency, getEmergencies, updateEmergency, deleteEmergency } = require(\'../controllers/emergencyController\'); router.route(\'/\').post(protect, authorize(\'admin\', \'citizen\'), createEmergency).get(protect, getEmergencies); router.route(\'/:id\').put(protect, authorize(\'admin\', \'citizen\'), updateEmergency).delete(protect, authorize(\'admin\'), deleteEmergency); module.exports = router;', ParagraphStyle('ap36', parent=body_style, fontName='Courier', fontSize=9, leading=12))
H3('14. Main Server File')
P('(identical to the server.js block in section 5.2; see above)', ParagraphStyle('ap37', parent=body_style, fontName='Courier', fontSize=9, leading=12))
H3('15. React Login Component')
P('(identical to the LoginPage block in section 5.2; see above)', ParagraphStyle('ap38', parent=body_style, fontName='Courier', fontSize=9, leading=12))
H3('16. Admin Dashboard Logic')
P('import { useEffect, useState } from \'react\'; import api from \'../../services/api\'; export default function AdminDashboard() { const [stats, setStats] = useState(null); useEffect(() => { api.get(\'/api/analytics/overview\') .then((r) => setStats(r.data)) .catch(() => {}); }, []); return ( ... ); }', ParagraphStyle('ap39', parent=body_style, fontName='Courier', fontSize=9, leading=12))
H3('17. REST API Request and Response Examples')
P('Request: POST /api/auth/login { "email": "admin@resqlink.demo", "password": "demo1234" } '
  'Response: { "token": "...", "user": { "id": "...", "name": "Admin User", "email": "admin@resqlink.demo", "role": "admin" } } '
  'Request: GET /api/analytics/overview '
  'Response: { "totalEmergencies": 9, "pendingRequests": 5, "criticalRequests": 3, "availableVolunteers": 4, "deployedVolunteers": 1, "activeCamps": 6, "peopleInCamps": 1435, "totalResources": 12, "lowStockItems": 1, "completedTasks": 0 }', ParagraphStyle('ap40', parent=body_style, fontName='Courier', fontSize=9, leading=12))

# ---- footer with page numbers ----
def footer(canvas, doc):
    canvas.saveState()
    canvas.setFont('Times-Italic', 9)
    canvas.setFillColor(colors.grey)
    canvas.drawString(2*cm, 1.2*cm, 'Smart Emergency Response & Relief Coordination Platform (ResQLink)')
    canvas.drawRightString(A4[0] - 2*cm, 1.2*cm, 'Page %d' % doc.page)
    canvas.restoreState()

doc_out = r'D:\fsd project\ResQLink-Project-Report.pdf'
pdf = SimpleDocTemplate(doc_out, pagesize=A4,
                        leftMargin=2*cm, rightMargin=2*cm,
                        topMargin=2*cm, bottomMargin=2.2*cm,
                        title='Smart Emergency Response & Relief Coordination Platform',
                        author='Pranav A-310624148068')
pdf.build(story, onFirstPage=footer, onLaterPages=footer)

print('PDF written:', doc_out)
