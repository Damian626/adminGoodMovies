import { Component, OnInit } from '@angular/core';
import { Toaster } from 'ngx-toast-notifications';
import { StreamingService } from '../service/streaming.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-streaming-edit',
  templateUrl: './streaming-edit.component.html',
  styleUrls: ['./streaming-edit.component.scss']
})
export class StreamingEditComponent implements OnInit {

  streaming_selected:any = null;
  title:any = '';
  subtitle:any = '';
  description:any = '';

  IMAGEN_FILE:any;
  IMAGEN_PREVISUALIZA:any;
  VIDEO_TRAILER:any;
  VIDEO_CONTENIDO:any;

  genre_id:any;
  tags_selected:any = [];
  actors_selected:any = [];
  type:any = 1;
  state:any = 1;

  TAGS:any = [];
  GENRES:any = [];
  ACTORS:any = [];
  TAGS_BACKUPS:any = [];
  GENRES_BACKUPS:any = [];

  isLoading:any;

  // 
  selected_tag:any;
  selected_actor:any;

  streaming_id:any = null;
  loading_video:boolean = false;
  link_vimeo:any = null;
  link_vimeo_contenido:any = null;
  constructor(
    public streamingService: StreamingService,
    public toaster: Toaster,
    public activedRouter: ActivatedRoute,
    public router: Router,
    public sanitizer: DomSanitizer,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.streamingService.isLoading$;
    this.activedRouter.params.subscribe((resp:any) => {
      console.log(resp);
      this.streaming_id = resp.id;
    })
    this.streamingService.configAll().subscribe((resp:any) => {
      console.log(resp);
      this.TAGS = resp.tags;
      this.GENRES = resp.genres;
      this.ACTORS = resp.actors;
      this.showStreaming();

      this.TAGS_BACKUPS = this.TAGS.filter((item:any) => item.type == this.type);
      this.GENRES_BACKUPS = this.GENRES.filter((item:any) => item.type == this.type);

    })
  }

  showStreaming(){
    this.streamingService.showStreaming(this.streaming_id).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 404){
        this.toaster.open({text: "EL STREAMING NO EXISTE",caption: "MENSAJE DE VALIDACIÓN", type: 'danger'});
        this.router.navigateByUrl("/streamings/lista");
      }else{
        this.streaming_selected = resp.streaming;
        this.title = this.streaming_selected.title;
        this.subtitle = this.streaming_selected.subtitle;
        this.genre_id = this.streaming_selected.genre_id;
        this.description = this.streaming_selected.description;
        this.IMAGEN_PREVISUALIZA = this.streaming_selected.imagen;
        this.type = this.streaming_selected.type;

        this.tags_selected = this.streaming_selected.tags_multiples;
        this.actors_selected = this.streaming_selected.actors;
        this.state = this.streaming_selected.state;
        this.link_vimeo = this.streaming_selected.vimeo_id;
        this.link_vimeo_contenido = this.streaming_selected.vimeo_contenido_id;
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
    this.streamingService.isLoadingSubject.next(true);
    setTimeout(() => {
      this.streamingService.isLoadingSubject.next(false);
    }, 50);
  }

  selectedType(){
    console.log(this.type);
    this.TAGS_BACKUPS = this.TAGS.filter((item:any) => item.type == this.type);
    this.GENRES_BACKUPS = this.GENRES.filter((item:any) => item.type == this.type);
  }
  
  processFileVideo($event:any) {
    if($event.target.files[0].type.indexOf("video") < 0){
      this.toaster.open({text: "EL ARCHIVO NO ES UN VIDEO",caption: "MENSAJE DE VALIDACIÓN", type: 'danger'});
      return;
    }
    this.VIDEO_TRAILER = $event.target.files[0];
  }

  processFileVideoContenido($event:any) {
    if($event.target.files[0].type.indexOf("video") < 0){
      this.toaster.open({text: "EL ARCHIVO NO ES UN VIDEO",caption: "MENSAJE DE VALIDACIÓN", type: 'danger'});
      return;
    }
    this.VIDEO_CONTENIDO = $event.target.files[0];
  }


  addTags(){

    if(this.selected_tag){
      let INDEX = this.tags_selected.findIndex((item:any) => item.id == this.selected_tag);
  
      if(INDEX != -1){
        this.toaster.open({text: 'EL TAG SELECCIONADO YA EXISTE EN LA LISTA',type: 'warning'});
        return;
      }else{
        let TAG_S = this.TAGS.find((item:any) => item.id == this.selected_tag);
        this.tags_selected.unshift(TAG_S);
        this.selected_tag = null;
      }
    }else{
      this.toaster.open({text: 'NECESITAS SELECCIONAR UN TAG',type: 'warning'});
      return;
    }
  }

  deleteTag(i:any){
    this.tags_selected.splice(i,1);
  }
  addActors(){

    if(this.selected_actor){
      let INDEX = this.actors_selected.findIndex((item:any) => item.id == this.selected_actor);
  
      if(INDEX != -1){
        this.toaster.open({text: 'EL ACTOR SELECCIONADO YA EXISTE EN LA LISTA',type: 'warning'});
        return;
      }else{
        let actor_S = this.ACTORS.find((item:any) => item.id == this.selected_actor);
        this.actors_selected.unshift(actor_S);
        this.selected_actor = null;
      }
    }else{
      this.toaster.open({text: 'NECESITAS SELECCIONAR UN ACTOR',type: 'warning'});
      return;
    }
  }

  deleteActor(actors_selec:any){
    let INDEX_ACTOR_SELECTED = this.actors_selected.findIndex((item:any) => item.id == actors_selec.id);
    if(INDEX_ACTOR_SELECTED != -1){
      this.actors_selected.splice(INDEX_ACTOR_SELECTED,1);
    }
  }
  save(){

    if(!this.title || !this.description || !this.genre_id || this.tags_selected.length == 0 || this.actors_selected.length == 0 ||
      !this.subtitle){
        this.toaster.open({text: 'EL OBLIGATORIO LLENAR TODOS LOS CAMPOS',type: 'danger'});
        return;
    }

    let formData = new FormData();
    formData.append("title",this.title);
    formData.append("description",this.description);
    formData.append("genre_id",this.genre_id);
    formData.append("subtitle",this.subtitle);
    formData.append("state",this.state);
    if(this.IMAGEN_FILE){
      formData.append("img",this.IMAGEN_FILE);
    }
    // *
    let TAGSt:any = [];
    this.tags_selected.forEach((tg:any) => {
      TAGSt.push(tg.title);
    });
    // ["SUSPESO","TERROR","COMEDIA"] -> "SUSPESO","TERROR","COMEDIA"
    formData.append("type",this.type);
    formData.append("tags",TAGSt);
    formData.append("actors_selected",JSON.stringify(this.actors_selected));
    // *

    this.streamingService.editStreaming(this.streaming_selected.id,formData).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open({text: resp.message_text, type: 'warning'});
        return;
      }else{
        this.toaster.open({text: "EL STREAMING SE EDITO CORRECTAMENTE", type: 'primary'});
      }
    })
  } 
  urlGetVideo(){
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.link_vimeo);
  }
  urlGetVideoContenido(){
    return this.sanitizer.bypassSecurityTrustResourceUrl(this.link_vimeo_contenido);
  }
  UploadVideo(){
    if(!this.VIDEO_TRAILER){
      this.toaster.open({text: "NO HAS SELECCIONADO NINGUN VIDEO",caption: "MENSAJE DE VALIDACIÓN", type: 'danger'});
      return;
    }
    this.loading_video = true;
    let formData = new FormData();
    formData.append("video",this.VIDEO_TRAILER);
    this.streamingService.uplooadVideoTrailer(this.streaming_selected.id,formData).subscribe((resp:any) => {
      console.log(resp);
      this.loading_video = false;
      this.link_vimeo = null;
      this.streamingService.isLoadingSubject.next(true);
      setTimeout(() => {
        this.streamingService.isLoadingSubject.next(false);
        this.link_vimeo = resp.vimeo_link;
      }, 50);
    })
  }
  
  UploadVideoContenido(){
    if(!this.VIDEO_CONTENIDO){
      this.toaster.open({text: "NO HAS SELECCIONADO NINGUN VIDEO",caption: "MENSAJE DE VALIDACIÓN", type: 'danger'});
      return;
    }
    this.loading_video = true;
    let formData = new FormData();
    formData.append("video",this.VIDEO_CONTENIDO);
    this.streamingService.uplooadVideoContenido(this.streaming_selected.id,formData).subscribe((resp:any) => {
      console.log(resp);
      this.loading_video = false;
      this.link_vimeo_contenido = null;
      this.streamingService.isLoadingSubject.next(true);
      setTimeout(() => {
        this.streamingService.isLoadingSubject.next(false);
        this.link_vimeo_contenido = resp.vimeo_link;
      }, 50);
    })
  }
}
