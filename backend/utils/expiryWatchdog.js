/**
 * AICTE Pravah Document Validity Watchdog
 * Proactively flags expiring Land Lease, Fire NOCs, Building Stability certificates.
 */

export const evaluateDocumentValidity = (expiryDate) => {
  if (!expiryDate) {
    return {
      validityStatus: 'Expired',
      daysUntilExpiry: 0,
      badgeColor: 'red',
      urgency: 'Critical',
    };
  }

  const exp = new Date(expiryDate);
  const now = new Date();
  const diffTime = exp.getTime() - now.getTime();
  const daysUntilExpiry = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let validityStatus = 'Valid';
  let badgeColor = 'emerald';
  let urgency = 'Normal';

  if (daysUntilExpiry <= 0) {
    validityStatus = 'Expired';
    badgeColor = 'rose';
    urgency = 'Critical Action Required';
  } else if (daysUntilExpiry <= 30) {
    validityStatus = 'Expiring Soon';
    badgeColor = 'amber';
    urgency = 'Immediate Renewal Recommended';
  } else if (daysUntilExpiry <= 60) {
    validityStatus = 'Expiring Soon';
    badgeColor = 'yellow';
    urgency = 'Notice Issued';
  }

  return {
    validityStatus,
    daysUntilExpiry,
    badgeColor,
    urgency,
  };
};

/**
 * Dispatch simulated Multi-Channel Alert (WhatsApp, Email, In-App).
 */
export const generateSimulatedAlert = (institutionName, docType, daysUntilExpiry) => {
  const timestamp = new Date();
  const isExpired = daysUntilExpiry <= 0;
  
  return [
    {
      channel: 'WhatsApp',
      timestamp,
      recipient: '+91-98765-XXXXX (Registrar / Principal)',
      message: `[AICTE Pravah Alert] Urgent: ${docType} for ${institutionName} is ${
        isExpired ? 'EXPIRED' : `expiring in ${daysUntilExpiry} days`
      }. Upload renewed certificate on AICTE portal immediately to prevent regulatory block.`,
    },
    {
      channel: 'Email',
      timestamp,
      recipient: `registrar@${institutionName.toLowerCase().replace(/[^a-z0-9]/g, '')}.edu.in`,
      message: `Official Regulatory Notice: Mandatory renewal of ${docType}. Clause 4.6 of Approval Process Handbook requires continuous validity.`,
    },
    {
      channel: 'In-App',
      timestamp,
      recipient: 'Institution Compliance Dashboard',
      message: `High Priority: ${docType} requires immediate attention. Days remaining: ${daysUntilExpiry}`,
    },
  ];
};
