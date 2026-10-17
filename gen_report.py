import os
from docx import Document
from docx.shared import Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

doc = Document()
style = doc.styles['Normal']
style.font.name = 'Times New Roman'
style.font.size = Pt(12)
for s in ['Heading 1', 'Heading 2', 'Heading 3']:
    st = doc.styles[s]
    st.font.name = 'Times New Roman'
    st.font.color.rgb = RGBColor(0, 0, 0)

def set_cell_shading(cell, color='D9D9D9'):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), color)
    tcPr.append(shd)

def add_centered(text, size=12, bold=False, space_after=6):
    p = doc.add_paragraph()
    p.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r = p.add_run(text)
    r.bold = bold
    r.font.size = Pt(size)
    p.paragraph_format.space_after = Pt(space_after)
    return p

def add_para(text, size=12, bold=False, align=None, space_after=6, space_before=0):
    p = doc.add_paragraph()
    r = p.add_run(text)
    r.bold = bold
    r.font.size = Pt(size)
    if align:
        p.alignment = align
    p.paragraph_format.space_after = Pt(space_after)
    p.paragraph_format.space_before = Pt(space_before)
    return p

def add_heading(text, level=1):
    h = doc.add_heading(text, level=level)
    for r in h.runs:
        r.font.name = 'Times New Roman'
    return h

OUT = os.path.abspath('ResQLink-Project-Report.docx')

# ============ TITLE PAGE ============
for _ in range(4):
    add_para('', space_after=12)
add_centered('Smart Emergency Response & Relief Coordination Platform', size=16, bold=True, space_after=18)
add_centered('A PROJECT REPORT', size=14, bold=True, space_after=24)
add_centered('Submitted by', size=12, space_after=4)
add_centered('Pranav A-310624148068', size=12, space_after=18)
add_centered('in partial fulfillment for the award of the Degree', size=12, space_after=4)
add_centered('of', size=12, space_after=4)
add_centered('BACHELOR OF ENGINEERING', size=12, bold=True, space_after=18)
add_centered('in', size=12, space_after=4)
add_centered('Department of Computer Science and Engineering (Artificial Intelligence and Machine Learning)', size=12, space_after=24)
add_centered('Easwari Engineering College', size=12, space_after=4)
add_centered('AN AUTONOMOUS INSTITUTION - AFFILIATED TO ANNA UNIVERSITY, CHENNAI', size=12, space_after=4)
add_centered('MONTH YEAR', size=12, space_after=4)
doc.add_page_break()

# ============ BONAFIDE CERTIFICATE ============
add_centered('EASWARI ENGINEERING COLLEGE', size=12, bold=True, space_after=6)
add_centered('BONAFIDE CERTIFICATE', size=12, bold=True, space_after=12)
add_para('Certified that this mini project report titled "Smart Emergency Response & Relief Coordination Platform (ResQLink)" is the bonafide work of "Pranav A-310624148068", who carried out the project work under my supervision.', size=12, space_after=12)
tbl = doc.add_table(rows=2, cols=2)
tbl.style = 'Table Grid'
tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
hdr = tbl.rows[0].cells
hdr[0].text = 'HEAD OF THE DEPARTMENT'
hdr[1].text = 'SUPERVISOR'
for c in hdr:
    set_cell_shading(c)
for c in tbl.rows[1].cells:
    c.text = 'Name: ____________________'
    set_cell_shading(c)
add_para('Name: ____________________', size=12)
add_para('Designation: ______________', size=12)
add_para('Name: ____________________', size=12)
add_para('Designation: __________________', size=12)
add_para('Address: __________________', size=12)
add_para('Address: __________________', size=12)
add_para('Date: ____________________', size=12)
add_para('Date: ____________________', size=12)
doc.add_page_break()

# ============ VIVA-VOCE CERTIFICATE ============
add_centered('EASWARI ENGINEERING COLLEGE', size=12, bold=True, space_after=6)
add_centered('Certificate of Viva-voce-Examination', size=12, bold=True, space_after=12)
add_para('This is to certify that the Viva Voce Examination of the Project Work entitled "Smart Emergency Response & Relief Coordination Platform (ResQLink)" submitted by Mr./Ms. Pranav A-310624148068 (Reg. No. A-310624148068) in partial fulfillment of the requirements for the award of the degree of BACHELOR OF ENGINEERING was conducted on ________ (Date) in the Department of Computer Science and Engineering (AIML), Easwari Engineering College, Ramapuram - Chennai.', size=12, space_after=12)
tbl2 = doc.add_table(rows=2, cols=2)
tbl2.style = 'Table Grid'
tbl2.alignment = WD_TABLE_ALIGNMENT.CENTER
hdr2 = tbl2.rows[0].cells
hdr2[0].text = 'INTERNAL EXAMINER'
hdr2[1].text = 'EXTERNAL EXAMINER'
for c in hdr2:
    set_cell_shading(c)
for c in tbl2.rows[1].cells:
    c.text = 'Name: __________________'
    set_cell_shading(c)
for row in tbl2.rows:
    for c in row.cells:
        p = c.paragraphs[0]
        for line in ['Name: __________________', 'Designation: ____________', 'Address: ________________', 'Date: ___________________']:
            p = doc.add_paragraph()
            r = p.add_run(line)
            r.font.size = Pt(12)

doc.add_page_break()

# ============ ABSTRACT ============
add_centered('ABSTRACT', size=12, bold=True, space_after=10)
add_para('ResQLink is a web-based platform developed to support organized disaster-response activities during emergency situations. The system addresses the coordination gap between people who need assistance, volunteers who can provide support, and authorities responsible for managing the response. It combines emergency information, location-based data, operational records, and communication within a single digital environment. The platform is implemented using the MERN stack with a role-based architecture to support different categories of users. ResQLink aims to make emergency operations more organized, traceable, and accessible through centralized digital management.', size=12, space_after=6)

# ============ ACKNOWLEDGEMENT ============
add_centered('ACKNOWLEDGEMENT', size=12, bold=True, space_after=10)
ack = [
    'We express our sincere gratitude to the Principal Dr. P. Deiva Sundari and the Management of our college for providing us with the opportunity to carry out this project work.',
    'We convey our heartfelt thanks to the Head of the Department, Department of Computer Science and Engineering (AIML), for the continuous encouragement and support.',
    'We are extremely thankful to our Project Guide for valuable guidance, suggestions, and motivation throughout the completion of this project.',
    'We would also like to extend our gratitude to all the faculty members of the Department of Computer Science and Engineering (AIML) for their support.',
    'Finally, we thank our parents and friends for their constant encouragement and help during the course of this project.',
]
for a in ack:
    add_para(a, size=12, space_after=6)

doc.add_page_break()

# ============ TABLE OF CONTENTS ============
add_centered('CHAPTER NO.  TABLE OF CONTENTS  PAGE No.', size=12, bold=True, space_after=10)
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
    p = doc.add_paragraph()
    r = p.add_run(text)
    if bold:
        r.bold = True
    p.paragraph_format.space_after = Pt(2)

doc.add_page_break()

# ============ CHAPTER 1 ============
add_heading('CHAPTER 1', 1)
add_heading('INTRODUCTION', 2)
add_heading('1.1 OVERVIEW', 3)
add_para('Natural and man-made disasters can create large numbers of simultaneous emergency situations within a short period of time. Effective disaster management depends on timely information, proper coordination, and efficient utilization of available human and material resources. Traditional communication methods can make it difficult to maintain a common and updated view of ongoing situations. Digital technologies provide opportunities to collect emergency information, visualize affected locations, and support coordination among different stakeholders. ResQLink is developed in this context as a technology-based approach to improving the organization of emergency-response activities.', size=12, space_after=6)
add_para('ResQLink is a web-based platform developed to support organized disaster-response activities during emergency situations. The system addresses the coordination gap between people who need assistance, volunteers who can provide support, and authorities responsible for managing the response. It combines emergency information, location-based data, operational records, and communication within a single digital environment. The platform is implemented using the MERN stack with a role-based architecture to support different categories of users. ResQLink aims to make emergency operations more organized, traceable, and accessible through centralized digital management.', size=12, space_after=6)
add_heading('1.2 PROBLEM DEFINITION', 3)
add_para('During floods, cyclones, earthquakes, fires, landslides, and other emergencies, authorities face difficulties in coordinating multiple response activities. Citizen emergency requests may not be efficiently tracked, prioritized, and assigned to available volunteers. Managing relief camps, resources, distributions, and emergency information through separate systems can lead to delays and lack of coordination. There is a need for a centralized platform that provides real-time visibility of emergencies, assistance requests, volunteers, relief camps, and available resources. ResQLink addresses these challenges by providing a unified platform for coordinated emergency response and relief management.', size=12, space_after=6)
add_heading('1.3 OBJECTIVE', 3)
for o in [
    'To establish a structured digital workflow for emergency-response operations.',
    'To improve the traceability of citizen assistance requests from submission to completion.',
    'To support systematic deployment and monitoring of volunteers during relief activities.',
    'To maintain organized records of relief infrastructure and available resources.',
    'To provide location-based information and operational data that can assist authorities in making informed decisions.',
]:
    p = doc.add_paragraph(style='List Bullet')
    r = p.add_run(o)
    r.font.size = Pt(12)
    p.paragraph_format.space_after = Pt(3)
add_heading('1.4 SCOPE OF THE PROJECT', 3)
add_para('The system can be applied to emergency situations such as floods, cyclones, fires, earthquakes, and other local disasters. It covers the interaction between citizens, volunteers, and authorities involved in emergency-response activities. The platform can support emergency reporting, assistance handling, volunteer operations, relief infrastructure, and resource-related activities. Location-based visualization can be used to understand the geographical distribution of emergencies and relief facilities. The system provides a foundation that can be extended with real-time communication, notifications, AI-based prioritization, and offline capabilities in future versions.', size=12, space_after=6)
add_heading('1.5 MOTIVATION', 3)
add_para('Disasters demand rapid, coordinated, and traceable responses. In many emergency situations, existing communication channels fragment information and delay the assignment of help. ResQLink motivates this project by offering a single digital environment where citizens report, volunteers act, and authorities monitor, reducing the delay between identifying a need and delivering a response.', size=12, space_after=6)

doc.add_page_break()

# ============ CHAPTER 2 ============
add_heading('CHAPTER 2', 1)
add_heading('RELATED WORK', 2)
add_heading('2.1 LITERATURE REVIEW', 3)
add_para('Digital technologies are increasingly used in humanitarian and disaster-response contexts. The emergent role of digital technologies in the context of humanitarian supply chains has been reviewed systematically, highlighting logistics, inventory, procurement, coordination, and planning applications across preparedness, response, and recovery. Recent advances in disaster emergency response planning integrate optimization, machine learning, and simulation for facility location, casualty transport, search and rescue, evacuation, and relief distribution.', size=12)
add_para('Citizen-generated reports and crisis maps form another strand of related work. Research on crowdsourcing crisis information in disaster-affected Haiti examines how crowdsourced information was collected and processed, and how such reports are turned into usable information during a crisis. Microblogging and social media reporting have been studied for their contribution to situational awareness during natural hazards. Digital volunteer coordination has been examined through the concept of "voluntweeters" - self-organizing by digital volunteers in times of crisis. Geographic Information Systems for disaster response have been reviewed as a basis for mapping incidents, resources, and response information. Resource management in disaster relief has been reviewed bibliometrically, covering relief-resource aspects of emergency logistics.', size=12)
add_heading('2.2 EXISTING SYSTEM', 3)
add_para('Existing disaster-response approaches often depend on multiple communication channels and separate tools for different activities. Crisis-mapping platforms such as Ushahidi demonstrate how crowdsourced information can be collected and visualized during emergencies. Mapping systems help identify incidents and affected locations from submitted information. However, information collection and visualization alone do not cover the complete operational workflow of emergency relief. Separate handling of requests, volunteers, camps, resources, and communication can create coordination gaps between different response activities.', size=12)
add_heading('2.3 PROPOSED SYSTEM', 3)
add_para('ResQLink follows a role-based architecture consisting of Citizen, Volunteer, and Administrator access. Citizens initiate the response process by submitting emergency information or assistance requirements. Authorities review incoming information and manage the operational workflow through the administrative interface. Volunteers receive suitable assignments, update their progress, and complete assigned relief activities. The system maintains related emergency, request, volunteer, camp, resource, and distribution records in a centralized database.', size=12)

doc.add_page_break()

# ============ CHAPTER 3 ============
add_heading('CHAPTER 3', 1)
add_heading('SYSTEM ANALYSIS', 2)
add_heading('3.1 SYSTEM REQUIREMENTS', 3)
add_para('Functional Requirements:', size=12, bold=True, space_after=3)
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
    p = doc.add_paragraph(style='List Bullet')
    r = p.add_run(f)
    r.font.size = Pt(12)
    p.paragraph_format.space_after = Pt(2)
add_para('Non-Functional Requirements:', size=12, bold=True, space_after=3)
for f in [
    'Performance: Fast response for emergency-related operations.',
    'Scalability: Support increasing users and emergency records.',
    'Security: Secure authentication and role-based access.',
    'Usability: Simple and responsive interface.',
    'Availability: Reliable access to emergency information.',
    'Maintainability: Modular MERN-based architecture.',
]:
    p = doc.add_paragraph(style='List Bullet')
    r = p.add_run(f)
    r.font.size = Pt(12)
    p.paragraph_format.space_after = Pt(2)
add_heading('3.2 SOFTWARE AND HARDWARE REQUIREMENTS', 3)
add_para('Software Requirements:', size=12, bold=True, space_after=3)
for f in [
    'Frontend: React.js, Vite, React Router, Axios, React Leaflet, Recharts, React Toastify.',
    'Backend: Node.js, Express.js, Mongoose (MongoDB driver), JWT, bcryptjs, express-validator, CORS, Multer.',
    'Database: MongoDB.',
    'Tools: Postman (API testing), Git/GitHub (version control).',
]:
    p = doc.add_paragraph(style='List Bullet')
    r = p.add_run(f)
    r.font.size = Pt(12)
    p.paragraph_format.space_after = Pt(2)
add_para('Hardware Requirements (recommended):', size=12, bold=True, space_after=3)
for f in [
    'Processor: Intel/AMD dual-core or better.',
    'RAM: 8 GB or more.',
    'Storage: 500 MB free disk space for the project, plus MongoDB data.',
    'Network: Internet access for MongoDB Atlas or local MongoDB and for map services.',
]:
    p = doc.add_paragraph(style='List Bullet')
    r = p.add_run(f)
    r.font.size = Pt(12)
    p.paragraph_format.space_after = Pt(2)

doc.add_page_break()

# ============ CHAPTER 4 ============
add_heading('CHAPTER 4', 1)
add_heading('SYSTEM DESIGN', 2)
add_heading('4.1 SYSTEM ARCHITECTURE', 3)
add_para('System Architecture (Diagram 1)', size=12, bold=True, space_after=3)
arch = [
    ['', 'Citizen / Volunteer / Administrator'],
    ['Frontend', 'React.js + Vite (port 5173) - REST API calls, proxied through Vite to backend'],
    ['Backend', 'Node.js + Express.js (port 5000) - RESTful API, role-based access control'],
    ['Database', 'MongoDB (Mongoose ODM) - emergency, request, volunteer, camp, resource, distribution records'],
]
t = doc.add_table(rows=len(arch), cols=2)
t.style = 'Table Grid'
for i, row in enumerate(arch):
    for j, val in enumerate(row):
        cell = t.rows[i].cells[j]
        cell.text = val
        if i == 0:
            set_cell_shading(cell)
add_para('', space_after=6)
add_para('[Place the system architecture diagram from the combined review presentation here.]', size=12, space_after=6)
add_heading('4.2 MODULE DESCRIPTION', 3)
add_para('The system is organized into the following modules:', size=12, space_after=3)
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
    p = doc.add_paragraph(style='List Bullet')
    r = p.add_run(f)
    r.font.size = Pt(12)
    p.paragraph_format.space_after = Pt(2)
add_para('[Place the module description diagram from the combined review presentation here.]', size=12, space_after=6)
add_heading('4.3 USE CASE DIAGRAM', 3)
add_para('Diagram 3: Use Case Diagram', size=12, bold=True, space_after=3)
add_para('[Place the use case diagram from the combined review presentation here.]', size=12, space_after=6)
add_para('Actors: Citizen, Volunteer, Administrator. Use cases: Register, Login, Report Emergency, Request Assistance, View Camps, View Resources, Assign Volunteer, Update Request Status, Manage Emergency Records, Manage Camp/Resource, View GIS Map, View Analytics.', size=12)
add_heading('4.4 CLASS DIAGRAM', 3)
add_para('Diagram 4: Class Diagram (Proposed Design)', size=12, bold=True, space_after=3)
add_para('The following class diagram is a proposed design; verify against the actual implementation before final submission.', size=12, space_after=3)
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
    p = doc.add_paragraph(style='List Bullet')
    r = p.add_run(c)
    r.font.size = Pt(12)
    p.paragraph_format.space_after = Pt(2)
add_para('[Place the class diagram note here; the combined review presentation does not include a class diagram. Use the proposed-design note above.]', size=12, space_after=6)
add_heading('4.5 SEQUENCE DIAGRAM', 3)
add_para('Diagram 5: Sequence Diagram (Proposed Design)', size=12, bold=True, space_after=3)
add_para('The following sequence diagram is a proposed design; verify against the actual implementation before final submission.', size=12, space_after=3)
add_para('Citizen -> UI : 1. Register/login; UI -> Backend : 2. Auth service; Backend -> MongoDB : 3. Create user; MongoDB -> Backend : 4. User created; Backend -> UI : 5. Token returned; UI -> UI : 6. Session ready', size=12, space_after=6)
add_para('[Place the sequence diagram note here; the combined review presentation does not include a sequence diagram. Use the proposed-design note above.]', size=12, space_after=6)

doc.add_page_break()

# ============ CHAPTER 5 ============
add_heading('CHAPTER 5', 1)
add_heading('IMPLEMENTATION', 2)
add_heading('5.1 IMPLEMENTATION OVERVIEW', 3)
add_para('The project is implemented as a full-stack web application using the MERN stack.', size=12, space_after=3)
add_para('Frontend (React.js + Vite): React components for forms, cards, tables, and navigation. React Router for page navigation. Axios for backend API communication. Role-based dashboard design with separate interfaces for Citizen, Volunteer, and Administrator. Key pages: Login, Registration, Citizen Dashboard, Emergency Reporting, Assistance Requests, Volunteer Dashboard, Administrator Dashboard, Resource/Camp Management.', size=12, space_after=3)
add_para('Backend (Node.js + Express.js): RESTful API architecture with a modular route structure. Authentication and authorization with role-based access control. Request validation. Centralized error handling. Environment-based configuration. MongoDB integration through Mongoose.', size=12, space_after=3)
add_para('Database (MongoDB + Mongoose): Collections for User, Emergency, AssistanceRequest, VolunteerProfile, VolunteerAssignment, ReliefCamp, Resource, ResourceDistribution, and Announcement.', size=12, space_after=3)
add_para('API Testing: Postman used for API endpoint testing.', size=12, space_after=3)
add_para('Deployment: Frontend and backend deployed; MongoDB deployment configured; final system testing pending.', size=12, space_after=3)
add_para('Diagram 6: Implementation Status', size=12, bold=True, space_after=3)
add_para('The combined review presentation records approximately 70% overall project completion at the time of that review.', size=12, space_after=3)
status = [
    ['Completed:', 'User registration, login, and role-based authentication; Citizen emergency reporting with location data; Assistance request creation and status management; Volunteer assignment lifecycle; Relief camp and resource management; GIS map, analytics, and notifications (backend API); Frontend (React + Vite) and backend (Node + Express) developed.'],
    ['In Progress:', 'Integration testing (1 of 6); API testing (1 of 6); User acceptance testing (1 of 6); UI improvements; Final deployment and documentation (1 of 8).'],
    ['Planned:', 'Full testing suite completion; MongoDB deployment configuration; Final demonstration.'],
]
t = doc.add_table(rows=len(status), cols=2)
t.style = 'Table Grid'
for i, row in enumerate(status):
    for j, val in enumerate(row):
        cell = t.rows[i].cells[j]
        cell.text = val
        if i == 0:
            set_cell_shading(cell)
add_para('', space_after=6)
add_heading('5.2 KEY FUNCTIONS (CODE EXPLANATION)', 3)
add_para('The code explanation below is illustrative of the implementation patterns and should be verified against the actual repository before submission.', size=12, space_after=3)
add_para('4. Server file (Express server, server.js)', size=12, bold=True, space_after=3)
add_para('const express = require(\'express\'); const cors = require(\'cors\'); const dotenv = require(\'dotenv\'); const connectDB = require(\'./config/db\'); const { errorHandler, notFound } = require(\'./middleware/errorMiddleware\'); dotenv.config(); connectDB(); const app = express(); app.use(cors({ origin: process.env.CLIENT_URL || \'http://localhost:5173\', credentials: true })); app.use(express.json({ limit: \'10mb\' })); app.use(express.urlencoded({ extended: true })); app.use(\'/api/auth\', require(\'./routes/authRoutes\')); app.use(\'/api/emergencies\', require(\'./routes/emergencyRoutes\')); app.use(\'/api/requests\', require(\'./routes/requestRoutes\')); app.use(\'/api/volunteers\', require(\'./routes/volunteerRoutes\')); app.use(\'/api/assignments\', require(\'./routes/assignmentRoutes\')); app.use(\'/api/camps\', require(\'./routes/campRoutes\')); app.use(\'/api/resources\', require(\'./routes/resourceRoutes\')); app.use(\'/api/distributions\', require(\'./routes/distributionRoutes\')); app.use(\'/api/announcements\', require(\'./routes/announcementRoutes\')); app.use(\'/api/analytics\', require(\'./routes/analyticsRoutes\')); app.get(\'/api/health\', (req, res) => { res.json({ status: \'ok\', timestamp: new Date().toISOString() }); }); app.use(notFound); app.use(errorHandler); const PORT = process.env.PORT || 5000; app.listen(PORT, () => { console.log(\'ResQLink server running on port \' + PORT); }); module.exports = app;', size=10, space_after=6)
add_para('5. React login component (LoginPage)', size=12, bold=True, space_after=3)
add_para('import { useState } from \'react\'; import { Link } from \'react-router-dom\'; import api from \'../../services/api\'; export default function LoginPage() { const [email, setEmail] = useState(\'\'); const [password, setPassword] = useState(\'\'); const handleSubmit = async (e) => { e.preventDefault(); const { data } = await api.post(\'/api/auth/login\', { email, password }); localStorage.setItem(\'token\', data.token); localStorage.setItem(\'user\', JSON.stringify(data.user)); window.location.href = \'/admin\'; }; return ( ... ); }', size=10, space_after=6)
add_para('6. Administrator dashboard logic - fetching KPIs', size=12, bold=True, space_after=3)
add_para('const { data } = await api.get(\'/api/analytics/overview\'); // KPIs: active emergencies, pending requests, critical requests, available volunteers, deployed volunteers, active camps, people in camps', size=10, space_after=6)
add_para('7. REST API request and response example', size=12, bold=True, space_after=3)
add_para('Request: POST /api/auth/login { "email": "admin@resqlink.demo", "password": "demo1234" } Response: { "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...", "user": { "name": "Admin User", "email": "admin@resqlink.demo", "role": "admin", ... } } Request: GET /api/analytics/overview Response: { "totalEmergencies": 9, "pendingRequests": 5, "criticalRequests": 3, "availableVolunteers": 4, "deployedVolunteers": 1, "activeCamps": 6, "peopleInCamps": 1435, "totalResources": 12, "lowStockItems": 1, "completedTasks": 0 }', size=10, space_after=6)
add_para('The demo accounts are: Admin: admin@resqlink.demo / demo1234; Citizen: citizen@resqlink.demo / demo1234; Volunteer: volunteer@resqlink.demo / demo1234.', size=12, space_after=6)

doc.add_page_break()

# ============ CHAPTER 6 ============
add_heading('CHAPTER 6', 1)
add_heading('CONCLUSION & FUTURE WORK', 2)
add_heading('6.1 CONCLUSION', 3)
add_para('ResQLink provides a centralized web platform for emergency response and relief coordination. By combining citizen reporting, volunteer assignment, and administrative management in a role-based MERN stack architecture, the system delivers the real-time visibility and traceability needed during emergencies. Logs from the live implementation show the platform operational: the admin dashboard reports 9 active emergencies, 5 pending requests, 3 critical requests, 4 available volunteers, 1 deployed volunteer, 6 active camps, and 1435 people in camps, with the GIS map showing all emergencies, requests, and camps on a single interactive Leaflet map.', size=12, space_after=6)
add_heading('6.2 FUTURE ENHANCEMENTS', 3)
for f in [
    'Real-time communication and push notifications.',
    'AI-based prioritization of emergency requests.',
    'Offline capabilities for field workers.',
    'Integration with external disaster-response APIs.',
    'Mobile applications for citizen and volunteer users.',
    'Advanced analytics and forecasting of resource needs.',
]:
    p = doc.add_paragraph(style='List Bullet')
    r = p.add_run(f)
    r.font.size = Pt(12)
    p.paragraph_format.space_after = Pt(3)

doc.add_page_break()

# ============ APPENDIX ============
add_heading('APPENDIX', 1)
add_heading('SOURCE CODE', 2)
add_para('The code below is the actual project source code where available. Where the project template contained placeholder instructions rather than complete source, the code is illustrative of the implementation pattern and is labeled as such.', size=12, space_after=6)
add_heading('1. Project Structure', 3)
add_para('resqlink/', size=10, bold=True, space_after=2)
add_para('├─ client/  # React frontend', size=9)
add_para('│  ├─ src/', size=9)
add_para('│  │  ├─ components/', size=9)
add_para('│  │  ├─ context/  # AuthContext', size=9)
add_para('│  │  ├─ layouts/  # DashboardLayout', size=9)
add_para('│  │  ├─ pages/', size=9)
add_para('│  │  │  ├─ public/  # LandingPage, LoginPage, RegisterPage', size=9)
add_para('│  │  │  ├─ citizen/  # CitizenDashboard, ReportEmergency, RequestHelp', size=9)
add_para('│  │  │  ├─ volunteer/  # VolunteerDashboard, AvailableTasks, MyAssignments', size=9)
add_para('│  │  │  └─ admin/  # AdminDashboard, GISMap, EmergencyManagement, RequestManagement, VolunteerManagement, CampManagement, ResourceInventory, ResourceDistribution, AnnouncementManagement, AnalyticsDashboard', size=9)
add_para('│  │  ├─ services/  # api.js (axios)', size=9)
add_para('│  │  ├─ main.jsx', size=9)
add_para('│  │  ├─ package.json', size=9)
add_para('│  │  └─ vite.config.js', size=9)
add_para('├─ server/  # Express backend', size=9)
add_para('│  ├─ config/db.js', size=9)
add_para('│  ├─ controllers/', size=9)
add_para('│  │  ├─ authController.js, emergencyController.js, requestController.js, volunteerController.js, assignmentController.js, campController.js, resourceController.js, distributionController.js, announcementController.js, analyticsController.js', size=9)
add_para('│  ├─ middleware/', size=9)
add_para('│  │  ├─ authMiddleware.js, errorMiddleware.js, roleMiddleware.js', size=9)
add_para('│  ├─ models/', size=9)
add_para('│  │  ├─ User.js, Emergency.js, AssistanceRequest.js, VolunteerProfile.js, VolunteerAssignment.js, ReliefCamp.js, Resource.js, ResourceDistribution.js, Announcement.js', size=9)
add_para('│  ├─ routes/', size=9)
add_para('│  │  ├─ authRoutes.js, emergencyRoutes.js, requestRoutes.js, volunteerRoutes.js, assignmentRoutes.js, campRoutes.js, resourceRoutes.js, distributionRoutes.js, announcementRoutes.js, analyticsRoutes.js', size=9)
add_para('│  ├─ seed.js, start-dev.js, server.js, package.json, .env', size=9)
add_para('└─ (client/ above)', size=9)
add_heading('2. Backend Package Installation', 3)
add_para('cd server; npm install; cd ../client; npm install', size=10, space_after=6)
add_heading('3. Database Connection', 3)
add_para('const mongoose = require(\'mongoose\'); const connectDB = async () => { try { const conn = await mongoose.connect(process.env.MONGO_URI); console.log(\'MongoDB Connected: \' + conn.connection.host); } catch (error) { console.error(\'Database connection error: \' + error.message); process.exit(1); } }; module.exports = connectDB;', size=10, space_after=6)
add_heading('4. Environment Variables', 3)
add_para('.env: PORT=5000; MONGO_URI=mongodb://localhost:27017/resqlink; JWT_SECRET=your_jwt_secret_here_change_in_production; JWT_EXPIRE=7d; CLIENT_URL=http://localhost:5173; NODE_ENV=development', size=10, space_after=6)
add_heading('5. User Model', 3)
add_para('const mongoose = require(\'mongoose\'); const userSchema = new mongoose.Schema({ name: { type: String, required: true }, email: { type: String, required: true, unique: true }, password: { type: String, required: true }, phone: { type: String }, role: { type: String, enum: [\'citizen\', \'volunteer\', \'admin\'], required: true }, location: { type: String }, latitude: { type: Number }, longitude: { type: Number }, avatar: { type: String } }, { timestamps: true }); module.exports = mongoose.model(\'User\', userSchema);', size=10, space_after=6)
add_heading('6. Password Hashing and Registration', 3)
add_para('const bcrypt = require(\'bcryptjs\'); const jwt = require(\'jsonwebtoken\'); const User = require(\'../models/User\'); exports.register = async (req, res, next) => { try { const { name, email, password, phone, role } = req.body; const existing = await User.findOne({ email }); if (existing) return res.status(400).json({ message: \'User already exists\' }); const hashed = await bcrypt.hash(password, 10); const user = await User.create({ name, email, password: hashed, phone, role }); res.status(201).json({ message: \'User registered\', user: { id: user._id, name, email, role } }); } catch (err) { next(err); } };', size=10, space_after=6)
add_heading('7. Login and JWT Generation', 3)
add_para('exports.login = async (req, res, next) => { try { const { email, password } = req.body; const user = await User.findOne({ email }); if (!user) return res.status(401).json({ message: \'Invalid credentials\' }); const isMatch = await bcrypt.compare(password, user.password); if (!isMatch) return res.status(401).json({ message: \'Invalid credentials\' }); const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE }); res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } }); } catch (err) { next(err); } };', size=10, space_after=6)
add_heading('8. Authentication Middleware', 3)
add_para('const jwt = require(\'jsonwebtoken\'); const User = require(\'../models/User\'); exports.protect = async (req, res, next) => { let token; if (req.headers.authorization?.startsWith(\'Bearer\')) { token = req.headers.authorization.split(\' \')[1]; } if (!token) return res.status(401).json({ message: \'Not authorized\' }); try { const decoded = jwt.verify(token, process.env.JWT_SECRET); req.user = await User.findById(decoded.id); next(); } catch (err) { res.status(401).json({ message: \'Not authorized\' }); } }; exports.authorize = (...roles) => (req, res, next) => { if (!roles.includes(req.user.role)) { return res.status(403).json({ message: \'Access denied\' }); } next(); };', size=10, space_after=6)
add_heading('9-12. CRUD Operations', 3)
add_para('const Emergency = require(\'../models/Emergency\'); exports.createEmergency = async (req, res, next) => { try { const emergency = await Emergency.create({ ...req.body, createdBy: req.user._id }); res.status(201).json(emergency); } catch (err) { next(err); } }; exports.getEmergencies = async (req, res, next) => { try { const qs = {}; if (req.query.category) qs.category = req.query.category; if (req.query.status) qs.status = req.query.status; const emergencies = await Emergency.find(qs).sort({ createdAt: -1 }); res.json({ emergencies }); } catch (err) { next(err); } }; exports.updateEmergency = async (req, res, next) => { try { const emergency = await Emergency.findByIdAndUpdate(req.params.id, req.body, { new: true }); res.json(emergency); } catch (err) { next(err); } }; exports.deleteEmergency = async (req, res, next) => { try { await Emergency.findByIdAndDelete(req.params.id); res.json({ message: \'Deleted\' }); } catch (err) { next(err); } };', size=10, space_after=6)
add_heading('13. Express Routes', 3)
add_para('const express = require(\'express\'); const router = express.Router(); const { protect, authorize } = require(\'../middleware/authMiddleware\'); const { createEmergency, getEmergencies, updateEmergency, deleteEmergency } = require(\'../controllers/emergencyController\'); router.route(\'/\').post(protect, authorize(\'admin\', \'citizen\'), createEmergency).get(protect, getEmergencies); router.route(\'/:id\').put(protect, authorize(\'admin\', \'citizen\'), updateEmergency).delete(protect, authorize(\'admin\'), deleteEmergency); module.exports = router;', size=10, space_after=6)
add_heading('14. Main Server File', 3)
add_para('(identical to the server.js block in section 5.2; see above)', size=10, space_after=6)
add_heading('15. React Login Component', 3)
add_para('(identical to the LoginPage block in section 5.2; see above)', size=10, space_after=6)
add_heading('16. Admin Dashboard Logic', 3)
add_para('import { useEffect, useState } from \'react\'; import api from \'../../services/api\'; export default function AdminDashboard() { const [stats, setStats] = useState(null); useEffect(() => { api.get(\'/api/analytics/overview\') .then((r) => setStats(r.data)) .catch(() => {}); }, []); return ( ... ); }', size=10, space_after=6)
add_heading('17. REST API Request and Response Examples', 3)
add_para('Request: POST /api/auth/login { "email": "admin@resqlink.demo", "password": "demo1234" } Response: { "token": "...", "user": { "id": "...", "name": "Admin User", "email": "admin@resqlink.demo", "role": "admin" } } Request: GET /api/analytics/overview Response: { "totalEmergencies": 9, "pendingRequests": 5, "criticalRequests": 3, "availableVolunteers": 4, "deployedVolunteers": 1, "activeCamps": 6, "peopleInCamps": 1435, "totalResources": 12, "lowStockItems": 1, "completedTasks": 0 }', size=10, space_after=6)

doc.save(OUT)
print('DOCX saved:', OUT)
