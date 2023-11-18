import { Component, OnInit } from '@angular/core';
import { StreamingSeasonsService } from '../../service/streaming-seasons.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Toaster } from 'ngx-toast-notifications';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SeasonsEditComponent } from '../seasons-edit/seasons-edit.component';
import { SeasonsDeleteComponent } from '../seasons-delete/seasons-delete.component';

@Component({
  selector: 'app-seasons',
  templateUrl: './seasons.component.html',
  styleUrls: ['./seasons.component.scss']
})
export class SeasonsComponent implements OnInit {

  title:any = null;
  streaming_id:any;

  isLoading:any;

  SEASONS:any = [];
  constructor(
    public streamingSeason: StreamingSeasonsService,
    public activedRouter: ActivatedRoute,
    public toaster: Toaster,
    public modalService: NgbModal,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.isLoading = this.streamingSeason.isLoading$;
    this.activedRouter.params.subscribe((resp:any) => {
      this.streaming_id = resp.id;
    })
    this.listSeasons();
  }
  listSeasons(){
    this.streamingSeason.listSeasons(this.streaming_id).subscribe((resp:any) => {
      console.log(resp);
      this.SEASONS = resp.seasons;
    })
  }

  save(){
    if(!this.title){
      this.toaster.open({text: 'NECESITAS DIGITAR EL TITULO DE LA TEMPORADA', type: 'danger'});
      return;
    }
    let data = {
      streaming_id: this.streaming_id,
      title: this.title,
    }
    this.streamingSeason.registerSeason(data).subscribe((resp:any) => {
      console.log(resp);
      if(resp.message == 403){
        this.toaster.open({text: resp.message_text, type: 'danger'});
      }else{
        this.toaster.open({text: 'LA TEMPORADA SE REGISTRO EXISTOSAMENTE', type: 'success'});
        this.title = null;
        this.SEASONS.push(resp.season);
      }
    })
  }
  toClases(SEASON:any){
    this.router.navigateByUrl("/streamings/lista/episodes/"+SEASON.id);
  }
  editSection(SEASON:any){
    const modalref = this.modalService.open(SeasonsEditComponent,{centered:true, size: 'md'});
    modalref.componentInstance.SEASON = SEASON;

    // 
    modalref.componentInstance.SeasonE.subscribe((editSeason:any) => {
      let INDEX = this.SEASONS.findIndex((item:any) => item.id == editSeason.id);
      if(INDEX != -1){
        this.SEASONS[INDEX] = editSeason;
      }
    })
  }
  deleteSection(SEASON:any){
    const modalref = this.modalService.open(SeasonsDeleteComponent,{centered:true, size: 'md'});
    modalref.componentInstance.SEASON = SEASON;

    // 
    modalref.componentInstance.SeasonD.subscribe((editSeason:any) => {
      let INDEX = this.SEASONS.findIndex((item:any) => item.id == SEASON.id);
      if(INDEX != -1){
        this.SEASONS.splice(INDEX,1);
      }
    })
  }
}
