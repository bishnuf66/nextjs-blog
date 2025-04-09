// Set a cookie (expires in 1 day )
export const setCookie = (name: string, value: string, days = 1) => {
  if (typeof document === "undefined") return null; 
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`;
  };
  
  // Get a cookie by name
  export const getCookie = (name: string): string | null => {
    if (typeof document === "undefined") return null; 
    const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
    return match ? decodeURIComponent(match[2]) : null;
  };
  
  // Delete a cookie
  export const deleteCookie = (name: string) => {
    if (typeof document === "undefined") return null;
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/`;
  };
  