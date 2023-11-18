import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { ProductPaypalService } from '../../service/product-paypal.service';

@Component({
  selector: 'app-product-add',
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss']
})
export class ProductAddComponent implements OnInit {

  @Output() ProductC: EventEmitter<any> = new EventEmitter();

  name:string = '';
  type:string = '';
  category:string = '';
  description:string='';
  constructor(
    public modal: NgbActiveModal,
    public toaster: Toaster,
    public productPaypalService: ProductPaypalService,
  ) { }

  ngOnInit(): void {
  }

  close(){
    this.modal.close();
  }

  save(){
    if(!this.name || !this.type || !this.category || !this.description){
      this.toaster.open({text: "NECESITAS COMPLETAR TODOS LOS CAMPOS",caption: "VALIDACIÓN",type: 'danger'});
      return;
    }
    let data = {
      name: this.name,
      type: this.type,
      category: this.category,
      description: this.description,
    }

    this.productPaypalService.registerProduct(data).subscribe((resp:any) => {
      console.log(resp);
      this.ProductC.emit(resp.product);
      this.toaster.open({text: "SE HA CREADO UN PRODUCTO EXITOSAMENTE",caption: "SUCCESS",type:'primary'});
      this.modal.close();
    })
  }
}
