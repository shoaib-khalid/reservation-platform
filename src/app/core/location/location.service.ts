import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of, switchMap } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { AppConfig } from 'app/config/service.config';
import { JwtService } from '../jwt/jwt.service';
import { LogService } from '../logging/log.service';
import { CategoryPagination, ChildCategory, LandingLocation, LocationArea, LocationPagination, ParentCategory, ProductDetailPagination, ProductDetails, StoresDetailPagination, StoresDetails } from './location.types';
import { ProductPagination, StorePagination } from '../store/store.types';

@Injectable({
    providedIn: 'root'
})
export class LocationService
{

    // Featured Stores
    private _featuredStore: BehaviorSubject<StoresDetails | null> = new BehaviorSubject(null);
    private _featuredStores: BehaviorSubject<StoresDetails[] | null> = new BehaviorSubject(null);
    private _featuredStorePagination: BehaviorSubject<StorePagination | null> = new BehaviorSubject(null);

    // Stores
    private _storesDetails: BehaviorSubject<StoresDetails[] | null> = new BehaviorSubject<StoresDetails[]>(null);
    private _storesDetailPagination: BehaviorSubject<StoresDetailPagination | null> = new BehaviorSubject(null);

    // Featured Products
    private _featuredProduct: BehaviorSubject<ProductDetails | null> = new BehaviorSubject(null);
    private _featuredProducts: BehaviorSubject<ProductDetails[] | null> = new BehaviorSubject(null);
    private _featuredProductPagination: BehaviorSubject<ProductPagination | null> = new BehaviorSubject(null);

    // Products
    private _productsDetails: BehaviorSubject<ProductDetails[] | null> = new BehaviorSubject<ProductDetails[]>(null);
    private _productDetailPagination: BehaviorSubject<ProductDetailPagination | null> = new BehaviorSubject(null);

    // Featured Location
    private _featuredLocation: BehaviorSubject<LandingLocation | null> = new BehaviorSubject<LandingLocation>(null);
    private _featuredLocations: BehaviorSubject<LandingLocation[] | null> = new BehaviorSubject<LandingLocation[]>(null);
    private _featuredLocationPagination: BehaviorSubject<LocationPagination | null> = new BehaviorSubject(null);
    
    // Featured Category
    private _parentCategory: BehaviorSubject<ParentCategory | null> = new BehaviorSubject<ParentCategory>(null);
    private _parentCategories: BehaviorSubject<ParentCategory[] | null> = new BehaviorSubject<ParentCategory[]>(null);
    private _parentCategoriesPagination: BehaviorSubject<CategoryPagination | null> = new BehaviorSubject(null);
    private _childCategory: BehaviorSubject<ChildCategory | null> = new BehaviorSubject<ChildCategory>(null);
    private _childCategories: BehaviorSubject<ChildCategory[] | null> = new BehaviorSubject<ChildCategory[]>(null);
    private _childCategoriesPagination: BehaviorSubject<CategoryPagination | null> = new BehaviorSubject(null);

    /**
     * Constructor
     */
    constructor(
        private _httpClient: HttpClient,
        private _authService: AuthService,
        private _apiServer: AppConfig,
        private _jwt: JwtService,
        private _logging: LogService
)
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Getter for parent categories
     */
    get storesDetails$(): Observable<StoresDetails[]>
    {
        return this._storesDetails.asObservable();
    }

    /**
     * Getter for parent categories
     */
    get storesDetailPagination$(): Observable<StoresDetailPagination>
    {
    return this._storesDetailPagination.asObservable();
    }

    /**
     * Getter for parent categories
     */
    get productsDetails$(): Observable<ProductDetails[]>
    {
        return this._productsDetails.asObservable();
    }

    /**
     * Getter for parent categories
     */
    get productDetailPagination$(): Observable<ProductDetailPagination>
    {
    return this._productDetailPagination.asObservable();
    }
    /**
     * Getter for parentCategory
     */
    get parentCategory$(): Observable<ParentCategory>
    {
        return this._parentCategory.asObservable();
    }

    /**
     * Getter for parentCategory
     */
    set parentCategory(value: ParentCategory)
    {
        this._parentCategory.next(value);
    }

    /**
     * Getter for parent categories
     */
    get parentCategories$(): Observable<ParentCategory[]>
    {
        return this._parentCategories.asObservable();
    }

    /**
     * Getter for parent categories
     */
    get parentCategoriesPagination$(): Observable<CategoryPagination>
    {
        return this._parentCategoriesPagination.asObservable();
    }  

    /**
     * Getter for childCategory
     */
    get childCategory$(): Observable<ChildCategory>
    {
        return this._childCategory.asObservable();
    }

    // ----------------------
    // Featured Location
    //----------------------- 

    /**
     * Getter for locations
     */
    get featuredLocations$(): Observable<LandingLocation[]>
    {
        return this._featuredLocations.asObservable();
    }

    /**
     * Getter for location
     */
    get featuredLocation$(): Observable<LandingLocation>
    {
        return this._featuredLocation.asObservable();
    }

    /**
     * Setter for location
     */
    set featuredLocation(value: LandingLocation)
    {
        this._featuredLocation.next(value);
    }

    /**
     * Getter for locationProducts pagination
     */
    get featuredLocationPagination$(): Observable<LocationPagination>
    {
        return this._featuredLocationPagination.asObservable();
    }

    // ----------------------
    // Featured Product
    //----------------------- 

    /**
    * Getter for store
    *
    */
    get featuredProduct$(): Observable<ProductDetails>
    {
        return this._featuredProduct.asObservable();
    }
 
     /**
     * Setter for stores
     *
     * @param value
     */
    set featuredProduct(value: ProductDetails)
    {
        // Store the value
        this._featuredProduct.next(value);
    }
 
     /**
      * Getter for stores
      *
     */
    get featuredProducts$(): Observable<ProductDetails[]>
    {
        return this._featuredProducts.asObservable();
    }
     
     /**
      * Setter for stores
      *
      * @param value
      */
    set featuredProducts(value: ProductDetails[])
    {
        // Store the value
        this._featuredProducts.next(value);
    }
 
     /**
     * Getter for stores pagination
     */
    get featuredProductPagination$(): Observable<ProductPagination>
    {
        return this._featuredProductPagination.asObservable();
    }

    // ----------------------
    //    Featured Store
    //----------------------- 

    /**
    * Getter for store
    *
    */
    get featuredStore$(): Observable<StoresDetails>
    {
        return this._featuredStore.asObservable();
    }
 
     /**
     * Setter for stores
     *
     * @param value
     */
    set featuredStore(value: StoresDetails)
    {
        // Store the value
        this._featuredStore.next(value);
    }
 
     /**
      * Getter for stores
      *
     */
    get featuredStores$(): Observable<StoresDetails[]>
    {
        return this._featuredStores.asObservable();
    }
     
     /**
      * Setter for stores
      *
      * @param value
      */
    set featuredStores(value: StoresDetails[])
    {
        // Store the value
        this._featuredStores.next(value);
    }
 
     /**
     * Getter for stores pagination
     */
    get featuredStorePagination$(): Observable<StorePagination>
    {
        return this._featuredStorePagination.asObservable();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------


    /**
     * 
     * @param params
     * @returns 
     */
    getFeaturedStores(params: {
        storeName?          : string,
        parentCategoryId?   : string,
        page?               : number, 
        pageSize?           : number, 
        sortByCol?          : string, 
        sortingOrder?       : 'ASC' | 'DESC' | '',
        regionCountryId?    : string, 
        country?            : string, 
        stateId?            : string, 
        state?              : string, 
        cityId?             : string | string[],
        city?               : string,
        postcode?           : string,
        isDisplay?          : boolean
    } = {
        storeName       : null,
        parentCategoryId: null,
        page            : 0, 
        pageSize        : 20, 
        sortByCol       : 'sequence', 
        sortingOrder    : 'ASC',
        regionCountryId : null, 
        country         : null, 
        stateId         : null, 
        state           : null, 
        cityId          : null, 
        city            : null, 
        postcode        : null,
        isDisplay       : false
    }): Observable<StoresDetails[]>
    {
        let locationService = this._apiServer.settings.apiServer.locationService;
        let accessToken = this._authService.publicToken;

        const header = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${accessToken}`),
            params: params
        };

        // Delete empty value
        Object.keys(header.params).forEach(key => {

            if (Array.isArray(header.params[key])) {
                header.params[key] = header.params[key].filter(element => element !== null)
            }
            if (header.params[key] === null || (header.params[key].constructor === Array && header.params[key].length === 0)) {
                delete header.params[key];
            }
        });

        return this._httpClient.get<StoresDetails[]>(locationService + '/featured/store', header)
            .pipe(
                switchMap(async (response:StoresDetails[]) => {
                    
                    let city = params.cityId ? (" - " + params.cityId) : "";
                    let category = params.parentCategoryId ? (" - " + params.parentCategoryId) : "";
                    this._logging.debug("Response from LocationService (getFeaturedStores)" + city + category, response);

                    let _pagination = {
                        length: response["data"].totalElements,
                        size: response["data"].size,
                        page: response["data"].number,
                        lastPage: response["data"].totalPages,
                        startIndex: response["data"].pageable.offset,
                        endIndex: response["data"].pageable.offset + response["data"].numberOfElements - 1
                    }
                    this._featuredStorePagination.next(_pagination);
                    this._featuredStores.next(response["data"].content);

                    return response["data"].content;
                })
            );
    }

    /**
     * 
     * @param params
     * @returns 
     */
     getFeaturedProducts(params: {
        storeName?          : string,
        parentCategoryId?   : string,
        page?               : number, 
        pageSize?           : number, 
        sortByCol?          : string, 
        sortingOrder?       : 'ASC' | 'DESC' | '',
        regionCountryId?    : string, 
        country?            : string, 
        stateId?            : string, 
        state?              : string, 
        cityId?             : string | string[],
        city?               : string, 
        postcode?           : string,
        isDisplay?          : boolean
        isMainLevel?        : boolean
    } = {
        storeName       : null,
        parentCategoryId: null,
        page            : 0, 
        pageSize        : 20, 
        sortByCol       : 'sequence', 
        sortingOrder    : 'ASC',
        regionCountryId : null, 
        country         : null, 
        stateId         : null, 
        state           : null, 
        cityId          : null, 
        city            : null, 
        postcode        : null,
        isDisplay       : false,
        isMainLevel     : false
    }): Observable<ProductDetails[]>
    {
        let locationService = this._apiServer.settings.apiServer.locationService;
        let accessToken = this._authService.publicToken;

        const header = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${accessToken}`),
            params: params
        };        

        // Delete empty value
        Object.keys(header.params).forEach(key => {

            if (Array.isArray(header.params[key])) {
                header.params[key] = header.params[key].filter(element => element !== null)
            }
            if (header.params[key] === null || (header.params[key].constructor === Array && header.params[key].length === 0)) {
                delete header.params[key];
            }
        });

        return this._httpClient.get<ProductDetails[]>(locationService + '/featured/product', header)
            .pipe(
                switchMap(async (response:ProductDetails[]) => {
                                
                    let city = params.cityId ? (" - " + params.cityId) : "";
                    let category = params.parentCategoryId ? (" - " + params.parentCategoryId) : "";
                    this._logging.debug("Response from LocationService (getFeaturedProducts)" + city + category, response);

                    let _pagination = {
                        length: response["data"].totalElements,
                        size: response["data"].size,
                        page: response["data"].number,
                        lastPage: response["data"].totalPages,
                        startIndex: response["data"].pageable.offset,
                        endIndex: response["data"].pageable.offset + response["data"].numberOfElements - 1
                    }
                    this._featuredProductPagination.next(_pagination);
                    this._featuredProducts.next(response["data"].content);

                    return response["data"].content;
                })
            );
    }

    /**
     * Get featured location
     * 
     * @param params
     * @returns 
     */

    getFeaturedLocations(params: {
        page?           : number, 
        pageSize?       : number, 
        sortByCol?      : string, 
        sortingOrder?   : 'ASC' | 'DESC' | '',
        regionCountryId?: string, 
        country?        : string, 
        stateId?        : string, 
        state?          : string, 
        cityId?         : string | string[],
        city?           : string, 
        postcode?       : string
    } = {
        page            : 0, 
        pageSize        : 20, 
        sortByCol       : 'sequence', 
        sortingOrder    : 'ASC',
        regionCountryId : null, 
        country         : null, 
        stateId         : null, 
        state           : null, 
        cityId          : null, 
        city            : null, 
        postcode        : null
    }): Observable<LandingLocation[]>
    {
        let locationService = this._apiServer.settings.apiServer.locationService;
        let accessToken = this._authService.publicToken;

        const header = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${accessToken}`),
            params: params
        };

        // Delete empty value
        Object.keys(header.params).forEach(key => {
            if (Array.isArray(header.params[key])) {
                header.params[key] = header.params[key].filter(element => element !== null)
            }
            if (header.params[key] === null || (header.params[key].constructor === Array && header.params[key].length === 0)) {
                delete header.params[key];
            }
        });        

        return this._httpClient.get<LandingLocation[]>(locationService + '/featured/location', header)
            .pipe(
                catchError(() =>
                    // Return false
                    of(false)
                ),
                switchMap(async (response:LandingLocation[]) => {
                    
                    this._logging.debug("Response from LocationService (getFeaturedLocations)" + (params.cityId ? " - " + params.cityId : ""), response);
                    
                    if (params.cityId) {
                        this._featuredLocation.next(response["data"].content[0]);
                    } else {
                        let _pagination = {
                            length: response["data"].totalElements,
                            size: response["data"].size,
                            page: response["data"].number,
                            lastPage: response["data"].totalPages,
                            startIndex: response["data"].pageable.offset,
                            endIndex: response["data"].pageable.offset + response["data"].numberOfElements - 1
                        }

                        this._featuredLocationPagination.next(_pagination);
                        this._featuredLocations.next(response["data"].content);
                    }
                    return response["data"].content;
                })
            );
    }

    /**
     * 
     * @param params
     * @returns 
     */
    getStoresDetails(params: {
        storeName?      : string,
        parentCategoryId?: string,
        page?           : number, 
        pageSize?       : number, 
        sortByCol?      : string, 
        sortingOrder?   : 'ASC' | 'DESC' | '',
        regionCountryId?: string, 
        country?        : string, 
        stateId?        : string, 
        state?          : string, 
        cityId?         : string | string[],
        city?           : string, 
        postcode?       : string
    } = {
        storeName       : null,
        parentCategoryId: null,
        page            : 0, 
        pageSize        : 20, 
        sortByCol       : 'name', 
        sortingOrder    : 'ASC',
        regionCountryId : null, 
        country         : null, 
        stateId         : null, 
        state           : null, 
        cityId          : null, 
        city            : null, 
        postcode        : null
    }) 
        : Observable<StoresDetails[]>
    {
        let locationService = this._apiServer.settings.apiServer.locationService;
        let accessToken = this._authService.publicToken;

        const header = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${accessToken}`),
            params: params
        };

        // Delete empty value
        Object.keys(header.params).forEach(key => {
            if (Array.isArray(header.params[key])) {
                header.params[key] = header.params[key].filter(element => element !== null)
            }
            if (header.params[key] === null || (header.params[key].constructor === Array && header.params[key].length === 0)) {
                delete header.params[key];
            }
        });

        return this._httpClient.get<StoresDetails[]>(locationService + '/stores', header)
            .pipe(
                catchError(() =>
                    of(false)
                ),
                switchMap(async (response: StoresDetails[]) => {
                                
                    this._logging.debug("Response from LocationService (getStoresDetails)", response);

                    let _pagination = {
                        length: response["data"].totalElements,
                        size: response["data"].size,
                        page: response["data"].number,
                        lastPage: response["data"].totalPages,
                        startIndex: response["data"].pageable.offset,
                        endIndex: response["data"].pageable.offset + response["data"].numberOfElements - 1
                    }

                    this._storesDetails.next(response["data"].content);
                    this._storesDetailPagination.next(_pagination);

                    return response["data"].content;
                })
            );
    }

    /**
     * 
     * @param params
     * @returns 
     */
    getProductsDetails(params: {
        name?           : string,
        parentCategoryId?: string,
        storeName?      : string,
        page?           : number, 
        pageSize?       : number, 
        sortByCol?      : string, 
        sortingOrder?   : 'ASC' | 'DESC' | '',
        regionCountryId?: string, 
        country?        : string, 
        stateId?        : string, 
        state?          : string, 
        cityId?         : string | string[],
        city?           : string, 
        postcode?       : string,
        status?         : string[]
    } = {
        name            : null,
        parentCategoryId: null,
        storeName       : null,
        page            : 0, 
        pageSize        : 20, 
        sortByCol       : 'name', 
        sortingOrder    : 'ASC',
        regionCountryId : null, 
        country         : null, 
        stateId         : null, 
        state           : null, 
        cityId          : null, 
        city            : null, 
        postcode        : null,
        status          : ['ACTIVE', 'OUTOFSTOCK']
    }) 
        : Observable<ProductDetails[]>
    {
        let locationService = this._apiServer.settings.apiServer.locationService;
        let accessToken = this._authService.publicToken;

        const header = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${accessToken}`),
            params: params
        };

        // Delete empty value
        Object.keys(header.params).forEach(key => {
            if (Array.isArray(header.params[key])) {
                header.params[key] = header.params[key].filter(element => element !== null)
            }
            if (header.params[key] === null || (header.params[key].constructor === Array && header.params[key].length === 0)) {
                delete header.params[key];
            }
        });

        return this._httpClient.get<ProductDetails[]>(locationService + '/products', header)
            .pipe(
                catchError(() =>
                    of(false)
                ),
                switchMap(async (response: ProductDetails[]) => {
                                
                    this._logging.debug("Response from LocationService (getProductsDetails)", response);

                    let _pagination = {
                        length: response["data"].totalElements,
                        size: response["data"].size,
                        page: response["data"].number,
                        lastPage: response["data"].totalPages,
                        startIndex: response["data"].pageable.offset,
                        endIndex: response["data"].pageable.offset + response["data"].numberOfElements - 1
                    }
                    
                    this._productDetailPagination.next(_pagination);
                    this._productsDetails.next(response["data"].content);
                    return response["data"].content;
                })
            );
    }

    /**
     * 
     * @param params
     * @returns 
     */
    getParentCategories(params: {
        parentCategoryId?   : string;
        page?               : number, 
        pageSize?           : number, 
        sortByCol?          : string, 
        sortingOrder?       : 'ASC' | 'DESC' | '',
        regionCountryId?    : string, 
        country?            : string, 
        stateId?            : string, 
        state?              : string, 
        cityId?             : string | string[],
        city?               : string, 
        postcode?           : string
    } = {
        page            : 0, 
        pageSize        : 20, 
        sortByCol       : 'cityId', 
        sortingOrder    : 'ASC',
        regionCountryId : null, 
        country         : null, 
        stateId         : null, 
        state           : null, 
        cityId          : null, 
        city            : null, 
        postcode        : null
    }): Observable<ParentCategory[]>
    {        
        let locationService = this._apiServer.settings.apiServer.locationService;
        let accessToken = this._authService.publicToken;

        const header = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${accessToken}`),
            params: params
        };        

        // Delete empty value
        Object.keys(header.params).forEach(key => {
            if (Array.isArray(header.params[key])) {
                header.params[key] = header.params[key].filter(element => element !== null)
            }
            if (header.params[key] === null || (header.params[key].constructor === Array && header.params[key].length === 0)) {
                delete header.params[key];
            }
        });

        return this._httpClient.get<ParentCategory[]>(locationService + '/categories/parent-category', header)
            .pipe(
                catchError(() =>
                    // Return false
                    of(false)
                ),
                switchMap(async (response: ParentCategory[]) => {
                                
                    let city = params.cityId ? (" - " + params.cityId) : "";
                    let category = params.parentCategoryId ? (" - " + params.parentCategoryId) : "";
                    this._logging.debug("Response from LocationService (getParentCategories)" + city + (params.parentCategoryId ? " - "  + params.parentCategoryId : "") , response);

                    if (params.parentCategoryId) {                        
                        this._parentCategory.next(response["data"].content[0]);
                    } else {
                        let _pagination = {
                            length: response["data"].totalElements,
                            size: response["data"].size,
                            page: response["data"].number,
                            lastPage: response["data"].totalPages,
                            startIndex: response["data"].pageable.offset,
                            endIndex: response["data"].pageable.offset + response["data"].numberOfElements - 1
                        }

                        this._parentCategories.next(response["data"].content);
                        this._parentCategoriesPagination.next(_pagination);
                    }
                    return response["data"].content;
                })
            );
    }

    /**
     * Get child categories
     * 
     * @param params
     * @returns 
     */
    
    getChildCategories(params: {
        page            : number, 
        pageSize        : number, 
        sortByCol       : string, 
        sortingOrder    : 'ASC' | 'DESC' | '',
        regionCountryId : string, 
        country         : string, 
        stateId         : string, 
        state           : string, 
        cityId          : string, 
        city            : string, 
        postcode        : string,
    } = {
        page            : 0, 
        pageSize        : 20, 
        sortByCol       : 'cityId', 
        sortingOrder    : 'ASC',
        regionCountryId : null, 
        country         : null, 
        stateId         : null, 
        state           : null, 
        cityId          : null, 
        city            : null, 
        postcode        : null,
    }): Observable<ChildCategory>
    {        
        let locationService = this._apiServer.settings.apiServer.locationService;
        let accessToken = this._authService.publicToken;

        const header = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${accessToken}`),
            params: params
        };

        // Delete empty value
        Object.keys(header.params).forEach(key => {
            if (Array.isArray(header.params[key])) {
                header.params[key] = header.params[key].filter(element => element !== null)
            }
            if (header.params[key] === null || (header.params[key].constructor === Array && header.params[key].length === 0)) {
                delete header.params[key];
            }
        });

        return this._httpClient.get<ChildCategory>(locationService + '/categories/child-category', header)
            .pipe(
                catchError(() =>
                    // Return false
                    of(false)
                ),
                switchMap(async (response: ChildCategory) => {
                                
                    this._logging.debug("Response from LocationService (getChildCategories)", response);

                    this._childCategory.next(response["data"]);
                    return response["data"];
                })
            );
    }

    getLocationArea(userLocationCityId: string, sortByCol: string = null, sortingOrder: 'ASC' | 'DESC' = 'ASC'): Observable<LocationArea[]>
    {
        let locationService = this._apiServer.settings.apiServer.locationService;
        let accessToken = this._authService.publicToken;

        const headers = {
            headers: new HttpHeaders().set("Authorization", `Bearer ${accessToken}`),
            params: {
                userLocationCityId,
                sortByCol,
                sortingOrder
            }
        };

        // Delete empty value
        Object.keys(headers.params).forEach(key => {
            if (headers.params[key] === null) {
                delete headers.params[key];
            }
        });

        return this._httpClient.get<LocationArea[]>(locationService + '/location-area', headers)
            .pipe(
                catchError(() =>
                    // Return false
                    of(false)
                ),
                map((response: LocationArea[]) => {
                    this._logging.debug("Response from LocationService (getLocationArea)", response);
                    return response["data"];
                })
            );
    }
}
