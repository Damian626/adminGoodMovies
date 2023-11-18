import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { ActorsService } from '../service/actors.service';

@Component({
  selector: 'app-actors-edit',
  templateUrl: './actors-edit.component.html',
  styleUrls: ['./actors-edit.component.scss']
})
export class ActorsEditComponent implements OnInit {

  @Input() ACTOR:any;
  @Output() ActorE: EventEmitter<any> = new EventEmitter();

  full_name:string = ''
  profesion:string = ''
  type:string = '1'
  state:string = '1'

  IMAGEN_PREVIZUALIZACION:any = './assets/media/avatars/300-15.jpg';
  IMAGEN_FILE:any = null;
  constructor(
    public modal: NgbActiveModal,
    public toaster: Toaster,
    public actorService: ActorsService,
  ) { }

  ngOnInit(): void {
    this.full_name = this.ACTOR.full_name;
    this.profesion = this.ACTOR.profesion;
    this.type = this.ACTOR.type;
    this.state = this.ACTOR.state+"";
    this.IMAGEN_PREVIZUALIZACION = this.ACTOR.imagen;
  }

  close(){
    this.modal.close();
  }

  save(){
  
    if(!this.full_name || !this.profesion){
      this.toaster.open({text: "NECESITAS INGRESAR TODOS LOS CAMPOS",caption: 'VALIDACIÓN',type: 'danger'});
      return;
    }
    let formData = new FormData();
    if(this.IMAGEN_FILE){
      formData.append("img",this.IMAGEN_FILE)
    }
    formData.append("full_name",this.full_name);
    formData.append("profesion",this.profesion);
    formData.append("type",this.type);
    formData.append("state",this.state);
    this.actorService.editActor(this.ACTOR.id,formData).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open({text: resp.message_text ,caption: 'VALIDACIÓN',type: 'danger'});
      }else{
        this.ActorE.emit(resp.actor);
        this.toaster.open({text: "EL ACTOR SE EDITO CORRECTAMENTE" ,caption: 'VALIDACIÓN',type: 'primary'});
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
