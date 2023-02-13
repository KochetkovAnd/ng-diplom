import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { Group } from 'src/app/models/group';
import { HttpService } from 'src/app/services/http-service/http.service';

@Component({
  selector: 'app-group-page',
  templateUrl: './group-page.component.html',
  styleUrls: ['./group-page.component.css']
})
export class GroupPageComponent {
  constructor(
    private httpService : HttpService,
    private router: Router
  ) { }

    
  groups: Group[] = []

  async ngOnInit() {
    this.groups = await lastValueFrom(this.httpService.getGroupsByTeacher())
  }

}
