<template>
  <div class="container">
    <button type="button" class="btn btn-primary" @click="getLocation">
      Find my location
    </button>
    {{ locateStatus }}
    <br />
    <br />
    <div class="input-group mb-3">
      <GMapAutocomplete
        class="form-control"
        @keydown.enter.exact.prevent="addMarker()"
        placeholder="Search My Location"
        @place_changed="setPlace"
      >
      </GMapAutocomplete>
      <button type="button" class="btn btn-primary" @click="addMarker">
        Search
      </button>
    </div>
    {{ timeInfo }}
    <GMapMap :center="center" :zoom="12" style="width: 100%; height: 400px">
      <GMapMarker
        :key="index"
        v-for="(m, index) in markers"
        :position="m.position"
        @click="center = m.position"
      />
    </GMapMap>
  </div>
  <br />
  <div class="container">
    <button type="button" class="btn btn-primary" @click="removeSelected">
      Remove Selected Place
    </button>
    <EasyDataTable
      v-model:items-selected="removeItem"
      fixed-checkbox
      :headers="headers"
      :items="places"
      :rows-per-page="10"
      :hide-rows-per-page="true"
    />
  </div>
</template>

<script>
import { GoogleMap, Marker } from 'vue3-google-map';
import type { Header, Item } from 'vue3-easy-data-table';
var moment = require('moment');

export default {
  name: 'Map',
  data() {
    return {
      locateStatus: '',
      center: { lat: 43.65107, lng: -79.347015 },
      markers: [],
      places: [],
      timeInfo: '',
      headers: [{ text: 'Place', value: 'name' }],
      removeItem: [],
    };
  },
  methods: {
    getLocation() {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          let marker = {
            lat: position.coords.latitude + Math.random() / 1000000,
            lng: position.coords.longitude + Math.random() / 1000000,
          };
          this.markers.push({ position: marker });
          this.center = marker;
          this.locateStatus = '';
        },
        (error) => {
          this.locateStatus = error.message;
        }
      );
    },
    setPlace(place) {
      console.log(place);
      this.currentPlace = place;
    },
    addMarker() {
      for (let i = 0; i < this.places.length; i++) {
        if (this.places[i].name == this.currentPlace.name) {
          return;
        }
      }
      if (this.currentPlace) {
        let marker = {
          lat:
            this.currentPlace.geometry.location.lat() + Math.random() / 1000000,
          lng:
            this.currentPlace.geometry.location.lng() + Math.random() / 1000000,
        };
        this.markers.push({ position: marker });
        this.places.push(this.currentPlace);
        this.center = marker;
        let timezone =
          'UTC' +
          (this.currentPlace.utc_offset_minutes > 0 ? '+' : '') +
          ('00' + Math.floor(this.currentPlace.utc_offset_minutes / 60)).slice(
            -2
          ) +
          ':' +
          ('00' + (this.currentPlace.utc_offset_minutes % 60)).slice(-2);
        this.timeInfo =
          'time zone: ' +
          timezone +
          ', local time: ' +
          new moment()
            .utc()
            .add(this.currentPlace.utc_offset_minutes, 'minutes')
            .format();
      }
    },
    removeSelected() {
      for (let i = this.removeItem.length - 1; i >= 0; i--) {
        console.log(i);
        for (let j = 0; j < this.places.length; j++) {
          if (this.removeItem[i].name == this.places[j].name) {
            this.places.splice(j, 1);
            this.markers.splice(j, 1);
            this.removeItem.splice(i, 1);
          }
        }
      }
    },
  },
};
</script>
