export const ApiMap = {
    getUser: {
        path: "{{host}}/rest/v2/user",
        method: "GET",
        headers: {
            "Authorization": "Bearer {{token}}"
        }
    }
}

type ApiRequestConfig = {
    path: string;
    method: string;
    headers: Record<string, string>;
};

export function resolveApiConfig(
    config: ApiRequestConfig,
    replacements: Record<string, string>
): ApiRequestConfig {
    const replacedHeaders = Object.fromEntries(
        Object.entries(config.headers).map(([key, value]) => [
            key,
            replacePlaceholders(value, replacements)
        ])
    );

    return {
        ...config,
        path: replacePlaceholders(config.path, replacements),
        headers: replacedHeaders
    };
}

function replacePlaceholders(str: string, replacements: Record<string, string>): string {
    return str.replace(/{{(.*?)}}/g, (_, key) => replacements[key] ?? "");
}


export async function request<T = any>(
    apiKey: keyof typeof ApiMap,
    replacements: Record<string, string>,
    body?: any
  ): Promise<T> {
    const config = resolveApiConfig(ApiMap[apiKey], replacements);

    const fetchOptions: RequestInit = {
      method: config.method,
      headers: config.headers,
    };
  
    // Only include body for non-GET/HEAD requests
    if (body && config.method !== 'GET' && config.method !== 'HEAD') {
      fetchOptions.body = JSON.stringify(body);
    }
    
    // Remove double slashes from URL, but preserve https://
    const url = config.path
    const cleanUrl = url.replace(/([^:])\/+/g, '$1/');
    console.log(cleanUrl)
    const res = await fetch(cleanUrl, fetchOptions);
  
    if (!res.ok) {
      throw new Error(`API call failed with status ${res.status}`);
    }
  
    return res.json() as Promise<T>;
  }
  