import { Component } from '@angular/core';
import {DataService} from './app.DataService';
import {Device} from './app.Device';
import {Observable} from 'rxjs/Rx'

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [DataService]
})
export class AppComponent {

  loaded:boolean;
  loadedDevices:Device[] = [];
  selectedDevices:Device[];

  notReviewedDevices:Device[] = [];

  buttonClass:string;

  constructor(private dataService:DataService)
  {
    console.log("A");
    this.loadedDevices = [];
    this.notReviewedDevices = [];
    dataService.getDevices().subscribe(devices => this.gotDevices(devices));

    dataService.getNotReviewedDevices().subscribe(devices => this.gotNewDevices(devices));
    this.selectedDevices = [];
    this.buttonClass = "btn disabled";
    console.log("B");
  }
  title = 'USB-Authorizer Frontend';

  gotDevices(devices:Device[]){

    console.log(devices);
    this.loadedDevices = devices;
    this.loaded = true;

    Observable.timer(0, 2000).map(() => this.dataService.getDevices().subscribe(devices => this.gotDevices(devices)));
  }

  gotNewDevices(devices:Device[]){

    this.notReviewedDevices = devices;
    Observable.timer(2000).map(() => this.dataService.getNotReviewedDevices().subscribe(devices => this.gotNewDevices(devices)));
  }

  Accept(device:Device){
    var index = this.notReviewedDevices.indexOf(device);
    this.notReviewedDevices.splice(index, 1);

    this.loadedDevices.push(device);
    device.valid = true;
    this.dataService.edit(device.USBID, device.Bezeichner, true);
  }

  Reject(device:Device){

    var index = this.notReviewedDevices.indexOf(device);
    this.notReviewedDevices.splice(index, 1);

    this.dataService.deleteDevice(device.USBID);
  }
  selectDevice(device:Device){
    this.selectedDevices.push(device);
  }

  getLoadedDevice(id:string){
    
    let device:Device;

    for(device of this.loadedDevices){
      if(device.USBID === id)
      {
        return device;
      }
    }

    return null;
  }

  boxChanged(event)
  {
    if(event.target.checked)
    {
      console.log(event.target.id);
      this.selectedDevices.push(this.getLoadedDevice(event.target.id));
    }

    else
    {
      var index = this.selectedDevices.indexOf(this.getLoadedDevice(event.target.id));
      this.selectedDevices.splice(index, 1);
    }

    if(this.selectedDevices.length >= 1)
    {
      this.buttonClass = "waves-effect waves-light btn";
    }

    else
    {
      this.buttonClass = "btn disabled";
    }
  }

  removeSelected(){
    for(let device of this.selectedDevices)
    {
      this.loadedDevices.splice(this.loadedDevices.indexOf(device), 1);
      this.dataService.deleteDevice(device.USBID);
    }
  }
  test(){
    alert("Test");
  }
}
