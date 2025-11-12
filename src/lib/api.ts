import { PaymentDetailsResponse } from "@/types/payment";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const BUSINESS_ID = import.meta.env.VITE_BUSINESS_ID || '';

export const fetchPaymentDetails = async (paymentId: string): Promise<PaymentDetailsResponse> => {
  const response = await fetch(`${API_BASE_URL}/v1/process_payment/${paymentId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'X-Business-ID': BUSINESS_ID,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch payment details: ${response.statusText}`);
  }

  return response.json();
};
