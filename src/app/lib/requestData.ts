export const requestData = async (path: string, body?: object): Promise<any> => {
    try {
        const response = await fetch(path, body);
        if (!response.ok) {
            throw new Error(`Response Error: ${response.statusText}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error: `, error);
        throw error;
    }
};
