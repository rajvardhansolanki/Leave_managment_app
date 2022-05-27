export const getUser = () => {
    const userStr = sessionStorage.getItem('user');
    if (userStr) return JSON.parse(userStr)
    else return null;
}

export const getToken = () => {
    return localStorage.getItem('token') || null;
}
export const getUserRole = () => {
    return localStorage.getItem('role') || null;
}

export const setUserSession = (token, role) => {
    localStorage.setItem('token', token);
    localStorage.setItem('role', role);
}

export const removeUserSession = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
}
