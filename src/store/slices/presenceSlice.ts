import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '@/lib/axios'
import { Presence } from '@/types'

interface PresenceState {
  presences: Presence[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PresenceState = {
  presences: [],
  isLoading: false,
  error: null,
}

export const scanPresence = createAsyncThunk(
  'presence/scan',
  async (matricule: string) => {
    console.log(`QR Code contains: ${matricule}`); // Log the contents of qrCode
    const response = await api.post('/presences/scan', { matricule })
    console.log(response);
    return response.data
  }
) 

export const getPresences = createAsyncThunk(
  'presence/getAll',
  async (filters: {
    startDate?: string;
    endDate?: string;
    status?: string;
    referentiel?: string;
  }) => {
    const params = new URLSearchParams()
    Object.entries(filters).forEach(([key, value]) => {
      if (value) {
        params.append(key, value)
      }
    })
    const response = await api.get(`/presences?${params.toString()}`)
    return response.data
  }
)

export const getStudentPresences = createAsyncThunk(
  'presence/getStudent',
  async (userId: string) => {
    const response = await api.get(`/presences/${userId}`)
    return response.data.presences
  }
)

const presenceSlice = createSlice({
  name: 'presence',
  initialState,
  reducers: {
    clearPresences: (state) => {
      state.presences = []
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(scanPresence.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(scanPresence.fulfilled, (state, action) => {
        state.isLoading = false
        state.presences = [action.payload, ...state.presences]
      })
      .addCase(scanPresence.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Une erreur est survenue'
      })
      .addCase(getPresences.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getPresences.fulfilled, (state, action) => {
        state.isLoading = false
        state.presences = action.payload
      })
      .addCase(getPresences.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Une erreur est survenue'
      })
      .addCase(getStudentPresences.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getStudentPresences.fulfilled, (state, action) => {
        state.isLoading = false
        state.presences = action.payload
      })
      .addCase(getStudentPresences.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Une erreur est survenue'
      })
  },
})

export const { clearPresences } = presenceSlice.actions
export default presenceSlice.reducer