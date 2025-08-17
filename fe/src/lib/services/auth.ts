const API_BASE = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3001';

export interface AuthResponse {
    token: string;
    user: {
        email: string;
        name: string;
    };
}

export interface AuthError {
    message: string;
    status: number;
}

export async function signup(
    email: string,
    password: string,
    name: string,
): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/auth/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
        let errorMessage = 'Signup failed';

        try {
            const errorData = await response.json();
            if (errorData.message) {
                errorMessage = errorData.message;
            }
        } catch {
            // If response is not JSON, try to read as text
            const errorText = await response.text();
            if (errorText) {
                errorMessage = errorText;
            }
        }

        if (response.status === 409) {
            errorMessage = 'User already exists';
        } else if (response.status === 400) {
            errorMessage = 'Invalid input data';
        }

        throw new Error(errorMessage);
    }

    return response.json();
}

export async function signin(
    email: string,
    password: string,
): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE}/auth/signin`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        let errorMessage = 'Signin failed';

        try {
            const errorData = await response.json();
            if (errorData.message) {
                errorMessage = errorData.message;
            }
        } catch {
            // If response is not JSON, try to read as text
            const errorText = await response.text();
            if (errorText) {
                errorMessage = errorText;
            }
        }

        if (response.status === 401) {
            errorMessage = 'Invalid credentials';
        } else if (response.status === 400) {
            errorMessage = 'Invalid input data';
        }

        throw new Error(errorMessage);
    }

    return response.json();
}
