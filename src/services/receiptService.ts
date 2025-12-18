import type { Registration, Competition } from '@/types/types';

interface ReceiptData {
  registrationId: string;
  childName: string;
  age: number;
  ageGroup: string;
  competitions: string[];
  totalFee: number;
  parentName: string;
  parentPhone: string;
}

/**
 * Generate receipt message text for SMS/WhatsApp
 */
export function generateReceiptMessage(registration: Registration, competitions: Competition[]): string {
  const competitionNames = registration.competitions
    .map(compId => competitions.find(c => c.id === compId)?.name || 'Unknown')
    .join(', ');

  const message = `
🕉️ Sri Krishna Janmashtami Competitions 🕉️

✅ REGISTRATION CONFIRMED

Registration ID: ${registration.registrationId}
Child Name: ${registration.name}
Age: ${registration.age} years
Category: ${registration.ageGroup}

Competitions:
${competitionNames}

Total Fee: ₹${registration.totalFee}
Payment: ${registration.paymentMethod}

Parent: ${registration.parentName}

Thank you for registering! We look forward to seeing ${registration.name} at the event.

For queries, please contact the event organizers.

Hare Krishna! 🙏
  `.trim();

  return message;
}

/**
 * Simulate sending receipt via SMS/WhatsApp
 * In production, this would integrate with SMS gateway (Twilio, MSG91, etc.)
 */
export async function sendReceipt(
  registration: Registration,
  competitions: Competition[]
): Promise<{ success: boolean; message: string }> {
  try {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const receiptMessage = generateReceiptMessage(registration, competitions);
    
    // In production, this would be:
    // await smsGateway.send({
    //   to: registration.parentPhone,
    //   message: receiptMessage
    // });

    console.log('📱 Receipt sent to:', registration.parentPhone);
    console.log('📄 Message:', receiptMessage);

    // Simulate 95% success rate
    const isSuccess = Math.random() > 0.05;

    if (isSuccess) {
      return {
        success: true,
        message: `Receipt sent successfully to ${registration.parentPhone}`
      };
    } else {
      throw new Error('SMS gateway temporarily unavailable');
    }
  } catch (error) {
    console.error('Failed to send receipt:', error);
    return {
      success: false,
      message: 'Failed to send receipt. Please try again or contact parent manually.'
    };
  }
}

/**
 * Batch send receipts to multiple registrations
 */
export async function batchSendReceipts(
  registrations: Registration[],
  competitions: Competition[]
): Promise<{ sent: number; failed: number; results: Array<{ registrationId: string; success: boolean }> }> {
  const results = await Promise.all(
    registrations.map(async (reg) => {
      const result = await sendReceipt(reg, competitions);
      return {
        registrationId: reg.registrationId,
        success: result.success
      };
    })
  );

  const sent = results.filter(r => r.success).length;
  const failed = results.filter(r => !r.success).length;

  return { sent, failed, results };
}
