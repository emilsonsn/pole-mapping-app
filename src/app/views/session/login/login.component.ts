import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { Router } from '@angular/router';
import { SessionService } from '@store/session.service';
import { SessionQuery } from '@store/session.query';
import { lastValueFrom } from 'rxjs';
import { UserService } from '@services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hide: boolean = true;
  loading: boolean = false;
  private user;

  constructor(
    private fb: FormBuilder,
    private readonly _router: Router,
    private readonly _sessionService : SessionService,
    private readonly _sessionQuery : SessionQuery,
    private readonly _userService : UserService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this._userService.getUser()
    .subscribe({
      next: (user) => {
        if(user.data){          
          this.user = user.data;
          this._router.navigate(['/painel/home']);
        }
      }
    })
  }

  togglePasswordVisibility() {
    this.hide = !this.hide;
  }

  getUsernameErrorMessage() {
    if (this.loginForm.get('username')?.hasError('required')) {
      return 'Você deve inserir um usuário';
    }
    return this.loginForm.get('username')?.hasError('username') ? 'Usuário inválido' : '';
  }

  getPasswordErrorMessage() {
    if (this.loginForm.get('password')?.hasError('required')) {
      return 'Você deve inserir uma senha';
    }
    return this.loginForm.get('password')?.hasError('minlength') ? 'A senha deve ter no mínimo 6 caracteres' : '';
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      try{
        this.loading = true;
        this.loginForm.disable();
        const { username, password } = this.loginForm.getRawValue();
        await this._sessionService.login(username, password);
        
        await lastValueFrom(this._sessionService.getUserFromBack());
  
        this.loginForm.enable();
        this.loading = false;
  
        this._sessionQuery.user$.subscribe((user) => {
          this.user = user;
        });
        this._router.navigate(['/painel/home']);
      } catch (error) {
        this.loginForm.enable();
        this.loading = false;
      }
    }
  }
}
