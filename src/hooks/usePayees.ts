import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Payee } from '@/types/payee';

export interface PayeesResponse {
  payees: Payee[];
  metadata: {
    total: number;
    lastUpdated: string;
    businessId: string;
  };
}

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
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/payees?businessId=${user.businessId}`, {
        //   headers: {
        //     'Authorization': `Bearer ${localStorage.getItem('auth-token')}`,
        //   },
        // });

        // Mock API simulation
        await new Promise(resolve => setTimeout(resolve, 500));

        // Import mock data
        const { mockPayees } = await import('@/data/mockPayees');

        // Simulate server response with metadata
        const response: PayeesResponse = {
          payees: mockPayees,
          metadata: {
            total: mockPayees.length,
            lastUpdated: new Date().toISOString(),
            businessId: user.businessId
          }
        };

        setData(response);
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