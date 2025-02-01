export interface PropertyFilters {
    priceRange: {
      min?: number;
      max?: number;
    };
    buildingAge: {
      min?: number;
      max?: number;
    };
    area: {
      min?: number;
      max?: number;
    };
    propertyType?: string[];
  }