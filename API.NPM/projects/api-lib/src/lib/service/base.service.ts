import { Inject, Injectable, InjectionToken } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
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

  protected generateParams(param1?: [string, string], param2?: [string, number]): HttpParams | undefined {
    if (param1 && param2) {
      const params = new HttpParams().set(param1[0], param1[1]).append(param2[0], param2[1]);
      return params;
    } else if (param1 && !param2) {
      const params = new HttpParams().set(param1[0], param1[1]);
      return params;
    } else if (!param1 && param2) {
      const params = new HttpParams().set(param2[0], param2[1]);
      return params;
    } else {
      return undefined;
    }
  }

}
