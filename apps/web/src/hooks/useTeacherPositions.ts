import { useState, useEffect } from 'react';
import api from '../axios.js';
import type { ITeacherPosition } from '@mern/shared';

interface UsePositionsParams {
  page?: number;
  limit?: number;
  isActive?: boolean;
}

export const useTeacherPositions = (params: UsePositionsParams = {}) => {
  const [positions, setPositions] = useState<ITeacherPosition[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPositions = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.isActive !== undefined)
        queryParams.append('isActive', params.isActive.toString());

      const response = await api.get(
        `/teacher-positions?${queryParams.toString()}`,
      );
      setPositions(response.data.data.positions);
      setTotal(response.data.data.pagination.total);
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message || 'Failed to fetch positions',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPositions();
  }, [params.page, params.limit, params.isActive]);

  return { positions, total, loading, error, refetch: fetchPositions };
};

export const useActivePositions = () => {
  const [positions, setPositions] = useState<ITeacherPosition[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivePositions = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get('/teacher-positions/active');
        setPositions(response.data.data.positions);
      } catch (err: any) {
        setError(
          err.response?.data?.error?.message ||
            'Failed to fetch active positions',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchActivePositions();
  }, []);

  return { positions, loading, error };
};

export const useCreatePosition = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/teacher-positions', data);
      return response.data.data.position;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error?.message || 'Failed to create position';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
};

export const useUpdatePosition = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (id: string, data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.patch(`/teacher-positions/${id}`, data);
      return response.data.data.position;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error?.message || 'Failed to update position';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
};

export const useDeletePosition = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const delete_ = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await api.delete(`/teacher-positions/${id}`);
      return true;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error?.message || 'Failed to delete position';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return { delete: delete_, loading, error };
};
