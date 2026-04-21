import { useState, useEffect } from 'react';
import api from '../axios.js';
import type { ITeacher, ICreateTeacherRequest, IUpdateTeacherRequest } from '@mern/shared';


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
      const response = await api.get('/teachers', { params });
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
        const response = await api.get(`/teachers/${id}`);
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

  const create = async (data: ICreateTeacherRequest) => {

    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/teachers', data);
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

  const update = async (id: string, data: IUpdateTeacherRequest) => {

    setLoading(true);
    setError(null);

    try {
      const response = await api.patch(`/teachers/${id}`, data);
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
      await api.delete(`/teachers/${id}`);
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
