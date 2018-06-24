import {Injectable} from '@angular/core';
import {Place} from "../components/places/place";
import {BehaviorSubject, Observable, of} from 'rxjs';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Headers, Http, Response} from "@angular/http";
import {catchError, map} from "rxjs/operators";
import {throwError} from "rxjs/index";

@Injectable({
  providedIn: 'root'
})
export class PlaceService {
  private placesBehavior = new BehaviorSubject<Place[]>([]);
  places = this.placesBehavior.asObservable();

  private favsBehavior = new BehaviorSubject<Place[]>([]);
  favs = this.favsBehavior.asObservable();

  setGooglePlaces(response: object) {
    const placesHold: Place[] = [];
    for (let i in response) {
      const place = new Place();
      place.id = response[i].id;
      place.place_id = response[i].place_id;
      place.name = response[i].name;
      place.rating = response[i].rating;
      place.vicinity = response[i].vicinity;
      place.types = response[i].types;
      place.opening_hours = response[i].opening_hours;
      place.icon = response[i].icon;
      placesHold.push(place);
    }
    this.placesBehavior.next(placesHold);
  }

  getGooglePlaces(): Observable<Place[]> {
    return this.places;
  }

  constructor(private http: Http) {
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred: ', error.error.message);
    } else {
      console.error(`Server returned code ${error.status}, body was : ${error.error} `);
    }
    return throwError('Error Occured.');
  }

  getFavs() {
    let headers = new Headers({'Content-Type': 'application/json'});
    return this.http
    // TODO
    // .post('users/authenticate', user, { headers: headers })
      .get('http://localhost:5000/users/getFavs', {headers: headers})
      .pipe(map((response: Response) => {
        let data = response.json();
        this.assignFavs(data.favorites)
      }), catchError(this.handleError));
  }

  assignFavs(response: object) {
    //console.log(response)
    //response = response.favorites;
    //console.log(response)
    const favesHold: Place[] = [];
    for (let i in response) {
      const place = new Place();
      place.id = response[i].id;
      place.place_id = response[i].place_id;
      place.name = response[i].name;
      place.rating = response[i].rating;
      place.vicinity = response[i].vicinity;
      place.types = response[i].types;
      place.opening_hours = response[i].opening_hours;
      place.icon = response[i].icon;
      favesHold.push(place);
    }
    this.favsBehavior.next(favesHold);
  }

}
