export function isValidEmail(email: string): boolean {
    return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim());
};

export function isValidUsername(username: string): boolean {
    return username.trim().length >= 3;
};

export function isValidPassword(password: string): boolean {
    return password.trim().length >= 6;
};

export function isValidName(name: string): boolean {
    return name.trim().length > 0;
};