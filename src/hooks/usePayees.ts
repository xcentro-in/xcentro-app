import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Payee } from '@/types/payee';
import { payeesAPI } from '@/services/api';
import { GetPayeesResponse, PayeeAPIResponse } from '@/types/payees-api';

export interface PayeesResponse {
  payees: Payee[];
  metadata: {
    total: number;
    lastUpdated: string;
    businessId: string;
  };
}

// Helper function to map API response to Payee type
const mapAPIResponseToPayee = (apiPayee: PayeeAPIResponse): Payee => {
  // Determine payee type based on tags or default to 'bank'
  const type = apiPayee.payee_type;
  // Base payee properties
  const basePayee = {
    id: apiPayee.relation_id,
    name: apiPayee.display_name,
    type,
    email: apiPayee.contact_email,
    contactNumber: apiPayee.contact_phone,
    createdAt: apiPayee.added_at,
    updatedAt: apiPayee.updated_at === '0001-01-01T00:00:00Z' ? apiPayee.added_at : apiPayee.updated_at,
    isDefault: apiPayee.is_favorite, // Map is_favorite to isDefault
  };

  // Return type-specific payee object
  if (type === 'vendor') {
    return {
      ...basePayee,
      type: 'bank',
      accountNumber: '', // Not available in API
      bankName: '', // Not available in API
      ifscCode: '', // Not available in API
      gstin: '', // Not available in API
      defaultPaymentMode: 'bank' as const,
      tags: apiPayee.tags,
    };
  } else if (type === 'biller') {
    return {
      ...basePayee,
      type: 'biller',
      billerName: apiPayee.display_name,
      customerId: apiPayee.payee_id,
      billingCycle: 'monthly' as const, // Default
      autoPayment: false,
    };
  } else {
    return {
      ...basePayee,
      type: 'payroll',
      accountNumber: '', // Not available in API
      bankName: '', // Not available in API
      ifscCode: '', // Not available in API
      salaryAmount: 0, // Not available in API
      salaryType: 'fixed' as const,
      payrollCycle: 'monthly' as const,
    };
  }
};

export const usePayees = () => {
  const [data, setData] = useState<PayeesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchPayees = async () => {
      if (!user?.businessId) return;

      setIsLoading(true);
      setError(null);

      try {
        // Call real API
        const response: GetPayeesResponse = await payeesAPI.getAll(user.businessId);

        // Handle empty data (null)
        if (!response.data || response.data.length === 0) {
          setData({
            payees: [],
            metadata: {
              total: 0,
              lastUpdated: new Date().toISOString(),
              businessId: user.businessId
            }
          });
        } else {
          // Map API response to Payee type
          const mappedPayees = response.data.map(mapAPIResponseToPayee);

          const payeesResponse: PayeesResponse = {
            payees: mappedPayees,
            metadata: {
              total: response.total_count,
              lastUpdated: new Date().toISOString(),
              businessId: user.businessId
            }
          };

          setData(payeesResponse);
        }
      } catch (err) {
        setError('Failed to fetch payees');
        console.error('Payees fetch error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayees();
  }, [user?.businessId]);

  const refetch = () => {
    setData(null);
    setIsLoading(true);
    // The useEffect will trigger automatically
  };

  // CRUD operations for payees
  const addPayee = async (payeeData: Omit<Payee, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/payees', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
      //   },
      //   body: JSON.stringify({ ...payeeData, businessId: user?.businessId }),
      // });

      // Mock implementation - create new payee locally
      const now = new Date().toISOString();
      const newPayee: Payee = {
        ...payeeData,
        id: `payee-${Date.now()}`,
        createdAt: now,
        updatedAt: now
      } as Payee;

      if (data) {
        setData(prev => prev ? {
          ...prev,
          payees: [...prev.payees, newPayee],
          metadata: {
            ...prev.metadata,
            total: prev.metadata.total + 1,
            lastUpdated: new Date().toISOString()
          }
        } : null);
      }

      return newPayee;
    } catch (err) {
      console.error('Add payee error:', err);
      throw new Error('Failed to add payee');
    }
  };

  const updatePayee = async (id: string, updates: Partial<Omit<Payee, 'type' | 'id' | 'createdAt'>>) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/payees/${id}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
      //   },
      //   body: JSON.stringify(updates),
      // });

      // Mock implementation - update payee locally
      if (data) {
        setData(prev => prev ? {
          ...prev,
          payees: prev.payees.map(payee =>
            payee.id === id
              ? { ...payee, ...updates, updatedAt: new Date().toISOString() } as Payee
              : payee
          ),
          metadata: {
            ...prev.metadata,
            lastUpdated: new Date().toISOString()
          }
        } : null);
      }
    } catch (err) {
      console.error('Update payee error:', err);
      throw new Error('Failed to update payee');
    }
  };

  const deletePayee = async (id: string) => {
    try {
      // TODO: Replace with actual API call
      // const response = await fetch(`/api/payees/${id}`, {
      //   method: 'DELETE',
      //   headers: {
      //     'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
      //   },
      // });

      // Mock implementation - delete payee locally
      if (data) {
        setData(prev => prev ? {
          ...prev,
          payees: prev.payees.filter(payee => payee.id !== id),
          metadata: {
            ...prev.metadata,
            total: prev.metadata.total - 1,
            lastUpdated: new Date().toISOString()
          }
        } : null);
      }
    } catch (err) {
      console.error('Delete payee error:', err);
      throw new Error('Failed to delete payee');
    }
  };

  return {
    payees: data?.payees || [],
    metadata: data?.metadata,
    isLoading,
    error,
    refetch,
    addPayee,
    updatePayee,
    deletePayee
  };
};

// TODO: Backend API endpoint structure
/*
GET /api/payees?businessId={businessId}

Backend Implementation:
1. Query all payees for the business
2. Return complete list (no pagination needed for 20-30 records)
3. Include metadata about total count and last updated

Example API Response:
{
  "success": true,
  "data": {
    "payees": Payee[],
    "metadata": {
      "total": 25,
      "lastUpdated": "2024-01-10T10:30:00Z",
      "businessId": "b1"
    }
  }
}

POST /api/payees
PUT /api/payees/{id}
DELETE /api/payees/{id}
*/