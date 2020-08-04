## Структура каталогов и файлов

- /src

  - /app

    - /components - набор компонентов приложения, где все каталоги - отдельные независимые компоненты, кроме папки `shared-components`, в которой хранятся переиспользуемые небольшие компоненты. Каждый каталог с независимым компонентом может содержать два каталога `screens` - если компонент подразумевает использование всего экрана, и `sub-components` - если компонент использует свои уникальные подкомпоненты. Например:

      - /confirm-personal-user

        - /sub-components

          - /confirm-personal-user-button

          - /confirm-personal-user-screen-layout

            - confirm-personal-user-screen-layout.component.ts

            - confirm-personal-user-screen-layout-screen.component.spec.ts

            - confirm-personal-user-screen-layout-routing.module.ts

            - confirm-personal-user-screen-layout.component.html

          - components.module.ts

        - /screens

          - /confirm-personal-user-data

          - /confirm-personal-user-email

            - confirm-personal-user-email.module.ts

            - confirm-personal-user-email.component.ts

            - confirm-personal-user-email-screen.component.spec.ts

            - confirm-personal-user-email-routing.module.ts

            - confirm-personal-user-email.component.html

    - /interfaces

    - /styles

      - _breakpoint.scss - миксины c брейкпоинтами

      - _fonts.scss - подключение шрифтов

      - _functions.scss - набор служебных scss-фукнций

      - _utilities.scss - набор службеных scss-утилит

      - _variables.scss - набор служебных scss-переменных (брендированные цвета, базовые шрифты, размеры гарнитур и пр.)

      - icons.scss - набор классов с брендированными иконками

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

  - /environments

    - environment.ts
    - environment.prod.ts

  - /constructor - корневой компонент, отвечающий за бизнес-логику

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

