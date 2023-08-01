const token = localStorage.getItem('token');

export const config = {
    headers: {
        Authorization: `Bearer ${token}`
    }
}