# Winning Demo Presentation Script (Total Speaking Time: 7:00 Minutes)
**Project Title**: PS-010: Integrated Digital Sand Quality Management & Rejection Analytics System  
**Audience**: Hackathon Evaluation Jury / Industrial Experts / Foundry Plant Directors  
**Tone**: Confident, technically authoritative, problem-driven, and focused on tangible ROI & IATF 16949 compliance.

---

## Presentation Breakdown Matrix

| Segment | Timing | On-Screen View | Core Hook / Focus |
|---|---|---|---|
| **1. Hook & Industrial Problem** | 0:00 – 1:00 (60s) | Dashboard Overview | Paper-based lag & \$150k scrap losses |
| **2. Accessibility & Shop-Floor UX** | 1:00 – 2:00 (60s) | Glare Mode & Basic View | Tablet ergonomics, glare resistance & zero double-entry |
| **3. Digital Sand Lab & Tolerances** | 2:00 – 3:00 (60s) | Sand Test Entry & Hourly Grid | Instant 3-color spec checks & batch linkage |
| **4. Automated SPC & Capability ($C_p, C_{pk}$)** | 3:00 – 4:15 (75s) | SPC Control Charts & Capability | ASTM $I\text{-}MR$, Nelson 8 Rules, $C_{pk}$ |
| **5. Defect Pareto & 12-Hour Lag Correlation** | 4:15 – 5:30 (75s) | Defect Pareto & Correlation Page | Upstream moisture $\rightarrow$ Downstream porosity proof |
| **6. 8D CAPA, Alerts & Audit Trail** | 5:30 – 6:15 (45s) | Customer Complaints & Audit Trail | IATF 16949 traceability & containment loop |
| **7. Architecture, Scalability & Closing Impact** | 6:15 – 7:00 (45s) | Reports & Dashboard | ROI, open-standard stack, winning wrap-up |

---

## Detailed Section-by-Section Script

### SECTION 1: The Hook & The \$150,000 Foundry Problem
- **Timestamp**: `0:00 – 1:00` (1 Minute)
- **Screen Recording Action**:
  - Start on the **Foundry Quality 4.0 Dashboard** (`/`).
  - Hover smoothly over the KPI cards: *Tests Conforming (97.4%)*, *Scrap Rate (1.96%)*, *Open Alerts (2)*.
  - Hover over the 4 production lines: **D1, D2, D3, D4**.

> **Spoken Script:**
>
> *"Good morning, esteemed judges and foundry leaders. In modern automated casting foundries running high-pressure Disamatic molding lines, greensand quality is literally the heartbeat of production. 
>
> Yet today, over 80% of foundries still record critical parameters—moisture, compactability, green compression strength, and permeability—on paper log sheets or disconnected spreadsheets. By the time a moisture spike is spotted hours later, hundreds of tons of iron have already been poured, leading to catastrophic gas porosity, blowholes, and hundreds of thousands of dollars in scrap rejection.
>
> Welcome to **PS-010: The Integrated Digital Sand Quality Management and Rejection Analytics System**. Built natively for high-volume automated molding lines D1 through D4, our platform connects shop-floor sand testing directly to automated SPC control charts, downstream rejection analytics, and time-lagged root-cause correlation.
>
> As you can see on the screen, our centralized Quality 4.0 command center provides a single pane of glass across all four lines, monitoring conforming tests, plant-wide rejection rates, active alerts, and line-specific health in real time."*

---

### SECTION 2: Shop-Floor Accessibility & Dual-Mode UI
- **Timestamp**: `1:00 – 2:00` (1 Minute)
- **Screen Recording Action**:
  - Click the **`GLARE MODE`** toggle in the top header. Show how colors shift to ultra-high contrast with bold dark borders and crisp indicators.
  - Click the **`BASIC VIEW`** toggle in the header. Show the giant, shop-floor status board showing D1–D4 cards with immediate status and one-touch actions.
  - Switch back to Full View, then quickly click the **Role Switcher** dropdown (Operator $\rightarrow$ Quality Engineer $\rightarrow$ Admin) to show seamless RBAC.

> **Spoken Script:**
>
> *"Before diving into the algorithms, let's address the reality of a foundry environment: extreme heat, airborne bentonite dust, and harsh ambient lighting where delicate software UIs fail.
>
> We engineered this system specifically for foundry operators. With a single click on **'Glare Mode'**, our UI shifts into an ultra-high-contrast theme, replacing subtle grays with bold, glare-resistant borders and high-legibility typographic tokens calibrated for dusty plant tablets.
>
> Furthermore, an operator on the floor does not need complex analytical charts during a pour. By toggling **'Basic View'**, the entire interface simplifies into an oversized glance board. Operators see line health, current scrap rate, and immediate action buttons like 'Log Test' or 'View SPC' that can be operated even with heavy work gloves.
>
> Our top header also features a rapid **Role Switcher**, enabling instant role-based access control across Operators, Shift Supervisors, Quality Engineers, and Plant Managers, in strict alignment with IATF 16949 operational governance."*

---

### SECTION 3: Tablet-Optimized Digital Sand Lab & Zero-Error Entry
- **Timestamp**: `2:00 – 3:00` (1 Minute)
- **Screen Recording Action**:
  - Navigate to **Sand Quality Lab $\rightarrow$ Sand Test Entry** (`/sand-tests/entry`).
  - Show the clean line and shift selector (Line D1, Shift 1).
  - Point to the numerical input fields (Moisture, Compactability, GCS, Permeability).
  - Click **Hourly Monitoring** (`/sand-tests/hourly`) to show the pre-populated tabular log of all hourly tests.

> **Spoken Script:**
>
> *"Let's see how sand quality is captured at the muller. 
>
> Under the **Sand Test Entry** module, operators have a tablet-optimized digital worksheet. As numbers are entered, our client engine executes real-time tolerance validation against approved engineering specifications: green indicates In-Tolerance, amber denotes Warning Margin, and red triggers an immediate Out-of-Specification warning. 
>
> The system enforces duplicate-submission prevention using unique line, shift, and timestamp composite keys.
>
> Moving to the **Hourly Monitoring** matrix, every single test is structured and linked to its specific Sand Batch Number. Instead of digging through physical binders during a customer audit, quality teams have every moisture, compactability, shear strength, and permeability record digitally cataloged, searchable, and exportable in seconds."*

---

### SECTION 4: Automated SPC Engine ($I\text{-}MR$) & Process Capability ($C_p, C_{pk}$)
- **Timestamp**: `3:00 – 4:15` (1 Minute 15 Seconds)
- **Screen Recording Action**:
  - Navigate to **SPC Analytics $\rightarrow$ Control Charts** (`/spc/charts`).
  - Select **Line D2** and parameter **Moisture Content**.
  - Show the **Control Summary Banner**: Center Line $\bar{X} = 3.42\%$, UCL $3.74\%$, LCL $3.10\%$, $\hat{\sigma}_{within} = 0.106$.
  - Scroll to the **Individuals ($I$) Chart** and **Moving Range ($MR$) Chart**.
  - Highlight the red dots where **Nelson Rule 1** and **Nelson Rule 2** were automatically flagged.
  - Navigate to **Process Capability** (`/spc/capability`) to show $C_p, C_{pk}, P_p, P_{pk}$ and the normal distribution curve.

> **Spoken Script:**
>
> *"Now to the intellectual core of our platform: Automated Statistical Process Control.
>
> In high-precision foundries, relying only on customer specification limits is a recipe for disaster. Our automated SPC engine calculates true Statistical Control Limits using ASTM/ISO Moving Range algorithms. Here, $\hat{\sigma}_{within}$ is accurately estimated as $\frac{\overline{MR}}{d_2}$ with $d_2 = 1.128$ for subgroup size $n=2$.
>
> Notice what happens here on **Line D2 for Moisture Content**: The system evaluates all **Nelson 8 Rules for Special-Cause Variation**. It doesn't just wait for a point to breach the Upper Spec Limit (USL). It automatically flags Nelson Rule 2—nine consecutive points on one side of the center line—detecting process drift hours before scrap occurs!
>
> When we examine **Process Capability**, the system computes both potential capability $C_p$ and centered capability $C_{pk}$, alongside long-term performance $P_p$ and $P_{pk}$. It warns quality managers when $C_{pk}$ falls below the automotive benchmark of $1.33$, projecting the expected defects per million parts (PPM) before iron is tapped."*

---

### SECTION 5: Defect Pareto & The 12-Hour Lag Correlation Engine
- **Timestamp**: `4:15 – 5:30` (1 Minute 15 Seconds)
- **Screen Recording Action**:
  - Navigate to **Defects & Rejection $\rightarrow$ Defect Pareto** (`/rejections/pareto`).
  - Show the 80/20 Pareto chart: Gas Porosity ($44.6\%$) and Blowholes ($25.7\%$) highlighted as the 'Vital Few'.
  - Navigate to **Correlation Engine** (`/correlations`).
  - Select **Line D2**, **Moisture Content** vs. **Gas Porosity**, with a **12-Hour Lag Window**.
  - Show the statistical output: Pearson $r = 0.78$, $p < 0.001$, Risk Ratio $= 3.42\times$.

> **Spoken Script:**
>
> *"When scrap does occur at final inspection, how does a foundry close the loop?
>
> First, our **Defect Pareto Analysis** applies Juran's 80/20 rule, immediately isolating the vital few defects—Gas Porosity and Blowholes represent over 70% of total plant scrap—from the trivial many.
>
> But here is our biggest competitive breakthrough: **The Time-Lagged Defect Correlation Engine**.
>
> In real casting plants, sand molded in the morning doesn't get shaken out, shot-blasted, and inspected until 6, 12, or 24 hours later. Standard correlation tools fail because they compare morning sand to morning scrap!
>
> Our engine introduces a configurable process time-lag window: $\Delta t \in \{0, 6, 12, 24, 48, 72\}$ hours. Here on Line D2, with a 12-hour lag, the system reveals a statistically significant Pearson correlation of $r = 0.78$ ($p < 0.001$) between high sand moisture and downstream porosity. 
>
> The Out-of-Spec Risk Ratio is $3.42$—meaning when sand moisture exceeds $3.70\%$, the risk of casting porosity increases by over 340%. This gives foundry metallurgists irrefutable data to fix muller water dosing rather than guessing."*

---

### SECTION 6: IATF 16949 Audit Trail & 8D Customer CAPA
- **Timestamp**: `5:30 – 6:15` (45 Seconds)
- **Screen Recording Action**:
  - Navigate to **Compliance & IATF $\rightarrow$ Customer Complaints** (`/complaints`).
  - Open complaint `CMP-2026-081` (TurboMotors India Ltd) showing the complete D1 to D8 investigation dossier.
  - Navigate to **IATF Audit Trail** (`/audit-trail`) showing immutable timestamps, user IDs, and changed values.

> **Spoken Script:**
>
> *"For automotive suppliers, compliance with **IATF 16949** is non-negotiable.
>
> In the **Customer Complaints** module, we provide a complete digital **8-Discipline (8D) CAPA investigation dossier**. Here, complaint CMP-2026-081 from TurboMotors is directly linked to suspect sand batch numbers and inspection lots, guiding the team through containment (D3), verified root cause (D4), and permanent corrective actions (D5).
>
> Simultaneously, our **Digital Audit Trail** provides an immutable event ledger. Every specification revision, test edit, and alert acknowledgment records the exact user, timestamp, previous value, and reason, eliminating paper tampering and ensuring 100% audit readiness for external ISO/IATF certifiers."*

---

### SECTION 7: Architecture, Business ROI & Winning Wrap-Up
- **Timestamp**: `6:15 – 7:00` (45 Seconds)
- **Screen Recording Action**:
  - Return to the **Dashboard** (`/`).
  - Show the pre-populated 14-day scrap performance table.
  - End on a strong summary slide or the main dashboard overview with all lines healthy.

> **Spoken Script:**
>
> *"Under the hood, PS-010 is architected for zero latency and enterprise resilience:
> - A modern **FastAPI and Python 3.12 backend** powering real-time statistical engines with NumPy, SciPy, and SQLAlchemy.
> - A high-performance **React 19, TypeScript, and Vite frontend** equipped with custom foundry glare protection and offline demo fallbacks.
> - Fully containerized with **Docker and PostgreSQL**, ready for plant-floor edge deployment.
>
> For an average 50,000-ton automotive foundry, reducing casting rejection by just **0.5%** saves over **\$180,000 annually** in melted iron, energy, and remolding costs, while completely safeguarding customer trust.
>
> PS-010 transforms traditional foundries from reactive firefighting to proactive Quality 4.0 excellence. Thank you, and we welcome your questions!"*

---

## Pro-Tips for Recording Your Demo Video

1. **Resolution & Audio**: Record at `1920x1080` (1080p) at 60 fps with a clear microphone. Ensure notification sounds are silenced.
2. **Cursor Pacing**: Move your cursor deliberately. Avoid rapid, erratic mouse movements—point to a metric, hold for 1.5 seconds while talking, then scroll smoothly.
3. **Pacing Checks**: Keep a timer on your phone beside your keyboard:
   - *Minute 2:00*: You should be finishing Glare Mode / Basic View.
   - *Minute 4:00*: You should be in SPC & Capability.
   - *Minute 5:30*: You should be finishing the 12-Hour Lag Correlation.
4. **Key Soundbites the Judges Will Love**:
   - *"ASTM/ISO $\frac{\overline{MR}}{d_2}$ within-subgroup variation"*;
   - *"Nelson 8 Rules automated special-cause detection"*;
   - *"12-hour time-lagged downstream correlation"*;
   - *"IATF 16949 digital audit trail and 8D CAPA"*.
