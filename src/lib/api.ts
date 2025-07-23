const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api';

// Types for API requests and responses
export interface TryOnRequest {
  human_image_url: string;
  cloth_image_urls: string[];
  model_name?: string;
  callback_url?: string;
}

export interface TryOnResponse {
  status: string;
  message?: string;
  task_id: string;
  request_id: string;
}


export interface TryOnResultResponse {
  status: string;
  task_id: string;
  task_status: string;
  task_status_msg: string;
  images?: Array<{
    index: number;
    url: string;
  }>;
}

export interface GPTTryOnRequest {
  person_image_url: string;
  clothing_image_urls: string[];
  prompt?: string;
  quality?: string;
  size?: string;
  output_format?: string;
  output_compression?: number;
}

export interface GPTTryOnResponse {
  status: string;
  message: string;
  image_url: string;
  request_id: string;
  image_b64?: string;
}

export interface VeoFashionVideoRequest {
  clothing_image_url: string;
  model_image_url?: string;
  model_preference?: string;
  style?: string;
  duration_seconds?: number;
  aspect_ratio?: string;
}

export interface VeoFashionVideoResponse {
  status: string;
  message: string;
  video_url?: string;
  video_path?: string;
  model: string;
  duration_seconds: number;
  fps: number;
  aspect_ratio: string;
  s3_uploaded: boolean;
  generation_method: string;
  tryon_used?: boolean;
  original_model_image?: string;
  request_id: string;
}

// API Error type
export interface APIError {
  status: string;
  message: string;
  code?: number;
}

class APIService {
  private baseURL: string;

  constructor(baseURL: string = API_BASE_URL) {
    this.baseURL = baseURL;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders: HeadersInit = {
      'Accept': 'application/json',
    };

    // Don't set Content-Type for FormData (let browser set it with boundary)
    if (!(options.body instanceof FormData)) {
      defaultHeaders['Content-Type'] = 'application/json';
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      try {
        const errorData: APIError = await response.json();
        errorMessage = errorData.message || errorMessage;
      } catch {
        // Use default error message if JSON parsing fails
      }
      throw new Error(errorMessage);
    }

    return response.json();
  }

  // Upload file to S3 using presigned URL approach
  async uploadToS3(file: File, folder: string = 'user-uploads'): Promise<string> {
    // Step 1: Get presigned URL from backend
    const presignedResponse = await this.makeRequest<{
      url: string;
      fields: Record<string, any>;
      s3Key: string;
      getUrl: string;
    }>('/s3/get-upload-url', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filename: file.name,
        contentType: file.type
      }),
    });

    // Step 2: Upload directly to S3 using presigned URL
    const formData = new FormData();
    
    // Add all the required fields from the presigned response
    Object.entries(presignedResponse.fields).forEach(([key, value]) => {
      formData.append(key, value as string);
    });
    
    // Add the file last (S3 requirement)
    formData.append('file', file);

    // Upload to S3
    const uploadResponse = await fetch(presignedResponse.url, {
      method: 'POST',
      body: formData,
    });

    if (!uploadResponse.ok) {
      throw new Error(`S3 upload failed: ${uploadResponse.status} ${uploadResponse.statusText}`);
    }

    // Return the presigned GET URL that can be used by the backend
    return presignedResponse.getUrl;
  }

  // Kling AI Endpoints
  async klingTryOn(request: TryOnRequest): Promise<TryOnResponse> {
    const formData = new FormData();
    formData.append('human_image_url', request.human_image_url);
    request.cloth_image_urls.forEach(url => {
      formData.append('cloth_image_urls', url);
    });
    if (request.model_name) {
      formData.append('model_name', request.model_name);
    }
    if (request.callback_url) {
      formData.append('callback_url', request.callback_url);
    }

    return this.makeRequest<TryOnResponse>('/kling/try-on', {
      method: 'POST',
      body: formData,
    });
  }

  async getKlingTryOnResult(taskId: string): Promise<TryOnResultResponse> {
    return this.makeRequest<TryOnResultResponse>(`/kling/${taskId}`, {
      method: 'GET',
    });
  }

  // GPT-4o Endpoints
  async gptTryOn(request: GPTTryOnRequest): Promise<GPTTryOnResponse> {
    const formData = new FormData();
    formData.append('person_image_url', request.person_image_url);
    request.clothing_image_urls.forEach(url => {
      formData.append('clothing_image_urls', url);
    });
    if (request.prompt) {
      formData.append('prompt', request.prompt);
    }
    if (request.quality) {
      formData.append('quality', request.quality);
    }
    if (request.size) {
      formData.append('size', request.size);
    }
    if (request.output_format) {
      formData.append('output_format', request.output_format);
    }
    if (request.output_compression !== undefined) {
      formData.append('output_compression', request.output_compression.toString());
    }

    return this.makeRequest<GPTTryOnResponse>('/gpt/tryon', {
      method: 'POST',
      body: formData,
    });
  }

  async gptTryOnGenerateModel(request: Omit<GPTTryOnRequest, 'person_image_url'> & { model_preference?: string }): Promise<GPTTryOnResponse> {
    const formData = new FormData();
    request.clothing_image_urls.forEach(url => {
      formData.append('clothing_image_urls', url);
    });
    if (request.model_preference) {
      formData.append('model_preference', request.model_preference);
    }
    if (request.quality) {
      formData.append('quality', request.quality);
    }
    if (request.size) {
      formData.append('size', request.size);
    }
    if (request.output_format) {
      formData.append('output_format', request.output_format);
    }
    if (request.output_compression !== undefined) {
      formData.append('output_compression', request.output_compression.toString());
    }

    return this.makeRequest<GPTTryOnResponse>('/gpt/tryon-generate-model', {
      method: 'POST',
      body: formData,
    });
  }

  // VEO Video Generation
  async veoFashionVideo(request: VeoFashionVideoRequest): Promise<VeoFashionVideoResponse> {
    const formData = new FormData();
    formData.append('clothing_image_url', request.clothing_image_url);
    if (request.model_image_url) {
      formData.append('model_image_url', request.model_image_url);
    }
    if (request.model_preference) {
      formData.append('model_preference', request.model_preference);
    }
    if (request.style) {
      formData.append('style', request.style);
    }
    if (request.duration_seconds !== undefined) {
      formData.append('duration_seconds', request.duration_seconds.toString());
    }
    if (request.aspect_ratio) {
      formData.append('aspect_ratio', request.aspect_ratio);
    }

    return this.makeRequest<VeoFashionVideoResponse>('/veo/fashion-video', {
      method: 'POST',
      body: formData,
    });
  }

  // Utility method to poll for async task results
  async pollForResult<T>(
    getResultFn: () => Promise<T>,
    isCompleteFn: (result: T) => boolean,
    maxAttempts: number = 60,
    intervalMs: number = 5000
  ): Promise<T> {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const result = await getResultFn();
      
      if (isCompleteFn(result)) {
        return result;
      }

      // Wait before next attempt
      await new Promise(resolve => setTimeout(resolve, intervalMs));
    }

    throw new Error('Polling timeout: Task did not complete within the expected time');
  }
}

// Create and export a singleton instance
export const apiService = new APIService();

// Helper functions for checking task completion
export const isKlingTryOnComplete = (result: TryOnResultResponse): boolean => {
  return result.task_status === 'succeed' || result.task_status === 'failed';
};

// Export individual functions for convenience
export const {
  uploadToS3,
  klingTryOn,
  getKlingTryOnResult,
  gptTryOn,
  gptTryOnGenerateModel,
  veoFashionVideo,
  pollForResult,
} = apiService; 