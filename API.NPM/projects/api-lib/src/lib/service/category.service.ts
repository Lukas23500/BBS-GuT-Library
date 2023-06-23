import { Observable, lastValueFrom } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL, ServiceBase } from './base.service';
import { GetCategoryDto } from '../dto/category/get-category.dto.model';
import { CategoryDto } from '../dto/category/category.dto.model';

@Injectable({
  providedIn: 'root',
})
export class CategoryService extends ServiceBase {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) baseUrl?: string
  ) {
    super(http, baseUrl);
    this.serviceUrl = `${baseUrl}/api/Category`;
  }

  private readonly serviceUrl: string;

  public get(id: number): Observable<GetCategoryDto> {
    return this.http.get<GetCategoryDto>(`${this.serviceUrl}/Get/${id}`, {
      headers: this.generateHeaders(),
    });
  }

  public getAll(): Observable<GetCategoryDto[]> {
    return this.http.get<GetCategoryDto[]>(`${this.serviceUrl}/GetAll`, {
      headers: this.generateHeaders(),
    });
  }

  public getAllAsync(): Promise<GetCategoryDto[]> {
    return lastValueFrom(
      this.http.get<GetCategoryDto[]>(`${this.serviceUrl}/GetAll/Async`, {
        headers: this.generateHeaders(),
      })
    );
  }

  public save(category: CategoryDto): Observable<CategoryDto> {
    return this.http.post<CategoryDto>(`${this.serviceUrl}/Save`, category, {
      headers: this.generateHeaders(),
    });
  }

  public bulkSave(category: CategoryDto[]): Observable<CategoryDto[]> {
    return this.http.post<CategoryDto[]>(`${this.serviceUrl}/BulkSave`, category, {
      headers: this.generateHeaders(),
    });
  }

  public delete(id: number): Observable<CategoryDto> {
    return this.http.delete<CategoryDto>(`${this.serviceUrl}/Delete/${id}`, {
      headers: this.generateHeaders(),
    });
  }

  public bulkDelete(id: number[]): Observable<number> {
    return this.http.delete<number>(`${this.serviceUrl}/BulkDelete/`, {
      body: id,
      headers: this.generateHeaders(),
    });
  }
}
