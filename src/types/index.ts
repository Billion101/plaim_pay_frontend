export interface User {
    id: string
    first_name: string
    last_name: string
    phone: string
    plam_code?: string
    amount: string
    vertify_plam: boolean
    created_at: string
    updated_at?: string
}

export interface LoginRequest {
    phone: string
    password: string
}

export interface RegisterRequest {
    first_name: string
    last_name: string
    phone: string
    password: string
    plam_code?: string
}

export interface AuthResponse {
    user: User
    token: string
}

export interface Order {
    id: string
    user_id: string
    amount: string
    payment_method: string
    payment_status: string
    transaction_id: string
    items: any
    created_at: string
    updated_at: string
}

export interface CreateOrderRequest {
    amount: number
    description?: string
    items?: any
}

export interface TopupRequest {
    amount: number
}

export interface Product {
    id: string
    name: string
    price: number
    image: string
    description: string
    category: string
}

export interface CartItem {
    product: Product
    quantity: number
}