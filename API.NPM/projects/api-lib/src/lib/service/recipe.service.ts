import { Observable, lastValueFrom } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL, ServiceBase } from './base.service';
import { GetRecipeDto } from '../dto/recipe/get-recipe.dto.model';
import { RecipeDto } from '../dto/recipe/recipe.dto.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService extends ServiceBase {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) baseUrl?: string
  ) {
    super(http, baseUrl);
    this.serviceUrl = `${baseUrl}/api/Recipe`;
  }

  private readonly serviceUrl: string;

  public get(id: number): Observable<GetRecipeDto> {
    return this.http.get<GetRecipeDto>(`${this.serviceUrl}/Get/${id}`, {
      headers: this.generateHeaders(),
    });
  }

  public getAll(): Observable<GetRecipeDto[]> {
    return this.http.get<GetRecipeDto[]>(`${this.serviceUrl}/GetAll`, {
      headers: this.generateHeaders(),
    });
  }

  public getAllAsync(): Promise<GetRecipeDto[]> {
    return lastValueFrom(
      this.http.get<GetRecipeDto[]>(`${this.serviceUrl}/GetAll/Async`, {
        headers: this.generateHeaders(),
      })
    );
  }

  public save(recipe: RecipeDto): Observable<RecipeDto> {
    return this.http.post<RecipeDto>(`${this.serviceUrl}/Save`, recipe, {
      headers: this.generateHeaders(),
    });
  }

  public bulkSave(recipe: RecipeDto[]): Observable<RecipeDto[]> {
    return this.http.post<RecipeDto[]>(`${this.serviceUrl}/BulkSave`, recipe, {
      headers: this.generateHeaders(),
    }
    );
  }

  public delete(id: number): Observable<RecipeDto> {
    return this.http.delete<RecipeDto>(`${this.serviceUrl}/Delete/${id}`, {
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
