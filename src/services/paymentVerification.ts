/**
 * Automated Payment Verification Service
 * Simulates backend OCR/AI processing for payment screenshot verification
 */

export interface VerificationResult {
  success: boolean;
  verified: boolean;
  amount?: number;
  timestamp?: string;
  transactionId?: string;
  confidence: number;
  reason?: string;
}

/**
 * Simulates OCR extraction from payment screenshot
 * In production, this would call a backend API with OCR/AI capabilities
 */
function simulateOCRExtraction(screenshot: string): {
  amount: number | null;
  timestamp: string | null;
  transactionId: string | null;
  confidence: number;
} {
  // Simulate processing delay
  const processingTime = Math.random() * 1000 + 500; // 500-1500ms
  
  // Simulate OCR confidence (70-100%)
  const confidence = Math.random() * 0.3 + 0.7;
  
  // In a real system, this would use OCR to extract text from the image
  // For simulation, we'll generate realistic-looking data
  
  // Simulate successful extraction with high confidence
  if (confidence > 0.85) {
    return {
      amount: null, // Will be validated against expected amount
      timestamp: new Date().toISOString(),
      transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
      confidence
    };
  }
  
  // Simulate partial extraction with medium confidence
  if (confidence > 0.75) {
    return {
      amount: null,
      timestamp: new Date().toISOString(),
      transactionId: null,
      confidence
    };
  }
  
  // Simulate failed extraction with low confidence
  return {
    amount: null,
    timestamp: null,
    transactionId: null,
    confidence
  };
}

/**
 * Validates extracted payment data against expected values
 */
function validatePaymentData(
  extracted: ReturnType<typeof simulateOCRExtraction>,
  expectedAmount: number
): VerificationResult {
  const { amount, timestamp, transactionId, confidence } = extracted;
  
  // Low confidence - flag for manual review
  if (confidence < 0.75) {
    return {
      success: true,
      verified: false,
      confidence,
      reason: 'Low OCR confidence - screenshot quality may be poor. Flagged for manual review.'
    };
  }
  
  // Missing critical data - flag for review
  if (!timestamp || !transactionId) {
    return {
      success: true,
      verified: false,
      confidence,
      reason: 'Unable to extract all required payment details. Flagged for manual review.'
    };
  }
  
  // Validate timestamp is recent (within 7 days)
  const paymentDate = new Date(timestamp);
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  if (paymentDate < sevenDaysAgo) {
    return {
      success: true,
      verified: false,
      timestamp,
      transactionId,
      confidence,
      reason: 'Payment date is older than 7 days. Flagged for manual review.'
    };
  }
  
  if (paymentDate > now) {
    return {
      success: true,
      verified: false,
      timestamp,
      transactionId,
      confidence,
      reason: 'Payment date is in the future. Flagged for manual review.'
    };
  }
  
  // High confidence and valid data - auto-approve
  return {
    success: true,
    verified: true,
    amount: expectedAmount,
    timestamp,
    transactionId,
    confidence,
    reason: 'Payment verified successfully via automated system.'
  };
}

/**
 * Main verification function
 * Simulates backend payment verification process
 */
export async function verifyPaymentScreenshot(
  screenshot: string,
  expectedAmount: number
): Promise<VerificationResult> {
  try {
    // Simulate network delay for backend processing
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));
    
    // Simulate OCR extraction
    const extracted = simulateOCRExtraction(screenshot);
    
    // Validate extracted data
    const result = validatePaymentData(extracted, expectedAmount);
    
    return result;
  } catch (error) {
    console.error('Payment verification error:', error);
    return {
      success: false,
      verified: false,
      confidence: 0,
      reason: 'Verification system error. Please try again or contact support.'
    };
  }
}

/**
 * Batch verification for multiple payments
 * Used by admin to process pending payments
 */
export async function batchVerifyPayments(
  payments: Array<{ screenshot: string; expectedAmount: number }>
): Promise<VerificationResult[]> {
  const results = await Promise.all(
    payments.map(p => verifyPaymentScreenshot(p.screenshot, p.expectedAmount))
  );
  return results;
}

/**
 * Get verification statistics
 */
export function getVerificationStats(results: VerificationResult[]) {
  const total = results.length;
  const verified = results.filter(r => r.verified).length;
  const flagged = results.filter(r => !r.verified && r.success).length;
  const failed = results.filter(r => !r.success).length;
  const avgConfidence = results.reduce((sum, r) => sum + r.confidence, 0) / total;
  
  return {
    total,
    verified,
    flagged,
    failed,
    avgConfidence,
    verificationRate: (verified / total) * 100
  };
}
