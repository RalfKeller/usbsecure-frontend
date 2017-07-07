import { Http, Response, Headers, URLSearchParams }           from '@angular/http';
import {Device}                     from './app.Device';
import { Injectable }               from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/throw';
//import 'rxjs/Rx';  // use this line if you want to be lazy, otherwise:
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/do';  // debug
import 'rxjs/add/operator/catch';

@Injectable()
export class DataService {

    constructor(private http:Http){
    }

    getDevices() : Observable<Device[]>
    {
        return this.http.get("http://192.168.179.36:8080/Resty/rest/geraet/valid").map(this.extractData).catch(this.handleError);
        //let devices = [{name:"Device 1", typ:"Tastatur", reviewed:true}, {name:"Device 2", typ:"Maus", reviewed:true}];
        //return devices;
    }

    deleteDevice(id:string){
        let header = new Headers();
        header.append("Content-type", "application/x-www-form-urlencoded");
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('USBID', id);
        let body = urlSearchParams.toString()

        console.log("DELETE");
        console.log(body);
        this.http.post("http://192.168.179.36:8080/Resty/rest/geraet/remove", body, {headers: header}).subscribe(res => console.log(res));
        console.log("DONE");
    }

    edit(id:string, bezeichner:string, valid:boolean){
        let header = new Headers();
        header.append("Content-type", "application/x-www-form-urlencoded");
        let urlSearchParams = new URLSearchParams();
        urlSearchParams.append('USBID', id);
        urlSearchParams.append('Bezeichner', bezeichner);
        urlSearchParams.append('valid', valid?'1':'0');
        let body = urlSearchParams.toString()

        console.log(body);
        this.http.post("http://192.168.179.36:8080/Resty/rest/geraet", body, {headers: header}).subscribe(res => console.log(res));
    }

    extractData(res:Response) {
        console.log("EXTRACTED" + res.json());
        return res.json().data;
    }

    handleError(res:Response | any) {
        console.log("ERROR");
        console.log(res.message);
        return Observable.throw("Error");
    }

    getNotReviewedDevices(): Observable<Device[]> {
        return this.http.get("http://192.168.179.36:8080/Resty/rest/geraet/invalid").map(this.extractData).catch(this.handleError);
    }
  }