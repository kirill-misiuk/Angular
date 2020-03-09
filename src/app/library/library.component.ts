import { Component, OnInit } from '@angular/core';
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.css']
})
export class LibraryComponent implements OnInit {
  libraries: any[];
  loading = true;
  error: any;

  constructor(private  apollo: Apollo) {
  }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: gql`
        {
          libraries(params:{}){
            _id
            name
            archive
          }
        }`
    }).valueChanges.subscribe(res => {
      this.libraries = res.data.libraries;
      this.loading = res.loading;
      this.error = res.errors;
    });
  }

  delete(_id: string[]) {
    this.apollo.mutate({
      mutation: gql`
        mutation deleteLibrary($_id: [ID]){
          deleteLibrary(_id: $_id) {
            _id
          }
        }`,
      refetchQueries: [{
        query: gql`
          {
            libraries(params:{}){
              _id
              name
              archive
            }
          }`
      }
    ],
      variables: {
        _id,
      },

    }).subscribe(res => res);
  }
}
