const backendUrl = "http://localhost:5000";

export function makePostRequest(path: string, body?: any): Promise<any> {
  return fetch(`${backendUrl}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...body }),
  }).then((res) => res.json());
}
