export interface City {
  id: number;
  name: string;
  state_id: number;
  state_code: string;
  country_id: number;
  country_code: string;
  latitude: number;
  longitude: number;
  createdAt: Date;
  updatedAt: Date;
  flag: number;
  wikiDataId: string;
}
