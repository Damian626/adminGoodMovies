import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { StreamingSeasonsService } from '../../service/streaming-seasons.service';

@Component({
  selector: 'app-seasons-edit',
  templateUrl: './seasons-edit.component.html',
  styleUrls: ['./seasons-edit.component.scss']
})
export class SeasonsEditComponent implements OnInit {

  @Input() SEASON:any;
  @Output() SeasonE: EventEmitter<any> = new EventEmitter();

  title:string = ''
  state:any = 1;
  constructor(
    public modal: NgbActiveModal,
    public toaster: Toaster,
    public seasonService: StreamingSeasonsService,
  ) { }

  ngOnInit(): void {
    this.title = this.SEASON.title;
    this.state = this.SEASON.state;
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
      state: this.state,
    }
    this.seasonService.editSeason(this.SEASON.id,data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open({text: resp.message_text ,caption: 'VALIDACIÓN',type: 'danger'});
      }else{
        this.SeasonE.emit(resp.season);
        this.toaster.open({text: "EL SEASON SE EDITO CORRECTAMENTE" ,caption: 'VALIDACIÓN',type: 'primary'});
        this.modal.close();
      }
    })
  }

}
