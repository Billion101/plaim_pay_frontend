import axios from 'axios'
import {
    LoginRequest,
    RegisterRequest,
    AuthResponse,
    User,
    Order,
    CreateOrderRequest,
    TopupRequest
} from '../types'

const API_BASE_URL = 'https://api.ceit-iot-lab.site/api'

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
})

// Add token to requests if available
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token')
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
})

export const authAPI = {
    login: async (data: LoginRequest): Promise<AuthResponse> => {
        const response = await api.post('/auth/login', data)
        return response.data
    },

    register: async (data: RegisterRequest): Promise<AuthResponse> => {
        const response = await api.post('/auth/register', data)
        return response.data
    },
}

export const userAPI = {
    getProfile: async (): Promise<User> => {
        const response = await api.get('/users/profile')
        return response.data
    },

    verifyPalm: async (plam_code: string): Promise<{ message: string; user: User }> => {
        const response = await api.post('/users/verify-palm', { plam_code })
        return response.data
    },

    topup: async (data: TopupRequest): Promise<any> => {
        const response = await api.post('/users/topup', data)
        return response.data
    },

    topupWithPalm: async (data: TopupRequest, palmCode: string): Promise<any> => {
        const response = await api.post('/users/topup', data, {
            headers: {
                'x-palm-code': palmCode,
            },
        })
        return response.data
    },
}

export const orderAPI = {
    createOrder: async (data: CreateOrderRequest): Promise<any> => {
        const response = await api.post('/orders', data)
        return response.data
    },

    createOrderWithPalm: async (data: CreateOrderRequest, palmCode: string): Promise<any> => {
        const response = await api.post('/orders', data, {
            headers: {
                'x-palm-code': palmCode,
            },
        })
        return response.data
    },

    getAllOrders: async (): Promise<Order[]> => {
        const response = await api.get('/orders')
        return response.data
    },
}

export const transactionAPI = {
    getTopupHistory: async (): Promise<{ message: string; total: number; transactions: Order[] }> => {
        const response = await api.get('/transactions/topup-history')
        return response.data
    },

    getOrderHistory: async (): Promise<{ message: string; total: number; transactions: Order[] }> => {
        const response = await api.get('/transactions/order-history')
        return response.data
    },
}

export const paymentAPI = {
    checkStatus: async (orderId: string): Promise<any> => {
        const response = await api.get(`/payment/status/${orderId}`)
        return response.data
    },
}

export default api