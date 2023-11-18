import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { GenresService } from '../service/genres.service';

@Component({
  selector: 'app-genres-delete',
  templateUrl: './genres-delete.component.html',
  styleUrls: ['./genres-delete.component.scss']
})
export class GenresDeleteComponent implements OnInit {

  @Input() GENRE:any;
  @Output() GenreD: EventEmitter<any> = new EventEmitter();
  
  constructor(
    public modal: NgbActiveModal,
    public toaster: Toaster,
    public genresService: GenresService,
  ) { }

  ngOnInit(): void {
  }

  delete(){
    this.genresService.deleteGenre(this.GENRE.id).subscribe((resp:any) => {
      this.GenreD.emit("");
      this.toaster.open({text: "EL GENERO SE ELIMINO CORRECTAMENTE", type: 'warning'});
      this.close();
    })
  }

  close(){
    this.modal.close();
  }
}
