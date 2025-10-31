 export type Continent={
    id:string;
    name:string;
    shortDesc:string;
    longDesc:string;
    thumbnail:string;
}

 export type Country={
    id:string;
    continent:string;
    continentId:string;
    name:string;
    shortDesc:string;
    longDesc:string;
    thumbnail:string;
}
 export type State={
    id:string;
    continent:string;
    continentId:string;
    country:string;
    countryId:string;
    name:string;
    shortDesc:string;
    longDesc:string;
    thumbnail:string;
    popularFor:string;
}
export type City = {
  id: string
  continent: string
  continentId: string
  country: string
  countryId: string
  state: string
  stateId: string
  name: string
  shortDesc: string
  longDesc: string
  thumbnail: string
  popularFor: string
  highlights: string[]
  history: string
  tips: string[]
  bestTimeToVisit: {
    months: string[]
    reason: string
  }
  nearbyHotels: {
    name: string
    address: string
    priceRange: string
    rating: number
    link: string
  }[]
  nearbyRestaurants: {
    name: string
    cuisine: string
    address: string
    rating: number
    priceLevel: string
    link: string
  }[]
  adventureActivities: string[]
}