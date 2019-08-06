import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { FuseConfigService } from '@fuse/services/config.service';
import { fuseAnimations } from '@fuse/animations';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
    selector     : 'login',
    templateUrl  : './login.component.html',
    styleUrls    : ['./login.component.scss'],
    encapsulation: ViewEncapsulation.None,
    animations   : fuseAnimations
})
export class LoginComponent implements OnInit
{
    loginForm: FormGroup;
    user: any = {
        name: "",
        email: "",
        password: "",
        passwordConfirm: ""
    };
    users = [];
    /**
     * Constructor
     *
     * @param {FuseConfigService} _fuseConfigService
     * @param {FormBuilder} _formBuilder
     */
    constructor(
        private http: HttpClient,
        private router : Router,
        private _fuseConfigService: FuseConfigService,
        private _formBuilder: FormBuilder
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
    }

    loginClick(){
        this.getData();
        for (let i = 0; i < this.users.length; i++) {
            const data = this.users[i];
            if (this.user.email == data.email && this.user.password == data.password) {
                console.log("Login เสร็จสิ้น");
                alert("Login เสร็จสำเร็จ")
                this.router.navigate(["/sample"]);
                return data;
            }
        }
        alert("Email หรือ Password ไม่ถูกต้องกรุณากรอกใหม่อีกครั้ง");
    }

    getData(){
        this.http.get("http://localhost:3000/api/registers").subscribe((res: any)=>{
            console.log(res);
            this.users = res.data;
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
        this.getData();
        this.loginForm = this._formBuilder.group({
            email   : ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });
    }
    
}
