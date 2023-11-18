import { Component, OnInit } from '@angular/core';
import { UsuariosService } from '../service/usuarios.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-usuarios-list',
  templateUrl: './usuarios-list.component.html',
  styleUrls: ['./usuarios-list.component.scss']
})
export class UsuariosListComponent implements OnInit {

  search:any = null;
  state:any = null;

  USUARIOS:any = [];

  isLoading:any;
  constructor(
    public modalService: NgbModal,
    public usuariosService: UsuariosService,
  ) { }

  ngOnInit(): void {
    console.log('Iniciando el componente UsuariosListComponent');
    this.configAll();
    this.isLoading = this.usuariosService.isLoading$;
  }
  getType(type_plan:any){
    let value = "";
    type_plan = parseInt(type_plan);
    switch (type_plan) {
      case 1:
        value = "Mensual";
        break;
      case 2:
        value = "Anual";
        break;
      default:
        break;
    }
    return value;
  }

listSubcription() {
  this.usuariosService.listSubcription(this.search, this.state).subscribe((resp: any) => {
    console.log(resp);
    if (resp && resp.subscriptions && resp.users && resp.users.length > 0) {
      // Mapea el user_id al nombre del usuario
      this.USUARIOS = resp.subscriptions.map((subscription: any) => {
        const user = resp.users.find((u: any) => u.id === subscription.user_id);
        return {
          ...subscription,
          user_name: user ? user.name : 'Nombre no encontrado',
        };
      });
    } else {
      console.error('La respuesta del servicio es nula o no contiene la propiedad "subscriptions" o .', resp);
    }
  });
}

configAll() {
  this.usuariosService.configAll().subscribe((resp: any) => {
    console.log(resp);
    if (resp && resp.subscriptions) {
      this.USUARIOS = resp.subscriptions;
    } else {
      console.error('La respuesta del servicio es nula o no contiene la propiedad "subscriptions".', resp);
    }
  });
}


}
