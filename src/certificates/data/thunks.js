/* eslint-disable import/prefer-default-export */
import { createAsyncThunk } from '@reduxjs/toolkit';

import { RequestStatus } from '../../data/constants';
import { getCertificates } from './api';

export const fetchCertificates = createAsyncThunk(
  'certificates/fetchCertificates',
  async (courseId, { rejectWithValue }) => {
    try {
      const certificates = await getCertificates(courseId);
      return certificates;
    } catch (error) {
      if (error.response && error.response.status === 403) {
        return rejectWithValue({ courseId, status: RequestStatus.DENIED });
      }
      return rejectWithValue({ courseId, status: RequestStatus.FAILED });
    }
  },
);
