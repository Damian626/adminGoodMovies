import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { GenresService } from '../service/genres.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';

@Component({
  selector: 'app-genres-add',
  templateUrl: './genres-add.component.html',
  styleUrls: ['./genres-add.component.scss']
})
export class GenresAddComponent implements OnInit {

  @Output() GenreC: EventEmitter<any> = new EventEmitter();

  title:string = ''
  type:string = '1'

  IMAGEN_PREVIZUALIZACION:any = './assets/media/avatars/21.jpg';
  IMAGEN_FILE:any = null;
  constructor(
    public modal: NgbActiveModal,
    public toaster: Toaster,
    public genresService: GenresService,
  ) { }

  ngOnInit(): void {
  }

  close(){
    this.modal.close();
  }

  save(){
  
    if(!this.IMAGEN_FILE || !this.title){
      this.toaster.open({text: "NECESITAS INGRESAR TODOS LOS CAMPOS",caption: 'VALIDACIÓN',type: 'danger'});
      return;
    }
    let formData = new FormData();
    formData.append("img",this.IMAGEN_FILE)
    formData.append("title",this.title);
    formData.append("type",this.type);
    formData.append("state",1+"");
    this.genresService.registerGenre(formData).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open({text: resp.message_text ,caption: 'VALIDACIÓN',type: 'danger'});
      }else{
        this.GenreC.emit(resp.genre);
        this.toaster.open({text: "EL GENERO SE REGISTRO CORRECTAMENTE" ,caption: 'VALIDACIÓN',type: 'primary'});
        this.modal.close();
      }
    })
  }

  processAvatar($event:any){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.toaster.open({text: "EL ARCHIVO NO ES UNA IMAGEN",caption: "MENSAJE DE VALIDACIÓN", type: 'danger'});
      return;
    }
    // 
    this.IMAGEN_FILE = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.IMAGEN_FILE);
    reader.onloadend = () => this.IMAGEN_PREVIZUALIZACION = reader.result;
  }

}
