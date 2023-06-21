import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
export const CLIENT_URL = new InjectionToken<string>('CLIENT_URL');
export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL');

@Injectable({
  providedIn: 'root',
})
export class ServiceBase {
  serviceBaseUrl: string = '';
  constructor(
    protected _http: HttpClient,
    @Inject(API_BASE_URL) baseUrl?: string
  ) {
    if (baseUrl) this.serviceBaseUrl = baseUrl;
  }

  protected generateHeaders(): HttpHeaders {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return headers;
  }
}
