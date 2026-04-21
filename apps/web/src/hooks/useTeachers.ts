import { useState, useEffect } from 'react';
import api from '../axios.js';
import type { ITeacher } from '@mern/shared';

interface UseTeachersParams {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export const useTeachers = (params: UseTeachersParams = {}) => {
  const [teachers, setTeachers] = useState<ITeacher[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTeachers = async () => {
    setLoading(true);
    setError(null);

    try {
      const queryParams = new URLSearchParams();
      if (params.page) queryParams.append('page', params.page.toString());
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.search) queryParams.append('search', params.search);
      if (params.isActive !== undefined)
        queryParams.append('isActive', params.isActive.toString());

      const response = await api.get(
        `/api/v1/teachers?${queryParams.toString()}`,
      );
      setTeachers(response.data.data.teachers);
      setTotal(response.data.data.pagination.total);
    } catch (err: any) {
      setError(
        err.response?.data?.error?.message || 'Failed to fetch teachers',
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, [params.page, params.limit, params.search, params.isActive]);

  return { teachers, total, loading, error, refetch: fetchTeachers };
};

export const useTeacherById = (id: string | null) => {
  const [teacher, setTeacher] = useState<ITeacher | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchTeacher = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get(`/api/v1/teachers/${id}`);
        setTeacher(response.data.data.teacher);
      } catch (err: any) {
        setError(
          err.response?.data?.error?.message || 'Failed to fetch teacher',
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTeacher();
  }, [id]);

  return { teacher, loading, error };
};

export const useCreateTeacher = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const create = async (data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/api/v1/teachers', data);
      return response.data.data.teacher;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error?.message || 'Failed to create teacher';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return { create, loading, error };
};

export const useUpdateTeacher = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const update = async (id: string, data: any) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.patch(`/api/v1/teachers/${id}`, data);
      return response.data.data.teacher;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error?.message || 'Failed to update teacher';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return { update, loading, error };
};

export const useDeleteTeacher = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const delete_ = async (id: string) => {
    setLoading(true);
    setError(null);

    try {
      await api.delete(`/api/v1/teachers/${id}`);
      return true;
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error?.message || 'Failed to delete teacher';
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return { delete: delete_, loading, error };
};
