// src/utils/api.ts hoặc utils/api.ts

// Lấy URL backend từ biến môi trường (sẽ cấu hình ở bước sau)
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000';

// Hàm fetch cơ bản (có thể dùng axios nếu bạn thích)
const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`; // Nối base URL và endpoint

  // **TODO:** Thêm logic lấy và gửi JWT token ở đây nếu cần
  // const token = localStorage.getItem('accessToken');
  // if (token) {
  //   options.headers = {
  //     ...options.headers,
  //     'Authorization': `Bearer ${token}`,
  //     'Content-Type': 'application/json', // Thêm Content-Type nếu gửi JSON
  //   };
  // } else {
  //   options.headers = {
  //     ...options.headers,
  //     'Content-Type': 'application/json',
  //   };
  // }
  // Tạm thời chỉ thêm Content-Type
   options.headers = {
     ...options.headers,
     'Content-Type': 'application/json',
   };


  try {
    const response = await fetch(url, options);
    const data = await response.json(); // Parse JSON response

    if (!response.ok) {
      // Nếu response không ok (status code không phải 2xx), throw lỗi với data từ backend
      console.error('API Error Response:', data);
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }

    // Kiểm tra cấu trúc BaseResponseDto từ backend
    if (data.statusCode >= 400) {
         console.error('API Logic Error:', data);
         throw new Error(data.message || 'Lỗi từ API');
    }

    return data.data; // Chỉ trả về phần data từ BaseResponseDto
  } catch (error) {
    console.error('Fetch API Error:', error);
    // Ném lại lỗi để component có thể bắt và xử lý
    throw error;
  }
};

// Hàm gọi API lấy danh sách sản phẩm
export const getProducts = async (params: Record<string, string> = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/products${queryString ? `?${queryString}` : ''}`;
    return await fetchApi(endpoint, { method: 'GET' });
};

// Hàm gọi API tạo sản phẩm
export const createProduct = async (productData: any) => { // Nên định nghĩa kiểu dữ liệu cụ thể cho productData
    return await fetchApi('/products', {
        method: 'POST',
        body: JSON.stringify(productData),
    });
};

// Hàm gọi API lấy chi tiết sản phẩm
export const getProductById = async (id: number | string) => {
    return await fetchApi(`/products/${id}`, { method: 'GET' });
};

// Hàm gọi API cập nhật sản phẩm
export const updateProduct = async (id: number | string, productData: any) => {
     return await fetchApi(`/products/${id}`, {
        method: 'PUT',
        body: JSON.stringify(productData),
    });
};

// Hàm gọi API xóa sản phẩm
export const deleteProduct = async (id: number | string) => {
     return await fetchApi(`/products/${id}`, { method: 'DELETE' });
};

// Hàm gọi API Login
export const login = async (credentials: any) => { // Nên định nghĩa kiểu LoginDto
    // Hàm fetchApi trả về data.data, nên ở đây cần lấy accessToken từ đó
    const responseData = await fetchApi('/auth/login', {
         method: 'POST',
         body: JSON.stringify(credentials),
     });
     return responseData; // responseData ở đây đã là { accessToken: '...' }
};

// **TODO:** Thêm các hàm gọi API khác (Register, Upload, ...) nếu cần