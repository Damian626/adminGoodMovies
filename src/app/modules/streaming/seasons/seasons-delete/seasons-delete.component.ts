import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { StreamingSeasonsService } from '../../service/streaming-seasons.service';

@Component({
  selector: 'app-seasons-delete',
  templateUrl: './seasons-delete.component.html',
  styleUrls: ['./seasons-delete.component.scss']
})
export class SeasonsDeleteComponent implements OnInit {

  @Input() SEASON:any;
  @Output() SeasonD: EventEmitter<any> = new EventEmitter();
  
  constructor(
    public modal: NgbActiveModal,
    public toaster: Toaster,
    public streamingSeason: StreamingSeasonsService,
  ) { }

  ngOnInit(): void {
  }

  delete(){
    this.streamingSeason.deleteSeason(this.SEASON.id).subscribe((resp:any) => {
      this.SeasonD.emit("");
      this.toaster.open({text: "EL SEASON SE ELIMINO CORRECTAMENTE", type: 'warning'});
      this.close();
    })
  }

  close(){
    this.modal.close();
  }

}
