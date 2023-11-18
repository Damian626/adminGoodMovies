import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { PlanesPaypalService } from '../../service/planes-paypal.service';

@Component({
  selector: 'app-planes-edit',
  templateUrl: './planes-edit.component.html',
  styleUrls: ['./planes-edit.component.scss']
})
export class PlanesEditComponent implements OnInit {

  @Input() plane_selected:any;
  @Input() PRODUCTS:any = [];
  @Output() PlanE: EventEmitter<any> = new EventEmitter();

  name:string = '';
  description:string='';
  precio_mensual: number = 0;
  precio_anual: number = 0;
  month_free: number = 0;
  product_paypal_id:any = 0;
  constructor(
    public modal: NgbActiveModal,
    public toaster: Toaster,
    public planePaypalService: PlanesPaypalService,
  ) { }

  ngOnInit(): void {
    this.name = this.plane_selected.name;
    this.description = this.plane_selected.description;
    this.precio_mensual = this.plane_selected.precio_mensual;
    this.precio_anual = this.plane_selected.precio_anual;
    this.month_free = this.plane_selected.month_free;
    this.product_paypal_id = this.plane_selected.product_paypal_id;
    
    console.log(this.precio_mensual,this.precio_anual);
  }

  close(){
    this.modal.close();
  }

  save(){
    if(!this.name || !this.description || !this.product_paypal_id 
      || !this.precio_mensual || !this.precio_anual){
      this.toaster.open({text: "NECESITAS COMPLETAR TODOS LOS CAMPOS",caption: "VALIDACIÓN",type: 'danger'});
      return;
    }

    let id_product_paypal = this.PRODUCTS.find((item:any) => item.id == this.product_paypal_id).id_product_paypal
    let data = {
      name: this.name,
      description: this.description,
      precio_mensual: this.precio_mensual,
      precio_anual: this.precio_anual,
      month_free: this.month_free,
      product_paypal_id: this.product_paypal_id,
      id_product_paypal: id_product_paypal,
    }

    this.planePaypalService.editPlane(this.plane_selected.id,data).subscribe((resp:any) => {
      console.log(resp);
      this.PlanE.emit(resp.plan);
      this.toaster.open({text: "SE HA EDITADO EL PLAN EXITOSAMENTE",caption: "SUCCESS",type:'primary'});
      this.modal.close();
    })
  }

}
