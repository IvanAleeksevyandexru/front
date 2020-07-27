## Структура каталогов и файлов

- src

  - app

    - app.module.ts

    - app.component.ts

    - app-routing.module.ts 

      ```typescript
      import { NgModule } from '@angular/core';
      import { Routes, RouterModule } from '@angular/router';
      
      const routes: Routes = [
        { path: '', redirectTo: 'showcase', pathMatch: 'full'  },
        { path: '**', redirectTo: 'showcase', },
      
        {
          path: 'showcase',
          loadChildren: () =>
            import('../showcase/containers/showcase-index-page/showcase-index-page.module').then(
              m => m.ShowcaseIndexPageModule
            ), <-- подключаем модуль
        },
      ];
      
      @NgModule({
        imports: [RouterModule.forRoot(routes)],
        exports: [RouterModule]
      })
      export class AppRoutingModule { }
      ```

      

    - app.component.html

  - environments

    - environment.ts
    - environment.prod.ts

  - [showcase](block.md)

    - [containers](containers.md)

      - showcase-index-page

        - showcase-index-page.module.ts 

          ```typescript
          import { NgModule } from '@angular/core';
          import { CommonModule } from '@angular/common';
          
          import { ShowcaseIndexPageRoutingModule } from './showcase-index-page-routing.module';
          import { ShowcaseIndexPageComponent } from './showcase-index-page/showcase-index-page.component';
          
          import { ShowBtnModule } from '../../components/show-btn/show-btn.module';
          
          
          @NgModule({
            declarations: [ShowcaseIndexPageComponent],
            imports: [
              CommonModule,
              ShowcaseIndexPageRoutingModule,
              ShowBtnModule, <-- подключение модуля кнопок
            ]
          })
          export class ShowcaseIndexPageModule { }
          ```

          

        - showcase-index-page-routing.module.ts 

          ```typescript
          import { NgModule } from '@angular/core';
          import { Routes, RouterModule } from '@angular/router';
          import { ShowcaseIndexPageComponent } from './showcase-index-page/showcase-index-page.component';
          
          
          const routes: Routes = [
            { path: '', component: ShowcaseIndexPageComponent } <-- модуль контейнера для lazy-load загрузки и подлкючения store
          ];
          
          @NgModule({
            imports: [RouterModule.forChild(routes)],
            exports: [RouterModule]
          })
          export class ShowcaseIndexPageRoutingModule { }
          ```

        - showcase-index-page

          - showcase-index-page.component.html 

            ```html
            <p>showcase-index-page works!</p>
            <app-show-btn-outline></app-show-btn-outline>
            ```

            

          - showcase-index-page.component.scss

          - showcase-index-page.component.ts

    - [components](components.md)

      - show-btn

        - show-btn.module.ts 

          ```typescript
          import { NgModule } from '@angular/core';
          import { CommonModule } from '@angular/common';
          import { ShowBtnOutlineComponent } from './show-btn-outline/show-btn-outline.component';
          
          
          
          @NgModule({
            declarations: [ShowBtnOutlineComponent],
            imports: [
              CommonModule
            ],
            exports: [ShowBtnOutlineComponent] <---- важно не забывать об этом
          })
          export class ShowBtnModule { }
          ```

          

        - index.ts 

          ```typescript
          import { from } from "rxjs";
          
          export * from './show-btn/show-btn.module';
          export * from './show-btn/show-btn-outline/show-btn-outline.component';
          ```

          

          - show-btn-outline
            - show-btn-outline.component.html
            - show-btn-outline.component.scss
            - show-btn-outline.component.ts

