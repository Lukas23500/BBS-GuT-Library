import { Observable, lastValueFrom } from 'rxjs';
import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { API_BASE_URL, ServiceBase } from './base.service';
import { GetRecipeIngredientDto } from '../dto/recipe-igredient/get-recipe-igredient.dto.model';
import { RecipeIngredientDto } from '../dto/recipe-igredient/recipe-igredient.dto.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeIngredientService extends ServiceBase {
  constructor(
    private http: HttpClient,
    @Inject(API_BASE_URL) baseUrl?: string
  ) {
    super(http, baseUrl);
    this.serviceUrl = `${baseUrl}/api/RecipeIngredient`;
  }

  private readonly serviceUrl: string;

  public get(id: number): Observable<GetRecipeIngredientDto> {
    return this.http.get<GetRecipeIngredientDto>(`${this.serviceUrl}/Get/${id}`, {
      headers: this.generateHeaders(),
    });
  }

  public getAll(): Observable<GetRecipeIngredientDto[]> {
    return this.http.get<GetRecipeIngredientDto[]>(`${this.serviceUrl}/GetAll`, {
      headers: this.generateHeaders(),
    });
  }

  public getAllAsync(): Promise<GetRecipeIngredientDto[]> {
    return lastValueFrom(
      this.http.get<GetRecipeIngredientDto[]>(`${this.serviceUrl}/GetAll/Async`, {
        headers: this.generateHeaders(),
      })
    );
  }

  public save(recipeIngredient: RecipeIngredientDto): Observable<RecipeIngredientDto> {
    return this.http.post<RecipeIngredientDto>(`${this.serviceUrl}/Save`, recipeIngredient, {
      headers: this.generateHeaders(),
    });
  }

  public bulkSave(recipeIngredient: RecipeIngredientDto[]): Observable<RecipeIngredientDto[]> {
    return this.http.post<RecipeIngredientDto[]>(`${this.serviceUrl}/BulkSave`, recipeIngredient, {
      headers: this.generateHeaders(),
    }
    );
  }

  public delete(id: number): Observable<RecipeIngredientDto> {
    return this.http.delete<RecipeIngredientDto>(`${this.serviceUrl}/Delete/${id}`, {
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
