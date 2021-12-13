import { NgModule } from '@angular/core';
import { RouterModule, Routes, UrlMatchResult, UrlSegment } from '@angular/router';

import { NewSfPlayerComponent } from './components/new-sf-player/new-sf-player.component';
import { AuthGuard } from './interceptors/auth/auth.guard';
import { EmbeddedService } from './components/new-sf-player/embedded.service';

export function routeMatcherByRegex(
  url: UrlSegment[],
  posParamKey: string,
  regex: RegExp,
): UrlMatchResult | null {
  const posParams: { [key: string]: UrlSegment } = {};
  const regexp = new RegExp(regex);
  if (!url[0] || !regexp.test(url[0].path)) {
    return null;
  }
  posParams[posParamKey] = url[0];
  return { consumed: [url[0]], posParams };
}
export function passportMatcher(url: UrlSegment[]): UrlMatchResult | null {
  return routeMatcherByRegex(url, 'passportId', /\d{5,6}|mfc/);
}

export function targetMatcher(url: UrlSegment[]): UrlMatchResult | null {
  return routeMatcherByRegex(url, 'targetId', /\d{1,3}/);
}

const routes: Routes = [
  {
    // path: ':passportId',
    children: [
      {
        // path: ':targetId',
        matcher: targetMatcher,
        children: [
          {
            path: '',
            component: NewSfPlayerComponent,
          },
          {
            path: 'form',
            canActivate: [AuthGuard],
            component: NewSfPlayerComponent,
          },
          {
            path: 'order/:orderId',
            pathMatch: 'full',
            redirectTo: 'form/order/:orderId',
          },
          {
            path: 'form/order/:orderId',
            canActivate: [AuthGuard],
            component: NewSfPlayerComponent,
          },
          {
            path: 'booking',
            canActivate: [AuthGuard],
            component: NewSfPlayerComponent,
          },
        ],
      },
    ],
    matcher: passportMatcher,
  },
  {
    path: 'mobile',
    children: [
      {
        path: 'card/:passportId/:targetId',
        component: NewSfPlayerComponent,
        resolve: {
          isEmbedded: EmbeddedService,
        },
      },
      {
        path: 'form/:passportId/:targetId',
        canActivate: [AuthGuard],
        pathMatch: 'full',
        component: NewSfPlayerComponent,
        resolve: {
          isEmbedded: EmbeddedService,
        },
      },
      {
        path: 'form/:passportId/:targetId/order/:orderId',
        canActivate: [AuthGuard],
        pathMatch: 'full',
        component: NewSfPlayerComponent,
        resolve: {
          isEmbedded: EmbeddedService,
        },
      },
    ],
  },
  {
    path: 'children-clubs',
    loadChildren: () => import('./components/clubs/clubs.module').then((mod) => mod.ClubsModule),
  },
  {
    path: '**',
    redirectTo: '/404',
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabledNonBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
