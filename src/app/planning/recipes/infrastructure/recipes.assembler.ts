import { Injectable } from '@angular/core';
import { BaseAssembler } from '../../../shared/infrastructure/base-assembler';
import { RecipeEntity } from '../domain/model/recipe.entity';
import { IngredientEntryEntity } from '../domain/model/ingredient-entry.entity';
import { CustomSupplyEntity } from '../domain/model/custom-supply.entity';
import { BaseResponse } from '../../../shared/infrastructure/base-response';
import {
  ProductResource,
  IngredientEntryResource,
  CustomSupplyResource,
} from './recipes.response';

@Injectable({ providedIn: 'root' })
export class RecipesAssembler implements BaseAssembler<RecipeEntity, ProductResource, BaseResponse> {

  // ── PRODUCT ↔ RECIPE ───────────────────────────────────────────────────────

  toEntityFromResource(resource: ProductResource): RecipeEntity {
    return new RecipeEntity({
      id: resource.id,
      accountId: resource.accountId,
      name: resource.name,
      description: resource.description ?? '',
      sku: resource.sku,
      type: resource.type as RecipeEntity['type'],
      status: (resource.status as RecipeEntity['status']) ?? 'ACTIVE',
      imageUrl: resource.imageUrl ?? '',
      sellingPrice: resource.sellingPrice ?? 0,
      ingredients: (resource.ingredients ?? []).map(i => this.toIngredientEntry(i)),
    });
  }

  toResourceFromEntity(entity: RecipeEntity): ProductResource {
    return {
      id: entity.id,
      accountId: entity.accountId,
      name: entity.name,
      description: entity.description,
      sku: entity.sku,
      type: entity.type,
      status: entity.status,
      imageUrl: entity.imageUrl,
      sellingPrice: entity.sellingPrice,
      ingredients: entity.ingredients.map(i => this.toIngredientEntryResource(i)),
    } as ProductResource;
  }

  toEntitiesFromResponse(response: BaseResponse): RecipeEntity[] {
    const resources: ProductResource[] = Array.isArray(response) 
      ? response 
      : (response as any).data || [];
    
    return resources
      .filter(r => r.type === 'RECIPE')
      .map(r => this.toEntityFromResource(r));
  }

  // ── INGREDIENT ENTRY ───────────────────────────────────────────────────────

  toIngredientEntry(resource: IngredientEntryResource): IngredientEntryEntity {
    return new IngredientEntryEntity({
      id: resource.id,
      productId: resource.productId,
      customSupplyId: resource.customSupplyId,
      quantity: resource.quantity,
      totalCost: resource.totalCost ?? 0,
    });
  }

  toIngredientEntryResource(entity: IngredientEntryEntity): IngredientEntryResource {
    return {
      id: entity.id,
      productId: entity.productId,
      customSupplyId: entity.customSupplyId,
      quantity: entity.quantity,
      totalCost: entity.totalCost,
    } as IngredientEntryResource;
  }

  // ── CUSTOM SUPPLY ──────────────────────────────────────────────────────────

  toCustomSupplyEntity(resource: CustomSupplyResource): CustomSupplyEntity {
    return new CustomSupplyEntity({
      id: resource.id,
      name: resource.name,
      description: resource.description,
      supplyId: resource.supplyId,
      supplyName: resource.supplyName,
      categoryName: resource.categoryName,
      unitPriceAmount: parseFloat(resource.unitPriceAmount ?? '0'),
      unitPriceCurrencyCode: resource.unitPriceCurrencyCode ?? 'PEN',
      unitMeasurement: resource.unitMeasurement,
      minimumStock: resource.minimumStock,
      maximumStock: resource.maximumStock,
      pictureUrl: resource.pictureUrl ?? '',
      accountId: resource.accountId,
    });
  }

  toCustomSupplyEntityList(resources: CustomSupplyResource[]): CustomSupplyEntity[] {
    const arr: CustomSupplyResource[] = Array.isArray(resources)
      ? resources
      : (resources as any).data || [];
      
    return arr.map(r => this.toCustomSupplyEntity(r));
  }
}