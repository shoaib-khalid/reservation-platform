import { ChangeDetectorRef, Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { LocationService } from 'app/core/location/location.service';
import { LandingLocation, LocationArea, LocationPagination, ParentCategory, ProductDetails, StoresDetails } from 'app/core/location/location.types';
import { PlatformService } from 'app/core/platform/platform.service';
import { Platform } from 'app/core/platform/platform.types';
import { combineLatest, distinctUntilChanged, filter, Subject, takeUntil } from 'rxjs';
import { Location } from '@angular/common';
import { ProductPagination, StorePagination } from 'app/core/store/store.types';

@Component({
    selector     : 'category',
    templateUrl  : './category.component.html',
    encapsulation: ViewEncapsulation.None
})
export class CategoryComponent implements OnInit
{
    platform: Platform;

    categoryId: string;
    category: ParentCategory;

    locationId: string;
    adjacentLocationIds: string[] = [];
    location: LandingLocation;
    locations: LandingLocation[] = [];
    featuredLocationPagination: LocationPagination;

    // Featured Stores
    featuredStores: StoresDetails[] = [];
    featuredStoresPagination: StorePagination;
    // Stores
    stores: StoresDetails[] = [];
    storesPagination: StorePagination;
    
    // Featured Products
    featuredProducts: ProductDetails[] = [];
    featuredProductsPagination: ProductPagination;
    // Products
    products: ProductDetails[] = [];
    productsPagination: ProductPagination;

    maxStoresDisplay: number = 5;
    maxProductsDisplay: number = 30;
    maxLocationsDisplay: number = 50;
    
    redirectUrl: { categoryId?: string, locationId?: string }
    storesViewAll: boolean = false;
    productsViewAll: boolean = false;
    locationsViewAll: boolean = false;

    isLoading: boolean = true;

    private _unsubscribeAll: Subject<any> = new Subject<any>();
    
    /**
     * Constructor
     */
    constructor(
        private _changeDetectorRef: ChangeDetectorRef,
        private _platformsService: PlatformService,
        private _route: ActivatedRoute,
        private _locationService: LocationService,
        private _location: Location,
        private _router: Router,

    )
    {
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    ngOnInit(): void {

        this.locationId = this._route.snapshot.paramMap.get('location-id');
        this.categoryId = this._route.snapshot.paramMap.get('category-id');

        this.redirectUrl = {
            locationId : this.locationId,
            categoryId : this.categoryId
        }
        
        // Get location when change route - this is when we pick one location
        this._router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            distinctUntilChanged(),
            takeUntil(this._unsubscribeAll)
        ).subscribe((responseCategory: NavigationEnd) => {
            if (responseCategory) {
                this.locationId = responseCategory.url.split("/")[3];
                
                // Get current category with categoryId
                this._locationService.getParentCategories({pageSize: 1, regionCountryId: this.platform.country, parentCategoryId: this.categoryId })
                    .subscribe((category : ParentCategory[]) => {
                    });

                // Set current location to null since we don't have locationId
                this._locationService.featuredLocation = null;    

                // Get current location with locationId
                this._locationService.getFeaturedLocations({pageSize: 1, regionCountryId: this.platform.country, cityId: this.locationId, sortByCol: 'sequence', sortingOrder: 'ASC' })
                    .subscribe((location : LandingLocation[]) => {
                    });

                // Get adjacent city first
                this._locationService.getLocationArea(this.locationId)
                    .subscribe((response: LocationArea[]) => {
                        this.adjacentLocationIds = [];
                        this.adjacentLocationIds = response.map(item => {
                            return item.storeCityId;
                        });

                        // put the original this.locationId in the adjacentLocationIds
                        this.adjacentLocationIds.unshift(this.locationId);

                        this._locationService.getFeaturedLocations({pageSize: this.maxLocationsDisplay, regionCountryId: this.platform.country, cityId: this.adjacentLocationIds,  sortByCol: 'sequence', sortingOrder: 'ASC' })
                            .subscribe((locations : LandingLocation[]) => {});

                        // Get featured stores with adjacent Locations
                        this._locationService.getFeaturedStores({pageSize: this.maxStoresDisplay, regionCountryId: this.platform.country, cityId: this.adjacentLocationIds, sortByCol: 'sequence', sortingOrder: 'ASC', parentCategoryId: this.categoryId })
                            .subscribe((stores : StoresDetails[]) => {});

                        // Get featured products with adjacent Locations
                        this._locationService.getFeaturedProducts({pageSize: this.maxProductsDisplay, regionCountryId: this.platform.country, cityId: this.adjacentLocationIds, sortByCol: 'sequence', sortingOrder: 'ASC', parentCategoryId: this.categoryId })
                            .subscribe((products : ProductDetails[]) => {});

                    });
            }
        });

        // Get platform data
        this._platformsService.platform$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((platform: Platform) => { 
                if (platform) {
                    this.platform = platform;

                    // Get current category with categoryId
                    this._locationService.getParentCategories({pageSize: 1, regionCountryId: this.platform.country, parentCategoryId: this.categoryId })
                        .subscribe((category : ParentCategory[]) => {
                        });

                    // Set current location to null since we don't have locationId
                    this._locationService.featuredLocation = null;    

                    // Get current location with locationId
                    this._locationService.getFeaturedLocations({pageSize: 1, regionCountryId: this.platform.country, cityId: this.locationId, sortByCol: 'sequence', sortingOrder: 'ASC' })
                        .subscribe((location : LandingLocation[]) => {
                        });

                    // Get adjacent city first
                    this._locationService.getLocationArea(this.locationId)
                        .subscribe((response: LocationArea[]) => {
                            this.adjacentLocationIds = [];
                            this.adjacentLocationIds = response.map(item => {
                                return item.storeCityId;
                            });

                            // put the original this.locationId in the adjacentLocationIds
                            this.adjacentLocationIds.unshift(this.locationId);

                            this._locationService.getFeaturedLocations({pageSize: this.maxLocationsDisplay, regionCountryId: this.platform.country, cityId: this.adjacentLocationIds,  sortByCol: 'sequence', sortingOrder: 'ASC' })
                                .subscribe((locations : LandingLocation[]) => {});

                            // Get featured stores with adjacent Locations
                            this._locationService.getFeaturedStores({pageSize: this.maxStoresDisplay, regionCountryId: this.platform.country, cityId: this.adjacentLocationIds, sortByCol: 'sequence', sortingOrder: 'ASC', parentCategoryId: this.categoryId })
                                .subscribe((stores : StoresDetails[]) => {});

                            // Get stores with adjacent Locations
                            this._locationService.getStoresDetails({pageSize: this.maxStoresDisplay, regionCountryId: this.platform.country, cityId: this.adjacentLocationIds, sortByCol: 'sequence', sortingOrder: 'ASC', parentCategoryId: this.categoryId })
                                .subscribe((stores : StoresDetails[]) => {});

                            // Get products with adjacent Locations
                            this._locationService.getProductsDetails({pageSize: this.maxProductsDisplay, regionCountryId: this.platform.country, cityId: this.adjacentLocationIds, sortByCol: 'sequence', sortingOrder: 'ASC', parentCategoryId: this.categoryId })
                                .subscribe((products : ProductDetails[]) => {});

                        });
                }
                
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
            
        // Get current category
        this._locationService.parentCategory$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((category) => {
                if (category) {                    
                    this.category = category;
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get current selected location
        this._locationService.featuredLocation$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(location => {
                if (location) {
                    this.location = location;                
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get all locations
        this._locationService.featuredLocations$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((locations : LandingLocation[]) => {
                if (locations) {
                    this.locations = locations;
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get all locations pagination
        this._locationService.featuredLocationPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination) => {
                if (pagination) {
                    this.featuredLocationPagination = pagination;
                    this.locationsViewAll = (pagination.length > pagination.size) ? true : false;
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get Featured Stores
        this._locationService.featuredStores$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((stores: StoresDetails[]) => { 
                if (stores) {
                    this.featuredStores = stores;
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get Featured Stores pagination
        this._locationService.featuredStorePagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: StorePagination) => { 
                if (pagination) {               
                    this.featuredStoresPagination =  pagination;    
                    // this.storesViewAll = (pagination.length > pagination.size) ? true : false;
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get Stores
        this._locationService.storesDetails$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((stores: StoresDetails[]) => { 
                if (stores) {
                    this.stores = stores;
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get Featured Stores pagination
        this._locationService.storesDetailPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination: StorePagination) => { 
                if (pagination) {               
                    this.storesPagination =  pagination;
                    this.storesViewAll = (pagination.length > pagination.size) ? true : false;
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get Featured Products
        this._locationService.featuredProducts$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((products: ProductDetails[]) => { 
                if (products) {
                    this.products = products;
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get Featured Products pagination
        this._locationService.featuredProductPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination) => { 
                if (pagination) {
                    this.featuredProductsPagination = pagination;
                    // this.productsViewAll = (pagination.length > pagination.size) ? true : false;            
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get Featured Products
        this._locationService.productsDetails$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((products: ProductDetails[]) => { 
                if (products) {
                    this.products = products;
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });

        // Get Featured Products pagination
        this._locationService.productDetailPagination$
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe((pagination) => { 
                if (pagination) {
                    this.productsPagination = pagination;    
                    this.productsViewAll = (pagination.length > pagination.size) ? true : false;         
                }
                // Mark for check
                this._changeDetectorRef.markForCheck();
            });
        
        // once selectCart() is triggered, it will set isLoading to true
        // this function will wait for both featuredStores$ & featuredProducts$ result first
        // then is isLoading to false
        combineLatest([
            this._locationService.featuredStores$,
            this._locationService.featuredProducts$
        ]).pipe(takeUntil(this._unsubscribeAll))
        .subscribe(([featuredStores, featuredProducts ] : [StoresDetails[], ProductDetails[]])=>{
            if (featuredStores && featuredProducts) {
                this.isLoading = false;

                if (featuredStores.length === 0) {
                    // Get stores
                    this.featuredStores = this.stores;
                }
    
                if (featuredProducts.length === 0) {
                    // Get products
                    this.featuredProducts = this.products;
                }
            }            

            // Mark for check
            this._changeDetectorRef.markForCheck();
        });
    }

    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next(null);
        this._unsubscribeAll.complete();
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public Method
    // -----------------------------------------------------------------------------------------------------

    backClicked() {
        this._location.back();
    }
}
