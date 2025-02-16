export const requestData = async (
    path: string,
    body?: any,
    type?: string,
    headers?: HeadersInit
): Promise<any> => {
    const method = type || 'get';
    const args:RequestInit = {body, method, headers};
    
    try {
        const response = await fetch(path, args);
        if (!response.ok) {
            throw new Error(`Response Error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error: `, error);
        throw error;
    }
};
