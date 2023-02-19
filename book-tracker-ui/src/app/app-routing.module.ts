import { NgModule } from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from "./auth/login/login.component";
import {RegistrationComponent} from "./auth/registration/registration.component";
import {HomeComponent} from "./home/home.component";
import {PageNotFoundComponent} from "./page-not-found/page-not-found.component";
import {WelcomeComponent} from "./welcome/welcome.component";
import {WelcomeLinksComponent} from "./welcome/welcome-links/welcome-links.component";
import {AccountSettingsComponent} from "./account-settings/account-settings.component";
import {BookListComponent} from "./book-list/book-list.component";
import {BooksCardsComponent} from "./home/books-cards/books-cards.component";
import {BookDetailsComponent} from "./book-details/book-details.component";
import {AuthGuardService as AuthGuard} from "./services/auth/auth-guard.service";
import {BookGenreComponent} from "./book-genre/book-genre.component";
import {BookSearchComponent} from "./book-search/book-search.component";
import {EditAccountComponent} from "./account-settings/edit-account/edit-account.component";
import {AccountOverviewComponent} from "./account-settings/account-overview/account-overview.component";
import {DeleteAccountComponent} from "./account-settings/delete-account/delete-account.component";

const routes: Routes = [
  { path: '',
    component: WelcomeComponent,
    children: [
      { path: '', component: WelcomeLinksComponent },
      { path: 'login', component: LoginComponent },
      { path: 'registration', component: RegistrationComponent },
    ]
  },
  { path: 'home',
    component: HomeComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', component: BooksCardsComponent },
      { path: 'book/:isbn', component: BookDetailsComponent },
      { path: 'genres/:genre', component: BookGenreComponent },
      { path: 'search', component: BookSearchComponent },
      { path: 'mylist', component: BookListComponent },
      { path: 'settings', component: AccountSettingsComponent,
        children: [
          { path: '', component: AccountOverviewComponent },
          { path: 'edit-account', component: EditAccountComponent },
          { path: 'delete-account', component: DeleteAccountComponent },
        ]
      },
    ]
  },
  { path: 'not-found', component: PageNotFoundComponent, data: {message: 'Page not found!'} },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
