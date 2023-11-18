import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { StreamingService } from '../service/streaming.service';

@Component({
  selector: 'app-streaming-delete',
  templateUrl: './streaming-delete.component.html',
  styleUrls: ['./streaming-delete.component.scss']
})
export class StreamingDeleteComponent implements OnInit {

  @Input() STREAMING:any;
  @Output() StreamingD: EventEmitter<any> = new EventEmitter();
  
  constructor(
    public modal: NgbActiveModal,
    public toaster: Toaster,
    public streamingService: StreamingService,
  ) { }

  ngOnInit(): void {
  }

  delete(){
    this.streamingService.deleteStreaming(this.STREAMING.id).subscribe((resp:any) => {
      this.StreamingD.emit("");
      this.toaster.open({text: "EL STREAMING SE ELIMINO CORRECTAMENTE", type: 'warning'});
      this.close();
    })
  }

  close(){
    this.modal.close();
  }

}
