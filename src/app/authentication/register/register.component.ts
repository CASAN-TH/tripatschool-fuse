import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { HttpClient } from '@angular/common/http';
import { Alert } from 'selenium-webdriver';
import { post } from 'selenium-webdriver/http';
import { Router } from '@angular/router';

@Component({
    selector     : 'register',
    templateUrl  : './register.component.html',
    styleUrls    : ['./register.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class RegisterComponent implements OnInit, OnDestroy
{
    registerForm: FormGroup;
    user: any = {
        name: "",
        email: "",
        password: "",
        passwordConfirm: ""
    };
    users = [];
    // Private
    private _unsubscribeAll: Subject<any>;

    constructor(
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder,
        private http: HttpClient,
        private router: Router
    )
    {
        // Configure the layout
        this._fuseConfigService.config = {
            layout: {
                navbar   : {
                    hidden: true
                },
                toolbar  : {
                    hidden: true
                },
                footer   : {
                    hidden: true
                },
                sidepanel: {
                    hidden: true
                }
            }
        };

        // Set the private defaults
        this._unsubscribeAll = new Subject();
    }
    getData(){
        this.http.get("http://localhost:3000/api/registers").subscribe((res: any)=>{
        this.users = res.data;
        console.log("getData");
        console.log(res);
        })
    }
    saveData(){
        for (let i = 0; i < this.users.length; i++) {
            const data = this.users[i];
            if (this.user.name == data.name && this.user.email == data.email) {
                alert("สมัครสมาชิกไม่สำเร็จ Name และ Email นี้ถูกใช้งานแล้ว");
                return data;
            }else if(this.user.name == data.name){
                alert("สมัครสมาชิกไม่สำเร็จ Name นี้ถูกนี้ใช้งานแล้ว");
                return data;
            }else if(this.user.email == data.email){
                alert("สมัครสมาชิกไม่สำเร็จ Email นี้ถูกใช้งานแล้ว");
                return data;
            }
        }
        alert("สมัครสมาชิก สำเร็จ");
        this.postData(this.user)
    }
    postData(data : any){
        console.log(data);
        this.http.post("http://localhost:3000/api/registers/", data).subscribe((res: any)=>{
        console.log(res);
        this.getData();
        this.router.navigate(["/auth/login"]);
        })
    }
    // -----------------------------------------------------------------------------------------------------
    // @ Lifecycle hooks
    // -----------------------------------------------------------------------------------------------------

    /**
     * On init
     */
    ngOnInit(): void
    {
        this.registerForm = this._formBuilder.group({
            name           : ['', Validators.required],
            email          : ['', [Validators.required, Validators.email]],
            password       : ['', Validators.required],
            passwordConfirm: ['', [Validators.required, confirmPasswordValidator]]
        });

        // Update the validity of the 'passwordConfirm' field
        // when the 'password' field changes
        this.registerForm.get('password').valueChanges
            .pipe(takeUntil(this._unsubscribeAll))
            .subscribe(() => {
                this.registerForm.get('passwordConfirm').updateValueAndValidity();
            });
        this.getData();
    }
    /**
     * On destroy
     */
    ngOnDestroy(): void
    {
        // Unsubscribe from all subscriptions
        this._unsubscribeAll.next();
        this._unsubscribeAll.complete();
    }
}

/**
 * Confirm password validator
 *
 * @param {AbstractControl} control
 * @returns {ValidationErrors | null}
 */
export const confirmPasswordValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {

    if ( !control.parent || !control )
    {
        return null;
    }

    const password = control.parent.get('password');
    const passwordConfirm = control.parent.get('passwordConfirm');

    if ( !password || !passwordConfirm )
    {
        return null;
    }

    if ( passwordConfirm.value === '' )
    {
        return null;
    }

    if ( password.value === passwordConfirm.value )
    {
        return null;
    }

    return {'passwordsNotMatching': true};
};
