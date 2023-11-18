import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { TagsService } from '../service/tags.service';

@Component({
  selector: 'app-tags-delete',
  templateUrl: './tags-delete.component.html',
  styleUrls: ['./tags-delete.component.scss']
})
export class TagsDeleteComponent implements OnInit {

  @Input() TAGS:any;
  @Output() TagsD: EventEmitter<any> = new EventEmitter();
  
  constructor(
    public modal: NgbActiveModal,
    public toaster: Toaster,
    public tagsService: TagsService,
  ) { }

  ngOnInit(): void {
  }

  delete(){
    this.tagsService.deleteTag(this.TAGS.id).subscribe((resp:any) => {
      this.TagsD.emit("");
      this.toaster.open({text: "EL TAG SE ELIMINO CORRECTAMENTE", type: 'warning'});
      this.close();
    })
  }

  close(){
    this.modal.close();
  }

}
