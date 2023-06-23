import { Observable, lastValueFrom } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL, ServiceBase } from './base.service';
import { GetIngredientDto } from '../dto/ingredient/get-ingredient.dto.model';
import { IngredientDto } from '../dto/ingredient/ingredient.dto.model';

@Injectable({
  providedIn: 'root',
})
export class IngredientService extends ServiceBase {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) baseUrl?: string
  ) {
    super(http, baseUrl);
    this.serviceUrl = `${baseUrl}/api/Ingredient`;
  }

  private readonly serviceUrl: string;

  public get(id: number): Observable<GetIngredientDto> {
    return this.http.get<GetIngredientDto>(`${this.serviceUrl}/Get/${id}`, {
      headers: this.generateHeaders(),
    });
  }

  public getAll(): Observable<GetIngredientDto[]> {
    return this.http.get<GetIngredientDto[]>(`${this.serviceUrl}/GetAll`, {
      headers: this.generateHeaders(),
    });
  }

  public getAllAsync(): Promise<GetIngredientDto[]> {
    return lastValueFrom(
      this.http.get<GetIngredientDto[]>(`${this.serviceUrl}/GetAll/Async`, {
        headers: this.generateHeaders(),
      })
    );
  }

  public save(ingredient: IngredientDto): Observable<IngredientDto> {
    return this.http.post<IngredientDto>(`${this.serviceUrl}/Save`, ingredient, {
      headers: this.generateHeaders(),
    });
  }

  public bulkSave(ingredient: IngredientDto[]): Observable<IngredientDto[]> {
    return this.http.post<IngredientDto[]>(`${this.serviceUrl}/BulkSave`, ingredient, {
      headers: this.generateHeaders(),
    }
    );
  }

  public delete(id: number): Observable<IngredientDto> {
    return this.http.delete<IngredientDto>(`${this.serviceUrl}/Delete/${id}`, {
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
