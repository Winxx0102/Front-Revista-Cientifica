// const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://revista-cientifica-by-winxx0102.onrender.com';

// export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
//   const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
//   const config: RequestInit = {
//     ...options,
//     // CLAVE: Esto permite que el navegador envíe las cookies automáticamente
//     credentials: 'include', 
//     headers: {
//       'Content-Type': 'application/json',
//       ...options.headers,
//     },
//   };

//   const response = await fetch(url, config);

//   if (response.status === 401) {
//     // Si el backend responde 401, la cookie expiró o no existe
//     throw new Error('Unauthorized');
//   }

//   const data = await response.json().catch(() => ({}));
  
//   if (!response.ok) throw new Error(data.message || 'Error en la petición');
//   return data;
// };
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'https://revista-cientifica-by-winxx0102.onrender.com';

export const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const config: RequestInit = {
    ...options,
    credentials: 'include', 
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  const response = await fetch(url, config);

  // Intentamos leer el JSON de la respuesta antes de evaluar errores para no perder mensajes personalizados
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMsg = Array.isArray(data.message) 
      ? data.message[0] 
      : data.message || (response.status === 401 ? 'Unauthorized' : 'Error en la petición');
      
    throw new Error(errorMsg);
  }

  return data;
};