import { apiClient, API_ENDPOINTS } from '../config/api';

export async function callProc(procName, params, onSuccess, onError) {
  try {
    const response = await apiClient.post(API_ENDPOINTS.PROC, {
      procName,
      params
    });
    
    if (onSuccess) {
      onSuccess(response);
    }
    
    return response;
  } catch (error) {
    if (onError) {
      onError(error);
    }
    throw error;
  }
}