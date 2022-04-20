import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { fuseAnimations } from '@fuse/animations';
import { JwtService } from 'app/core/jwt/jwt.service';
import { PlatformService } from 'app/core/platform/platform.service';
import { map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { Platform } from 'app/core/platform/platform.types';
import { AuthService } from 'app/core/auth/auth.service';
import { ValidateOauthRequest } from 'app/core/auth/auth.types';
import { AppConfig } from 'app/config/service.config';



@Component({
    selector     : 'apple-login',
    template  : ``,
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class AppleLoginComponent
{
    idToken:string;
    jwtData:string;
    clientEmail:string;

    countryCode : string = '';


    //validate Payload
    validateOauthRequest : ValidateOauthRequest;

    platform: Platform;
    private _unsubscribeAll: Subject<any> = new Subject<any>();

    domain :string ='';


    /**
     * Constructor
     */
    constructor(
        private _activatedRoute: ActivatedRoute,
        private _jwtService: JwtService,
        private _authService: AuthService,
        private _router: Router,
        private _platformsService: PlatformService,
        private _apiServer: AppConfig,

    )
    {
      
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
     ngOnInit(): void
     {  
        this._activatedRoute.queryParams.subscribe(params => {
            this.idToken = params['id_token'];
            this.jwtData = this._jwtService.getJwtPayload(this.idToken);
            this.clientEmail = this.jwtData['email'];

            this.domain = this._apiServer.settings.storeFrontDomain;

            this._platformsService.platform$
                .pipe(
                    map((resp)=>{
                        this.platform = resp;
                        
                        this.countryCode = this.platform.country;

                        this.validateOauthRequest = new ValidateOauthRequest();
                        this.validateOauthRequest.country = this.countryCode;
                        this.validateOauthRequest.loginType = "APPLE";
                        this.validateOauthRequest.token = this.idToken;
                        this.validateOauthRequest.email = this.clientEmail;
                        this.validateOauthRequest.domain = this.domain;

                        return this.validateOauthRequest;
                    }),
                    switchMap((resp:ValidateOauthRequest)=>this._authService.loginOauth(resp, "apple comp")),
                )
                .subscribe(() => {
                    this._router.navigate(['/orders' ]);
                });
          });
     } 
}
