import { PropertyFilters } from "@/types/filters";

export const encodeFiltersToUrl = (filters: PropertyFilters): string => {
  const params = new URLSearchParams();

  if (filters.priceRange.min) params.set('priceMin', filters.priceRange.min.toString());
  if (filters.priceRange.max) params.set('priceMax', filters.priceRange.max.toString());
  if (filters.area.min) params.set('areaMin', filters.area.min.toString());
  if (filters.area.max) params.set('areaMax', filters.area.max.toString());
  if (filters.buildingAge.min) params.set('ageMin', filters.buildingAge.min.toString());
  if (filters.buildingAge.max) params.set('ageMax', filters.buildingAge.max.toString());
  if (filters.propertyType?.length) {
    params.set('types', filters.propertyType.join(','));
  }

  return params.toString();
};

export const decodeFiltersFromUrl = (search: string): PropertyFilters => {
  const params = new URLSearchParams(search);
  
  return {
    priceRange: {
      min: params.get('priceMin') ? Number(params.get('priceMin')) : undefined,
      max: params.get('priceMax') ? Number(params.get('priceMax')) : undefined,
    },
    area: {
      min: params.get('areaMin') ? Number(params.get('areaMin')) : undefined,
      max: params.get('areaMax') ? Number(params.get('areaMax')) : undefined,
    },
    buildingAge: {
      min: params.get('ageMin') ? Number(params.get('ageMin')) : undefined,
      max: params.get('ageMax') ? Number(params.get('ageMax')) : undefined,
    },
    propertyType: params.get('types')?.split(','),
  };
};