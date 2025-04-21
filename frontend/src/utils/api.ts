// src/utils/api.ts hoặc utils/api.ts

// Lấy URL backend từ biến môi trường (sẽ cấu hình ở bước sau)
const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000";

// Hàm fetch cơ bản (có thể dùng axios nếu bạn thích)
const fetchApi = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE_URL}${endpoint}`; // Nối base URL và endpoint

  // Initialize headers if they don't exist
  const headers: HeadersInit = { ...options.headers };

  // Add Content-Type for relevant methods (POST, PUT, PATCH)
  // GET/DELETE typically don't need Content-Type: application/json unless specifically required by backend
  if (['POST', 'PUT', 'PATCH'].includes(options.method?.toUpperCase() ?? '')) {
    headers['Content-Type'] = 'application/json';
  }

  // Add Authorization header if token exists (client-side only)
  if (typeof window !== "undefined") {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
      // console.log("Sending token:", token); // Optional: debug log
    } else {
      console.log("No token found in localStorage for API request."); // Optional: debug log
    }
  }

  // Assign the potentially modified headers back to options
  options.headers = headers;

  try {
    // console.log(`Fetching API: ${options.method || 'GET'} ${url}`, options); // Optional: Log the request details
    const response = await fetch(url, options);

    if (!response.ok) {
      // If response not ok, try to parse JSON for backend error message
      let errorData = { message: `HTTP error! status: ${response.status}` };
      try {
        errorData = await response.json(); // Try parsing error response
      } catch (parseError) {
        // If parsing fails, use the basic HTTP error
        console.error("Failed to parse error response:", parseError);
      }
      console.error("API Error Response:", errorData);
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json(); // Parse JSON response for successful requests

    // Kiểm tra cấu trúc BaseResponseDto từ backend (nếu response was ok)
    if (data.statusCode && data.statusCode >= 400) {
      console.error("API Logic Error:", data);
      throw new Error(data.message || "Lỗi từ API");
    }

    return data.data; // Chỉ trả về phần data từ BaseResponseDto
  } catch (error) {
    console.error("Fetch API Error:", error);
    // Ném lại lỗi để component có thể bắt và xử lý
    // Ensure the error object has a message property
    if (error instanceof Error) {
      throw error;
    } else {
      throw new Error(String(error)); // Convert unknown error type to string
    }
  }
};

// **HÀM MỚI CHO UPLOAD ẢNH**
export const uploadProductImage = async (
  file: File
): Promise<{ imageUrl: string } | null> => {
  const url = `${API_BASE_URL}/products/upload`;
  const formData = new FormData();
  formData.append("image", file); // 'image' phải khớp với field name trong FileInterceptor

  // Lấy token từ localStorage (hoặc nơi bạn lưu trữ)
  const token =
    typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;

  const headers: HeadersInit = {}; // Không cần 'Content-Type' ở đây, trình duyệt sẽ tự thêm với boundary
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: headers, // Chỉ cần gửi token nếu có
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(`API Error Response (Status: ${response.status}):`, data);
      throw new Error(
        data?.message || `HTTP error! status: ${response.status}`
      );
    }

    if (data && data.statusCode && data.statusCode >= 400) {
      console.error("API Logic Error:", data);
      throw new Error(data.message || "Lỗi từ API upload");
    }

    // Trả về phần data chứa imageUrl
    return data?.data ?? null;
  } catch (error) {
    console.error("Upload API Error:", error);
    throw error; // Ném lại lỗi để component xử lý
  }
};

// Hàm gọi API lấy danh sách sản phẩm
export const getProducts = async (params: Record<string, string> = {}) => {
  const queryString = new URLSearchParams(params).toString();
  const endpoint = `/products${queryString ? `?${queryString}` : ""}`;
  return await fetchApi(endpoint, { method: "GET" });
};

// Hàm gọi API tạo sản phẩm
export const createProduct = async (productData: any) => {
  // Nên định nghĩa kiểu dữ liệu cụ thể cho productData
  return await fetchApi("/products", {
    method: "POST",
    body: JSON.stringify(productData),
  });
};

// Hàm gọi API lấy chi tiết sản phẩm
export const getProductById = async (id: number | string) => {
  return await fetchApi(`/products/${id}`, { method: "GET" });
};

// Hàm gọi API cập nhật sản phẩm
export const updateProduct = async (id: number | string, productData: any) => {
  return await fetchApi(`/products/${id}`, {
    method: "PUT",
    body: JSON.stringify(productData),
  });
};

// Hàm gọi API xóa sản phẩm
export const deleteProduct = async (id: number | string) => {
  return await fetchApi(`/products/${id}`, { method: "DELETE" });
};

// Hàm gọi API Login
export const login = async (credentials: any) => {
  // Nên định nghĩa kiểu LoginDto
  const responseData = await fetchApi("/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  // Kiểm tra xem responseData và accessToken có tồn tại không
  if (responseData && responseData.accessToken) {
    // Chỉ chạy ở client-side để truy cập localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem("accessToken", responseData.accessToken);
      console.log("Token saved to localStorage:", responseData.accessToken); // Debug log
    }
  } else {
    // Nếu không có token, ném lỗi hoặc xử lý phù hợp
    console.error("Login response did not contain accessToken:", responseData);
    throw new Error("Không nhận được token đăng nhập.");
  }

  return responseData; // Trả về toàn bộ data nhận được (có thể chỉ chứa accessToken)
};

export const logout = () => {
  // Chỉ chạy ở client-side để truy cập localStorage
  if (typeof window !== "undefined") {
    localStorage.removeItem("accessToken");
    console.log("Token removed from localStorage"); // Debug log
  }
  // Không cần gọi API backend logout trừ khi backend yêu cầu (ví dụ: để vô hiệu hóa token phía server)
  console.log("Frontend logout executed.");
};

// Interface cho dữ liệu gửi đi khi đăng ký
interface RegisterDto {
  username: string;
  password: string;
}

// Interface cho dữ liệu người dùng trả về (không có password)
interface UserResponse {
  id: number;
  username: string;
  createdAt: string;
  updatedAt: string;
}

// Hàm gọi API Đăng ký
export const register = async (userData: RegisterDto): Promise<UserResponse> => {
  try {
    // fetchApi đã xử lý JSON.stringify và Content-Type='application/json' cho POST
    // fetchApi cũng sẽ throw error nếu response.ok là false hoặc backend trả về lỗi logic (qua BaseResponseDto)
    const registeredUser = await fetchApi("/users/register", { // Endpoint từ tóm tắt backend
      method: "POST",
      body: JSON.stringify(userData),
    });

    // Giả sử fetchApi trả về phần data của BaseResponseDto khi thành công
    // Kiểm tra xem dữ liệu trả về có hợp lệ không (ít nhất là có id và username)
    if (registeredUser && registeredUser.id && registeredUser.username) {
      return registeredUser as UserResponse;
    } else {
      // Nếu cấu trúc trả về không đúng như mong đợi
      console.error("Registration response structure invalid:", registeredUser);
      throw new Error("Đăng ký thành công nhưng không nhận được thông tin người dùng hợp lệ.");
    }
  } catch (error) {
    console.error("API Register Error:", error);
    // Ném lại lỗi để component có thể bắt và hiển thị (fetchApi đã xử lý message)
    if (error instanceof Error) {
        throw error; // Ném lại lỗi đã có message
    } else {
        throw new Error("Đã xảy ra lỗi không xác định trong quá trình đăng ký.");
    }
  }
};