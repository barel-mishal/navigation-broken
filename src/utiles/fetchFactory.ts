export const fetchFactory = async (
    url: string, 
    method: "GET" | "POST" | "PUT" | "DELETE", 
    body: any
) => {
    return fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    })
}