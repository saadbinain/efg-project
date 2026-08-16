# FREELANCE WEB DEVELOPMENT AGREEMENT

**Project Name:** Educational Financial Guide (EFG) Web Application  
**Effective Date:** June 16, 2026  

This Freelance Web Development Agreement (the "Agreement") is entered into by and between:

**THE DEVELOPER:**  
Name: [Your Name / Company Name]  
Address: [Your Address]  
Email: [Your Email]  

*and*  

**THE CLIENT:**  
Name: [Client Name / Company Name]  
Address: [Client Address]  
Email: [Client Email]  

Collectively referred to as the "Parties."

---

## 1. PURPOSE & PROJECT DESCRIPTION
The Client wishes to engage the Developer for the purposes of designing, developing, and deploying a custom web application titled the **Educational Financial Guide (EFG)**. The platform is designed to provide graduating students and their families with academic and tuition cost transparency for institutions across the province.

The system consists of:
1. A public search and informational directory.
2. A secure Administrator Content Management System (CMS).
3. A connected PostgreSQL cloud database.

---

## 2. DETAILED SCOPE OF WORK

The Developer agrees to build, configure, and deploy the following components:

### A. Frontend Client-Side Pages (React/Vite)
*   **Home/Landing Portal:** Responsive introduction, interactive statistics strip, featured schools, and popular programs overview.
*   **Course Catalog (Search & Discovery):** Interactive program list with debounced filtering and prefetch caching on hover (for 0ms perceived page loading latency).
*   **Course Tuition Details:** Financial cost breakdown (tuition, miscellaneous, graduation fee) with a multi-year estimator.
*   **Colleges Directory:** Filterable list of educational institutions in the province using skeleton loading cards for slow mobile networks.
*   **College Profile Page:** Dedicated school overview listing branches, locations, and course offerings with pricing.
*   **Admin Login:** Secure credentials terminal for administrators.
*   **Admin Dashboard:** Aggregated data counter metrics (number of courses, colleges, system statistics).
*   **Admin Courses CRUD Panel:** Panel to create, read, update, and delete courses/degrees.
*   **Admin Colleges CRUD Panel:** Panel to create, read, update, and delete partner schools, upload logos, and map individual tuition expenses.

### B. Backend REST API & Database Layer (PHP/Supabase PostgreSQL)
*   **12 RESTful endpoints** for fetching and modifying data (courses, colleges, stats, authentication).
*   **JWT (JSON Web Token) Security:** Stateless verification middleware preventing unauthorized modification of database files.
*   **File Upload Utility:** Multi-part server upload processing for school logo files, including file integrity validation.
*   **Supabase PostgreSQL Database:** Table schemas mapping relationships (Colleges to Courses, Course-specific expenses, authentication credentials, and tracking statistics).

---

## 3. COMPENSATION & PAYMENT TERMS

In consideration for the services rendered, the Client agrees to pay the Developer a total fee of **₱65,000.00 PHP** (Sixty-Five Thousand Philippine Pesos).

### A. Module Pricing Breakdown
The total project pricing is broken down by core functional system modules as follows:

| Module Name | Scope & Key Deliverables | Cost (PHP) |
| :--- | :--- | :---: |
| **1. User Auth & Security Module** | Admin Login, JWT authentication API, and frontend route guard protection. | ₱8,000.00 |
| **2. Public Program Search Engine** | Program directory with live debounced search and hover prefetch cache. | ₱12,000.00 |
| **3. Tuition Estimator Engine** | Cost breakdown calculator (first-year vs succeeding years vs graduation fee). | ₱10,000.00 |
| **4. Partner Schools Directory** | Interactive college directory, profiles listing courses, maps, and branches. | ₱10,000.00 |
| **5. Stats & Analytics Dashboard** | Real-time database counters and administrative dashboard metrics page. | ₱7,000.00 |
| **6. Admin CMS & Form CRUD Portal** | Data creation and editing interfaces for courses and colleges. | ₱12,000.00 |
| **7. Logo & File Upload Manager** | Server-side upload handler with validation for school graphics. | ₱6,000.00 |
| **TOTAL DEVELOPMENT COST** | **All 7 Core System Modules (Fully Integrated)** | **₱65,000.00** |

### B. Payment Milestone Schedule
The payments shall be settled in installments according to the following timeline:

*   **Milestone 1: Commencement Deposit (Downpayment)**  
    **₱25,000.00 PHP** — Due immediately upon signing this Agreement, prior to the commencement of any development work.
*   **Milestone 2: Beta Release**  
    **₱20,000.00 PHP** — Due upon deployment of the public portal (Search engine, School directory, and Tuition estimator) to a staging environment.
*   **Milestone 3: Final Launch & Handover**  
    **₱20,000.00 PHP** — Due upon full implementation of the Admin CMS, security features, production server deploy, and delivery of source code.

*Note: All payments are non-refundable once the corresponding milestone has begun development.*

---

## 4. PROJECT TIMELINE

*   **Project Start Date:** [Start Date]
*   **Estimated Completion Date:** [End Date]
*   **Milestone 2 Date:** [Estimated Date]

The Developer will provide progress updates at the end of each milestone. Any delays caused by late feedback or late delivery of assets from the Client will automatically extend the timeline.

---

## 5. CLIENT RESPONSIBILITIES
The Client agrees to provide all necessary materials, assets, and information required to complete the project in a timely manner. This includes, but is not limited to:
*   Official school branding, logos, and graphic assets.
*   Accurate tuition data, fees, and program guidelines.
*   Hosting server, domain configurations, and Supabase cloud access credentials.

---

## 6. INTELLECTUAL PROPERTY & RIGHTS
Upon receipt of the **final payment (₱20,000.00 PHP)**, the Developer transfers all intellectual property rights, source code, database structures, and assets of the developed EFG application to the Client. The Developer retains the right to showcase screenshots and generic descriptions of the work in their professional portfolio.

---

## 7. POST-LAUNCH WARRANTY & MAINTENANCE
The Developer provides a **30-day post-launch warranty** starting from the date of final handover. During this period, the Developer will patch any system bugs, styling flaws, or backend errors free of charge. This warranty does **not** cover:
*   Hosting or database service interruptions.
*   New feature additions not specified in Section 2 of this Agreement.
*   Errors caused by alterations made to the codebase or database by the Client or third parties.

---

## 8. TERMINATION
Either party may terminate this agreement with **7 days written notice** if the other party breaches any term of this Agreement and fails to remedy it within that period. 
*   If terminated by the Client, the Developer is entitled to retain the downpayment and receive payment for all completed milestone works up to the date of termination.
*   If terminated by the Developer, the Developer will provide the current source code files representing the completed work up to that point.

---

## 9. SIGNATURES & ACCEPTANCE

IN WITNESS WHEREOF, the Parties hereto have executed this Agreement as of the Effective Date written above.

<br/><br/>

_______________________________________  
**[Your Name / Developer Representative]**  
*Developer*  
Date: _________________________________  

<br/><br/>

_______________________________________  
**[Client Name / Authorized Representative]**  
*Client*  
Date: _________________________________  
