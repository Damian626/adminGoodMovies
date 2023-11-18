import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { TagsService } from '../service/tags.service';

@Component({
  selector: 'app-tags-edit',
  templateUrl: './tags-edit.component.html',
  styleUrls: ['./tags-edit.component.scss']
})
export class TagsEditComponent implements OnInit {

  @Input() TAGS:any;
  @Output() TagsE: EventEmitter<any> = new EventEmitter();

  title:string = ''
  type:string = '1'
  state:any = 1;
  constructor(
    public modal: NgbActiveModal,
    public toaster: Toaster,
    public tagsService: TagsService,
  ) { }

  ngOnInit(): void {
    this.title = this.TAGS.title;
    this.type = this.TAGS.type;
    this.state = this.TAGS.state;
  }

  close(){
    this.modal.close();
  }

  save(){
  
    if(!this.title){
      this.toaster.open({text: "NECESITAS INGRESAR TODOS LOS CAMPOS",caption: 'VALIDACIÓN',type: 'danger'});
      return;
    }
    let data = {
      title: this.title,
      type: this.type,
      state: this.state,
    }
    this.tagsService.editTag(this.TAGS.id,data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open({text: resp.message_text ,caption: 'VALIDACIÓN',type: 'danger'});
      }else{
        this.TagsE.emit(resp.tag);
        this.toaster.open({text: "EL TAG SE EDITO CORRECTAMENTE" ,caption: 'VALIDACIÓN',type: 'primary'});
        this.modal.close();
      }
    })
  }

}
