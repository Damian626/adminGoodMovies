import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Toaster } from 'ngx-toast-notifications';
import { StreamingEpisodesService } from '../../service/streaming-episodes.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-episodes-edit',
  templateUrl: './episodes-edit.component.html',
  styleUrls: ['./episodes-edit.component.scss']
})
export class EpisodesEditComponent implements OnInit {

  @Input() EPISODE:any;
  @Output() EpisodeE: EventEmitter<any> = new EventEmitter();

  title:string = ''
  state:any = 1;
  description:any = null;
  IMAGEN_FILE:any;
  IMAGEN_PREVISUALIZA:any;

  VIDEO_CONTENIDO:any;
  loading_video:boolean = false;
  link_vimeo_contenido:any = null;
  constructor(
    public modal: NgbActiveModal,
    public toaster: Toaster,
    public episodeService: StreamingEpisodesService,
    public sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.title = this.EPISODE.title;
    this.state = this.EPISODE.state;
    this.description = this.EPISODE.description;
    this.IMAGEN_PREVISUALIZA = this.EPISODE.imagen;
    this.link_vimeo_contenido = this.EPISODE.vimeo_id;
  }

  close(){
    this.modal.close();
  }

  save(){
  
    if(!this.title || !this.description){
      this.toaster.open({text: "NECESITAS INGRESAR TODOS LOS CAMPOS",caption: 'VALIDACIÓN',type: 'danger'});
      return;
    }
    let formData = new FormData();
    if(this.IMAGEN_FILE){
      formData.append("img",this.IMAGEN_FILE);
    }
    formData.append("title",this.title);
    formData.append("description",this.description);
    formData.append("state",this.state);

    this.episodeService.editEpisode(this.EPISODE.id,formData).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open({text: resp.message_text ,caption: 'VALIDACIÓN',type: 'danger'});
      }else{
        this.EpisodeE.emit(resp.episode);
        this.toaster.open({text: "EL EPISODIO SE EDITO CORRECTAMENTE" ,caption: 'VALIDACIÓN',type: 'primary'});
        this.modal.close();
      }
    })
  }

  processFile($event:any){
    if($event.target.files[0].type.indexOf("image") < 0){
      this.toaster.open({text: "EL ARCHIVO NO ES UNA IMAGEN",caption: "MENSAJE DE VALIDACIÓN", type: 'danger'});
      return;
    }
    // 
    this.IMAGEN_FILE = $event.target.files[0];
    let reader = new FileReader();
    reader.readAsDataURL(this.IMAGEN_FILE);
    reader.onloadend = () => this.IMAGEN_PREVISUALIZA = reader.result;
    this.episodeService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.episodeService.isLoadingSubject.next(false);
    }, 50);
  }

  urlGetVideoContenido(){
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.link_vimeo_contenido);
  }

  processFileVideoContenido($event:any) {
    if($event.target.files[0].type.indexOf("video") < 0){
      this.toaster.open({text: "EL ARCHIVO NO ES UN VIDEO",caption: "MENSAJE DE VALIDACIÓN", type: 'danger'});
      return;
    }
    this.VIDEO_CONTENIDO = $event.target.files[0];
  }

  UploadVideoContenido(){
    if(!this.VIDEO_CONTENIDO){
      this.toaster.open({text: "NO HAS SELECCIONADO NINGUN VIDEO",caption: "MENSAJE DE VALIDACIÓN", type: 'danger'});
      return;
    }
    this.loading_video = true;
    let formData = new FormData();
    formData.append("video",this.VIDEO_CONTENIDO);
    this.episodeService.uplooadVideoContenido(this.EPISODE.id,formData).subscribe((resp:any) => {
      console.log(resp);
      this.loading_video = false;
      this.link_vimeo_contenido = null;
      this.episodeService.isLoadingSubject.next(true);
      setTimeout(() => {
        this.episodeService.isLoadingSubject.next(false);
        this.link_vimeo_contenido = resp.vimeo_link;
      }, 50);
    })
  }

}
