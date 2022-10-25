const backendUrl = "http://localhost:5000";

export function makePostRequest(path: string, body?: any): Promise<any> {
  return fetch(`${backendUrl}/${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.getItem("token"),
    },
    body: JSON.stringify({ ...body }),
  }).then((res) => res.json());
}

export function makeGetRequest(path: string): Promise<any> {
  return fetch(`${backendUrl}/${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`
    },
  }).then((res) => res.json());
}
