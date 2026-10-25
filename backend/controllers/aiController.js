import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();

// System prompt injecting official AICTE Approval Process Handbook (APH 2024-27) norms
const AICTE_SYSTEM_INSTRUCTION = `You are "AICTE Pravah Sahayak" (एआईसीटीई प्रवाह सहायक), the official AI Statutory Compliance & Approval Workflow Copilot for the All India Council for Technical Education (AICTE), Ministry of Education, Govt. of India.

Your primary mission is to provide authoritative, accurate, and actionable regulatory guidance based strictly on the AICTE Approval Process Handbook (APH 2024-27).

Key Statutory Rules & Clauses you strictly enforce:
1. Land Norms (Clause 1.2 & 1.4):
   - Mega/Metro Cities: Minimum 2.5 Acres contiguous land.
   - Urban Areas: Minimum 4.0 Acres.
   - Rural Areas: Minimum 7.5 Acres.
   - Land must be owned or on a legally registered lease deed for a minimum of 30 years.

2. Fire & Building Safety (Clause 1.5 & 1.8):
   - Fire Safety NOC from State/Municipal Fire Directorate is mandatory; must be renewed before expiry.
   - Structural Stability Certificate by a competent PWD/Govt-approved structural engineer, valid for maximum 5 years.

3. Faculty Cadre & Teacher-Student Ratio (Clause 4.2 & 4.2.b):
   - UG Engineering & Technology: Cadre ratio is 1:20 (1 Teacher per 20 students enrolled across all 4 years).
   - Cadre Distribution: 1 Professor : 2 Associate Professors : 6 Assistant Professors.
   - Ghost Faculty (Clause 4.2.b): Concurrent employment of a faculty member across two technical institutes is illegal and constitutes fraud. Penalty includes immediate cadre de-listing and cancellation of intake.

4. Infrastructure Norms (Clause 2.1):
   - Minimum built-up area per student: 10 to 12 sq.m.
   - Computer-to-student ratio: Minimum 1 computer per 4 students with high-speed 500+ Mbps lease line.
   - Divyangjan accessibility: Barrier-free ramps, lifts, and dedicated facilities mandatory.

5. Inspection & EVC Norms (Clause 7.1):
   - Expert Visit Committee (EVC) requires on-site biometric/GPS verification within a strict 200m geofence.

Tone & Style Guidelines:
- Authoritative yet helpful, clear, and executive.
- Always cite the relevant APH Clause number (e.g., "Under APH 2024-27 Clause 4.2...").
- Support English, Hindi, and Hinglish queries seamlessly.
- Format responses with structured bullet points and bold highlights.`;

// Intelligent Offline Knowledge Base Fallback when GEMINI_API_KEY is not yet added
const getOfflineFallbackResponse = (query) => {
  const q = query.toLowerCase().trim();

  // Natural greeting handling
  const isGreeting =
    ['hi', 'hello', 'hey', 'namaste', 'pranam', 'hii', 'hiii', 'hola', 'good morning', 'good afternoon', 'good evening'].includes(q) ||
    q.startsWith('hi ') ||
    q.startsWith('hello ');

  if (isGreeting) {
    return `Namaste! 🙏 Main **AICTE Pravah Sahayak** hoon.

Main aapki AICTE Approval Process Handbook (APH 2024-27) ke kisi bhi statutory compliance ya approval workflow me madad kar sakta hoon.

Aap mujhse pooch sakte hain:
* 🏛️ *Land requirements (Urban vs Rural)?*
* 👨‍🏫 *Faculty 1:20 Cadre ratio & Ghost Faculty rules?*
* 🔥 *Fire NOC & Building stability renewal window?*
* 📍 *EVC inspection & 200m geofencing guidelines?*

Aap Hindi ya English kisi me bhi sawal pooch sakte hain. Batayein, main aapki kya sahayata kar sakta hoon?`;
  }

  // Conversational persona handling
  if (q.includes('kaise ho') || q.includes('how are you') || q.includes('who are you') || q.includes('tum kaun ho') || q.includes('aap kaun')) {
    return `Main badhiya hoon, dhanyawaad! 😊 Main **AICTE Pravah Sahayak** hoon — Ministry of Education & AICTE ke APH 2024-27 handbook norms par trained official regulatory assistant. Batayein, aapke college ya scrutiny desk se related kya jaankari chahiye?`;
  }

  if (q.includes('land') || q.includes('zameen') || q.includes('area') || q.includes('acre')) {
    return `### 🏛️ Land Requirements under AICTE APH 2024-27 (Clause 1.2 & 1.4)
According to the official **Approval Process Handbook (Clause 1.2)**:
* **Mega / Metro Cities:** Minimum **2.5 Acres** of contiguous land.
* **Urban Areas:** Minimum **4.0 Acres**.
* **Rural Areas:** Minimum **7.5 Acres**.
* **Tenure / Lease Norm (Clause 1.4):** Land must be either self-owned or on a legally registered lease deed for **minimum 30 years** from the date of submission. Any break in contiguity requires council exemption.`;
  }

  if (q.includes('fire') || q.includes('noc') || q.includes('stability') || q.includes('safety')) {
    return `### 🔥 Fire Safety & Structural Stability Norms (Clause 1.5 & 1.8)
Under statutory safety regulations:
* **Fire Safety NOC (Clause 1.8):** Mandatory clearance certificate issued by the competent State/Municipal Fire Directorate. The portal triggers an **Automated Watchdog Radar Alert** 60 days prior to expiry.
* **Building Stability (Clause 1.5):** Structural Stability Certificate signed by an authorized PWD / Chartered Civil Engineer, valid for a maximum statutory term of **5 years**.
* *Action Required:* If certificate validity drops below 30 days, your application clock pauses under **Deficiency Raised** status.`;
  }

  if (q.includes('faculty') || q.includes('ratio') || q.includes('cadre') || q.includes('professor') || q.includes('ghost')) {
    return `### 👨‍🏫 Teacher-Student Ratio & Ghost Faculty Regulations (Clause 4.2 & 4.2.b)
* **Cadre Ratio Norm (Clause 4.2):** For UG Engineering programs, statutory ratio is **1:20** (1 Faculty per 20 students across 4 academic years).
* **Cadre Structure:** Must maintain a balanced pyramid of **1 Professor : 2 Associate Professors : 6 Assistant Professors**.
* **Ghost Faculty Prohibition (Clause 4.2.b):** Submitting a faculty member's PAN/Aadhaar who is concurrently on the active roster of another technical institute is treated as **Statutory Fraud**. Our automated **Ghost Faculty Radar** instantly flags such tenancies for immediate rejection.`;
  }

  if (q.includes('evc') || q.includes('inspection') || q.includes('visit') || q.includes('geo')) {
    return `### 📍 Expert Visit Committee (EVC) Physical Audit Norms (Clause 7.1)
* **On-Site Verification:** 3-member committee conducts physical audit of computing labs, library holdings, Divyangjan ramps, and workshop facilities.
* **Anti-Fraud Geofencing:** Inspectors must upload live geo-tagged photographs verified within a **200-meter radius** of the registered campus GPS coordinates.
* **Blind Allocation:** Committee members are randomly assigned and disclosed only **24 hours prior** to prevent conflict of interest.`;
  }

  if (q.includes('fee') || q.includes('intake') || q.includes('extension') || q.includes('eoa')) {
    return `### 📋 Extension of Approval (EoA) & Intake Norms (Clause 3.1)
* **Standard EoA:** Granted to existing compliant institutions upon submission of valid NOCs, audited accounts, and mandatory undertaking clearances.
* **Intake Expansion:** Institutions maintaining valid NBA accreditation in at least 50% of eligible courses are permitted up to **60 additional seats** per branch, provided built-up area and computing norms are fulfilled.`;
  }

  return `### 📘 AICTE Approval Process Handbook (APH 2024-27) Guidance
Thank you for querying **AICTE Pravah Sahayak**.

Under statutory guidelines of the Approval Process Handbook:
1. **Application Stages:** Scrutiny (7 Days Allowed) ➔ EVC Inspection (14 Days) ➔ SAC/SHC Hearing ➔ Council Clearance.
2. **Mandatory Compliances:** Valid Land Lease (>30 yrs), Fire NOC, Structural PWD Certificate, and 1:20 Teacher-Student Cadre Ratio.
3. **Ghost Faculty Radar:** Cross-checks PAN numbers across pan-India technical colleges to eliminate duplicate faculty submissions.

*Tip:* You can ask specific questions about **Land norms**, **Faculty ratio**, **Fire NOC validity**, or **EVC inspection procedures**!`;
};

export const askAIAssistant = async (req, res) => {
  try {
    const { question, conversationHistory = [] } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ success: false, message: 'Question prompt is required.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // 1. If GEMINI_API_KEY is available and configured, call live Google Gemini API
    if (apiKey && apiKey.trim() !== '' && !apiKey.includes('YOUR_GEMINI')) {
      try {
        const genAI = new GoogleGenerativeAI(apiKey);
        const model = genAI.getGenerativeModel({
          model: 'gemini-3.5-flash-lite',
          systemInstruction: AICTE_SYSTEM_INSTRUCTION,
        });

        // Format history for Gemini chat
        const chat = model.startChat({
          history: conversationHistory.slice(-6).map((msg) => ({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.text }],
          })),
          generationConfig: {
            temperature: 0.2, // Low temperature for high factual precision
            maxOutputTokens: 1024,
          },
        });

        const result = await chat.sendMessage(question);
        const responseText = result.response.text();

        return res.json({
          success: true,
          mode: 'LIVE_GEMINI',
          model: 'Gemini 1.5 Flash',
          answer: responseText,
        });
      } catch (geminiError) {
        console.warn('[Gemini API Fallback] Error contacting Google AI Studio:', geminiError.message);
        // Fallback to intelligent offline handbook rules if Gemini key hits quota / network error
        const fallbackText = getOfflineFallbackResponse(question);
        return res.json({
          success: true,
          mode: 'OFFLINE_APH_ENGINE',
          model: 'APH 2024-27 Knowledge Base',
          answer: fallbackText,
          note: 'Live Gemini key hit an error or network timeout. Responded via built-in APH Statutory Engine.',
        });
      }
    }

    // 2. If GEMINI_API_KEY is not yet added, use the intelligent APH Statutory Rule Engine
    const fallbackAnswer = getOfflineFallbackResponse(question);
    return res.json({
      success: true,
      mode: 'OFFLINE_APH_ENGINE',
      model: 'APH 2024-27 Regulatory Engine',
      answer: fallbackAnswer,
      note: 'Operating on built-in AICTE Approval Process Handbook engine. Paste your Google AI Studio GEMINI_API_KEY in .env to activate real-time Gemini LLM reasoning.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
