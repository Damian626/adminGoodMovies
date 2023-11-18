import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'builder',
    loadChildren: () =>
      import('./builder/builder.module').then((m) => m.BuilderModule),
  },
  {
    path: 'crafted/pages/profile',
    loadChildren: () =>
      import('../modules/profile/profile.module').then((m) => m.ProfileModule),
  },
  {
    path: 'crafted/account',
    loadChildren: () =>
      import('../modules/account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'crafted/pages/wizards',
    loadChildren: () =>
      import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
  },
  {
    path: 'crafted/widgets',
    loadChildren: () =>
      import('../modules/widgets-examples/widgets-examples.module').then(
        (m) => m.WidgetsExamplesModule
      ),
  },
  {
    path: 'apps/chat',
    loadChildren: () =>
      import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
  },
  // MIS MODULOS
  {
    path: 'usuarios',
    loadChildren: () =>
      import('../modules/users/users.module').then((m) => m.UsersModule),
  },
  {
    path: 'planes-y-productos',
    loadChildren: () =>
      import('../modules/product-plans/product-plans.module').then((m) => m.ProductPlansModule),
  },
  {
    path: 'generos',
    loadChildren: () =>
      import('../modules/genres/genres.module').then((m) => m.GenresModule),
  },
  {
    path: 'actors',
    loadChildren: () =>
      import('../modules/actors/actors.module').then((m) => m.ActorsModule),
  },
  {
    path: 'tags',
    loadChildren: () =>
      import('../modules/tags/tags.module').then((m) => m.TagsModule),
  },
  {
    path: 'streamings',
    loadChildren: () =>
      import('../modules/streaming/streaming.module').then((m) => m.StreamingModule),
  },
  {
    path: 'usuariossub',
    loadChildren: () =>
      import('../modules/usuarios/usuarios.module').then((m) => m.UsuariosModule),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
