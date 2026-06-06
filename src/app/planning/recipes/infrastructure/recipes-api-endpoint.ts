import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs'; // 1. Agregamos catchError
import { map } from 'rxjs/operators';
import { BaseApiEndpoint } from '../../../shared/infrastructure/base-api-endpoint';
import { BaseResponse } from '../../../shared/infrastructure/base-response';
import { RecipeEntity } from '../domain/model/recipe.entity';
import { CustomSupplyEntity } from '../domain/model/custom-supply.entity';
import { RecipesAssembler } from './recipes.assembler';

import {
  ProductResource,
  CustomSupplyResource,
  CreateProductBody,
  UpdateProductBody,
  AddIngredientBody,
} from './recipes.response';

// ── ENDPOINT ──────────────────────────────────────────────────────────────────

@Injectable({ providedIn: 'root' })
export class RecipesApiEndpoint extends BaseApiEndpoint<
  RecipeEntity,
  ProductResource,
  BaseResponse,
  RecipesAssembler
> {
  private readonly primaryBaseUrl: string;
  private readonly fallbackBaseUrl: string;
  private currentBaseUrl: string;

  private readonly HARDCODED_ACCOUNT_ID = '6a1e6a7f6da7ea565b1c50b2';

  constructor(
    protected override readonly http: HttpClient,
    private readonly recipesAssembler: RecipesAssembler 
  ) {
    const primary = '/api/v1';
    const fallback = 'http://localhost:8080/api/v1'; 

    super(http, `${primary}/products`, recipesAssembler);

    this.primaryBaseUrl = primary;
    this.fallbackBaseUrl = fallback;
    this.currentBaseUrl = primary;
  }

  // ── MECANISMO DE FALLBACK ───────────────────────────
  private withFallback<T>(operation: () => Observable<T>): Observable<T> {
    this.currentBaseUrl = this.fallbackBaseUrl;
    this.endpointUrl = `${this.fallbackBaseUrl}/products`;
    
    const result$ = operation();
    
    this.currentBaseUrl = this.primaryBaseUrl;
    this.endpointUrl = `${this.primaryBaseUrl}/products`;
    
    return result$;
  }

  // ── GET ALL (Por Account ID) ──────────────────────────────────────────────
  getAllByAccountId(accountId: string): Observable<RecipeEntity[]> {
    const operation = () => {
      const params = new HttpParams().set('accountId', this.HARDCODED_ACCOUNT_ID);
      return this.http.get<BaseResponse>(`${this.currentBaseUrl}/products`, { params }).pipe(
        map(response => this.recipesAssembler.toEntitiesFromResponse(response))
      );
    };
    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  // ── CREATE ────────────────────────────────────────────────────────────────
  createProduct(body: CreateProductBody): Observable<RecipeEntity> {
    const operation = () => {
      const bodyWithAccount = { ...body, accountId: this.HARDCODED_ACCOUNT_ID };
      return this.http.post<ProductResource>(`${this.currentBaseUrl}/products`, bodyWithAccount).pipe(
        map(res => this.recipesAssembler.toEntityFromResource(res))
      );
    };
    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  // ── UPDATE ────────────────────────────────────────────────────────────────
  updateProduct(productId: string, body: UpdateProductBody): Observable<RecipeEntity> {
    const operation = () => {
      return this.http.put<ProductResource>(`${this.currentBaseUrl}/products/${productId}`, body).pipe(
        map(res => this.recipesAssembler.toEntityFromResource(res))
      );
    };
    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  // ── ADD INGREDIENT ────────────────────────────────────────────────────────
  addIngredient(productId: string, body: AddIngredientBody): Observable<RecipeEntity> {
    const operation = () => {
      return this.http.post<ProductResource>(`${this.currentBaseUrl}/products/${productId}/ingredients`, body).pipe(
        map(res => this.recipesAssembler.toEntityFromResource(res))
      );
    };
    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  // ── REMOVE INGREDIENT ─────────────────────────────────────────────────────
  removeIngredient(productId: string, customSupplyId: string): Observable<RecipeEntity> {
    const operation = () => {
      return this.http.delete<ProductResource>(`${this.currentBaseUrl}/products/${productId}/ingredients/${customSupplyId}`).pipe(
        map(res => this.recipesAssembler.toEntityFromResource(res))
      );
    };
    return operation().pipe(catchError(() => this.withFallback(operation)));
  }

  // ── CUSTOM SUPPLIES (ingredient catalog) ──────────────────────────────────
  getCustomSupplies(accountId: string): Observable<CustomSupplyEntity[]> {
    const operation = () => {
      const params = new HttpParams().set('accountId', this.HARDCODED_ACCOUNT_ID);
      return this.http.get<CustomSupplyResource[]>(`${this.currentBaseUrl}/custom-supplies`, { params }).pipe(
        map(res => this.recipesAssembler.toCustomSupplyEntityList(res))
      );
    };
    return operation().pipe(catchError(() => this.withFallback(operation)));
  }
}