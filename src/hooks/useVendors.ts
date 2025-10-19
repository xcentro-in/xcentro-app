import { useState, useEffect } from "react";
import { vendorsAPI } from "@/services/api";
import { Vendor, GetVendorsResponse } from "@/types/vendor";

export const useVendors = (businessId?: string) => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchVendors = async () => {
      if (!businessId) return;

      setIsLoading(true);
      setError(null);

      try {
        const response: GetVendorsResponse = await vendorsAPI.getAll(businessId);
        setVendors(response.data.vendors);
      } catch (err) {
        console.error("Failed to fetch vendors:", err);
        setError(err instanceof Error ? err.message : "Failed to load vendors");
        setVendors([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVendors();
  }, [businessId]);

  return {
    vendors,
    isLoading,
    error,
  };
};
