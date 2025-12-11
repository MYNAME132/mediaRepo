import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { ConfigService } from '@nestjs/config';
import * as FormData from 'form-data';

@Injectable()
export class HttpClientService {
  constructor(private config: ConfigService) { }

  private addUserHeaders(user: any, headers?: any) {
    return {
      ...headers,
      'x-user-id': user.userId,
      'x-user-role': user.role,
      'x-organization': user.organizationId,
    };
  }

  async get(url: string, user: any, config?: AxiosRequestConfig) {
    return axios.get(url, {
      ...config,
      headers: this.addUserHeaders(user, config?.headers),
    });
  }

  async post(url: string, user: any, data: any, config?: AxiosRequestConfig) {
    const isFormData = data instanceof FormData;

    const headers: any = {
      ...this.addUserHeaders(user, config?.headers),
      ...(isFormData ? data.getHeaders() : {}),
    };

    if (isFormData) {
      const getLength = (data as any).getLength?.bind(data);
      if (typeof getLength === 'function') {
        try {
          const length: number = await new Promise((resolve, reject) => {
            getLength((err: any, len: number) => {
              if (err) return reject(err);
              resolve(len);
            });
          });
          headers['Content-Length'] = length;
        } catch (e) {
          console.log('Could not calculate Content-Length for FormData:', e);
        }
      }
    }

    const axiosConfig: AxiosRequestConfig = {
      maxContentLength: isFormData ? Infinity : config?.maxContentLength,
      maxBodyLength: isFormData ? Infinity : config?.maxBodyLength,
      ...config,
      headers,
    };

    return axios.post(url, data, axiosConfig);
  }

  async put(url: string, user: any, data: any, config?: AxiosRequestConfig) {
    const isFormData = data instanceof FormData;

    const headers: any = {
      ...this.addUserHeaders(user, config?.headers),
      ...(isFormData ? data.getHeaders() : {}),
    };

    if (isFormData) {
      const getLength = (data as any).getLength?.bind(data);
      if (typeof getLength === 'function') {
        try {
          const length: number = await new Promise((resolve, reject) => {
            getLength((err: any, len: number) => {
              if (err) return reject(err);
              resolve(len);
            });
          });
          headers['Content-Length'] = length;
        } catch (e) {
          console.log('Could not calculate Content-Length for FormData:', e);
        }
      }
    }

    const axiosConfig: AxiosRequestConfig = {
      maxContentLength: isFormData ? Infinity : config?.maxContentLength,
      maxBodyLength: isFormData ? Infinity : config?.maxBodyLength,
      ...config,
      headers,
    };

    console.log('PUT URL:', url);
    console.log('Headers:', headers);

    if (isFormData) {
      const formKeys = Object.keys(data['_streams'] || {});
      console.log('FormData keys (approx):', formKeys.length ? formKeys : 'unknown');
    } else {
      console.log('Body:', data);
    }

    return axios.put(url, data, axiosConfig);
  }
}
