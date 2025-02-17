import axios from 'axios'

const api = axios.create({
  baseURL: 'https://sascan2.onrender.com/api',
  headers: {
    'Content-Type': 'multipart/form-data',
  }
})

// Add request interceptor for debugging
api.interceptors.request.use(request => {
  console.log('Request:', request.url, request.data)
  const token = localStorage.getItem('token')
  if (token) {
    request.headers.Authorization = `Bearer ${token}`
  }
  return request
})

// Add response interceptor for debugging
api.interceptors.response.use(
  response => response,
  error => {
    console.log('Error response:', error.response?.data)
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api